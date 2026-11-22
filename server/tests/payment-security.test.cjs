const { test, before, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const fixtureUrl = new URL(process.env.DATABASE_URL || 'postgres://invalid');
if (process.env.CODEX_ZAMAN_TEST_ALLOW !== '1' || !['127.0.0.1', 'localhost', '[::1]'].includes(fixtureUrl.hostname) ||
    !/^\/codex_zaman_[a-z0-9_]+$/.test(fixtureUrl.pathname) || fixtureUrl.searchParams.get('sslmode') !== 'disable' ||
    process.env.JWT_SECRET !== 'codex-fictional-zaman-jwt-secret' ||
    process.env.STRIPE_SECRET_KEY !== 'sk_test_codex_zaman_fictional') {
  throw new Error('Doğrudan test çağrısı da yalnız kurgusal yerel ortamda çalışabilir; güvenli runner kullanın');
}
const net = require('node:net');
const socketConnect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function (...args) {
  const options = net._normalizeArgs(args)[0];
  if (options.path || (options.host && !['127.0.0.1', 'localhost', '::1'].includes(options.host))) {
    throw new Error('Test sırasında dış soket bağlantısı yasak');
  }
  return socketConnect.apply(this, args);
};
const fetchReal = global.fetch;
global.fetch = (url, ...rest) => {
  if (String(url) === 'https://www.tcmb.gov.tr/kurlar/today.xml') {
    return Promise.resolve(new Response('<Tarih_Date><Currency Kod="EUR"><ForexBuying>50.00</ForexBuying></Currency></Tarih_Date>'));
  }
  if (!['127.0.0.1', 'localhost', '[::1]'].includes(new URL(url).hostname)) throw new Error('Dış fetch yasak');
  return fetchReal(url, ...rest);
};
const Stripe = require('stripe');
const requests = [];
let failProvider = false;
class FakeResponse extends Stripe.HttpClientResponse {
  constructor(data) { super(200, { 'content-type': 'application/json' }); this.data = data; }
  getRawResponse() { return this; }
  async toJSON() { return this.data; }
}
class FakeStripeHttp extends Stripe.HttpClient {
  getClientName() { return 'codex-fictional-no-network'; }
  async makeRequest(host, port, url, method, headers, body) {
    if (host !== 'api.stripe.com' || url !== '/v1/checkout/sessions' || method !== 'POST') throw new Error('Bilinmeyen kurgusal ödeme isteği');
    if (failProvider) throw new Error('Kurgusal sağlayıcı hatası');
    const form = new URLSearchParams(body);
    requests.push({ form, headers });
    return new FakeResponse({ id: `cs_test_fixture_${requests.length}`, object: 'checkout.session',
      url: `https://checkout.stripe.com/c/pay/cs_test_fixture_${requests.length}` });
  }
}
const { NodeHttpClient } = require(path.join(path.dirname(require.resolve('stripe')), 'net/NodeHttpClient.js'));
NodeHttpClient.prototype.makeRequest = FakeStripeHttp.prototype.makeRequest;
NodeHttpClient.prototype.getClientName = FakeStripeHttp.prototype.getClientName;
const sdk = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../src/config/database').default;
const { webhookRouter, default: paymentRoutes } = require('../src/routes/paymentRoutes');
const { authenticateToken } = require('../src/middleware/authMiddleware');
const { useCredit } = require('../src/controllers/creditController');
const migration = readFileSync(path.join(__dirname, '../sql/payment-credit-transition.sql'), 'utf8');
let server, origin;
const baseDDL = `
DROP SCHEMA public CASCADE; CREATE SCHEMA public;
CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, google_id VARCHAR(255),
 is_admin BOOLEAN DEFAULT false, credits INTEGER DEFAULT 10, created_at TIMESTAMP DEFAULT now());
CREATE TABLE credit_packages (id SERIAL PRIMARY KEY, credits INTEGER NOT NULL, price_try DECIMAL(10,2) NOT NULL,
 is_active BOOLEAN DEFAULT true);
CREATE TABLE payments (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), package_id INTEGER REFERENCES credit_packages(id),
 amount_eur DECIMAL(10,2), amount_try DECIMAL(10,2) NOT NULL, stripe_payment_intent_id VARCHAR(255) UNIQUE,
 status VARCHAR(50) DEFAULT 'pending', created_at TIMESTAMP DEFAULT now());
CREATE TABLE user_activities (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), action_type VARCHAR(50) NOT NULL,
 credits_used INTEGER DEFAULT 0, description TEXT, metadata JSONB, created_at TIMESTAMP DEFAULT now());
INSERT INTO users(email, credits) VALUES ('fixture-one@example.invalid', 0), ('fixture-two@example.invalid', 0);
INSERT INTO credit_packages(credits, price_try) VALUES (10, 500);`;
async function reset(apply = true) {
  await pool.query(baseDDL);
  if (apply && process.env.ZAMAN_BASELINE !== '1') await pool.query(migration);
  else if (apply) {
    await pool.query(`ALTER TABLE payments ADD COLUMN fulfillment_version INTEGER DEFAULT 1,
      ADD COLUMN credits_snapshot INTEGER, ADD COLUMN amount_eur_cents BIGINT, ADD COLUMN currency TEXT,
      ADD COLUMN checkout_binding TEXT, ADD COLUMN stripe_session_id TEXT;
      CREATE TABLE payment_credit_receipts(payment_id INTEGER, stripe_session_id TEXT, event_id TEXT,
      user_id INTEGER, credits INTEGER);
      CREATE TABLE payment_financial_transition(key TEXT PRIMARY KEY);
      INSERT INTO payment_financial_transition VALUES ('checkout-credits-v2')`);
  }
  requests.length = 0; failProvider = false;
}
function token(id = 1) { return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '5m' }); }
async function api(url, options = {}, id = 1) {
  const result = await fetch(origin + url, { ...options, headers: { 'content-type': 'application/json',
    ...(id ? { authorization: `Bearer ${token(id)}` } : {}), ...options.headers } });
  return { status: result.status, body: await result.json() };
}
async function seed(overrides = {}) {
  const binding = 'a'.repeat(64);
  const result = await pool.query(`INSERT INTO payments(user_id, package_id, amount_eur, amount_try, status,
    fulfillment_version, credits_snapshot, amount_eur_cents, currency, checkout_binding, stripe_session_id)
    VALUES (1,1,10,500,'pending',2,10,1000,'eur',$1,$2) RETURNING *`, [binding, overrides.unbound ? null : 'cs_test_owned']);
  return { ...result.rows[0], binding };
}
function eventFor(payment, overrides = {}, type = 'checkout.session.completed', eventId = 'evt_test_fixture') {
  return { id: eventId, object: 'event', type, data: { object: {
    id: 'cs_test_owned', object: 'checkout.session', mode: 'payment', status: 'complete',
    payment_status: 'paid', amount_total: 1000, currency: 'eur', payment_intent: 'pi_test_owned',
    metadata: { payment_id: String(payment.id), user_id: '1', payment_binding: payment.binding,
      payment_protocol: 'checkout-credits-v2' }, ...overrides,
  } } };
}
async function send(event, valid = true) {
  const payload = JSON.stringify(event);
  const signature = sdk.webhooks.generateTestHeaderString({ payload, secret: valid ? process.env.STRIPE_WEBHOOK_SECRET : 'whsec_wrong_fictional' });
  return api('/api/payments/webhook', { method: 'POST', body: payload, headers: { 'stripe-signature': signature } }, null);
}
async function state(id = 1) {
  const u = await pool.query('SELECT credits FROM users WHERE id=1');
  const p = await pool.query('SELECT status, stripe_session_id FROM payments WHERE id=$1', [id]);
  const a = await pool.query('SELECT count(*)::int AS n FROM user_activities');
  const r = await pool.query('SELECT count(*)::int AS n FROM payment_credit_receipts');
  return { credits: u.rows[0].credits, status: p.rows[0]?.status, session: p.rows[0]?.stripe_session_id,
    activities: a.rows[0].n, receipts: r.rows[0].n };
}
async function failWrite(table, timing = 'INSERT') {
  await pool.query(`CREATE FUNCTION codex_fail_write() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN
    RAISE EXCEPTION 'Kurgusal yazım hatası'; END $$;
    CREATE TRIGGER codex_fail BEFORE ${timing} ON ${table} FOR EACH ROW EXECUTE FUNCTION codex_fail_write()`);
}
before(async () => {
  const app = express();
  app.use('/api', webhookRouter); // Üretim index.ts ile aynı raw-body sırası.
  app.use(express.json());
  app.use('/api', paymentRoutes);
  app.post('/api/fixture/use-credit', authenticateToken, async (req, res) => {
    try { res.json(await useCredit(req.user.id, 'Kurgusal görsel testi')); }
    catch { res.status(400).json({ error: 'Kredi kullanılamadı' }); }
  });
  await new Promise(resolve => { server = app.listen(0, '127.0.0.1', resolve); });
  origin = `http://127.0.0.1:${server.address().port}`;
});
beforeEach(() => reset());
after(async () => { await new Promise(resolve => server.close(resolve)); await pool.end(); });

