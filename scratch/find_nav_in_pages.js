const fs = require('fs');

const missingPages = [
  'plans.html', 'products.html', 'profile.html', 'refer.html', 
  'refund.html', 'rewards.html', 'share.html', 'ai-matcher.html',
  'about.html', 'contact.html', 'privacy.html', 'terms.html'
];

missingPages.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  console.log(`\n=================== ${file} ===================`);
  lines.forEach((line, idx) => {
    if (line.includes('index.html') && (line.includes('brand') || line.includes('logo') || line.includes('VANVI') || line.includes('header'))) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
      for (let j = Math.max(0, idx - 2); j <= Math.min(lines.length - 1, idx + 8); j++) {
        console.log(`  ${j + 1}: ${lines[j]}`);
      }
    }
  });
});
