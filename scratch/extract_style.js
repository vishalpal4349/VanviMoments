const fs = require('fs');
const html = fs.readFileSync('scratch/vercel_raw.html', 'utf8');

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
if (styleMatch) {
  console.log('Style block found! Length:', styleMatch[1].length);
  fs.writeFileSync('scratch/style.css', styleMatch[1], 'utf8');
  console.log('Saved to scratch/style.css');
} else {
  console.log('No style block found');
}
