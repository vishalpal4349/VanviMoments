const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const startMarker = '<!-- Play & Earn Arcade Section -->';
const endMarker = '<section class="section scroll-animate" data-stagger-delay="1.6s" id="ultraSection">';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Markers not found! start:', startIdx, 'end:', endIdx);
  process.exit(1);
}

const replacement = `<!-- Earn VCoins Compact Section -->
<section class="section scroll-animate" id="playAndEarnSection" data-stagger-delay="1.45s" style="padding: 18px 0 12px;">
  <style>
  .home-vcoin-single-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 252, 0.92) 100%);
    border: 1.5px solid rgba(255, 120, 175, 0.32);
    border-radius: 18px;
    padding: 14px 18px;
    box-shadow: 0 8px 24px rgba(255, 42, 122, 0.07);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: all 0.25s ease;
  }
  .home-vcoin-single-card:hover {
    transform: translateY(-2px);
    border-color: #ff2a7a;
    box-shadow: 0 12px 28px rgba(255, 42, 122, 0.14);
  }
  .home-btn-vcoin-play {
    padding: 9px 20px;
    min-height: 38px;
    border-radius: 12px;
    background: linear-gradient(135deg, #ff2a7a 0%, #ff529a 50%, #d97706 100%);
    color: #ffffff;
    font-weight: 850;
    font-size: 12.5px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 14px rgba(255, 42, 122, 0.3);
    white-space: nowrap;
    transition: all 0.2s ease;
  }
  .home-btn-vcoin-play:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(255, 42, 122, 0.45);
  }
  html[data-vanvi-theme="dark"] .home-vcoin-single-card {
    background: rgba(30, 12, 38, 0.92) !important;
    border-color: rgba(255, 120, 175, 0.28) !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
  }
  html[data-vanvi-theme="dark"] .home-vcoin-single-card strong {
    color: #ffffff !important;
  }
  html[data-vanvi-theme="dark"] .home-vcoin-single-card p {
    color: #c9afc4 !important;
  }
  html[data-vanvi-theme="dark"] #playAndEarnSection h3 {
    color: #ffffff !important;
  }
  @media (max-width: 580px) {
    .home-vcoin-single-card {
      flex-direction: column;
      align-items: stretch;
      padding: 14px;
    }
    .home-btn-vcoin-play {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }
  }
  </style>

  <div class="home-vcoins-compact-wrapper" style="max-width: 820px; margin: 0 auto; padding: 0 16px;">
    <!-- Clean Minimalist Header -->
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
      <div>
        <h3 style="font-size: clamp(20px, 3.4vw, 24px); margin: 0; color: #2c1224; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 700; display: flex; align-items: center; gap: 8px;">
          <span>🪙 Earn VCoins</span>
          <span style="font-size: 11px; font-weight: 800; font-family: 'Plus Jakarta Sans', sans-serif; color: #059669; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 2px 9px; border-radius: 99px;">1 VCoin = ₹1</span>
        </h3>
        <p style="font-size: 12.5px; color: #835c75; margin: 3px 0 0; line-height: 1.4;">Play quick 30s games to win instant discounts on your celebration moments.</p>
      </div>
      <a href="games.html" style="font-size: 12px; font-weight: 800; color: #ff2a7a; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; padding: 6px 14px; border-radius: 99px; background: rgba(255, 42, 122, 0.08); border: 1px solid rgba(255, 42, 122, 0.2); transition: all 0.2s ease;">
        <span>All Games (11+) →</span>
      </a>
    </div>

    <!-- Single Compact Game Card: Risk Run -->
    <div class="home-vcoin-single-card">
      <div style="display: flex; align-items: center; gap: 14px; min-width: 240px; flex: 1;">
        <div style="width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #180924 0%, #2b0e35 100%); border: 1.5px solid rgba(245, 158, 11, 0.5); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.25);">
          ⚡
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <strong style="font-size: 15px; font-weight: 800; color: #2c1224; font-family: 'Plus Jakarta Sans', sans-serif;">Risk Run</strong>
            <span style="font-size: 10px; font-weight: 800; color: #d97706; background: #fffbeb; border: 1px solid #fde68a; padding: 1.5px 7px; border-radius: 99px;">★ 4.9 · Popular</span>
            <span style="font-size: 10.5px; font-weight: 800; color: #059669; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 1.5px 8px; border-radius: 99px;">🪙 Win +20 VCoins</span>
          </div>
          <p style="font-size: 12px; color: #796377; margin: 3px 0 0; line-height: 1.35;">Dodge falling obstacles &amp; catch mystery power-ups in a 30s rush.</p>
        </div>
      </div>
      <a href="risk-run.html" class="home-btn-vcoin-play">
        <span>Play Now ▶</span>
      </a>
    </div>
  </div>
</section>
`;

html = html.substring(0, startIdx) + replacement + html.substring(endIdx);
fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully updated index.html with compact Earn VCoins section!');
