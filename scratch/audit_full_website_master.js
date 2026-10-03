const fs = require('fs');
const path = require('path');

console.log('========================================================');
console.log('   VANVI MOMENTS — MASTER WEBSITE DEEP AUDIT & ANALYSIS ');
console.log('========================================================\n');

// 1. Discover all root HTML pages
const allHtmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
console.log(`Found ${allHtmlFiles.length} HTML pages in project root.\n`);

const results = {
  totalPages: allHtmlFiles.length,
  pagesWithBrokenLinks: [],
  pagesWithDeadButtons: [],
  pagesWithJsErrors: [],
  pagesWithOverflowIssues: [],
  pagesSummary: []
};

// All valid internal pages
const validInternalPages = new Set([
  ...allHtmlFiles,
  'templates/birthday-wish-01/index.html',
  'templates/birthday-wish-02/index.html',
  'templates/birthday-3d-candle-surprise/index.html',
  'templates/birthday-white-bloom-001/index.html',
  'templates/apology-dashboard/index.html',
  'templates/birthday-gf/index.html'
]);

allHtmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const pageReport = {
    file,
    title: (content.match(/<title>([^<]+)<\/title>/i) || [])[1] || 'No Title',
    linksCount: 0,
    brokenLinks: [],
    deadButtons: [],
    hasViewport: content.includes('name="viewport"'),
    hasOverflowXLock: content.includes('overflow-x') && (content.includes('hidden') || content.includes('clip')),
    jsSyntaxOk: true
  };

  // Check script tags for JS syntax
  const scripts = content.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi) || [];
  scripts.forEach((s, idx) => {
    // skip external scripts with src
    if (s.includes('src=')) return;
    const code = s.replace(/<script[\s\S]*?>/i, '').replace(/<\/script>/i, '').trim();
    if (!code) return;
    try {
      new Function(code);
    } catch (e) {
      pageReport.jsSyntaxOk = false;
      results.pagesWithJsErrors.push({ file, scriptIdx: idx, error: e.message });
    }
  });

  // Extract all href attributes
  const hrefMatches = [...content.matchAll(/href=["']([^"']+)["']/g)].map(m => m[1]);
  pageReport.linksCount = hrefMatches.length;

  hrefMatches.forEach(href => {
    // Ignore external URLs, mailto, tel, javascript, hash anchors
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') ||
        href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') ||
        href.startsWith('#') || href.startsWith('data:')) {
      return;
    }

    const cleanHref = href.split('?')[0].split('#')[0];
    if (cleanHref && !validInternalPages.has(cleanHref)) {
      // Check if file exists relative to root
      if (!fs.existsSync(cleanHref)) {
        pageReport.brokenLinks.push(href);
      }
    }
  });

  // Check for dead buttons (buttons or links with href="#" without onclick or role or data-action)
  const deadAnchorMatches = [...content.matchAll(/<a\s+[^>]*href=["']#["'][^>]*>/gi)];
  deadAnchorMatches.forEach(aTag => {
    const tag = aTag[0];
    if (!tag.includes('onclick') && !tag.includes('data-') && !tag.includes('role=') && !tag.includes('id=') && !tag.includes('class=')) {
      pageReport.deadButtons.push(tag);
    }
  });

  if (pageReport.brokenLinks.length > 0) {
    results.pagesWithBrokenLinks.push({ file, links: pageReport.brokenLinks });
  }
  if (pageReport.deadButtons.length > 0) {
    results.pagesWithDeadButtons.push({ file, count: pageReport.deadButtons.length });
  }
  if (!pageReport.hasOverflowXLock) {
    results.pagesWithOverflowIssues.push(file);
  }

  results.pagesSummary.push(pageReport);
});

// Output Detailed Report
console.log('--- 1. PAGES DISCOVERY & STATUS ---');
results.pagesSummary.forEach(p => {
  const statusIcon = p.brokenLinks.length === 0 && p.jsSyntaxOk ? '✅' : '⚠️';
  console.log(`${statusIcon} ${p.file.padEnd(28)} | Links: ${String(p.linksCount).padStart(3)} | JS: ${p.jsSyntaxOk ? 'OK' : 'ERR'} | Title: ${p.title.slice(0, 45)}`);
});

console.log('\n--- 2. JS SYNTAX ERRORS ---');
if (results.pagesWithJsErrors.length === 0) {
  console.log('✅ ZERO inline JavaScript syntax errors across all pages!');
} else {
  console.log(`❌ Found errors on ${results.pagesWithJsErrors.length} scripts:`, results.pagesWithJsErrors);
}

console.log('\n--- 3. BROKEN INTERNAL LINKS ---');
if (results.pagesWithBrokenLinks.length === 0) {
  console.log('✅ ZERO broken internal links detected across entire website!');
} else {
  console.log(`⚠️ Found broken links on ${results.pagesWithBrokenLinks.length} pages:`);
  results.pagesWithBrokenLinks.forEach(b => console.log(`  - ${b.file}:`, b.links));
}

console.log('\n--- 4. MOBILE OVERFLOW-X LOCK AUDIT ---');
if (results.pagesWithOverflowIssues.length === 0) {
  console.log('✅ 100% of pages enforce responsive overflow-x protection!');
} else {
  console.log(`⚠️ Pages without explicit overflow-x lock:`, results.pagesWithOverflowIssues);
}
