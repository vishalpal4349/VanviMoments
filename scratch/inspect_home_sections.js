const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

console.log('Listing sections between line 6270 and 7450:');
for (let i = 6270; i < 7450; i++) {
  const l = lines[i];
  if (!l) continue;
  if (l.includes('<section') || l.includes('class="section-title"') || l.includes('<h3>') || l.includes('<h2>') || l.includes('class="birthday') || l.includes('id="ai') || l.includes('id="templateDiscovery') || l.includes('id="homeAiStudioSection"')) {
    console.log(`${i+1}: ${l.trim().slice(0, 140)}`);
  }
}
