const express = require('express');
const router = express.Router();
const { generateMomentContent, chatWithVanviAssistant } = require('../services/ai.service');
const { rateLimiter } = require('../middleware/security');

/**
 * POST /api/ai/generate
 * Rate-limited AI letter and memory generator
 */
router.post('/generate', rateLimiter(60 * 1000, 25, 'AI generation rate limit reached. Please wait a moment.'), async (req, res) => {
  try {
    const { prompt, occasion, recipient, style, context, autoMagic, action, tone, palette } = req.body;
    const result = await generateMomentContent({ prompt, occasion, recipient, style, context, autoMagic, action, tone, palette });
    return res.json(result);
  } catch (err) {
    console.error('AI Route error:', err);
    return res.status(500).json({ success: false, error: 'Failed to generate moment content.' });
  }
});

/**
 * POST /api/ai/chat
 * Ultra-human conversational celebration companion with suggestions & platform memory
 */
router.post('/chat', rateLimiter(60 * 1000, 30, 'Chat rate limit reached. Please wait a moment.'), async (req, res) => {
  try {
    const { message, history, userContext } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message text is required.' });
    }
    const result = await chatWithVanviAssistant({ message, history, userContext });
    return res.json(result);
  } catch (err) {
    console.error('AI Chat route error:', err);
    return res.status(500).json({ success: false, error: 'Failed to process chat message.' });
  }
});

/**
 * POST /api/ai/ingest-url
 * Autonomous URL & GitHub Ingestion Engine for Admin AI Studio
 */
router.post('/ingest-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'Target URL is required.' });
    }

    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    // Convert github.com/user/repo to raw or api if possible
    let fetchUrl = targetUrl;
    if (targetUrl.includes('github.com') && !targetUrl.includes('raw.githubusercontent.com')) {
      // If it's a github repo, try to fetch index.html or README
      const ghMatch = targetUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/tree\/[^\/]+)?(?:\/(.*))?/i);
      if (ghMatch) {
        const user = ghMatch[1];
        const repo = ghMatch[2].replace(/\.git$/, '');
        const restPath = ghMatch[3] || 'index.html';
        fetchUrl = `https://raw.githubusercontent.com/${user}/${repo}/main/${restPath}`;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const resp = await fetch(fetchUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VanviMoments-AI-Studio/2.0'
      }
    });
    clearTimeout(timeoutId);

    if (!resp.ok) {
      // If raw github main branch failed, try master
      if (fetchUrl.includes('/main/')) {
        const altUrl = fetchUrl.replace('/main/', '/master/');
        const resp2 = await fetch(altUrl, { headers: { 'User-Agent': 'VanviMoments-AI-Studio/2.0' } });
        if (resp2.ok) {
          const html2 = await resp2.text();
          return res.json({
            success: true,
            fetchedUrl: altUrl,
            contentType: resp2.headers.get('content-type') || 'text/html',
            length: html2.length,
            content: html2.substring(0, 150000)
          });
        }
      }
      return res.status(resp.status).json({
        success: false,
        error: `Remote server returned HTTP ${resp.status}: ${resp.statusText}`
      });
    }

    const html = await resp.text();
    return res.json({
      success: true,
      fetchedUrl: fetchUrl,
      contentType: resp.headers.get('content-type') || 'text/html',
      length: html.length,
      content: html.substring(0, 150000)
    });
  } catch (err) {
    console.error('URL ingestion error:', err);
    return res.status(500).json({
      success: false,
      error: `Could not fetch external URL: ${err.message}`
    });
  }
});

/**
 * POST /api/ai/save-template-disk
 * Writes generated template HTML and assets directly to server templates folder
 */
router.post('/save-template-disk', async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const { slug, html } = req.body;

    if (!slug || !html) {
      return res.status(400).json({ success: false, error: 'Slug and HTML content are required.' });
    }

    const cleanSlug = String(slug).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const templateDir = path.join(__dirname, '../../templates', cleanSlug);

    if (!fs.existsSync(templateDir)) {
      fs.mkdirSync(templateDir, { recursive: true });
    }

    const indexPath = path.join(templateDir, 'index.html');
    fs.writeFileSync(indexPath, html, 'utf8');

    return res.json({
      success: true,
      slug: cleanSlug,
      templatePath: `templates/${cleanSlug}/index.html`,
      bytesWritten: Buffer.byteLength(html, 'utf8')
    });
  } catch (err) {
    console.error('Save template disk error:', err);
    return res.status(500).json({ success: false, error: `Failed to save template to disk: ${err.message}` });
  }
});

/**
 * POST /api/ai/test-gemini
 * Tests connectivity to Google Gemini API
 */
