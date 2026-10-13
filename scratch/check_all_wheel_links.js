const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const results = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Match all anchors
  const regex = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const target = m[1];
    const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    // Check if link mentions wheel, spin, rewards, coins, games, explore, plans, dashboard, etc.
    if (/wheel|spin|fortune|reward|arcade/i.test(text)) {
      results.push({ file, text, target });
    }
  }
});

console.log('Found ' + results.length + ' reward/spin/arcade/wheel links:');
results.forEach(r => console.log(`[${r.file}] "${r.text}" -> ${r.target}`));
