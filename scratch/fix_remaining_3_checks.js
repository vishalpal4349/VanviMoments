const fs = require('fs');
const path = require('path');

// 1. rewards.html
const rewardsPath = path.join(__dirname, '..', 'rewards.html');
let rewards = fs.readFileSync(rewardsPath, 'utf8');
rewards = rewards.replace(
  /onclick="safeGoBack\(\)"/,
  'onclick="if (history.length > 1) { history.back(); } else { location.href=\'index.html\'; }"'
);
fs.writeFileSync(rewardsPath, rewards, 'utf8');
console.log('✅ rewards.html back button updated');

// 2. plans.html
const plansPath = path.join(__dirname, '..', 'plans.html');
let plans = fs.readFileSync(plansPath, 'utf8');
plans = plans.replace(
  /<a class="vanvi-btn-back" href="javascript:void\(0\)" onclick="safeGoBack\(\)">/,
  '<a class="vanvi-btn-back" href="javascript:void(0)" onclick="if (history.length > 1) { history.back(); return false; } else { safeGoBack(); }">'
);
fs.writeFileSync(plansPath, plans, 'utf8');
console.log('✅ plans.html back button updated');

// 3. index.html
const indexPath = path.join(__dirname, '..', 'index.html');
let index = fs.readFileSync(indexPath, 'utf8');
const i18nSnippet = `<script src="js/vanvi-i18n.js"></script>
<script>
if (window.VanviI18n && typeof window.VanviI18n.setLanguage === 'function') {
  const saved = localStorage.getItem('vanvi_lang') || 'en';
  window.VanviI18n.setLanguage(saved);
}
</script>`;
index = index.replace('<script src="js/vanvi-i18n.js"></script>', i18nSnippet);
fs.writeFileSync(indexPath, index, 'utf8');
console.log('✅ index.html language connection updated');
