const fs = require('fs');
const path = require('path');

const rootPages = fs.readdirSync('.').filter(f => f.endsWith('.html') && !f.startsWith('scratch'));

console.log('Inspecting', rootPages.length, 'pages for navigation & layout glitches...');

const issues = [];

rootPages.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Check 1: Duplicate Logos in single file
  const brandLogos = content.match(/assets\/vanvi-moments-logo-header\.png|assets\/favicon\.svg|header-brand-img|brand-logo/g) || [];
  
  // Check 2: Back button placement: is it present? where is it?
  const backButtons = content.match(/<[^>]+(vanvi-btn-back|btn-nav-back|back-btn|btn-back|clay-nav-back)[^>]*>/gi) || [];

  // Check 3: Breadcrumb ribbon: how is it defined?
  const breadcrumbs = content.match(/<[^>]+(breadcrumb|nav-ribbon|crumbs|page-ribbon)[^>]*>/gi) || [];

  // Check 4: Check if header has duplicate buttons or links
  const createBtns = content.match(/href=["'](builder\.html|templates\.html)["'][^>]*>\+?\s*(Create|Make|Start)/gi) || [];

  // Check 5: Look for "thin line" or "weird bar" CSS or markup
  const glitchyBars = content.match(/border-bottom:\s*1px|divider|thin-line|nav-line|accent-line/gi) || [];

  issues.push({
    file,
    brandLogoCount: brandLogos.length,
    backBtnCount: backButtons.length,
    backButtons: backButtons.map(b => b.substring(0, 80)),
    breadcrumbCount: breadcrumbs.length,
    breadcrumbs: breadcrumbs.map(b => b.substring(0, 80)),
    createBtnCount: createBtns.length
  });
});

console.log('--- PAGES WITHOUT BACK BUTTON ---');
const noBack = issues.filter(i => i.backBtnCount === 0 && !['index.html', '404.html'].includes(i.file));
console.log(noBack.map(i => i.file));

console.log('--- PAGES WITH MULTIPLE BACK BUTTONS ---');
const multiBack = issues.filter(i => i.backBtnCount > 1);
console.log(multiBack.map(i => ({ file: i.file, count: i.backBtnCount, btns: i.backButtons })));

console.log('--- PAGES WITHOUT BREADCRUMB RIBBON ---');
const noCrumbs = issues.filter(i => i.breadcrumbCount === 0 && !['index.html', '404.html', 'login.html', 'signup.html', 'forgot-password.html'].includes(i.file));
console.log(noCrumbs.map(i => i.file));
