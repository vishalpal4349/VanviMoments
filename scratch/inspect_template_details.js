const fs = require('fs');
const list = ['birthday-wish-01', 'birthday-wish-02', 'constellation-love', 'golden-anniversary', 'retro-polaroid-wall', 'sincere-letter'];

list.forEach(f => {
  const content = fs.readFileSync('templates/' + f + '/index.html', 'utf8');
  const ids = (content.match(/id="([^"]+)"/g) || []).slice(0, 10).join(', ');
  console.log(`${f} IDs: ${ids}`);
});
