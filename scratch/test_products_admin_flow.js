const fs = require('fs');

const prodHtml = fs.readFileSync('products.html', 'utf8');
const adminHtml = fs.readFileSync('admin.html', 'utf8');
const prodData = fs.readFileSync('js/vanvi-products-data.js', 'utf8');

console.log('--- VALIDATING PRODUCTS PAGE ---');
if (!prodHtml.includes('productDetailsModal')) throw new Error('Missing productDetailsModal');
if (!prodHtml.includes('btn-product-details')) throw new Error('Missing btn-product-details');
if (!prodHtml.includes('btn-product-buy')) throw new Error('Missing btn-product-buy');
if (!prodHtml.includes('openProductDetailsModal')) throw new Error('Missing openProductDetailsModal');
if (!prodHtml.includes('product-modal-buy-btn')) throw new Error('Missing product-modal-buy-btn');

const adminJs = fs.readFileSync('js/vanvi-admin-enterprise.js', 'utf8');

console.log('--- VALIDATING ADMIN PAGE ---');
if (!adminHtml.includes('data-tab="products"')) throw new Error('Missing products tab button');
if (!adminHtml.includes('id="tab-products"')) throw new Error('Missing tab-products section');
if (!adminHtml.includes('id="productAdminModal"')) throw new Error('Missing productAdminModal');
if (!adminHtml.includes('productAdminImageFile')) throw new Error('Missing productAdminImageFile upload input');
if (!adminHtml.includes('btnClearDemoProducts')) throw new Error('Missing btnClearDemoProducts');
if (!adminHtml.includes('btnResetDemoProducts')) throw new Error('Missing btnResetDemoProducts');
if (!adminHtml.includes('loadAdminProducts') && !adminJs.includes('loadAdminProducts')) throw new Error('Missing loadAdminProducts');

console.log('--- VALIDATING PRODUCTS DATA ---');
eval(prodData);
const fn = global.detectStoreFromUrl;
if (typeof fn !== 'function') throw new Error('detectStoreFromUrl is not a function');
if (fn('https://www.meesho.com/s/p/abc') !== 'Meesho') throw new Error('Meesho detection failed');
if (fn('https://amzn.to/3xyz') !== 'Amazon') throw new Error('Amazon detection failed');
if (fn('https://www.flipkart.com/item/123') !== 'Flipkart') throw new Error('Flipkart detection failed');
if (fn('https://www.myntra.com/dress') !== 'Myntra') throw new Error('Myntra detection failed');

console.log('🎉 ALL INTEGRATION ASSERTS PASSED PERFECTLY!');
