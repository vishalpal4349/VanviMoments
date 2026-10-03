const http = require('http');

function testServer() {
  http.get('http://localhost:5500/ai.html', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('✓ ai.html HTTP Status:', res.statusCode);
      console.log('✓ Page size:', (data.length / 1024).toFixed(1), 'KB');

      const checks = [
        ['Prompt Textarea', 'id="promptInput"'],
        ['Auto Magic Toggle', 'id="autoMagicToggle"'],
        ['VIP Boost Button', 'applyVipBoost()'],
        ['Categories Tray Carousel', 'id="categoriesTray"'],
        ['Birthday Category Pill', 'selectToolCategory(\'birthday\''],
        ['Love Letter Category Pill', 'selectToolCategory(\'love\''],
        ['Anniversary Category Pill', 'selectToolCategory(\'anniversary\''],
        ['Surprise Reveal Category Pill', 'selectToolCategory(\'surprise\''],
        ['Friendship Category Pill', 'selectToolCategory(\'friendship\''],
        ['Sincere Apology Category Pill', 'selectToolCategory(\'apology\''],
        ['Gratitude & Mom Category Pill', 'selectToolCategory(\'gratitude\''],
        ['Craft Magic Button', 'id="btnGenerate"'],
        ['Surprise Me Button', 'id="btnSurpriseMe"'],
        ['Voice Dictation Button', 'id="btnVoicePrompt"'],
        ['Starter Chips Row', 'class="starters-row"'],
        ['Live Preview Card', 'id="livePreviewCard"'],
        ['Preview Live Indicator', 'class="preview-live-indicator"'],
        ['Celebration Artwork Container', 'id="screenVisual"'],
        ['Celebration Salutation', 'id="screenSalutation"'],
        ['Letter Text Container', 'id="screenLetter"'],
        ['Poetry / Hinglish / Short Tabs', 'class="screen-variation-tabs"'],
        ['Interactive Wax Seal Reveal', 'simulateWaxUnlock()'],
        ['Audio Equalizer Test Sound', 'id="audioEqBars"'],
        ['Quick Magic Refinements Section', 'class="magic-actions-section"'],
        ['Make More Emotional Action', 'refineDraft(\'Make it more deeply emotional and heartfelt\')'],
        ['Make Cinematic Action', 'refineDraft(\'Make it cinematic, poetic and grand\')'],
        ['Make Cuter Action', 'refineDraft(\'Make it sweeter, cuter and warmer\')'],
        ['Rewrite Naturally Action', 'refineDraft(\'Rewrite in natural, conversational Hinglish\')'],
        ['Make Shorter Action', 'refineDraft(\'Make it punchy, short and crisp\')'],
        ['Add Secret PIN Action', 'refineDraft(\'Add a 4-digit secret PIN surprise lock\')'],
        ['Full Preview Modal', 'id="fullscreenModal"'],
        ['Ready Bottom Banner Actions', 'class="ready-banner"'],
        ['Handoff to Builder', 'openInBuilder()'],
        ['Proceed to Create CTA', 'proceedToCreate()'],
        ['Coins Balance Display', 'id="navWalletCoins"'],
        ['Responsive Meta Tag', 'name="viewport"'],
        ['No Horizontal Scroll Rule', 'overflow-x: hidden !important'],
        ['Fine-Tune Accordion', 'id="advancedContent"'],
        ['Audio Synthesizer Engine', 'AudioContext'],
        ['Handoff Transient Storage', 'vanvi_transient_moment']
      ];

      let allPassed = true;
      checks.forEach(([label, pattern]) => {
        const found = data.includes(pattern);
        if (found) {
          console.log(`  ✓ [PASS] ${label}`);
        } else {
          console.error(`  ✗ [FAIL] Missing: ${label} (${pattern})`);
          allPassed = false;
        }
      });

      console.log('\nResult: ' + (allPassed ? 'ALL AUDIT CHECKS PASSED PERFECTLY! 🚀' : 'Some checks failed'));
    });
  }).on('error', err => {
    console.error('Server error:', err.message);
  });
}

testServer();
