const fs = require('fs');
const path = require('path');
const tData = require('../js/vanvi-templates-data.js');
const allTemplates = tData.getAll();

const dirs = fs.readdirSync('templates').filter(f => fs.statSync(path.join('templates', f)).isDirectory());

console.log(`Checking ${dirs.length} template folders against catalog:\n`);
dirs.forEach(d => {
  const match = allTemplates.find(t => t.id === d || t.slug === d || (t.aliases && t.aliases.includes(d)) || (t.builderPath && t.builderPath.includes(d)) || (t.templatePath && t.templatePath.includes(d)));
  if (match) {
    console.log(`✔ [${d}] -> Catalog ID: "${match.id}", Name: "${match.name}", Price: ₹${match.price}, Free: ${match.isFree}`);
  } else {
    console.log(`❓ [${d}] -> Not directly matched in catalog`);
  }
});
