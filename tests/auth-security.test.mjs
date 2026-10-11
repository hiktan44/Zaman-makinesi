import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createClient } from '@supabase/supabase-js';

const require = createRequire(import.meta.url);
const createdClients = [];
const publicKey = 'sb_publishable_fictional_test_key_no_privileges';
const configured = {VITE_SUPABASE_URL: 'https://fixture.supabase.invalid', VITE_SUPABASE_PUBLISHABLE_KEY: publicKey};
const owner = {id: 'fixture-owner', email: 'member@fixture.invalid', app_metadata: {}, user_metadata: {},
  aud: 'authenticated', created_at: '2026-10-11T00:00:00Z'};
const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
const jwt = `${encode({alg:'HS256',typ:'JWT'})}.${encode({sub:owner.id,role:'authenticated',exp:Math.floor(Date.now()/1000)+3600})}.fictional_signature`;
const session = {access_token: jwt, refresh_token: 'fictional-refresh', token_type: 'bearer', expires_in:3600,
  expires_at:Math.floor(Date.now()/1000)+3600, user: {...owner,email:'admin@zamanmakinesi.app'}};

function storage(seed = {}) {
  const data = new Map(Object.entries(seed));
  const writes = [];
  return {data,writes,getItem:key=>data.get(key) ?? null,
    setItem:(key,value)=>{writes.push(key);data.set(key,value);},removeItem:key=>data.delete(key)};
}
function loadTs(file, {env={}, dependencies={}, local=storage(), window={}, globals={}} = {}) {
  const source = readFileSync(new URL('../'+file, import.meta.url), 'utf8').replaceAll('import.meta.env','__fixtureEnv');
  const compiled = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,
    target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  const module = {exports:{}};
  const context = vm.createContext({module,exports:module.exports,__fixtureEnv:env,
    require:name=>Object.hasOwn(dependencies,name)?dependencies[name]:require(name),
    localStorage:local,window:{location:{origin:'https://app.fixture.invalid'},...window},
    URL,atob,setTimeout,clearTimeout,...globals});
  vm.runInContext(compiled,context,{filename:file});
  return module.exports;
}
const configModule = loadTs('services/auth-config.ts');
const observer = loadTs('services/auth-session.ts').observeVerifiedAuth;
function service(env, {local=storage(),sdkFactory=()=>{throw Error('Beklenmeyen SDK oluşturma');}} = {}) {
  return loadTs('services/supabaseService.ts', {env,local,dependencies:{
    './auth-config':configModule,'@supabase/supabase-js':{createClient:sdkFactory},
  }});
}
function sdkFixture({status=200,body={...session,user:owner},persisted,userStatus=200,userBody=owner}={}) {
  const calls=[];
  const sdkStorage=storage(persisted?{'fixture-session':JSON.stringify(persisted)}:{});
  const sdkFactory=(url,key,options)=>{
    const client=createClient(url,key,{...options,auth:{...options.auth,storage:sdkStorage,storageKey:'fixture-session',autoRefreshToken:false},
      global:{fetch:async(input,init={})=>{
        const target=new URL(input);
        assert.equal(target.origin,'https://fixture.supabase.invalid');
        calls.push({url:target,method:init.method,body:init.body,headers:init.headers});
        const isUser=target.pathname.endsWith('/user');
        return new Response(JSON.stringify(isUser?userBody:body), {status:isUser?userStatus:status,headers:{'Content-Type':'application/json'}});
      }}});
    createdClients.push(client);
    const original=client.auth.signInWithOAuth.bind(client.auth);
    client.auth.signInWithOAuth=async args=>{const result=await original(args);calls.push({oauth:args,result});return result;};
    return client;
  };
  return {api:service(configured,{sdkFactory}),calls,sdkStorage};
}
after(async()=>{for(const client of createdClients)await client.auth.stopAutoRefresh();});
const wait=()=>new Promise(resolve=>setTimeout(resolve,15));
const settle=async()=>{await wait();await wait();};
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};

