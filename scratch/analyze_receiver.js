const fs = require('fs');

const code = fs.readFileSync('scratch/amadowish/BirthdayReceiver.js', 'utf8');

// Find all JSX/text strings, function names, and state variables
console.log('Total characters in BirthdayReceiver:', code.length);

// Let's search for stages / screens
const stages = [
  'verification', 'verify', 'flip', 'balloon', 'meter', 'laugh', 'candle', 'album', 'letter', 'reaction', 'answer'
];

stages.forEach(st => {
  const matches = [];
  let pos = 0;
  while ((pos = code.toLowerCase().indexOf(st, pos)) !== -1) {
    matches.push(pos);
    pos += st.length + 1;
  }
  console.log(`Keyword "${st}": found ${matches.length} times`);
});

// Let's dump the strings from code
const strRegex = /["`']([^"`']{4,120})["`']/g;
let m;
const uniqueStrings = new Set();
while ((m = strRegex.exec(code)) !== null) {
  uniqueStrings.add(m[1]);
}
console.log('--- Sample text strings from BirthdayReceiver ---');
Array.from(uniqueStrings).slice(0, 100).forEach(s => console.log('>', s));
