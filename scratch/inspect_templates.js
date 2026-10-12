const tData = require('../js/vanvi-templates-data.js');
const list = tData.getAll();

console.log(`Found ${list.length} templates in VanviTemplatesData:\n`);
list.forEach((t, i) => {
  console.log(`${i+1}. id: "${t.id}" | name: "${t.name}" | price: ₹${t.price} | free: ${t.isFree} | builderPath: "${t.builderPath || ''}" | templatePath: "${t.templatePath || ''}"`);
});
