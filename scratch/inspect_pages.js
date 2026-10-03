const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

console.log('Total HTML files:', files.length);
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hasLight = content.includes('vanvi-inner-light.css');
  const hasCore = content.includes('vanvi-core.css');
  const hasHeader = content.includes('<header');
  const hasFooter = content.includes('<footer');
  const hasBack = content.includes('btn-nav-back') || content.includes('class="back"') || content.includes('← Back') || content.includes('←');
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'No title';
  console.log(`${f.padEnd(26)} | Light:${hasLight ? 'Y' : 'N'} | Core:${hasCore ? 'Y' : 'N'} | Hdr:${hasHeader ? 'Y' : 'N'} | Ftr:${hasFooter ? 'Y' : 'N'} | Back:${hasBack ? 'Y' : 'N'} | ${title}`);
});

