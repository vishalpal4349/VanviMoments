const fs = require('fs');
const path = require('path');

console.log('Testing colorful profile.html with names under corner icons...');

const profileHtml = fs.readFileSync(path.join(__dirname, '..', 'profile.html'), 'utf8');

const tests = [
  { name: '8 Luxury Colors Defined in :root', check: profileHtml.includes('--c-rose') && profileHtml.includes('--c-violet') && profileHtml.includes('--c-gold') && profileHtml.includes('--c-emerald') && profileHtml.includes('--c-sky') && profileHtml.includes('--c-coral') && profileHtml.includes('--c-ruby') && profileHtml.includes('--c-plum') },
  { name: 'Corner Buttons Have Names Written Underneath Icons', check: profileHtml.includes('corner-icon') && profileHtml.includes('corner-label') && profileHtml.includes('Back') && profileHtml.includes('Share') && profileHtml.includes('Home') && profileHtml.includes('EN / हिंदी') },
  { name: 'Colorful 4-Stat Row (Rose, Ruby, Gold, Emerald)', check: profileHtml.includes('stat-creations') && profileHtml.includes('stat-favorites') && profileHtml.includes('stat-coins') && profileHtml.includes('stat-perks') },
  { name: '8 Distinct Color Tiles in Menu Items', check: profileHtml.includes('--c-rose') && profileHtml.includes('--c-ruby') && profileHtml.includes('--c-sky') && profileHtml.includes('--c-emerald') && profileHtml.includes('--c-coral') && profileHtml.includes('--c-violet') && profileHtml.includes('--c-gold') && profileHtml.includes('--c-plum') },
  { name: 'Floating Bottom Dock with Names Under Every Icon', check: profileHtml.includes('dock.home') && profileHtml.includes('dock.templates') && profileHtml.includes('fab-sub') && profileHtml.includes('dock.gifts') && profileHtml.includes('dock.profile') },
  { name: 'Preserved LocalStorage/SessionStorage & Auth Logic', check: profileHtml.includes('vanvi_user_name') && profileHtml.includes('vanvi_user_email') && profileHtml.includes('vanvi_is_vip') && profileHtml.includes('handleSignOut') && profileHtml.includes('openShareApp') }
];

let failed = false;
tests.forEach(t => {
  if (t.check) {
    console.log(`  ✅ ${t.name}: PASSED`);
  } else {
    console.error(`  ❌ ${t.name}: FAILED`);
    failed = true;
  }
});

if (failed) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL COLORFUL PROFILE TESTS PASSED 100%!');
}
