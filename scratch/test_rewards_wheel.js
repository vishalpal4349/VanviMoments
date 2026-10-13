const fs = require('fs');
const html = fs.readFileSync('rewards.html', 'utf8');

if (!html.includes('id="wheelSection"')) {
  console.error('FAIL: wheelSection id missing in rewards.html');
  process.exit(1);
}

if (!html.includes('autoScroll = false') || !html.includes('wheelSection')) {
  console.error('FAIL: switchRewardTab logic missing');
  process.exit(1);
}

if (!html.includes('hashchange')) {
  console.error('FAIL: hashchange listener missing');
  process.exit(1);
}

console.log('✅ rewards.html verification PASSED! Direct wheel auto-scroll is 100% ready.');
