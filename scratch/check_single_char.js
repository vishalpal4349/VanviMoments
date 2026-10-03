const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = />([^<]+)</g;
let m;
const singleChar = [];
while ((m = regex.exec(html)) !== null) {
  const t = m[1].trim();
  if (t.length === 1 && !['♡', '✦', '✧', '×', '⌕', '⌂', '◌', '＋', '👤', '🎬', '🔐', '🧩', '🎂', '❤️', '💍', '👥', '📸', '🎁', '👑', '💌', '🏡', '🤖', '💎', '🎡', '✨', '💬', '📚', '←', '→', '·', '&', '✓', 'i'].includes(t)) {
    const line = html.substring(0, m.index).split('\n').length;
    singleChar.push({ line, char: t });
  }
}
console.log('Other single chars:', singleChar);

