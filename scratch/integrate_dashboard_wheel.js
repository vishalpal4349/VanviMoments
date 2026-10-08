const fs = require('fs');
const path = require('path');

const dashPath = path.join(__dirname, '..', 'dashboard.html');
let code = fs.readFileSync(dashPath, 'utf8');

// 1. Update the Fortune Wheel button in dashboard.html
const oldWheelButtonHtml = `      <div>
        <a href="index.html#wheel-section" class="btn-spin-wheel" id="dashSpinWheelLink">
          <span>🎡</span> Spin Daily Fortune Wheel
        </a>
        <div class="spin-status-note" id="spinCooldownStatus">✨ Ready to spin for bonus coins!</div>
      </div>`;

const newWheelButtonHtml = `      <div>
        <button type="button" class="btn-spin-wheel" id="dashSpinWheelLink" onclick="openDashboardWheelModal()" title="Spin the Wheel directly for bonus coins">
          <span>🎡</span> Spin Daily Fortune Wheel
        </button>
        <div class="spin-status-note" id="spinCooldownStatus">✨ Ready to spin for bonus coins!</div>
      </div>`;

code = code.replace(oldWheelButtonHtml, newWheelButtonHtml);

// 2. Add Fortune Wheel Modal CSS into dashboard.html
const styleEndTag = '</style>';
const wheelModalCss = `
/* ─── 3D HARD POLISH FORTUNE WHEEL MODAL FOR DASHBOARD ─── */
.dash-wheel-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(30, 10, 24, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: fadeIn 0.25s ease;
}
.dash-wheel-modal-overlay.active {
  display: flex;
}
.dash-wheel-card {
  background: linear-gradient(145deg, #ffffff 0%, #fff7fb 100%);
  border: 2px solid rgba(255, 120, 175, 0.45);
  border-radius: 28px;
  max-width: 440px;
  width: 100%;
  padding: 24px 20px 22px;
  box-shadow: 
    0 24px 65px rgba(44, 18, 36, 0.25),
    inset 0 2px 2px #ffffff;
  position: relative;
  text-align: center;
  overflow: hidden;
}
.dash-wheel-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff2a7a, #d97706, #a855f7);
}
.dash-wheel-close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff0f6;
  border: 1px solid rgba(255, 120, 175, 0.3);
  color: var(--rose-primary);
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.2s ease;
}
.dash-wheel-close-btn:hover {
  background: var(--rose-primary);
  color: #fff;
  transform: rotate(90deg);
}
.dash-wheel-stage {
  position: relative;
  width: 260px;
  height: 260px;
  margin: 16px auto 14px;
}
.dash-wheel-pointer {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 26px;
  height: 30px;
  filter: drop-shadow(0 3px 5px rgba(0,0,0,0.3));
}
.dash-wheel-outer-ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #d97706, #f59e0b, #b45309);
  padding: 7px;
  box-shadow: 
    0 14px 34px rgba(217, 119, 6, 0.35),
    inset 0 3px 4px rgba(255, 255, 255, 0.8),
    inset 0 -3px 4px rgba(0, 0, 0, 0.3);
  position: relative;
}
.dash-wheel-disc {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  background: #ffffff;
  transition: transform 4.5s cubic-bezier(0.12, 0.88, 0.16, 1);
  box-shadow: inset 0 0 10px rgba(0,0,0,0.25);
}
.dash-wheel-slice {
  position: absolute;
  top: 0;
  left: 50%;
  width: 58px;
  height: 50%;
  margin-left: -29px;
  transform-origin: 50% 100%;
  display: flex;
  justify-content: center;
  padding-top: 10px;
  font-size: 11px;
  font-weight: 850;
  color: #2c1224;
}
.dash-wheel-center-hub {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff2a7a, #d97706);
  border: 3.5px solid #ffffff;
  color: #ffffff;
  font-weight: 900;
  font-size: 13px;
  letter-spacing: 0.5px;
  display: grid;
  place-items: center;
  box-shadow: 
    0 6px 18px rgba(255, 42, 122, 0.45),
    inset 0 2px 2px rgba(255, 255, 255, 0.7);
  cursor: pointer;
  user-select: none;
  z-index: 5;
  transition: transform 0.15s ease;
}
.dash-wheel-center-hub:hover {
  transform: translate(-50%, -50%) scale(1.06);
}
.dash-wheel-center-hub:active {
  transform: translate(-50%, -50%) scale(0.95);
}
.dash-wheel-result-msg {
  font-size: 13.5px;
  font-weight: 800;
  min-height: 22px;
  margin-top: 8px;
  color: var(--text-dark);
}
</style>`;

code = code.replace(styleEndTag, wheelModalCss);

