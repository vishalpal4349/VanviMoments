const fs = require('fs');
const path = require('path');

console.log('=== GLOBAL COMPREHENSIVE AUDIT OF ALL 49 HTML PAGES ===\n');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const issues = {};

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const fileIssues = [];

  // 1. Check for Ananya
  if (content.toLowerCase().includes('ananya')) {
    fileIssues.push('Contains "Ananya" branding');
  }

  // 2. Check script syntax
  const scripts = content.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi) || [];
  scripts.forEach((s, idx) => {
    // Skip external script src
    if (s.includes('src=')) return;
    const code = s.replace(/<script[\s\S]*?>/i, '').replace(/<\/script>/i, '');
    try {
      new Function(code);
    } catch (e) {
      fileIssues.push(`Script #${idx + 1} syntax error: ${e.message}`);
    }
  });

  // 3. Duplicate IDs in HTML markup
  const htmlWithoutScripts = content.replace(/<script[\s\S]*?<\/script>/gi, '');
  const idMatches = [...htmlWithoutScripts.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
  const counts = {};
  idMatches.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
  const dupes = Object.entries(counts).filter(([k, v]) => v > 1).map(x => x[0]);
  if (dupes.length > 0) {
    fileIssues.push(`Duplicate IDs: ${dupes.join(', ')}`);
  }

  // 4. Overflow lock
  if (!content.includes('overflow-x: hidden') && !content.includes('vanvi-inner-light.css') && !content.includes('vanvi-navigation.css')) {
    fileIssues.push('Missing overflow-x: hidden');
  }

  // 5. Check if safeGoBack or vanviGoBack is called but not defined
  const callsVanviGoBack = content.includes('vanviGoBack(');
  const definesVanviGoBack = content.includes('function vanviGoBack') || 
                             content.includes('vanvi-navigation.js') || 
                             content.includes('vanvi-api.js');
  if (callsVanviGoBack && !definesVanviGoBack) {
    fileIssues.push('Calls vanviGoBack() but neither function nor navigation script is loaded');
  }

  const callsSafeGoBack = content.includes('safeGoBack(');
  const definesSafeGoBack = content.includes('function safeGoBack') || 
                            content.includes('vanvi-navigation.js') || 
                            content.includes('vanvi-api.js');
  if (callsSafeGoBack && !definesSafeGoBack) {
    fileIssues.push('Calls safeGoBack() but neither function nor navigation script is loaded');
  }

  // 6. Navigation stylesheet check for app pages
  const coreAppPages = [
    'templates.html', 'template-detail.html', 'builder.html', 'ai.html', 
    'ai-matcher.html', 'dashboard.html', 'rewards.html', 'plans.html', 
    'profile.html', 'checkout.html', 'refer.html', 'products.html', 'games.html'
  ];
  if (coreAppPages.includes(file)) {
    if (!content.includes('vanvi-navigation.css')) {
      fileIssues.push('Missing vanvi-navigation.css');
    }
  }

  if (fileIssues.length > 0) {
    issues[file] = fileIssues;
  }
});

console.log(`Audited ${files.length} HTML files.`);
const issueCount = Object.keys(issues).length;
if (issueCount === 0) {
  console.log('🎉 ALL 49 PAGES HAVE ZERO CRITICAL ISSUES!');
} else {
  console.log(`⚠️ Found issues in ${issueCount} pages:\n`);
  for (const [file, errs] of Object.entries(issues)) {
    console.log(`📄 ${file}:`);
    errs.forEach(e => console.log(`   - ${e}`));
  }
}
