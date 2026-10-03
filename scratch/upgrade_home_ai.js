const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add CSS for ai-interactive-textarea
const extraCss = `
.ai-interactive-textarea {
  width: 100%;
  padding: 13px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.95);
  border: 1.5px solid rgba(255, 120, 175, 0.35);
  font-family: inherit;
  font-size: 13.5px;
  color: #2c1224;
  line-height: 1.55;
  outline: none;
  resize: vertical;
  min-height: 80px;
  box-shadow: 0 4px 14px rgba(255, 120, 175, 0.08), inset 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.25s ease;
  box-sizing: border-box;
}
.ai-interactive-textarea:focus {
  border-color: #ff2a7a;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(255, 42, 122, 0.15), 0 6px 18px rgba(255, 42, 122, 0.12);
}
.ai-interactive-textarea::placeholder {
  color: #a68b9e;
  font-style: italic;
  font-size: 12.5px;
}
.ai.glass .pill {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}
.ai.glass .pill:hover {
  border-color: #ff2a7a;
  color: #ff2a7a;
  transform: translateY(-1px);
}
.ai.glass .pill.active {
  background: linear-gradient(135deg, #ff2a7a, #ec4899) !important;
  color: #ffffff !important;
  border-color: transparent !important;
  box-shadow: 0 4px 14px rgba(255, 42, 122, 0.3) !important;
  font-weight: 850 !important;
}
`;

