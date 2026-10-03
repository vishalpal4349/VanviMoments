const fs = require('fs');
const http = require('http');

const content = fs.readFileSync('index.html', 'utf8');
console.log('index.html size:', content.length);
console.log('Has playAndEarnSection:', content.includes('id="playAndEarnSection"'));
console.log('Has home-games-grid:', content.includes('home-games-grid'));
console.log('Has home-arcade-spotlight:', content.includes('home-arcade-spotlight'));
console.log('Has bottom dock in index.html:', content.includes('class="bottom vanvi-bottom-dock"'));
console.log('Has slider-arrow-btn:', content.includes('class="slider-arrow-btn"'));
console.log('Has home-btn-explore:', content.includes('home-btn-explore'));
console.log('Has home-btn-make-yours:', content.includes('home-btn-make-yours'));
console.log('Has btn-spotlight-play:', content.includes('btn-spotlight-play'));
console.log('Has home-btn-play-trigger:', content.includes('home-btn-play-trigger'));

// Test server response
const req = http.get('http://localhost:3000/index.html', (res) => {
  console.log('Server status code for index.html:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Fetched bytes:', data.length);
    console.log('Games section present in served response:', data.includes('playAndEarnSection'));
  });
});
req.on('error', (err) => {
  console.log('Server request error:', err.message);
});
