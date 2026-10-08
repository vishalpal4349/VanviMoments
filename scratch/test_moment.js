const fs = require('fs');

console.log('=== VANVI MOMENT.HTML VERIFICATION SUITE ===\n');

const html = fs.readFileSync('moment.html', 'utf8');

let pass = 0;
let total = 0;

function check(name, cond) {
  total++;
  if (cond) {
    console.log(`✅ PASS: ${name}`);
    pass++;
  } else {
    console.error(`❌ FAIL: ${name}`);
  }
}

// 1. Script syntax check
const scripts = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi) || [];
check('Has script tags', scripts.length > 0);
scripts.forEach((s, i) => {
  const code = s.replace(/<script[\s\S]*?>/i, '').replace(/<\/script>/i, '');
  try {
    new Function(code);
    check(`Script ${i+1} valid syntax`, true);
  } catch (err) {
    check(`Script ${i+1} valid syntax (${err.message})`, false);
  }
});

// 2. Duplicate IDs check
const idMatches = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
const dupes = idMatches.filter((item, index) => idMatches.indexOf(item) !== index);
check(`Zero duplicate IDs found (${idMatches.length} IDs checked)`, dupes.length === 0);

// 3. Act 1: Mystery Lock (Envelope & PIN)
check('Act 1: Lock scene present (#sceneLock)', html.includes('id="sceneLock"'));
check('Envelope stage present (#envelopeStage)', html.includes('id="envelopeStage"'));
check('Wax seal present (#waxSeal)', html.includes('id="waxSeal"'));
check('PIN passcode box present (#pinBox)', html.includes('id="pinBox"'));
check('PIN keypad with 0-9 keys present', html.includes('class="pin-key"'));
check('Switch lock mode toggle present (#btnSwitchLockMode)', html.includes('id="btnSwitchLockMode"'));

// 4. Act 2: Heartfelt Letter
check('Act 2: Letter scene present (#sceneLetter)', html.includes('id="sceneLetter"'));
check('Letter salutation and content present', html.includes('id="letterSalutation"') && html.includes('id="letterContentText"'));
check('Letter sender signature present', html.includes('id="letterSenderName"'));
check('Continue to photos button present (#btnContinueToPhotos)', html.includes('id="btnContinueToPhotos"'));

// 5. Act 3: Photo Memory Story
check('Act 3: Photos scene present (#scenePhotos)', html.includes('id="scenePhotos"'));
check('Polaroid image and caption present', html.includes('id="polaroidImage"') && html.includes('id="polaroidCaption"'));
check('Photo navigation arrows and dots present', html.includes('id="btnPrevPhoto"') && html.includes('id="btnNextPhoto"') && html.includes('id="photoDots"'));
check('Continue to climax button present (#btnContinueToClimax)', html.includes('id="btnContinueToClimax"'));

// 6. Act 4: Climax & Celebration
check('Act 4: Climax scene present (#sceneClimax)', html.includes('id="sceneClimax"'));
check('Celebration canvas present (#celebrationCanvas)', html.includes('id="celebrationCanvas"'));
check('Love reaction tap button present (#btnLoveTap)', html.includes('id="btnLoveTap"'));
check('Dynamic WhatsApp reply button present (#whatsappReplyLink)', html.includes('id="whatsappReplyLink"'));

// 7. Audio Engine
check('Floating music player bar present (#floatingMusicBar)', html.includes('id="floatingMusicBar"'));
check('Music toggle button present (#btnToggleMusic)', html.includes('id="btnToggleMusic"'));
check('Volume slider present (#musicVolumeSlider)', html.includes('id="musicVolumeSlider"'));
check('Web Audio synthesizer engine present in code', html.includes('window.VanviMomentEngine') && html.includes('AudioEngine'));

// 8. Mobile Responsiveness & Safety
const vp = html.match(/<meta[^>]*content="([^"]*)"[^>]*name="viewport"/i) || html.match(/<meta[^>]*name="viewport"[^>]*content="([^"]*)"/i);
check('Viewport allows user zoom (no user-scalable=no)', vp && !vp[1].includes('user-scalable=no'));
check('Overflow-x locked (overflow-x: hidden !important)', html.includes('overflow-x: hidden !important;'));

// 9. Navigation links to Studio and Home
check('Link back to ai-matcher.html studio present', html.includes('href="ai-matcher.html"'));
check('Link back to index.html home present', html.includes('href="index.html"'));

console.log(`\nResults: ${pass} / ${total} checks passed.`);
if (pass === total) {
  console.log('🎉 ALL MOMENT.HTML CHECKS PASSED PERFECTLY!');
} else {
  process.exit(1);
}