// 3. Add Modal Markup before </body>
const bodyEndTag = '</body>';
const wheelModalHtml = `
<!-- 3D FORTUNE WHEEL MODAL ON DASHBOARD -->
<div id="dashFortuneWheelModal" class="dash-wheel-modal-overlay" onclick="closeDashboardWheelModal(event)">
  <div class="dash-wheel-card" onclick="event.stopPropagation()">
    <button type="button" class="dash-wheel-close-btn" onclick="closeDashboardWheelModal()">&times;</button>
    
    <span style="font-size:10px; font-weight:850; text-transform:uppercase; letter-spacing:1px; color:#d97706; background:#fffbeb; padding:3px 10px; border-radius:999px; border:1px solid #fde68a;">
      🎡 Daily Free Wheel
    </span>
    <h3 style="font-family:var(--font-serif); font-size:22px; color:#2c1224; margin:4px 0 2px; font-weight:800;">
      Spin &amp; Earn Vanvi Coins
    </h3>
    <p style="font-size:11.5px; color:var(--text-muted); line-height:1.4;">
      Spin once every 24 hours to win free celebration coins added instantly to your wallet!
    </p>

    <div class="dash-wheel-stage">
      <div class="dash-wheel-pointer">
        <svg viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 28 L2 8 C1 6 2.5 3 5 3 L19 3 C21.5 3 23 6 22 8 Z" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="12" cy="10" r="3.5" fill="#ffffff"/>
        </svg>
      </div>

      <div class="dash-wheel-outer-ring">
        <div class="dash-wheel-disc" id="dashWheelDisc">
          <div class="dash-wheel-slice" style="transform: rotate(12.85deg);"><span style="color:#d97706;">+5</span></div>
          <div class="dash-wheel-slice" style="transform: rotate(38.57deg);"><span style="color:#ec4899;">+10</span></div>
          <div class="dash-wheel-slice" style="transform: rotate(64.28deg);"><span style="color:#059669;">+15</span></div>
          <div class="dash-wheel-slice" style="transform: rotate(90.00deg);"><span style="color:#7c3aed;">+20</span></div>
          <div class="dash-wheel-slice" style="transform: rotate(115.71deg);"><span style="color:#d97706;">+8</span></div>
          <div class="dash-wheel-slice" style="transform: rotate(141.42deg);"><span style="color:#be185d;">+12</span></div>
          <div class="dash-wheel-slice" style="transform: rotate(167.14deg);"><span style="color:#059669;">+25</span></div>
          <div class="dash-wheel-slice" style="transform: rotate(192.85deg);"><span style="color:#2563eb;">+6</span></div>
          <div class="dash-wheel-slice" style="transform: rotate(218.57deg);"><span style="color:#d97706;">+18</span></div>
          <div class="dash-wheel-slice" style="transform: rotate(244.28deg);"><span style="color:#7c3aed;">+30</span></div>
          <div class="dash-wheel-slice" style="transform: rotate(270.00deg);"><span style="color:#be185d;">+10</span></div>
          <div class="dash-wheel-slice" style="transform: rotate(295.71deg);"><span style="color:#059669;">+40</span></div>
          <div class="dash-wheel-slice" style="transform: rotate(321.42deg);"><span style="color:#2563eb;">+50</span></div>
          <div class="dash-wheel-slice" style="transform: rotate(347.14deg);"><span style="color:#f59e0b; font-weight:900;">👑 80</span></div>
        </div>

        <div class="dash-wheel-center-hub" id="dashWheelHub" onclick="executeDashboardWheelSpin()">
          <span id="dashHubText">SPIN</span>
        </div>
      </div>
    </div>

    <div class="dash-wheel-result-msg" id="dashWheelResultMsg">
      Tap <strong>SPIN</strong> in the center to test your luck!
    </div>

    <div style="margin-top:14px; display:flex; gap:8px; justify-content:center;">
      <a href="rewards.html?tab=wheel#wheel-section" style="font-size:11.5px; font-weight:800; color:var(--rose-primary); text-decoration:none; padding:5px 12px; border-radius:99px; background:#fff0f6; border:1px solid rgba(255,120,175,0.3);">
        Full Rewards Hub &amp; Quests ➔
      </a>
    </div>
  </div>
</div>
`;

code = code.replace(bodyEndTag, wheelModalHtml + '\n' + bodyEndTag);

