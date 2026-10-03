const fs = require('fs');
const path = require('path');

// 1. rewards.html
const rewardsPath = path.join(__dirname, '..', 'rewards.html');
let rewards = fs.readFileSync(rewardsPath, 'utf8');

// Ensure back button in rewards.html has exact string
if (!rewards.includes("if (history.length > 1) { history.back(); } else { location.href='index.html'; }")) {
  rewards = rewards.replace(
    /onclick="vanviGoBack\([^)]*\)"/,
    'onclick="if (history.length > 1) { history.back(); } else { location.href=\'index.html\'; }"'
  );
}
// Ensure lang-toggle in header
if (!rewards.includes('class="lang-toggle"')) {
  rewards = rewards.replace(
    /<div class="header-actions">/,
    '<div class="header-actions">\n      <button type="button" class="lang-toggle" onclick="window.VanviI18n && window.VanviI18n.toggle()">🌐 EN / HI</button>'
  );
}
fs.writeFileSync(rewardsPath, rewards, 'utf8');
console.log('✅ rewards.html updated');

// 2. index.html - connect language toggle with VanviI18n.setLanguage
const indexPath = path.join(__dirname, '..', 'index.html');
let index = fs.readFileSync(indexPath, 'utf8');
if (!index.includes('window.VanviI18n.setLanguage')) {
  index = index.replace(
    /document\.addEventListener\('DOMContentLoaded', \(\) => \{/,
    "document.addEventListener('DOMContentLoaded', () => {\n  // Connect language toggle\n  if (window.VanviI18n && typeof window.VanviI18n.setLanguage === 'function') {\n    const saved = localStorage.getItem('vanvi_lang') || 'en';\n    window.VanviI18n.setLanguage(saved);\n  }"
  );
  fs.writeFileSync(indexPath, index, 'utf8');
  console.log('✅ index.html updated');
}

// 3. products.html - smart back button
const productsPath = path.join(__dirname, '..', 'products.html');
let products = fs.readFileSync(productsPath, 'utf8');
if (!products.includes('if (history.length > 1) { history.back(); return false; }')) {
  products = products.replace(
    /onclick="vanviGoBack\([^)]*\)"/,
    'onclick="if (history.length > 1) { history.back(); return false; } else { location.href=\'templates.html\'; }"'
  );
  fs.writeFileSync(productsPath, products, 'utf8');
  console.log('✅ products.html updated');
}

// 4. templates.html - vanvi-i18n.js & smart back button
const templatesPath = path.join(__dirname, '..', 'templates.html');
let templates = fs.readFileSync(templatesPath, 'utf8');
if (!templates.includes('src="js/vanvi-i18n.js"')) {
  templates = templates.replace(
    /<script src="js\/vanvi-templates-data\.js"><\/script>/,
    '<script src="js/vanvi-i18n.js"></script>\n  <script src="js/vanvi-templates-data.js"></script>'
  );
}
if (!templates.includes('if (history.length > 1) { history.back(); return false; }')) {
  templates = templates.replace(
    /onclick="vanviGoBack\([^)]*\)"/,
    'onclick="if (history.length > 1) { history.back(); return false; } else { location.href=\'index.html\'; }"'
  );
}
fs.writeFileSync(templatesPath, templates, 'utf8');
console.log('✅ templates.html updated');

// 5. plans.html - vanvi-i18n.js & smart back button
const plansPath = path.join(__dirname, '..', 'plans.html');
let plans = fs.readFileSync(plansPath, 'utf8');
if (!plans.includes('src="js/vanvi-i18n.js"')) {
  plans = plans.replace(
    /<script src="js\/vanvi-api\.js"><\/script>/,
    '<script src="js/vanvi-i18n.js"></script>\n  <script src="js/vanvi-api.js"></script>'
  );
}
if (!plans.includes('if (history.length > 1) { history.back(); return false; }')) {
  plans = plans.replace(
    /onclick="vanviGoBack\([^)]*\)"/,
    'onclick="if (history.length > 1) { history.back(); return false; } else { location.href=\'index.html\'; }"'
  );
}
fs.writeFileSync(plansPath, plans, 'utf8');
console.log('✅ plans.html updated');

// 6. builder.html - smart back button
const builderPath = path.join(__dirname, '..', 'builder.html');
let builder = fs.readFileSync(builderPath, 'utf8');
if (!builder.includes('if (history.length > 1) { history.back(); return false; }')) {
  builder = builder.replace(
    /onclick="vanviGoBack\([^)]*\)"/,
    'onclick="if (history.length > 1) { history.back(); return false; } else { location.href=\'index.html\'; }"'
  );
  fs.writeFileSync(builderPath, builder, 'utf8');
  console.log('✅ builder.html updated');
}

console.log('🎉 Site-wide UX synchronization complete!');
