const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
console.log('====================================================');
console.log('   VANVI MOMENTS — COMPLETE ARCHITECTURAL AUDIT   ');
console.log('====================================================\n');

// 1. Pages check
const allFiles = fs.readdirSync(root);
const htmlFiles = allFiles.filter(f => f.endsWith('.html'));
console.log(`1. HTML Pages Total: ${htmlFiles.length}`);

// 2. CSS Check
const cssFiles = allFiles.filter(f => f.endsWith('.css'));
console.log(`2. CSS Design System Files: ${cssFiles.join(', ')}`);
cssFiles.forEach(f => {
  const c = fs.readFileSync(path.join(root, f), 'utf8');
  console.log(`   - ${f}: ${c.length} bytes`);
});

// 3. Check JS Files
const jsDir = path.join(root, 'js');
const jsFiles = fs.existsSync(jsDir) ? fs.readdirSync(jsDir) : [];
console.log(`\n3. Client JS Modules: ${jsFiles.join(', ')}`);

// 4. Templates Data
const templatesData = require(path.join(root, 'js', 'vanvi-templates-data.js'));
console.log(`\n4. Master Templates Catalog:`);
console.log(`   - Total catalog templates: ${templatesData.templates.length}`);
console.log(`   - Categories count: ${Object.keys(templatesData.categories).length}`);
const freeTpls = templatesData.templates.filter(t => t.isFree || t.price === 0);
console.log(`   - Free: ${freeTpls.length} | Paid: ${templatesData.templates.length - freeTpls.length}`);

// 5. Audit dead links or javascript:void(0) across all pages
let totalDeadAnchors = 0;
let totalForms = 0;
let totalButtons = 0;

htmlFiles.forEach(page => {
  const content = fs.readFileSync(path.join(root, page), 'utf8');
  const deadMatch = content.match(/href=["'](?:#|javascript:void\(0\);?)["']/gi) || [];
  totalDeadAnchors += deadMatch.length;
  const formMatch = content.match(/<form\b/gi) || [];
  totalForms += formMatch.length;
  const btnMatch = content.match(/<button\b/gi) || [];
  totalButtons += btnMatch.length;
});
console.log(`\n5. Global Interactivity Metrics:`);
console.log(`   - Total Buttons: ${totalButtons}`);
console.log(`   - Total Forms: ${totalForms}`);
console.log(`   - Dead Anchors (href="#" or void): ${totalDeadAnchors}`);

// 6. Server Endpoints Audit
const serverDir = path.join(root, 'server');
const routesDir = path.join(serverDir, 'routes');
const routeFiles = fs.existsSync(routesDir) ? fs.readdirSync(routesDir) : [];
console.log(`\n6. Server Express Routes (${routeFiles.length}): ${routeFiles.join(', ')}`);

console.log('\nAudit complete.');
