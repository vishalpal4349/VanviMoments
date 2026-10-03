const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// 1. Replace Games Section with Birthday Glass container matching Curated Physical Gifts
const oldGamesRegex = /<!-- Games & Earn VCoins Shortcut Section[\s\S]*?<\/section>\s*(?=<section class="section scroll-animate" id="ultraSection")/i;
if (oldGamesRegex.test(content)) {
  const newGamesSection = `<!-- Games & Earn VCoins Section (Exact match to Curated Physical Gifts Card) -->
<section class="section scroll-animate">
<div class="birthday glass"><div class="eyebrow">Play &amp; Earn Discounts</div><h3>🎮 Celebration Mini-Games</h3>
<p>Play fun 30-second games — Search Hidden Hearts, Catch Falling Hearts, Love Memory Bloom &amp; Quick Tap. Win free Vanvi Coins for instant discounts on all celebration moments!</p>
<button class="secondary" onclick="window.location.href='games.html'">Explore Mini-Games →</button></div>
</section>
`;
  content = content.replace(oldGamesRegex, newGamesSection);
  console.log('✓ Replaced Games Section with exact Curated Physical Gifts birthday glass card');
} else {
  console.warn('⚠️ Could not locate oldGamesRegex');
}

// 2. Explore button rename + Categories Quick Dropdown
// Replace "👑 Explore 50+ Templates →" with "👑 Explore Templates →"
content = content.replace(/👑 Explore 50\+ Templates →/g, '👑 Explore Templates →');
content = content.replace(/Explore 50\+ Templates/g, 'Explore Templates');

// In hero actions, add Categories button next to Explore
const heroActionsRegex = /(<div class="actions">[\s\S]*?<a class="secondary" href="templates\.html"[^>]*>.*?<\/a>)/;
if (heroActionsRegex.test(content)) {
  const match = content.match(heroActionsRegex)[0];
  if (!match.includes('btn-categories-trigger')) {
    const replacement = match + `\n<button type="button" class="secondary btn-categories-trigger" onclick="toggleCategoriesMenu()" aria-haspopup="dialog" style="padding:10px 18px; border-radius:99px; font-weight:800; display:inline-flex; align-items:center; gap:6px; cursor:pointer;"><span>📂 Categories</span> <span style="font-size:10px; color:#ff2a7a;">▾</span></button>`;
    content = content.replace(match, replacement);
    console.log('✓ Added Categories button to hero actions');
  }
}

