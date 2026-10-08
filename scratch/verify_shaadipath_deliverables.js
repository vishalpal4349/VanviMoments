const fs = require('fs');
const assert = require('assert');

// 1. Verify custom-experience.html
const ceHtml = fs.readFileSync('custom-experience.html', 'utf8');
assert(ceHtml.includes('The Vanvi Bespoke Atelier'), 'Missing Atelier headline');
assert(ceHtml.includes('How Your Bespoke World Takes Shape'), 'Missing 3-step journey');
assert(ceHtml.includes('Atelier Premiere'), 'Missing Premiere tier');
assert(ceHtml.includes('Royal Signature'), 'Missing Royal Signature tier');
assert(ceHtml.includes('Couture Universe'), 'Missing Couture Universe tier');
assert(ceHtml.includes('id="customForm"'), 'Missing customForm ID');
assert(ceHtml.includes('id="budget"'), 'Missing budget dropdown');

// 2. Verify royal-udaivilas-baithak
const rbHtml = fs.readFileSync('templates/royal-udaivilas-baithak/index.html', 'utf8');
assert(rbHtml.includes('The Royal Wedding Baithak'), 'Missing intro title');
assert(rbHtml.includes('id="screenBloom"'), 'Missing screen bloom');
assert(rbHtml.includes('id="petalCanvas"'), 'Missing petal canvas');
assert(rbHtml.includes('Sacred Ceremonies'), 'Missing ceremonies section');
assert(rbHtml.includes('submitWhatsAppRSVP()'), 'Missing WhatsApp RSVP function');

// 3. Verify registry
const registry = fs.readFileSync('js/vanvi-templates-data.js', 'utf8');
assert(registry.includes('royal-udaivilas-baithak'), 'Missing royal-udaivilas-baithak in templates data');

console.log('✅ ALL PROGRAMMATIC VALIDATIONS PASSED 100%!');
