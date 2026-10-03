const fs = require('fs');
const html = fs.readFileSync('scratch/vercel_raw.html', 'utf8');

const checkNames = ['b3.png', 'b4.png', 'b5.png', 'b6.png', 'giftbox.png', 'heartAnimation.gif', 'mewmew.gif', 'cake_3d.png', 'image.jpg', 'photo_roses.jpg', 'flower.jpg', 'photo_cake.jpg', 'nap.png', 'hop.png', 'bg.png'];

checkNames.forEach(name => {
  const lines = html.split('\n').filter(l => l.includes(name));
  console.log(`\n=== ${name} (${lines.length} matches) ===`);
  lines.forEach(l => console.log('  ', l.trim()));
});
