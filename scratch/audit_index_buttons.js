const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find all <button> and <a class="..."> in body
const body = html.substring(html.indexOf('<body'));
const btnTags = body.match(/<(?:button|a)[^>]*class="[^"]*"[^>]*>/gi) || [];

const classFrequency = {};
btnTags.forEach(tag => {
  const m = tag.match(/class="([^"]*)"/i);
  if (m) {
    const clsList = m[1].split(/\s+/);
    clsList.forEach(c => {
      classFrequency[c] = (classFrequency[c] || 0) + 1;
    });
  }
});

console.log('Button/Action classes frequency:');
const sorted = Object.entries(classFrequency)
  .filter(([k]) => k.includes('btn') || k.includes('primary') || k.includes('secondary') || k.includes('action') || k.includes('pill') || k.includes('create') || k.includes('switch') || k.includes('tbtn'))
  .sort((a,b) => b[1] - a[1]);

console.log(sorted);
