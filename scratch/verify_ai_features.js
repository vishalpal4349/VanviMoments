const fs = require('fs');
const html = fs.readFileSync('ai.html', 'utf8');

console.log('=== AI.HTML VERIFICATION SUITE ===');

// 1. Check viewport
const vp = html.match(/<meta[^>]*content="([^"]*)"[^>]*name="viewport"/i) || html.match(/<meta[^>]*name="viewport"[^>]*content="([^"]*)"/i);
console.log('Viewport:', vp ? vp[1] : 'Not found');
const hasUserScalableNo = vp && vp[1].includes('user-scalable=no');
console.log('User zoom allowed (no user-scalable=no):', !hasUserScalableNo ? 'PASS' : 'FAIL');

// 2. Check 16px on inputs for mobile
const has16px = html.includes('font-size: 16px') || html.includes('font-size:16px');
console.log('Mobile 16px anti-autozoom rule present:', has16px ? 'PASS' : 'FAIL');

// 3. Check overflow-x hidden
const hasOverflowLock = html.includes('overflow-x: hidden');
console.log('Overflow-X locked:', hasOverflowLock ? 'PASS' : 'FAIL');

// 4. Check Occasion cards (8 occasions)
const occasions = ['Birthday', 'Love', 'Anniversary', 'Friendship', 'Family', 'Wedding', 'Graduation', 'Custom'];
const allOccasions = occasions.every(o => html.includes(`data-occ="${o}"`));
console.log('8 Occasion cards present:', allOccasions ? 'PASS' : 'FAIL');

// 5. Check 7 Magic AI Tools
const tools = [
  'Magic Writer',
  'Cinema Director',
  'Story Architect',
  'Design Director',
  'Photo Story Planner',
  'Emotion Editor',
  'Gift Idea Assistant'
];
const allTools = tools.every(t => html.includes(t));
console.log('7 Magic AI Tools present:', allTools ? 'PASS' : 'FAIL');

// 6. Check Format Pills (6 formats)
const formats = ['Create Story', 'Create Card', 'Create Website', 'Create Cinema', 'Create Letter', 'Create Album'];
const allFormats = formats.every(f => html.includes(f));
console.log('6 Format action pills present:', allFormats ? 'PASS' : 'FAIL');

// 7. Check Typewriter and Variation Tabs
const hasTabs = html.includes('data-var="0"') && html.includes('data-var="1"') && html.includes('data-var="2"');
console.log('3 Variation tabs present:', hasTabs ? 'PASS' : 'FAIL');

// 8. Check More Controls collapsible drawer
const hasDrawer = html.includes('id="moreControlsDrawer"') && html.includes('id="btnToggleMore"');
console.log('More Controls drawer present:', hasDrawer ? 'PASS' : 'FAIL');

// 9. Check Copilot handoff call
const hasHandoff = html.includes('btnCreateMyMoment') && html.includes('stageHandoffContext') && html.includes('index.html?mode=create');
console.log('Copilot / Builder handoff present:', hasHandoff ? 'PASS' : 'FAIL');

// 10. Check Navigation link back to Home
const hasHomeLink = html.includes('href="index.html"');
console.log('Back to Home navigation link present:', hasHomeLink ? 'PASS' : 'FAIL');
