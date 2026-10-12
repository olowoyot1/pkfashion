const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const outDir = path.join(root, 'public');
const file = path.join(root, 'index.html');
const adminFile = path.join(root, 'admin', 'index.html');

if (!fs.existsSync(file)) throw new Error('index.html is missing');
if (!fs.existsSync(adminFile)) throw new Error('admin/index.html is missing');
const html = fs.readFileSync(file, 'utf8');
const adminHtml = fs.readFileSync(adminFile, 'utf8');
for (const marker of ['PK FASHION', 'view-home', 'shop-products-grid', 'checkout-modal']) {
  if (!html.includes(marker)) throw new Error(`Required storefront section missing: ${marker}`);
}
if (html.includes('admin-dashboard-modal') || html.includes('Admin Dashboard')) {
  throw new Error('Public storefront must not contain admin dashboard markup or links');
}
for (const marker of ['Admin sign in', '/api/admin/login', '/api/admin/session', 'product-form']) {
  if (!adminHtml.includes(marker)) throw new Error(`Required admin portal section missing: ${marker}`);
}
if (!html.includes('</html>') || !adminHtml.includes('</html>')) throw new Error('HTML document appears incomplete');

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(file, path.join(outDir, 'index.html'));
fs.mkdirSync(path.join(outDir, 'admin'), { recursive: true });
fs.copyFileSync(adminFile, path.join(outDir, 'admin', 'index.html'));

console.log('PK Fashion storefront and admin portal build checks passed. Output written to public/.');
