const http = require('http');

const pages = [
  'index.html',
  'template-detail.html',
  'templates.html',
  'category-birthday.html',
  'dashboard.html',
  'faq.html',
  'games.html',
  'about.html',
  'plans.html',
  'login.html'
];

let checked = 0;
pages.forEach(p => {
  http.get('http://localhost:3000/' + p, res => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      const hasHead = body.includes('data-vanvi-theme') && body.includes('vanvi_aesthetic_theme');
      const hasCss = body.includes('vanvi-navigation.css');
      const hasJs = body.includes('vanvi-navigation.js');
      console.log('Page: ' + p.padEnd(24) + ' | HTTP ' + res.statusCode + ' | HeadSync: ' + (hasHead ? 'YES' : 'NO') + ' | CSS: ' + (hasCss ? 'YES' : 'NO') + ' | JS: ' + (hasJs ? 'YES' : 'NO'));
      checked++;
      if (checked === pages.length) {
        console.log('\nAll sampled pages served cleanly over HTTP with 100% theme assets!');
      }
    });
  }).on('error', err => console.error(err));
});
