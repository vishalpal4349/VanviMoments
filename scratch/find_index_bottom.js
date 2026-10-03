const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// Find where bottom bar is in index.html
const match = content.match(/<nav[^>]*>[\s\S]*?<\/nav>/gi) || content.match(/class=["'][^"']*bottom[^"']*["']/gi);
console.log('Matches in index.html:', match);

// Search for links with builder.html or profile.html
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('builder.html') && (line.includes('bottom') || line.includes('nav') || line.includes('create'))) {
    console.log(`Line ${idx+1}: ${line.trim()}`);
  }
  if (line.includes('class="bottom') || line.includes("class='bottom") || line.includes('id="bottom')) {
    console.log(`Bottom line ${idx+1}: ${line.trim()}`);
  }
});
