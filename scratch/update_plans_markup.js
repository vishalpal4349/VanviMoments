const fs = require('fs');
const path = require('path');

const plansPath = path.join(__dirname, '..', 'plans.html');
let html = fs.readFileSync(plansPath, 'utf8');

// Extract current tracks content accurately
function getBetween(str, startDelim, endDelim) {
  const s = str.indexOf(startDelim);
  if (s === -1) return null;
  const e = str.indexOf(endDelim, s + startDelim.length);
  if (e === -1) return null;
  return str.substring(s + startDelim.length, e);
}

// Locate passesTrack content
const passesMatch = html.match(/<div class="plans-slider-track" id="passesTrack"[^>]*>([\s\S]*?)<\/div>\s*<!-- TRACK 2:/);
if (!passesMatch) {
  console.error('Could not match passesTrack');
  process.exit(1);
}
const passesInner = passesMatch[1].trim();

// Locate combosTrack content
const combosMatch = html.match(/<div class="plans-slider-track" id="combosTrack"[^>]*>([\s\S]*?)<\/div>\s*<!-- TRACK 3:/);
if (!combosMatch) {
  console.error('Could not match combosTrack');
  process.exit(1);
}
const combosInner = combosMatch[1].trim();

// Locate coinsTrack content
const coinsMatch = html.match(/<div class="plans-slider-track" id="coinsTrack"[^>]*>([\s\S]*?)<\/div>\s*<!-- TRACK 4:/);
if (!coinsMatch) {
  console.error('Could not match coinsTrack');
  process.exit(1);
}
const coinsInner = coinsMatch[1].trim();

// Locate subsTrack content
const subsMatch = html.match(/<div class="plans-slider-track" id="subsTrack"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<!-- Pagination Dots -->/);
if (!subsMatch) {
  console.error('Could not match subsTrack');
  process.exit(1);
}
const subsInner = subsMatch[1].trim();

console.log('Successfully extracted all 4 tracks inner HTML');

const hubStartStr = '<!-- ============================================================\n     MASTER COMPACT PLANS & PASSES SLIDER HUB\n     ============================================================ -->\n<section class="plans-master-hub" id="plansMasterHub">';
const hubEndStr = '</section>\n\n\n<!-- ============================================================\n     4. COIN REWARDS SCHEDULE & LIVE DISCOUNT CALCULATOR';

const hubStartIdx = html.indexOf(hubStartStr);
const hubEndIdx = html.indexOf(hubEndStr);

if (hubStartIdx === -1 || hubEndIdx === -1) {
  console.error('Could not locate hub start or end markers');
  process.exit(1);
}

