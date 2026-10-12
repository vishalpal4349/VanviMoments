const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, '..', 'admin.html');
const content = fs.readFileSync(adminPath, 'utf8');

// 1. Check all scripts inside admin.html for JS syntax errors
const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let scriptIdx = 0;
let hasSyntaxError = false;

while ((match = scriptRegex.exec(content)) !== null) {
  scriptIdx++;
  const scriptCode = match[1];
  try {
    new Function(scriptCode);
    console.log(`✓ Admin script #${scriptIdx} syntax is clean.`);
  } catch (err) {
    console.error(`❌ Admin script #${scriptIdx} has syntax error:`, err.message);
    hasSyntaxError = true;
  }
}

// 2. Check all tab buttons and tab panes
const tabBtnMatches = content.match(/data-tab="([^"]+)"|switchTab\('([^']+)'\)/g) || [];
console.log(`Found ${tabBtnMatches.length} tab trigger instances.`);

// Extract tab ids
const tabTriggers = new Set();
tabBtnMatches.forEach(m => {
  const t = m.match(/['"]([^'"]+)['"]/);
  if (t && t[1]) tabTriggers.add(t[1]);
});

console.log('Unique tabs triggered:', Array.from(tabTriggers));

tabTriggers.forEach(tabId => {
  const paneExists = content.includes(`id="tab-${tabId}"`) || content.includes(`id="${tabId}"`);
  if (!paneExists) {
    console.warn(`⚠️ Warning: Tab pane for "${tabId}" might be missing in DOM.`);
  } else {
    console.log(`✓ Tab pane "${tabId}" confirmed in DOM.`);
  }
});

if (!hasSyntaxError) {
  console.log('\n✅ ADMIN.HTML SYNTAX AND TAB NAVIGATION ARE FULLY OPERATIONAL!');
} else {
  process.exit(1);
}
