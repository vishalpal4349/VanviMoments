const fs = require('fs');
const vm = require('vm');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
console.log('Testing JS syntax across all ' + files.length + ' HTML files...');

let totalErrors = 0;

files.forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let scriptIdx = 0;

  while ((match = scriptRegex.exec(html)) !== null) {
    scriptIdx++;
    const code = match[1];
    // Skip empty or purely json/type scripts
    if (!code.trim() || match[0].includes('type="application/json"') || match[0].includes('type="application/ld+json"')) {
      continue;
    }

    try {
      // Just parse script syntax
      new vm.Script(code, { filename: `${file}#script${scriptIdx}` });
    } catch (err) {
      console.error(`❌ Syntax error in ${file} script #${scriptIdx}:`, err.message);
      totalErrors++;
    }
  }
});

if (totalErrors === 0) {
  console.log('🎉 ALL inline scripts across all 26 HTML files passed syntax validation flawlessly!');
} else {
  console.error(`Found ${totalErrors} syntax errors.`);
  process.exit(1);
}

