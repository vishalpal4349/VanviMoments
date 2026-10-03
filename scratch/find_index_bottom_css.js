const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// Find all CSS rules targeting .bottom in index.html
const matches = content.match(/\.bottom\s*\{[^}]*\}/gi) || [];
console.log('Matches:', matches);

// Check media queries for .bottom
const mqMatches = content.match(/@media[^{]*\{[^{}]*\.bottom[^{}]*\{[^}]*\}[^{}]*\}/gi) || [];
console.log('MQ Matches:', mqMatches);