const invalidConfigs=[
  ['eksik',{}],['yalnız URL',{VITE_SUPABASE_URL:configured.VITE_SUPABASE_URL}],
  ['yanlış URL',{...configured,VITE_SUPABASE_URL:'http-invalid'}],
  ['javascript URL',{...configured,VITE_SUPABASE_URL:'javascript:alert(1)'}],
  ['URL kullanıcı bilgisi',{...configured,VITE_SUPABASE_URL:'https://owner:password@fixture.invalid'}],
  ['URL sorgu',{...configured,VITE_SUPABASE_URL:'https://fixture.invalid?key=fictional'}],
  ['yer tutucu',{...configured,VITE_SUPABASE_PUBLISHABLE_KEY:'placeholder-anon-key'}],
  ['secret anahtar',{...configured,VITE_SUPABASE_PUBLISHABLE_KEY:'sb_secret_fictional_private_key'}],
  ['service_role JWT',{VITE_SUPABASE_URL:configured.VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY:`e30.${encode({role:'service_role'})}.fictional`}],
  ['kullanıcı JWT',{VITE_SUPABASE_URL:configured.VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY:jwt}],
];
for(const [name,env]of invalidConfigs){
  test(`yapılandırma ${name}: e-posta, kayıt ve Google sahte kullanıcı açamaz`,async()=>{
    const local=storage({zm_local_user:JSON.stringify({id:'forged',email:'admin@zamanmakinesi.app'}),other_preference:'keep'});
    const api=service(env,{local});
    assert.equal(api.isSupabaseConfigured,false);
    assert.equal(api.supabase,null);
    for(const action of [api.signInWithEmail,api.signUpWithEmail]){
      const result=await action('admin@zamanmakinesi.app','arbitrary-password');
      assert.equal(result.user,null);
      assert.match(result.error.message,/Giriş şu anda kullanılamıyor/);
    }
    await assert.rejects(api.signInWithGoogle(),/Giriş şu anda kullanılamıyor/);
    await api.logOut();
    assert.equal(local.data.has('zm_local_user'),false);
    assert.equal(local.data.get('other_preference'),'keep');
    assert.deepEqual(local.writes,[]);
  });
}

test('publishable ve eski anon anahtarları kabul edilir; özel anahtar önceliği yanlış ayarı gizlemez',()=>{
  assert.equal(configModule.browserAuthConfig(configured).key,publicKey);
  const anon=`e30.${encode({role:'anon'})}.fictional`;
  assert.equal(configModule.browserAuthConfig({VITE_SUPABASE_URL:'http://localhost:54321',VITE_SUPABASE_ANON_KEY:anon}).key,anon);
  assert.equal(configModule.browserAuthConfig({...configured,VITE_SUPABASE_PUBLISHABLE_KEY:'sb_secret_invalid',VITE_SUPABASE_ANON_KEY:anon}),null);
});

test('gerçek Supabase SDK yanlış parolayı Türkçe hata olarak döndürür',async()=>{
  const fixture=sdkFixture({status:400,body:{message:'Invalid login credentials',code:'invalid_credentials'}});
  const result=await fixture.api.signInWithEmail(owner.email,'fictional-wrong-password');
  assert.equal(result.user,null);
  assert.equal(result.error.message,'E-posta adresi veya şifre hatalı.');
  assert.ok(fixture.calls.some(call=>call.url?.searchParams.get('grant_type')==='password'));
});

test('gerçek SDK parola girişinde sunucu cevabını kullanır; yerel demo kaydı yazmaz',async()=>{
  const fixture=sdkFixture();
  const result=await fixture.api.signInWithEmail(owner.email,'fictional-password');
  assert.equal(result.error,null);
  assert.equal(result.user.id,owner.id);
  const passwordRequest=fixture.calls.find(call=>call.url?.pathname.endsWith('/token'));
  assert.equal(JSON.parse(passwordRequest.body).password,'fictional-password');
  assert.equal(fixture.sdkStorage.data.has('zm_local_user'),false);
});

test('SDK kayıt cevabında oturum yoksa e-posta doğrulaması beklenir',async()=>{
  const fixture=sdkFixture({body:owner});
  const result=await fixture.api.signUpWithEmail(owner.email,'fictional-password');
  assert.equal(result.error,null);
  assert.equal(result.requiresEmailConfirmation,true);
  assert.ok(fixture.calls.some(call=>call.url?.pathname.endsWith('/signup')));
});

