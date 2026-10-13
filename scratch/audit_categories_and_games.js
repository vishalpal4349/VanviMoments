const fs = require('fs');

const catFiles = fs.readdirSync('.').filter(f => f.startsWith('category-'));
console.log('Auditing', catFiles.length, 'category files...');

catFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const aRegex = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = aRegex.exec(content)) !== null) {
    const target = m[1].trim();
    const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (target.includes('.html')) {
      const clean = target.split('#')[0].split('?')[0];
      if (!fs.existsSync(clean)) {
        console.log(`[${file}] 404 target: "${text}" -> ${target}`);
      }
      if (/rewards/i.test(text) && !target.includes('rewards.html')) {
        console.log(`[${file}] Mislinked rewards: "${text}" -> ${target}`);
      }
      if (/wheel|spin/i.test(text) && !target.includes('rewards.html')) {
        console.log(`[${file}] Mislinked wheel: "${text}" -> ${target}`);
      }
    }
  }
});

// Also check all 15 mini-games
const gameFiles = [
  'heart-rain.html', 'heart-sort.html', 'gem-catch.html', 'gem-merge.html',
  'hidden-hearts.html', 'memory-rush.html', 'memory-sequence.html', 'love-puzzle.html',
  'quick-tap.html', 'block-blast.html', 'cross-math.html', 'word-whisper.html',
  'secret-clue.html', 'periodic-quiz.html', 'unlock-gift.html'
];
console.log('Auditing', gameFiles.length, 'game files...');
gameFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const aRegex = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = aRegex.exec(content)) !== null) {
    const target = m[1].trim();
    const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (target.includes('.html')) {
      const clean = target.split('#')[0].split('?')[0];
      if (!fs.existsSync(clean)) {
        console.log(`[${file}] 404 target: "${text}" -> ${target}`);
      }
      if (/wheel|spin/i.test(text) && !target.includes('rewards.html')) {
        console.log(`[${file}] Mislinked wheel: "${text}" -> ${target}`);
      }
    }
  }
});
console.log('Done auditing.');
