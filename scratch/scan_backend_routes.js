const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '..', 'server', 'routes');
const files = fs.readdirSync(routesDir);

console.log('--- BACKEND ROUTES & API ENDPOINTS ---');
files.forEach(f => {
  if (!f.endsWith('.js')) return;
  const content = fs.readFileSync(path.join(routesDir, f), 'utf8');
  console.log('\n=== ' + f + ' ===');
  const lines = content.split('\n');
  lines.forEach(line => {
    const match = line.match(/router\.(get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]/i);
    if (match) {
      console.log('  ' + match[1].toUpperCase() + ' ' + match[2]);
    }
  });
});
