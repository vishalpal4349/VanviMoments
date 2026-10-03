const fs = require('fs');
const path = require('path');

const gamesPath = path.join(__dirname, '..', 'games.html');
let content = fs.readFileSync(gamesPath, 'utf8');

// Replace Filter Tabs to reflect celebration categories
const oldTabsRegex = /<nav class="games-filter-nav" id="gamesFilterNav">[\s\S]*?<\/nav>/;
const newTabs = `<nav class="games-filter-nav" id="gamesFilterNav">
    <button type="button" class="game-tab-btn active" data-filter="all">🌟 All Celebration Games</button>
    <button type="button" class="game-tab-btn" data-filter="love">💖 Hearts &amp; Romance</button>
    <button type="button" class="game-tab-btn" data-filter="puzzle">🧩 Memory &amp; Puzzles</button>
    <button type="button" class="game-tab-btn" data-filter="reflex">⚡ Speed &amp; Reflex</button>
  </nav>`;
content = content.replace(oldTabsRegex, newTabs);

// Replace the games list inside <main class="games-master-grid" ...> ... </main>
const oldGridRegex = /<main class="games-master-grid" id="gamesGrid">[\s\S]*?<\/main>/;

const newGrid = `<main class="games-master-grid" id="gamesGrid">

    <!-- 1. Hidden Hearts (Search Hearts Game) -->
    <article class="game-card" data-cat="love" id="cardHiddenHearts">
      <div class="game-card-top">
        <div class="game-icon-box" style="background:linear-gradient(135deg, #fff0f6, #ffe4ee); font-size:24px;">🔍</div>
        <div class="game-info">
          <div class="game-title-row">
            <h3 class="game-title">Hidden Hearts · Search &amp; Find</h3>
            <span class="game-rating-tag">★ 5.0 (Top Pick)</span>
          </div>
          <div class="game-desc">Search and discover glowing celestial hearts hidden within romantic constellation scenes before the timer expires!</div>
          <div class="reward-tags-row">
            <span class="coin-tag">🪙 Up to +12 Coins</span>
            <span class="reward-tag">💖 Search &amp; Catch</span>
          </div>
        </div>
      </div>
      <div style="background:#fff9fb; border-radius:12px; padding:8px 12px; font-size:11px; color:#78536d; border:1px solid rgba(255,120,175,0.2); display:flex; align-items:center; gap:8px;">
        <span>🎮 <strong>Rules &amp; Controls:</strong> Tap or Click hidden hearts on screen. ⌨️ Mouse / Trackpad · 📱 Touch friendly.</span>
      </div>
      <div class="game-card-footer">
        <span class="game-difficulty-label">Visual Observation · Beat Timer</span>
        <a href="hidden-hearts.html" class="btn-play">Search Hearts →</a>
      </div>
    </article>

    <!-- 2. Heart Rain (Catch Falling Hearts) -->
    <article class="game-card" data-cat="love" id="cardHeartRain">
      <div class="game-card-top">
        <div class="game-icon-box" style="background:linear-gradient(135deg, #fdf2f8, #fce7f3); font-size:24px;">🌧️</div>
        <div class="game-info">
          <div class="game-title-row">
            <h3 class="game-title">Heart Rain · Love Basket</h3>
            <span class="game-rating-tag">★ 4.9 (Reflex)</span>
          </div>
          <div class="game-desc">Catch sparkling falling love hearts and celebration tokens in your basket while dodging tricky obstacles.</div>
          <div class="reward-tags-row">
            <span class="coin-tag">🪙 Up to +10 Coins</span>
            <span class="reward-tag">✨ Falling Combo</span>
          </div>
        </div>
      </div>
      <div style="background:#fff9fb; border-radius:12px; padding:8px 12px; font-size:11px; color:#78536d; border:1px solid rgba(255,120,175,0.2); display:flex; align-items:center; gap:8px;">
        <span>🎮 <strong>Rules &amp; Controls:</strong> Catch glowing hearts! ⌨️ Left/Right Arrow Keys or A/D · 📱 Drag / Touch.</span>
      </div>
      <div class="game-card-footer">
        <span class="game-difficulty-label">Arcade Rhythm · 30 Seconds</span>
        <a href="heart-rain.html" class="btn-play">Catch Hearts →</a>
      </div>
    </article>

    <!-- 3. Love Jigsaw Puzzle -->
    <article class="game-card" data-cat="puzzle" id="cardLovePuzzle">
      <div class="game-card-top">
        <div class="game-icon-box" style="background:linear-gradient(135deg, #fff0f5, #fce7f3); font-size:24px;">🧩</div>
        <div class="game-info">
          <div class="game-title-row">
            <h3 class="game-title">Love Jigsaw &amp; Sliding Puzzle</h3>
            <span class="game-rating-tag">★ 4.9 (Creative)</span>
          </div>
          <div class="game-desc">Piece together romantic keepsake art and cherished memory moments in clean, soothing sliding tiles.</div>
          <div class="reward-tags-row">
            <span class="coin-tag">🪙 +10 Coins</span>
            <span class="reward-tag">🎨 Keepsake Art</span>
          </div>
        </div>
      </div>
      <div style="background:#fff9fb; border-radius:12px; padding:8px 12px; font-size:11px; color:#78536d; border:1px solid rgba(255,120,175,0.2); display:flex; align-items:center; gap:8px;">
        <span>🎮 <strong>Rules &amp; Controls:</strong> Reorder tiles into place. ⌨️ Arrow Keys / Click · 📱 Swipe or Tap tiles.</span>
      </div>
      <div class="game-card-footer">
        <span class="game-difficulty-label">Puzzle Strategy · Relaxing</span>
        <a href="love-puzzle.html" class="btn-play">Solve Puzzle →</a>
      </div>
    </article>

    <!-- 4. Word Whisper Love Anagrams -->
    <article class="game-card" data-cat="puzzle" id="cardWordWhisper">
      <div class="game-card-top">
        <div class="game-icon-box" style="background:linear-gradient(135deg, #fefce8, #fef08a); font-size:24px;">💌</div>
        <div class="game-info">
          <div class="game-title-row">
            <h3 class="game-title">Word Whisper · Love Letters</h3>
            <span class="game-rating-tag">★ 4.9 (Vocabulary)</span>
          </div>
          <div class="game-desc">Unscramble heartfelt romantic terms, anniversary keywords, and celebration anagrams with helpful hints.</div>
          <div class="reward-tags-row">
            <span class="coin-tag">🪙 +8 Coins</span>
            <span class="reward-tag">📖 Word Vault</span>
          </div>
        </div>
      </div>
      <div style="background:#fff9fb; border-radius:12px; padding:8px 12px; font-size:11px; color:#78536d; border:1px solid rgba(255,120,175,0.2); display:flex; align-items:center; gap:8px;">
        <span>🎮 <strong>Rules &amp; Controls:</strong> Spell correct celebration words. ⌨️ Keyboard Typing · 📱 Tap letters.</span>
      </div>
      <div class="game-card-footer">
        <span class="game-difficulty-label">Love Vocabulary · 5 Words</span>
        <a href="word-whisper.html" class="btn-play">Play Words →</a>
      </div>
    </article>

    <!-- 5. Memory Bloom & Match -->
    <article class="game-card" data-cat="puzzle" id="cardMemoryRush">
      <div class="game-card-top">
        <div class="game-icon-box" style="background:linear-gradient(135deg, #fff0f6, #ffe4ee); font-size:24px;">🌸</div>
        <div class="game-info">
          <div class="game-title-row">
            <h3 class="game-title">Memory Bloom &amp; Match</h3>
            <span class="game-rating-tag">★ 4.9 (Recall)</span>
          </div>
          <div class="game-desc">Perfect Match memory challenge. Flip celebration cards, find matching pairs, and clear the board before time runs out!</div>
          <div class="reward-tags-row">
            <span class="coin-tag">🪙 2–10 Coins</span>
            <span class="reward-tag">⚡ 4 Difficulties</span>
          </div>
        </div>
      </div>
      <div style="background:#fff9fb; border-radius:12px; padding:8px 12px; font-size:11px; color:#78536d; border:1px solid rgba(255,120,175,0.2); display:flex; align-items:center; gap:8px;">
        <span>🎮 <strong>Rules &amp; Controls:</strong> Flip two matching cards in sequence. ⌨️ Click · 📱 Tap card pairs.</span>
      </div>
      <div class="game-card-footer">
        <span class="game-difficulty-label">Time Attack · Memory Recall</span>
        <a href="memory-rush.html" class="btn-play">Play Match →</a>
      </div>
    </article>

    <!-- 6. Quick Tap Candle Reaction -->
    <article class="game-card" data-cat="reflex" id="cardQuickTap">
      <div class="game-card-top">
        <div class="game-icon-box" style="background:linear-gradient(135deg, #fefce8, #fef08a); font-size:24px;">🕯️</div>
        <div class="game-info">
          <div class="game-title-row">
            <h3 class="game-title">Quick Tap &amp; Candle Blow</h3>
            <span class="game-rating-tag">★ 4.9 (Speed Trial)</span>
          </div>
          <div class="game-desc">Test your reflex speed in milliseconds! Tap or click the moment celebration flame blooms green to make your wish.</div>
          <div class="reward-tags-row">
            <span class="coin-tag">🪙 2–10 Coins</span>
            <span class="reward-tag">⚡ Sub-200ms Trial</span>
          </div>
        </div>
      </div>
      <div style="background:#fff9fb; border-radius:12px; padding:8px 12px; font-size:11px; color:#78536d; border:1px solid rgba(255,120,175,0.2); display:flex; align-items:center; gap:8px;">
        <span>🎮 <strong>Rules &amp; Controls:</strong> Tap instantly when green! ⌨️ Spacebar or Click · 📱 Screen Tap.</span>
      </div>
      <div class="game-card-footer">
        <span class="game-difficulty-label">Precision Speed · 5 Rounds</span>
        <a href="quick-tap.html" class="btn-play">Test Reflex →</a>
      </div>
    </article>

    <!-- 7. Risk Run Precision Reflex -->
    <article class="game-card" data-cat="reflex" id="cardRiskRun">
      <div class="game-card-top">
        <div class="game-icon-box" style="background:linear-gradient(135deg, #fff7ed, #ffedd5); font-size:24px;">⚡</div>
        <div class="game-info">
          <div class="game-title-row">
            <h3 class="game-title">Risk Run · Precision Reflex</h3>
            <span class="game-rating-tag">★ 4.9 (High Skill)</span>
          </div>
          <div class="game-desc">High-stakes timing challenge. Tap with laser precision, build your streak multiplier, and protect your streak shield!</div>
          <div class="reward-tags-row">
            <span class="coin-tag">🪙 Up to +12 Coins</span>
            <span class="reward-tag">🛡️ Streak Shield</span>
          </div>
        </div>
      </div>
      <div style="background:#fff9fb; border-radius:12px; padding:8px 12px; font-size:11px; color:#78536d; border:1px solid rgba(255,120,175,0.2); display:flex; align-items:center; gap:8px;">
        <span>🎮 <strong>Rules &amp; Controls:</strong> Hit target in green zone. ⌨️ Spacebar or Click · 📱 Tap screen.</span>
      </div>
      <div class="game-card-footer">
        <span class="game-difficulty-label">Safe / Pro / Expert Tiers</span>
        <a href="risk-run.html" class="btn-play">Play Risk Run →</a>
      </div>
    </article>

    <!-- 8. Mystery Gift Box Unlock -->
    <article class="game-card" data-cat="puzzle" id="cardUnlockGift">
      <div class="game-card-top">
        <div class="game-icon-box" style="background:linear-gradient(135deg, #faf5ff, #f3e8ff); font-size:24px;">🎁</div>
        <div class="game-info">
          <div class="game-title-row">
            <h3 class="game-title">Mystery Gift Box Unboxing</h3>
            <span class="game-rating-tag">★ 4.9 (Surprise)</span>
          </div>
          <div class="game-desc">Crack the romantic 3-digit combination lock with subtle clues to open your prize box and unlock bonus coins!</div>
          <div class="reward-tags-row">
            <span class="coin-tag">🪙 +15 Coins</span>
            <span class="reward-tag">🔓 Code Vault</span>
          </div>
        </div>
      </div>
      <div style="background:#fff9fb; border-radius:12px; padding:8px 12px; font-size:11px; color:#78536d; border:1px solid rgba(255,120,175,0.2); display:flex; align-items:center; gap:8px;">
        <span>🎮 <strong>Rules &amp; Controls:</strong> Enter 3-digit code from clues. ⌨️ Number keys / Click · 📱 Keypad tap.</span>
      </div>
      <div class="game-card-footer">
        <span class="game-difficulty-label">Code Deduction · Daily Mystery</span>
        <a href="unlock-gift.html" class="btn-play">Open Gift Box →</a>
      </div>
    </article>

    <!-- 9. Gem Catch Arcade -->
    <article class="game-card" data-cat="reflex" id="cardGemCatch">
      <div class="game-card-top">
        <div class="game-icon-box" style="background:linear-gradient(135deg, #ecfdf5, #d1fae5); font-size:24px;">💎</div>
        <div class="game-info">
          <div class="game-title-row">
            <h3 class="game-title">Gem Catch Arcade</h3>
            <span class="game-rating-tag">★ 4.9 (Smooth 60fps)</span>
          </div>
          <div class="game-desc">Catch sparkling celebration diamonds and golden stars while dodging obsidian rocks in fast 60fps arcade rhythm!</div>
          <div class="reward-tags-row">
            <span class="coin-tag">🪙 4–10 Coins</span>
            <span class="reward-tag">⚡ Combo Multipliers</span>
          </div>
        </div>
      </div>
      <div style="background:#fff9fb; border-radius:12px; padding:8px 12px; font-size:11px; color:#78536d; border:1px solid rgba(255,120,175,0.2); display:flex; align-items:center; gap:8px;">
        <span>🎮 <strong>Rules &amp; Controls:</strong> Steer left/right to catch gems. ⌨️ Left/Right Arrow Keys · 📱 Touch &amp; Drag.</span>
      </div>
      <div class="game-card-footer">
        <span class="game-difficulty-label">Arcade Rhythm · Quick Play</span>
        <a href="gem-catch.html" class="btn-play">Catch Gems →</a>
      </div>
    </article>

    <!-- 10. Sound & Sequence Memory -->
    <article class="game-card" data-cat="reflex" id="cardMemorySequence">
      <div class="game-card-top">
        <div class="game-icon-box" style="background:linear-gradient(135deg, #f0fdf4, #dcfce7); font-size:24px;">🎵</div>
        <div class="game-info">
          <div class="game-title-row">
            <h3 class="game-title">Sound &amp; Sequence Chimes</h3>
            <span class="game-rating-tag">★ 4.9 (Melody)</span>
          </div>
          <div class="game-desc">Watch, remember, and replay romantic melody sequences. How high of a musical melody streak can you master?</div>
          <div class="reward-tags-row">
            <span class="coin-tag">🪙 3–10 Coins</span>
            <span class="reward-tag">🎶 Chime Rhythms</span>
          </div>
        </div>
      </div>
      <div style="background:#fff9fb; border-radius:12px; padding:8px 12px; font-size:11px; color:#78536d; border:1px solid rgba(255,120,175,0.2); display:flex; align-items:center; gap:8px;">
        <span>🎮 <strong>Rules &amp; Controls:</strong> Replay musical lights in order. ⌨️ Number Keys 1–4 or Click · 📱 Tap chimes.</span>
      </div>
      <div class="game-card-footer">
        <span class="game-difficulty-label">Sequential Recall · Streaks</span>
        <a href="memory-sequence.html" class="btn-play">Play Sequence →</a>
      </div>
    </article>

  </main>`;

content = content.replace(oldGridRegex, newGrid);

fs.writeFileSync(gamesPath, content, 'utf8');
console.log('✓ Successfully upgraded games.html with pure celebration games, Search Hearts, and keyboard+touch rules!');