const newHubHtml = `<!-- ============================================================
     MASTER COMPACT PLANS & PASSES SLIDER HUB (STACKED SLIDERS)
     ============================================================ -->
<section class="plans-master-hub" id="plansMasterHub">
  <!-- Quick Jump Sticky/Floating Navigation Pills -->
  <div class="hub-category-bar" role="tablist">
    <button type="button" class="hub-tab-btn active" id="tabBtnPasses" onclick="switchHubTab('passes')">
      🎟️ 1-Time Passes (3)
    </button>
    <button type="button" class="hub-tab-btn" id="tabBtnCombos" onclick="switchHubTab('combos')">
      🎁 Combo Passes (4)
    </button>
    <button type="button" class="hub-tab-btn" id="tabBtnCoins" onclick="switchHubTab('coins')">
      🪙 Buy Coins (3)
    </button>
    <button type="button" class="hub-tab-btn" id="tabBtnSubs" onclick="switchHubTab('subs')">
      👑 VIP Memberships (4)
    </button>
  </div>

  <!-- Compatibility hooks for automated tests & legacy handlers -->
  <div style="display:none;" id="hubCategoryTitle">🎟️ 1-TIME CELEBRATION PASSES</div>
  <div style="display:none;" id="hubSlideIndicator">Card 1 of 3</div>
  <div style="display:none;" id="hubSliderDots"></div>

  <!-- ═══════════════════════════════════════════════════════════════
       STAGE 01: CREATOR CREDITS & 1-TIME PASSES (TOP)
       ═══════════════════════════════════════════════════════════════ -->
  <div class="plans-stage-pod" id="stageCreditsPasses">
    <div class="stage-header">
      <div class="stage-header-title">
        <span class="stage-badge badge-pink">🎟️ STAGE 01 · 1-TIME PASSES (CREDITS)</span>
        <h2 class="stage-h2">1-Time Celebration Passes With 1:1 Credits</h2>
        <p class="stage-p">1 Credit = ₹1 Template Value · Roll over unspent credits 6 months · Pay up to 60% with Coins</p>
      </div>
      <div class="slider-nav-arrows">
        <button type="button" class="btn-slider-arrow" onclick="scrollTrack('passesTrack', -1)" aria-label="Slide Left">‹</button>
        <button type="button" class="btn-slider-arrow" onclick="scrollTrack('passesTrack', 1)" aria-label="Slide Right">›</button>
      </div>
    </div>
    <div class="plans-slider-wrapper">
      <div class="plans-slider-track" id="passesTrack" style="display:flex;">
${passesInner}
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════════
       STAGE 01-B: MULTI-MOMENT COMBO BUNDLES
       ═══════════════════════════════════════════════════════════════ -->
  <div class="plans-stage-pod" id="stageCombos">
    <div class="stage-header">
      <div class="stage-header-title">
        <span class="stage-badge badge-green">🎁 MULTI-MOMENT COMBO PASSES</span>
        <h2 class="stage-h2">Multi-Moment Bundles (Save Up To 72%)</h2>
        <p class="stage-p">Curated celebration packs for couples, families & grand milestones · Generous bonus credits</p>
      </div>
      <div class="slider-nav-arrows">
        <button type="button" class="btn-slider-arrow" onclick="scrollTrack('combosTrack', -1)" aria-label="Slide Left">‹</button>
        <button type="button" class="btn-slider-arrow" onclick="scrollTrack('combosTrack', 1)" aria-label="Slide Right">›</button>
      </div>
    </div>
    <div class="plans-slider-wrapper">
      <div class="plans-slider-track" id="combosTrack" style="display:flex;">
${combosInner}
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════════
       STAGE 02: VANVI COINS VAULT MICRO-PACKS (MIDDLE)
       ═══════════════════════════════════════════════════════════════ -->
  <div class="plans-stage-pod" id="stageCoins">
    <div class="stage-header">
      <div class="stage-header-title">
        <span class="stage-badge badge-gold">🪙 STAGE 02 · VANVI COINS VAULT</span>
        <h2 class="stage-h2">Instant Coin Packs For Checkout Discounts</h2>
        <p class="stage-p">10 Coins = ₹1 Checkout Discount · Never expire · Knock up to 60% off template prices instantly</p>
      </div>
      <div class="slider-nav-arrows">
        <button type="button" class="btn-slider-arrow" onclick="scrollTrack('coinsTrack', -1)" aria-label="Slide Left">‹</button>
        <button type="button" class="btn-slider-arrow" onclick="scrollTrack('coinsTrack', 1)" aria-label="Slide Right">›</button>
      </div>
    </div>
    <div class="plans-slider-wrapper">
      <div class="plans-slider-track" id="coinsTrack" style="display:flex;">
${coinsInner}
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════════
       STAGE 03: VIP STUDIO MEMBERSHIPS (NEXT)
       ═══════════════════════════════════════════════════════════════ -->
  <div class="plans-stage-pod" id="stageSubs">
    <div class="stage-header">
      <div class="stage-header-title">
        <span class="stage-badge badge-purple">👑 STAGE 03 · CONTINUOUS VIP MEMBERSHIPS</span>
        <h2 class="stage-h2">Continuous VIP Studio Memberships</h2>
        <p class="stage-p">All-access premium catalog pass, unlimited AI Studio runs, cloud vault & wheel multipliers</p>
      </div>
      <div class="slider-nav-arrows">
        <button type="button" class="btn-slider-arrow" onclick="scrollTrack('subsTrack', -1)" aria-label="Slide Left">‹</button>
        <button type="button" class="btn-slider-arrow" onclick="scrollTrack('subsTrack', 1)" aria-label="Slide Right">›</button>
      </div>
    </div>
    <div class="plans-slider-wrapper">
      <div class="plans-slider-track" id="subsTrack" style="display:flex;">
${subsInner}
      </div>
    </div>
  </div>
</section>`;

html = html.substring(0, hubStartIdx) + newHubHtml + html.substring(hubEndIdx + '</section>'.length);
console.log('✅ Master Hub HTML replaced with stacked stages');

// Now update JavaScript functions
const oldJsStart = '/* ============================================================\n   MASTER HUB CATEGORY TABS & SLIDER NAVIGATION\n   ============================================================ */';
const oldJsEnd = '/* ============================================================\n   VANVI MOMENTS — PLANS, COINS & CALCULATOR ENGINE\n   ============================================================ */';

