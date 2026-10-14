const fs = require('fs');

const f = ['#ff7fae','#ffd76f','#8fd6b5','#b9a2f0','#7fc4ff','#ffffff'];
let seedP = 9;
const rndP = () => (seedP = seedP * 16807 % 2147483647) / 2147483647;
const sprinkles = Array.from({ length: 30 }, () => ({
  x: +(55 + rndP() * 220).toFixed(1),
  y: +(248 + rndP() * 28).toFixed(1),
  color: f[Math.floor(rndP() * f.length)],
  angle: Math.floor(rndP() * 180)
}));

let seedH = 13;
const rndH = () => (seedH = seedH * 16807 % 2147483647) / 2147483647;
const dripStep = 250 / 9;
let dripPath = 'M40 186';
for (let i = 0; i < 9; i++) {
  const x = 40 + i * dripStep;
  const a = +(30 * (0.45 + rndH() * 0.75)).toFixed(2);
  dripPath += ` L${(x + dripStep * 0.2).toFixed(1)} 186 C ${(x + dripStep * 0.2).toFixed(1)} ${(186 + a).toFixed(1)}, ${(x + dripStep * 0.8).toFixed(1)} ${(186 + a).toFixed(1)}, ${(x + dripStep * 0.8).toFixed(1)} 186`;
}
dripPath += ' L290 186 L290 178 L40 178 Z';

const candles = [
  { x: 95, color: '#ff8fbd' },
  { x: 130, color: '#ffd76f' },
  { x: 165, color: '#b9a2f0' },
  { x: 200, color: '#8fd6b5' },
  { x: 235, color: '#7fc4ff' }
];

const creamPuffs = [
  { x: 79, color: '#ff8fbd' },
  { x: 119, color: '#ffd76f' },
  { x: 159, color: '#b9a2f0' },
  { x: 199, color: '#8fd6b5' },
  { x: 239, color: '#ff8fbd' },
  { x: 271, color: '#ffd76f' }
];

// Build Cake SVG
const cakeSvg = `
<div class="wish-cake" id="wish-cake">
  <div class="wish-glow" aria-hidden="true"></div>
  <svg viewBox="0 0 330 320" role="img" aria-label="Birthday cake with five lit candles">
    <defs>
      <radialGradient id="wishFlame" cx="50%" cy="70%" r="60%">
        <stop offset="0" stop-color="#fff3b0" />
        <stop offset=".55" stop-color="#ffb347" />
        <stop offset="1" stop-color="#ff7a59" />
      </radialGradient>
      <radialGradient id="wishHalo">
        <stop offset="0" stop-color="rgba(255,220,130,.75)" />
        <stop offset="1" stop-color="rgba(255,220,130,0)" />
      </radialGradient>
      <linearGradient id="wishTier" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#f7b6cf" />
        <stop offset="1" stop-color="#e88db2" />
      </linearGradient>
      <linearGradient id="wishPlate" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="1" stop-color="#e9dbe3" />
      </linearGradient>
    </defs>
    <!-- Base plate -->
    <ellipse cx="165" cy="300" rx="140" ry="14" fill="rgba(110,70,95,.14)" />
    <ellipse cx="165" cy="288" rx="150" ry="20" fill="url(#wishPlate)" stroke="#e3d3dc" />
    
    <!-- Tier -->
    <rect x="40" y="180" width="250" height="104" rx="16" fill="url(#wishTier)" />
    <rect x="40" y="228" width="250" height="12" fill="#fff7fb" opacity=".9" />
    <ellipse cx="165" cy="282" rx="125" ry="10" fill="#e07fa7" opacity=".5" />
    
    <!-- Frosting drips and top icing -->
    <path d="${dripPath}" fill="#fff7fb" />
    <ellipse cx="165" cy="180" rx="125" ry="18" fill="#fff7fb" />
    
    <!-- Sprinkles -->
    ${sprinkles.map(s => `<rect x="${(s.x - 3.5).toFixed(1)}" y="${(s.y - 1.3).toFixed(1)}" width="7" height="2.6" rx="1.3" fill="${s.color}" transform="rotate(${s.angle} ${s.x} ${s.y})" />`).join('\n    ')}
    
    <!-- Cream puffs -->
    ${creamPuffs.map(c => `<ellipse cx="${c.x + 9}" cy="176" rx="9" ry="7" fill="${c.color}" opacity=".9" />`).join('\n    ')}
    
    <!-- 5 Candles -->
    ${candles.map((c, i) => `
    <g class="candle-group" data-candle="${i}">
      <!-- Wax body -->
      <rect x="${c.x - 6}" y="120" width="12" height="52" rx="4" fill="#fff" />
      <!-- Diagonal stripes -->
      <path d="M${c.x - 6} 126 l12 -7 v5 l-12 7z" fill="${c.color}" />
      <path d="M${c.x - 6} 137 l12 -7 v5 l-12 7z" fill="${c.color}" />
      <path d="M${c.x - 6} 148 l12 -7 v5 l-12 7z" fill="${c.color}" />
      <path d="M${c.x - 6} 159 l12 -7 v5 l-12 7z" fill="${c.color}" />
      <!-- Wick -->
      <rect x="${c.x - 1}" y="113" width="2" height="8" rx="1" fill="#6b5560" />
      
      <!-- Flames (visible when lit) -->
      <g class="candle-flame-wrap">
        <circle cx="${c.x}" cy="101" r="17" fill="url(#wishHalo)" />
        <g class="wish-flame" style="animation-delay: ${(-i * 0.37).toFixed(2)}s">
          <path d="M${c.x} 86 C ${c.x + 9} 98, ${c.x + 8} 111, ${c.x} 114 C ${c.x - 8} 111, ${c.x - 9} 98, ${c.x} 86 Z" fill="url(#wishFlame)" />
          <path d="M${c.x} 99 C ${c.x + 3.5} 105, ${c.x + 3} 111, ${c.x} 113 C ${c.x - 3} 111, ${c.x - 3.5} 105, ${c.x} 99 Z" fill="#fff6d6" />
        </g>
      </g>
      
      <!-- Smoke (visible when blown out) -->
      <path class="wish-smoke" d="M${c.x} 112 c-6 -10 6 -14 0 -24 c-6 -10 4 -16 2 -26" stroke="#b9aab4" stroke-width="2.4" fill="none" stroke-linecap="round" style="display:none;" />
    </g>`).join('\n')}
  </svg>
</div>`;

