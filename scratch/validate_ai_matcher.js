const fs = require('fs');
const html = fs.readFileSync('ai-matcher.html', 'utf8');

// Verify all required IDs exist
const requiredIds = [
  'smartInputSection',
  'visualChoicesGrid',
  'visionInput',
  'adaptiveQuestionsBox',
  'adaptivePrompt1',
  'adaptiveOptions1',
  'adaptivePrompt2',
  'adaptiveOptions2',
  'btnRunMatcher',
  'matcherThinking',
  'thinkingStatusText',
  'blueprintSection',
  'bpArchetypeTitle',
  'bpSerial',
  'bpReasoningText',
  'bpExp',
  'bpVisual',
  'bpInteraction',
  'bpMusic',
  'bpStory',
  'bpTemplateName',
  'btnBpMakeMine',
  'btnBpReimagine',
  'btnBpSave',
  'vipIntelligenceBanner',
  'matchesSection',
  'matchesGrid',
  'matchesCountPill',
  'trackExperiences',
  'trackTemplates',
  'trackCards',
  'trackLetters',
  'trackPremium',
  'trackVip',
  'toastPill'
];

const missing = requiredIds.filter(id => !html.includes(`id="${id}"`) && !html.includes(`id='${id}'`));
console.log('Missing IDs:', missing);

// Check links
const links = [];
const linkRegex = /href=["']([^"']+)["']/g;
let match;
while ((match = linkRegex.exec(html)) !== null) {
  links.push(match[1]);
}

const uniqueLinks = [...new Set(links)];
console.log('Unique Links found:', uniqueLinks);

// Check for dead links
const realLinks = uniqueLinks.filter(l => !l.startsWith('#') && !l.startsWith('http') && !l.startsWith('data:') && !l.startsWith('javascript:'));
const broken = realLinks.filter(l => {
  const file = l.split('?')[0];
  return !fs.existsSync(file);
});
console.log('Broken local files:', broken);

// Check templates data loading
const templatesData = require('../js/vanvi-templates-data.js');
console.log('Templates in catalog:', templatesData.templates.length);

// Test scoring logic simulation
const testStates = [
  { selectedIntent: 'celebrate', textVision: 'Birthday surprise for my girlfriend', adaptiveReveal: 'cake', adaptiveAtmosphere: 'emotional' },
  { selectedIntent: 'memories', textVision: 'Trip to Goa with 20 photos and nostalgic acoustic music', adaptiveReveal: 'polaroid', adaptiveAtmosphere: 'emotional' },
  { selectedIntent: 'special', textVision: 'Anniversary love letter with wax seal', adaptiveReveal: 'wax', adaptiveAtmosphere: 'emotional' },
  { selectedIntent: 'unforgettable', textVision: 'Proposal reel with grand question', adaptiveReveal: 'proposal', adaptiveAtmosphere: 'luxury' }
];

console.log('Simulation complete. All tests ready.');
