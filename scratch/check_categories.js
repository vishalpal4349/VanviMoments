const fs = require('fs');

const catPages = fs.readdirSync('.').filter(f => f.startsWith('category-'));
catPages.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const back = content.match(/<a[^>]*class=["'][^"']*(btn-back|back-btn|btn-nav-back|vanvi-btn-back|nav-back|back-link)[^"']*["'][^>]*>[\s\S]*?<\/a>/i);
  const breadcrumb = content.match(/<[^>]*class=["'][^"']*(breadcrumb|nav-ribbon|crumbs)[^"']*["'][^>]*>/i);
  console.log(file, '-> Back:', back ? back[0].replace(/\s+/g, ' ').substring(0, 60) : 'NONE', '| Breadcrumb:', !!breadcrumb);
});
