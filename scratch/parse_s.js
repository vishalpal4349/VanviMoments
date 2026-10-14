const fs = require('fs');

const code = fs.readFileSync('scratch/main_func.js', 'utf8');

// Let's break it down by screens
console.log('Function S length:', code.length);

// Look for data-screen or screen transitions
const screenRegex = /data-screen`:\s*`([^`]+)`/g;
let m;
const screens = [];
while ((m = screenRegex.exec(code)) !== null) {
  screens.push(m[1]);
}
console.log('Screens in order:', screens);

// Look for state initializations
const stateMatches = code.match(/useState\([^)]*\)/g) || [];
console.log('State initializations count:', stateMatches.length);
console.log('State initializations:', stateMatches);
