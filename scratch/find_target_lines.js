const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

const targets = [
  "Your #1 shortcut",
  "1 · Share",
  "VANVI LUCKY SPIN",
  "1 FREE SPIN",
  "₹1",
  "Day 1"
];

targets.forEach(t => {
  lines.forEach((l, idx) => {
    if (l.includes(t)) {
      console.log(`[Line ${idx + 1}] for target "${t}": ${l.trim()}`);
    }
  });
});
