const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const aiMatcherHtml = fs.readFileSync(path.join(__dirname, '..', 'ai-matcher.html'), 'utf8');

console.log('Testing Home AI Interactive Prompt Section:');

const checks = [
  { name: 'Has homeAiPromptInput textarea', pass: indexHtml.includes('id="homeAiPromptInput"') },
  { name: 'Has btnTryDemoPrompt button', pass: indexHtml.includes('id="btnTryDemoPrompt"') },
  { name: 'Has btnClearPrompt button', pass: indexHtml.includes('id="btnClearPrompt"') },
  { name: 'Has btnGenerateAiExperience button', pass: indexHtml.includes('id="btnGenerateAiExperience"') },
  { name: 'Occasion pills have data-occasion and data-demo', pass: indexHtml.includes('data-occasion="birthday"') && indexHtml.includes('data-demo=') },
  { name: 'ai-interactive-textarea CSS styled', pass: indexHtml.includes('.ai-interactive-textarea') },
  { name: 'JS triggerHomeAiGeneration connects to ai-matcher.html?prompt=', pass: indexHtml.includes('ai-matcher.html?prompt=') },
  { name: 'ai-matcher.html reads prompt query param', pass: aiMatcherHtml.includes("params.get('prompt')") }
];

let allPassed = true;
checks.forEach(c => {
  if (c.pass) {
    console.log(`  ✅ PASS: ${c.name}`);
  } else {
    console.log(`  ❌ FAIL: ${c.name}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\n🎉 ALL HOME AI INTERACTIVE PROMPT CHECKS PASSED PERFECTLY!');
} else {
  console.error('\n❌ SOME CHECKS FAILED!');
  process.exit(1);
}
