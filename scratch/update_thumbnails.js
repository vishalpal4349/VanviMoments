const fs = require('fs');

let file = fs.readFileSync('js/vanvi-templates-data.js', 'utf8');

const replacements = [
  { id: 'ivory-arch-wedding', to: "thumbnail: 'assets/templates/vanvi-ivory-arch-wedding.jpg'" },
  { id: 'hues-whispers-luxe', to: "thumbnail: 'assets/templates/hues-whispers-luxe.jpg'" },
  { id: 'the-grand-royal-palace-wedding', to: "thumbnail: 'assets/templates/royal-palace-wedding.jpg'" },
  { id: 'royal-udaivilas-baithak', to: "thumbnail: 'assets/templates/golden-lake-collection.jpg'" },
  { id: 'royal-vivah-lagna', to: "thumbnail: 'assets/templates/marigold-garden-vivah.jpg'" },
  { id: 'birthday-gf', to: "thumbnail: 'assets/templates/vanvi-girlfriend-love.jpg'" },
  { id: 'random-act-of-love', to: "thumbnail: 'assets/templates/vanvi-girlfriend-love.jpg'" },
  { id: 'apology-dashboard', to: "thumbnail: 'assets/templates/vanvi-apology-luxe.jpg'" },
  { id: 'birthday-cinema', to: "thumbnail: 'assets/templates/vanvi-cinema-story.jpg'" },
  { id: 'royal-heritage-cinema', to: "thumbnail: 'assets/templates/vanvi-cinema-story.jpg'" },
  { id: 'best-friend-chaos', to: "thumbnail: 'assets/templates/vanvi-bestie-memories.jpg'" },
  { id: 'birthday-3d-candle-surprise', to: "thumbnail: 'assets/templates/vanvi-birthday-vibrant.jpg'" },
  { id: 'birthday-wish-1', to: "thumbnail: 'assets/templates/vanvi-birthday-bold-luxe.jpg'" },
  { id: 'golden-anniversary', to: "thumbnail: 'assets/templates/vanvi-anniversary-gold-luxe.jpg'" }
];

replacements.forEach(r => {
  const blockRegex = new RegExp('(id:\\s*[\'"]' + r.id + '[\'"][\\s\\S]*?)(thumbnail:\\s*[\'"][^\'"]+[\'"])');
  const match = file.match(blockRegex);
  if (match) {
    file = file.replace(match[0], match[1] + r.to);
    console.log('Updated thumbnail for:', r.id);
  } else {
    console.log('Block not found for:', r.id);
  }
});

fs.writeFileSync('js/vanvi-templates-data.js', file, 'utf8');
console.log('Successfully updated js/vanvi-templates-data.js');