content = content.replace(
  /\.ai-box:before\{content:"“";font-size:26px;color:#e783ac;vertical-align:-6px;margin-right:5px\}/,
  `.ai-box:before{content:"“";font-size:26px;color:#e783ac;vertical-align:-6px;margin-right:5px}\n${extraCss.trim()}`
);

// 2. Replace HTML section
const oldAiSection = `<section class="section scroll-animate" data-stagger-delay="1.3s">
<div class="ai glass premium-ai-panel">
<div class="eyebrow">Your creative co-pilot</div>
<h3>🤖 Vanvi AI</h3>
<p style="font-size:13px;color:#796377;margin-top:7px">Tell us the story, occasion, mood, and we’ll suggest the right template vibe.</p>
<div aria-label="Tell Vanvi AI what you want to create" class="ai-box" contenteditable="true" data-placeholder="Tell Vanvi what you want to create…" role="textbox">Make it feel romantic, cinematic and elegant for my anniversary with a soft purple mood.</div>
<div class="pills"><span class="pill" style="cursor:pointer;">🎂 Birthday</span><span class="pill" style="cursor:pointer;">❤️ Love</span><span class="pill" style="cursor:pointer;">🎬 Cinematic</span><span class="pill" style="cursor:pointer;">💎 VIP</span></div>
<a href="ai-matcher.html" class="primary" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center;">✨ Generate My Experience</a>
</div>
</section>`;

const newAiSection = `<section class="section scroll-animate" data-stagger-delay="1.3s">
<div class="ai glass premium-ai-panel">
  <div class="eyebrow" style="color:var(--rose-primary, #ff2a7a); font-weight:850; letter-spacing:1px; text-transform:uppercase; font-size:11px;">✦ Your Creative Co-Pilot</div>
  <h3 style="font-family:'Cormorant Garamond', Georgia, serif; font-size:28px; margin:4px 0 6px;">🤖 Vanvi AI Studio</h3>
  <p style="font-size:13px; color:#796377; max-width:540px; margin:0 auto 14px; line-height:1.45;">Tell us the story, occasion, mood, or feeling, and our neural engine matches the exact bespoke experience.</p>
  
  <!-- Interactive Prompt Console -->
  <div class="ai-input-console" style="position:relative; margin-bottom:12px; text-align:left;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; padding:0 4px;">
      <span style="font-size:11px; font-weight:800; color:#88627b; text-transform:uppercase; letter-spacing:0.5px;">✨ Describe Your Dream Surprise</span>
      <div style="display:flex; align-items:center; gap:8px;">
        <button type="button" id="btnTryDemoPrompt" style="background:rgba(255,42,122,0.08); border:1px solid rgba(255,42,122,0.25); color:#e11d68; border-radius:99px; font-size:11px; font-weight:800; padding:3px 11px; cursor:pointer; display:inline-flex; align-items:center; gap:4px; transition:all 0.2s;">
          <span>🪄 Try Demo Prompt</span>
        </button>
        <button type="button" id="btnClearPrompt" style="background:none; border:none; color:#a68b9e; font-size:11px; font-weight:700; cursor:pointer; display:none;">✕ Clear</button>
      </div>
    </div>

    <div style="position:relative;">
      <textarea id="homeAiPromptInput" class="ai-interactive-textarea" rows="3" placeholder="Type what you want to create... (e.g. Make it feel romantic, cinematic and elegant for my anniversary with a soft purple mood)"></textarea>
    </div>
  </div>

  <!-- Occasion / Mood Quick Pills -->
  <div class="pills" id="homeAiPills" style="justify-content:center; margin-bottom:14px; gap:8px;">
    <span class="pill" data-occasion="birthday" data-demo="A joyful 21st birthday surprise with 3D candles to blow, confetti fireworks, and memory reels.">🎂 Birthday</span>
    <span class="pill" data-occasion="love" data-demo="Deeply romantic candlelit love letter with soft piano music, heartfelt confessions, and secret photos.">❤️ Love &amp; Romance</span>
    <span class="pill" data-occasion="anniversary" data-demo="Make it feel romantic, cinematic and elegant for my anniversary with a soft purple mood.">💍 Anniversary</span>
    <span class="pill" data-occasion="friendship" data-demo="Crazy fun best friend recap with swipeable polaroids, inside jokes, and party tunes.">👥 Friendship</span>
    <span class="pill" data-occasion="cinematic" data-demo="Cinematic 24K gold celebration moment with slow dramatic reveal, orchestral soundtrack, and wax seal.">🎬 Cinematic</span>
    <span class="pill" data-occasion="vip" data-demo="Ultra-exclusive VIP surprise with secret passcode lock, gold foil animations, and bespoke vows.">💎 VIP Atelier</span>
  </div>

  <!-- Primary Trigger Button -->
  <a href="ai-matcher.html" id="btnGenerateAiExperience" class="primary" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:8px; font-weight:850; padding:12px 28px; border-radius:99px; box-shadow:0 6px 20px rgba(255,42,122,0.35); cursor:pointer;">
    <span>✨ Generate My Experience</span>
  </a>
</div>
</section>`;

content = content.replace(oldAiSection, newAiSection);

// 3. Replace JS logic for AI section
const oldJsLogic = `  /* 8. AI Prompt Box */
  document.querySelectorAll('.ai.glass .ai-box').forEach(box => {
    box.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const prompt = box.textContent.trim();
        window.location.href = 'ai.html?prompt=' + encodeURIComponent(prompt || 'Create a beautiful moment');
      }
    });
  });

  document.querySelectorAll('.ai.glass .primary').forEach(btn => {
    btn.addEventListener('click', () => {
      const box = btn.closest('.ai')?.querySelector('.ai-box');
      const prompt = box?.textContent?.trim() || 'Create a beautiful moment';
      window.location.href = 'ai.html?prompt=' + encodeURIComponent(prompt);
    });
  });

  document.querySelectorAll('.ai.glass .pills .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const box = pill.closest('.ai')?.querySelector('.ai-box');
      const text = pill.textContent.replace(/[^\\w\\s]/gi, '').trim().toLowerCase();
      if (box) {
        if (text.includes('birthday')) {
          box.textContent = 'Create a sweet, heartfelt birthday surprise with music and photo memories.';
        } else if (text.includes('love')) {
          box.textContent = 'Write a deeply emotional and romantic love letter celebrating our special journey.';
        } else if (text.includes('cinematic')) {
          box.textContent = 'A cinematic luxury celebration moment with slow reveal transitions and music.';
        } else if (text.includes('vip')) {
          box.textContent = 'An ultra-exclusive gold and velvet VIP celebration with secret passcode.';
        }
        document.querySelectorAll('.ai.glass .pills .pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      }
    });
  });`;

const newJsLogic = `  /* 8. Home AI Studio Interactive Prompt Console */
  const homeAiInput = document.getElementById('homeAiPromptInput');
  const btnTryDemo = document.getElementById('btnTryDemoPrompt');
  const btnClearPrompt = document.getElementById('btnClearPrompt');
  const btnGenerateAi = document.getElementById('btnGenerateAiExperience');
  const homeAiPills = document.querySelectorAll('#homeAiPills .pill, .ai.glass .pills .pill');

  const demoPrompts = [
    "Make it feel romantic, cinematic and elegant for my anniversary with a soft purple mood.",
    "A joyful 21st birthday surprise with 3D candles to blow, confetti fireworks, and photo memory reels.",
    "Deeply romantic candlelit love letter with soft piano music, heartfelt confessions, and secret photos.",
    "Crazy fun best friend recap with swipeable polaroids, inside jokes, and party tunes.",
    "Sincere and emotional apology letter to heal our misunderstanding with gentle melodies.",
    "Ultra-exclusive VIP surprise with secret passcode lock, gold foil animations, and bespoke vows."
  ];
  let demoIdx = 0;

  if (homeAiInput) {
    homeAiInput.addEventListener('input', () => {
      if (btnClearPrompt) btnClearPrompt.style.display = homeAiInput.value.trim() ? 'inline-block' : 'none';
    });

    homeAiInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey || !e.shiftKey)) {
        e.preventDefault();
        triggerHomeAiGeneration();
      }
    });
  }

  if (btnTryDemo && homeAiInput) {
    btnTryDemo.addEventListener('click', () => {
      btnTryDemo.style.transform = 'scale(0.95)';
      setTimeout(() => { btnTryDemo.style.transform = ''; }, 150);
      const chosen = demoPrompts[demoIdx % demoPrompts.length];
      demoIdx++;
      homeAiInput.value = chosen;
      homeAiInput.focus();
      if (btnClearPrompt) btnClearPrompt.style.display = 'inline-block';
    });
  }

  if (btnClearPrompt && homeAiInput) {
    btnClearPrompt.addEventListener('click', () => {
      homeAiInput.value = '';
      btnClearPrompt.style.display = 'none';
      homeAiInput.focus();
    });
  }

  homeAiPills.forEach(pill => {
    pill.addEventListener('click', () => {
      homeAiPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const demo = pill.dataset.demo;
      if (homeAiInput) {
        if (!homeAiInput.value.trim()) {
          homeAiInput.value = demo || pill.textContent.trim();
        } else {
          homeAiInput.value = homeAiInput.value.trim() + ' (' + pill.textContent.trim() + ')';
        }
        if (btnClearPrompt) btnClearPrompt.style.display = 'inline-block';
        homeAiInput.focus();
      }
    });
  });

  function triggerHomeAiGeneration() {
    const val = (homeAiInput ? homeAiInput.value.trim() : '') || 'Make it feel romantic, cinematic and elegant for my anniversary with a soft purple mood.';
    const activePill = document.querySelector('#homeAiPills .pill.active, .ai.glass .pills .pill.active');
    const occ = activePill ? (activePill.dataset.occasion || activePill.textContent.trim()) : '';
    const dest = 'ai-matcher.html?prompt=' + encodeURIComponent(val) + (occ ? '&occasion=' + encodeURIComponent(occ) : '');
    window.location.href = dest;
  }

  if (btnGenerateAi) {
    btnGenerateAi.addEventListener('click', (e) => {
      e.preventDefault();
      triggerHomeAiGeneration();
    });
  }`;

content = content.replace(oldJsLogic, newJsLogic);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('✅ index.html AI studio section successfully upgraded with interactive input, demo switcher, and smart URL routing!');
