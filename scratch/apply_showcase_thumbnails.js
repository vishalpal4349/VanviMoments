const fs = require('fs');
const path = require('path');

const filePath = path.resolve('js/vanvi-templates-data.js');
let code = fs.readFileSync(filePath, 'utf8');

const tplMap = {
  'birthday-wish-1': 'assets/templates/vanvi-birthday-bold-showcase.jpg',
  'birthday-wish-2': 'assets/templates/vanvi-birthday-showcase.jpg',
  'birthday-bloom': 'assets/templates/vanvi-birthday-showcase.jpg',
  'birthday-3d-candle-surprise': 'assets/templates/vanvi-birthday-bold-showcase.jpg',
  'retro-birthday-polaroid': 'assets/templates/vanvi-retro-polaroid-showcase.jpg',
  'bestie-friendship': 'assets/templates/vanvi-friendship-showcase.jpg',
  'best-friend-chaos': 'assets/templates/vanvi-friendship-showcase.jpg',
  'hues-whispers-luxe': 'assets/templates/vanvi-royal-wedding-showcase.jpg',
  'royal-vows-indian-wedding': 'assets/templates/vanvi-royal-wedding-showcase.jpg',
  'ivory-arch-wedding': 'assets/templates/vanvi-royal-wedding-showcase.jpg',
  'vanvi-royal-wedding': 'assets/templates/vanvi-royal-wedding-showcase.jpg',
  'the-grand-royal-palace-wedding': 'assets/templates/vanvi-royal-wedding-showcase.jpg',
  'royal-udaivilas-baithak': 'assets/templates/vanvi-royal-wedding-showcase.jpg',
  'royal-vivah-lagna': 'assets/templates/vanvi-royal-wedding-showcase.jpg',
  'forever-us': 'assets/templates/vanvi-love-romance-showcase.jpg',
  'celestial-galaxy-3d': 'assets/templates/vanvi-love-romance-showcase.jpg',
  'valentine-constellation': 'assets/templates/vanvi-love-romance-showcase.jpg',
  'little-love': 'assets/templates/vanvi-love-romance-showcase.jpg',
  'moonlight-story': 'assets/templates/vanvi-love-romance-showcase.jpg',
  'golden-anniversary': 'assets/templates/vanvi-anniversary-showcase.jpg',
  'golden-anniversary-walk': 'assets/templates/vanvi-anniversary-showcase.jpg',
  'everlasting-vows': 'assets/templates/vanvi-anniversary-showcase.jpg',
  'golden-dynasty-celebration': 'assets/templates/vanvi-anniversary-showcase.jpg',
  'maa-papa-tribute': 'assets/templates/vanvi-rakshabandhan-showcase.jpg'
};

let count = 0;
for (const [id, newThumb] of Object.entries(tplMap)) {
  const regex = new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]*?thumbnail:\\s*['"])([^'"]+)(['"])`, 'm');
  if (regex.test(code)) {
    code = code.replace(regex, `$1${newThumb}$3`);
    count++;
    console.log(`Updated ${id} -> ${newThumb}`);
  } else {
    console.warn(`Could not find id: ${id}`);
  }
}

fs.writeFileSync(filePath, code, 'utf8');
console.log(`\nSuccessfully applied showcase thumbnails to ${count} templates!`);
