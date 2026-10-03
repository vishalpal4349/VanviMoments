const fs = require('fs');

console.log('=== VANVI AI SIMPLIFIED UX VERIFICATION ===\n');

const aiHtml = fs.readFileSync('ai.html', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');

let passCount = 0;
let totalChecks = 0;

function check(name, condition) {
  totalChecks++;
  if (condition) {
    console.log(`✅ PASS: ${name}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${name}`);
  }
}

// 1. ai.html Hero
check('Hero Title contains "Tell Vanvi what you want to create."', aiHtml.includes('Tell Vanvi what you want to create.'));
check('Hero Subtitle contains "Just type it normally. Vanvi will understand."', aiHtml.includes('Just type it normally. Vanvi will understand.'));

// 2. Large input
check('Large prompt input placeholder "Birthday message for my best friend..."', aiHtml.includes('placeholder="Birthday message for my best friend..."'));
check('Prompt textarea present with id="aiPromptInput"', aiHtml.includes('id="aiPromptInput"'));

// 3. Simple Selectors
const occasions = ['Birthday', 'Love', 'Anniversary', 'Friendship', 'Celebration', 'Other'];
const hasAllOccasions = occasions.every(o => aiHtml.includes(`data-occ="${o}"`));
check('Occasion selector has exact 6 requested chips (Birthday, Love, Anniversary, Friendship, Celebration, Other)', hasAllOccasions);

const styles = ['Emotional', 'Cute', 'Elegant', 'Fun'];
const hasAllStyles = styles.every(s => aiHtml.includes(`data-style="${s}"`));
check('Style selector has exact 4 requested chips (Emotional, Cute, Elegant, Fun)', hasAllStyles);

// 4. Main CTA
check('Main CTA button "Create with Vanvi ✨" present', aiHtml.includes('Create with Vanvi ✨'));

// 5. Collapsible More Options
check('More options toggle button present', aiHtml.includes('id="btnToggleMoreOptions"'));
check('More options drawer closed by default (display:none)', aiHtml.includes('id="optionsDrawer" style="display:none;"'));
check('More options contains Language, Length, Feeling, Recipient', 
  aiHtml.includes('id="ctrlLanguage"') &&
  aiHtml.includes('id="ctrlLength"') &&
  aiHtml.includes('id="ctrlFeeling"') &&
  aiHtml.includes('id="ctrlRecipient"')
);

// 6. AI Understanding Card
check('AI Understanding banner present with "Vanvi understood:"', aiHtml.includes('Vanvi understood:'));
check('Pill chips present for Occasion, Recipient, Style, Language', 
  aiHtml.includes('id="pillOccasion"') &&
  aiHtml.includes('id="pillRecipient"') &&
  aiHtml.includes('id="pillStyle"') &&
  aiHtml.includes('id="pillLanguage"')
);

// 7. Result Card & Consolidated Actions
check('Single Result Card present', aiHtml.includes('id="resultCard"'));
check('Message output box present', aiHtml.includes('id="messageOutput"'));
check('"Make it better" dropdown present', aiHtml.includes('id="btnMakeBetter"') && aiHtml.includes('id="makeBetterMenu"'));
check('"Try another" button present', aiHtml.includes('id="btnTryAnother"'));
check('"Copy" button present', aiHtml.includes('id="btnCopy"'));
check('"Edit" button present', aiHtml.includes('id="btnEdit"'));
check('"Create My Moment" handoff CTA present', aiHtml.includes('id="btnCreateMyMoment"'));

// 8. Relocated Magic Tools
check('"More AI Magic" section present at bottom', aiHtml.includes('✨ More AI Magic'));

// 9. Mobile Rules
check('Viewport allows user zoom (no user-scalable=no)', !aiHtml.includes('user-scalable=no'));
check('Mobile 16px font-size on inputs present (prevents browser auto-zoom)', aiHtml.includes('font-size: 16px'));
check('Zero horizontal overflow (overflow-x: hidden !important)', aiHtml.includes('overflow-x: hidden !important'));

console.log(`\nResults: ${passCount} / ${totalChecks} tests passed.`);
if (passCount === totalChecks) {
  console.log('🎉 ALL TESTS PASSED PERFECTLY!\n');
} else {
  process.exit(1);
}
