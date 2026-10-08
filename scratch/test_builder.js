const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('builder.html', 'utf8');

console.log('Builder Hub File size:', html.length);
if (!html.includes('templates/birthday-3d-candle/builder.html')) throw new Error('Missing birthday-3d-candle builder route');
if (!html.includes('templates/constellation-love/builder.html')) throw new Error('Missing constellation-love builder route');
if (!html.includes('templates/retro-polaroid-wall/builder.html')) throw new Error('Missing retro-polaroid-wall builder route');
if (!html.includes('templates/temple-royal-wedding/builder.html')) throw new Error('Missing temple-royal-wedding builder route');
if (!html.includes('templates/botanical-blush-wedding/builder.html')) throw new Error('Missing botanical-blush-wedding builder route');

const templates = [
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

templates.forEach(t => {
  const builderPath = path.join('templates', t, 'builder.html');
  if (!fs.existsSync(builderPath)) {
    throw new Error(`Missing bespoke builder file for template: ${t}`);
  }
  const content = fs.readFileSync(builderPath, 'utf8');
  if (!content.includes('vanvi-builder-core.js') && !content.includes('vanvi-api.js')) {
    throw new Error(`Builder ${t} missing builder engine script`);
  }
});

console.log('ALL 11 BESPOKE BUILDERS AND ROUTER CHECKS PASSED!');
