const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const headerMatch = content.match(/<header\b[^>]*>(.*?)<\/header>/is);
  if (headerMatch) {
    const h = headerMatch[1];
    const linksAndBtns = [...h.matchAll(/<(a|button)\b([^>]*)>(.*?)<\/\1>/gis)].map(m => {
      const attrs = m[2];
      const text = m[3].replace(/<[^>]+>/g, '').trim();
      const cls = (/class=["']([^"']*)["']/i.exec(attrs) || [])[1] || '';
      return { tag: m[1], cls, text: text.substring(0, 20) };
    });
    // Filter out brand logo
    const nonBrand = linksAndBtns.filter(item => !item.cls.includes('brand') && !item.text.includes('VANVI'));
    if (nonBrand.length > 2) {
      console.log(`\n[${file}] header has ${nonBrand.length} elements:`);
      nonBrand.forEach(b => console.log(`   <${b.tag} class="${b.cls}"> "${b.text}"`));
    }
  }
});
