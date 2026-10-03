const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://happybirthday-liart-chi.vercel.app/';

const assets = [
  'image/bg.png',
  'image/b3.png',
  'image/b4.png',
  'image/b5.png',
  'image/b6.png',
  'image/giftbox.png',
  'image/heartAnimation.gif',
  'image/mewmew.gif',
  'happybirthday.mp3',
  'image/cake_3d.png',
  'image.jpg',
  'image/photo_roses.jpg',
  'flower.jpg',
  'image/photo_cake.jpg',
  'image/nap.png',
  'image/hop.png'
];

const targetBase = path.join(__dirname, '..', 'templates', 'birthday-3d-candle-surprise');

// Ensure directories
if (!fs.existsSync(targetBase)) fs.mkdirSync(targetBase, { recursive: true });
if (!fs.existsSync(path.join(targetBase, 'image'))) fs.mkdirSync(path.join(targetBase, 'image'), { recursive: true });

function downloadFile(relPath) {
  return new Promise((resolve, reject) => {
    const cleanRel = relPath.replace(/^\.\//, '');
    const url = baseUrl + cleanRel;
    const dest = path.join(targetBase, cleanRel);
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        console.warn(`Failed: ${url} -> Status ${res.statusCode}`);
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        resolve({ path: cleanRel, status: res.statusCode });
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const stat = fs.statSync(dest);
        console.log(`Downloaded: ${cleanRel} (${stat.size} bytes)`);
        resolve({ path: cleanRel, size: stat.size, status: 200 });
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${url}:`, err.message);
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve({ path: cleanRel, error: err.message });
    });
  });
}

async function run() {
  console.log('Downloading all assets to:', targetBase);
  for (const a of assets) {
    await downloadFile(a);
  }
  console.log('All downloads completed!');
}

run();