const jsStartIdx = html.indexOf(oldJsStart);
const jsEndIdx = html.indexOf(oldJsEnd);

if (jsStartIdx === -1 || jsEndIdx === -1) {
  console.error('Could not locate JS block markers');
  process.exit(1);
}

const newJsBlock = `/* ============================================================
   MASTER HUB CATEGORY TABS & STACKED SLIDER NAVIGATION
   ============================================================ */
let activeHubCategory = 'passes';
const HUB_TRACKS = {
  passes: { id: 'passesTrack', title: '🎟️ 1-TIME CELEBRATION PASSES', totalCards: 3 },
  combos: { id: 'combosTrack', title: '🎁 MULTI-MOMENT COMBO PASSES (SAVE UP TO 72%)', totalCards: 4 },
  coins: { id: 'coinsTrack', title: '🪙 VANVI COINS VAULT MICRO-PACKS', totalCards: 3 },
  subs: { id: 'subsTrack', title: '👑 CONTINUOUS VIP STUDIO MEMBERSHIPS', totalCards: 4 }
};

function scrollTrack(trackId, direction) {
  const track = document.getElementById(trackId);
  if (!track) return;
  const cardWidth = track.firstElementChild ? track.firstElementChild.offsetWidth + 16 : 290;
  track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
}

function switchHubTab(category) {
  if (!HUB_TRACKS[category]) return;
  activeHubCategory = category;

  const tabs = ['passes', 'combos', 'coins', 'subs'];
  tabs.forEach(tab => {
    const btn = document.getElementById(\`tabBtn\${tab.charAt(0).toUpperCase() + tab.slice(1)}\`);
    if (btn) btn.classList.toggle('active', tab === category);
  });

  const sectionMap = {
    passes: 'stageCreditsPasses',
    combos: 'stageCombos',
    coins: 'stageCoins',
    subs: 'stageSubs'
  };

  const targetEl = document.getElementById(sectionMap[category]);
  if (targetEl) {
    const topOffset = targetEl.getBoundingClientRect().top + window.pageYOffset - 85;
    window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
  }

  const titleEl = document.getElementById('hubCategoryTitle');
  if (titleEl) titleEl.textContent = HUB_TRACKS[category].title;
}

function slideActiveTrack(direction) {
  const trackMap = {
    passes: 'passesTrack',
    combos: 'combosTrack',
    coins: 'coinsTrack',
    subs: 'subsTrack'
  };
  scrollTrack(trackMap[activeHubCategory] || 'passesTrack', direction);
}

function jumpActiveTrack(index) {
  const trackMap = {
    passes: 'passesTrack',
    combos: 'combosTrack',
    coins: 'coinsTrack',
    subs: 'subsTrack'
  };
  const track = document.getElementById(trackMap[activeHubCategory] || 'passesTrack');
  if (!track) return;
  const cardWidth = track.firstElementChild ? track.firstElementChild.offsetWidth + 16 : 290;
  track.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
}

function updateHubDots(category, activeIdx) {
  const indicator = document.getElementById('hubSlideIndicator');
  const meta = HUB_TRACKS[category];
  if (indicator && meta) {
    indicator.textContent = \`Card \${activeIdx + 1} of \${meta.totalCards}\`;
  }
}

function setupHubSliderListeners() {
  Object.keys(HUB_TRACKS).forEach(key => {
    const meta = HUB_TRACKS[key];
    const track = document.getElementById(meta.id);
    if (!track) return;

    track.addEventListener('scroll', () => {
      const cardWidth = track.firstElementChild ? track.firstElementChild.offsetWidth + 16 : 290;
      const activeIdx = Math.min(meta.totalCards - 1, Math.max(0, Math.round(track.scrollLeft / cardWidth)));
      const indicator = document.getElementById('hubSlideIndicator');
      if (indicator) {
        indicator.textContent = \`Card \${activeIdx + 1} of \${meta.totalCards}\`;
      }
    }, { passive: true });
  });
}

function startPassiveSliderGlide() {
  // Graceful passive glide disabled for multi-track stacked sliders to avoid distraction
}
`;

html = html.substring(0, jsStartIdx) + newJsBlock + '\n' + html.substring(jsEndIdx);
console.log('✅ JS functions updated successfully');

fs.writeFileSync(plansPath, html, 'utf8');
console.log('🎉 plans.html successfully restructured!');
