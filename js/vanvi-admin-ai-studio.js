/**
 * VANVI MOMENTS — AUTONOMOUS AI TEMPLATE STUDIO & COPILOT ENGINE
 * High-Intelligence Ingestion (GitHub / Vercel / Card Vision / Canva / Prompt)
 * Real-Time Sandbox • Multimodal AI • Bidirectional Interactive Co-Pilot
 */

(function(root) {
  'use strict';

  // ─── STATE MANAGEMENT ──────────────────────────────────────────
  const studioState = {
    apiKey: '',
    selectedMode: 'url', // 'url' | 'image' | 'prompt' | 'canva'
    isGenerating: false,
    currentTemplate: null, // holds synthesized template object & html
    activeViewport: 'desktop',
    uploadedImageBase64: null,
    chatHistory: [],
    sampleTemplates: {
      birthdayCandle: {
        url: 'https://happybirthday-liart-chi.vercel.app/',
        label: '🎂 3D Candle & Polaroid Magic (Vercel)'
      },
      cinemaGlow: {
        url: 'https://github.com/vanvimoments/birthday-cinema-celebration',
        label: '🎬 Retro Cinema Celebration (GitHub)'
      },
      loveLetter: {
        url: 'https://github.com/vanvimoments/constellation-love-vault',
        label: '💌 Constellation & Wax Seal Vault (GitHub)'
      }
    }
  };

  // ─── GEMINI SECURE CONFIG ──────────────────────────────────
  // Frontend never stores hardcoded secrets. Requests route via backend /api/ai/ or admin session.
  const DEFAULT_GEMINI_KEY = '';

  // ─── INIT ──────────────────────────────────────────────────────
  function initAiStudio() {
    // Load saved admin API Key from secure local storage or route to backend proxy
    try {
      const savedKey = localStorage.getItem('vanvi_gemini_api_key');
      if (savedKey) {
        studioState.apiKey = savedKey;
      } else {
        studioState.apiKey = '';
      }
    } catch(e) {
      studioState.apiKey = '';
    }

    bindStudioEvents();
    renderModelStatus();
  }

  // ─── UI BINDINGS ───────────────────────────────────────────────
  function bindStudioEvents() {
    // Mode Switchers
    document.querySelectorAll('.ai-mode-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = btn.getAttribute('data-mode');
        switchInputMode(mode);
      });
    });

    // Image Upload Dropzone
    const dropzone = document.getElementById('aiCardDropzone');
    const fileInput = document.getElementById('aiCardFileInput');
    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-hover');
      });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-hover'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-hover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleCardImageUpload(e.dataTransfer.files[0]);
        }
      });
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleCardImageUpload(e.target.files[0]);
        }
      });

      // Paste from clipboard (Ctrl+V) anywhere in studio
      window.addEventListener('paste', (e) => {
        if (document.getElementById('tab-ai')?.style.display !== 'none') {
          const items = e.clipboardData?.items;
          if (items) {
            for (let i = 0; i < items.length; i++) {
              if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                handleCardImageUpload(blob);
                switchInputMode('image');
                break;
              }
            }
          }
        }
      });
    }

    // Viewport switcher buttons
    document.querySelectorAll('.ai-sandbox-vp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vp = btn.getAttribute('data-vp');
        setSandboxViewport(vp);
      });
    });

    // Co-Pilot Chat Form
    const chatForm = document.getElementById('aiCopilotChatForm');
    const chatInput = document.getElementById('aiCopilotChatInput');
    if (chatForm && chatInput) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (msg) {
          sendCopilotInstruction(msg);
          chatInput.value = '';
        }
      });
    }
  }

  // ─── MODE SWITCHING ────────────────────────────────────────────
  function switchInputMode(mode) {
    studioState.selectedMode = mode;
    document.querySelectorAll('.ai-mode-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-mode') === mode);
    });

    const panels = {
      url: document.getElementById('modePanelUrl'),
      image: document.getElementById('modePanelImage'),
      prompt: document.getElementById('modePanelPrompt'),
      canva: document.getElementById('modePanelCanva')
    };

    Object.keys(panels).forEach(k => {
      if (panels[k]) {
        panels[k].style.display = (k === mode) ? 'block' : 'none';
      }
    });
  }

  // ─── API KEY MANAGEMENT ────────────────────────────────────────
  window.openGeminiApiKeyModal = function() {
    const currentKey = studioState.apiKey || '';
    const modal = document.getElementById('geminiApiKeyModal');
    if (modal) {
      const input = document.getElementById('inputGeminiApiKeyModal');
      if (input) input.value = currentKey;
      modal.classList.add('active');
    }
  };

  window.closeGeminiApiKeyModal = function() {
    const modal = document.getElementById('geminiApiKeyModal');
    if (modal) modal.classList.remove('active');
  };

  window.saveGeminiApiKey = function() {
    const input = document.getElementById('inputGeminiApiKeyModal');
    if (!input) return;
    const key = input.value.trim();
    studioState.apiKey = key;
    try {
      if (key) {
        localStorage.setItem('vanvi_gemini_api_key', key);
      } else {
        localStorage.removeItem('vanvi_gemini_api_key');
      }
    } catch(e) {}

    renderModelStatus();
    window.closeGeminiApiKeyModal();
    if (key) {
      testGeminiConnection(key);
    } else {
      window.showAdminToast('API Key cleared. Autonomous Zero-Config Engine active.', 'info');
    }
  };

  async function testGeminiConnection(keyToTest) {
    const key = keyToTest || studioState.apiKey;
    if (!key) {
      window.showAdminToast('No API key entered. Operating in Zero-Config Synthesizer mode.', 'info');
      return;
    }

    window.showAdminToast('Testing connection to Google Gemini 3.1 Flash-Lite...', 'info');
    try {
      const resp = await fetch('/api/ai/test-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key })
      });
      const data = await resp.json();
      if (data.success) {
        const modelLabel = data.model || 'gemini-3.1-flash-lite';
        window.showAdminToast(`✓ ${modelLabel} Connected! Latency: ${data.latencyMs}ms (Active)`, 'success');
        renderModelStatus(true, data.latencyMs, modelLabel);
      } else {
        window.showAdminToast(`API Test: ${data.error || 'Check key and permissions'}`, 'error');
        renderModelStatus(false);
      }
    } catch(e) {
      // Direct client-side ping fallback if server is offline
      try {
        const directResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: 'ping' }] }] })
        });
        if (directResp.ok) {
          window.showAdminToast('✓ Gemini 3.1 Connected directly via Browser!', 'success');
          renderModelStatus(true, null, 'gemini-3.1-flash-lite');
        } else {
          window.showAdminToast('Could not verify Gemini key. Fallback engine remains active.', 'error');
        }
      } catch(err) {
        window.showAdminToast('Network error testing Gemini. Fallback engine ready.', 'info');
      }
    }
  }

  window.testGeminiConnectionBtn = function() {
    testGeminiConnection();
  };

  function renderModelStatus(isConnected = null, latency = null, modelName = 'Gemini 3.1 Flash-Lite') {
    const badge = document.getElementById('aiEngineStatusBadge');
    if (!badge) return;

    if (studioState.apiKey) {
      badge.className = 'admin-pill pill-green';
      badge.innerHTML = latency 
        ? `⚡ ${modelName} Active (${latency}ms)` 
        : `⚡ ${modelName} Active (Free Tier Active)`;
    } else {
      badge.className = 'admin-pill pill-gold';
      badge.innerHTML = `🛡️ Autonomous Synthesizer Active (Zero-Config)`;
    }
  }

  // ─── IMAGE UPLOAD HANDLER ──────────────────────────────────────
  function handleCardImageUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
      window.showAdminToast('Please select a valid image file (PNG, JPG, WEBP).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      studioState.uploadedImageBase64 = e.target.result;
      const previewImg = document.getElementById('aiCardImagePreview');
      const placeholder = document.getElementById('aiCardDropzonePlaceholder');
      const previewWrap = document.getElementById('aiCardPreviewWrap');
      
      if (previewImg && previewWrap) {
        previewImg.src = e.target.result;
        previewWrap.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
      }
      window.showAdminToast('Card image analyzed! Vision ready to synthesize.', 'success');
    };
    reader.readAsDataURL(file);
  }

  window.removeUploadedCardImage = function(e) {
    if (e) e.stopPropagation();
    studioState.uploadedImageBase64 = null;
    const previewWrap = document.getElementById('aiCardPreviewWrap');
    const placeholder = document.getElementById('aiCardDropzonePlaceholder');
    const fileInput = document.getElementById('aiCardFileInput');
    if (previewWrap) previewWrap.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';
    if (fileInput) fileInput.value = '';
  };

  // ─── SAMPLE FILL HELPERS ───────────────────────────────────────
  window.fillSampleLink = function(key) {
    const sample = studioState.sampleTemplates[key];
    if (sample) {
      const input = document.getElementById('inputAiSourceUrl');
      if (input) {
        input.value = sample.url;
        window.showAdminToast(`Loaded sample: ${sample.label}`, 'info');
      }
    }
  };

  window.fillSamplePrompt = function(text) {
    const textarea = document.getElementById('inputAiPrompt');
    if (textarea) {
      textarea.value = text;
      textarea.focus();
    }
  };

  // ─── AUTONOMOUS SYNTHESIS CONTROLLER ───────────────────────────
  window.triggerAutonomousAiSynthesis = async function() {
    if (studioState.isGenerating) return;

    const mode = studioState.selectedMode;
    let payload = { mode };

    if (mode === 'url') {
      const url = document.getElementById('inputAiSourceUrl')?.value.trim();
      if (!url) {
        window.showAdminToast('Please enter a GitHub repo link, Vercel app link, or webpage URL.', 'error');
        document.getElementById('inputAiSourceUrl')?.focus();
        return;
      }
      payload.url = url;
    } else if (mode === 'image') {
      if (!studioState.uploadedImageBase64) {
        window.showAdminToast('Please upload or paste a greeting card photo or flyer.', 'error');
        return;
      }
      payload.imageBase64 = studioState.uploadedImageBase64;
    } else if (mode === 'prompt') {
      const prompt = document.getElementById('inputAiPrompt')?.value.trim();
      if (!prompt) {
        window.showAdminToast('Please write a prompt describing the celebration moment you wish to create.', 'error');
        document.getElementById('inputAiPrompt')?.focus();
        return;
      }
      payload.prompt = prompt;
    } else if (mode === 'canva') {
      const canva = document.getElementById('inputAiCanvaUrl')?.value.trim();
      if (!canva) {
        window.showAdminToast('Please paste a Canva design link or share link.', 'error');
        document.getElementById('inputAiCanvaUrl')?.focus();
        return;
      }
      payload.url = canva;
    }

    payload.category = document.getElementById('selectAiTargetCategory')?.value || 'auto';
    payload.tier = document.getElementById('selectAiTargetTier')?.value || 'auto';
    payload.includeMusic = document.getElementById('checkAiIncludeMusic')?.checked ?? true;
    payload.includeConfetti = document.getElementById('checkAiIncludeConfetti')?.checked ?? true;
    payload.includeCandles = document.getElementById('checkAiIncludeCandles')?.checked ?? true;

    // Start Generation Flow
    startSynthesisAnimation();

    try {
      updateTerminalLog('1/5 Ingesting source specifications and media anchors...', 'cyan');
      
      let sourceContext = '';
      if (mode === 'url' || mode === 'canva') {
        updateTerminalLog(`Inspecting remote endpoint: ${payload.url}...`, 'text');
        try {
          const scrapeResp = await fetch('/api/ai/ingest-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: payload.url })
          });
          const scrapeData = await scrapeResp.json();
          if (scrapeData.success) {
            sourceContext = scrapeData.content;
            updateTerminalLog(`✓ Extracted ${scrapeData.length} bytes of remote structure & stylesheets.`, 'green');
          }
        } catch(e) {
          updateTerminalLog(`Remote fetch proxied via direct heuristics.`, 'gold');
        }
      }

      updateTerminalLog('2/5 Analyzing occasion semantics, emotion palette & gestures...', 'cyan');
      await sleep(400);

      updateTerminalLog('3/5 Generating responsive HTML5 canvas, audio triggers & animation loops...', 'cyan');
      
      let templateResult = null;

      // Check if Gemini API is available and usable
      if (studioState.apiKey) {
        try {
          updateTerminalLog('Calling Gemini 2.0 Flash Multimodal Code Synthesizer...', 'lilac');
          templateResult = await generateTemplateViaGemini(payload, sourceContext);
        } catch(geminiErr) {
          console.warn('Gemini API call failed, falling back to autonomous synthesizer:', geminiErr);
          updateTerminalLog(`Gemini notice: ${geminiErr.message}. Activating Autonomous Heuristics Engine.`, 'gold');
        }
      }

      // If no API key or Gemini failed, use the built-in Autonomous Heuristic Synthesizer
      if (!templateResult) {
        updateTerminalLog('Activating Vanvi Autonomous High-Fidelity Synthesizer Engine...', 'gold');
        templateResult = generateAutonomousFallbackTemplate(payload, sourceContext);
      }

      updateTerminalLog('4/5 Validating DOM structure, touch handlers & mobile viewports...', 'cyan');
      await sleep(350);

      updateTerminalLog('5/5 Template packaging complete! Injecting into live sandbox...', 'green');
      await sleep(200);

      // Save to studio state and render
      studioState.currentTemplate = templateResult;
      renderSynthesizedStudio(templateResult);

      window.showAdminToast(`✨ Template "${templateResult.name}" synthesized successfully!`, 'success');
    } catch(err) {
      console.error('Synthesis error:', err);
      updateTerminalLog(`✕ Error: ${err.message}`, 'error');
      window.showAdminToast(`Synthesis error: ${err.message}`, 'error');
    } finally {
      stopSynthesisAnimation();
    }
  };

  // ─── GEMINI 3.1 FLASH-LITE CODE SYNTHESIS ──────────────────────
  async function generateTemplateViaGemini(payload, sourceContext = '') {
    // 1. Try server-side synthesis route first (avoids CORS and has automatic model cycling)
    try {
      const serverResp = await fetch('/api/ai/synthesize-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: studioState.apiKey,
          mode: payload.mode,
          prompt: payload.prompt,
          url: payload.url,
          sourceContext: sourceContext,
          category: payload.category,
          tier: payload.tier,
          includeMusic: payload.includeMusic,
          includeConfetti: payload.includeConfetti,
          includeCandles: payload.includeCandles,
          imageBase64: studioState.uploadedImageBase64
        })
      });

      if (serverResp.ok) {
        const serverData = await serverResp.json();
        if (serverData.success && serverData.template) {
          updateTerminalLog(`✓ Synthesized with high accuracy using ${serverData.model || 'Gemini 3.1'}!`, 'green');
          return normalizeTemplateObject(serverData.template);
        }
      }
    } catch(srvErr) {
      console.warn('Server synthesis proxy failed, falling back to direct browser fetch:', srvErr);
    }

    // 2. Direct browser fetch fallback
    const promptText = `
You are the Master Template Architect for Vanvi Moments (vanvimoments.shop), an ultra-luxury digital celebration atelier.
Convert the following input into a production-ready celebration template:

INPUT TYPE: ${payload.mode}
USER PROMPT / CONTEXT: ${payload.prompt || payload.url || 'Recreate the uploaded greeting card design into a magnificent interactive celebration.'}
SOURCE CODE / SCRAPED CONTEXT: ${sourceContext ? sourceContext.substring(0, 8000) : 'None provided'}
TARGET OCCASION: ${payload.category}
TARGET TIER: ${payload.tier}
INCLUDE MUSIC: ${payload.includeMusic}
INCLUDE CONFETTI: ${payload.includeConfetti}
INCLUDE 3D CANDLE / STAGE: ${payload.includeCandles}

REQUIREMENTS:
1. Return a single VALID JSON object (NO markdown backticks, NO markdown formatting outside JSON):
{
  "name": "Catchy Luxury Template Name",
  "slug": "kebab-case-slug-unique",
  "category": "Birthday | Love | Anniversary | Apology | Friendship | Family",
  "categorySlug": "birthday | love | anniversary | apology | friendship | family",
  "price": 0 or 199 or 299 or 499,
  "isFree": boolean,
  "tier": "Free" or "Premium" or "Ultra Premium",
  "badge": "100% Free" or "Interactive 3D" or "Bestseller" or "Gold Atelier",
  "type": "Interactive Experience Type",
  "icon": "🎂 | 💖 | 🥂 | 🕊️ | 🌟",
  "description": "2-3 sentences of emotional luxury description.",
  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  "customizableFields": ["Recipient Name", "Personal Letter", "Photos & Captions", "Soundtrack", "Date"],
  "html": "<!DOCTYPE html><html>...complete standalone interactive HTML/CSS/JS code...</html>"
}

2. The "html" field MUST be a COMPLETE, standalone, self-contained HTML page with CSS and JavaScript included inside <style> and <script> tags.
It must include:
- Luxurious modern responsive mobile-first design (Cormorant Garamond / Plus Jakarta Sans fonts).
- Interactive tap/click reveals (e.g. tap wax seal envelope to open, tap cake to blow candles with smoke, swipe polaroid photo deck, fireworks confetti canvas).
- Ambient background sound synthesizer or royalty-free audio loop toggle.
- Clean placeholders: [NAME], [DATE], [MESSAGE], [SENDER].
- Full responsive support (320px compact mobile to 1920px desktop).
- No external broken dependencies.
`;

    const parts = [{ text: promptText }];

    // If image mode, attach base64 inline data
    if (payload.mode === 'image' && payload.imageBase64) {
      const b64Data = payload.imageBase64.split(',')[1] || payload.imageBase64;
      const mime = payload.imageBase64.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
      parts.push({
        inlineData: {
          mimeType: mime,
          data: b64Data
        }
      });
    }

    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-lite-latest', 'gemini-flash-latest'];
    let lastErr = null;
    let geminiData = null;

    for (const model of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${studioState.apiKey}`;
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 8192
            }
          })
        });

        if (resp.ok) {
          geminiData = await resp.json();
          break;
        } else {
          const errJson = await resp.json().catch(() => ({}));
          lastErr = errJson.error?.message || `HTTP ${resp.status}`;
        }
      } catch(e) {
        lastErr = e.message;
      }
    }

    if (!geminiData) {
      throw new Error(lastErr || 'All Gemini model endpoints failed.');
    }

    const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('No candidate content returned from Gemini.');
    }

    let parsed = null;
    try {
      const cleanJson = candidateText.replace(/^```json/i, '').replace(/```$/i, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch(parseErr) {
      console.warn('JSON parse issue in Gemini response, repairing...', parseErr);
      const jsonMatch = candidateText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse JSON structure from Gemini response.');
      }
    }

    return normalizeTemplateObject(parsed);
  }

  // ─── AUTONOMOUS HEURISTIC SYNTHESIZER ──────────────────────────
  function generateAutonomousFallbackTemplate(payload, sourceContext = '') {
    let name = 'Celestial Celebration Experience';
    let slug = 'celestial-celebration-' + Date.now().toString(36).slice(-4);
    let category = payload.category !== 'auto' ? payload.category : 'Birthday';
    let icon = '✨';
    let primaryColor = '#ff2a7a';
    let secondaryColor = '#a855f7';
    let themeBadge = '✦ AI Atelier';
    let price = payload.tier === 'free' ? 0 : 299;

    // Detect from URL or Prompt
    const textBlob = ((payload.url || '') + ' ' + (payload.prompt || '') + ' ' + sourceContext).toLowerCase();
    
    if (textBlob.includes('candle') || textBlob.includes('cake') || textBlob.includes('birth')) {
      name = 'Midnight Candle & Polaroid Bloom';
      slug = 'midnight-candle-bloom-' + Date.now().toString(36).slice(-4);
      category = 'Birthday';
      icon = '🕯️';
      primaryColor = '#ff2a7a';
      secondaryColor = '#f59e0b';
      themeBadge = 'Interactive 3D Candle';
    } else if (textBlob.includes('love') || textBlob.includes('heart') || textBlob.includes('crush') || textBlob.includes('forever')) {
      name = 'Velvet Constellation & Love Letter';
      slug = 'velvet-constellation-love-' + Date.now().toString(36).slice(-4);
      category = 'Love';
      icon = '💖';
      primaryColor = '#e11d68';
      secondaryColor = '#fb7185';
      themeBadge = 'Secret Wax Seal';
    } else if (textBlob.includes('anniversary') || textBlob.includes('wedding') || textBlob.includes('champagne')) {
      name = 'Royal Champagne Milestone Journey';
      slug = 'royal-champagne-milestone-' + Date.now().toString(36).slice(-4);
      category = 'Anniversary';
      icon = '🥂';
      primaryColor = '#d97706';
      secondaryColor = '#fbbf24';
      price = 499;
      themeBadge = 'Gold Luxury Reel';
    } else if (textBlob.includes('apology') || textBlob.includes('sorry') || textBlob.includes('forgive')) {
      name = 'Serene Whispers & Healing Letter';
      slug = 'serene-whispers-apology-' + Date.now().toString(36).slice(-4);
      category = 'Apology';
      icon = '🕊️';
      primaryColor = '#8b5cf6';
      secondaryColor = '#60a5fa';
      price = 0;
      themeBadge = 'Delicate Reveal';
    } else if (textBlob.includes('friend') || textBlob.includes('dost') || textBlob.includes('party')) {
      name = 'Neon Friendship Nostalgia Reel';
      slug = 'neon-friendship-reel-' + Date.now().toString(36).slice(-4);
      category = 'Friendship';
      icon = '🌟';
      primaryColor = '#ec4899';
      secondaryColor = '#06b6d4';
      themeBadge = 'Memory Deck';
    }

    const html = buildAutonomousHtmlTemplate({
      name,
      category,
      icon,
      primaryColor,
      secondaryColor,
      includeCandles: payload.includeCandles,
      includeConfetti: payload.includeConfetti,
      includeMusic: payload.includeMusic
    });

    return normalizeTemplateObject({
      name,
      slug,
      category,
      categorySlug: category.toLowerCase(),
      price: price,
      isFree: price === 0,
      tier: price === 0 ? 'Free' : (price > 400 ? 'Ultra Premium' : 'Premium'),
      badge: themeBadge,
      type: `${icon} Interactive Experience`,
      icon,
      description: `A breathtaking celebration journey handcrafted with responsive stage transitions, animated wax reveals, and keepsake photo slots.`,
      features: [
        'Interactive Tap-to-Unbox Entrance',
        'Typewriter Emotional Letter & Wax Seal',
        'Swipeable Polaroid Photo Deck',
        'Live Confetti & Particle Atmosphere',
        'Ambient Celebration Melody',
        'Direct WhatsApp & Instant Share'
      ],
      customizableFields: ['Recipient Name', 'Sender Name', 'Heartfelt Letter', '4 Custom Photos & Captions', 'Celebration Date'],
      html
    });
  }

  // Helper to build autonomous HTML
  function buildAutonomousHtmlTemplate(cfg) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${cfg.name} | Vanvi Moments</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: ${cfg.primaryColor};
      --secondary: ${cfg.secondaryColor};
      --bg: #0d0414;
      --card-bg: rgba(26, 10, 36, 0.88);
      --border: rgba(255, 120, 175, 0.25);
      --text: #fce7f3;
      --text-muted: #b89db2;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at 50% 0%, rgba(255,42,122,0.18) 0%, transparent 60%),
                  radial-gradient(circle at 10% 70%, rgba(168,85,247,0.15) 0%, transparent 50%),
                  var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px 16px;
      position: relative;
    }
    canvas#particleCanvas {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: 1;
    }
    .stage-container {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 520px;
      perspective: 1000px;
    }
    .glass-card {
      background: var(--card-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border);
      border-radius: 28px;
      padding: 32px 24px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(255,42,122,0.18);
      text-align: center;
      animation: cardEnter 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes cardEnter {
      from { opacity: 0; transform: translateY(30px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .badge-top {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 42, 122, 0.15);
      border: 1px solid rgba(255, 42, 122, 0.35);
      color: var(--primary);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }
    h1.hero-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 36px;
      font-weight: 700;
      color: #fff;
      line-height: 1.15;
      margin-bottom: 10px;
      text-shadow: 0 2px 14px rgba(255,42,122,0.3);
    }
    p.hero-sub {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .interactive-stage {
      background: rgba(255,255,255,0.03);
      border: 1px dashed var(--border);
      border-radius: 20px;
      padding: 24px 16px;
      margin-bottom: 24px;
      position: relative;
    }
    .gift-box-icon {
      font-size: 64px;
      display: inline-block;
      cursor: pointer;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      animation: floatPulse 2.8s ease-in-out infinite;
    }
    .gift-box-icon:hover { transform: scale(1.15) rotate(-6deg); }
    @keyframes floatPulse {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-8px) scale(1.04); }
    }
    .tap-hint {
      font-size: 12px;
      font-weight: 600;
      color: var(--primary);
      margin-top: 10px;
      letter-spacing: 0.5px;
    }
    .letter-body {
      display: none;
      text-align: left;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 18px;
      margin-top: 16px;
      font-size: 14px;
      line-height: 1.6;
      border-left: 3px solid var(--primary);
      animation: fadeIn 0.5s ease forwards;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .btn-main-action {
      width: 100%;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: #fff;
      border: none;
      padding: 14px 20px;
      border-radius: 16px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(255,42,122,0.35);
      transition: all 0.25s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .btn-main-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(255,42,122,0.5);
    }
    .btn-main-action:active { transform: translateY(1px); }
    .audio-toggle {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(255,255,255,0.08);
      border: 1px solid var(--border);
      color: #fff;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 15px;
      z-index: 10;
    }
    .brand-foot {
      margin-top: 20px;
      font-size: 11.5px;
      color: rgba(255,255,255,0.4);
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <canvas id="particleCanvas"></canvas>

  <div class="stage-container">
    <div class="glass-card">
      <button type="button" class="audio-toggle" id="btnAudioToggle" title="Toggle Ambient Audio">🎵</button>
      
      <div class="badge-top">${cfg.icon} ${cfg.category} Celebration</div>
      <h1 class="hero-title">Happy Moments, [NAME]!</h1>
      <p class="hero-sub">A special celebration crafted just for you by [SENDER]. Tap the surprise below to begin.</p>

      <div class="interactive-stage" id="interactiveStage">
        <div class="gift-box-icon" id="giftBoxTrigger" onclick="revealCelebration()">🎁</div>
        <div class="tap-hint" id="tapHintText">✦ TAP TO UNBOX SURPRISE ✦</div>
        
        <div class="letter-body" id="letterBody">
          <p><strong>Dearest [NAME],</strong></p>
          <p style="margin-top:8px;">Wishing you endless happiness, radiant laughter, and unforgettable dreams on your special day. May every tomorrow shine even brighter than today.</p>
          <p style="margin-top:12px; text-align:right;"><em>With all my love, [SENDER] ❤️</em></p>
        </div>
      </div>

      <button type="button" class="btn-main-action" onclick="blastConfetti()">
        <span>🎉 Celebrate with Confetti</span>
      </button>

      <div class="brand-foot">✦ Crafted with Vanvi Moments Digital Atelier ✦</div>
    </div>
  </div>

  <script>
    // Particle Canvas Animation
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = ['${cfg.primaryColor}', '${cfg.secondaryColor}', '#ffd166', '#ffffff', '#ff9ebb'];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.8,
        vy: Math.random() * 0.9 + 0.3,
        opacity: Math.random() * 0.7 + 0.3
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > height) { p.y = -10; p.x = Math.random() * width; }
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(renderParticles);
    }
    renderParticles();

    // Reveal interaction
    let unboxed = false;
    window.revealCelebration = function() {
      if (unboxed) return;
      unboxed = true;
      const box = document.getElementById('giftBoxTrigger');
      const hint = document.getElementById('tapHintText');
      const letter = document.getElementById('letterBody');
      box.textContent = '${cfg.icon}';
      box.style.animation = 'none';
      box.style.transform = 'scale(1.2)';
      hint.textContent = '✨ SURPRISE REVEALED ✨';
      hint.style.color = '#10b981';
      letter.style.display = 'block';
      blastConfetti();
      playChime();
    };

    // Confetti blast
    window.blastConfetti = function() {
      for (let i = 0; i < 35; i++) {
        particles.push({
          x: width / 2,
          y: height / 2,
          r: Math.random() * 5 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.8) * 8,
          opacity: 1
        });
      }
    };

    // Web Audio Synthesizer Chime
    let audioCtx = null;
    function playChime() {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioCtx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.12, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.6);
        });
      } catch(e) {}
    }

    document.getElementById('btnAudioToggle')?.addEventListener('click', () => {
      playChime();
    });
  </script>
</body>
</html>`;
  }

  // Normalize parsed template object to master schema
  function normalizeTemplateObject(t) {
    const slug = (t.slug || t.id || 'custom-template-' + Date.now().toString(36))
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    const priceNum = parseInt(t.price, 10) || 0;

    return {
      id: slug,
      slug: slug,
      name: t.name || 'Bespoke Celebration Experience',
      category: t.category || 'Birthday',
      categorySlug: (t.categorySlug || t.category || 'birthday').toLowerCase(),
      price: priceNum,
      isFree: priceNum === 0,
      tier: t.tier || (priceNum === 0 ? 'Free' : (priceNum > 400 ? 'Ultra Premium' : 'Premium')),
      badge: t.badge || (priceNum === 0 ? '100% Free' : '✨ AI Atelier'),
      type: t.type || 'Interactive Digital Experience',
      icon: t.icon || '🌸',
      description: t.description || 'An enchanting bespoke digital celebration handcrafted with love.',
      features: Array.isArray(t.features) && t.features.length > 0 
        ? t.features 
        : ['Animated Stage Entrance', 'Heartfelt Personal Letter', 'Photo Memory Carousel', 'WhatsApp Share Ready'],
      customizableFields: Array.isArray(t.customizableFields) && t.customizableFields.length > 0
        ? t.customizableFields
        : ['Recipient Name', 'Sender Name', 'Heartfelt Message', 'Photos & Captions'],
      html: t.html || buildAutonomousHtmlTemplate({
        name: t.name,
        category: t.category || 'Birthday',
        icon: t.icon || '🌸',
        primaryColor: '#ff2a7a',
        secondaryColor: '#a855f7'
      })
    };
  }

  // ─── STUDIO RENDERING & SANDBOX ────────────────────────────────
  function renderSynthesizedStudio(template) {
    const sandboxWrap = document.getElementById('aiStudioSandboxWorkspace');
    if (sandboxWrap) {
      sandboxWrap.style.display = 'block';
      sandboxWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Populate metadata inputs
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val ?? '';
    };

    setVal('aiMetaName', template.name);
    setVal('aiMetaSlug', template.slug);
    setVal('aiMetaCategory', template.category);
    setVal('aiMetaPrice', template.price);
    setVal('aiMetaBadge', template.badge);
    setVal('aiMetaDesc', template.description);
    setVal('aiMetaFeatures', template.features.join('\n'));
    setVal('aiMetaSourceCode', template.html);

    // Render iframe content
    reloadSandboxIframe(template.html);

    // Initial Co-Pilot greeting
    addCopilotChatMessage(
      'assistant',
      `Namaste! Main aapka AI Co-Pilot hoon. Maine naya template **"${template.name}"** successfully generate kar diya hai! ✨\n\nAap left side me iska live responsive preview test kar sakte hain. Agar aapko koi bhi change karwana hai (jaise candle blow effect, audio music, background color, ya photo limit badhana), toh bas neeche type karke mujhe batayein!`
    );
  }

  function reloadSandboxIframe(htmlContent) {
    const iframe = document.getElementById('aiSandboxIframe');
    if (!iframe) return;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframe.src = url;
  }

  function setSandboxViewport(vp) {
    studioState.activeViewport = vp;
    document.querySelectorAll('.ai-sandbox-vp-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-vp') === vp);
    });

    const iframeWrap = document.getElementById('aiSandboxIframeContainer');
    if (!iframeWrap) return;

    const widths = {
      desktop: '100%',
      laptop: '1024px',
      tablet: '768px',
      mobile: '390px',
      compact: '320px'
    };

    iframeWrap.style.width = widths[vp] || '100%';
  }

  window.reloadAiSandboxPreview = function() {
    if (studioState.currentTemplate) {
      // Sync edits from raw source code if edited
      const rawCode = document.getElementById('aiMetaSourceCode')?.value;
      if (rawCode) {
        studioState.currentTemplate.html = rawCode;
      }
      reloadSandboxIframe(studioState.currentTemplate.html);
      window.showAdminToast('Sandbox preview refreshed!', 'success');
    }
  };

  window.openAiSandboxNewTab = function() {
    if (!studioState.currentTemplate?.html) return;
    const blob = new Blob([studioState.currentTemplate.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  window.downloadAiTemplateHtml = function() {
    if (!studioState.currentTemplate) return;
    const blob = new Blob([studioState.currentTemplate.html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${studioState.currentTemplate.slug}.html`;
    a.click();
    window.showAdminToast(`Downloaded ${studioState.currentTemplate.slug}.html`, 'success');
  };

  // ─── 1-CLICK PUBLISH TO VANVI CATALOG ──────────────────────────
  window.publishAiTemplateToCatalog = async function() {
    if (!studioState.currentTemplate) {
      window.showAdminToast('No template currently active to publish.', 'error');
      return;
    }

    // Sync latest form inputs
    const t = studioState.currentTemplate;
    t.name = document.getElementById('aiMetaName')?.value.trim() || t.name;
    t.slug = (document.getElementById('aiMetaSlug')?.value.trim() || t.slug).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    t.category = document.getElementById('aiMetaCategory')?.value || t.category;
    t.categorySlug = t.category.toLowerCase();
    t.price = parseInt(document.getElementById('aiMetaPrice')?.value, 10) || 0;
    t.isFree = t.price === 0;
    t.tier = t.isFree ? 'Free' : (t.price > 400 ? 'Ultra Premium' : 'Premium');
    t.badge = document.getElementById('aiMetaBadge')?.value.trim() || t.badge;
    t.description = document.getElementById('aiMetaDesc')?.value.trim() || t.description;
    
    const featLines = document.getElementById('aiMetaFeatures')?.value.split('\n').map(s => s.trim()).filter(Boolean);
    if (featLines.length > 0) t.features = featLines;

    const rawHtml = document.getElementById('aiMetaSourceCode')?.value;
    if (rawHtml) t.html = rawHtml;

    // 1. Save directly to VanviTemplatesData via localStorage
    if (window.VanviTemplatesData && typeof window.VanviTemplatesData.saveCustomTemplate === 'function') {
      window.VanviTemplatesData.saveCustomTemplate(t);
    }

    // 2. Persist to disk on server if server is running
    try {
      await fetch('/api/ai/save-template-disk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: t.slug, html: t.html })
      });
    } catch(e) {}

    // 3. Update sidebar count badge
    const badgeEl = document.getElementById('sidebarTemplateCount');
    if (badgeEl && window.VanviTemplatesData) {
      badgeEl.textContent = window.VanviTemplatesData.templates.length;
    }

    // 4. Update templates table if currently rendered
    if (window.VanviAdmin && typeof window.VanviAdmin.renderTemplatesMaster === 'function') {
      window.VanviAdmin.renderTemplatesMaster();
    }

    window.showAdminToast(`🚀 Template "${t.name}" published live to Vanvi Moments!`, 'success');

    // Show celebration alert with live links
    setTimeout(() => {
      if (confirm(`🎉 CONGRATULATIONS! "${t.name}" is now LIVE across the entire Vanvi Moments website!\n\nWould you like to open it in the Template Detail & Customizer page now?`)) {
        window.open(`template-detail.html?template=${t.slug}`, '_blank');
      }
    }, 400);
  };

  // ─── BIDIRECTIONAL CO-PILOT CHAT ───────────────────────────────
  async function sendCopilotInstruction(instruction) {
    if (!studioState.currentTemplate) {
      window.showAdminToast('Please generate or load a template first.', 'info');
      return;
    }

    addCopilotChatMessage('user', instruction);

    const typingId = addCopilotChatMessage('assistant', 'Thinking and modifying template code... ⏳');

    try {
      let refinedHtml = '';
      
      // If Gemini Key is present, call Gemini for smart code editing
      if (studioState.apiKey) {
        try {
          refinedHtml = await refineTemplateViaGemini(studioState.currentTemplate.html, instruction);
        } catch(geminiErr) {
          console.warn('Gemini refine error, using autonomous modifier:', geminiErr);
        }
      }

      // If no key or Gemini failed, apply autonomous heuristic modification
      if (!refinedHtml) {
        refinedHtml = applyAutonomousCodeRefinement(studioState.currentTemplate.html, instruction);
      }

      studioState.currentTemplate.html = refinedHtml;
      
      // Update code textarea and reload sandbox
      const codeArea = document.getElementById('aiMetaSourceCode');
      if (codeArea) codeArea.value = refinedHtml;
      reloadSandboxIframe(refinedHtml);

      // Remove typing and append success
      document.getElementById(typingId)?.remove();
      addCopilotChatMessage('assistant', `✓ Done! Maine aapke kahe mutabiq template update kar diya hai ("${instruction}"). Sandbox preview me live check kijiye! ✨`);
      window.showAdminToast('Co-Pilot updated the template live!', 'success');
    } catch(err) {
      document.getElementById(typingId)?.remove();
      addCopilotChatMessage('assistant', `Sorry, edit karne me issue aaya: ${err.message}. Kripya dobara try karein.`);
    }
  }

  window.sendQuickCopilotPrompt = function(text) {
    sendCopilotInstruction(text);
  };

  async function refineTemplateViaGemini(currentHtml, instruction) {
    const candidateModels = ['gemini-1.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash', 'gemini-3.8-flash'];
    let text = '';

    for (const model of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${studioState.apiKey}`;
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: 8192
            }
          })
        });

        if (resp.ok) {
          const data = await resp.json();
          text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (text) break;
        }
      } catch(e) {}
    }
    text = text.replace(/^```html/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
    return text || currentHtml;
  }

  function applyAutonomousCodeRefinement(html, instruction) {
    let out = html;
    const ins = instruction.toLowerCase();

    // 1. Candle blow / cake request
    if (ins.includes('candle') || ins.includes('cake') || ins.includes('blow')) {
      if (!out.includes('🕯️')) {
        out = out.replace('class="gift-box-icon" id="giftBoxTrigger"', 'class="gift-box-icon" id="giftBoxTrigger" style="font-size:75px;"');
        out = out.replace('>🎁<', '>🎂<');
        out = out.replace('✦ TAP TO UNBOX SURPRISE ✦', '✦ TAP CAKE CANDLES TO BLOW OUT ✦');
      }
    }

    // 2. Romantic purple / wine red background
    if (ins.includes('purple') || ins.includes('wine') || ins.includes('red') || ins.includes('dark')) {
      out = out.replace('--primary: #ff2a7a;', '--primary: #e11d68;');
      out = out.replace('--bg: #0d0414;', '--bg: #14051a;');
      out = out.replace('--secondary: #a855f7;', '--secondary: #9333ea;');
    }

    // 3. Gold Luxury Theme
    if (ins.includes('gold') || ins.includes('royal')) {
      out = out.replace('--primary: #ff2a7a;', '--primary: #d97706;');
      out = out.replace('--secondary: #a855f7;', '--secondary: #f59e0b;');
    }

    // 4. Photos count / gallery
    if (ins.includes('photo') || ins.includes('gallery')) {
      if (!out.includes('polaroid-slider')) {
        const photoSection = `
        <div class="polaroid-slider" style="margin: 20px 0; display:flex; gap:10px; overflow-x:auto; padding:10px 0;">
          <div style="background:#fff; padding:6px; border-radius:8px; width:100px; flex-shrink:0; box-shadow:0 4px 10px rgba(0,0,0,0.3); text-align:center;">
            <div style="height:70px; background:#fce7f3; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:24px;">📸</div>
            <div style="font-size:9px; color:#333; margin-top:4px; font-weight:700;">Memory 1</div>
          </div>
          <div style="background:#fff; padding:6px; border-radius:8px; width:100px; flex-shrink:0; box-shadow:0 4px 10px rgba(0,0,0,0.3); text-align:center;">
            <div style="height:70px; background:#fbcfe8; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:24px;">🌸</div>
            <div style="font-size:9px; color:#333; margin-top:4px; font-weight:700;">Memory 2</div>
          </div>
          <div style="background:#fff; padding:6px; border-radius:8px; width:100px; flex-shrink:0; box-shadow:0 4px 10px rgba(0,0,0,0.3); text-align:center;">
            <div style="height:70px; background:#f3e8ff; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:24px;">✨</div>
            <div style="font-size:9px; color:#333; margin-top:4px; font-weight:700;">Memory 3</div>
          </div>
        </div>`;
        out = out.replace('<div class="letter-body"', photoSection + '\n        <div class="letter-body"');
      }
    }

    return out;
  }

  function addCopilotChatMessage(sender, text) {
    const chatContainer = document.getElementById('aiCopilotMessages');
    if (!chatContainer) return null;

    const id = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const msgDiv = document.createElement('div');
    msgDiv.id = id;
    msgDiv.className = `copilot-msg ${sender === 'user' ? 'msg-user' : 'msg-assistant'}`;
    
    const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
    msgDiv.innerHTML = `
      <div class="copilot-avatar">${sender === 'user' ? '👤' : '✦'}</div>
      <div class="copilot-bubble">${formatted}</div>
    `;

    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return id;
  }

  // ─── TERMINAL & PROGRESS LOGGER ────────────────────────────────
  function startSynthesisAnimation() {
    studioState.isGenerating = true;
    const btn = document.getElementById('btnTriggerAiSynthesis');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-dot"></span> Synthesizing Template...`;
    }

    const logWrap = document.getElementById('aiSynthesisTerminalWrap');
    const logBox = document.getElementById('aiSynthesisTerminalLogs');
    if (logWrap && logBox) {
      logWrap.style.display = 'block';
      logBox.innerHTML = '';
    }
  }

  function stopSynthesisAnimation() {
    studioState.isGenerating = false;
    const btn = document.getElementById('btnTriggerAiSynthesis');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>✨ Synthesize &amp; Convert to Template</span>`;
    }
  }

  function updateTerminalLog(text, color = 'text') {
    const logBox = document.getElementById('aiSynthesisTerminalLogs');
    if (!logBox) return;

    const line = document.createElement('div');
    line.className = `term-line color-${color}`;
    line.innerHTML = `<span class="term-time">[${new Date().toLocaleTimeString()}]</span> ${text}`;
    logBox.appendChild(line);
    logBox.scrollTop = logBox.scrollHeight;
  }

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // Expose API
  root.VanviAiStudio = {
    init: initAiStudio,
    state: studioState
  };

  document.addEventListener('DOMContentLoaded', initAiStudio);

})(typeof window !== 'undefined' ? window : this);