// 3. Add Luxury Categories Modal / Drawer if not present
if (!content.includes('id="vanviCategoriesModal"')) {
  const categoriesModalHtml = `
<!-- Vanvi A-to-Z Luxury Categories Modal -->
<div id="vanviCategoriesModal" style="display:none; position:fixed; inset:0; z-index:99999; background:rgba(20,8,18,0.72); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); align-items:center; justify-content:center; padding:16px;">
  <div class="vanvi-cat-modal-card" style="background:#ffffff; border-radius:24px; max-width:540px; width:100%; padding:24px clamp(16px, 3vw, 24px); box-shadow:0 24px 60px rgba(0,0,0,0.3); border:1.5px solid rgba(255,120,175,0.35); position:relative; max-height:90vh; overflow-y:auto;">
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid rgba(255,120,175,0.2);">
      <div>
        <span style="font-size:10.5px; font-weight:850; letter-spacing:1px; color:#ff2a7a; text-transform:uppercase;">✦ Complete Collection</span>
        <h3 style="font-family:'Cormorant Garamond', Georgia, serif; font-size:24px; color:#2c1224; margin:2px 0 0; font-weight:800;">Browse by Category</h3>
      </div>
      <button type="button" onclick="toggleCategoriesMenu()" style="width:34px; height:34px; border-radius:50%; border:1px solid rgba(255,120,175,0.3); background:#fff0f6; color:#ff2a7a; font-size:16px; font-weight:bold; cursor:pointer; display:grid; place-items:center;">✕</button>
    </div>
    
    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:10px;">
      <a href="templates.html?cat=birthday" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:16px; background:#fff7fb; border:1px solid rgba(255,120,175,0.25); transition:all 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.borderColor='#ff2a7a'" onmouseout="this.style.transform='none';this.style.borderColor='rgba(255,120,175,0.25)'">
        <span style="font-size:22px;">🎂</span>
        <div><strong style="display:block; font-size:13px; color:#2c1224;">Birthday Magic</strong><small style="font-size:11px; color:#78536d;">Cakes, candles &amp; wishes</small></div>
      </a>
      <a href="templates.html?cat=love" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:16px; background:#fff7fb; border:1px solid rgba(255,120,175,0.25); transition:all 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.borderColor='#ff2a7a'" onmouseout="this.style.transform='none';this.style.borderColor='rgba(255,120,175,0.25)'">
        <span style="font-size:22px;">💖</span>
        <div><strong style="display:block; font-size:13px; color:#2c1224;">Love &amp; Romance</strong><small style="font-size:11px; color:#78536d;">Constellations &amp; letters</small></div>
      </a>
      <a href="templates.html?cat=anniversary" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:16px; background:#fff7fb; border:1px solid rgba(255,120,175,0.25); transition:all 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.borderColor='#ff2a7a'" onmouseout="this.style.transform='none';this.style.borderColor='rgba(255,120,175,0.25)'">
        <span style="font-size:22px;">✨</span>
        <div><strong style="display:block; font-size:13px; color:#2c1224;">Anniversary</strong><small style="font-size:11px; color:#78536d;">Golden milestones &amp; reels</small></div>
      </a>
      <a href="coming-soon.html?type=cards" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:16px; background:#fff7fb; border:1px solid rgba(255,120,175,0.25); transition:all 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.borderColor='#ff2a7a'" onmouseout="this.style.transform='none';this.style.borderColor='rgba(255,120,175,0.25)'">
        <span style="font-size:22px;">💌</span>
        <div><strong style="display:block; font-size:13px; color:#2c1224;">Greeting Cards</strong><small style="font-size:11px; color:#ff2a7a; font-weight:700;">Coming Soon · Preview</small></div>
      </a>
      <a href="coming-soon.html?type=magazine" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:16px; background:#fff7fb; border:1px solid rgba(255,120,175,0.25); transition:all 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.borderColor='#ff2a7a'" onmouseout="this.style.transform='none';this.style.borderColor='rgba(255,120,175,0.25)'">
        <span style="font-size:22px;">📖</span>
        <div><strong style="display:block; font-size:13px; color:#2c1224;">Digital E-Magazine</strong><small style="font-size:11px; color:#ff2a7a; font-weight:700;">Coming Soon · Preview</small></div>
      </a>
      <a href="category-premium.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:16px; background:#fffdf5; border:1px solid rgba(217,119,6,0.3); transition:all 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.borderColor='#d97706'" onmouseout="this.style.transform='none';this.style.borderColor='rgba(217,119,6,0.3)'">
        <span style="font-size:22px;">👑</span>
        <div><strong style="display:block; font-size:13px; color:#92400e;">24K Bespoke Atelier</strong><small style="font-size:11px; color:#b45309;">VIP 1-on-1 craft</small></div>
      </a>
      <a href="category-free.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:16px; background:#f0fdf4; border:1px solid rgba(16,185,129,0.25); transition:all 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.borderColor='#10b981'" onmouseout="this.style.transform='none';this.style.borderColor='rgba(16,185,129,0.25)'">
        <span style="font-size:22px;">🆓</span>
        <div><strong style="display:block; font-size:13px; color:#065f46;">100% Free Keepsakes</strong><small style="font-size:11px; color:#047857;">₹0 · Instant share</small></div>
      </a>
      <a href="games.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:16px; background:#f5f3ff; border:1px solid rgba(147,51,234,0.25); transition:all 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.borderColor='#9333ea'" onmouseout="this.style.transform='none';this.style.borderColor='rgba(147,51,234,0.25)'">
        <span style="font-size:22px;">🎮</span>
        <div><strong style="display:block; font-size:13px; color:#581c87;">Celebration Games</strong><small style="font-size:11px; color:#7e22ce;">Play &amp; earn coins</small></div>
      </a>
    </div>
    
    <div style="margin-top:16px; text-align:center;">
      <a href="templates.html" style="display:inline-block; padding:10px 22px; border-radius:99px; background:linear-gradient(135deg, #ff2a7a, #d97706); color:#fff; font-size:12.5px; font-weight:850; text-decoration:none;">Explore All Templates →</a>
    </div>
  </div>
</div>

<script>
function toggleCategoriesMenu() {
  const m = document.getElementById('vanviCategoriesModal');
  if (m) {
    const isShowing = m.style.display === 'flex';
    m.style.display = isShowing ? 'none' : 'flex';
  }
}
</script>
`;
  content = content.replace('</body>', `${categoriesModalHtml}\n</body>`);
  console.log('✓ Added VanviCategoriesModal');
}

