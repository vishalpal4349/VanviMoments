const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ========================================================
// 1. UPDATE templates.html
// ========================================================
const templatesPath = path.join(ROOT, 'templates.html');
if (fs.existsSync(templatesPath)) {
  let content = fs.readFileSync(templatesPath, 'utf8');

  // Remove the fullscreen preview modal
  const modalRegex = /<!-- ─── AUTO FULLSCREEN LIVE PREVIEW[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
  if (modalRegex.test(content)) {
    content = content.replace(modalRegex, '<!-- Preview Modal Removed (Showcase Only) -->');
    console.log('Removed #autoFullscreenPreviewModal from templates.html');
  } else {
    // Try matching by id
    const modalById = /<div class="vanvi-fullscreen-preview-modal" id="autoFullscreenPreviewModal"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
    if (modalById.test(content)) {
      content = content.replace(modalById, '<!-- Preview Modal Removed (Showcase Only) -->');
      console.log('Removed #autoFullscreenPreviewModal by id from templates.html');
    }
  }

  // Remove onclick="openAutoFullscreenPreview(...)" and .thumb-hover-action-pill from stage thumb
  content = content.replace(/onclick="openAutoFullscreenPreview\('\$\{safeId\}'\)"/g, '');
  content = content.replace(/<div class="thumb-hover-action-pill">[\s\S]*?<\/div>/g, '');

  // Remove action buttons (Preview & Make Yours) and replace with clean luxury showcase tag
  const actionsRegex = /<!-- Action Buttons -->\s*<div class="tpl-card-actions">[\s\S]*?<\/div>/g;
  const newActions = `<!-- Showcase Status -->
              <div class="tpl-card-status">
                <span class="tpl-showcase-pill">✨ Handcrafted Moment</span>
              </div>`;
  if (actionsRegex.test(content)) {
    content = content.replace(actionsRegex, newActions);
    console.log('Replaced .tpl-card-actions with showcase tag in templates.html');
  }

  // Disable openAutoFullscreenPreview implementation
  content = content.replace(/window\.openAutoFullscreenPreview = function\(id\) \{[\s\S]*?window\.setPreviewDevice = function/g, 
    `window.openAutoFullscreenPreview = function(id) {
        // Showcase only - no popup page
        console.log('Template showcase:', id);
      };
      window.setPreviewDevice = function`);

  // Add styles for .tpl-card-status & .tpl-showcase-pill if not present
  if (!content.includes('.tpl-card-status')) {
    const styleInsert = `
    .tpl-card-status {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .tpl-showcase-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 6px 14px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 750;
      color: var(--rose-main);
      background: rgba(255, 42, 122, 0.08);
      border: 1px solid rgba(255, 120, 175, 0.25);
    }
    `;
    content = content.replace('</style>', styleInsert + '\n</style>');
  }

  fs.writeFileSync(templatesPath, content, 'utf8');
  console.log('templates.html successfully updated to showcase mode!');
}

// ========================================================
// 2. UPDATE index.html
// ========================================================
const indexPath = path.join(ROOT, 'index.html');
if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf8');

  // Replace <div class="template-actions"><button class="tbtn preview-btn" type="button">Preview</button><button class="tbtn use-btn" type="button">Make Yours →</button></div>
  const actionsRegex = /<div class="template-actions"><button class="tbtn preview-btn" type="button">Preview<\/button><button class="tbtn use-btn" type="button">Make Yours →<\/button><\/div>/g;
  const showcaseTag = `<div class="template-showcase-pill" style="display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:99px; font-size:10.5px; font-weight:750; color:#ff2a7a; background:rgba(255,42,122,0.08); border:1px solid rgba(255,120,175,0.25); margin-top:8px;">✨ Showcase</div>`;
  
  const matches = content.match(actionsRegex);
  if (matches) {
    content = content.replace(actionsRegex, showcaseTag);
    console.log(`Replaced ${matches.length} template action button bars in index.html with showcase tags`);
  }

  // Remove the click event listeners in index.html for preview-btn and use-btn navigating to template-detail.html
  content = content.replace(/document\.querySelectorAll\('\.preview-btn'\)\.forEach[\s\S]*?document\.querySelectorAll\('\.template'\)\.forEach\(card => \{[\s\S]*?\}\);/g,
    `// Template card click disabled - showcase only
  document.querySelectorAll('.template').forEach(card => {
    card.style.cursor = 'default';
  });`);

  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('index.html successfully updated to showcase mode!');
}

// ========================================================
// 3. UPDATE ALL category-*.html FILES
// ========================================================
const categoryFiles = fs.readdirSync(ROOT).filter(f => f.startsWith('category-') && f.endsWith('.html'));
categoryFiles.forEach(file => {
  const filePath = path.join(ROOT, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // In category cards:
  // <a class="btn-preview" href="templates.html?preview=${encodeURIComponent(t.id)}" title="Live Interactive Experience">👁️ Experience</a>
  // <a class="btn-create" href="builder.html?template=${encodeURIComponent(t.id)}" title="Make It Yours">✨ Make It Yours →</a>
  const oldActionButtons = /<a class="btn-preview"[\s\S]*?<\/a>\s*<a class="btn-create"[\s\S]*?<\/a>/g;
  const showcaseTag = `<span class="cat-showcase-pill" style="display:inline-flex; align-items:center; gap:4px; padding:5px 12px; border-radius:99px; font-size:11px; font-weight:750; color:#ff2a7a; background:rgba(255,42,122,0.08); border:1px solid rgba(255,120,175,0.25);">✨ Showcase</span>`;

  if (oldActionButtons.test(content)) {
    content = content.replace(oldActionButtons, showcaseTag);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated actions to showcase tag in ${file}`);
  }
});

// ========================================================
// 4. UPDATE scratch/run_playwright_qa.js
// ========================================================
const qaPath = path.join(ROOT, 'scratch', 'run_playwright_qa.js');
if (fs.existsSync(qaPath)) {
  let content = fs.readFileSync(qaPath, 'utf8');

  // Remove deleted files from test suite
  const removedPages = [
    "'template-detail.html',",
    "'templates/apology-dashboard/index.html',",
    "'templates/birthday-3d-candle-surprise/index.html',",
    "'templates/birthday-gf/index.html',",
    "'templates/birthday-white-bloom-001/index.html',",
    "'templates/birthday-wish-01/index.html',",
    "'templates/birthday-wish-02/index.html',"
  ];

  removedPages.forEach(p => {
    content = content.replace(new RegExp(`\\s*${p}`, 'g'), '');
  });

  // Update E2E journeys that were loading template-detail.html
  content = content.replace(/await page\.goto\(`\$\{BASE_URL\}\/template-detail\.html\?id=birthday-white-bloom-001`[^\)]*\);/g,
    `await page.goto(\`\${BASE_URL}/templates.html\`, { waitUntil: 'domcontentloaded' });`);

  content = content.replace(/await page\.goto\(`\$\{BASE_URL\}\/template-detail\.html\?id=birthday-wish-1`[^\)]*\);/g,
    `await page.goto(\`\${BASE_URL}/templates.html\`, { waitUntil: 'domcontentloaded' });`);

  fs.writeFileSync(qaPath, content, 'utf8');
  console.log('scratch/run_playwright_qa.js updated to reflect clean showcase architecture!');
}

console.log('ALL REMOVALS & SHOWCASE ADJUSTMENTS COMPLETE!');
