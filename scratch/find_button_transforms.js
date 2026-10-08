const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Find all occurrences of transform inside <style> blocks
const styleBlocks = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];

console.log(`Found ${styleBlocks.length} style blocks in index.html`);

const suspiciousRules = [];

styleBlocks.forEach((block, idx) => {
  // Regex to find rules targeting buttons/ctas/links that have transform: translate or animation
  const lines = block.split('\n');
  lines.forEach((line, lineNum) => {
    if (
      (line.includes('button') || line.includes('btn') || line.includes('cta') || line.includes('primary') || line.includes('secondary') || line.includes('create') || line.includes('nav')) &&
      (line.includes('translate') || line.includes('transform') || line.includes('animation'))
    ) {
      suspiciousRules.push({ blockIdx: idx, lineNum: lineNum + 1, content: line.trim() });
    }
  });
});

console.log(`\nFound ${suspiciousRules.length} lines with transforms/animations on buttons/CTAs:`);
suspiciousRules.forEach(r => console.log(`  [Block ${r.blockIdx} : L${r.lineNum}] ${r.content}`));
