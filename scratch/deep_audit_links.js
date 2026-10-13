const fs = require('fs');

function auditFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const aRegex = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  const issues = [];
  while ((m = aRegex.exec(content)) !== null) {
    const fullTag = m[0];
    const target = m[1].trim();
    const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

    if (target.startsWith('#') && target !== '#') {
      const id = target.slice(1).split('?')[0];
      if (!content.includes(`id="${id}"`) && !content.includes(`name="${id}"`)) {
        issues.push({ text, target, reason: `Local ID #${id} not found in ${file}` });
      }
    } else if (target === '#' || target === '' || target === 'javascript:void(0)') {
      if (!fullTag.includes('onclick') && !fullTag.includes('data-') && !fullTag.includes('id=')) {
        issues.push({ text, target, reason: `Empty href without onclick/handler` });
      }
    } else if (!target.startsWith('http') && !target.startsWith('mailto') && !target.startsWith('tel') && !target.startsWith('javascript:')) {
      const cleanPath = target.split('#')[0].split('?')[0];
      if (cleanPath && !cleanPath.includes('${') && !fs.existsSync(cleanPath)) {
        issues.push({ text, target, reason: `File does not exist: ${cleanPath}` });
      }
    }
  }
  return issues;
}

const keyPages = [
  'index.html', 'plans.html', 'rewards.html', 'games.html', 
  'dashboard.html', 'templates.html', 'checkout.html', 'order-success.html',
  'profile.html', 'share.html', 'category-premium.html'
];

keyPages.forEach(p => {
  const issues = auditFile(p);
  console.log(`=== ${p} (${issues.length} issues) ===`);
  issues.forEach(i => console.log(`  [${i.text}] -> ${i.target} (${i.reason})`));
});
