const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let buttonCount = 0;
let inlineTransformCount = 0;
const problematicButtons = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const buttons = content.match(/<(button|a)[^>]*class=["'][^"']*(btn|primary|cta)[^"']*["'][^>]*>/gi) || [];
  buttonCount += buttons.length;
  buttons.forEach(b => {
    if (b.includes('translate') || b.includes('transform')) {
      inlineTransformCount++;
      problematicButtons.push({ file: f, tag: b.slice(0, 100) });
    }
  });
});

console.log('Total button/CTA matches:', buttonCount);
console.log('Inline transform count:', inlineTransformCount);
if (problematicButtons.length > 0) {
  console.log('Sample problematic buttons:', problematicButtons.slice(0, 5));
}
