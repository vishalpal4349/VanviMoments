const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ========================================================
// 1. UPDATE templates.html
// ========================================================
const tplPath = path.join(ROOT, 'templates.html');
if (fs.existsSync(tplPath)) {
  let content = fs.readFileSync(tplPath, 'utf8');

  // Add the CSS for Explore Moment & Make It Yours buttons
  const customStyles = `
    /* Signature Vanvi Action Buttons: Explore Moment & Make It Yours */
    .tpl-floating-explore-pill {
      position: absolute;
      bottom: 12px;
      right: 12px;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1.2px solid rgba(255, 120, 175, 0.4);
      color: #2c1224;
      padding: 6px 14px;
      border-radius: 99px;
      font-size: 11.5px;
      font-weight: 800;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      box-shadow: 0 4px 14px rgba(44, 18, 36, 0.12);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 6;
      cursor: pointer;
    }
    .tpl-floating-explore-pill:hover {
      transform: translateY(-2px);
      background: #ffffff;
      border-color: #ff2a7a;
      box-shadow: 0 6px 18px rgba(255, 42, 122, 0.25);
    }
    .tpl-floating-explore-pill .pill-sparkle {
      color: #ff2a7a;
      font-size: 11px;
    }

    .tpl-card-action-bar {
      margin-top: 14px;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .btn-card-explore {
      flex: 1;
      background: rgba(255, 255, 255, 0.88);
      border: 1.2px solid rgba(255, 120, 175, 0.35);
      color: #2c1224;
      text-decoration: none;
      font-size: 12px;
      font-weight: 750;
      padding: 9px 8px;
      border-radius: 99px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
      white-space: nowrap;
    }
    .btn-card-explore:hover {
      transform: translateY(-2px);
      background: #ffffff;
      border-color: #ff2a7a;
      color: #ff2a7a;
      box-shadow: 0 6px 16px rgba(255, 42, 122, 0.18);
    }
    .btn-card-explore .btn-sparkle {
      color: #ff2a7a;
    }

    .btn-card-make-yours {
      flex: 1;
      background: linear-gradient(135deg, #ff2a7a 0%, #d97706 100%);
      color: #ffffff;
      text-decoration: none;
      font-size: 12px;
      font-weight: 800;
      padding: 9px 12px;
      border-radius: 99px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      box-shadow: 0 4px 14px rgba(255, 42, 122, 0.28);
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
      white-space: nowrap;
    }
    .btn-card-make-yours:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 22px rgba(255, 42, 122, 0.4);
    }
    
    /* Subtle luxury shine sweep on hover */
    .btn-card-make-yours::after, .btn-card-explore::after, .tpl-floating-explore-pill::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      transform: skewX(-20deg);
      transition: 0.5s ease;
    }
    .btn-card-make-yours:hover::after, .btn-card-explore:hover::after, .tpl-floating-explore-pill:hover::after {
      left: 140%;
    }
  `;

  if (!content.includes('.btn-card-explore')) {
    content = content.replace('</style>', customStyles + '\n</style>');
  }

  // Update renderTemplateCard in templates.html
  // Add floating pill inside .tpl-stage-thumb and action bar in card body
  const oldStageThumb = /<div class="tpl-stage-thumb [\s\S]*?<\/div>\s*<\/div>\s*<!-- Card Content Body -->/;
  const newStageThumb = `<div class="tpl-stage-thumb \${bgClass}" onclick="window.location.href='preview.html?template=' + encodeURIComponent(t.id)" style="cursor:pointer;" title="Explore \${escapeHtml(t.name)}">
              <span class="thumb-badge-sku">\${sku}</span>
              <span class="thumb-badge-tier \${tier.badgeClass}">\${tier.badgeText}</span>
              <img class="tpl-thumb-img" src="\${thumbUrl}" alt="\${escapeHtml(t.name)}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80';">
              <div class="thumb-center-illustration" style="display:none;">
                \${centerVisual}
              </div>
              <div class="thumb-overlay-gradient"></div>
              <a href="preview.html?template=\${encodeURIComponent(t.id)}" class="tpl-floating-explore-pill" onclick="event.stopPropagation();" title="Live Preview">
                <span class="pill-sparkle">✦</span> Explore Moment
              </a>
            </div>

            <!-- Card Content Body -->`;

  if (oldStageThumb.test(content)) {
    content = content.replace(oldStageThumb, newStageThumb);
    console.log('Updated stage thumb with floating explore pill');
  }

  // Replace tpl-card-status with tpl-card-action-bar
  const oldCardStatus = /<!-- Showcase Status -->[\s\S]*?<\/div>/;
  const newActionBar = `<!-- Card Action Bar -->
              <div class="tpl-card-action-bar">
                <a href="preview.html?template=\${encodeURIComponent(t.id)}" class="btn-card-explore" title="Live Interactive Preview">
                  <span class="btn-sparkle">✦</span> Explore Moment
                </a>
                <a href="builder.html?template=\${encodeURIComponent(t.id)}&occasion=\${encodeURIComponent(t.category || 'Birthday')}" class="btn-card-make-yours" title="Personalize This Template">
                  <span>Make It Yours</span> <span class="btn-sparkle">✨</span>
                </a>
              </div>`;

  if (oldCardStatus.test(content)) {
    content = content.replace(oldCardStatus, newActionBar);
    console.log('Replaced showcase status with action bar (Explore Moment + Make It Yours)');
  }

  fs.writeFileSync(tplPath, content, 'utf8');
  console.log('templates.html successfully updated with Explore Moment & Make It Yours buttons!');
}

// ========================================================
// 2. UPDATE index.html
// ========================================================
const indexPath = path.join(ROOT, 'index.html');
if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf8');

  // Add styles in index.html for home template action buttons
  const homeStyles = `
    .home-tpl-action-row {
      margin-top: 10px;
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .home-btn-explore {
      flex: 1;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 120, 175, 0.35);
      color: #2c1224;
      text-decoration: none;
      font-size: 11px;
      font-weight: 750;
      padding: 6px 8px;
      border-radius: 99px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.02);
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .home-btn-explore:hover {
      transform: translateY(-1px);
      background: #ffffff;
      border-color: #ff2a7a;
      color: #ff2a7a;
      box-shadow: 0 4px 12px rgba(255, 42, 122, 0.15);
    }
    .home-btn-make-yours {
      flex: 1;
      background: linear-gradient(135deg, #ff2a7a 0%, #d97706 100%);
      color: #ffffff;
      text-decoration: none;
      font-size: 11px;
      font-weight: 800;
      padding: 6px 10px;
      border-radius: 99px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      box-shadow: 0 3px 10px rgba(255, 42, 122, 0.25);
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .home-btn-make-yours:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(255, 42, 122, 0.35);
    }
  `;

  if (!content.includes('.home-btn-explore')) {
    content = content.replace('</style>', homeStyles + '\n</style>');
  }

  // Replace showcase tag in index.html template cards with the action row
  const oldShowcasePill = /<div class="template-showcase-pill"[\s\S]*?<\/div>/g;
  
  // Re-inject dynamic or static actions
  content = content.replace(oldShowcasePill, (match, offset) => {
    return `<div class="home-tpl-action-row">
      <a href="preview.html?template=birthday-3d-candle" class="home-btn-explore">✦ Explore</a>
      <a href="builder.html" class="home-btn-make-yours">Make It Yours ✨</a>
    </div>`;
  });

  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('index.html updated with home action buttons!');
}

console.log('ALL UPDATES COMPLETE!');
