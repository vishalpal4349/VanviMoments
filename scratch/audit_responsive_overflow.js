const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f.endsWith('.css'));

console.log('Inspecting responsive CSS rules across', files.length, 'files...');

const overflowRisks = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  
  // Look for fixed pixel widths > 320px in style tags or css
  const regex = /(?:width|min-width)\s*:\s*([4-9]\d{2,}|[1-9]\d{3,})px/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const val = parseInt(match[1], 10);
    // check context (200 chars around)
    const start = Math.max(0, match.index - 80);
    const end = Math.min(content.length, match.index + 80);
    const snippet = content.substring(start, end).replace(/\s+/g, ' ').trim();
    
    // Check if it has max-width: 100% or is inside a desktop media query
    const preceding = content.substring(Math.max(0, match.index - 500), match.index);
    const hasMediaDesktop = preceding.includes('@media (min-width:') || preceding.includes('@media(min-width:') || preceding.includes('@media screen and (min-width:');
    const hasMaxWidth = snippet.includes('max-width: 100%') || snippet.includes('max-width:100%') || snippet.includes('max-width: min(') || snippet.includes('width: min(');

    if (!hasMediaDesktop && !hasMaxWidth && val > 420) {
      overflowRisks.push({
        file: f,
        value: `${val}px`,
        snippet
      });
    }
  }
});

console.log(`Found ${overflowRisks.length} potential overflow rules.`);
overflowRisks.slice(0, 15).forEach(r => {
  console.log(`[${r.file}] ${r.value} -> "${r.snippet}"`);
});

fs.writeFileSync('scratch/responsive_risks.json', JSON.stringify(overflowRisks, null, 2));
