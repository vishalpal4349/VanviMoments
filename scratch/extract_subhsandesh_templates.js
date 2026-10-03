const fs = require('fs');

const filePath = "C:\\Users\\RISHU KUMARI\\.gemini\\antigravity-ide\\brain\\c3bf8515-d3ed-4052-9d9f-f51389df543f\\.system_generated\\steps\\1844\\content.md";
const raw = fs.readFileSync(filePath, 'utf8');

const clean = raw
  .replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z0-9#]+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();

console.log('Templates text (first 3000 chars):');
console.log(clean.slice(0, 3000));
