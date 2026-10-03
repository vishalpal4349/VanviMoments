const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const fixedWidthIssues = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');

  // Look for min-width: [4-9]\d\dpx or width: [4-9]\d\dpx without max-width
  const minWidthMatches = [...content.matchAll(/min-width:\s*([4-9]\d\d|\d{4,})px/gi)];
  minWidthMatches.forEach(m => {
    // Check if within a media query (min-width: 768px etc)
    const pos = m.index;
    const snippetBefore = content.substring(Math.max(0, pos - 150), pos);
    if (!snippetBefore.includes('@media') && !snippetBefore.includes('scrollbar')) {
      fixedWidthIssues.push({
        file: f,
        match: m[0],
        snippet: content.substring(Math.max(0, pos - 40), Math.min(content.length, pos + 60)).replace(/\s+/g, ' ')
      });
    }
  });
});

console.log(`Found ${fixedWidthIssues.length} potentially problematic fixed min-width rules.`);
fixedWidthIssues.slice(0, 30).forEach(iss => {
  console.log(`[${iss.file}] ${iss.match} in "${iss.snippet}"`);
});
