const fs = require('fs');

if (fs.existsSync('server/data/store.json')) {
  let raw = fs.readFileSync('server/data/store.json', 'utf8');
  const count = (raw.match(/cutiepage\.in/g) || []).length;
  console.log('cutiepage occurrences in store.json before:', count);
  if (count > 0) {
    raw = raw.replace(/https:\/\/cdn\.cutiepage\.in\/static\/products\/birthday-wish1\.jpg/g, '/assets/templates/vanvi-birthday-bold-luxe.jpg');
    raw = raw.replace(/https:\/\/cdn\.cutiepage\.in\/static\/products\/birthday-wish2\.jpg/g, '/assets/templates/vanvi-birthday-showcase.jpg');
    raw = raw.replace(/https:\/\/cdn\.cutiepage\.in\/template-seeds\/girlfriends-day\/cover\.png/g, '/assets/templates/vanvi-girlfriend-love.jpg');
    raw = raw.replace(/https:\/\/cdn\.cutiepage\.in\/static\/special-apology\.webp/g, '/assets/templates/vanvi-apology-luxe.jpg');
    raw = raw.replace(/https:\/\/cdn\.cutiepage\.in\/template-seeds\/netflix-story\/cover\.webp/g, '/assets/templates/vanvi-cinema-story.jpg');
    raw = raw.replace(/https:\/\/cdn\.cutiepage\.in\/template-previews\/[^\"]+/g, '/assets/templates/vanvi-birthday-vibrant.jpg');
    raw = raw.replace(/https:\/\/cdn\.cutiepage\.in\/static\/[^\"]+/g, '/assets/templates/vanvi-birthday-vibrant.jpg');
    raw = raw.replace(/https:\/\/cdn\.cutiepage\.in\/template-seeds\/[^\"]+/g, '/assets/templates/vanvi-love-romance-showcase.jpg');
    const remaining = (raw.match(/cutiepage\.in/g) || []).length;
    console.log('Remaining occurrences in store.json:', remaining);
    fs.writeFileSync('server/data/store.json', raw, 'utf8');
  }
}
