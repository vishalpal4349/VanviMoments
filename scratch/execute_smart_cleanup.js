const fs = require('fs');
const path = require('path');

let totalAiRefsUpdated = 0;
let totalExpRefsUpdated = 0;
const modifiedFiles = [];

// 1. Update HTML files in root
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  if (file === 'ai.html' || file === 'experience.html') return; // will be deleted

  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Repoint ai.html -> ai-matcher.html
  if (content.includes('ai.html')) {
    const aiCount = (content.match(/ai\.html/g) || []).length;
    // Replace href="ai.html..." with href="ai-matcher.html..."
    content = content.replace(/href=["']ai\.html([^"']*)["']/g, 'href="ai-matcher.html$1"');
    // Replace 'ai.html' in onclick or vanviGoBack
    content = content.replace(/['"]ai\.html['"]/g, "'ai-matcher.html'");
    // Replace remaining references if any
    content = content.replace(/ai\.html/g, 'ai-matcher.html');
    totalAiRefsUpdated += aiCount;
    changed = true;
  }

  // Check if any legacy experience.html references (excluding custom-experience.html)
  // Match experience.html not preceded by custom-
  const expMatch = content.match(/(?<!custom-)experience\.html/g);
  if (expMatch) {
    const expCount = expMatch.length;
    content = content.replace(/(?<!custom-)experience\.html/g, 'moment.html');
    totalExpRefsUpdated += expCount;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedFiles.push(file);
  }
});

// 2. Update Template Builders
const templatesDir = 'templates';
if (fs.existsSync(templatesDir)) {
  const dirs = fs.readdirSync(templatesDir);
  dirs.forEach(d => {
    const builderPath = path.join(templatesDir, d, 'builder.html');
    if (fs.existsSync(builderPath)) {
      let content = fs.readFileSync(builderPath, 'utf8');
      let changed = false;

      if (content.includes('experience.html')) {
        const count = (content.match(/(?<!custom-)experience\.html/g) || []).length;
        content = content.replace(
          /const shareUrl = saved\.experienceUrl \|\| `\$\{window\.location\.origin\}\/experience\.html\?id=\$\{saved\.id\}&template=\$\{TEMPLATE_ID\}`;/g,
          'const shareUrl = saved.shareUrl || saved.experienceUrl || `${window.location.origin}/moment.html?id=${saved.id}&template=${TEMPLATE_ID}`;'
        );
        // Any remaining experience.html
        content = content.replace(/(?<!custom-)experience\.html/g, 'moment.html');
        totalExpRefsUpdated += count;
        changed = true;
      }

      if (content.includes('ai.html')) {
        const count = (content.match(/ai\.html/g) || []).length;
        content = content.replace(/ai\.html/g, 'ai-matcher.html');
        totalAiRefsUpdated += count;
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(builderPath, content, 'utf8');
        modifiedFiles.push(builderPath);
      }
    }
  });
}

// 3. Update js/vanvi-builder-core.js
const builderCorePath = 'js/vanvi-builder-core.js';
if (fs.existsSync(builderCorePath)) {
  let content = fs.readFileSync(builderCorePath, 'utf8');
  if (content.includes('experience.html')) {
    content = content.replace(
      /const experienceUrl = `\$\{origin\}\/experience\.html\?id=\$\{encodeURIComponent\(savedMoment\.id\)\}&template=\$\{encodeURIComponent\(this\.templateId\)\}`;/,
      'const momentUrl = savedMoment.slug ? `${origin}/m/${encodeURIComponent(savedMoment.slug)}` : `${origin}/moment.html?id=${encodeURIComponent(savedMoment.id)}&template=${encodeURIComponent(this.templateId)}`;\n        const experienceUrl = momentUrl;'
    );
    totalExpRefsUpdated++;
    fs.writeFileSync(builderCorePath, content, 'utf8');
    modifiedFiles.push(builderCorePath);
  }
}

