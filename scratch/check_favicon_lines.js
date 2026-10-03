const fs = require('fs');
const files = [
  'constellation-of-love.html',
  'forgot-password.html',
  'gem-catch.html',
  'heart-rain.html',
  'login.html',
  'love-puzzle.html',
  'memory-rush.html',
  'quick-tap.html',
  'rewards.html',
  'signup.html',
  'unlock-gift.html',
  'word-whisper.html'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('<link rel="icon"') || l.includes('favicon.svg')) {
      console.log(f + ':' + (i+1) + ' => ' + l);
    }
  });
});