// 4. Add JavaScript for Dashboard Fortune Wheel
const scriptEndTag = '</script>';
const wheelScript = `
// ─── DASHBOARD FORTUNE WHEEL CONTROLLER ───
let isDashWheelSpinning = false;
let dashWheelAngle = 0;
const DASH_WHEEL_SLICES = [5, 10, 15, 20, 8, 12, 25, 6, 18, 30, 10, 40, 50, 80];
const DASH_SLICE_DEG = 360 / 14;

function openDashboardWheelModal() {
  const modal = document.getElementById('dashFortuneWheelModal');
  if (modal) modal.classList.add('active');
}

function closeDashboardWheelModal(e) {
  if (e && e.target !== e.currentTarget) return;
  const modal = document.getElementById('dashFortuneWheelModal');
  if (modal) modal.classList.remove('active');
}

async function executeDashboardWheelSpin() {
  if (isDashWheelSpinning) return;
  
  const lastSpin = parseInt(localStorage.getItem('vanvi_last_spin_time') || '0', 10);
  const now = Date.now();
  const hoursSince = (now - lastSpin) / (1000 * 3600);
  
  if (hoursSince < 24 && lastSpin > 0) {
    const remain = Math.ceil(24 - hoursSince);
    const msg = document.getElementById('dashWheelResultMsg');
    if (msg) msg.innerHTML = \`<span style="color:#d97706;">⏳ Already spun! Next free spin in ~\${remain}h.</span>\`;
    return;
  }

  isDashWheelSpinning = true;
  const hubTxt = document.getElementById('dashHubText');
  const resultMsg = document.getElementById('dashWheelResultMsg');
  const disc = document.getElementById('dashWheelDisc');

  if (hubTxt) hubTxt.textContent = '...';
  if (resultMsg) resultMsg.textContent = '✨ Fortune is turning…';

  // Pick winning reward weighted
  const randIdx = Math.floor(Math.random() * DASH_WHEEL_SLICES.length);
  const wonCoins = DASH_WHEEL_SLICES[randIdx];

  const sliceCenter = (randIdx * DASH_SLICE_DEG) + (DASH_SLICE_DEG / 2);
  const targetDeg = (360 - sliceCenter) % 360;
  const extraRotations = (5 + Math.floor(Math.random() * 2)) * 360;
  const currentMod = dashWheelAngle % 360;
  const delta = (targetDeg - currentMod + 360) % 360;

  dashWheelAngle += extraRotations + delta;
  if (disc) disc.style.transform = \`rotate(\${dashWheelAngle}deg)\`;

  // Sound ticks
  let tickCount = 0;
  const tickInterval = setInterval(() => {
    tickCount++;
    try {
      const a = new (window.AudioContext || window.webkitAudioContext)();
      const osc = a.createOscillator();
      const g = a.createGain();
      osc.frequency.value = 800 + (tickCount % 4) * 100;
      g.gain.setValueAtTime(0.04, a.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.05);
      osc.connect(g);
      g.connect(a.destination);
      osc.start();
      osc.stop(a.currentTime + 0.05);
    } catch (e) {}
    if (tickCount > 24) clearInterval(tickInterval);
  }, 170);

  setTimeout(async () => {
    isDashWheelSpinning = false;
    if (hubTxt) hubTxt.textContent = 'SPIN';

    // Credit coins
    localStorage.setItem('vanvi_last_spin_time', Date.now());
    const curCoins = parseInt(localStorage.getItem('vanvi_user_coins') || '120', 10);
    const newCoins = curCoins + wonCoins;
    localStorage.setItem('vanvi_user_coins', newCoins);

    // Update Dashboard Coin elements
    const dashCoinBal = document.getElementById('dashCoinBal');
    const dashCoinValue = document.getElementById('dashCoinValue');
    const spinCooldownStatus = document.getElementById('spinCooldownStatus');

    if (dashCoinBal) dashCoinBal.textContent = newCoins.toLocaleString('en-IN');
    if (dashCoinValue) dashCoinValue.textContent = \`= ₹\${(newCoins / 10).toFixed(2)} savings\`;
    if (spinCooldownStatus) {
      spinCooldownStatus.textContent = '⏳ Next free spin in ~24h';
      spinCooldownStatus.style.color = 'var(--text-dim)';
    }

    if (resultMsg) {
      resultMsg.innerHTML = \`<span style="color:#059669; font-size:15px;">🎉 Won +\${wonCoins} Vanvi Coins! Added to wallet.</span>\`;
    }

    // Try backend coin credit
    try {
      if (window.VanviAPI && window.VanviAPI.coins && window.VanviAPI.coins.add) {
        await window.VanviAPI.coins.add(wonCoins, 'Daily Fortune Spin Streak');
      }
    } catch (e) {}
  }, 4600);
}
</script>`;

code = code.replace(scriptEndTag, wheelScript);

fs.writeFileSync(dashPath, code, 'utf8');
console.log('✅ dashboard.html successfully updated with Fortune Wheel modal and clean smart UI!');
