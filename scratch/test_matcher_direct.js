const fs = require('fs');
const content = fs.readFileSync('ai-matcher.html', 'utf8');

console.log('=== Checking ai-matcher.html ===');
const hasPandaThoughtBox = content.includes('id="pandaLiveThoughtBox"');
console.log('Has bulky pandaLiveThoughtBox (should be FALSE):', hasPandaThoughtBox);

const hasSuggestCardsCol = content.includes('id="suggestCardsCol"');
console.log('Has direct suggestCardsCol (should be TRUE):', hasSuggestCardsCol);

const hasBtnRecalculate = content.includes('id="btnRecalculate"');
console.log('Has btnRecalculate (should be TRUE):', hasBtnRecalculate);

if (!hasPandaThoughtBox && hasSuggestCardsCol && hasBtnRecalculate) {
  console.log('✅ PASS: Fluff thought box removed! Matched templates are directly displayed to user.');
} else {
  console.error('❌ FAIL: Matcher structure issue.');
  process.exit(1);
}
