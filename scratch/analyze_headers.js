const fs = require('fs');

const rootPages = fs.readdirSync('.').filter(f => f.endsWith('.html') && !f.startsWith('scratch'));
const results = [];

rootPages.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Find headers or top-nav bars
  const headerMatch = content.match(/<header[^>]*>[\s\S]*?<\/header>/i);
  const backMatch = content.match(/<a[^>]*class=["'][^"']*(btn-back|back-btn|btn-nav-back|vanvi-btn-back|nav-back|back-link)[^"']*["'][^>]*>[\s\S]*?<\/a>|<button[^>]*class=["'][^"']*(btn-back|back-btn|btn-nav-back|vanvi-btn-back|nav-back|back-link)[^"']*["'][^>]*>[\s\S]*?<\/button>/i);
  const brandMatches = content.match(/<[^>]*class=["'][^"']*(brand|brand-logo|site-logo|header-brand)[^"']*["'][^>]*>/gi) || [];
  const breadcrumbMatch = content.match(/<[^>]*class=["'][^"']*(breadcrumb|nav-ribbon|crumbs|page-ribbon)[^"']*["'][^>]*>[\s\S]*?<\/[^>]+>/i);

  results.push({
    file,
    hasHeader: !!headerMatch,
    backBtnHtml: backMatch ? backMatch[0].substring(0, 100) : 'NONE',
    brandCount: brandMatches.length,
    hasBreadcrumb: !!breadcrumbMatch,
    breadcrumbHtml: breadcrumbMatch ? breadcrumbMatch[0].substring(0, 100) : 'NONE'
  });
});

console.log(JSON.stringify(results, null, 2));
