const http = require('http');

const urls = [
  'http://localhost:5500/coming-soon.html',
  'http://localhost:5500/contact.html',
  'http://localhost:5500/privacy.html',
  'http://localhost:5500/terms.html',
  'http://localhost:5500/profile.html',
  'http://localhost:5500/login.html'
];

function fetchUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ url, status: res.statusCode, length: data.length });
      });
    }).on('error', (err) => {
      resolve({ url, error: err.message });
    });
  });
}

async function run() {
  for (const u of urls) {
    const res = await fetchUrl(u);
    console.log(res);
  }
}

run();
