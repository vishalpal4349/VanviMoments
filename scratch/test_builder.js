const fs = require('fs');
const html = fs.readFileSync('builder.html', 'utf8');

console.log('File size:', html.length);
if (!html.includes('applyQuickWish')) throw new Error('Missing applyQuickWish');
if (!html.includes('btnQuickPreviewFloat')) throw new Error('Missing btnQuickPreviewFloat');
if (!html.includes('audio-wave-bars')) throw new Error('Missing audio-wave-bars');
if (!html.includes('phone-chassis')) throw new Error('Missing phone-chassis');
if (!html.includes('dynamic-island-pill')) throw new Error('Missing dynamic-island-pill');

const scriptMatch = html.match(/<script id="vanvi-builder-engine">([\s\S]*?)<\/script>/);
if (!scriptMatch) throw new Error('vanvi-builder-engine script not found');
try {
  new Function(scriptMatch[1]);
  console.log('Script syntax: VALID and OK!');
} catch (e) {
  console.error('Script syntax error:', e);
  process.exit(1);
}
console.log('ALL BUILDER CHECKS PASSED!');
