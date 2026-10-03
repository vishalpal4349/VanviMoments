const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const results = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Check for input tags with value attributes that might have hardcoded names
  const regex = /<input[^>]*value=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (!match[0].includes('type="hidden"') && !match[0].includes('type="submit"') && !match[0].includes('type="button"')) {
      results.push({ file: f, tag: match[0], value: match[1] });
    }
  }
});

console.log(JSON.stringify(results, null, 2));
