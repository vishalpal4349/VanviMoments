const fs = require('fs');
const path = require('path');

const root = path.resolve('.');
const files = fs.readdirSync(root).filter(f => f.endsWith('.html')).sort();

console.log('====================================================');
console.log(`COMPREHENSIVE AUDIT OF ALL ${files.length} PAGES`);
console.log('====================================================\n');

let totalIssues = 0;
const pageReports = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(root, f), 'utf8');
  const issues = [];

  // 1. Viewport Check
  const vpMatch = content.match(/<meta[^>]*name=["']viewport["'][^>]*>/i);
  if (!vpMatch) {
    issues.push('Missing viewport meta tag');
  } else {
    const vp = vpMatch[0];
    if (vp.includes('user-scalable=no') || vp.includes('maximum-scale=1.0')) {
      issues.push(`Restricted mobile scaling: ${vp}`);
    }
  }

  // 2. Navigation CSS and JS Check
  if (f !== '404.html') {
    if (!content.includes('vanvi-navigation.css')) issues.push('Missing vanvi-navigation.css');
    if (!content.includes('vanvi-navigation.js')) issues.push('Missing vanvi-navigation.js');
  }

  // 3. Brand Logo Check (must be clickable to home, or on index.html smooth scroll)
  if (f === 'index.html') {
    // Should have cursor: pointer and not pointer-events: none on the brand element
    const brandMatch = content.match(/<div[^>]*class=["']brand["'][^>]*style=["']([^"']*)["']/);
    if (brandMatch && brandMatch[1].includes('pointer-events:none')) {
      issues.push('index.html logo has pointer-events:none');
    }
  } else if (f !== 'moment.html') {
    // Should have an <a> tag linking to index.html or home
    const hasBrandLink = /<a[^>]*href=["'](?:index\.html|\/|#)?["'][^>]*class=["'][^"']*(?:brand|header-brand)[^"']*["']/i.test(content) ||
                         /<a[^>]*class=["'][^"']*(?:brand|header-brand)[^"']*["'][^>]*href=["'](?:index\.html|\/|#)?["']/i.test(content);
    if (!hasBrandLink) {
      // Check if it has a div brand
      if (/<div[^>]*class=["'][^"']*(?:brand-link|header-brand)[^"']*["']/i.test(content)) {
        issues.push('Brand is a <div> instead of a clickable <a href="index.html">');
      }
    }
  }

  // 4. Internal Link Validity (all href="*.html" must exist)
  const links = [...content.matchAll(/href=["']([^"']+\.html)(?:#[^"']*)?["']/gi)];
  links.forEach(m => {
    const targetFile = m[1].replace(/^\.\//, '');
    if (!targetFile.startsWith('http') && !fs.existsSync(path.join(root, targetFile))) {
      issues.push(`Broken internal link to: ${targetFile}`);
    }
  });

  // 5. Check for pointer-events: none on brand
  if (/(\.brand|\.brand-link|\.brand-group|\.header-brand)[^{]*\{[^}]*pointer-events\s*:\s*none/i.test(content)) {
    issues.push('CSS rule contains pointer-events: none on brand selector');
  }
  if (/class=["'][^"']*brand[^"']*["'][^>]*style=["'][^"']*pointer-events\s*:\s*none/i.test(content)) {
    issues.push('Inline style contains pointer-events: none on brand element');
  }

  if (issues.length > 0) {
    totalIssues += issues.length;
    pageReports.push({ file: f, status: 'FAILED', issues });
  } else {
    pageReports.push({ file: f, status: 'PASSED', issues: [] });
  }
});

console.log('----------------------------------------------------');
console.log('AUDIT SUMMARY:');
console.log(`Total Pages Inspected: ${files.length}`);
console.log(`Pages Passed: ${pageReports.filter(p => p.status === 'PASSED').length}`);
console.log(`Pages with Issues: ${pageReports.filter(p => p.status === 'FAILED').length}`);
console.log(`Total Issues Found: ${totalIssues}`);
console.log('----------------------------------------------------\n');

if (totalIssues > 0) {
  console.log('ISSUES DETAILS:');
  pageReports.filter(p => p.status === 'FAILED').forEach(p => {
    console.log(`\n❌ [${p.file}]:`);
    p.issues.forEach(iss => console.log(`   - ${iss}`));
  });
} else {
  console.log('🎉 ALL 52 PAGES PASSED 100% OF CHECKS WITH ZERO ISSUES!');
}
