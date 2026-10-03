const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const hasBack = c.includes('btn-back') || c.includes('btn-header-back') || c.includes('history.back()') || c.includes('Back') || c.includes('←');
  const brandMatch = c.match(/<a[^>]*?(?:brand|logo)[^>]*?>([\s\S]*?)<\/a>/i);
  const brandHref = brandMatch ? brandMatch[0].match(/href=["']([^"']+)["']/i) : null;
  
  console.log(`${f}:`);
  console.log(`  - Has Back button: ${hasBack}`);
  console.log(`  - Brand link: ${brandHref ? brandHref[1] : 'none/not <a>'}`);
});

