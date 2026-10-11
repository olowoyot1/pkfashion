const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const outDir = path.join(root, 'public');
const file = path.join(root, 'index.html');

if (!fs.existsSync(file)) throw new Error('index.html is missing');
const html = fs.readFileSync(file, 'utf8');
for (const marker of ['PK FASHION', 'view-home', 'shop-products-grid', 'checkout-modal']) {
  if (!html.includes(marker)) throw new Error(`Required storefront section missing: ${marker}`);
}
if (!html.includes('</html>')) throw new Error('HTML document appears incomplete');

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(file, path.join(outDir, 'index.html'));

console.log('PK Fashion storefront build check passed. Output written to public/.');
