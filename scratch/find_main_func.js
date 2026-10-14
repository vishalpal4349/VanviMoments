const fs = require('fs');

const code = fs.readFileSync('scratch/amadowish/BirthdayReceiver.js', 'utf8');

// Let's print out all state variables and effects in the main component
const mainFuncIdx = code.indexOf('function Ce(');
console.log('Main func starts at:', mainFuncIdx);
if (mainFuncIdx !== -1) {
  fs.writeFileSync('scratch/main_func.js', code.slice(mainFuncIdx), 'utf8');
  console.log('Saved scratch/main_func.js, length:', code.length - mainFuncIdx);
} else {
  // Let's find default export
  const expMatch = code.match(/export\s*\{\s*(\w+)\s+as\s+default/);
  console.log('Export match:', expMatch);
  if (expMatch) {
    const fnName = expMatch[1];
    const fnIdx = code.indexOf('function ' + fnName);
    console.log('Function ' + fnName + ' at ' + fnIdx);
    fs.writeFileSync('scratch/main_func.js', code.slice(fnIdx), 'utf8');
  }
}
