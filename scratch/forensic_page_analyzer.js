const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function getHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.gemini') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const allHtmlPaths = getHtmlFiles(ROOT);

// Categorize files
const inventory = [];

allHtmlPaths.forEach(fullPath => {
  const relPath = path.relative(ROOT, fullPath).replace(/\\/g, '/');
  const isScratch = relPath.startsWith('scratch/');
  const isTemplateDir = relPath.startsWith('templates/');
  const isRoot = !relPath.includes('/');

  const content = fs.readFileSync(fullPath, 'utf8');

  // Title
  const titleMatch = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim() : path.basename(relPath);

  // Buttons & Links extraction
  const linkMatches = [...content.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const buttonMatches = [...content.matchAll(/<button\s+[^>]*>([\s\S]*?)<\/button>/gi)];
  const formMatches = [...content.matchAll(/<form\s+[^>]*action=["']?([^"'>\s]*)["']?[^>]*>/gi)];
  const modalMatches = [...content.matchAll(/class=["'][^"']*(?:modal|dialog|overlay|popup)[^"']*["']/gi)];
  const apiMatches = [...content.matchAll(/fetch\s*\(\s*['"`]([^'"`]+)['"`]/gi)];
  const storageMatches = [...content.matchAll(/localStorage\.(?:getItem|setItem)\s*\(\s*['"`]([^'"`]+)['"`]/gi)];

  // Auth requirement indicator
  const hasAuthGuard = content.includes('vanvi_auth_token') || content.includes('requireAuth') || content.includes('checkAuth');
  // Payment indicator
  const hasPayment = content.includes('razorpay') || content.includes('create-order') || content.includes('Razorpay');

  // Mobile viewport
  const hasViewport = content.includes('name="viewport"');

  // Distinct links
  const outgoingLinks = new Set();
  linkMatches.forEach(m => {
    let href = m[1].trim();
    if (!href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('http')) {
      href = href.split('?')[0].split('#')[0];
      if (href) outgoingLinks.add(href);
    }
  });

  inventory.push({
    file: relPath,
    title,
    isScratch,
    isTemplateDir,
    isRoot,
    btnCount: buttonMatches.length,
    linkCount: linkMatches.length,
    formCount: formMatches.length,
    modalCount: modalMatches.length,
    outgoingLinks: Array.from(outgoingLinks),
    apis: Array.from(new Set(apiMatches.map(m => m[1]))),
    storageKeys: Array.from(new Set(storageMatches.map(m => m[1]))),
    hasAuthGuard,
    hasPayment,
    hasViewport,
    bytes: content.length,
    lines: content.split('\n').length
  });
});

console.log('=== SUMMARY OF DISCOVERED HTML FILES ===');
console.log('Total HTML Files:', inventory.length);
console.log('Root HTML Files:', inventory.filter(f => f.isRoot).length);
console.log('Templates HTML Files:', inventory.filter(f => f.isTemplateDir).length);
console.log('Scratch / Archive Files:', inventory.filter(f => f.isScratch).length);

fs.writeFileSync(path.join(ROOT, 'scratch', 'inventory_data.json'), JSON.stringify(inventory, null, 2));
console.log('Wrote inventory_data.json');
