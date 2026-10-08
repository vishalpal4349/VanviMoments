const fs = require('fs');

const cssFiles = [
  'vanvi-navigation.css',
  'vanvi-inner-light.css',
  'vanvi-core.css',
  'css/vanvi-global-experience.css',
  'css/vanvi-template-cards.css'
];

cssFiles.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  const hoverTransforms = [];
  const regex = /([^{}]+:hover[^{]*)\{([^}]+)\}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const selector = match[1].trim();
    const body = match[2];
    if (body.includes('transform') || body.includes('translate') || body.includes('scale')) {
      hoverTransforms.push({ selector, body: body.replace(/\s+/g, ' ').trim() });
    }
  }
  console.log(`\n=== ${f}: ${hoverTransforms.length} hover transform rules ===`);
  hoverTransforms.slice(0, 10).forEach(h => {
    console.log(`  ${h.selector} -> ${h.body}`);
  });
});
