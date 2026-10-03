const fs = require('fs');
const html = fs.readFileSync('vanvi-assistant.html', 'utf8');

const scripts = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi) || [];
console.log('vanvi-assistant.html scripts count:', scripts.length);
scripts.forEach((s, i) => {
  const code = s.replace(/<script[\s\S]*?>/i, '').replace(/<\/script>/i, '');
  try {
    new Function(code);
    console.log(`Script ${i+1}: Valid JS syntax`);
  } catch (err) {
    console.error(`Script ${i+1} Syntax Error:`, err.message);
  }
});

const idMatches = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
const dupes = idMatches.filter((item, index) => idMatches.indexOf(item) !== index);
console.log('Total IDs found in vanvi-assistant.html:', idMatches.length);
console.log('Duplicate IDs in vanvi-assistant.html:', dupes.length ? dupes : 'None (All Unique)');

// Check key elements
const requiredIds = ['chatFeed', 'userInput', 'btnSend', 'btnMic', 'btnSoundToggle', 'welcomeHeading'];
const foundIds = requiredIds.filter(id => html.includes(`id="${id}"`));
console.log('Required IDs present:', foundIds.length === requiredIds.length ? 'All ✅' : `Missing: ${requiredIds.filter(id => !foundIds.includes(id))}`);

// Check backend integration
const hasChatFetch = html.includes("'/api/ai/chat'") || html.includes('"/api/ai/chat"');
const hasVanviAPI = html.includes('VanviAPI');
console.log('Backend chat integration:', hasChatFetch || hasVanviAPI ? '✅ Connected' : '❌ Missing');
console.log('VanviAPI adapter:', hasVanviAPI ? '✅ Used' : '⚠️ Direct fetch');

// Check vanvi-api.js script tag
const hasApiScript = html.includes('js/vanvi-api.js');
console.log('API adapter loaded:', hasApiScript ? '✅ Yes' : '❌ Missing');

// Check voice synthesis
const hasVoice = html.includes('speechSynthesis') || html.includes('SpeechSynthesisUtterance');
console.log('Voice synthesis support:', hasVoice ? '✅ Present' : '❌ Missing');

// Check speech recognition
const hasSpeechRec = html.includes('SpeechRecognition') || html.includes('webkitSpeechRecognition');
console.log('Speech recognition support:', hasSpeechRec ? '✅ Present' : '❌ Missing');

// Check copy functionality
const hasCopy = html.includes('clipboard') || html.includes('navigator.clipboard');
console.log('Copy functionality:', hasCopy ? '✅ Present' : '❌ Missing');

// Check message history for conversation memory
const hasHistory = html.includes('messageHistory');
console.log('Conversation memory:', hasHistory ? '✅ Present' : '❌ Missing');

// Check fallback engine
const hasFallback = html.includes('generateLocalAssistantReply');
console.log('Local fallback engine:', hasFallback ? '✅ Present' : '❌ Missing');

// Check mobile responsive
const hasMobile = html.includes('@media (max-width: 600px)');
console.log('Mobile responsive:', hasMobile ? '✅ Present' : '❌ Missing');

// Check Hindi/Hinglish support
const hasHindi = html.includes('Hindi') && html.includes('Hinglish');
console.log('Hindi/Hinglish support:', hasHindi ? '✅ Present' : '❌ Missing');