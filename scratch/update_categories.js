const fs = require('fs');

const catMap = {
  'category-birthday.html': 'birthday',
  'category-love.html': 'love',
  'category-anniversary.html': 'anniversary',
  'category-friendship.html': 'friendship',
  'category-apology.html': 'apology',
  'category-memories.html': 'memories',
  'category-family.html': 'family',
  'category-celebration.html': 'celebration',
  'category-free.html': 'free'
};

Object.entries(catMap).forEach(([file, catKey]) => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  // 1. Add css/vanvi-template-cards.css to <head> if not already present
  if (!html.includes('vanvi-template-cards.css')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="css/vanvi-template-cards.css">\n</head>');
  }

  // 2. Change <main class="grid" to <main class="grid-luxury-catalog"
  html = html.replace(/<main class=["']grid["']/g, '<main class="grid-luxury-catalog"');

  // 3. Add recommendation section before <footer> if not present
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
    html = html.replace('<footer>', recSection + '\n<footer>');
  }

  // 4. Update the script to use window.VanviTemplatesData.renderCard and renderRecommendations
  const scriptRegex = /<script>\s*\(function\(\)\s*\{[\s\S]*?\}\)\(\);\s*<\/script>/;
  const newScript = `<script>
(function() {
  const gridEl = document.querySelector('.grid-luxury-catalog');
  if (!gridEl || !window.VanviTemplatesData) return;

  const list = window.VanviTemplatesData.getByCategory('${catKey}');
  gridEl.innerHTML = list.map(t => window.VanviTemplatesData.renderCard(t)).join('');

  // Render 2-3 recommendations at the bottom
  if (typeof window.VanviTemplatesData.renderRecommendations === 'function') {
    window.VanviTemplatesData.renderRecommendations('recsContainer', '${catKey}');
  }
})();
</script>`;

  if (scriptRegex.test(html)) {
    html = html.replace(scriptRegex, newScript);
  }

  fs.writeFileSync(file, html, 'utf8');
  console.log(`Updated ${file} successfully.`);
});
