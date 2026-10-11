const { spawnSync } = require('node:child_process');
const { existsSync } = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const url = new URL(process.env.DATABASE_URL || 'postgres://invalid');
if (process.env.CODEX_ZAMAN_TEST_ALLOW !== '1' || !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) ||
    !/^\/codex_zaman_[a-z0-9_]+$/.test(url.pathname) || url.searchParams.get('sslmode') !== 'disable') {
  throw new Error('Testler yalnız açıkça izin verilen yerel codex_zaman_ veritabanında çalışır');
}
for (const dir of [root, path.dirname(root)]) {
  for (const name of ['.env', '.env.local', '.env.development', '.env.test', '.env.production']) {
    if (existsSync(path.join(dir, name))) throw new Error('Test ortamında gerçek .env dosyası bulunamaz');
  }
}
const env = { ...process.env };
for (const key of Object.keys(env)) {
  if (/SECRET|TOKEN|API_KEY|PASSWORD|GOOGLE_|STRIPE_|FRONTEND_URL|NODE_OPTIONS/.test(key)) delete env[key];
}
Object.assign(env, { JWT_SECRET: 'codex-fictional-zaman-jwt-secret',
  STRIPE_SECRET_KEY: 'sk_test_codex_zaman_fictional', STRIPE_WEBHOOK_SECRET: 'whsec_codex_zaman_fictional_private',
  GOOGLE_CLIENT_ID: 'codex-fictional-google-client', GOOGLE_CLIENT_SECRET: 'codex-fictional-google-secret',
  GOOGLE_REDIRECT_URI: 'http://127.0.0.1/fictional-callback', FRONTEND_URL: 'http://127.0.0.1/fictional-app',
  TS_NODE_FILES: 'true', TS_NODE_PROJECT: path.join(root, 'tsconfig.json') });
const args = ['-r', 'ts-node/register', '--test'];
if (process.env.ZAMAN_BASELINE === '1') args.push('--test-name-pattern=regresyon');
args.push(path.join(__dirname, 'payment-security.test.cjs'));
const result = spawnSync(process.execPath, args, { cwd: root, env, stdio: 'inherit' });
process.exit(result.status ?? 1);
