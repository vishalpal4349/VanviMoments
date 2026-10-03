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
    // Match both escaped and unescaped
    const regex = /\{(\\?)"@type\\?":(\\?)"ListItem\\?",\\?"position\\?":(\d+),\\?"url\\?":\\?"([^"\\]+)\\?",\\?"item\\?":\{(\\?)"@type\\?":(\\?)"CreativeWork\\?",\\?"name\\?":\\?"([^"\\]+)\\?",\\?"description\\?":\\?"([^"\\]+)\\?",\\?"image\\?":\\?"([^"\\]+)\\?"\}\}/g;
    const items = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      items.push({
        position: match[3],
        url: match[4],
        name: match[7],
        description: match[8],
        image: match[9]
      });
    }
    console.log('Total templates found:', items.length);
    console.log(JSON.stringify(items, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
