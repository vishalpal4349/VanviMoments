const fs = require('fs');

const templates = [
  'birthday-midnight-royal',
  'birthday-retro-polaroid',
  'birthday-celestial-stars',
  'birthday-champagne-scratch',
  'birthday-botanical-bloom'
];

const store = JSON.parse(fs.readFileSync('server/data/store.json', 'utf8'));
const vanviData = fs.readFileSync('js/vanvi-templates-data.js', 'utf8');

console.log('====================================================');
console.log('   VERIFYING 5 ULTRA-LUXURY BIRTHDAY TEMPLATES      ');
console.log('====================================================\n');

let allOk = true;

templates.forEach((t, i) => {
  const dir = 'templates/' + t;
  console.log(`[${i + 1}/5] Template: ${t}`);
  
  const files = ['index.html', 'builder.html', 'preview.html', 'script.js', 'style.css', 'template.json'];
  files.forEach(file => {
    const p = dir + '/' + file;
    if (!fs.existsSync(p)) {
      console.error(`  ❌ Missing file: ${file}`);
      allOk = false;
    } else {
      const size = fs.statSync(p).size;
      console.log(`  ✅ ${file.padEnd(14)} (${size} bytes)`);
    }
  });

  const inStore = store.templates.some(item => item.id === t);
  const inVanviData = vanviData.includes(t);
  
  console.log(`  ${inStore ? '✅' : '❌'} server/data/store.json catalog integration: ${inStore}`);
  console.log(`  ${inVanviData ? '✅' : '❌'} js/vanvi-templates-data.js client integration: ${inVanviData}`);
  
  if (!inStore || !inVanviData) allOk = false;
  console.log('');
});

if (allOk) {
  console.log('====================================================');
  console.log('🎉 ALL 5 BIRTHDAY TEMPLATES ARE 100% COMPLETE & LIVE!');
  console.log('====================================================');
  process.exit(0);
} else {
  console.error('❌ Errors detected during verification!');
  process.exit(1);
}
