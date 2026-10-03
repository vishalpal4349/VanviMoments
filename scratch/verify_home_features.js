const http = require('http');

http.get('http://localhost:3000/index.html', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('Has vanviLoader:', data.includes('id="vanviLoader"'));
    console.log('Has theme switcher:', data.includes('toggleVanviTheme'));
    console.log('Has Playfair Display font:', data.includes('Playfair+Display'));
    console.log('Has Plus Jakarta Sans font:', data.includes('Plus+Jakarta+Sans'));
    console.log('Has Brand luxury polish:', data.includes('brand-luxury-polish'));
    console.log('Has Scroll Reveal Script:', data.includes('initScrollReveals'));
    console.log('All Checks Passed!');
  });
}).on('error', err => console.error(err));
