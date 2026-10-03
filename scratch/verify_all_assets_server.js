const http = require('http');

const urls = [
  'http://localhost:3000/templates/birthday-3d-candle-surprise/index.html',
  'http://localhost:3000/templates/birthday-3d-candle-surprise/style.css',
  'http://localhost:3000/templates/birthday-3d-candle-surprise/script.js',
  'http://localhost:3000/templates/birthday-3d-candle-surprise/template.json',
  'http://localhost:3000/templates/birthday-3d-candle-surprise/image/bg.png',
  'http://localhost:3000/templates/birthday-3d-candle-surprise/image/cake_3d.png',
  'http://localhost:3000/templates/birthday-3d-candle-surprise/image/hop.png',
  'http://localhost:3000/templates/birthday-3d-candle-surprise/image/nap.png',
  'http://localhost:3000/templates/birthday-3d-candle-surprise/happybirthday.mp3',
  'http://localhost:3000/templates.html',
  'http://localhost:3000/template-detail.html?template=birthday-3d-candle-surprise'
];

async function checkAll() {
  for (const url of urls) {
    await new Promise(resolve => {
      http.get(url, res => {
        console.log(`[${res.statusCode}] ${url.replace('http://localhost:3000/', '')} (${res.headers['content-length'] || 'stream'} bytes)`);
        resolve();
      }).on('error', err => {
        console.error(`[ERR] ${url}:`, err.message);
        resolve();
      });
    });
  }
}

checkAll();
