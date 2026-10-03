const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

console.log('Auditing ' + files.length + ' HTML files...\n');

const results = {
  brandPointerEventsNone: [],
  brandIsDivNotLink: [],
  noViewportMeta: [],
  badViewportMeta: [],
  missingNavJs: [],
  missingNavCss: []
};

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');

  // Check pointer-events: none affecting brand
  if (/(\.brand|\.brand-link|\.brand-group|\.header-brand)[^{]*\{[^}]*pointer-events\s*:\s*none/i.test(content)) {
    results.brandPointerEventsNone.push(f);
  }
  if (/style="[^"]*pointer-events\s*:\s*none[^"]*class="[^"]*brand/i.test(content) ||
      /class="[^"]*brand[^"]*"[^>]*style="[^"]*pointer-events\s*:\s*none/i.test(content)) {
    results.brandPointerEventsNone.push(f + ' (inline style)');
  }

  // Check if brand is div instead of link, or if brand link has href="index.html"
  const brandDivs = content.match(/<div[^>]*class=["'][^"']*\bbrand\b[^"']*["'][^>]*>/gi);
  if (brandDivs && !content.includes('href="index.html"') && f !== 'index.html') {
    results.brandIsDivNotLink.push(f);
  }

  // Viewport meta
  const viewportMatch = content.match(/<meta[^>]*name=["']viewport["'][^>]*>/i);
  if (!viewportMatch) {
    results.noViewportMeta.push(f);
  } else {
    const vp = viewportMatch[0];
    if (vp.includes('user-scalable=no') || vp.includes('maximum-scale=1.0') || vp.includes('maximum-scale=1,')) {
      results.badViewportMeta.push({ file: f, meta: vp });
    }
  }

  // Check navigation js & css inclusion
  if (!content.includes('vanvi-navigation.js') && f !== '404.html') {
    results.missingNavJs.push(f);
  }
  if (!content.includes('vanvi-navigation.css') && f !== '404.html') {
    results.missingNavCss.push(f);
  }
});

console.log('--- Brand pointer-events: none ---');
console.log(results.brandPointerEventsNone);

console.log('\n--- Viewport Meta Issues (user-scalable=no or bad scale) ---');
console.log(results.badViewportMeta);

console.log('\n--- No Viewport Meta ---');
console.log(results.noViewportMeta);

console.log('\n--- Missing vanvi-navigation.js ---');
console.log(results.missingNavJs);

console.log('\n--- Missing vanvi-navigation.css ---');
console.log(results.missingNavCss);
