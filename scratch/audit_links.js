const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

console.log('=== VANVI MOMENTS COMPLETE LINK AUDIT ===\n');
console.log(`Found ${htmlFiles.length} HTML files to inspect:\n`, htmlFiles.join(', '), '\n');

const linkRegex = /href=["']([^"'#][^"']*)["']|location\.href\s*=\s*["']([^"'#][^"']*)["']|window\.open\(["']([^"'#][^"']*)["']/g;

const allDiscoveredTargets = new Set();
const fileLinkMap = {};

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  let match;
  const links = new Set();

  while ((match = linkRegex.exec(content)) !== null) {
    const raw = match[1] || match[2] || match[3];
    if (raw && !raw.startsWith('http') && !raw.startsWith('//') && !raw.startsWith('mailto:') && !raw.startsWith('tel:') && !raw.startsWith('javascript:')) {
      const cleanTarget = raw.split('?')[0].split('#')[0];
      if (cleanTarget.endsWith('.html') || cleanTarget.endsWith('.js') || cleanTarget.endsWith('.css')) {
        links.add(cleanTarget);
        allDiscoveredTargets.add(cleanTarget);
      }
    }
  }
  fileLinkMap[file] = Array.from(links);
});

console.log('1. Broken Target Links Audit:');
let hasBroken = false;
for (const [file, links] of Object.entries(fileLinkMap)) {
  for (const target of links) {
    const targetPath = path.join(rootDir, target);
    if (!fs.existsSync(targetPath)) {
      console.warn(`  ⚠️ In ${file}: link targets non-existent file -> "${target}"`);
      hasBroken = true;
    }
  }
}
if (!hasBroken) {
  console.log('  ✅ No broken internal links detected!');
}

console.log('\n2. Discovered Existing HTML Pages:');
htmlFiles.forEach(f => {
  console.log(`  - ${f}`);
});

console.log('\n3. Cross-Linking Verification:');
// Check which pages are linked from index.html
const indexLinks = fileLinkMap['index.html'] || [];
console.log('index.html links to:', indexLinks);

// Check if each page has navigation back to Home, Templates, Studio, Dashboard
htmlFiles.forEach(file => {
  const links = fileLinkMap[file] || [];
  const hasHome = links.includes('index.html');
  console.log(`- ${file}: links to ${links.length} pages. Home link: ${hasHome ? '✅' : '❌'}`);
});

