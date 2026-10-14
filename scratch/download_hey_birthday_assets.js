const fs = require('fs');
const path = require('path');

const targetDir = 'templates/Hey Birthday/assets';
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const downloads = [
  { url: 'https://amadowish.tech/assets/music-B0CBMWfg.mp3', file: 'music.mp3' },
  { url: 'https://amadowish.tech/assets/pop-D2tt9CZT.mp3', file: 'pop.mp3' },
  { url: 'https://amadowish.tech/assets/flip-CcD6-YS3.mp3', file: 'flip.mp3' },
  { url: 'https://amadowish.tech/assets/chime-DyF30H0_.mp3', file: 'chime.mp3' },
  { url: 'https://amadowish.tech/demo/birthday/1.jpg', file: 'photo1.jpg' },
  { url: 'https://amadowish.tech/demo/birthday/2.jpg', file: 'photo2.jpg' },
  { url: 'https://amadowish.tech/demo/birthday/3.jpg', file: 'photo3.jpg' },
  { url: 'https://amadowish.tech/demo/birthday/4.jpg', file: 'photo4.jpg' },
  { url: 'https://amadowish.tech/demo/birthday/5.jpg', file: 'photo5.jpg' }
];

async function run() {
  for (const item of downloads) {
    const dest = path.join(targetDir, item.file);
    console.log('Downloading:', item.url, '->', dest);
    try {
      const res = await fetch(item.url);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(buffer));
        console.log('Saved:', dest, 'Bytes:', buffer.byteLength);
      } else {
        console.log('Failed:', item.url, res.status);
      }
    } catch(err) {
      console.log('Error downloading:', item.url, err.message);
    }
  }
}

run();
