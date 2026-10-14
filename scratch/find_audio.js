const fs = require('fs');

const code = fs.readFileSync('scratch/amadowish/BirthdayReceiver.js', 'utf8');

// Search for audio references
const audioOccurrences = [];
let idx = 0;
while ((idx = code.indexOf('Audio', idx)) !== -1) {
  audioOccurrences.push(code.slice(Math.max(0, idx - 50), Math.min(code.length, idx + 150)));
  idx += 5;
}

while ((idx = code.indexOf('.mp3', idx)) !== -1) {
  audioOccurrences.push(code.slice(Math.max(0, idx - 50), Math.min(code.length, idx + 100)));
  idx += 4;
}

while ((idx = code.indexOf('play', idx)) !== -1) {
  audioOccurrences.push(code.slice(Math.max(0, idx - 30), Math.min(code.length, idx + 80)));
  idx += 4;
}

console.log('Audio occurrences found:', audioOccurrences.length);
audioOccurrences.slice(0, 15).forEach((o, i) => console.log(i + ':', o));
