const fs = require('fs');
const path = require('path');
const folders = [
  'birthday-3d-candle',
  'birthday-3d-candle-surprise',
  'birthday-white-bloom',
  'birthday-wish-01',
  'birthday-wish-02',
  'constellation-love',
  'golden-anniversary',
  'retro-polaroid-wall',
  'sincere-letter'
];

folders.forEach(f => {
  const p = path.join('templates', f, 'index.html');
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    const hasAdapter = html.includes('template-adapter.js');
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const jsonPath = path.join('templates', f, 'template.json');
    const hasJson = fs.existsSync(jsonPath);
    console.log(`${f}: Title="${titleMatch ? titleMatch[1] : 'N/A'}" | Adapter=${hasAdapter} | HasConfig=${hasJson}`);
  } else {
    console.log(`${f}: index.html missing!`);
  }
});