test('farklı olay kimlikleriyle yinelenen ödeme yalnız bir kredi yatırır', async () => {
  const p = await seed();
  assert.equal((await send(eventFor(p))).status, 200);
  assert.equal((await send(eventFor(p, {}, undefined, 'evt_test_repeat'))).status, 200);
  assert.deepEqual(await state(p.id), { credits: 10, status: 'completed', session: 'cs_test_owned', activities: 1, receipts: 1 });
});
test('regresyon: aktivite yazım hatası rollback yapar ve bildirim tekrarında kredi kaybolmaz', async () => {
  const p = await seed(); await failWrite('user_activities');
  assert.equal((await send(eventFor(p))).status, 500);
  assert.equal((await state(p.id)).status, 'pending');
  assert.equal((await state(p.id)).credits, 0);
  await pool.query('DROP TRIGGER codex_fail ON user_activities');
  assert.equal((await send(eventFor(p))).status, 200);
  assert.equal((await state(p.id)).credits, 10);
});
test('regresyon: tamamlanan ödeme eski süre doldu bildirimiyle başarısıza dönmez', async () => {
  const p = await seed(); await send(eventFor(p));
  assert.equal((await send(eventFor(p, { status: 'expired', payment_status: 'unpaid' }, 'checkout.session.expired', 'evt_test_expired'))).status, 200);
  assert.equal((await state(p.id)).status, 'completed');
});
test('regresyon: eşzamanlı iki kredi isteği tek bakiyeyi eksiye düşürmez', async () => {
  await pool.query(`UPDATE users SET credits=1 WHERE id=1;
    CREATE FUNCTION codex_slow_update() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN PERFORM pg_sleep(0.15); RETURN NEW; END $$;
    CREATE TRIGGER codex_slow BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION codex_slow_update()`);
  const outcomes = await Promise.allSettled([useCredit(1, 'İlk'), useCredit(1, 'İkinci')]);
  assert.equal(outcomes.filter(x => x.status === 'fulfilled').length, 1);
  assert.equal((await state()).credits, 0); assert.equal((await state()).activities, 1);
});
test('regresyon: imza hatasında anahtar, imza ve ham gövde loglanmaz', async () => {
  const logs = []; const log = console.log, error = console.error;
  console.log = (...args) => logs.push(args.join(' ')); console.error = console.log;
  let result;
  try { result = await send({ id: 'evt_test_private', private_body: 'fictional-private-body-marker' }, false); }
  finally { console.log = log; console.error = error; }
  assert.equal(result.status, 400);
  const text = logs.join('\n') + JSON.stringify(result.body);
  assert.ok(!text.includes(process.env.STRIPE_WEBHOOK_SECRET.slice(0, 20)));
  assert.ok(!text.includes('fictional-private-body-marker'));
  assert.ok(!text.includes('t='));
});
test('regresyon: tamamlanma olayı ödeme bekliyorsa kredi verilmez', async () => {
  const p = await seed(); assert.equal((await send(eventFor(p, { payment_status: 'unpaid' }))).status, 200);
  assert.equal((await state(p.id)).credits, 0); assert.equal((await state(p.id)).status, 'pending');
});
test('regresyon: başka Checkout oturumu aynı ödeme kimliğiyle kredi alamaz', async () => {
  const p = await seed(); assert.equal((await send(eventFor(p, { id: 'cs_test_other' }))).status, 500);
  assert.equal((await state(p.id)).credits, 0);
});
test('regresyon: paket sonradan değişse de satın alınan kredi anlık kayıttan gelir', async () => {
  const p = await seed(); await pool.query('UPDATE credit_packages SET credits=99, price_try=999 WHERE id=1');
  assert.equal((await send(eventFor(p))).status, 200); assert.equal((await state(p.id)).credits, 10);
});
test('regresyon: sekiz paralel imzalı bildirim tek makbuz ve tek kredi yatırır', async () => {
  const p = await seed();
  const results = await Promise.all(Array.from({ length: 8 }, (_, i) => send(eventFor(p, {}, undefined, `evt_test_parallel_${i}`))));
  assert.ok(results.every(r => r.status === 200));
  assert.deepEqual(await state(p.id), { credits: 10, status: 'completed', session: 'cs_test_owned', activities: 1, receipts: 1 });
});
for (const [name, changes] of [ ['tutar', { amount_total: 999 }], ['para birimi', { currency: 'usd' }],
  ['kullanıcı', { metadata: { payment_id: '1', user_id: '2', payment_binding: 'a'.repeat(64), payment_protocol: 'checkout-credits-v2' } }],
  ['gizli bağlama', { metadata: { payment_id: '1', user_id: '1', payment_binding: 'b'.repeat(64), payment_protocol: 'checkout-credits-v2' } }],
  ['kesirli kimlik', { metadata: { payment_id: '1suffix' } }] ]) {
  test(`${name} uyuşmazlığı para yazımlarını durdurur`, async () => {
    const p = await seed(); assert.equal((await send(eventFor(p, changes))).status, 500);
    const s = await state(p.id); assert.equal(s.credits, 0); assert.equal(s.receipts, 0); assert.equal(s.activities, 0);
  });
}
for (const [table, timing] of [['users', 'UPDATE'], ['payment_credit_receipts', 'INSERT'], ['payments', 'UPDATE']]) {
  test(`${table} gerçek PostgreSQL hatası tüm yazımları geri alır ve tekrar denenebilir`, async () => {
    const p = await seed(); await failWrite(table, timing);
    assert.equal((await send(eventFor(p))).status, 500);
    assert.deepEqual(await state(p.id), { credits: 0, status: 'pending', session: 'cs_test_owned', activities: 0, receipts: 0 });
    await pool.query(`DROP TRIGGER codex_fail ON ${table}`);
    assert.equal((await send(eventFor(p))).status, 200); assert.equal((await state(p.id)).credits, 10);
  });
}
test('kredi harcamasında aktivite hatası bakiyeyi de geri alır', async () => {
  await pool.query('UPDATE users SET credits=1 WHERE id=1'); await failWrite('user_activities');
  await assert.rejects(useCredit(1, 'Kurgusal'), /Kurgusal/);
  assert.equal((await state()).credits, 1);
  await pool.query('DROP TRIGGER codex_fail ON user_activities');
  assert.equal((await useCredit(1, 'Yeniden')).remainingCredits, 0);
});
test('session ID yazımı eksik kaldığında gizli bağlama eşleşen imzalı bildirim tamamlar', async () => {
  const p = await seed({ unbound: true }); assert.equal((await send(eventFor(p))).status, 200);
  assert.equal((await state(p.id)).session, 'cs_test_owned'); assert.equal((await state(p.id)).credits, 10);
});
test('süre dolması önce gelse de aynı oturumun doğrulanmış ödemesi yalnız bir kez tamamlar', async () => {
  const p = await seed(); await send(eventFor(p, { status: 'expired' }, 'checkout.session.expired', 'evt_test_first_expiry'));
  assert.equal((await state(p.id)).status, 'failed');
  assert.equal((await send(eventFor(p))).status, 200); assert.equal((await state(p.id)).credits, 10);
});
test('eski belirsiz ödeme otomatik kredilendirilmez veya durumu değiştirilmez', async () => {
  const result = await pool.query("INSERT INTO payments(user_id, package_id, amount_eur, amount_try) VALUES (1,1,10,500) RETURNING id");
  const p = { id: result.rows[0].id, binding: 'a'.repeat(64) };
  assert.equal((await send(eventFor(p))).status, 500);
  assert.equal((await state(p.id)).status, 'pending'); assert.equal((await state(p.id)).credits, 0);
});
test('geçiş tamamlanmadan ödeme oluşturulmaz veya kredi verilmez', async () => {
  const p = await seed(); await pool.query('DELETE FROM payment_financial_transition');
  assert.equal((await send(eventFor(p))).status, 500);
  assert.equal((await api('/api/payments/create-checkout', { method: 'POST', body: '{"packageId":1}' })).status, 500);
  assert.equal(requests.length, 0); assert.equal((await state(p.id)).credits, 0);
});
test('gerçek JWT gerektiren checkout sunucu fiyatını ve bağlama bilgisini sağlayıcıya iletir', async () => {
  assert.equal((await api('/api/payments/create-checkout', { method: 'POST', body: '{"packageId":1}' }, null)).status, 401);
  const result = await api('/api/payments/create-checkout', { method: 'POST', body: '{"packageId":1,"credits":999,"amount":1}' });
  assert.equal(result.status, 200); assert.equal(result.body.sessionId, 'cs_test_fixture_1');
  assert.equal(requests[0].form.get('line_items[0][price_data][unit_amount]'), '1000');
  const record = (await pool.query('SELECT * FROM payments')).rows[0];
  assert.equal(record.credits_snapshot, 10); assert.equal(record.stripe_session_id, result.body.sessionId);
  assert.equal(requests[0].form.get('metadata[payment_binding]'), record.checkout_binding);
  assert.ok(!JSON.stringify(result.body).includes(record.checkout_binding));
  const list = await api('/api/payments'); assert.equal(list.status, 200);
  assert.ok(!JSON.stringify(list.body).includes(record.checkout_binding));
  assert.equal((await api('/api/payments', {}, 2)).body.payments.length, 0);
  assert.equal((await api('/api/fixture/use-credit', { method: 'POST', body: '{}' }, null)).status, 401);
});
test('checkout session DB yazımı aksasa da bildirimle güvenle kurtarılabilir', async () => {
  await failWrite('payments', 'UPDATE');
  const result = await api('/api/payments/create-checkout', { method: 'POST', body: '{"packageId":1}' });
  assert.equal(result.status, 500); assert.equal(requests.length, 1);
  const p = (await pool.query('SELECT * FROM payments')).rows[0];
  assert.equal(p.stripe_session_id, null); await pool.query('DROP TRIGGER codex_fail ON payments');
  const data = { ...p, binding: p.checkout_binding };
  assert.equal((await send(eventFor(data, { id: 'cs_test_fixture_1' }))).status, 200);
  assert.equal((await state(p.id)).credits, 10);
});
test('v2 anlık kayıt, oturum bağlantısı ve tamamlanan durum SQL düzeyinde korunur', async () => {
  const p = await seed();
  await assert.rejects(pool.query('UPDATE payments SET credits_snapshot=99 WHERE id=$1', [p.id]), /değiştirilemez/);
  await assert.rejects(pool.query("UPDATE payments SET stripe_session_id='cs_test_new' WHERE id=$1", [p.id]), /değiştirilemez/);
  await send(eventFor(p));
  await assert.rejects(pool.query("UPDATE payments SET status='failed' WHERE id=$1", [p.id]), /değiştirilemez/);
  await assert.rejects(pool.query('UPDATE users SET credits=-1 WHERE id=1'), /users_credits_nonnegative/);
});
test('geçiş yeniden çalıştırılabilir, eski ödeme ve bakiye değiştirilmez', async () => {
  await reset(false);
  await pool.query("UPDATE users SET credits=17 WHERE id=1; INSERT INTO payments(user_id,package_id,amount_eur,amount_try,status) VALUES (1,1,10,500,'completed')");
  await pool.query(migration); await pool.query(migration);
  const p = (await pool.query('SELECT * FROM payments')).rows[0];
  assert.equal(p.fulfillment_version, 1); assert.equal(p.status, 'completed'); assert.equal(p.credits_snapshot, null);
  assert.equal((await state(p.id)).credits, 17); assert.equal((await state(p.id)).receipts, 0);
});
test('negatif eski bakiye geçişi durdurur ve tüm şema değişiklikleri geri alınır', async () => {
  await reset(false); await pool.query('UPDATE users SET credits=-1 WHERE id=1');
  const client = await pool.connect();
  try { await assert.rejects(client.query(migration), /mutabakat/); await client.query('ROLLBACK'); }
  finally { client.release(); }
  assert.equal((await pool.query('SELECT credits FROM users WHERE id=1')).rows[0].credits, -1);
  assert.equal((await pool.query("SELECT to_regclass('payment_financial_transition') AS t")).rows[0].t, null);
});

