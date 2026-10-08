const { execSync } = require('child_process');

['c22fba3', 'd4f1117'].forEach(rev => {
  try {
    const file = execSync(`git show ${rev}:index.html`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    const match = file.match(/<div class="birthday glass"[\s\S]*?<\/div>/);
    if (match) {
      console.log(`=== ${rev} ===`);
      console.log(match[0].slice(0, 400));
    }
    // Also check physical gift
    const giftMatch = file.match(/<div class="birthday glass"><div class="eyebrow">Curated gift ideas[\s\S]*?<\/div>/);
    if (giftMatch) {
      console.log(`=== ${rev} Gift ===`);
      console.log(giftMatch[0].slice(0, 400));
    }
  } catch(e) {
    console.log(e.message);
  }
});
