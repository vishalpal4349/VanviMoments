const fs = require('fs');
const path = require('path');
const templatesData = require('../js/vanvi-templates-data.js');

console.log('=== VANVI MOMENTS CATEGORY & TEMPLATES SUITE ===\n');

let failed = false;

function assert(condition, message) {
  if (condition) {
    console.log('  ✅ ' + message);
  } else {
    console.error('  ❌ FAIL: ' + message);
    failed = true;
  }
}

// 1. Templates Data Verification
console.log('1. Templates Data Catalog Verification:');
assert(Array.isArray(templatesData.templates) && templatesData.templates.length >= 20, 
  `Catalog contains ${templatesData.templates.length} templates (>= 20 required)`);

const requiredFields = ['id', 'name', 'category', 'categorySlug', 'price', 'isFree', 'badge', 'type', 'icon', 'description', 'features'];
let allFieldsPresent = true;
for (const t of templatesData.templates) {
  for (const f of requiredFields) {
    if (t[f] === undefined || t[f] === null || t[f] === '') {
      console.error(`Template ${t.id} missing field: ${f}`);
      allFieldsPresent = false;
    }
  }
}
assert(allFieldsPresent, 'All templates contain required schema fields');

// Category filters work
const freeCount = templatesData.getByCategory('free').length;
const premCount = templatesData.getByCategory('premium').length;
const bdayCount = templatesData.getByCategory('birthday').length;
const loveCount = templatesData.getByCategory('love').length;
const memCount = templatesData.getByCategory('memories').length;
assert(freeCount > 0, `Free filter returned ${freeCount} templates`);
assert(premCount > 0, `Premium filter returned ${premCount} templates`);
assert(bdayCount > 0, `Birthday filter returned ${bdayCount} templates`);
assert(loveCount > 0, `Love filter returned ${loveCount} templates`);
assert(memCount > 0, `Memories filter returned ${memCount} templates`);

// 2. Dedicated Category Files Verification
console.log('\n2. Dedicated Category HTML Files Verification:');
const expectedPages = [
  'templates.html',
  'category-birthday.html',
  'category-love.html',
  'category-anniversary.html',
  'category-friendship.html',
  'category-memories.html',
  'category-free.html',
  'category-premium.html'
];

for (const page of expectedPages) {
  const filePath = path.join(__dirname, '..', page);
  const exists = fs.existsSync(filePath);
  assert(exists, `Page exists: ${page}`);
  if (exists) {
    const content = fs.readFileSync(filePath, 'utf8');
    assert(content.includes('viewport') && content.includes('width=device-width'), `${page} has responsive viewport meta`);
    assert(content.includes('overflow-x: hidden'), `${page} enforces overflow-x: hidden`);
    assert(content.includes('builder.html') && (content.includes('preview.html') || content.includes('moment.html') || content.includes('preview')), `${page} links to studio and preview`);
  }
}

// 3. Homepage Category Cards & Links Verification
console.log('\n3. Homepage Explore Categories Section Verification:');
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
assert(indexHtml.includes('class="section category-section"'), 'index.html has category-section');
assert(indexHtml.includes('class="horizontal category-slider"'), 'index.html preserves category-slider wrapper');
assert(indexHtml.includes('href="templates.html"'), 'All Templates link exists');
assert(indexHtml.includes('href="category-free.html"'), '100% Free link exists');
assert(indexHtml.includes('href="category-premium.html"'), 'Ultra Premium link exists');
assert(indexHtml.includes('href="category-birthday.html"'), 'Birthday Specials link exists');
assert(indexHtml.includes('href="category-love.html"'), 'Love & Romance link exists');
assert(indexHtml.includes('href="category-anniversary.html"'), 'Anniversary link exists');
assert(indexHtml.includes('href="category-friendship.html"'), 'Friendship link exists');
assert(indexHtml.includes('href="category-memories.html"'), 'Memories link exists');

// Verify jewel / capsule card styling
assert(indexHtml.includes('cat-top-row') && indexHtml.includes('cat-icon') && indexHtml.includes('cat-micro-badge'), 
  'Category cards use luxury jewel capsule structure (top row, icon pod, micro badge)');

if (failed) {
  console.error('\n❌ SOME CHECKS FAILED!');
  process.exit(1);
} else {
  console.log('\n🎉 ALL CATEGORY & TEMPLATES SUITE CHECKS PASSED PERFECTLY!\n');
}
