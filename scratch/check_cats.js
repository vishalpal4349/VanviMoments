const fs = require('fs');
const c = fs.readFileSync('js/vanvi-templates-data.js', 'utf8');

// evaluate in sandbox or extract
const window = {};
eval(c);

const cats = ['birthday', 'love', 'anniversary', 'friendship', 'memories', 'apology', 'family', 'celebration', 'free', 'premium'];
cats.forEach(cat => {
  const items = window.VanviTemplatesData.getByCategory(cat);
  console.log(`${cat}: ${items.length} templates`);
});
