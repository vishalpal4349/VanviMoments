const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const indexPath = path.join(ROOT, 'index.html');

let content = fs.readFileSync(indexPath, 'utf8');

// Find the start: <section class="section scroll-animate template-tools" id="templateDiscovery"
// Find the end of trendingTemplateSlider section: </section>\s*<section class="section scroll-animate compact-moments-section"
const startMarker = '<section class="section scroll-animate template-tools" id="templateDiscovery"';
const endMarker = '<section class="section scroll-animate compact-moments-section"';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found! Start:', startIndex, 'End:', endIndex);
  process.exit(1);
}

const cleanFeaturedSection = `<!-- ─── CUTIEPAGE-STYLE ULTRA-CLEAN FEATURED DESIGNS SECTION ─── -->
<section class="section scroll-animate" id="featuredTemplatesSection" style="padding: 24px 16px 36px;" data-stagger-delay="0.6s">
  <div class="section-title" style="text-align: center; margin-bottom: 28px;">
    <div class="kicker" style="font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #ff2a7a; font-weight: 800; margin-bottom: 6px;">✦ Handcrafted Digital Keepsakes</div>
    <h3 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(2rem, 4vw, 2.7rem); color: #2c1224; margin: 0 0 8px; font-weight: 700;">Featured Celebration Moments</h3>
    <p style="color: #724c65; font-size: 14.5px; max-width: 500px; margin: 0 auto; line-height: 1.5;">Pick a design, personalize it in 30 seconds, and share a private interactive link with your favorite person.</p>
  </div>

  <div class="featured-cutie-grid">
    
    <!-- CARD 1: Birthday 3D Candle -->
    <article class="cutie-card" id="card-bday-candle">
      <div class="cutie-thumb-wrap" onclick="window.location.href='preview.html?template=birthday-3d-candle'">
        <span class="cutie-sku-tag">VM-B01 · 🎂 Birthday Flagship</span>
        <span class="cutie-tier-badge">🔥 Bestseller</span>
        <img class="cutie-img" src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80" alt="Midnight 3D Candle" loading="lazy">
        <a href="preview.html?template=birthday-3d-candle" class="cutie-float-pill" onclick="event.stopPropagation();">
          <span>✦</span> Explore Moment
        </a>
      </div>
      <div class="cutie-body">
        <div class="cutie-header-row">
          <h4 class="cutie-title"><a href="preview.html?template=birthday-3d-candle">Midnight 3D Candle &amp; Cake</a></h4>
          <span class="cutie-rating"><span style="color:#fbbf24;">★</span> 5.0 <small>(1,280+)</small></span>
        </div>
        <p class="cutie-desc">A fun birthday moment that unfolds like a story: tap the glowing flame to make a wish, burst confetti fireworks, and unfold your wax-sealed letter.</p>
        <div class="cutie-price-row">
          <span class="cutie-price-now">₹149</span>
          <span class="cutie-price-orig">₹429</span>
          <span class="cutie-discount">65% OFF</span>
        </div>
        <div class="cutie-actions">
          <a href="preview.html?template=birthday-3d-candle" class="cutie-btn-explore">✦ Explore Moment</a>
          <a href="builder.html?template=birthday-3d-candle&occasion=Birthday" class="cutie-btn-make">Make It Yours ✨</a>
        </div>
      </div>
    </article>

    <!-- CARD 2: Birthday White Bloom -->
    <article class="cutie-card" id="card-bday-bloom">
      <div class="cutie-thumb-wrap" onclick="window.location.href='preview.html?template=birthday-white-bloom'">
        <span class="cutie-sku-tag">VM-B02 · 🌸 Forever Free</span>
        <span class="cutie-tier-badge" style="background:#10b981; color:#fff;">🎁 100% Free</span>
        <img class="cutie-img" src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80" alt="Birthday White Bloom" loading="lazy">
        <a href="preview.html?template=birthday-white-bloom" class="cutie-float-pill" onclick="event.stopPropagation();">
          <span>✦</span> Explore Moment
        </a>
      </div>
      <div class="cutie-body">
        <div class="cutie-header-row">
          <h4 class="cutie-title"><a href="preview.html?template=birthday-white-bloom">Birthday White Bloom</a></h4>
          <span class="cutie-rating"><span style="color:#fbbf24;">★</span> 4.9 <small>(520+)</small></span>
        </div>
        <p class="cutie-desc">A dreamy birthday garden with floating golden petals, milestone countdown timer, interactive cake, and sweet handwritten letter.</p>
        <div class="cutie-price-row">
          <span class="cutie-price-now" style="color:#10b981;">FREE</span>
          <span class="cutie-discount" style="background:#ecfdf5; color:#059669; border-color:#a7f3d0;">Forever Free</span>
        </div>
        <div class="cutie-actions">
          <a href="preview.html?template=birthday-white-bloom" class="cutie-btn-explore">✦ Explore Moment</a>
          <a href="builder.html?template=birthday-white-bloom&occasion=Birthday" class="cutie-btn-make">Make It Yours ✨</a>
        </div>
      </div>
    </article>

    <!-- CARD 3: Constellation & Wax Seal -->
    <article class="cutie-card" id="card-constellation-love">
      <div class="cutie-thumb-wrap" onclick="window.location.href='preview.html?template=constellation-love'">
        <span class="cutie-sku-tag">VM-L01 · ❤️ Romantic Flagship</span>
        <span class="cutie-tier-badge">✨ Trending</span>
        <img class="cutie-img" src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80" alt="Constellation & Wax Seal" loading="lazy">
        <a href="preview.html?template=constellation-love" class="cutie-float-pill" onclick="event.stopPropagation();">
          <span>✦</span> Explore Moment
        </a>
      </div>
      <div class="cutie-body">
        <div class="cutie-header-row">
          <h4 class="cutie-title"><a href="preview.html?template=constellation-love">Constellation &amp; Wax Seal Vault</a></h4>
          <span class="cutie-rating"><span style="color:#fbbf24;">★</span> 5.0 <small>(940+)</small></span>
        </div>
        <p class="cutie-desc">Deep velvet galaxy sky, sparkling star constellations, 3D wax seal crack animation, and personal acoustic love letter.</p>
        <div class="cutie-price-row">
          <span class="cutie-price-now">₹149</span>
          <span class="cutie-price-orig">₹429</span>
          <span class="cutie-discount">65% OFF</span>
        </div>
        <div class="cutie-actions">
          <a href="preview.html?template=constellation-love" class="cutie-btn-explore">✦ Explore Moment</a>
          <a href="builder.html?template=constellation-love&occasion=Love" class="cutie-btn-make">Make It Yours ✨</a>
        </div>
      </div>
    </article>

    <!-- CARD 4: Retro Polaroid Wall -->
    <article class="cutie-card" id="card-retro-polaroid">
      <div class="cutie-thumb-wrap" onclick="window.location.href='preview.html?template=retro-polaroid-wall'">
        <span class="cutie-sku-tag">VM-F01 · 👯 Best Friends</span>
        <span class="cutie-tier-badge">📸 Keepsake</span>
        <img class="cutie-img" src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80" alt="Retro Polaroid Wall" loading="lazy">
        <a href="preview.html?template=retro-polaroid-wall" class="cutie-float-pill" onclick="event.stopPropagation();">
          <span>✦</span> Explore Moment
        </a>
      </div>
      <div class="cutie-body">
        <div class="cutie-header-row">
          <h4 class="cutie-title"><a href="preview.html?template=retro-polaroid-wall">Retro Polaroid Memory Reel</a></h4>
          <span class="cutie-rating"><span style="color:#fbbf24;">★</span> 4.9 <small>(680+)</small></span>
        </div>
        <p class="cutie-desc">Vintage aesthetic memory reel with washi tape, draggable polaroid snapshots, inside jokes, and cassette playlist.</p>
        <div class="cutie-price-row">
          <span class="cutie-price-now">₹149</span>
          <span class="cutie-price-orig">₹399</span>
          <span class="cutie-discount">60% OFF</span>
        </div>
        <div class="cutie-actions">
          <a href="preview.html?template=retro-polaroid-wall" class="cutie-btn-explore">✦ Explore Moment</a>
          <a href="builder.html?template=retro-polaroid-wall&occasion=Friendship" class="cutie-btn-make">Make It Yours ✨</a>
        </div>
      </div>
    </article>

    <!-- CARD 5: Golden Anniversary Cinema -->
    <article class="cutie-card" id="card-golden-anniversary">
      <div class="cutie-thumb-wrap" onclick="window.location.href='preview.html?template=golden-anniversary'">
        <span class="cutie-sku-tag">VM-A01 · 💍 Milestone Story</span>
        <span class="cutie-tier-badge">👑 24K Atelier</span>
        <img class="cutie-img" src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80" alt="Golden Anniversary Cinema" loading="lazy">
        <a href="preview.html?template=golden-anniversary" class="cutie-float-pill" onclick="event.stopPropagation();">
          <span>✦</span> Explore Moment
        </a>
      </div>
      <div class="cutie-body">
        <div class="cutie-header-row">
          <h4 class="cutie-title"><a href="preview.html?template=golden-anniversary">Golden Cinema Anniversary</a></h4>
          <span class="cutie-rating"><span style="color:#fbbf24;">★</span> 5.0 <small>(820+)</small></span>
        </div>
        <p class="cutie-desc">Vintage 8mm film projector countdown, nostalgic film grain, couple journey timeline, and romantic orchestra soundtrack.</p>
        <div class="cutie-price-row">
          <span class="cutie-price-now">₹199</span>
          <span class="cutie-price-orig">₹599</span>
          <span class="cutie-discount">65% OFF</span>
        </div>
        <div class="cutie-actions">
          <a href="preview.html?template=golden-anniversary" class="cutie-btn-explore">✦ Explore Moment</a>
          <a href="builder.html?template=golden-anniversary&occasion=Anniversary" class="cutie-btn-make">Make It Yours ✨</a>
        </div>
      </div>
    </article>

    <!-- CARD 6: Sincere Apology Letter -->
    <article class="cutie-card" id="card-sincere-letter">
      <div class="cutie-thumb-wrap" onclick="window.location.href='preview.html?template=sincere-letter'">
        <span class="cutie-sku-tag">VM-S01 · 🕊️ Sincere Healing</span>
        <span class="cutie-tier-badge" style="background:#10b981; color:#fff;">🎁 100% Free</span>
        <img class="cutie-img" src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80" alt="The Sincere Letter" loading="lazy">
        <a href="preview.html?template=sincere-letter" class="cutie-float-pill" onclick="event.stopPropagation();">
          <span>✦</span> Explore Moment
        </a>
      </div>
      <div class="cutie-body">
        <div class="cutie-header-row">
          <h4 class="cutie-title"><a href="preview.html?template=sincere-letter">The Sincere Heartfelt Letter</a></h4>
          <span class="cutie-rating"><span style="color:#fbbf24;">★</span> 4.9 <small>(410+)</small></span>
        </div>
        <p class="cutie-desc">Soft ambient illumination, gentle typewriter text reveal, soothing melody, and sincere words when a plain text isn't enough.</p>
        <div class="cutie-price-row">
          <span class="cutie-price-now" style="color:#10b981;">FREE</span>
          <span class="cutie-discount" style="background:#ecfdf5; color:#059669; border-color:#a7f3d0;">Forever Free</span>
        </div>
        <div class="cutie-actions">
          <a href="preview.html?template=sincere-letter" class="cutie-btn-explore">✦ Explore Moment</a>
          <a href="builder.html?template=sincere-letter&occasion=Apology" class="cutie-btn-make">Make It Yours ✨</a>
        </div>
      </div>
    </article>

  </div>

  <div style="text-align:center; margin-top:28px;">
    <a href="templates.html" class="cutie-view-all-btn">
      <span>See All 30+ Bespoke Designs</span> <span>→</span>
    </a>
  </div>
</section>
`;

