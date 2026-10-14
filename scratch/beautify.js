const fs = require('fs');

const code = fs.readFileSync('scratch/amadowish/BirthdayReceiver.js', 'utf8');

// Replace minified tokens to make it readable
let readable = code
  .replace(/;/g, ';\n')
  .replace(/\{/g, '{\n')
  .replace(/\}/g, '\n}\n');

fs.writeFileSync('c:\\Users\\RISHU KUMARI\\VanviMoments\\scratch\\readable_receiver.js', readable, 'utf8');
console.log('Saved readable_receiver.js. Total lines:', readable.split('\n').length);
