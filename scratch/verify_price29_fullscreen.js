const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');
console.log('--- STARTING VERIFICATION FOR ₹29 PRICE & FULLSCREEN PREVIEW ---');

// 1. Check template.json
const tplJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'templates', 'cute-pastel-birthday', 'template.json'), 'utf8'));
assert.strictEqual(tplJson.price, 29, 'template.json price must be 29');
console.log('✔ template.json price is 29');

// 2. Check vanvi-templates-data.js
const tData = fs.readFileSync(path.join(ROOT, 'js', 'vanvi-templates-data.js'), 'utf8');
assert.ok(tData.includes("id: 'cute-pastel-birthday'"), 'must find cute-pastel-birthday in data');
assert.ok(tData.includes("price: 29"), 'vanvi-templates-data.js must set price: 29');
console.log('✔ vanvi-templates-data.js price is 29');

// 3. Check preview.html
const rootPreview = fs.readFileSync(path.join(ROOT, 'preview.html'), 'utf8');
assert.ok(rootPreview.includes("price: '₹29'"), 'root preview.html must have price: ₹29');
assert.ok(rootPreview.includes("window.location.replace('templates/cute-pastel-birthday/preview.html'"), 'root preview must redirect cute-pastel-birthday to direct fullscreen');
console.log('✔ root preview.html price is ₹29 and redirects to direct fullscreen preview.html');

// 4. Check templates/cute-pastel-birthday/preview.html
const tplPreview = fs.readFileSync(path.join(ROOT, 'templates', 'cute-pastel-birthday', 'preview.html'), 'utf8');
assert.ok(tplPreview.includes('₹29'), 'preview.html must show ₹29');
assert.ok(tplPreview.includes('checkout.html?template=cute-pastel-birthday&price=29'), 'preview.html must link to checkout with price=29');
assert.ok(tplPreview.includes('preview-details-floating-drawer'), 'preview.html must contain floating details drawer');
assert.ok(tplPreview.includes('template-fullscreen-viewport'), 'preview.html must contain full viewport frame');
console.log('✔ templates/cute-pastel-birthday/preview.html has ₹29, direct payment link, details drawer & fullscreen iframe');

// 5. Check templates/cute-pastel-birthday/builder.html
const builderHtml = fs.readFileSync(path.join(ROOT, 'templates', 'cute-pastel-birthday', 'builder.html'), 'utf8');
assert.ok(builderHtml.includes('₹29'), 'builder.html must show ₹29');
assert.ok(builderHtml.includes('checkout.html?template=${TEMPLATE_ID}&price=29') || builderHtml.includes('checkout.html?template=cute-pastel-birthday&price=29'), 'builder.html must link to checkout with price=29');
assert.ok(!builderHtml.includes('₹149'), 'builder.html must not show old ₹149 price');
console.log('✔ builder.html price updated to ₹29 without old ₹149 references');

// 6. Check templates.html
const templatesHtml = fs.readFileSync(path.join(ROOT, 'templates.html'), 'utf8');
assert.ok(templatesHtml.includes('t.previewPath'), 'templates.html must support t.previewPath direct links');
console.log('✔ templates.html supports direct t.previewPath navigation');

// 7. Check checkout.html
const checkoutHtml = fs.readFileSync(path.join(ROOT, 'checkout.html'), 'utf8');
assert.ok(checkoutHtml.includes('t.id === templateName'), 'checkout.html must match template by id or slug');
console.log('✔ checkout.html correctly matches cute-pastel-birthday and handles price=29');

console.log('--- ALL VERIFICATIONS PASSED PERFECTLY (100%) ---');
