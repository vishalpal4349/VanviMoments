const data = require('../js/vanvi-templates-data.js');
const all = data.getAll();
all.forEach((t, i) => {
  console.log(`${i+1}. [${t.id}] "${t.name}" | Cat: ${t.category} | Current: ${t.thumbnail || 'NONE'}`);
});
