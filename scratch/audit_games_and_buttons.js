const fs = require('fs');

const games = [
  'games.html', 'block-blast.html', 'brain-test.html', 'cross-math.html',
  'gem-catch.html', 'gem-merge.html', 'heart-rain.html', 'heart-sort.html',
  'hidden-hearts.html', 'love-puzzle.html', 'memory-rush.html', 'memory-sequence.html',
  'periodic-quiz.html', 'quick-tap.html', 'risk-run.html', 'unlock-gift.html', 'word-whisper.html'
];

let totalButtons = 0;
let totalForms = 0;

games.forEach(g => {
  const content = fs.readFileSync(g, 'utf8');
  const btnMatches = (content.match(/<button/gi) || []).length + (content.match(/class="[^"]*btn[^"]*"/gi) || []).length;
  const formMatches = (content.match(/<form/gi) || []).length;
  totalButtons += btnMatches;
  totalForms += formMatches;
  const hasInnerLight = content.includes('vanvi-inner-light.css');
  const hasNav = content.includes('vanvi-navigation.css');
  console.log(`${g} - Buttons: ${btnMatches} | InnerLight: ${hasInnerLight} | Nav: ${hasNav}`);
});

console.log(`\nTotal Game Buttons: ${totalButtons} | Total Game Forms: ${totalForms}`);