test('gerçek SDK Google giriş isteği doğru sağlayıcı ve dönüş adresini kullanır',async()=>{
  const fixture=sdkFixture();
  await fixture.api.signInWithGoogle();
  const call=fixture.calls.find(call=>call.oauth);
  assert.equal(call.oauth.provider,'google');
  assert.equal(call.oauth.options.redirectTo,'https://app.fixture.invalid');
  const target=new URL(call.result.data.url);
  assert.equal(target.searchParams.get('provider'),'google');
  assert.equal(target.searchParams.get('redirect_to'),'https://app.fixture.invalid');
});

function stateFixture(getUser=async()=>({data:{user:owner},error:null})){
  let callback,unsubscribed=false;
  const states=[];
  const client={auth:{getUser,onAuthStateChange:fn=>{
    callback=fn;
    return {data:{subscription:{unsubscribe:()=>{unsubscribed=true;}}}};
  }}};
  const cleanup=observer(client,state=>states.push(state));
  return {emit:(event,value)=>callback(event,value),states,cleanup,
    latest:()=>states.at(-1),unsubscribed:()=>unsubscribed};
}

test('yapılandırma yoksa gözlemci kullanıcı ve yönetici kimliği yayımlamaz',()=>{
  const states=[];
  const cleanup=observer(null,state=>states.push(state));
  assert.equal(states[0].user,null);
  assert.equal(states[0].session,null);
  assert.equal(states[0].loading,false);
  cleanup();
});

test('oturumdaki sahte yönetici e-postası gerçek SDK getUser cevabıyla değiştirilir',async()=>{
  const fixture=sdkFixture({persisted:session});
  const states=[];
  const cleanup=observer(fixture.api.supabase,state=>states.push(state));
  for(let i=0;i<10&&!states.at(-1)?.user;i++)await wait();
  assert.equal(states.at(-1).user.email,owner.email);
  assert.equal(states.at(-1).session.user.email,owner.email);
  assert.ok(fixture.calls.some(call=>call.url?.pathname.endsWith('/user')));
  cleanup();
});

test('gerçek SDK getUser 401 cevabı yerel oturumu kullanıcıya dönüştürmez',async()=>{
  const fixture=sdkFixture({persisted:session,userStatus:401,userBody:{message:'fictional invalid token',code:'bad_jwt'}});
  const states=[];
  const cleanup=observer(fixture.api.supabase,state=>states.push(state));
  await settle();
  assert.equal(states.at(-1).user,null);
  assert.equal(states.at(-1).session,null);
  assert.equal(states.at(-1).loading,false);
  assert.ok(fixture.calls.some(call=>call.url?.pathname.endsWith('/user')));
  cleanup();
});

test('gerçek SDK çıkış olayı doğrulanmış kimliği ve oturum kaydını temizler',async()=>{
  const fixture=sdkFixture({persisted:session});
  const states=[];
  const cleanup=observer(fixture.api.supabase,state=>states.push(state));
  for(let i=0;i<10&&!states.at(-1)?.user;i++)await wait();
  assert.equal(states.at(-1).user.id,owner.id);
  await fixture.api.logOut();await settle();
  assert.equal(states.at(-1).user,null);
  assert.equal(states.at(-1).session,null);
  assert.equal(fixture.sdkStorage.data.has('fixture-session'),false);
  assert.ok(fixture.calls.some(call=>call.url?.pathname.endsWith('/logout')));
  cleanup();
});

for(const [name,result]of [['hata',{data:{user:null},error:{message:'invalid'}}],
  ['başka kullanıcı',{data:{user:{...owner,id:'another-user'}},error:null}],
  ['kullanıcı yok',{data:{user:null},error:null}]]){
  test(`uzak oturum doğrulaması ${name}: yerel oturum kimlik sağlamaz`,async()=>{
    const fixture=stateFixture(async()=>result);
    fixture.emit('SIGNED_IN',session);
    assert.equal(fixture.latest().user,null);
    await settle();
    assert.equal(fixture.latest().user,null);
    assert.equal(fixture.latest().loading,false);
    fixture.cleanup();
  });
}