// 4. Update js/vanvi-navigation.js
const navPath = 'js/vanvi-navigation.js';
if (fs.existsSync(navPath)) {
  let content = fs.readFileSync(navPath, 'utf8');
  let changed = false;

  if (content.includes('currentFile === \'ai.html\' ||')) {
    content = content.replace(/currentFile === 'ai\.html' \|\|\s*/g, '');
    totalAiRefsUpdated++;
    changed = true;
  }
  if (content.includes("return rootPrefix + 'ai.html';")) {
    content = content.replace("return rootPrefix + 'ai.html';", "return rootPrefix + 'templates.html';");
    totalAiRefsUpdated++;
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(navPath, content, 'utf8');
    modifiedFiles.push(navPath);
  }
}

// 5. Update server/services/ai.service.js
const aiServicePath = 'server/services/ai.service.js';
if (fs.existsSync(aiServicePath)) {
  let content = fs.readFileSync(aiServicePath, 'utf8');
  let changed = false;
  if (content.includes('"ai.html"')) {
    const count = (content.match(/"ai\.html"/g) || []).length;
    content = content.replace(/"ai\.html"/g, '"ai-matcher.html"');
    content = content.replace(/Vanvi Creative Studio/g, 'Vanvi AI Matcher');
    content = content.replace(/Open Vanvi AI Studio/g, 'Open Vanvi AI Matcher');
    totalAiRefsUpdated += count;
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(aiServicePath, content, 'utf8');
    modifiedFiles.push(aiServicePath);
  }
}

// 6. Update sitemap.xml
const sitemapPath = 'sitemap.xml';
if (fs.existsSync(sitemapPath)) {
  let content = fs.readFileSync(sitemapPath, 'utf8');
  let changed = false;
  if (content.includes('<loc>https://vanvimoments.shop/ai.html</loc>')) {
    content = content.replace(
      '<loc>https://vanvimoments.shop/ai.html</loc>',
      '<loc>https://vanvimoments.shop/ai-matcher.html</loc>'
    );
    totalAiRefsUpdated++;
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(sitemapPath, content, 'utf8');
    modifiedFiles.push(sitemapPath);
  }
}

// 7. Update server/server.js to add legacy 301 redirects
const serverPath = 'server/server.js';
if (fs.existsSync(serverPath)) {
  let content = fs.readFileSync(serverPath, 'utf8');
  if (!content.includes('/experience.html')) {
    const redirectBlock = `// Legacy 301 Redirects for Decommissioned Pages (experience.html & ai.html)
app.get(['/experience.html', '/experience'], (req, res) => {
  const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  return res.redirect(301, \`/moment.html\${query}\`);
});
app.get(['/ai.html', '/ai'], (req, res) => {
  const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  return res.redirect(301, \`/ai-matcher.html\${query}\`);
});

`;
    // Insert before app.use(express.static(ROOT_DIR
    content = content.replace('// Serve static uploads & frontend files from project root', redirectBlock + '// Serve static uploads & frontend files from project root');
    fs.writeFileSync(serverPath, content, 'utf8');
    modifiedFiles.push(serverPath);
  }
}

// 8. Safely remove ai.html and experience.html
let removedFiles = [];
if (fs.existsSync('ai.html')) {
  fs.unlinkSync('ai.html');
  removedFiles.push('ai.html');
}
if (fs.existsSync('experience.html')) {
  fs.unlinkSync('experience.html');
  removedFiles.push('experience.html');
}

console.log('=== SMART CLEANUP SUMMARY ===');
console.log(`Removed files (${removedFiles.length}):`, removedFiles);
console.log(`Total ai.html references updated: ${totalAiRefsUpdated}`);
console.log(`Total experience.html references updated: ${totalExpRefsUpdated}`);
console.log(`Modified files count: ${modifiedFiles.length}`);
console.log('Modified files list:', modifiedFiles);
