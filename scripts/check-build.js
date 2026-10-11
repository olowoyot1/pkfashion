const fs = require('node:fs');
const path = require('node:path');
const file = path.join(process.cwd(), 'index.html');
if (!fs.existsSync(file)) throw new Error('index.html is missing');
const html = fs.readFileSync(file, 'utf8');
for (const marker of ['PK FASHION', 'view-home', 'shop-products-grid', 'checkout-modal']) {
  if (!html.includes(marker)) throw new Error(`Required storefront section missing: ${marker}`);
}
if (!html.includes('</html>')) throw new Error('HTML document appears incomplete');
console.log('PK Fashion storefront build check passed.');
