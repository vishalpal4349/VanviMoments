const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// 1. In index.html
const indexPath = path.join(ROOT, 'index.html');
if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf8');

  content = content.replace(/https:\/\/cdn\.cutiepage\.in\/static\/products\/special-apology\.webp/g,
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80');

  content = content.replace(/https:\/\/cdn\.cutiepage\.in\/static\/products\/girlfriend-day\.jpg/g,
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80');

  content = content.replace(/https:\/\/cdn\.cutiepage\.in\/static\/products\/birthday-wish4-v2\.png/g,
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80');

  content = content.replace(/https:\/\/cdn\.cutiepage\.in\/static\/products\/friendship-day\.jpg/g,
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80');

  content = content.replace(/https:\/\/cdn\.cutiepage\.in\/static\/products\/birthday-wish1\.jpg/g,
    'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80');

  content = content.replace(/https:\/\/cdn\.cutiepage\.in\/static\/products\/birthday-wish2\.jpg/g,
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80');

  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('index.html images updated to high-res Unsplash!');
}

// 2. In js/vanvi-products-data.js
const prodDataPath = path.join(ROOT, 'js', 'vanvi-products-data.js');
if (fs.existsSync(prodDataPath)) {
  let content = fs.readFileSync(prodDataPath, 'utf8');

  content = content.replace(/photo-1520523839898-507125cd53c1/g,
    'photo-1512909006721-3d6018887383');

  fs.writeFileSync(prodDataPath, content, 'utf8');
  console.log('vanvi-products-data.js image updated!');
}

console.log('ALL IMAGE REPLACEMENTS COMPLETE!');
