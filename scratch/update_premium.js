const fs = require('fs');

const file = 'category-premium.html';
if (fs.existsSync(file)) {
  let html = fs.readFileSync(file, 'utf8');

  if (!html.includes('vanvi-template-cards.css')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="css/vanvi-template-cards.css">\n</head>');
  }

  if (!html.includes('more-templates-section')) {
    const recSection = `
<!-- Section: You Might Also Like / More Templates Worth A Look -->
<section class="more-templates-section" style="max-width: 1200px; margin: 36px auto 48px; padding: 28px 20px;">
  <div class="recommendation-header">
    <span class="recommendation-eyebrow">✦ You might also like</span>
    <h2 class="recommendation-heading">More templates worth a look.</h2>
    <p class="recommendation-sub">Curated moments outside this collection loved by our creators.</p>
  </div>
  <div class="recommendations-grid" id="recsContainer"></div>
</section>
`;
    html = html.replace('<footer', recSection + '\n<footer');
    html = html.replace('showToast(msg);', 'showToast(msg);\n  if (window.VanviTemplatesData && typeof window.VanviTemplatesData.renderRecommendations === "function") {\n    window.VanviTemplatesData.renderRecommendations("recsContainer", "premium");\n  }');
    fs.writeFileSync(file, html, 'utf8');
    console.log('category-premium.html updated successfully.');
  }
}
