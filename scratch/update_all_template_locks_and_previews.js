/**
 * VANVI MOMENTS — UNIVERSAL TEMPLATE LOCK & PREVIEW HARMONIZATION ENGINE
 * 
 * 1. Completely removes all price pills (.preview-pill-price, ₹999, etc.) from template previews.
 * 2. Enforces perfectly centered locked smartphone stage on desktop / laptop.
 * 3. Adapts dynamically and flawlessly on any phone (100dvh, safe area insets, no zoom distortion).
 * 4. Applies locked rules and watermark controls universally across all templates and guarantees future templates inherit them.
 */

const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '../templates');
const templateDirs = fs.readdirSync(templatesDir).filter(f => {
  const full = path.join(templatesDir, f);
  return fs.statSync(full).isDirectory();
});

// Load template titles from vanvi-templates-data if possible
const dataFile = path.join(__dirname, '../js/vanvi-templates-data.js');
let templatesMeta = {};
if (fs.existsSync(dataFile)) {
  const content = fs.readFileSync(dataFile, 'utf8');
  // Extract id and name pairings
  const regex = /id:\s*['"]([^'"]+)['"][\s\S]*?name:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    templatesMeta[match[1]] = match[2];
  }
}

function getTemplateTitle(dirName) {
  if (templatesMeta[dirName]) return templatesMeta[dirName];
  // Check template.json inside folder
  const jsonPath = path.join(templatesDir, dirName, 'template.json');
  if (fs.existsSync(jsonPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      if (data.title || data.name) return data.title || data.name;
    } catch (e) {}
  }
  // Fallback to formatted title
  return dirName
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function generateLockedPreviewHtml(id, name) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Preview: ${name} | Vanvi Moments</title>
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../css/vanvi-template-lock.css">

  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      width: 100%;
      height: 100%;
      min-height: 100vh;
      min-height: 100dvh;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: radial-gradient(circle at center, #181124 0%, #08050e 100%);
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
      touch-action: pan-y;
      -webkit-text-size-adjust: 100%;
    }

    /* Master Centered Stage Canvas (Locked phone ratio on laptop/desktop, 100% full view on phone) */
    .preview-canvas-wrapper {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at center, #181124 0%, #08050e 100%);
      overflow: hidden;
      touch-action: pan-y;
    }

    .template-fullscreen-viewport {
      width: 100%;
      max-width: 440px;
      height: 100vh;
      height: 100dvh;
      border: none;
      display: block;
      background: #000000;
      box-shadow: 0 0 70px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08);
      position: relative;
      touch-action: pan-y;
    }

    /* Natural Edge-to-Edge on Mobile Phones */
    @media (max-width: 540px) {
      .template-fullscreen-viewport {
        max-width: 100% !important;
        box-shadow: none;
      }
    }

    /* Minimal Non-Intrusive Floating Top Action Pill */
    .vanvi-preview-top-dock {
      position: fixed;
      top: max(12px, env(safe-area-inset-top, 12px));
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999;
      background: rgba(18, 12, 22, 0.88);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(255, 255, 255, 0.22);
      box-shadow: 0 10px 32px rgba(0, 0, 0, 0.45);
      border-radius: 999px;
      padding: 5px 8px 5px 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #ffffff;
      font-size: 13px;
      max-width: calc(100vw - 24px);
      pointer-events: auto;
      user-select: none;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .preview-pill-back {
      color: #f1f5f9;
      text-decoration: none;
      font-weight: 750;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: color 0.2s;
      white-space: nowrap;
      font-size: 12.5px;
    }
    .preview-pill-back:hover {
      color: #ff2a7a;
    }

    .preview-pill-sep {
      width: 1px;
      height: 14px;
      background: rgba(255, 255, 255, 0.25);
    }

    .preview-pill-name {
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 260px;
      color: #ffffff;
      font-size: 12.5px;
    }

    .preview-pill-cta {
      background: linear-gradient(135deg, #ff2a7a 0%, #e11d68 100%);
      color: #ffffff !important;
      font-weight: 800;
      font-size: 12px;
      text-decoration: none;
      padding: 6px 18px;
      border-radius: 999px;
      box-shadow: 0 4px 14px rgba(255, 42, 122, 0.4);
      transition: all 0.2s ease;
      white-space: nowrap;
      border: 1px solid rgba(255, 255, 255, 0.4);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .preview-pill-cta:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(255, 42, 122, 0.6);
      background: linear-gradient(135deg, #ff438b 0%, #f01e74 100%);
    }

    @media (max-width: 540px) {
      .vanvi-preview-top-dock {
        top: max(10px, env(safe-area-inset-top, 10px));
        gap: 8px;
        padding: 4px 6px 4px 12px;
      }
      .preview-pill-name {
        display: none;
      }
      .preview-pill-cta {
        padding: 5px 14px;
        font-size: 11.5px;
      }
    }
  </style>
</head>
<body>

  <!-- Minimal Floating Navigation Pill (Price Removed) -->
  <header class="vanvi-preview-top-dock" role="banner" aria-label="Preview Navigation">
    <a href="../../templates.html" class="preview-pill-back" title="Back to Templates Catalog">
      <span>←</span>
      <span>Catalog</span>
    </a>
    <span class="preview-pill-sep"></span>
    <span class="preview-pill-name">${name}</span>
    <a href="builder.html" class="preview-pill-cta" title="Create with this template">
      Create
    </a>
  </header>

  <!-- Centered Locked Device Canvas (Adaptive for All Phones and Desktop) -->
  <div class="preview-canvas-wrapper">
    <iframe src="index.html?preview=1" class="template-fullscreen-viewport" id="previewIframe" title="${name} Live Fullscreen Preview"></iframe>
  </div>

  <script src="../../js/vanvi-template-lock.js"></script>
  <script>
    (function() {
      const iframe = document.getElementById('previewIframe');
      iframe.addEventListener('load', function() {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          if (doc) {
            // Enforce Viewport Lock (Prevent pinch zoom, double tap zoom distortion)
            let vp = doc.querySelector('meta[name="viewport"]');
            if (!vp) {
              vp = doc.createElement('meta');
              vp.name = 'viewport';
              doc.head.appendChild(vp);
            }
            vp.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';

            // Inject Universal Template Lock CSS if missing
            if (!doc.querySelector('link[href*="vanvi-template-lock.css"]')) {
              const link = doc.createElement('link');
              link.rel = 'stylesheet';
              link.href = '../../css/vanvi-template-lock.css';
              doc.head.appendChild(link);
            }

            // Inject Universal Template Lock JS if missing
            if (!doc.querySelector('script[src*="vanvi-template-lock.js"]')) {
              const script = doc.createElement('script');
              script.src = '../../js/vanvi-template-lock.js';
              doc.body.appendChild(script);
            }
          }
        } catch (e) {
          // Cross-origin fallback
        }
      });
    })();
  </script>
</body>
</html>
`;
}

// 1. Process all template directories
let previewCount = 0;
let lockInjectedCount = 0;

templateDirs.forEach(dirName => {
  const dirPath = path.join(templatesDir, dirName);
  const title = getTemplateTitle(dirName);

  // If template has index.html, ensure preview.html exists and is cleanly generated
  const indexPath = path.join(dirPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    const previewPath = path.join(dirPath, 'preview.html');
    const newPreviewHtml = generateLockedPreviewHtml(dirName, title);
    fs.writeFileSync(previewPath, newPreviewHtml, 'utf8');
    previewCount++;

    // Ensure index.html includes vanvi-template-lock.css and vanvi-template-lock.js for standalone views
    let indexHtml = fs.readFileSync(indexPath, 'utf8');
    let modified = false;

    if (!indexHtml.includes('vanvi-template-lock.css')) {
      indexHtml = indexHtml.replace('</head>', '  <link rel="stylesheet" href="../../css/vanvi-template-lock.css">\n</head>');
      modified = true;
    }
    if (!indexHtml.includes('vanvi-template-lock.js')) {
      indexHtml = indexHtml.replace('</body>', '  <script src="../../js/vanvi-template-lock.js"></script>\n</body>');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(indexPath, indexHtml, 'utf8');
      lockInjectedCount++;
    }
  }
});

console.log(`\n✅ Generated/Updated ${previewCount} locked template previews (All price pills removed, center locked).`);
console.log(`✅ Injected universal template lock into ${lockInjectedCount} template index.html files.`);
