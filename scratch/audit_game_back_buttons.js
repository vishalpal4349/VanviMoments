const fs = require('fs');

const GAME_FILES = [
  'heart-rain.html',
  'heart-sort.html',
  'block-blast.html',
  'gem-merge.html',
  'memory-rush.html',
  'memory-sequence.html',
  'quick-tap.html',
  'gem-catch.html',
  'word-whisper.html',
  'unlock-gift.html',
  'cross-math.html',
  'love-puzzle.html',
  'brain-test.html',
  'periodic-quiz.html',
  'risk-run.html',
  'hidden-hearts.html'
];

console.log('=== AUDITING BACK BUTTONS & TOP NAV IN ALL GAMES ===');

GAME_FILES.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`❌ ${file} does not exist`);
    return;
  }
  const content = fs.readFileSync(file, 'utf8');
  
  // Find all links or buttons with games.html
  const backLinks = [];
  const regex = /<a[^>]*href=["'](?:games\.html|index\.html)["'][^>]*>([\s\S]*?)<\/a>|<button[^>]*onclick=["'][^"']*games\.html[^"']*["'][^>]*>([\s\S]*?)<\/button>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const raw = match[0];
    const text = (match[1] || match[2] || '').replace(/<[^>]+>/g, '').trim();
    if (raw.includes('games.html') || text.includes('Games') || text.includes('‹') || text.includes('Back')) {
      backLinks.push({ raw: raw.slice(0, 100), text });
    }
  }

  // Check header structure
  const headerMatch = content.match(/<header[\s\S]*?<\/header>/i);
  const headerHtml = headerMatch ? headerMatch[0] : 'NO HEADER';
  const hasOfficialLogo = headerHtml.includes('vanvi-moments-logo-header.png');
  const hasBreadcrumbBar = content.includes('breadcrumb-bar');

  console.log(`\n📄 ${file}:`);
  console.log(`  - Header official logo: ${hasOfficialLogo ? '✅ YES' : '❌ NO'}`);
  console.log(`  - Has separate breadcrumb bar: ${hasBreadcrumbBar ? '⚠️ YES' : 'NO'}`);
  console.log(`  - Back buttons found (${backLinks.length}):`);
  backLinks.forEach((b, i) => {
    console.log(`    ${i + 1}. [Text: "${b.text}"] ${b.raw}`);
  });
});
