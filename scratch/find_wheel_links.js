const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const results = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Match any <a> tags
  const aRegex = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = aRegex.exec(content)) !== null) {
    const target = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (/wheel|spin|fortune|reward/i.test(text) || /wheel|spin|fortune|reward/i.test(target)) {
      results.push({ file, type: 'a', text, target });
    }
  }

  // Match any <button> tags
  const btnRegex = /<button\s+[^>]*onclick=["']([^"']*)["'][^>]*>([\s\S]*?)<\/button>/gi;
  while ((match = btnRegex.exec(content)) !== null) {
    const target = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (/wheel|spin|fortune|reward/i.test(text) || /wheel|spin|fortune|reward/i.test(target)) {
      results.push({ file, type: 'button', text, target });
    }
  }
});

console.log('Total found:', results.length);
results.forEach(r => {
  console.log(`[${r.file}] "${r.text}" -> ${r.target}`);
});
