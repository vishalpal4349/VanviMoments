const fs = require('fs');
const VanviTemplatesData = require('../js/vanvi-templates-data.js');

const files = fs.readdirSync('.').filter(f => f.startsWith('category-') && f.endsWith('.html'));

const all = VanviTemplatesData.getAll();
console.log(`Loaded ${all.length} templates from VanviTemplatesData.`);

const catCounts = {};
all.forEach(t => {
  catCounts[t.category] = (catCounts[t.category] || 0) + 1;
});
console.log('Category template counts in VanviTemplatesData:', catCounts);

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('window.location.replace')) {
    console.log(`- ${f} -> Redirects`);
    return;
  }
  const getCat = content.match(/getByCategory\('([^']+)'\)/);
  const cat = getCat ? getCat[1] : (content.includes('getFreeOnly') ? 'FREE' : (content.includes('getPremiumOnly') ? 'PREMIUM' : 'UNKNOWN'));
  const hasCardsCss = content.includes('vanvi-template-cards.css');
  const hasDataJs = content.includes('vanvi-templates-data.js');
  const count = cat === 'FREE' ? VanviTemplatesData.getFreeOnly().length :
                cat === 'PREMIUM' ? VanviTemplatesData.getPremiumOnly().length :
                VanviTemplatesData.getByCategory(cat).length;
  console.log(`- ${f} | Query: "${cat}" | Found ${count} items | CSS: ${hasCardsCss} | JS: ${hasDataJs}`);
});