// Add Cutiepage grid styles to head
const cutieGridStyles = `
  /* Cutiepage-Inspired Ultra-Clean Featured Designs Grid */
  .featured-cutie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .cutie-card {
    background: #ffffff;
    border: 1px solid rgba(255, 120, 175, 0.28);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 18px rgba(74, 41, 58, 0.05);
    display: flex;
    flex-direction: column;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
  }
  .cutie-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(74, 41, 58, 0.12);
    border-color: rgba(255, 42, 122, 0.4);
  }
  .cutie-thumb-wrap {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    cursor: pointer;
    background: #fff0f5;
  }
  .cutie-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s ease;
    display: block;
  }
  .cutie-card:hover .cutie-img {
    transform: scale(1.04);
  }
  .cutie-sku-tag {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(44, 18, 36, 0.75);
    backdrop-filter: blur(8px);
    color: #ffffff;
    font-size: 10.5px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 6px;
    letter-spacing: 0.3px;
  }
  .cutie-tier-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: linear-gradient(135deg, #ff2a7a, #d97706);
    color: #ffffff;
    font-size: 10.5px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 99px;
  }
  .cutie-float-pill {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 120, 175, 0.4);
    color: #2c1224;
    font-size: 11px;
    font-weight: 800;
    padding: 5px 12px;
    border-radius: 99px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
  }
  .cutie-float-pill:hover {
    background: #ffffff;
    transform: translateY(-2px);
    border-color: #ff2a7a;
    color: #ff2a7a;
  }
  .cutie-body {
    padding: 18px 18px 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .cutie-header-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 6px;
  }
  .cutie-title {
    font-size: 16px;
    font-weight: 750;
    margin: 0;
    line-height: 1.25;
  }
  .cutie-title a {
    color: #2c1224;
    text-decoration: none;
  }
  .cutie-title a:hover {
    color: #ff2a7a;
  }
  .cutie-rating {
    font-size: 12px;
    font-weight: 750;
    color: #2c1224;
    white-space: nowrap;
  }
  .cutie-rating small {
    color: #8b7286;
    font-weight: 600;
  }
  .cutie-desc {
    font-size: 12.5px;
    color: #724c65;
    line-height: 1.5;
    margin: 0 0 14px;
    flex: 1;
  }
  .cutie-price-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 14px;
  }
  .cutie-price-now {
    font-size: 1.25rem;
    font-weight: 850;
    color: #ff2a7a;
  }
  .cutie-price-orig {
    font-size: 12px;
    color: #94a3b8;
    text-decoration: line-through;
  }
  .cutie-discount {
    font-size: 10.5px;
    font-weight: 800;
    color: #dc2626;
    background: #fef2f2;
    border: 1px solid #fecaca;
    padding: 2px 7px;
    border-radius: 99px;
  }
  .cutie-actions {
    display: flex;
    gap: 8px;
  }
  .cutie-btn-explore {
    flex: 1;
    background: rgba(255, 255, 255, 0.9);
    border: 1.2px solid rgba(255, 120, 175, 0.35);
    color: #2c1224;
    text-decoration: none;
    font-size: 12px;
    font-weight: 750;
    padding: 9px 8px;
    border-radius: 99px;
    text-align: center;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  .cutie-btn-explore:hover {
    background: #ffffff;
    border-color: #ff2a7a;
    color: #ff2a7a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 42, 122, 0.15);
  }
  .cutie-btn-make {
    flex: 1;
    background: linear-gradient(135deg, #ff2a7a 0%, #d97706 100%);
    color: #ffffff;
    text-decoration: none;
    font-size: 12px;
    font-weight: 800;
    padding: 9px 12px;
    border-radius: 99px;
    text-align: center;
    transition: all 0.2s ease;
    box-shadow: 0 4px 14px rgba(255, 42, 122, 0.25);
    white-space: nowrap;
  }
  .cutie-btn-make:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(255, 42, 122, 0.38);
  }
  .cutie-view-all-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ffffff;
    border: 1.5px solid rgba(255, 120, 175, 0.4);
    color: #2c1224;
    text-decoration: none;
    font-size: 13px;
    font-weight: 800;
    padding: 10px 24px;
    border-radius: 99px;
    box-shadow: 0 4px 14px rgba(0,0,0,0.04);
    transition: all 0.2s ease;
  }
  .cutie-view-all-btn:hover {
    border-color: #ff2a7a;
    color: #ff2a7a;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(255, 42, 122, 0.15);
  }
  @media (max-width: 480px) {
    .featured-cutie-grid {
      grid-template-columns: 1fr;
    }
  }
`;

if (!content.includes('.featured-cutie-grid')) {
  content = content.replace('</style>', cutieGridStyles + '\n</style>');
}

content = content.slice(0, startIndex) + cleanFeaturedSection + content.slice(endIndex);

fs.writeFileSync(indexPath, content, 'utf8');
console.log('Successfully replaced old cluttered template sliders with Cutiepage-style clean luxury cards on index.html!');
