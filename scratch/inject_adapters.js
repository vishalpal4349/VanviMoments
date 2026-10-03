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
    let content = fs.readFileSync(p, 'utf8');
    const hasAdapter = content.includes('template-adapter.js');
    if (!hasAdapter) {
      const inject = '  <script src="../../js/vanvi-api.js"></script>\n  <script src="../../js/template-adapter.js"></script>\n</body>';
      content = content.replace('</body>', inject);
      fs.writeFileSync(p, content, 'utf8');
      console.log(`Injected adapter into: ${f}`);
    } else {
      console.log(`Already has adapter: ${f}`);
    }
  }
});
