const crypto = require('node:crypto');

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ''));
  const right = Buffer.from(String(b || ''));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Vary', 'Origin');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const expectedOrigin = process.env.ADMIN_ALLOWED_ORIGIN;
  if (expectedOrigin && req.headers.origin && req.headers.origin !== expectedOrigin) {
    return res.status(403).json({ error: 'Request origin not allowed' });
  }

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!username || !password || !secret || secret.length < 32) {
    return res.status(503).json({ error: 'Admin authentication is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, and a 32+ character ADMIN_SESSION_SECRET in Vercel.' });
  }

  const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {});
  if (!safeEqual(body.username, username) || !safeEqual(body.password, password)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({ sub: username, exp: now + 8 * 60 * 60 })).toString('base64url');
  const token = payload + '.' + sign(payload, secret);
  res.setHeader('Set-Cookie', 'pk_admin_session=' + token + '; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800');
  return res.status(200).json({ ok: true, expiresIn: 28800 });
};
