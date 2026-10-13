const fs = require('fs');
const path = require('path');

const targetFolders = [
  'floral-mehendi-story',
  'golden-lake-collection',
  'hues-whispers-luxe',
  'ivory-arch-wedding',
  'love-in-clouds',
  'royal-udaivilas-baithak',
  'royal-vows-indian-wedding',
  'sacred-temple-edition',
  'temple-blossom-luxe'
];

const mobileClampCSS = `
    /* Vanvi Ultra-Responsive Mobile Button Clamp Engine */
    @media (max-width: 600px) {
      .editor-dock, .editor-bottom-bar, .builder-bottom-nav, .dock-container {
        padding: 8px 10px calc(8px + env(safe-area-inset-bottom, 0px)) !important;
        gap: 8px !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .dock-btn, .btn-nav-step, .btn-step-prev, .btn-step-next, .btn-action {
        flex: 1 1 0 !important;
        min-width: 0 !important;
        height: 38px !important;
        padding: 0 8px !important;
        font-size: 0.74rem !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        box-sizing: border-box !important;
      }
      .dock-btn.btn-primary, .btn-nav-step.primary, .btn-step-next.primary {
        flex: 1.35 1 0 !important;
      }
      .preview-canvas, .preview-panel {
        display: none !important;
      }
      .editor-panel, .builder-form-pane {
        width: 100% !important;
        max-width: 100vw !important;
        border-right: none !important;
      }
    }
    @media (max-width: 360px) {
      .editor-dock, .editor-bottom-bar, .builder-bottom-nav {
        padding: 6px 6px calc(6px + env(safe-area-inset-bottom, 0px)) !important;
        gap: 5px !important;
      }
      .dock-btn, .btn-nav-step, .btn-step-prev, .btn-step-next {
        height: 34px !important;
        font-size: 0.68rem !important;
        padding: 0 4px !important;
      }
    }
`;

targetFolders.forEach(folder => {
  const filePath = path.join('templates', folder, 'builder.html');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('Vanvi Ultra-Responsive Mobile Button Clamp Engine')) {
      // Insert right before </style>
      if (content.includes('</style>')) {
        content = content.replace('</style>', mobileClampCSS + '\n  </style>');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Injected mobile clamp into:', folder);
      } else {
        console.log('No style tag found in:', folder);
      }
    } else {
      console.log('Already has clamp:', folder);
    }
  }
});
