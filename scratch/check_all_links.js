const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const inventory = JSON.parse(fs.readFileSync(path.join(ROOT, 'scratch', 'inventory_data.json'), 'utf8'));

// Filter out scratch files
const activePages = inventory.filter(f => !f.isScratch);
const allActiveFiles = new Set(activePages.map(f => f.file.replace(/\\/g, '/')));

console.log('Total active files:', allActiveFiles.size);

const linkAudit = [];
const incomingLinks = {};
allActiveFiles.forEach(f => incomingLinks[f] = 0);

activePages.forEach(page => {
  const content = fs.readFileSync(path.join(ROOT, page.file), 'utf8');
  const pageDir = path.dirname(page.file);

  // Extract all hrefs
  const matches = [...content.matchAll(/href=["']([^"']+)["']/gi)];
  matches.forEach(m => {
    const rawHref = m[1].trim();
    if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('http://') || rawHref.startsWith('https://') || rawHref.startsWith('data:')) {
      return;
    }
    
    // Clean query and hash
    const cleanHref = rawHref.split('?')[0].split('#')[0];
    if (!cleanHref) return;

    // Resolve relative to page
    let resolved = path.normalize(path.join(pageDir, cleanHref)).replace(/\\/g, '/');
    if (cleanHref.startsWith('/')) {
      resolved = cleanHref.slice(1);
    }

    const exists = fs.existsSync(path.join(ROOT, resolved));
    linkAudit.push({
      from: page.file,
      raw: rawHref,
      resolved: resolved,
      exists: exists
    });

    if (exists && incomingLinks[resolved] !== undefined) {
      incomingLinks[resolved]++;
    }
  });
});

const deadLinks = linkAudit.filter(l => !l.exists);
console.log('Total links analyzed:', linkAudit.length);
console.log('Dead internal links detected:', deadLinks.length);
deadLinks.slice(0, 30).forEach(dl => {
  console.log(`  Dead link in [${dl.from}] -> [${dl.raw}] (resolved: ${dl.resolved})`);
});

console.log('\n--- ORPHAN PAGES (0 incoming links from other active pages) ---');
Object.keys(incomingLinks).forEach(file => {
  if (incomingLinks[file] === 0 && file !== 'index.html') {
    console.log('  Orphan:', file);
  }
});

fs.writeFileSync(path.join(ROOT, 'scratch', 'dead_links.json'), JSON.stringify(deadLinks, null, 2));
