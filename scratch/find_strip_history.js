const fs = require('fs');
const readline = require('readline');
const fileStream = fs.createReadStream('C:\\Users\\RISHU KUMARI\\.gemini\\antigravity\\brain\\b2664d99-16c5-4e07-bacf-ee05919844dd\\.system_generated\\logs\\transcript_full.jsonl');
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

rl.on('line', (line) => {
  if (line.includes('ultra-thin-strip') && line.includes('padding:')) {
    const obj = JSON.parse(line);
    console.log('Step ' + obj.step_index);
    if (obj.tool_calls) {
      console.log(JSON.stringify(obj.tool_calls, null, 2));
    }
    if (obj.content && obj.content.length < 2000) {
      console.log(obj.content);
    }
  }
});