// 4. "What Can You Create" Section clickable arrow indicators
// Remove .make-format-arrow { display: none; }
content = content.replace(/\.make-format-arrow\s*\{\s*display:\s*none;?\s*\}/g, '.make-format-arrow { display: inline-flex !important; }');

// Make arrows look clickable and noticeable
const formatArrowStyle = `
    .make-format-arrow {
      font-size: 12px;
      font-weight: 800;
      color: #ff2a7a;
      margin-left: auto;
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgba(255, 42, 122, 0.08);
      border: 1px solid rgba(255, 42, 122, 0.2);
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    .make-format-item:hover .make-format-arrow {
      transform: translateX(2px) scale(1.08);
      background: #ff2a7a;
      color: #ffffff;
    }
`;
if (!content.includes('border: 1px solid rgba(255, 42, 122, 0.2);')) {
  content = content.replace(/\.make-format-arrow\s*\{[\s\S]*?\.make-format-item:hover \.make-format-arrow\s*\{[\s\S]*?\}/, formatArrowStyle);
  console.log('✓ Upgraded What Can You Create arrows to prominent clickable badges');
}

// Update Greeting Cards and Magazines links to point to coming-soon.html
content = content.replace('href="templates.html?type=Card"', 'href="coming-soon.html?type=cards"');
content = content.replace('onclick="showMagazineComingSoonModal()"', 'onclick="window.location.href=\'coming-soon.html?type=magazine\'"');

// 5. Word-stage hero typography layout on Laptop screens
// Replace word-stage and word-stage-pill styles with responsive stacked grid
const wordStageFixCss = `
/* Luxury Iridescent Rotating Stage Pill (Rock-solid on all screens) */
.word-stage-pill {
  display: inline-flex !important;
  align-items: center !important;
  position: relative !important;
  padding: clamp(6px, 0.8vw, 9px) clamp(16px, 1.8vw, 24px) !important;
  border-radius: 999px !important;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 244, 250, 0.92)) !important;
  border: 1.5px solid rgba(255, 150, 195, 0.45) !important;
  box-shadow: 0 10px 30px rgba(255, 42, 122, 0.14), 0 2px 10px rgba(168, 85, 247, 0.08), inset 0 1.5px 2px #ffffff !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  box-sizing: border-box !important;
  width: auto !important;
  max-width: 100% !important;
  overflow: visible !important;
}

/* Word Stage Container: Stacked Grid to perfectly accommodate longest phrase without breaking */
.word-stage {
  display: inline-grid !important;
  grid-template-areas: "stack" !important;
  align-items: center !important;
  position: relative !important;
  box-sizing: border-box !important;
  overflow: visible !important;
  margin: 0 !important;
  padding: 0 !important;
  min-width: clamp(260px, 32vw, 420px) !important;
  height: clamp(38px, 3.2vw, 46px) !important;
}

.word-stage span:not(.w-sparkle):not(.w-em) {
  grid-area: stack !important;
  position: relative !important;
  display: inline-flex !important;
  align-items: center !important;
  white-space: nowrap !important;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px) scale(0.985);
  filter: blur(2px);
  will-change: transform, opacity, filter, visibility !important;
  backface-visibility: hidden !important;
  font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif !important;
  font-style: italic !important;
  font-weight: 700 !important;
  font-size: clamp(17px, 1.8vw, 27px) !important;
  letter-spacing: -0.01em !important;
  line-height: 1 !important;
}
`;

content = content.replace(/\/\* Luxury Iridescent Rotating Stage Pill \*\/[\s\S]*?font-size: clamp\(18px, 1\.85vw, 29px\) !important;[\s\S]*?line-height: 1 !important;\s*\}/, wordStageFixCss);

fs.writeFileSync(indexPath, content, 'utf8');
console.log('✓ Successfully applied Batch 1 to index.html!');
