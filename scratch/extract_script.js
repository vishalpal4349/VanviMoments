const fs = require('fs');
const html = fs.readFileSync('scratch/vercel_raw.html', 'utf8');

const scripts = [...html.matchAll(/<script[\s\S]*?<\/script>/gi)].map(m => m[0]);
const inlineScript = scripts[2]; // Script 2

// Write Script 2 to scratch/script2.js to view it cleanly
fs.writeFileSync('scratch/script2.js', inlineScript.replace(/<\/?script>/gi, ''), 'utf8');
console.log('Script 2 written to scratch/script2.js. Length:', inlineScript.length);
