const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const stats = {
  missingNavCss: [],
  missingNavJs: [],
  missingFonts: [],
  missingFavicon: [],
  total: files.length
};

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (!content.includes('vanvi-navigation.css')) stats.missingNavCss.push(f);
  if (!content.includes('vanvi-navigation.js')) stats.missingNavJs.push(f);
  if (!content.includes('Plus+Jakarta+Sans') && !content.includes('Plus Jakarta Sans')) stats.missingFonts.push(f);
  if (!content.includes('favicon.svg') && !content.includes('rel="icon"')) stats.missingFavicon.push(f);
});

console.log('Total HTML pages audited:', stats.total);
console.log('Missing vanvi-navigation.css (' + stats.missingNavCss.length + '):', stats.missingNavCss);
console.log('Missing vanvi-navigation.js (' + stats.missingNavJs.length + '):', stats.missingNavJs);
console.log('Missing Plus Jakarta font (' + stats.missingFonts.length + '):', stats.missingFonts);
console.log('Missing favicon (' + stats.missingFavicon.length + '):', stats.missingFavicon);