test('aynı olay kimliği başka ödemede tekrar kullanılırsa ikinci işlemin tüm yazımları geri alınır', async () => {
  const first = await seed(); await send(eventFor(first));
  const result = await pool.query(`INSERT INTO payments(user_id,package_id,amount_eur,amount_try,
    fulfillment_version,credits_snapshot,amount_eur_cents,currency,checkout_binding,stripe_session_id)
    VALUES(1,1,10,500,2,10,1000,'eur',$1,'cs_test_second') RETURNING id`, ['b'.repeat(64)]);
  const second = { id: result.rows[0].id, binding: 'b'.repeat(64) };
  assert.equal((await send(eventFor(second, { id: 'cs_test_second', payment_intent: 'pi_test_second' }))).status, 500);
  const s = await state(second.id); assert.equal(s.credits, 10); assert.equal(s.status, 'pending');
  assert.equal(s.receipts, 1); assert.equal(s.activities, 1);
});
test('ödenmemiş oturum daha sonra asenkron ödeme bildirimiyle bir kez kredilendirilir', async () => {
  const p = await seed(); await send(eventFor(p, { payment_status: 'unpaid' }));
  assert.equal((await send(eventFor(p, {}, 'checkout.session.async_payment_succeeded', 'evt_test_async'))).status, 200);
  assert.equal((await send(eventFor(p, {}, 'checkout.session.async_payment_succeeded', 'evt_test_async_repeat'))).status, 200);
  assert.equal((await state(p.id)).credits, 10); assert.equal((await state(p.id)).receipts, 1);
});
test('ham gövde limiti ve eksik imza finansal işlemden önce reddedilir', async () => {
  const p = await seed();
  const payload = JSON.stringify({ ...eventFor(p), padding: 'x'.repeat(1024 * 1024) });
  const signature = sdk.webhooks.generateTestHeaderString({ payload, secret: process.env.STRIPE_WEBHOOK_SECRET });
  assert.equal((await api('/api/payments/webhook', { method: 'POST', body: payload,
    headers: { 'stripe-signature': signature } }, null)).status, 413);
  assert.equal((await api('/api/payments/webhook', { method: 'POST', body: JSON.stringify(eventFor(p)) }, null)).status, 400);
  assert.equal((await state(p.id)).credits, 0);
});
