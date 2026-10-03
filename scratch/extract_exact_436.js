const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('C:/Users/RISHU KUMARI/.gemini/antigravity/brain/b2664d99-16c5-4e07-bacf-ee05919844dd/.system_generated/logs/transcript_full.jsonl');
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineNum = 0;
const linesMap = {};

rl.on('line', (line) => {
  lineNum++;
  if (lineNum === 7075 || lineNum === 7077 || lineNum === 7079) {
    const obj = JSON.parse(line);
    const content = obj.content;
    content.split('\n').forEach(l => {
      const m = l.match(/^\s*(\d+):\s?(.*)$/);
      if (m) {
        linesMap[parseInt(m[1])] = m[2];
      }
    });
  }
});

rl.on('close', () => {
  const result = [];
  for (let i = 1; i <= 436; i++) {
    result.push(linesMap[i] !== undefined ? linesMap[i] : '');
  }
  fs.writeFileSync('scratch/original_profile_exact.html', result.join('\n'));
  console.log('Saved scratch/original_profile_exact.html with', result.length, 'lines');
});

