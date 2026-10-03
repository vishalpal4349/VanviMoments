const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = fs.readdirSync(root).filter(f => f.endsWith('.html'));

console.log('=== CHECKING BROKEN ASSETS & JAVASCRIPT SYNTAX IN ALL HTML FILES ===\n');

let brokenAssets = [];
let scriptErrors = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(root, f), 'utf8');

  // Check script srcs
  const scriptSrcs = [...content.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
  const linkHrefs = [...content.matchAll(/<link[^>]+href=["']([^"']+)["']/gi)].map(m => m[1]);

  [...scriptSrcs, ...linkHrefs].forEach(a => {
    if (!a.startsWith('http') && !a.startsWith('data:') && !a.startsWith('//') && !a.startsWith('#')) {
      const clean = a.split('?')[0].split('#')[0];
      const target = path.join(root, clean);
      if (!fs.existsSync(target)) {
        brokenAssets.push({ file: f, asset: a });
      }
    }
  });

  // Check inline script syntax
  const inlineScripts = [...content.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)];
  inlineScripts.forEach((s, idx) => {
    try {
      new Function(s[1]);
    } catch (e) {
      scriptErrors.push({ file: f, scriptIdx: idx, error: e.message });
    }
  });
});

console.log(`Broken Assets: ${brokenAssets.length}`);
if (brokenAssets.length > 0) {
  brokenAssets.forEach(b => console.log(`  ❌ [${b.file}] Asset not found: ${b.asset}`));
} else {
  console.log('  ✅ All asset files (CSS/JS) exist locally!');
}

console.log(`\nInline Script Syntax Errors: ${scriptErrors.length}`);
if (scriptErrors.length > 0) {
  scriptErrors.forEach(s => console.log(`  ❌ [${s.file}] Script #${s.scriptIdx}: ${s.error}`));
} else {
  console.log('  ✅ All inline scripts have valid JS syntax!');
}
