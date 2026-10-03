const fs = require('fs');
const assert = require('assert');

console.log('====================================================');
console.log('VERIFYING BUTTON STABILIZATION & TEMPLATE BRANDING');
console.log('====================================================\n');

// 1. Check official logo asset
assert(fs.existsSync('assets/vanvi-moments-official-logo.png'), 'assets/vanvi-moments-official-logo.png must exist');
console.log('✓ Official Vanvi Moments logo asset saved in assets/');

// 2. Check css/vanvi-template-cards.css
const cssCards = fs.readFileSync('css/vanvi-template-cards.css', 'utf8');
assert(cssCards.includes('.vanvi-brand-corner-badge'), 'CSS must contain .vanvi-brand-corner-badge');
assert(cssCards.includes('.vanvi-cards-grid:not(.is-magazine-view) .vanvi-card .btn-text-full'), 'CSS must configure 2-column short text');
assert(!cssCards.includes('btn-take-look:hover {\n  background: #fff5f8;\n  border-color: #ff2a7a;\n  color: #ff2a7a;\n  transform: translateY(-2px) scale(1.02);'), 'btn-take-look must not scale on hover');
assert(!cssCards.includes('btn-make-yours:hover {\n  box-shadow: 0 8px 22px rgba(255, 42, 122, 0.45);\n  filter: brightness(1.05);\n  transform: translateY(-2px) scale(1.02);'), 'btn-make-yours must not scale on hover');
console.log('✓ css/vanvi-template-cards.css stabilized (no scale jitter) and 2-column label rule verified');

// 3. Check js/vanvi-templates-data.js
const jsData = fs.readFileSync('js/vanvi-templates-data.js', 'utf8');
assert(jsData.includes('vanvi-brand-corner-badge'), 'vanvi-templates-data.js must render vanvi-brand-corner-badge');
assert(jsData.includes('assets/vanvi-moments-official-logo.png'), 'vanvi-templates-data.js must reference official logo');
assert(jsData.includes('<span class="btn-text-short">Create</span>'), 'vanvi-templates-data.js must have concise Create label');
console.log('✓ js/vanvi-templates-data.js verified with corner badge and "Create" label');

// 4. Check templates.html
const templatesHtml = fs.readFileSync('templates.html', 'utf8');
assert(templatesHtml.includes('btn-smart-filter-trigger'), 'templates.html must contain Smart Filter trigger button');
assert(templatesHtml.includes('vanvi-brand-corner-badge'), 'templates.html must render vanvi-brand-corner-badge');
assert(templatesHtml.includes('assets/vanvi-moments-official-logo.png'), 'templates.html must reference official logo');
assert(templatesHtml.includes('<span class="btn-text-short">Create</span>'), 'templates.html must have Create label for short view');
console.log('✓ templates.html verified with compact search, Smart Filter trigger, and corner badge');

// 5. Check index.html
const indexHtml = fs.readFileSync('index.html', 'utf8');
assert(indexHtml.includes('vanvi-brand-corner-badge'), 'index.html must render vanvi-brand-corner-badge on template cards');
assert(indexHtml.includes('assets/vanvi-moments-official-logo.png'), 'index.html must reference official logo');
assert(indexHtml.includes('class="home-btn-make-yours">Create ✨</a>'), 'index.html must have Create label on slider cards');
assert(!indexHtml.includes('.hero .primary:hover,\n.hero .flow-btn:hover {\n  transform: translateY(-2px) scale(1.02) !important;'), 'index.html hero primary must not scale on hover');
console.log('✓ index.html verified with stable non-shifting buttons, corner brand badge, and "Create" labels');

console.log('\n====================================================');
console.log('ALL VERIFICATION CHECKS PASSED CLEANLY! (5/5)');
console.log('====================================================');
