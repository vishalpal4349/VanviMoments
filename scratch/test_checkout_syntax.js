const fs = require('fs');
const path = require('path');

const checkoutPath = path.join(__dirname, '..', 'checkout.html');
const content = fs.readFileSync(checkoutPath, 'utf8');

const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let scriptIdx = 0;
let hasError = false;

while ((match = scriptRegex.exec(content)) !== null) {
  scriptIdx++;
  const code = match[1];
  try {
    new Function(code);
    console.log(`✓ Checkout script #${scriptIdx} syntax is valid.`);
  } catch (err) {
    console.error(`❌ Checkout script #${scriptIdx} syntax error:`, err.message);
    hasError = true;
  }
}

if (!hasError) {
  console.log('\n✅ CHECKOUT.HTML SCRIPTS ARE 100% VALID JAVASCRIPT!');
} else {
  process.exit(1);
}
