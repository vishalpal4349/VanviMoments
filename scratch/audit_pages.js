const fs = require('fs');
const path = require('path');

function getAllHtml(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === 'backup_templates_archive' || file === 'scratch') return;
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtml(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

const allPages = getAllHtml('.');
console.log('Total HTML pages found:', allPages.length);

const findings = [];

allPages.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative('.', file).replace(/\\/g, '/');

  // Check 1: Viewport
  const hasVp = content.includes('name="viewport"');
  
  // Check 2: Overflow-X protection
  const hasOverflowProtection = content.includes('overflow-x') || content.includes('vanvi-global-experience.css') || content.includes('vanvi-template-lock.js');

  // Check 3: Back button presence & placement
  const hasBackBtn = /class=["'][^"']*(btn-back|back-btn|btn-nav-back|vanvi-btn-back|nav-back|auth-back|back-link)[^"']*["']/i.test(content) || /id=["']btnBack/i.test(content) || /vanviGoBack\(/i.test(content);

  // Check 4: Logo presence & styling
  const hasLogo = /class=["'][^"']*(brand|brand-link|site-logo|auth-brand|header-brand)[^"']*["']/i.test(content) || /assets\/favicon\.svg|assets\/vanvi-logo/i.test(content);

  // Check 5: Breadcrumbs
  const hasBreadcrumbs = /class=["'][^"']*(breadcrumb|nav-ribbon|crumbs|page-ribbon)[^"']*["']/i.test(content);

  // Check 6: Global Experience CSS
  const hasGlobalExp = content.includes('vanvi-global-experience.css');
  const hasNavCss = content.includes('vanvi-navigation.css');
  const hasNavJs = content.includes('vanvi-navigation.js');
  const hasTemplateLock = content.includes('vanvi-template-lock.js');

  // Check 7: Duplicate buttons or broken elements
  const btnMatches = content.match(/<button[^>]*>|<a[^>]*class=["'][^"']*btn[^"']*["']/gi) || [];

  findings.push({
    file: rel,
    isRoot: !rel.includes('/'),
    isTemplate: rel.startsWith('templates/'),
    hasVp,
    hasBackBtn,
    hasLogo,
    hasBreadcrumbs,
    hasGlobalExp,
    hasNavCss,
    hasNavJs,
    hasTemplateLock,
    btnCount: btnMatches.length
  });
});

const missingGlobalExpRoot = findings.filter(f => f.isRoot && !f.hasGlobalExp).map(f => f.file);
const missingNavJsRoot = findings.filter(f => f.isRoot && !f.hasNavJs && !['404.html'].includes(f.file)).map(f => f.file);
const missingLockTemplates = findings.filter(f => f.isTemplate && !f.hasTemplateLock).map(f => f.file);

console.log('\n--- ROOT PAGES MISSING vanvi-global-experience.css (' + missingGlobalExpRoot.length + ') ---');
console.log(missingGlobalExpRoot);

console.log('\n--- ROOT PAGES MISSING vanvi-navigation.js (' + missingNavJsRoot.length + ') ---');
console.log(missingNavJsRoot);

console.log('\n--- TEMPLATE PAGES MISSING vanvi-template-lock.js (' + missingLockTemplates.length + ') ---');
console.log(missingLockTemplates);
