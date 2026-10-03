const fs = require('fs');
const readline = require('readline');

async function run() {
  const fileStream = fs.createReadStream('C:/Users/RISHU KUMARI/.gemini/antigravity/brain/b2664d99-16c5-4e07-bacf-ee05919844dd/.system_generated/logs/transcript.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  let lastUserInput = null;
  let lineIdx = 0;
  let targetLineIdx = 0;

  for await (const line of rl) {
    lineIdx++;
    if (line.includes('"type":"USER_INPUT"')) {
      try {
        const obj = JSON.parse(line);
        if (obj.type === 'USER_INPUT') {
          lastUserInput = obj;
          targetLineIdx = lineIdx;
        }
      } catch (e) {}
    }
  }

  if (lastUserInput) {
    console.log('Found user input at line:', targetLineIdx, 'step_index:', lastUserInput.step_index);
    console.log('Truncated fields:', lastUserInput.truncated_fields);
    
    // If truncated, check transcript_full.jsonl
    if (lastUserInput.truncated_fields && lastUserInput.truncated_fields.includes('content')) {
      console.log('Reading from transcript_full.jsonl line', targetLineIdx);
      const fullStream = fs.createReadStream('C:/Users/RISHU KUMARI/.gemini/antigravity/brain/b2664d99-16c5-4e07-bacf-ee05919844dd/.system_generated/logs/transcript_full.jsonl');
      const fullRl = readline.createInterface({ input: fullStream, crlfDelay: Infinity });
      let cur = 0;
      for await (const fullLine of fullRl) {
        cur++;
        if (cur === targetLineIdx) {
          const fullObj = JSON.parse(fullLine);
          fs.writeFileSync('scratch/full_user_input.txt', fullObj.content || '');
          console.log('Saved full content, length:', fullObj.content?.length);
          break;
        }
      }
    } else {
      fs.writeFileSync('scratch/full_user_input.txt', lastUserInput.content || '');
      console.log('Saved non-truncated content, length:', lastUserInput.content?.length);
    }
  }
}

run();

