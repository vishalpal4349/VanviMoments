const fs = require('fs');
const content = fs.readFileSync('js/vanvi-templates-data.js', 'utf8');
const vm = require('vm');
const sandbox = { window: {}, document: {}, VANVI_CARD_CONFIG: {} };
vm.createContext(sandbox);
vm.runInContext(content, sandbox);
const list = sandbox.VANVI_TEMPLATES || sandbox.window.VANVI_TEMPLATES;
console.log('Total templates in registry:', list.length);
list.forEach((t, i) => {
  const thumbExists = fs.existsSync(t.thumbnail);
  console.log(`[${i+1}] id: ${t.id} | cat: ${t.category} | name: ${t.name.slice(0, 35)} | thumb: ${t.thumbnail} | exists: ${thumbExists}`);
});

// Also check all directories in templates/
const templateDirs = fs.readdirSync('templates', { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

console.log('\n--- TEMPLATE FOLDERS ON DISK --- (Total:', templateDirs.length, ')');
templateDirs.forEach(dir => {
  const inRegistry = list.some(t => t.id === dir || (t.aliases && t.aliases.includes(dir)));
  console.log(`folder: ${dir} | inRegistry: ${inRegistry}`);
});
