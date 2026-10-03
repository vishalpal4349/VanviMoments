const fs = require('fs');
const path = require('path');

const rootHtmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const templateHtmlFiles = [
  'templates/apology-dashboard/index.html',
  'templates/birthday-3d-candle-surprise/index.html',
  'templates/birthday-gf/index.html',
  'templates/birthday-white-bloom-001/index.html',
  'templates/birthday-wish-01/index.html',
  'templates/birthday-wish-02/index.html'
];

const allFiles = [...rootHtmlFiles, ...templateHtmlFiles];

console.log(`Starting comprehensive audit of all ${allFiles.length} HTML pages...`);

const report = [];

allFiles.forEach(file => {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) {
    report.push({ file, status: 'MISSING', issues: ['File does not exist'] });
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const warnings = [];

  // Remove <script> content when analyzing static HTML anchor tags
  const htmlOnly = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // 1. Title
  const titleMatch = content.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    issues.push('Missing or empty <title>');
  }

  // 2. Viewport
  if (!content.includes('name="viewport"') && !content.includes("name='viewport'")) {
    issues.push('Missing viewport meta tag');
  }

  // 3. Meta Description
  if (!content.includes('name="description"') && !content.includes("name='description'")) {
    warnings.push('Missing meta description');
  }

  // 4. Stylesheets
  const linkMatches = [...content.matchAll(/<link[^>]+href=["']([^"']+)["'][^>]*>/gi)];
  linkMatches.forEach(m => {
    const href = m[1];
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
      // External CDN - ok
    } else if (href.startsWith('#') || href.startsWith('data:')) {
      // in-page or data URI
    } else {
      // Local file
      const cleanHref = href.split('?')[0].split('#')[0];
      const localRel = path.resolve(path.dirname(filePath), cleanHref);
      if (!fs.existsSync(localRel)) {
        issues.push(`Broken stylesheet link: ${href}`);
      }
    }
  });

  // 5. Scripts
  const scriptMatches = [...content.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi)];
  scriptMatches.forEach(m => {
    const src = m[1];
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
      // External CDN
    } else {
      const cleanSrc = src.split('?')[0].split('#')[0];
      const localRel = path.resolve(path.dirname(filePath), cleanSrc);
      if (!fs.existsSync(localRel)) {
        issues.push(`Broken script src: ${src}`);
      }
    }
  });

  // 6. Anchor links in static HTML
  const aMatches = [...htmlOnly.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi)];
  let deadHashCount = 0;
  aMatches.forEach(m => {
    const href = m[1].trim();
    if (href === '#' || href === 'javascript:void(0);' || href === 'javascript:;') {
      const fullTag = m[0];
      if (!fullTag.includes('onclick') && !fullTag.includes('id=') && !fullTag.includes('@click')) {
        deadHashCount++;
      }
    } else if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      // External or protocol link
    } else if (href.startsWith('#')) {
      // Anchor link
    } else if (href.includes('${')) {
      // Template literal inside inline HTML
    } else {
      // Internal link
      const cleanHref = href.split('?')[0].split('#')[0];
      if (cleanHref) {
        const localRel = path.resolve(path.dirname(filePath), cleanHref);
        if (!fs.existsSync(localRel)) {
          issues.push(`Broken internal link: "${href}"`);
        }
      }
    }
  });

  if (deadHashCount > 0) {
    warnings.push(`${deadHashCount} dead '#' link(s) without onclick/action`);
  }

  // 7. Navigation checks
  const isHome = file === 'index.html';
  const hasBackBtn = content.includes('history.back()') || content.includes('btn-back') || content.includes('btn-preview-back') || content.includes('nav-back');
  const hasBottomNav = content.includes('bottom') || content.includes('vanvi-bottom-dock') || content.includes('vanvi-navigation');

  // Determine page status
  let status = 'PASS';
  if (issues.length > 0) {
    status = 'NEEDS IMPROVEMENT';
  } else if (warnings.length > 2) {
    status = 'NEEDS IMPROVEMENT';
  }

  report.push({
    file,
    status,
    title: titleMatch ? titleMatch[1].trim() : 'N/A',
    issues,
    warnings,
    isHome,
    hasBackBtn,
    hasBottomNav,
    sizeKb: Math.round(content.length / 1024)
  });
});

console.log('\n=== AUDIT SUMMARY ===');
let passCount = 0;
let needsImprovementCount = 0;
let brokenCount = 0;

report.forEach(r => {
  if (r.status === 'PASS') passCount++;
  else if (r.status === 'NEEDS IMPROVEMENT') needsImprovementCount++;
  else brokenCount++;

  if (r.issues.length > 0 || r.warnings.length > 0) {
    console.log(`\n📄 ${r.file} [${r.status}]:`);
    if (r.issues.length) console.log('  ❌ Issues:', r.issues);
    if (r.warnings.length) console.log('  ⚠️ Warnings:', r.warnings);
  }
});

console.log(`\n========================================`);
console.log(`TOTAL AUDITED PAGES: ${report.length}`);
console.log(`PASS: ${passCount}`);
console.log(`NEEDS IMPROVEMENT: ${needsImprovementCount}`);
console.log(`BROKEN: ${brokenCount}`);
console.log(`========================================`);

fs.writeFileSync('scratch/audit_results.json', JSON.stringify(report, null, 2));
