const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  try {
    const html = await get('https://www.cutiepage.in/products');
    console.log('HTML length:', html.length);
    const idx = html.indexOf('bday-wish-1');
    if (idx !== -1) {
      console.log('--- Snippet around bday-wish-1 ---');
      console.log(html.slice(Math.max(0, idx - 200), idx + 800));
    }
    const idx2 = html.indexOf('birthday-wish-2');
    if (idx2 !== -1) {
      console.log('--- Snippet around birthday-wish-2 ---');
      console.log(html.slice(Math.max(0, idx2 - 200), idx2 + 800));
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
