/**
 * VANVI MOMENTS — GLOBAL PREMIUM WEB EXPERIENCE AUTOMATIC QC SUITE
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting Global Premium Web Experience QC Verification...\n');

let passed = 0;
let total = 0;

function check(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
  }
}

const rootDir = path.resolve(__dirname, '..');

// 1. Files exist
check('css/vanvi-global-experience.css exists and has content', () => {
  const filePath = path.join(rootDir, 'css', 'vanvi-global-experience.css');
  assert.ok(fs.existsSync(filePath), 'File missing');
  const content = fs.readFileSync(filePath, 'utf8');
  assert.ok(content.length > 500, 'File is too small');
});

check('js/vanvi-global-experience.js exists and has content', () => {
  const filePath = path.join(rootDir, 'js', 'vanvi-global-experience.js');
  assert.ok(fs.existsSync(filePath), 'File missing');
  const content = fs.readFileSync(filePath, 'utf8');
  assert.ok(content.includes('--vanvi-vh'), 'Missing --vanvi-vh calculation');
  assert.ok(content.includes('VanviGlobalExperience'), 'Missing export API');
});

// 2. Safe-area insets & overflow-x protection
check('vanvi-global-experience.css defines safe-area insets and overflow guard', () => {
  const css = fs.readFileSync(path.join(rootDir, 'css', 'vanvi-global-experience.css'), 'utf8');
  assert.ok(css.includes('env(safe-area-inset-bottom'), 'Missing safe-area-inset-bottom');
  assert.ok(css.includes('overflow-x: hidden !important'), 'Missing overflow-x: hidden !important');
  assert.ok(css.includes('prefers-reduced-motion'), 'Missing prefers-reduced-motion');
});

// 3. Mobile viewport widths check
check('vanvi-global-experience.css supports 320px, 360px-414px, and 768px+ viewports', () => {
  const css = fs.readFileSync(path.join(rootDir, 'css', 'vanvi-global-experience.css'), 'utf8');
  assert.ok(css.includes('359px') || css.includes('320px'), 'Missing compact 320px breakpoint');
  assert.ok(css.includes('360px') && css.includes('479px'), 'Missing standard mobile 360px-414px breakpoint');
  assert.ok(css.includes('768px'), 'Missing tablet/desktop breakpoint');
});

// 4. Imported into vanvi-navigation.css & vanvi-custom-builder.css
check('vanvi-navigation.css imports vanvi-global-experience.css', () => {
  const css = fs.readFileSync(path.join(rootDir, 'vanvi-navigation.css'), 'utf8');
  assert.ok(css.includes("import url('css/vanvi-global-experience.css')") || css.includes('vanvi-global-experience.css'), 'Missing import');
});

check('vanvi-custom-builder.css imports vanvi-global-experience.css', () => {
  const css = fs.readFileSync(path.join(rootDir, 'css', 'vanvi-custom-builder.css'), 'utf8');
  assert.ok(css.includes('vanvi-global-experience.css'), 'Missing import in vanvi-custom-builder.css');
});

// 5. Template adapter auto-injection
check('template-adapter.js auto-injects vanvi-global-experience.css across all templates', () => {
  const js = fs.readFileSync(path.join(rootDir, 'js', 'template-adapter.js'), 'utf8');
  assert.ok(js.includes('vanvi-global-experience.css'), 'template-adapter.js does not inject global experience CSS');
});

// 6. Linked in core pages (excluding locked index.html per user protection rule)
const corePages = ['templates.html', 'preview.html', 'checkout.html', 'builder.html', 'experience.html', 'share.html', 'profile.html', 'dashboard.html', 'refer.html'];
corePages.forEach(page => {
  check(`${page} links vanvi-global-experience.css and runtime`, () => {
    const html = fs.readFileSync(path.join(rootDir, page), 'utf8');
    assert.ok(html.includes('vanvi-global-experience.css'), `${page} missing vanvi-global-experience.css`);
    assert.ok(html.includes('vanvi-global-experience.js'), `${page} missing vanvi-global-experience.js`);
  });
});

// 7. No URL faking / manipulation check
check('No unauthorized address-bar manipulation or pushState masking scripts', () => {
  const js = fs.readFileSync(path.join(rootDir, 'js', 'vanvi-global-experience.js'), 'utf8');
  assert.ok(!js.includes('replaceState') && !js.includes('pushState'), 'Unauthorized history state manipulation detected');
});

// 8. Templates integrity check
check('All 9 templates have intact index.html', () => {
  const templatesDir = path.join(rootDir, 'templates');
  const dirs = fs.readdirSync(templatesDir).filter(f => fs.statSync(path.join(templatesDir, f)).isDirectory());
  assert.strictEqual(dirs.length, 9, `Expected 9 templates, found ${dirs.length}`);
  dirs.forEach(t => {
    const indexFile = path.join(templatesDir, t, 'index.html');
    assert.ok(fs.existsSync(indexFile), `Missing index.html in template ${t}`);
  });
});

console.log(`\n========================================`);
console.log(`Global Experience Results: ${passed} / ${total} passed`);
console.log(`========================================\n`);

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
