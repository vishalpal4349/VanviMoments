const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(targetPath, 'utf8');

content = content.replace(/https:\/\/cdn\.cutiepage\.in\/template-seeds\/girlfriends-day\/cover\.png/g, 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80');
content = content.replace(/https:\/\/cdn\.cutiepage\.in\/template-seeds\/friendship-day\/cover\.webp/g, 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80');
content = content.replace(/https:\/\/cdn\.cutiepage\.in\/static\/products\/birthday-wish1\.jpg/g, 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80');
content = content.replace(/https:\/\/cdn\.cutiepage\.in\/static\/products\/birthday-wish2\.jpg/g, 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80');
content = content.replace(/https:\/\/cdn\.cutiepage\.in\/static\/special-apology\.webp/g, 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80');
content = content.replace(/https:\/\/pub-9a93db46c01f4a47846cf3de6e3f148e\.r2\.dev\/static\/birthday-special-cover\.jpg/g, 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80');

fs.writeFileSync(targetPath, content, 'utf8');
console.log('✅ index.html curated celebration imagery updated successfully!');
