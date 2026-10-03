const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('C:/Users/RISHU KUMARI/.gemini/antigravity/brain/b2664d99-16c5-4e07-bacf-ee05919844dd/.system_generated/logs/transcript_full.jsonl');
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineNum = 0;
const chunks = {};

rl.on('line', (line) => {
  lineNum++;
  if (line.includes('profile.html') && line.includes('Showing lines')) {
    try {
      const obj = JSON.parse(line);
      const match = obj.content && obj.content.match(/Showing lines (\d+) to (\d+)/);
      if (match) {
        const start = parseInt(match[1]);
        const end = parseInt(match[2]);
        console.log('Line ' + lineNum + ': Showing lines ' + start + ' to ' + end);
        obj.content.split('\n').forEach(l => {
          const m = l.match(/^\s*(\d+):\s?(.*)$/);
          if (m) {
            chunks[parseInt(m[1])] = m[2];
          }
        });
      }
    } catch(e) {}
  }
});

rl.on('close', () => {
  const keys = Object.keys(chunks).map(Number).sort((a,b)=>a-b);
  console.log('Total unique code lines collected:', keys.length, 'Min:', keys[0], 'Max:', keys[keys.length-1]);
  if (keys.length > 0) {
    const full = [];
    for (let i = 1; i <= keys[keys.length-1]; i++) {
      full.push(chunks[i] !== undefined ? chunks[i] : '');
    }
    fs.writeFileSync('scratch/original_profile_assembled.html', full.join('\n'));
    console.log('Successfully wrote scratch/original_profile_assembled.html');
  }
});

