const rnBridge = require('rn-bridge');
const { Client } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

const DEFAULT_ITER = parseInt(process.env.DJANGO_PBKDF2_ITERATIONS || '390000', 10);

function getClient() {
  const ssl = (process.env.DB_SSL || 'false').toLowerCase() === 'true';
  return new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: ssl ? { rejectUnauthorized: false } : false,
  });
}

function djangoHashPassword(plain, iterations=DEFAULT_ITER, salt=null) {
  if (!salt) salt = crypto.randomBytes(16).toString('hex');
  const dk = crypto.pbkdf2Sync(plain, salt, iterations, 32, 'sha256');
  const b64 = dk.toString('base64');
  return `pbkdf2_sha256$${iterations}$${salt}$${b64}`;
}

function djangoVerifyPassword(plain, encoded) {
  const parts = (encoded || '').split('$');
  if (parts.length !== 4) throw new Error('Unsupported password hash format');
  const [alg, iterStr, salt, hash] = parts;
  if (alg !== 'pbkdf2_sha256') throw new Error(`Unsupported algorithm: ${alg}`);
  const iterations = parseInt(iterStr, 10);
  const dk = crypto.pbkdf2Sync(plain, salt, iterations, 32, 'sha256');
  const b64 = dk.toString('base64');
  // timing-safe compare
  const a = Buffer.from(hash);
  const b = Buffer.from(b64);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

async function withClient(fn) {
  const client = getClient();
  await client.connect();
  try { return await fn(client); }
  finally { try { await client.end(); } catch (_) {} }
}

function roleOrDefault(r) {
  const ok = ['student','organization','administrator'];
  return ok.includes(r) ? r : 'student';
}

async function doLogin({ email, password }) {
  if (!email || !password) return { ok:false, code:'MISSING', message:'Email and password are required' };
  return await withClient(async (client) => {
    const q = 'SELECT id, email, first_name, last_name, user_type, password FROM accounts_user WHERE email=$1';
    const r = await client.query(q, [email]);
    if (r.rowCount === 0) return { ok:false, code:'NO_USER', message:'No user with this email' };
    const row = r.rows[0];
    const ok = djangoVerifyPassword(password, row.password);
    if (!ok) return { ok:false, code:'BAD_PASSWORD', message:'Invalid credentials' };
    delete row.password;
    return { ok:true, user: row };
  });
}

async function doRegister({ email, password, user_type }) {
  if (!email || !password) return { ok:false, code:'MISSING', message:'Email and password are required' };
  const role = roleOrDefault(user_type);
  const encoded = djangoHashPassword(password);

  return await withClient(async (client) => {
    const exists = await client.query('SELECT 1 FROM accounts_user WHERE email=$1', [email]);
    if (exists.rowCount > 0) return { ok:false, code:'DUP_EMAIL', message:'An account with this email already exists' };
    const insert = `
      INSERT INTO accounts_user
        (password, last_login, is_superuser, username, first_name, last_name, is_staff, is_active, date_joined, user_type, email)
      VALUES ($1, NULL, FALSE, $2, '', '', FALSE, TRUE, NOW(), $3, $4)
      RETURNING id, email, first_name, last_name, user_type
    `;
    const r = await client.query(insert, [encoded, email, role, email]);
    return { ok:true, user: r.rows[0] };
  });
}

function sendOk(id, result) { rnBridge.channel.send(JSON.stringify({ id, status: 'ok', result })); }
function sendErr(id, err)   { rnBridge.channel.send(JSON.stringify({ id, status: 'error', error: (err && err.message) || String(err) })); }

rnBridge.channel.on('message', async (msg) => {
  let data;
  try { data = JSON.parse(msg); } catch (e) { return; }
  const { id, type, payload } = data || {};
  try {
    if (type === 'login')       return sendOk(id, await doLogin(payload || {}));
    if (type === 'register')    return sendOk(id, await doRegister(payload || {}));
    if (type === 'ping')        return sendOk(id, { pong: true });
    throw new Error('Unknown RPC type: ' + type);
  } catch (e) {
    return sendErr(id, e);
  }
});

// announce readiness
rnBridge.channel.send(JSON.stringify({ id: 'boot', status: 'ok', result: { ready: true } }));
