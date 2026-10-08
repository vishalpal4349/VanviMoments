const fs = require('fs');
const glob = [
  'birthday-3d-candle',
  'birthday-3d-candle-surprise',
  'birthday-white-bloom',
  'birthday-wish-01',
  'birthday-wish-02',
  'botanical-blush-wedding',
  'constellation-love',
  'golden-anniversary',
  'retro-polaroid-wall',
  'sincere-letter',
  'temple-royal-wedding'
];

let updated = 0;
glob.forEach(dir => {
  const file = `templates/${dir}/builder.html`;
  if (fs.existsSync(file)) {
    let c = fs.readFileSync(file, 'utf8');
    if (!c.includes('vanvi-global-experience.css')) {
      c = c.replace('<link rel="stylesheet" href="../../css/vanvi-custom-builder.css">', '<link rel="stylesheet" href="../../css/vanvi-global-experience.css">\n  <link rel="stylesheet" href="../../css/vanvi-custom-builder.css">');
      fs.writeFileSync(file, c, 'utf8');
      updated++;
      console.log('Updated:', file);
    }
  }
});
console.log('Template builders updated:', updated);
