const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const regex = /<section[\s\S]*?<\/section>/gi;
let m;
let idx = 1;
while ((m = regex.exec(c)) !== null) {
  const s = m[0];
  const h = (s.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i) || [])[1] || '';
  const cleanH = h.replace(/<[^>]+>/g, '').trim().slice(0, 45);
  const tag = (s.match(/<section[^>]*>/i) || [])[0] || '';
  console.log(idx++ + ': ' + tag + ' --> ' + cleanH);
}
