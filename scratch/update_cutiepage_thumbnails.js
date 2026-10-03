const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../js/vanvi-templates-data.js');
let code = fs.readFileSync(targetFile, 'utf8');

const cutiepageThumbs = {
  'birthday-wish-1': 'https://cdn.cutiepage.in/static/products/birthday-wish1.jpg',
  'birthday-wish-2': 'https://cdn.cutiepage.in/static/products/birthday-wish2.jpg',
  'birthday-gf': 'https://cdn.cutiepage.in/template-seeds/girlfriends-day/cover.png',
  'apology-dashboard': 'https://cdn.cutiepage.in/static/special-apology.webp',
  'birthday-white-bloom-001': 'https://pub-9a93db46c01f4a47846cf3de6e3f148e.r2.dev/template-seeds/cute-birthday/intro.gif',
  'birthday-3d-candle-surprise': 'https://cdn.cutiepage.in/template-previews/birthday-surprise/cover-msvjd9ve.jpg',
  'birthday-bloom': 'https://cdn.cutiepage.in/static/sweet-birthday.webp',
  'birthday-cinema': 'https://cdn.cutiepage.in/template-seeds/netflix-story/cover.webp',
  'midnight-cake-surprise': 'https://pub-9a93db46c01f4a47846cf3de6e3f148e.r2.dev/template-seeds/bday-wish-3/pic1.jpg',
  'retro-birthday-polaroid': 'https://cdn.cutiepage.in/static/birthday-wish4-v2.png',
  'little-love': 'https://cdn.cutiepage.in/template-seeds/couples-day/cover.webp',
  'forever-us': 'https://pub-9a93db46c01f4a47846cf3de6e3f148e.r2.dev/static/anniversary-special-cover.jpg',
  'moonlight-story': 'https://cdn.cutiepage.in/template-previews/couples-day-v2/cover-msw1f6yw.png',
  'secret-wax-letter': 'https://pub-9a93db46c01f4a47846cf3de6e3f148e.r2.dev/template-seeds/fathers-day/first.jpeg',
  'the-proposal-reel': 'https://pub-9a93db46c01f4a47846cf3de6e3f148e.r2.dev/template-seeds/wedding-special/pic1.jpg',
  'golden-anniversary-walk': 'https://pub-9a93db46c01f4a47846cf3de6e3f148e.r2.dev/static/anniversary-special-cover.jpg',
  'everlasting-vows': 'https://pub-9a93db46c01f4a47846cf3de6e3f148e.r2.dev/template-seeds/wedding-special/pic1.jpg',
  'royal-wedding-story': 'https://pub-9a93db46c01f4a47846cf3de6e3f148e.r2.dev/template-seeds/wedding-special/pic1.jpg',
  'best-friend-chaos': 'https://cdn.cutiepage.in/template-seeds/friendship-day/cover.webp',
  'memory-puzzle': 'https://pub-9a93db46c01f4a47846cf3de6e3f148e.r2.dev/template-seeds/brothers-day/gallery1.jpeg',
  'memory-note': 'https://pub-9a93db46c01f4a47846cf3de6e3f148e.r2.dev/template-seeds/brothers-day/gallery1.jpeg',
  'timeline-odyssey': 'https://cdn.cutiepage.in/template-seeds/netflix-story/cover.webp',
  'maaf-kar-do': 'https://cdn.cutiepage.in/static/special-apology.webp',
  'maa-papa-tribute': 'https://pub-9a93db46c01f4a47846cf3de6e3f148e.r2.dev/template-seeds/fathers-day/first.jpeg',
  'diwali-sparkler': 'https://cdn.cutiepage.in/template-previews/raksha-bandhan/cover-msvylo74.png',
  'graduation-victory': 'https://pub-9a93db46c01f4a47846cf3de6e3f148e.r2.dev/template-seeds/bday-wish-3/pic1.jpg',
  'royal-heritage-cinema': 'https://cdn.cutiepage.in/template-previews/wife-day/cover-mu8umzzl.jpg',
  'golden-dynasty-celebration': 'https://cdn.cutiepage.in/template-previews/wife-day/cover-mu8umzzl.jpg',
  'miss-you-constellation': 'https://cdn.cutiepage.in/template-seeds/couples-day/cover.webp',
  'midnight-thoughts-letter': 'https://cdn.cutiepage.in/static/special-apology.webp',
  'just-because-spark': 'https://cdn.cutiepage.in/static/birthday-wish4-v2.png',
  'random-act-of-love': 'https://cdn.cutiepage.in/template-seeds/girlfriends-day/cover.png',
  'thank-you-golden-sunset': 'https://pub-9a93db46c01f4a47846cf3de6e3f148e.r2.dev/static/anniversary-special-cover.jpg',
  'appreciation-tribute-reel': 'https://cdn.cutiepage.in/template-seeds/netflix-story/cover.webp',
  'farewell-memory-lane': 'https://pub-9a93db46c01f4a47846cf3de6e3f148e.r2.dev/template-seeds/brothers-day/gallery1.jpeg',
  'farewell-golden-horizon': 'https://pub-9a93db46c01f4a47846cf3de6e3f148e.r2.dev/static/anniversary-special-cover.jpg',
  'good-luck-lucky-clover': 'https://cdn.cutiepage.in/static/sweet-birthday.webp',
  'good-luck-champion': 'https://pub-9a93db46c01f4a47846cf3de6e3f148e.r2.dev/template-seeds/bday-wish-3/pic1.jpg',
  'new-beginning-sunrise': 'https://pub-9a93db46c01f4a47846cf3de6e3f148e.r2.dev/template-seeds/cute-birthday/intro.gif',
  'new-beginning-milestone-film': 'https://cdn.cutiepage.in/template-seeds/netflix-story/cover.webp',
  'golden-anniversary': 'https://pub-9a93db46c01f4a47846cf3de6e3f148e.r2.dev/static/anniversary-special-cover.jpg',
  'valentine-constellation': 'https://cdn.cutiepage.in/template-seeds/couples-day/cover.webp'
};

let count = 0;
for (const [id, url] of Object.entries(cutiepageThumbs)) {
  const regExisting = new RegExp('(id:\\s*[\'"]' + id + '[\'"][\\s\\S]*?thumbnail:\\s*[\'"])([^\'"]+)([\'"])', 'm');
  if (regExisting.test(code)) {
    code = code.replace(regExisting, '$1' + url + '$3');
    count++;
  } else {
    const regInsert = new RegExp('(id:\\s*[\'"]' + id + '[\'"][\\s\\S]*?)(tags:\\s*\\[)', 'm');
    if (regInsert.test(code)) {
      code = code.replace(regInsert, '$1thumbnail: \'' + url + '\',\n      $2');
      count++;
    }
  }
}

fs.writeFileSync(targetFile, code, 'utf8');
console.log('Updated', count, 'thumbnails successfully in js/vanvi-templates-data.js');
