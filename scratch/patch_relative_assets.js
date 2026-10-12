const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/RISHU KUMARI/VanviMoments/templates/royal-vivah-lagna';
['index.html', 'builder.html', 'save-the-date.html'].forEach(file => {
  const p = path.join(dir, file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.split('"/assets/').join('"./assets/');
    fs.writeFileSync(p, content, 'utf8');
    console.log(file, 'successfully converted to ./assets/');
  }
});