test('doğrulamada ağ istisnası giriş durumunu kapalı tutar',async()=>{
  const fixture=stateFixture(async()=>{throw Error('fictional offline');});
  fixture.emit('SIGNED_IN',session);await settle();
  assert.equal(fixture.latest().user,null);
  assert.equal(fixture.latest().loading,false);
  fixture.cleanup();
});

test('çıkıştan sonra geç gelen doğrulama kullanıcıyı geri getiremez',async()=>{
  const pending=deferred();
  const fixture=stateFixture(()=>pending.promise);
  fixture.emit('SIGNED_IN',session);await wait();
  fixture.emit('SIGNED_OUT',null);
  pending.resolve({data:{user:owner},error:null});await settle();
  assert.equal(fixture.latest().user,null);
  assert.equal(fixture.latest().loading,false);
  fixture.cleanup();
});

test('yeni oturum eski geciken doğrulamadan etkilenmez',async()=>{
  const pending=deferred(),other={...owner,id:'second-user',email:'second@fixture.invalid'};
  const fixture=stateFixture(token=>token===session.access_token?pending.promise:Promise.resolve({data:{user:other},error:null}));
  fixture.emit('SIGNED_IN',session);await wait();
  fixture.emit('SIGNED_IN',{...session,access_token:'fictional-second-token',user:other});await settle();
  assert.equal(fixture.latest().user.id,other.id);
  pending.resolve({data:{user:owner},error:null});await settle();
  assert.equal(fixture.latest().user.id,other.id);
  fixture.cleanup();
});

test('kapanan gözlemcinin bekleyen cevabı ve callback aboneliği temizlenir',async()=>{
  const pending=deferred();
  const fixture=stateFixture(()=>pending.promise);
  fixture.emit('SIGNED_IN',session);await wait();
  fixture.cleanup();const count=fixture.states.length;
  pending.resolve({data:{user:owner},error:null});await settle();
  fixture.emit('SIGNED_IN',session);await settle();
  assert.equal(fixture.states.length,count);
  assert.equal(fixture.unsubscribed(),true);
});

for(const enabled of [false,true]){
  test(`gerçek React ilk çıktısı sahte yerel yönetici kaydını kabul etmez (yapılandırma: ${enabled})`,()=>{
    const local=storage({zm_local_user:JSON.stringify({id:'forged',email:'admin@zamanmakinesi.app'})});
    const context=loadTs('contexts/AuthContext.tsx',{local,dependencies:{
      '../services/supabaseService':{supabase:null,isSupabaseConfigured:enabled,logOut:async()=>{}},
      '../services/auth-session':{observeVerifiedAuth:observer},
      '../lib/adminStore':{checkIsAdmin:email=>email==='admin@zamanmakinesi.app'},
    }});
    function Status(){const state=context.useAuth();return React.createElement('span',null,
      JSON.stringify({authenticated:state.isAuthenticated,admin:state.isAdmin,user:state.user}));}
    const html=renderToStaticMarkup(React.createElement(context.AuthProvider,null,React.createElement(Status)));
    assert.ok(html.includes('&quot;authenticated&quot;:false'));
    assert.ok(html.includes('&quot;admin&quot;:false'));
    assert.ok(html.includes('&quot;user&quot;:null'));
  });
}

test('gerçek React giriş ekranı yapılandırma yokken Türkçe uyarı ve kapalı giriş düğmeleri gösterir',()=>{
  const modal=loadTs('components/AuthModal.tsx',{dependencies:{
    '../services/supabaseService':{isSupabaseConfigured:false},
    '../lib/useT':{useT:()=>({t:key=>key})},
  }}).default;
  const html=renderToStaticMarkup(React.createElement(modal,{isOpen:true,onClose(){}}));
  assert.ok(html.includes('Giriş şu anda kullanılamıyor.'));
  assert.ok(html.includes('role="alert"'));
  assert.equal((html.match(/disabled=""/g)||[]).length,2);
});
