const crypto = require('node:crypto');

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}
function safeEqual(a, b) {
  const left = Buffer.from(String(a || ''));
  const right = Buffer.from(String(b || ''));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const secret = process.env.ADMIN_SESSION_SECRET;
  const cookies = Object.fromEntries((req.headers.cookie || '').split(';').map(v => v.trim()).filter(Boolean).map(v => {
    const i = v.indexOf('=');
    return [v.slice(0, i), v.slice(i + 1)];
  }));
  const token = cookies.pk_admin_session || '';
  const parts = token.split('.');
  if (!secret || secret.length < 32 || parts.length !== 2 || !safeEqual(parts[1], sign(parts[0], secret))) {
    return res.status(401).json({ authenticated: false });
  }
  try {
    const payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    if (!payload.sub || payload.sub !== process.env.ADMIN_USERNAME || !payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ authenticated: false });
    }
    return res.status(200).json({ authenticated: true, username: payload.sub, expiresAt: payload.exp });
  } catch {
    return res.status(401).json({ authenticated: false });
  }
};
