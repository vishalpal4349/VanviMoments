const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

console.log(`Checking ${files.length} HTML files for missing getElementById...`);

let totalIssues = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Find all inline scripts
  const scripts = content.match(/<script[\s\S]*?<\/script>/gi) || [];
  const scriptContent = scripts.map(s => s.replace(/<script[^>]*>/, '').replace(/<\/script>/, '')).join('\n');
  
  // Match getElementById('...')
  const regex = /getElementById\(['"]([a-zA-Z0-9_-]+)['"]\)/g;
  let match;
  const missing = [];
  while ((match = regex.exec(scriptContent)) !== null) {
    const id = match[1];
    // Check if ID exists anywhere in HTML
    const idAttr = new RegExp(`id=["']${id}["']`, 'i');
    if (!idAttr.test(content)) {
      if (!missing.includes(id)) missing.push(id);
    }
  }
  
  if (missing.length > 0) {
    console.log(`❌ ${file} has missing IDs:`, missing);
    totalIssues += missing.length;
  } else {
    // console.log(`✅ ${file}: 0 missing IDs`);
  }
});

console.log(`Total missing ID issues found across all pages: ${totalIssues}`);

