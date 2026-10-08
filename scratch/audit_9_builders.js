const fs = require('fs');
const path = require('path');

const templates = [
  'birthday-3d-candle',
  'birthday-3d-candle-surprise',
  'birthday-white-bloom',
  'birthday-wish-01',
  'birthday-wish-02',
  'constellation-love',
  'golden-anniversary',
  'retro-polaroid-wall',
  'sincere-letter'
];

let totalBuilderButtons = 0;
let totalBuilderForms = 0;
let totalExpButtons = 0;

templates.forEach(t => {
  const bPath = path.join('templates', t, 'builder.html');
  const ePath = path.join('templates', t, 'index.html');
  
  const bContent = fs.readFileSync(bPath, 'utf8');
  const eContent = fs.readFileSync(ePath, 'utf8');
  
  const bButtons = (bContent.match(/<button/gi) || []).length + (bContent.match(/class="[^"]*btn[^"]*"/gi) || []).length;
  const bForms = (bContent.match(/<form/gi) || []).length;
  const eButtons = (eContent.match(/<button/gi) || []).length + (eContent.match(/class="[^"]*btn[^"]*"/gi) || []).length;
  
  totalBuilderButtons += bButtons;
  totalBuilderForms += bForms;
  totalExpButtons += eButtons;
  
  const bHasCustomCss = bContent.includes('vanvi-custom-builder.css');
  const bHasCoreJs = bContent.includes('vanvi-builder-core.js');
  const eHasAdapter = eContent.includes('template-adapter.js');
  
  console.log(`${t}:`);
  console.log(`  Builder -> Buttons: ${bButtons} | Forms: ${bForms} | CustomCss: ${bHasCustomCss} | CoreJs: ${bHasCoreJs}`);
  console.log(`  Experience -> Buttons: ${eButtons} | Adapter: ${eHasAdapter}`);
});

console.log(`\nTotals: Builder Buttons = ${totalBuilderButtons}, Builder Forms = ${totalBuilderForms}, Experience Buttons = ${totalExpButtons}`);