router.post('/test-gemini', async (req, res) => {
  try {
    const apiKey = req.body.apiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ success: false, error: 'Gemini API Key is required.' });
    }

    const tStart = Date.now();
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-3.5-flash'];
    let lastError = null;

    for (const model of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const testResp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with: VANVI_AI_ONLINE' }] }]
          })
        });

        const latency = Date.now() - tStart;
        if (testResp.ok) {
          return res.json({
            success: true,
            latencyMs: latency,
            model: model,
            status: 'Connected (Free Tier Active)'
          });
        } else {
          const errData = await testResp.json().catch(() => ({}));
          lastError = errData.error?.message || `HTTP ${testResp.status}`;
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    return res.status(400).json({
      success: false,
      latencyMs: Date.now() - tStart,
      error: lastError || 'Could not connect to Gemini models.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/ai/synthesize-template
 * Master synthesis engine combining prompt, scraped source code, vision, and Gemini 3.1
 */
router.post('/synthesize-template', async (req, res) => {
  try {
    const apiKey = req.body.apiKey || process.env.GEMINI_API_KEY;
    const { mode, prompt, url, sourceContext, category, tier, includeMusic, includeConfetti, includeCandles, imageBase64 } = req.body;

    if (!apiKey) {
      return res.status(400).json({ success: false, error: 'Gemini API Key is required.' });
    }

    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-3.5-flash'];
    const systemPrompt = `You are the Master Template Architect for Vanvi Moments (vanvimoments.shop), an ultra-luxury digital celebration atelier.
Convert the provided input into a production-ready celebration template.

INPUT MODE: ${mode || 'prompt'}
TARGET OCCASION: ${category || 'Birthday'}
TARGET TIER: ${tier || 'Free'}
USER PROMPT / CONTEXT: ${prompt || url || 'Create an interactive celebration experience.'}
SCRAPED SOURCE CODE / EXTRA CONTEXT: ${sourceContext ? sourceContext.substring(0, 10000) : 'None'}
INCLUDE MUSIC: ${includeMusic !== false}
INCLUDE CONFETTI: ${includeConfetti !== false}
INCLUDE CANDLE / STAGE: ${includeCandles !== false}

INSTRUCTIONS:
1. Return ONLY a single raw valid JSON object (NO markdown backticks like \`\`\`json, NO explanations outside JSON):
{
  "name": "Catchy Luxury Template Name",
  "slug": "kebab-case-slug-unique",
  "category": "Birthday | Love | Anniversary | Apology | Friendship | Family",
  "categorySlug": "birthday | love | anniversary | apology | friendship | family",
  "price": 0 or 199 or 299,
  "isFree": true or false,
  "tier": "Free" or "Premium" or "Ultra Premium",
  "badge": "100% Free" or "Interactive 3D" or "Bestseller",
  "type": "Interactive Experience Type",
  "icon": "🎂 | 💖 | 🥂 | 🕊️ | 🌟",
  "description": "2-3 sentences of emotional luxury description.",
  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  "customizableFields": ["Recipient Name", "Personal Letter", "Photos & Captions", "Soundtrack", "Date"],
  "html": "<!DOCTYPE html><html>...complete standalone responsive HTML5 page with embedded CSS & JS...</html>"
}

2. The "html" field MUST be a complete, self-contained interactive web experience with:
- Mobile-first responsive layout (320px to desktop).
- Premium fonts ('Plus Jakarta Sans', 'Cormorant Garamond', 'Playfair Display').
- Interactive stage (touch/click candle to blow out with smoke & confetti, or open wax seal letter).
- Audio Web Audio API synthesizer chime / waltz or soothing melody.
- Smooth CSS animations, glowing buttons, and polaroid photo card placeholder.`;

    const contents = [{
      role: 'user',
      parts: []
    }];

    if (imageBase64 && typeof imageBase64 === 'string') {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      contents[0].parts.push({
        inline_data: {
          mime_type: mimeType,
          data: base64Data
        }
      });
    }

    contents[0].parts.push({ text: systemPrompt });

    let lastError = null;
    for (const model of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);

        const aiResp = await fetch(endpoint, {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 8192
            }
          })
        });
        clearTimeout(timeoutId);

        if (aiResp.ok) {
          const aiData = await aiResp.json();
          let rawText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          rawText = rawText.trim();
          if (rawText.startsWith('```json')) rawText = rawText.replace(/^```json\s*/i, '');
          if (rawText.startsWith('```')) rawText = rawText.replace(/^```\s*/i, '');
          if (rawText.endsWith('```')) rawText = rawText.replace(/\s*```$/i, '');
          rawText = rawText.trim();

          const parsed = JSON.parse(rawText);
          return res.json({
            success: true,
            model: model,
            template: parsed
          });
        } else {
          const errBody = await aiResp.json().catch(() => ({}));
          lastError = errBody.error?.message || `HTTP ${aiResp.status}`;
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    return res.status(500).json({
      success: false,
      error: `Gemini synthesis error: ${lastError || 'Could not synthesize template'}`
    });
  } catch (err) {
    console.error('Synthesize template error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;


