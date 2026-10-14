const fs = require('fs');
const code = fs.readFileSync('js/vanvi-templates-data.js', 'utf8');

// Parse templates
const vm = require('vm');
// Mock root
const sandbox = { window: {}, root: {} };
sandbox.root = sandbox.window;
vm.createContext(sandbox);

try {
  vm.runInContext(code, sandbox);
  const data = sandbox.window.VANVI_TEMPLATES_DATA || sandbox.window.VanviTemplates || sandbox.window;
  console.log('Window keys:', Object.keys(sandbox.window));
  if (sandbox.window.VANVI_TEMPLATES) {
    console.log('VANVI_TEMPLATES count:', sandbox.window.VANVI_TEMPLATES.length);
    sandbox.window.VANVI_TEMPLATES.forEach(t => {
      console.log(`- [${t.id}] ${t.name} (${t.category}, isFree: ${t.isFree})`);
    });
  }
} catch (e) {
  console.error('Error running data script:', e);
}
