const fs = require('fs');

const filePath = "C:\\Users\\RISHU KUMARI\\.gemini\\antigravity-ide\\brain\\c3bf8515-d3ed-4052-9d9f-f51389df543f\\.system_generated\\steps\\1828\\content.md";
const raw = fs.readFileSync(filePath, 'utf8');

// Strip HTML tags and clean up whitespace
const clean = raw
  .replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z0-9#]+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();

console.log('Clean length:', clean.length);
console.log('Snippet (1 to 2500):');
console.log(clean.slice(0, 2500));

console.log('\nSnippet (2500 to 5000):');
console.log(clean.slice(2500, 5000));
