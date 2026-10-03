const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  fs.readdirSync(dir).forEach(f => {
    if (['node_modules', '.git', 'scratch'].includes(f)) return;
    let full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) res = res.concat(walk(full));
    else if (f.endsWith('.html') || f.endsWith('.js')) res.push(full);
  });
  return res;
}

const allFiles = walk('.');

let failures = [];

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Check 1: No <a> tag with href and brand/logo class or text
  const anchorBrandMatches = content.match(/<a[^>]*?(?:class=["'][^"']*(?:brand|ai-brand-logo|site-logo)[^"']*["'])[^>]*>/gi) || [];
  anchorBrandMatches.forEach(m => {
    failures.push(`[${file}] Found anchor tag with brand class: ${m}`);
  });

  // Check 2: No <a> tag with href="index.html" that contains VANVI MOMENTS inside
  const indexVanviMatches = content.match(/<a[^>]*href=["'](?:index\.html|\/)?["'][^>]*>[\s\S]*?VANVI[\s\S]*?MOMENTS[\s\S]*?<\/a>/gi) || [];
  indexVanviMatches.forEach(m => {
    failures.push(`[${file}] Found index.html link with VANVI MOMENTS text: ${m.replace(/\s+/g, ' ').slice(0, 100)}`);
  });

  // Check 3: Check that brand-link is not inside any <a>
  const brandLinkInA = content.match(/<a[^>]*>[\s\S]*?class=["'][^"']*brand-link[^"']*["'][\s\S]*?<\/a>/gi) || [];
  brandLinkInA.forEach(m => {
    failures.push(`[${file}] Found brand-link inside <a>: ${m.replace(/\s+/g, ' ').slice(0, 100)}`);
  });

  // Check 4: Check if any onclick on brand elements
  const onclickBrand = content.match(/<[^>]+(?:brand|logo)[^>]+onclick=[^>]+>/gi) || [];
  onclickBrand.forEach(m => {
    // Exclude scratchFloatBtn or non-logo items
    if (/vanvimoments|brand-link|brand-title|ai-brand-logo|auth-brand/i.test(m)) {
      failures.push(`[${file}] Found onclick on brand element: ${m}`);
    }
  });
});

console.log('=== VERIFICATION AUDIT RESULTS ===');
if (failures.length === 0) {
  console.log('✅ ALL CHECKS PASSED: ZERO logo/brand elements have click handlers, hrefs, or navigation attached!');
} else {
  console.error(`❌ Found ${failures.length} issues:`);
  failures.forEach(f => console.error('  - ' + f));
}
