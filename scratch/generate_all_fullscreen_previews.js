/**
 * VANVI MOMENTS — GENERATE FULL-SCREEN PREVIEWS FOR ALL 11 TEMPLATES
 * Replaces any 3D device frames or mockups with 100% full viewport native experience.
 */
const fs = require('fs');
const path = require('path');

const templates = [
  {
    id: 'birthday-3d-candle',
    name: 'Midnight 3D Candle & Cake',
    priceText: '₹149',
    category: 'Birthday'
  },
  {
    id: 'birthday-3d-candle-surprise',
    name: 'Birthday 3D Candle & Polaroid Magic',
    priceText: '₹199',
    category: 'Birthday'
  },
  {
    id: 'birthday-white-bloom',
    name: 'Birthday White Bloom',
    priceText: 'Free',
    category: 'Birthday'
  },
  {
    id: 'birthday-wish-01',
    name: 'Birthday Wish 01',
    priceText: '₹149',
    category: 'Birthday'
  },
  {
    id: 'birthday-wish-02',
    name: 'Birthday Wish 02',
    priceText: '₹149',
    category: 'Birthday'
  },
  {
    id: 'botanical-blush-wedding',
    name: 'Maison Rose — Eternal Invitation',
    priceText: '₹1,999',
    category: 'Wedding'
  },
  {
    id: 'constellation-love',
    name: 'Constellation & Wax Seal Vault',
    priceText: '₹149',
    category: 'Love'
  },
  {
    id: 'golden-anniversary',
    name: 'Golden Anniversary Odyssey',
    priceText: '₹199',
    category: 'Anniversary'
  },
  {
    id: 'retro-polaroid-wall',
    name: 'Retro Polaroid Memory Reel',
    priceText: '₹99',
    category: 'Friendship'
  },
  {
    id: 'sincere-letter',
    name: 'The Sincere Heartfelt Letter',
    priceText: 'Free',
    category: 'Apology'
  },
  {
    id: 'temple-royal-wedding',
    name: 'Temple Royale — Sacred Vows',
    priceText: '₹2,499',
    category: 'Wedding'
  }
];

function generatePreviewHtml(t) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
  <title>Preview: ${t.name} | Vanvi Moments</title>
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">

  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #000000;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    /* 100% Full Viewport Native Template Frame - NO FAKE FRAMES OR MOCKUPS */
    .template-fullscreen-viewport {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      border: none;
      display: block;
      background: transparent;
      z-index: 1;
    }

    /* Minimal Non-Intrusive Floating Top Action Pill */
    .vanvi-preview-top-dock {
      position: fixed;
      top: 14px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999;
      background: rgba(18, 12, 22, 0.82);
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

    .preview-pill-price {
      font-weight: 850;
      color: #ffd8d0;
      white-space: nowrap;
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

    /* Mobile: 100% natural mobile screen with sleek compact pill */
    @media (max-width: 540px) {
      .vanvi-preview-top-dock {
        top: 10px;
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

  <!-- Minimal Floating Navigation Pill -->
  <header class="vanvi-preview-top-dock" role="banner" aria-label="Preview Navigation">
    <a href="../../templates.html" class="preview-pill-back" title="Back to Templates Catalog">
      <span>←</span>
      <span>Catalog</span>
    </a>
    <span class="preview-pill-sep"></span>
    <span class="preview-pill-name">${t.name}</span>
    <span class="preview-pill-price">${t.priceText}</span>
    <a href="builder.html" class="preview-pill-cta" title="Create with this template">
      Create
    </a>
  </header>

  <!-- 100% Real Template Experience Loaded in Full Viewport -->
  <iframe src="index.html?preview=1" class="template-fullscreen-viewport" id="previewIframe" title="${t.name} Live Fullscreen Preview"></iframe>

</body>
</html>
`;
}

templates.forEach(t => {
  const dir = path.join(__dirname, '../templates', t.id);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const previewPath = path.join(dir, 'preview.html');
  fs.writeFileSync(previewPath, generatePreviewHtml(t), 'utf8');
  console.log(`Generated full-screen preview: templates/${t.id}/preview.html`);
});

console.log('\nAll 11 template full-screen previews generated successfully.');
