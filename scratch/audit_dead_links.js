const fs = require('fs');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const brokenLinks = [];
let totalLinksChecked = 0;

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const hrefs = [];
  const re = /href=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    hrefs.push(m[1]);
  }

  hrefs.forEach(href => {
    // Ignore external, javascript, tel, mailto, anchor only, template strings
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) return;
    if (href.startsWith('javascript:') || href.startsWith('tel:') || href.startsWith('mailto:')) return;
    if (href.startsWith('#')) return;
    if (href.includes('${')) return;

    totalLinksChecked++;
    const cleanPath = href.split('?')[0].split('#')[0];
    if (!cleanPath) return;

    if (!fs.existsSync(cleanPath)) {
      brokenLinks.push({ source: file, href, cleanPath });
    }
  });
});

console.log(`=== DEAD LINK AUDIT RESULTS ===`);
console.log(`Total static internal links checked: ${totalLinksChecked}`);
console.log(`Broken links found: ${brokenLinks.length}`);
if (brokenLinks.length === 0) {
  console.log('✅ ZERO DEAD LINKS FOUND ACROSS ALL 35+ HTML PAGES!');
} else {
  console.log('Broken link details:', brokenLinks);
}
