const fs = require('fs');

const code = fs.readFileSync('scratch/amadowish/BirthdayReceiver.js', 'utf8');

// Find definitions before function S
const beforeS = code.slice(0, 7643);

fs.writeFileSync('c:\\Users\\RISHU KUMARI\\VanviMoments\\scratch\\before_s.js', beforeS, 'utf8');
console.log('Saved before_s.js, length:', beforeS.length);
