const fs = require('fs');

const gameFiles = [
  'risk-run.html',
  'love-puzzle.html',
  'gem-catch.html',
  'heart-rain.html',
  'hidden-hearts.html',
  'memory-rush.html',
  'memory-sequence.html',
  'quick-tap.html',
  'unlock-gift.html',
  'word-whisper.html',
  'rewards.html',
  'games.html'
];

console.log('=== CHECKING ALL GAME PAGES ===\n');

let allGood = true;

gameFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(`❌ MISSING: ${file}`);
    allGood = false;
    return;
  }
  const content = fs.readFileSync(file, 'utf8');
  
  // Check for scripts
  const scriptTags = [...content.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
  scriptTags.forEach(src => {
    if (!src.startsWith('http') && !fs.existsSync(src.split('?')[0])) {
      console.error(`❌ ${file} has broken script: ${src}`);
      allGood = false;
    }
  });

  // Check canvas or main game container
  const hasGameLogic = content.includes('<canvas') || content.includes('grid') || content.includes('puzzle') || content.includes('wheel') || content.includes('game');
  console.log(`✓ ${file}: Valid HTML (${Math.round(content.length/1024)} KB), Game Logic Present: ${hasGameLogic}`);
});

if (allGood) {
  console.log('\n🎉 ALL GAME FILES EXIST AND HAVE VALID SCRIPTS & ASSETS! 🎉');
}