// Construct full index.html
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Happy Birthday Emma 🎂💗 — Vanvi Moments</title>
  <meta name="description" content="A playful, interactive birthday portal and experience handcrafted with love on Vanvi Moments.">
  <link rel="stylesheet" href="style.css">
  <style>
    /* Candle smoke toggle when blown out */
    .wish-cake.all-out .candle-flame-wrap {
      display: none !important;
    }
    .wish-cake.all-out .wish-smoke {
      display: block !important;
      animation: smokeRise 2.8s ease-out forwards;
    }
    @keyframes smokeRise {
      0% { opacity: 0.9; transform: translateY(0) scale(1); }
      50% { opacity: 0.6; transform: translateY(-8px) scale(1.1) skewX(4deg); }
      100% { opacity: 0; transform: translateY(-22px) scale(1.3) skewX(-6deg); }
    }
  </style>
</head>
<body>

  <!-- Floating brand badge -->
  <a href="../../index.html" class="vanvi-badge" title="Created on Vanvi Moments">
    <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
    <span>Vanvi Moments</span>
  </a>

  <!-- Audio elements -->
  <audio id="bg-music" src="assets/music.mp3" preload="auto" loop></audio>

  <!-- Interactive Experience Container -->
  <div class="tpl-birthday" id="birthday-experience">
    
    <!-- Background doodles -->
    <div class="background-doodles" aria-hidden="true">
      <span>♡</span>
      <span>✦</span>
      <span>☁</span>
      <span>✿</span>
      <span>⋆</span>
      <span>♡</span>
    </div>

    <!-- 1. VERIFICATION SCREEN -->
    <section class="screen active" data-screen="verification">
      <div class="card hero-card">
        <div class="sticker sticker-top">PRIVATE BIRTHDAY PORTAL 💌</div>
        <div class="cartoon-face floating">(˶ᵔ ᵕ ᵔ˶)</div>
        <p class="eyebrow">tiny security checkpoint</p>
        <h1>Hold Up 👀</h1>
        <p>This extremely serious website needs to verify one extremely serious detail.</p>
        <h2>Are you <span class="recipient-name">Emma</span>?</h2>
        <div class="buttons">
          <button type="button" class="primary-btn" id="btn-verify-yes">Yep, that’s me ✨</button>
          <button type="button" class="secondary-btn" id="btn-verify-no">Wrong person 😶</button>
        </div>
        <p class="tiny-note">Security system powered by vibes and one button.</p>
      </div>
    </section>

    <!-- 2. NO SCREEN (Wrong person) -->
    <section class="screen" data-screen="no">
      <div class="card compact-card">
        <div class="big-emoji">🕵️‍♀️</div>
        <h1>Hmm… suspicious.</h1>
        <p>This tiny corner was made only for <strong class="recipient-name">Emma</strong>.</p>
        <p>The guards are adorable, but surprisingly strict. 🐰</p>
        <button type="button" class="secondary-btn" id="btn-try-again">Try Again ↩</button>
      </div>
    </section>

    <!-- 3. INTRO SCREEN -->
    <section class="screen" data-screen="intro">
      <div class="split-layout">
        <div class="polaroid rotate-left">
          <div class="cartoon-scene pink-scene">
            <div class="cloud cloud-one">☁</div>
            <div class="cloud cloud-two">☁</div>
            <div class="bunny-character">
              <div class="bunny-ears">ᕱ ᕱ</div>
              <div class="bunny-face">•ᴗ•</div>
            </div>
            <div class="mini-heart">♡</div>
            <small>birthday department mascot</small>
          </div>
          <div class="polaroid-caption">officially verified ✨</div>
        </div>
        <div class="paper-card rotate-right">
          <span class="tape"></span>
          <p class="handwritten-small">access granted 🌷</p>
          <h1 class="handwritten-title">Hi <span class="recipient-name">Emma</span>!</h1>
          <p>Welcome to a tiny birthday universe built with unnecessary effort, questionable design decisions, and very serious levels of pink.</p>
          <p>No instructions. Just click things, enjoy the nonsense, and pretend this website passed quality testing. 😂</p>
          <button type="button" class="primary-btn" id="btn-intro-enter">Enter ✨</button>
        </div>
      </div>
    </section>

    <!-- 4. BIRTHDAY TITLE SCREEN -->
    <section class="screen" data-screen="birthday">
      <div class="birthday-wrap">
        <div class="birthday-copy paper-card">
          <span class="sparkle">✦</span>
          <p class="eyebrow">breaking birthday news</p>
          <h1 class="mega-title">Happy Birthday</h1>
          <h2><span class="recipient-name">Emma</span> 🎂💗</h2>
          <p>Today’s forecast: 100% chance of cake, random compliments, dramatic decorations, and absolutely no responsibility for unnecessary calories.</p>
          <button type="button" class="primary-btn" id="btn-birthday-continue">Continue →</button>
        </div>
        <div class="character-stack">
          <div class="bubble-card bubble-one">👑<span>main character day</span></div>
          <div class="bubble-card bubble-two">🧁<span>cake tax = zero</span></div>
          <div class="bubble-card bubble-three">✨<span>sparkle permit active</span></div>
        </div>
      </div>
    </section>

    <!-- 5. FOUR LITTLE NOTES SCREEN -->
    <section class="screen" data-screen="notes">
      <div class="notes-mailbox-section">
        <p class="eyebrow">four tiny stickers for you</p>
        <h1 class="handwritten-title">Four Little Notes 💌</h1>
        <p class="section-subtitle">No predictions, no rules — just four small things I wanted to leave here.</p>
        <p class="notes-hint">tap a sticker to flip it ✨</p>
        
        <div class="notes-flip-grid" aria-label="Four little birthday notes">
          
          <!-- Note 1 -->
          <div class="flip-card" role="button" tabindex="0" data-note-index="0" aria-label="Little note 1">
            <div class="flip-inner">
              <div class="flip-face flip-front pastel-pink">
                <div class="card-emoji">♡</div>
                <b>Little Note 01</b>
                <small>tap to flip</small>
              </div>
              <div class="flip-face flip-back">
                <span class="flip-note-number">note 01 / 04</span>
                <p class="note-flip-text" id="note-text-0">Some people slowly become important without you even noticing when it happened. You're definitely one of those people. ❤️</p>
              </div>
            </div>
          </div>

          <!-- Note 2 -->
          <div class="flip-card" role="button" tabindex="0" data-note-index="1" aria-label="Little note 2">
            <div class="flip-inner">
              <div class="flip-face flip-front pastel-yellow">
                <div class="card-emoji">✦</div>
                <b>Little Note 02</b>
                <small>tap to flip</small>
              </div>
              <div class="flip-face flip-back">
                <span class="flip-note-number">note 02 / 04</span>
                <p class="note-flip-text" id="note-text-1">I hope this year gives you plenty of moments that make you genuinely happy — even the little ones you never planned for. ✨</p>
              </div>
            </div>
          </div>

          <!-- Note 3 -->
          <div class="flip-card" role="button" tabindex="0" data-note-index="2" aria-label="Little note 3">
            <div class="flip-inner">
              <div class="flip-face flip-front pastel-lilac">
                <div class="card-emoji">🌷</div>
                <b>Little Note 03</b>
                <small>tap to flip</small>
              </div>
              <div class="flip-face flip-back">
                <span class="flip-note-number">note 03 / 04</span>
                <p class="note-flip-text" id="note-text-2">You have a genuinely good heart, and I hope life keeps giving you people and moments that deserve that side of you. 🌷</p>
              </div>
            </div>
          </div>

          <!-- Note 4 -->
          <div class="flip-card" role="button" tabindex="0" data-note-index="3" aria-label="Little note 4">
            <div class="flip-inner">
              <div class="flip-face flip-front pastel-mint">
                <div class="card-emoji">☁</div>
                <b>Little Note 04</b>
                <small>tap to flip</small>
              </div>
              <div class="flip-face flip-back">
                <span class="flip-note-number">note 04 / 04</span>
                <p class="note-flip-text" id="note-text-3">Here's to more good conversations, silly memories, unexpected laughs, and many more stories worth remembering. 😂❤️</p>
              </div>
            </div>
          </div>

        </div>

        <button type="button" class="primary-btn" id="btn-notes-continue">Continue →</button>
      </div>
    </section>

    <!-- 6. BALLOONS GAME SCREEN -->
    <section class="screen" data-screen="balloons">
      <div class="balloon-layout">
        <div class="paper-card balloon-copy rotate-left">
          <span class="tape"></span>
          <p class="eyebrow">tiny birthday mini-game</p>
          <h1 class="handwritten-title">Pop! Pop! Pop! 🎈</h1>
          <p>There are five balloons causing unnecessary drama. Please deal with the situation.</p>
          <p class="status-text" id="balloon-status">Balloons remaining: 5</p>
          <button type="button" class="primary-btn" id="btn-balloons-continue" style="display:none;">Continue →</button>
        </div>
        <div class="balloon-stage" aria-label="Balloon popping game">
          <button type="button" class="balloon balloon-one" data-balloon="0" aria-label="Pop pink balloon"><span>♡</span></button>
          <button type="button" class="balloon balloon-two" data-balloon="1" aria-label="Pop yellow balloon"><span>✦</span></button>
          <button type="button" class="balloon balloon-three" data-balloon="2" aria-label="Pop purple balloon"><span>☁</span></button>
          <button type="button" class="balloon balloon-four" data-balloon="3" aria-label="Pop mint balloon"><span>✿</span></button>
          <button type="button" class="balloon balloon-five" data-balloon="4" aria-label="Pop peach balloon"><span>★</span></button>
          <div class="balloon-pop-text" id="balloon-pop-comment">tap the balloons ✨</div>
        </div>
      </div>
    </section>

    <!-- 7. LAUGH METER SCREEN -->
    <section class="screen" data-screen="laugh">
      <div class="laugh-layout">
        <div class="paper-card laugh-copy rotate-left">
          <span class="tape"></span>
          <p class="eyebrow">highly scientific experiment</p>
          <h1 class="handwritten-title">Laugh Meter 😂</h1>
          <p>This machine has one job: check whether your birthday mood is functioning properly.</p>
          <p class="tiny-note">Accuracy: questionable. Confidence: unnecessarily high.</p>
          
          <div class="laugh-meter-box">
            <div class="laugh-score-row">
              <span>Mood reading</span>
              <strong id="laugh-score-val">0%</strong>
            </div>
            <div class="laugh-track" aria-label="Laugh meter">
              <div class="laugh-fill" id="laugh-track-fill" style="width: 0%;"></div>
            </div>
            <p class="laugh-status" id="laugh-status-text">Current diagnosis: suspiciously serious. 👀</p>
          </div>

          <button type="button" class="primary-btn" id="btn-laugh-action">Press for Better Mood 😂</button>
        </div>

        <div class="laugh-machine" aria-live="polite">
          <div class="machine-antenna"><span></span></div>
          <div class="machine-body">
            <div class="machine-label">MOOD-O-METER</div>
            <div class="laugh-face" id="machine-face">😐</div>
            <div class="machine-lights"><i></i><i></i><i></i></div>
            <div class="machine-printout" id="machine-printout">waiting for a smile...</div>
          </div>
          <div class="machine-shadow"></div>
        </div>
      </div>
    </section>

    <!-- 8. PHOTO ALBUM SCREEN -->
    <section class="screen" data-screen="album">
      <div class="album-section">
        <p class="eyebrow">extremely rare photographic evidence</p>
        <h1 class="handwritten-title">The Very Serious Photo Album 📸</h1>
        <p class="section-subtitle">The photo department had limited resources, so Instagram has officially been promoted to chief photographer. 😂</p>
        
        <div class="album-grid" id="album-grid">
          <!-- 5 tilted polaroids -->
          <figure class="album-card album-tilt-one" data-photo-index="0">
            <span class="album-tape"></span>
            <div class="album-image-wrap">
              <img src="assets/photo1.jpg" alt="Album photo 1">
              <div class="album-fallback">📷</div>
            </div>
          </figure>

          <figure class="album-card album-tilt-two" data-photo-index="1">
            <span class="album-tape"></span>
            <div class="album-image-wrap">
              <img src="assets/photo2.jpg" alt="Album photo 2">
              <div class="album-fallback">🕵️‍♀️</div>
            </div>
          </figure>

          <figure class="album-card album-tilt-three" data-photo-index="2">
            <span class="album-tape"></span>
            <div class="album-image-wrap">
              <img src="assets/photo3.jpg" alt="Album photo 3">
              <div class="album-fallback">✨</div>
            </div>
          </figure>

          <figure class="album-card album-tilt-four" data-photo-index="3">
            <span class="album-tape"></span>
            <div class="album-image-wrap">
              <img src="assets/photo4.jpg" alt="Album photo 4">
              <div class="album-fallback">🔎</div>
            </div>
          </figure>

          <figure class="album-card album-featured" data-photo-index="4">
            <span class="album-tape"></span>
            <div class="album-image-wrap">
              <img src="assets/photo5.jpg" alt="Album photo 5">
              <div class="album-fallback">🏆</div>
            </div>
          </figure>
        </div>

        <p class="album-hint">Tap any photo for a completely unnecessary museum spotlight ✨</p>
        <button type="button" class="primary-btn" id="btn-album-continue">Continue →</button>
      </div>
    </section>

    <!-- 9. CAKE & CANDLES SCREEN -->
    <section class="screen" data-screen="cake">
      <div class="cake-layout">
        ${cakeSvg}
        <div class="paper-card cake-copy rotate-right">
          <span class="tape"></span>
          <p class="eyebrow">mandatory ceremony</p>
          <h1 class="handwritten-title">Make a Wish</h1>
          <p>Take a second, make a proper wish, and click the button when you’re done. The internet has agreed not to ask what you wished for. 😌</p>
          <button type="button" class="primary-btn" id="btn-cake-blow">Blow the Candles 🎂</button>
          <button type="button" class="primary-btn" id="btn-cake-continue" style="display:none;">Continue ✨</button>
        </div>
      </div>
    </section>

    <!-- 10. HEARTFELT LETTER SCREEN -->
    <section class="screen letter-screen" data-screen="message">
      <div class="letter-shell">
        <div class="letter-topbar">
          <span>💌 for <strong class="recipient-name">Emma</strong></span>
          <span>from <strong class="sender-name">Rahul</strong></span>
        </div>
        <article class="letter-paper">
          <div class="corner-sticker">♡</div>
          <div class="letter-lines" id="letter-lines">
            <!-- paragraphs inserted dynamically -->
          </div>
          <p class="signature" id="letter-signature">— Rahul 🙂</p>
          
          <div class="bday-react" data-testid="birthday-reactions">
            <p class="bday-react-title">How did this make you feel?</p>
            <div class="bday-react-row">
              <button type="button" class="react-chip" data-reaction="loved"><span aria-hidden="true">🥹</span> Loved it</button>
              <button type="button" class="react-chip" data-reaction="tears"><span aria-hidden="true">😭</span> Happy tears</button>
              <button type="button" class="react-chip" data-reaction="thanks"><span aria-hidden="true">🤗</span> Thank you so much</button>
              <button type="button" class="react-chip" data-reaction="best"><span aria-hidden="true">🎉</span> Best surprise ever</button>
            </div>
            <p class="bday-react-thanks" id="react-thanks" style="display:none;"></p>
          </div>

          <div class="letter-actions">
            <button type="button" class="secondary-btn" id="btn-see-again">See It Again ↻</button>
          </div>
        </article>
      </div>
    </section>

    <!-- Music toggle button -->
    <button type="button" class="music-control" id="music-btn" style="display:none;" aria-label="Pause or play birthday music">🔊 Music</button>

    <!-- Confetti canvas overlay -->
    <canvas id="confetti-canvas" class="confetti-canvas"></canvas>

    <!-- Toast message -->
    <div id="toast" class="toast" aria-live="polite"></div>

  </div>

  <script src="script.js"></script>
</body>
</html>
`;

fs.writeFileSync('templates/Hey Birthday/index.html', indexHtml, 'utf8');
console.log('Saved templates/Hey Birthday/index.html, bytes:', fs.statSync('templates/Hey Birthday/index.html').size);
