const fs = require('fs');
const path = 'C:/Users/RISHU KUMARI/.gemini/antigravity/brain/b2664d99-16c5-4e07-bacf-ee05919844dd/.user_uploaded/media_1789631851556.html';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('<h1') || l.includes('<h2') || l.includes('word-stage') || l.includes('hero')) {
    console.log(`${i+1}: ${l.substring(0, 140)}`);
  }
});
