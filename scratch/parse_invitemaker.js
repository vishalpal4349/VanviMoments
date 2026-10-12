const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\RISHU KUMARI\\.gemini\\antigravity-ide\\brain\\853592c6-08b7-485a-b854-fae429885680\\.system_generated\\steps\\595\\content.md', 'utf8');

// Find all buttons, links, or interesting chunks
const buttons = html.match(/<button[^>]*>[\s\S]*?<\/button>/gi) || [];
console.log('Button count:', buttons.length);
buttons.slice(0, 15).forEach((b, i) => console.log(`Button ${i}:`, b.replace(/<[^>]+>/g, '').trim()));

const links = html.match(/<a[^>]*href="[^"]*"[^>]*>[\s\S]*?<\/a>/gi) || [];
console.log('Links with Edit/Customize:');
links.filter(l => /edit|customize|template|create/i.test(l)).slice(0, 10).forEach(l => console.log(l));
