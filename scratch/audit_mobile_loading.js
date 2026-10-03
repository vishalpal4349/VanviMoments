const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = fs.readdirSync(root).filter(f => f.endsWith('.html')).sort();

console.log('=== AUDITING MOBILE DISPLAY & BUTTON BEHAVIOR ON ALL 52 PAGES ===\n');

const issuesFound = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  const fileIssues = [];

  // 1. Check for overlays that might default to active/open and block touch/interaction
  if (content.includes('modal-overlay active') || content.includes('modal-overlay show') || content.includes('active-overlay')) {
    fileIssues.push('Found potentially pre-active modal overlay blocking mobile interaction');
  }

  // 2. Check for missing mobile viewport
  if (!content.includes('viewport')) {
    fileIssues.push('Missing viewport meta');
  }

  // 3. Check for fixed full-screen containers that might trap mobile scroll
  if (content.includes('position: fixed; inset: 0;') && !content.includes('pointer-events: none') && !file.includes('404')) {
    const fixedMatches = [...content.matchAll(/position:\s*fixed;\s*inset:\s*0;[^}]*/gi)];
    fixedMatches.forEach(m => {
      if (!m[0].includes('pointer-events: none') && !m[0].includes('z-index: -') && !m[0].includes('display: none') && !m[0].includes('opacity: 0')) {
        fileIssues.push('Has fixed inset:0 container that might block touches: ' + m[0].slice(0, 60));
      }
    });
  }

  // 4. Check for broken or undefined scripts
  if (content.includes('undefined') && content.includes('<script')) {
    // check if it's literally assigning or calling undefined
    const badUndef = content.match(/<script[^>]*>[\s\S]*?(?:src|href|location)\s*=\s*undefined[\s\S]*?<\/script>/gi);
    if (badUndef) fileIssues.push('Has script assigning to undefined');
  }

  // 5. Check brand logo tag and clickable status
  const hasBrand = content.includes('brand') || content.includes('logo');
  const isLogoLink = /<a[^>]+(?:class|id)=["'][^"']*(?:brand|logo)[^"']*["'][^>]*href=/i.test(content) || /<a[^>]*href=["'][^"']+["'][^>]*>(?:[\s\S]*?)(?:VANVI|brand|logo)/i.test(content);
  
  if (fileIssues.length > 0) {
    issuesFound.push({ file, issues: fileIssues });
  }
});

console.log(`Found ${issuesFound.length} files with potential mobile issues:`);
issuesFound.forEach(item => {
  console.log(`\n❌ [${item.file}]:`);
  item.issues.forEach(iss => console.log(`   - ${iss}`));
});

if (issuesFound.length === 0) {
  console.log('✅ No hard mobile blocking containers found!');
}
