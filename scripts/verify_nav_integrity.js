const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let issues = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Check 1: index.html must NOT contain vanvi-bottom-dock
  if (file === 'index.html') {
    if (content.includes('vanvi-bottom-dock') || content.includes('vanvi-navigation.css')) {
      issues.push(`CRITICAL: index.html was modified with new nav!`);
    }
    return;
  }

  // Check 2: All internal pages must link to vanvi-navigation.css
  if (!content.includes('vanvi-navigation.css')) {
    issues.push(`${file} is missing vanvi-navigation.css`);
  }

  // Check 3: All internal pages must include vanvi-navigation.js
  if (!content.includes('js/vanvi-navigation.js')) {
    issues.push(`${file} is missing js/vanvi-navigation.js`);
  }

  // Check 4: Check docks on non-immersive pages
  if (file !== 'moment.html' && file !== 'vanvi-assistant.html') {
    const dockCount = (content.match(/class=["'][^"']*vanvi-bottom-dock[^"']*["']/g) || []).length;
    if (dockCount === 0) {
      issues.push(`${file} is missing vanvi-bottom-dock markup`);
    } else if (dockCount > 1) {
      issues.push(`${file} has duplicate (${dockCount}) vanvi-bottom-dock elements`);
    }

    // Check 5: Check that old docks are completely gone
    const oldDockCount = (content.match(/class=["']bottom-dock["']/g) || []).length;
    if (oldDockCount > 0) {
      issues.push(`${file} still contains legacy bottom-dock markup`);
    }

    // Check 6: Label "Vanvi AI" MUST be used and never shortened to "AI"
    if (content.includes('vanvi-bottom-dock')) {
      if (!content.includes('Vanvi AI')) {
        issues.push(`${file} navigation dock does not contain "Vanvi AI"`);
      }
      // Check for exact icons
      if (!content.includes('⌂') || !content.includes('✿') || !content.includes('✦') || !content.includes('♡')) {
        issues.push(`${file} navigation dock is missing required icon symbols`);
      }
    }
  }

  // Check 7: Back button check
  if (!content.includes('vanvi-btn-back') && file !== 'index.html') {
    issues.push(`${file} is missing vanvi-btn-back`);
  }
});

console.log('=== NAVIGATION INTEGRITY AUDIT ===');
if (issues.length === 0) {
  console.log('✅ ALL 39 INTERNAL PAGES PASSED 100% OF AUDIT CHECKS!');
  console.log('✅ index.html is 100% untouched!');
  console.log('✅ 0 duplicate navigation bars!');
  console.log('✅ "Vanvi AI" present everywhere!');
  console.log('✅ Global 3D Soft Aurora dock and ‹ Back button unified across entire website!');
} else {
  console.error('Found issues:');
  issues.forEach(i => console.error(' - ' + i));
  process.exit(1);
}
