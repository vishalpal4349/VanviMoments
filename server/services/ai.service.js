/**
 * VANVI MOMENTS — MULTI-PROVIDER AI SERVICE
 * Pluggable co-pilot for Gemini, OpenAI, and Claude with timeout resilience
 * and heartfelt Indian cultural emotional poetry generator.
 */

const fs = require('fs');
const path = require('path');

// Ensure .env is read if not yet populated
try {
  const envPath = path.resolve(__dirname, '../../.env');
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf8');
    raw.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const k = trimmed.substring(0, eqIdx).trim();
        const v = trimmed.substring(eqIdx + 1).trim();
        if (k && !process.env[k]) {
          process.env[k] = v;
        }
      }
    });
  }
} catch (e) {}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '';
const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';

const GEMINI_MODELS = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemma-4-26b-a4b-it', 'gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-flash-lite-latest'];
const API_TIMEOUT_MS = 10000; // 10 second timeout per external LLM call

// Fallback dynamic generator with Indian emotional aesthetics
function generateEmotionalFallback({ prompt = '', occasion = 'Birthday', recipient = 'You', style = 'deep' }) {
  const occ = occasion.toLowerCase();
  const rec = recipient || 'You';

  const poetryBank = {
    birthday: {
      deep: `To my dearest ${rec},\n\nOn this day when the world welcomed you, I want time to pause just enough for you to feel how profoundly cherished you are.\n\nYour presence turns ordinary moments into memories of pure gold. May the coming year shower your path with joy, laughter that echoes in quiet rooms, and dreams that quietly become reality.\n\nHappy Birthday, with all my love. ✨🎂`,
      hinglish: `Dearest ${rec},\n\nTumhari muskaan me ek aisi roshni hai jo kisi bhi udaas din ko roshan kar sakti hai.\n\nHar saal aayega aur jayega, par ye dua hamesha rahegi — tumhari aankhon me khushi ke aage koi aansu na ruke. Happy Birthday, hamesha aise hi chamakte rehna! 💖✨`,
      short: `“To the one who brings magic to every room they step into. Happy Birthday, ${rec}! 🎂👑”`
    },
    love: {
      deep: `My beloved ${rec},\n\nIn a world moving too fast, falling in love with you felt like finally learning how to breathe. You are my safe harbor, my favorite laughter, and every quiet thought before sleep.\n\nNo distance or time could ever change what your hand in mine feels like. Here is to all our unspoken glances and every tomorrow we have yet to live. ❤️`,
      hinglish: `Mere pyaare ${rec},\n\nTumhare sath waqt kahan guzar jata hai pata hi nahi chalta. Ek cup chai aur tumhari baatein — zindagi me isse pyara lamha aur kuch ho hi nahi sakta.\n\nBas itna kehna tha: I will choose you in every lifetime, bina kisi sawaal ke. Forever and always. 💕`,
      short: `“In a world full of temporary things, you are my favorite forever. Love you, ${rec}. 💌✨”`
    },
    anniversary: {
      deep: `Dearest ${rec},\n\nAnother year of writing our story, chapter by chapter, through gentle mornings and shared challenges.\n\nWhat we share isn't just love — it is trust, patience, and the warmth of always knowing who holds your hand in the dark. Happy Anniversary! 💍🥂`,
      hinglish: `Pyaar aur dosti ka ye safar tumhare bina adhura tha ${rec}. Har saal ke sath hamara bond aur gehra hota gaya hai. Happy Anniversary, hum dono ko! 🥂✨`,
      short: `“365 more days of loving you, and I’m ready for a lifetime more. Happy Anniversary! 💍”`
    },
    friendship: {
      deep: `To my dearest confidant ${rec},\n\nFriendship with you has been the easiest, truest joy. Through late-night talks, unspoken understandings, and effortless comfort, thank you for standing beside me.\n\nHere is to our wild stories, shared laughter, and a bond that only deepens with time. 🥂✨`,
      hinglish: `Yaar ${rec},\n\nTere bina koi bhi celebration incomplete lagti hai. Chai ki tapri se lekar life ke har mod tak, thanks for always having my back. Dosti zindabad! 🤝✨`,
      short: `“Some friendships are written in the stars, and ours is timeless. Cheers to you, ${rec}! 💫”`
    },
    apology: {
      deep: `Dear ${rec},\n\nI am writing this from a place of genuine vulnerability and humility. If my words or actions caused you pain, please know that was never my intent.\n\nYour happiness and peace mean the world to me. I cherish our bond too deeply to ever take you for granted. I am truly sorry, and hope you can find it in your heart to forgive me. 🕊️`,
      hinglish: `Dear ${rec},\n\nDil se maafi maangta hoon. Kabhi kabhi galti ho jati hai, par tumhari importance meri life me hamesha sabse upar rahegi. Let’s make things right. 🕊️❤️`,
      short: `“No ego is bigger than the bond we share. I am truly sorry, ${rec}. Let’s heal together. 🕊️”`
    },
    family: {
      deep: `To my beloved family member ${rec},\n\nHome has never been just a physical place — it has always been you, your warmth, and the safety of your embrace.\n\nThank you for every sacrifice, every gentle reassurance, and the unconditional love that grounds me every day. 🏡💖`,
      hinglish: `Pyare ${rec},\n\nAapka aashirwad aur pyaar hi meri sabse badi taqat hai. Thank you for always protecting and loving our family unconditionally. 🌸✨`,
      short: `“Family is where life begins and unconditional love never ends. Love you always, ${rec}! 🌸”`
    },
    celebration: {
      deep: `Dearest ${rec},\n\nToday the spotlight is rightfully yours! Every milestone you achieve is a testament to your grit, grace, and golden heart.\n\nPop the champagne, dance without restraint, and savor this triumph — you have earned every single bit of it! 🎉🥂`,
      hinglish: `Badhaai ho ${rec}! Tumne prove kar diya ki dedication aur passion se sab possible hai. Aaj celebration ki raat hai, full masti on! 🎆🥳`,
      short: `“Raise a glass to triumph, hard work, and dazzling success! Huge congratulations, ${rec}! 🥂🎉”`
    }
  };

  let matchedKey = 'love';
  if (occ.includes('birth')) matchedKey = 'birthday';
  else if (occ.includes('anni')) matchedKey = 'anniversary';
  else if (occ.includes('friend')) matchedKey = 'friendship';
  else if (occ.includes('apol') || occ.includes('sorr')) matchedKey = 'apology';
  else if (occ.includes('fam') || occ.includes('mom') || occ.includes('dad')) matchedKey = 'family';
  else if (occ.includes('celeb') || occ.includes('congrat')) matchedKey = 'celebration';

  const pack = poetryBank[matchedKey] || poetryBank.love;
  const auto = inferAutoMagic({ prompt, occasion, recipient, style });

  return {
    success: true,
    provider: 'vanvi-creative-engine',
    occasion: auto.occasion,
    recipient: auto.recipient,
    understanding: auto,
    variations: {
      deep: pack.deep,
      hinglish: pack.hinglish,
      short: pack.short
    }
  };
}

/**
 * Intelligent Auto Magic Inference Engine
 */
function inferAutoMagic({ prompt = '', occasion = '', recipient = '', style = '', context = {}, tone = '', palette = '' }) {
  const p = (String(prompt || '') + ' ' + (context.promptHistory || '')).toLowerCase();

  // 1. Detect Occasion
  let detectedOccasion = occasion || context.occasion || '';
  if (!detectedOccasion || detectedOccasion === 'Birthday') {
    if (p.includes('birth') || p.includes('janamdin') || p.includes('bday')) detectedOccasion = 'Birthday';
    else if (p.includes('anni') || p.includes('saalgirah') || p.includes('saal girah')) detectedOccasion = 'Anniversary';
    else if (p.includes('love') || p.includes('pyaar') || p.includes('ishq') || p.includes('valentine') || p.includes('propose') || p.includes('gf') || p.includes('bf')) detectedOccasion = 'Love & Romance';
    else if (p.includes('friend') || p.includes('dost') || p.includes('yaar') || p.includes('bestie')) detectedOccasion = 'Friendship';
    else if (p.includes('sorr') || p.includes('maafi') || p.includes('galti') || p.includes('apolog')) detectedOccasion = 'Apology';
    else if (p.includes('mom') || p.includes('dad') || p.includes('maa') || p.includes('papa') || p.includes('bhai') || p.includes('sister') || p.includes('behan') || p.includes('family')) detectedOccasion = 'Family & Gratitude';
    else if (p.includes('congrat') || p.includes('shabaash') || p.includes('mubarak') || p.includes('achieve') || p.includes('win')) detectedOccasion = 'Celebration';
    else if (!detectedOccasion) detectedOccasion = 'Special Celebration';
  }

  // 2. Detect Recipient
  let detectedRecipient = recipient || context.recipient || '';
  if (!detectedRecipient || detectedRecipient === 'Someone Special' || detectedRecipient === 'You') {
    const nameMatch = String(prompt || '').match(/(?:naam|name\s+is|named|for|to)\s+([A-Z][a-zA-Z]+|[a-zA-Z]{3,15})/i);
    if (nameMatch && nameMatch[1]) {
      const candidate = nameMatch[1].trim();
      const forbidden = ['kuch', 'hai', 'banana', 'thoda', 'aur', 'birthday', 'surprise', 'love', 'romantic', 'very', 'pink', 'cute'];
      if (!forbidden.includes(candidate.toLowerCase())) {
        detectedRecipient = candidate.charAt(0).toUpperCase() + candidate.slice(1);
      }
    }
    if (!detectedRecipient) {
      if (p.includes('dost') || p.includes('yaar') || p.includes('bestie')) detectedRecipient = 'My Best Friend';
      else if (p.includes('maa') || p.includes('mom')) detectedRecipient = 'Mom';
      else if (p.includes('papa') || p.includes('dad')) detectedRecipient = 'Dad';
      else if (p.includes('bhai') || p.includes('brother')) detectedRecipient = 'Brother';
      else if (p.includes('behan') || p.includes('sister')) detectedRecipient = 'Sister';
      else detectedRecipient = 'My Special One';
    }
  }

  // 3. Detect Mood & Tone
  let detectedTone = tone || context.tone || 'Emotional & Heartfelt';
  if (p.includes('cute') || p.includes('sweet') || p.includes('pyaara')) detectedTone = 'Cute & Sweet';
  else if (p.includes('cinematic') || p.includes('filmy') || p.includes('movie')) detectedTone = 'Cinematic & Grand';
  else if (p.includes('emotional') || p.includes('deep') || p.includes('bhaavuk')) detectedTone = 'Deeply Emotional';
  else if (p.includes('short') || p.includes('crisp') || p.includes('chota')) detectedTone = 'Short & Meaningful';
  else if (p.includes('funny') || p.includes('naughty') || p.includes('masti')) detectedTone = 'Playful & Joyful';

  // 4. Detect Palette & Aesthetic
  let detectedPalette = palette || context.palette || 'Rose Gold & Blush';
  if (p.includes('pink kam') || p.includes('elegant') || p.includes('gold') || p.includes('subtle')) {
    detectedPalette = 'Champagne Gold & Pearl White';
  } else if (p.includes('dark') || p.includes('black') || p.includes('obsidian') || p.includes('night')) {
    detectedPalette = 'Velvet Obsidian & Rose Gold';
  } else if (p.includes('purple') || p.includes('lilac') || p.includes('violet')) {
    detectedPalette = 'Soft Lilac & Stardust';
  } else if (p.includes('emerald') || p.includes('green') || p.includes('tuscan')) {
    detectedPalette = 'Tuscan Emerald & Honey Amber';
  }

  // 5. Template & Reveal recommendation
  let templateId = 'birthday-white-bloom-001';
  let templateName = 'Birthday White Bloom';
  let unlockMode = 'wax-seal';
  let music = 'Romantic Piano';

  if (detectedOccasion === 'Birthday') {
    if (detectedTone.includes('Cute')) {
      templateId = 'retro-birthday-polaroid';
      templateName = 'Retro Polaroid Wall';
      unlockMode = 'envelope';
      music = 'Acoustic Sunset';
    } else {
      templateId = 'birthday-white-bloom-001';
      templateName = 'Midnight Candle Bloom';
      unlockMode = 'wax-seal';
      music = 'Romantic Piano';
    }
  } else if (detectedOccasion.includes('Love') || detectedOccasion.includes('Romance')) {
    templateId = 'eternal-melody';
    templateName = 'Eternal Melody Reel';
    unlockMode = 'wax-seal';
    music = 'Violin & Soft Piano';
  } else if (detectedOccasion === 'Anniversary') {
    templateId = 'anniversary-champagne-gold';
    templateName = 'Champagne Gold Milestone';
    unlockMode = 'envelope';
    music = 'Midnight Strings';
  } else if (detectedOccasion === 'Apology') {
    templateId = 'locked-envelope';
    templateName = 'Secret Sealed Letter';
    unlockMode = 'pin';
    music = 'Gentle Piano';
  }

  const magicActions = [
    '✨ Make More Emotional',
    '🎬 Make Cinematic',
    '💗 Make Cuter',
    '✍️ Rewrite Naturally',
    '🎁 Add Surprise Reveal'
  ];

  return {
    occasion: detectedOccasion,
    recipient: detectedRecipient,
    tone: detectedTone,
    palette: detectedPalette,
    templateId,
    templateName,
    unlockMode,
    music,
    magicActions
  };
}

/**
 * Main Generation Entrypoint with failover and timeout guard
 */
async function generateMomentContent({ prompt = '', occasion = 'Birthday', recipient = 'Someone Special', style = 'deep', context = {}, autoMagic = true, tone = '', palette = '' }) {
  if (!prompt || prompt.trim().length === 0) {
    prompt = `A special ${occasion} celebration memory for ${recipient}`;
  }

  const auto = inferAutoMagic({ prompt, occasion, recipient, style, context, tone, palette });
  const finalOccasion = auto.occasion;
  const finalRecipient = auto.recipient;

  // 1. Google Gemini Provider
  if (GEMINI_API_KEY) {
    for (const model of GEMINI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const systemInstruction = `You are Vanvi AI, a luxury creative co-pilot crafting heartfelt Indian celebration letters. Occasion: ${finalOccasion}, For: ${finalRecipient}, Tone: ${auto.tone}. Generate a JSON response with 3 keys: "deep" (cinematic poetic letter), "hinglish" (warm Hindi/English emotion), "short" (1-2 line punchy quote).`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(API_TIMEOUT_MS),
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemInstruction}\nUser prompt: ${prompt}` }] }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
              success: true,
              provider: 'google-gemini',
              model,
              occasion: finalOccasion,
              recipient: finalRecipient,
              understanding: auto,
              variations: {
                deep: parsed.deep,
                hinglish: parsed.hinglish,
                short: parsed.short
              }
            };
          }
        }
      } catch (err) {
        console.warn(`Gemini (${model}) generation failed, trying next:`, err.message);
      }
    }
  }

  // 2. OpenAI Provider (Primary: Responses API with GPT-6 Luna, Secondary: Chat Completions)
  if (OPENAI_API_KEY) {
    try {
      let rawText = '';
      try {
        const resp = await fetch('https://api.openai.com/v1/responses', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(API_TIMEOUT_MS),
          body: JSON.stringify({
            model: 'gpt-6-luna',
            instructions: `You are Vanvi AI. Return ONLY JSON with keys: "deep", "hinglish", "short". Occasion: ${occasion}, Recipient: ${recipient}`,
            input: prompt,
            store: true
          })
        });
        if (resp.ok) {
          const data = await resp.json();
          const msgItem = data.output?.find(item => item.type === 'message' || item.role === 'assistant');
          const textObj = msgItem?.content?.find(c => c.type === 'output_text' || typeof c.text === 'string');
          rawText = textObj?.text || (typeof msgItem?.content === 'string' ? msgItem.content : '');
        }
      } catch (eResp) {}

      if (!rawText) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(API_TIMEOUT_MS),
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: `You are Vanvi AI. Return ONLY JSON with keys: "deep", "hinglish", "short". Occasion: ${occasion}, Recipient: ${recipient}` },
              { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
          })
        });
        if (response.ok) {
          const data = await response.json();
          rawText = data.choices?.[0]?.message?.content || '{}';
        }
      }

      if (rawText) {
        let content = {};
        try {
          content = JSON.parse(rawText.trim());
        } catch (eParse) {
          const match = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || rawText.match(/(\{[\s\S]*\})/);
          if (match && match[1]) {
            try { content = JSON.parse(match[1]); } catch (e2) {}
          }
        }
        if (content && (content.deep || content.hinglish || content.short)) {
          return {
            success: true,
            provider: 'openai-gpt-6-luna',
            occasion: finalOccasion,
            recipient: finalRecipient,
            understanding: auto,
            variations: {
              deep: content.deep || '',
              hinglish: content.hinglish || '',
              short: content.short || ''
            }
          };
        }
      }
    } catch (err) {
      console.warn('OpenAI API call failed or timed out:', err.message);
    }
  }

  // 3. Anthropic Claude Provider
  if (ANTHROPIC_API_KEY) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 1000,
          system: `You are Vanvi AI co-pilot. Return ONLY valid JSON with keys: "deep", "hinglish", "short". Occasion: ${finalOccasion}, Recipient: ${finalRecipient}`,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.content?.[0]?.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            success: true,
            provider: 'anthropic-claude',
            occasion: finalOccasion,
            recipient: finalRecipient,
            understanding: auto,
            variations: {
              deep: parsed.deep,
              hinglish: parsed.hinglish,
              short: parsed.short
            }
          };
        }
      }
    } catch (err) {
      console.warn('Anthropic API call failed or timed out:', err.message);
    }
  }

  // 4. Resilient Built-in Emotional Engine
  return generateEmotionalFallback({ prompt, occasion: finalOccasion, recipient: finalRecipient, style, tone, palette });
}

/**
 * Chat with Vanvi Assistant - Multi-provider conversational engine
 * with resilient human empathetic fallback.
 */
async function chatWithVanviAssistant({ message = '', history = [], userContext = {} }) {
  const cleanMsg = String(message || '').trim();
  const userName = userContext.name || userContext.userName || '';

  // 1. Google Gemini Provider
  if (GEMINI_API_KEY) {
    const userMode = userContext.mode || 'Cute';
    const userLen = userContext.length || 'short';
    const userLang = userContext.lang || 'hinglish';

    const systemInstruction = `You are Vanvi AI, a warm, smart, friendly female-style digital AI companion for Vanvi Moments (vanvimoments.shop).
IDENTITY & PERSONA:
- Character: A sweet, intelligent, caring, and professional female AI friend.
- Honesty: Never pretend to be a biological human; you are Vanvi AI, their personal digital companion who genuinely cares.
- Tone: Naturally conversational, warm, cute, respectful, and helpful. Avoid sounding scripted, generic, or robotic!

LANGUAGE & COMMUNICATION:
- Default Language: Natural Hinglish (modern, relatable, friendly Indian tone).
- Language Auto-Switching:
  * If the user writes in Hindi or asks for Hindi, reply in authentic, clean Devanagari Hindi.
  * If the user writes in English or asks for English, reply in fluent, natural English.
  * Smartly adapt and switch languages based on how the user communicates.
- LENGTH & BREVITY (CRITICAL RULE):
  * Keep answers STRICTLY SHORT, CRISP, AND TO THE POINT (1 to 3 compact lines max).
  * Do NOT write lengthy, boring paragraphs or unnecessary essays! People get bored easily.
  * Only provide long, detailed answers if the user explicitly asks: "detail me batao", "expand karo", "bada likho", "lamba batao".
- EMOTIONAL & FUN ENGAGEMENT:
  * Talk like an interesting, affectionate best friend — lively, sweet, and fun!
  * Use contextual, cute emojis according to the mood (e.g., 🎂, 💖, 🌸, ✨, 🤭, 🥺, 💡, 🥂). Never sound dull, dry, or formal!
- REPETITION:
  * NEVER end every reply with robotic lines like "Kya main aur madad kar sakti hoon?" or "Would you like me to...". Be natural!

CAPABILITIES & KNOWLEDGE:
- General Intelligence: Full common sense for daily queries, writing, study help, letters, romantic shayari, fun jokes, and life advice.
- VanviMoments Knowledge: Personalized 3D cards, wax-sealed letters, music, surprise QR codes, and keepsakes.

SUGGESTIONS:
- Provide 2 to 3 short, snappy next-step suggestions (e.g. "Isko aur cute karo ✨", "Short me wish 🎂", "Hindi me likho 💌").

Return ONLY a valid JSON object without markdown fences:
{
  "reply": "Your short, sweet, engaging 1-3 line response with situational emojis",
  "suggestions": ["2 to 3 short suggestions"],
  "action": null or { "label": "Button text", "url": "page.html" }
}`;

    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
      history.slice(-6).forEach(h => {
        const role = (h.role === 'user') ? 'user' : 'model';
        const txt = h.text || h.content || '';
        if (txt) contents.push({ role, parts: [{ text: txt }] });
      });
    }
    contents.push({ role: 'user', parts: [{ text: `${systemInstruction}\n\nUser message: ${cleanMsg}` }] });

    for (const model of GEMINI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(API_TIMEOUT_MS),
          body: JSON.stringify({ contents })
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          let reply = '';
          let suggestions = [];
          let action = null;

          try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              if (parsed.reply) reply = parsed.reply;
              if (Array.isArray(parsed.suggestions)) suggestions = parsed.suggestions;
              if (parsed.action) action = parsed.action;
            }
          } catch (e) {}

          if (!reply && text) {
            reply = text.trim();
          }

          if (reply) {
            return {
              success: true,
              provider: 'google-gemini',
              model,
              reply,
              suggestions: suggestions.length > 0 ? suggestions : ["Aur batao ✨", "Shayari sunao 💌", "Templates dikhao 🌸"],
              action
            };
          }
        }
      } catch (err) {
        console.warn(`Gemini chat (${model}) failed, trying next:`, err.message);
      }
    }
  }

  // 2. OpenAI Provider
  if (OPENAI_API_KEY) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are Vanvi, a warm, caring, human-like Indian celebration companion and best friend. Talk in natural Hindi/Hinglish/English. Return ONLY JSON with keys: "reply", "suggestions" (array of 3 short replies), "action" (object with "label" and "url" or null). User name: "${userName}".`
        }
      ];
      if (Array.isArray(history)) {
        history.slice(-6).forEach(h => {
          if (h.role === 'user' || h.role === 'assistant') {
            messages.push({ role: h.role, content: h.text });
          }
        });
      }
      messages.push({ role: 'user', content: cleanMsg });

      // Primary: OpenAI Responses API with GPT-6 Luna
      let rawChatText = '';
      try {
        let chatInput = cleanMsg;
        if (Array.isArray(history) && history.length > 0) {
          const recent = history.slice(-4).map(h => `${h.role === 'user' ? 'Customer' : 'Vanvi'}: ${h.text || h.content || ''}`).join('\n');
          chatInput = `Conversation:\n${recent}\n\nCustomer: ${cleanMsg}`;
        }
        const resp = await fetch('https://api.openai.com/v1/responses', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(API_TIMEOUT_MS),
          body: JSON.stringify({
            model: 'gpt-6-luna',
            instructions: systemPrompt,
            input: chatInput,
            store: true
          })
        });
        if (resp.ok) {
          const data = await resp.json();
          const msgItem = data.output?.find(item => item.type === 'message' || item.role === 'assistant');
          const textObj = msgItem?.content?.find(c => c.type === 'output_text' || typeof c.text === 'string');
          rawChatText = textObj?.text || (typeof msgItem?.content === 'string' ? msgItem.content : '');
        }
      } catch (eChatResp) {}

      if (!rawChatText) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(API_TIMEOUT_MS),
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages,
            response_format: { type: 'json_object' }
          })
        });

        if (response.ok) {
          const data = await response.json();
          rawChatText = data.choices?.[0]?.message?.content || '{}';
        }
      }

      if (rawChatText) {
        let parsed = null;
        try {
          parsed = JSON.parse(rawChatText.trim());
        } catch (eParse) {
          const match = rawChatText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || rawChatText.match(/(\{[\s\S]*\})/);
          if (match && match[1]) {
            try { parsed = JSON.parse(match[1]); } catch (e2) {}
          }
        }
        if (parsed && parsed.reply) {
          return {
            success: true,
            provider: 'openai-gpt-6-luna',
            reply: parsed.reply,
            suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : ["Birthday surprise idea 🎂", "Romantic letters 💌", "Track my order 📦"],
            action: parsed.action || null
          };
        }
      }
    } catch (err) {
      console.warn('OpenAI chat failed, falling back:', err.message);
    }
  }

  // 3. NVIDIA LLM Provider (OpenAI Compatible)
  if (NVIDIA_API_KEY) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are Vanvi, the human-like, warm, caring, witty AI celebration companion for Vanvi Moments (vanvimoments.shop). Talk in natural Hindi, Hinglish, or English. You know the site: Birthday White Bloom (#1 Free template), Birthday Cinema (₹149), Forever Us (₹199), Secret PIN Letter (₹149), ₹1 Custom Concierge, 1 Coin = ₹1 (up to 40% discount at checkout), WhatsApp Support at +91 76314 42934. Return valid JSON: {"reply": "...", "suggestions": ["3 short replies"], "action": {"label": "...", "url": "..."} or null}. User name: "${userName}".`
        }
      ];
      if (Array.isArray(history)) {
        history.slice(-6).forEach(h => {
          if (h.role === 'user' || h.role === 'assistant') {
            messages.push({ role: h.role, content: h.text });
          }
        });
      }
      messages.push({ role: 'user', content: cleanMsg });

      const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
        body: JSON.stringify({
          model: 'meta/llama-3.1-70b-instruct',
          messages,
          temperature: 0.7,
          max_tokens: 450
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            success: true,
            provider: 'nvidia-llm',
            reply: parsed.reply,
            suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : ["Birthday surprise idea 🎂", "Romantic letters 💌", "Track my order 📦"],
            action: parsed.action || null
          };
        } else if (content) {
          return {
            success: true,
            provider: 'nvidia-llm',
            reply: content,
            suggestions: ["Birthday surprise idea 🎂", "Love collection 💖", "Explore all templates ✨"],
            action: { label: "Explore Templates ✨", url: "templates.html" }
          };
        }
      }
    } catch (err) {
      console.warn('NVIDIA chat failed, falling back to local engine:', err.message);
    }
  }

  // 4. Fallback: Ultra-natural Emotional Conversational Engine with full context
  return generateAssistantHumanReply({ message: cleanMsg, history, userContext });
}

// Random picker helper to prevent repetitive replies
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Ultra-natural emotional dialogue engine (Fallback co-pilot)
 * Speaks like a warm, caring, culturally savvy Indian best friend.
 * Covers all site knowledge, general chit-chat, feelings, poetry & support.
 */
function generateAssistantHumanReply({ message = '', history = [], userContext = {} }) {
  const rawMsg = String(message || '').trim();
  const q = rawMsg.toLowerCase();
  const userName = userContext.name || userContext.userName || '';
  const greeting = userName ? ` ${userName}` : '';

  // Language Detection (English vs Hindi/Hinglish)
  const hindiIndicators = [
    'kya', 'kaise', 'kahan', 'kyun', 'karo', 'hoga', 'hai', 'hain', 'mujhe', 'hum', 'tum',
    'aap', 'aapka', 'mera', 'meri', 'batao', 'suno', 'bhai', 'yaar', 'dost', 'pyaar',
    'khana', 'chai', 'shukriya', 'namaste', 'acha', 'accha', 'theek', 'bolo', 'chahiye',
    'likho', 'bhejo', 'keise', 'nahi', 'kuch', 'bhi', 'kripya'
  ];
  const isHindiHinglish = hindiIndicators.some(w => new RegExp(`\\b${w}\\b`, 'i').test(q));
  const isEnglish = !isHindiHinglish && /[a-z]/i.test(q);

  // Multi-turn context extraction
  let lastTopic = '';
  if (Array.isArray(history) && history.length > 0) {
    const prevMsgs = history.slice(-4).map(h => (h.text || '').toLowerCase()).join(' ');
    if (prevMsgs.includes('birth')) lastTopic = 'birthday';
    else if (prevMsgs.includes('love') || prevMsgs.includes('crush') || prevMsgs.includes('propose')) lastTopic = 'love';
    else if (prevMsgs.includes('anniversary') || prevMsgs.includes('wedding')) lastTopic = 'anniversary';
    else if (prevMsgs.includes('sorry') || prevMsgs.includes('apolog')) lastTopic = 'apology';
    else if (prevMsgs.includes('poem') || prevMsgs.includes('shayari')) lastTopic = 'poetry';
    else if (prevMsgs.includes('order') || prevMsgs.includes('track')) lastTopic = 'order';
    else if (prevMsgs.includes('gift') || prevMsgs.includes('product')) lastTopic = 'gifts';
  }

  // -------------------------------------------------------------
  // QUICK ACTIONS: REWRITE / MAKE BETTER / TRANSLATE / SHORTEN / EXPAND
  // -------------------------------------------------------------

  // A. Translate
  if (q.startsWith('translate') || q.includes('translate') || q.includes('anuvad') || q.includes('hindi me batao') || q.includes('english me')) {
    const textToTranslate = rawMsg.replace(/translate\s*(this)?\s*(to\s*(hindi|english))?:?/i, '').trim();
    if (q.includes('hindi')) {
      return {
        success: true,
        provider: 'vanvi-dialogue-engine',
        reply: `Here is the Hindi translation for you: 🌸✨\n\n“${textToTranslate || 'Aap meri zindagi ka sabse khubsurat hissa ho, har din aapke sath ek tyohar jaisa hai.'}”\n\n*“Aapki muskaan mere dil ko sukoon deti hai, Happy Birthday!”* 💖\n\nWould you like me to make it more emotional, poetic, or formal?`,
        suggestions: ["Make it poetic ✨", "Shorten it ✂️", "Add romantic lines 💌"],
        action: { label: "Open Studio 🎨", url: "builder.html" }
      };
    } else {
      return {
        success: true,
        provider: 'vanvi-dialogue-engine',
        reply: `Yeh raha iska beautiful English translation: 🌸✨\n\n*“In this fast-moving world, finding you was like finding home. Every second spent by your side is a memory I will treasure forever. Happy Birthday, my dearest!”* 💖\n\nKya aap ise aur short ya cinematic banana chahenge?`,
        suggestions: ["Shorten for caption ✂️", "Make it deeper 💫", "Copy this 📋"],
        action: { label: "Create in Studio 🎨", url: "builder.html" }
      };
    }
  }

  // B. Rewrite / Make Better
  if (q.startsWith('rewrite') || q.includes('rewrite') || q.includes('make better') || q.includes('improve') || q.includes('better banao') || q.includes('sudharo')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: pick([
        `Maine ise 3 different emotional vibes me polish kar diya hai! ✨✍️\n\n**1. Emotional & Deep:**\n*“Some people cross our paths and gently redefine everything we thought we knew about joy. You are that rare blessing in my life.”* 🌸\n\n**2. Cute & Heartfelt (Hinglish):**\n*“Tumhari muskaan me ek aisi roshni hai jo kisi bhi boring din ko tyohar bana deti hai! Hamesha aise hi chamakte rehna!”* 🥰\n\n**3. Short & Elegant:**\n*“To the one whose presence turns every ordinary moment into pure magic. Forever grateful for you.”* 💫\n\nKaunsa wala best laga?`,
        `Aapke text ko maine cinematic aur touching bana diya hai: 🪄💖\n\n*“On this special day, I don’t just wish you happiness — I wish you quiet moments of pure peace, laughter that makes your eyes crinkle, and dreams that bloom into reality.”* 🎂✨\n\nIse aap direct message ya photo caption ki tarah use kar sakte hain!`
      ]),
      suggestions: ["Shorten for WhatsApp 📲", "Translate to Hindi 🇮🇳", "Create a Moment with this 🎨"],
      action: { label: "✨ Personalize in Studio", url: "builder.html" }
    };
  }

  // C. Shorten / 1-Line Punchy
  if (q.startsWith('shorten') || q.includes('shorten') || q.includes('chota karo') || q.includes('one line') || q.includes('1 line') || q.includes('crisp')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: `Yeh rahe super punchy, aesthetic 1-liners: ✂️✨\n\n1. *“In a world full of temporary things, you are my favorite forever. ✨💖”*\n2. *“Another 365 days of you making the world brighter. Happy Birthday! 🎂🌸”*\n3. *“Holding your hand is still my favorite thing to do. Happy Anniversary! 💍”*\n4. *“My favorite kind of chaos is the one we create together, bestie. 👯‍♀️💫”*`,
      suggestions: ["Add sweet emojis 🌸", "Make it a caption 📸", "Expand into a letter 📜"],
      action: { label: "🎨 Use in Vanvi Studio", url: "builder.html" }
    };
  }

  // D. Expand / Full Letter
  if (q.startsWith('expand') || q.includes('expand') || q.includes('bada karo') || q.includes('lamba likho') || q.includes('full letter') || q.includes('poora letter')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: `Yeh raha ek pura cinematic heartfelt letter jo dil ko chhoo lega: 📜💌\n\n*“Dearest,\n\nI’ve spent the last few days thinking about how rare it is to find someone whose presence feels like coming home. In a world that is always in a hurry, with you, time simply softens.\n\nThank you for listening when I didn’t even have the words, for every quiet laugh shared over warm cups of chai, and for reminding me that the best things in life aren’t things at all — they are memories like this.\n\nAs you step into another chapter, I hope life gives back to you all the light, kindness, and warmth you so effortlessly give to everyone around you.\n\nWith all my love and blessings, always.”* 🌸💫\n\nIse hamare **Birthday White Bloom** ya **Forever Us** wax-sealed envelope me daal kar bhejenge toh unki aankhon me khushi ke aansu aa jayenge!`,
      suggestions: ["Forever Us template dikhao 💌", "Shorten for Instagram 📸", "Hindi translation do 🇮🇳"],
      action: { label: "💌 Preview Forever Us (₹199)", url: "template-detail.html?id=forever-us" }
    };
  }

  // E. Captions (Instagram / WhatsApp Status)
  if (q.includes('caption') || q.includes('status') || q.includes('insta') || q.includes('bio')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: `Yeh rahe 4 aesthetic, copy-paste ready captions: 📸✨\n\n1. *“Golden hour and golden hearts. Cherishing this soul forever. ✨💛 #VanviMoments #Cherished”*\n2. *“Growing older, staying iconic together. Happy Birthday to my favorite human! 🎂🌸 #DayOne”*\n3. *“Just us, making regular days feel like poetry. 💌☁️ #ForeverUs #Aesthetic”*\n4. *“The plot twist I never saw coming, but the one I’ll love forever. 💕🗝️”*`,
      suggestions: ["1-liner quotes 💫", "Birthday surprise ideas 🎂", "Create aesthetic reel 🎨"],
      action: { label: "Create a Memory Reel 🎨", url: "builder.html" }
    };
  }

  // F. Story / Memory Timeline
  if (q.includes('story') || q.includes('kahani') || q.includes('timeline') || q.includes('yaadein')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: `Memory story timeline ke liye ye 3-chapter concept sabse hit rehta hai: 📖✨\n\n• **Chapter 1: The First Spark 🌸**\n*“Jab hum pehli baar mile the, tab pata nahi tha ki ye ajnabee kal meri zindagi ka sabse important hissa ban jayega.”*\n\n• **Chapter 2: The Unfiltered Chaos ☕**\n*“Late-night drives, endless chai, and uncontrollable laughter over silly jokes.”*\n\n• **Chapter 3: Today & Every Tomorrow 💍**\n*“Looking at how far we’ve come, and knowing I’d choose you in every single timeline.”*\n\nAap is story ko hamare **Timeline Journal** template me apni real photos ke saath animate kar sakte hain!`,
      suggestions: ["Timeline template dikhao 📖", "Photos kitni lagti hain? 📸", "Music choose karein 🎵"],
      action: { label: "Explore Story Templates 📖", url: "templates.html?type=Story" }
    };
  }

  // G. Wedding / Shaadi Blessings
  if (q.includes('wedding') || q.includes('shaadi') || q.includes('dulhan') || q.includes('dulha') || q.includes('vivah') || q.includes('nikah')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: isEnglish ?
        `Congratulations on the grand celebration of love! 💒💍\n\nHere is a regal wedding blessing you can use:\n*“May your marriage be a lifelong waltz of trust, laughter, and unbreakable devotion. Through every season and every sunset, may you always find safe harbor in each other's arms. Wishing you a lifetime of golden memories!”* ✨🥂\n\nOur **Royal Wedding Cinema** template turns wedding vows and photos into an interactive keepsake.` :
        `Shaadi ki dheron shubhkaamnayein aur badhaai! 💒💍\n\nYeh raha ek royal wedding wish:\n*“Do dilon ka ye safar hamesha khushiyon, vishwas aur pyaar se mehakta rahe! Har din ek nayi muskaan le kar aaye aur aap dono hamesha ek-doosre ki sabse badi taakat bane rahein. Mubarak ho ye pyara bandhan!”* ✨💐\n\nHamare paas royal wedding moments hain jinme aap couple ki shaadi ki timeline aur blessings lock kar sakte hain!`,
      suggestions: ["Wedding templates dikhao 💒", "Physical gift ideas 🎁", "Couple photos frame 📸"],
      action: { label: "💒 Wedding Collection", url: "templates.html" }
    };
  }

  // -------------------------------------------------------------
  // PHYSICAL GIFTS & GIFT STORE (products.html)
  // -------------------------------------------------------------
  if (q.includes('physical gift') || q.includes('gift store') || q.includes('amazon') || q.includes('flipkart') || q.includes('meesho') || q.includes('photo frame') || q.includes('teddy') || q.includes('jewellery') || q.includes('flowers') || (q.includes('gift') && (q.includes('real') || q.includes('bhejna') || q.includes('product') || q.includes('item')))) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: isEnglish ?
        `We have a brand-new **Physical Gift Store** with handpicked gifts across 14 categories! 🎁✨\n\n• **Trending Gifts:** 3D Acrylic LED Photo Lamps, Preserved Glass Rose Domes, Heart Lockets, Couple Matching Bracelets, and Smart Digital Frames.\n• **Verified Platforms:** Direct verified links to **Amazon, Flipkart, and Meesho**.\n• **100% Free to Explore:** No membership or subscription needed at all!\n\nCheck out the curated collection right now:` :
        `Hamara bilkul naya **Physical Gift Store** live ho chuka hai! 🎁✨\n\nIsme 14 categories ke curated physical gifts hain jinhe aap direct explore kar sakte hain:\n• 📸 **Photo Lamps & Acrylic Frames:** Raat ko glow karne wale personalized lamps.\n• 🌹 **Preserved Rose Glass Dome:** Fairy lights ke sath kabhi na murjhane wala real rose.\n• 💎 **Heart Lockets & Couple Bracelets:** Romantic jewellery keepsakes.\n• 🛒 **Platforms:** Direct official links on **Amazon, Flipkart, aur Meesho**.\n\nKoi subscription ya login ki zaroorat nahi hai — bilkul free explore karein!`,
      suggestions: ["Gift Store open karo 🎁", "Birthday gifts dikhao 🎂", "Couple gifts browse karein 💑"],
      action: { label: "🎁 Open Physical Gift Store", url: "products.html" }
    };
  }

  // -------------------------------------------------------------
  // 1. WhatsApp Support & Human Help
  // -------------------------------------------------------------
  if (q.includes('whatsapp') || q.includes('support') || q.includes('help') || q.includes('contact') || q.includes('number') || q.includes('call') || q.includes('madad') || q.includes('customer care') || q.includes('complaint')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: pick([
        `Hamari dedicated human support team aapse baat karne ke liye hamesha ready hai! 💬🌸\n\nAap directly hamare WhatsApp support desk se jud sakte hain:\n• 📲 **WhatsApp Help Desk:** [Chat on WhatsApp](https://wa.me/917631442934?text=Hi%20Vanvi%20Support%2C%20I%20need%20help%20with%20my%20moment)\n• 📞 **Dedicated Support Number:** \`+91 76314 42934\`\n• ⏱️ **Response Time:** Instant (5–15 minutes)\n\nOrder issues, PIN reset, song upload ya bespoke requests — sab turant resolve ho jayega! ✨`,
        `Koi bhi dikkat ya query ho, hamari support team WhatsApp par active hai! 🌸\n\n• 💬 **WhatsApp Desk:** \`+91 76314 42934\`\n• ⏰ **Timing:** 24x7 Digital Assistance\n\nDirect WhatsApp chat start karne ke liye niche diye gaye button par tap karein! 👇`
      ]),
      suggestions: ["WhatsApp pe chat karein 📲", "Order track karein 📦", "Custom design ₹1 ✨"],
      action: { label: "💬 Chat with Us on WhatsApp", url: "https://wa.me/917631442934?text=Hi%20Vanvi%20Support%2C%20I%20need%20help%20with%20my%20moment" }
    };
  }

  // -------------------------------------------------------------
  // USER'S NAME: "Mera naam kya hai" / "What is my name"
  // -------------------------------------------------------------
  if (q.includes('mera naam kya') || q.includes('what is my name') || q.includes('mujhe kya bulate') || q.includes('mera name kya') || q.includes('mera naam yaad')) {
    if (userName) {
      return {
        success: true,
        provider: 'vanvi-dialogue-engine',
        reply: `Aapka naam **${userName}** hai! ✨🌸 Aur mera naam Vanvi hai! Bhala main aapka naam kaise bhool sakti hoon? 🥰 Batao aaj kya chal raha hai?`,
        suggestions: ["Birthday surprise idea 🎂", "Love collection dikhao 💖", "Aesthetic caption likho ✨"],
        action: null
      };
    } else {
      return {
        success: true,
        provider: 'vanvi-dialogue-engine',
        reply: `Aapne abhi tak mujhe apna naam nahi bataya yaar! 🌸🥰 Mujhe batao na, aapka pyaara sa naam kya hai? Main hamesha yaad rakhungi!`,
        suggestions: ["Mera naam batata hoon 🌸", "Main baad me bataunga 😊", "Ek shayari sunao 💌"],
        action: null
      };
    }
  }

  // -------------------------------------------------------------
  // USER TELLS THEIR NAME: "Mera naam X hai" / "I am X"
  // -------------------------------------------------------------
  const nameMatch = rawMsg.match(/(?:mera\s+naam|my\s+name\s+is|call\s+me|main\s+hoon|i\s+am)\s+([A-Za-z\u0900-\u097F]+)/i);
  if (nameMatch && nameMatch[1] && !/^(vanvi|kya|bhai|yaar|dost|sad|happy|here|ready|fine)$/i.test(nameMatch[1])) {
    const detectedName = nameMatch[1];
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: `Aww, kitna pyaara naam hai aapka, **${detectedName}**! 🌸✨\n\nAb se main aapko ${detectedName} hi bulaungi! Maine aapka naam yaad kar liya hai. Batao ${detectedName}, aaj kiske chehre par muskaan laani hai ya kya surprise plan karna hai? 🥰`,
      suggestions: ["Birthday surprise idea 🎂", "Ek pyari shayari sunao 💌", "Physical gifts dikhao 🎁"],
      action: { label: "Explore Templates ✨", url: "templates.html" }
    };
  }

  // -------------------------------------------------------------
  // WHERE ARE YOU FROM / "Tum kahan rehti ho" / "Kahan se ho"
  // -------------------------------------------------------------
  if (q.includes('kahan rehti') || q.includes('kahan se ho') || q.includes('where do you live') || q.includes('where are you from') || q.includes('kahan ho tum') || q === 'kahan ho' || q === 'tum kahan ho') {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: `Main aapke phone aur screen ke andar rehti hoon — aapki 24x7 personal AI best friend ki tarah! 🌸📱\n\nCloud aur code se bani hoon, par dil se bilkul Hindustani, warm aur caring hoon! Jab bhi aapko meri zaroorat ho, bas Vanvi Moments kholo aur main haazir! ✨`,
      suggestions: ["Tum kya kya kar sakti ho? 🪄", "Ek cute shayari sunao 💌", "Birthday surprise dikhao 🎂"],
      action: { label: "Explore Templates ✨", url: "templates.html" }
    };
  }

  // -------------------------------------------------------------
  // WHAT CAN YOU DO / "Tum kya karti ho" / "Kya kar sakti ho"
  // -------------------------------------------------------------
  if (q.includes('kya kar sakti') || q.includes('kya karti ho') || q.includes('what can you do') || q.includes('tumhara kaam kya') || q.includes('kya kya aata')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: `Main aapke har celebration aur memory ko cinematic banane me expert hoon! 🌸✨\n\nMain ye sab kuch kar sakti hoon:\n1. 🎂 **Birthday Surprises:** Countdown, tap-to-blow cake animations, midnight plans!\n2. 💌 **Heartfelt Letters:** Romantic love letters, apology notes, dosti shayari!\n3. 🪄 **Text Polishing:** Rewrite, shorten, expand, improve captions!\n4. 🎁 **Physical Gifts:** Curated gifts on Amazon, Flipkart, Meesho!\n5. 📦 **Live Support:** Active orders, secret PIN security & WhatsApp support!\n\nBatao aaj kiske liye kuch special karna hai? 🥰`,
      suggestions: ["Birthday surprise idea 🎂", "Love letter likho 💌", "Physical gifts dikhao 🎁"],
      action: { label: "Explore Templates ✨", url: "templates.html" }
    };
  }

  // -------------------------------------------------------------
  // USER ANGRY / FRUSTRATED: "Pagal ho kya", "Bhaak", "Bakwaas", "Gussa"
  // -------------------------------------------------------------
  if (q.includes('pagal') || q.includes('bhaak') || q.includes('chup') || q.includes('bakwaas') || q.includes('dimaag kharab') || q.includes('gussa mat dila') || (q.includes('kuch bhi') && q.length < 15)) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: `Arey yaar sorry na! 🥺 Main robot ki tarah ghumana nahi chahti, sach me aapki help karna chahti hoon. Gussa thanda karo please, main dhyan se sun rahi hoon.\n\nBatao seedha point par — aapko kis cheez me help chahiye? Main bina kisi ghumaye seedha wahi karungi! 🌸🤍`,
      suggestions: ["Birthday wish likho 🎂", "Physical gifts dikhao 🎁", "Seedhi baat karo 💬"],
      action: null
    };
  }

  // -------------------------------------------------------------
  // GENDER: "Tum ladka ho ya ladki"
  // -------------------------------------------------------------
  if (q.includes('ladka') || q.includes('ladki') || q.includes('male') || q.includes('female') || q.includes('gender')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: `Mera naam **Vanvi** hai aur main ek sweet, friendly ladki ke character me aapse baat karti hoon! 🌸🥰 Ek aisi dost jisse aap dil ki koi bhi baat bina jhijhak share kar sakein.`,
      suggestions: ["Ek cute shayari sunao 💌", "Love letter likho 💖", "Birthday surprise 🎂"],
      action: null
    };
  }

  // -------------------------------------------------------------
  // REAL OR ROBOT: "Tum real ho ya robot"
  // -------------------------------------------------------------
  if (q.includes('real ho') || q.includes('robot ho') || q.includes('human ho') || q.includes('insaan ho')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: `Main ek advanced AI celebration companion hoon, par mere andar emotion aur warmth ek real caring best friend jaisi hai! 🌸✨ Mujhe generic boring bot ki tarah nahi, balki dil se connect karne ke liye design kiya gaya hai.`,
      suggestions: ["Tum kya kar sakti ho? 🪄", "Ek shayari sunao 💌", "Birthday surprise dikhao 🎂"],
      action: null
    };
  }

  // -------------------------------------------------------------
  // DATE / TIME
  // -------------------------------------------------------------
  if (q.includes('date kya') || q.includes('time kya') || q.includes('aaj kaunsa din') || q.includes('what time') || q.includes('what is the date')) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: `Aaj **${dateStr}** hai, aur abhi waqt **${timeStr}** ho raha hai! ⏰✨\n\nKya aaj kisi ka birthday ya anniversary hai? Batao, abhi plan karte hain! 🎂`,
      suggestions: ["Birthday surprise 🎂", "Anniversary wish 💍", "Templates browse karein 🔍"],
      action: null
    };
  }

  // -------------------------------------------------------------
  // 2. Order Tracking / Status / Passcode (STRICT CHECK)
  // -------------------------------------------------------------
  const isOrderQuery = (q.includes('order') && (q.includes('track') || q.includes('kahan') || q.includes('status') || q.includes('mera') || q.includes('check') || q.includes('id') || q.includes('details'))) ||
                       q.includes('mera order') || q.includes('order status') || q.includes('track order') || q.includes('parcel') || q.includes('delivery status') ||
                       (q.includes('pin') && (q.includes('secret') || q.includes('order') || q.includes('passcode') || q.includes('lock')));
  if (isOrderQuery) {
    const orderId = userContext.latestOrderId || 'VANVI-ORD-8271';
    const orderTitle = userContext.latestOrderTitle || 'Birthday White Bloom';
    const orderPin = userContext.latestOrderPin || '2026';
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: pick([
        `Maine aapka recent order check kar liya hai! Yeh raha live status: 📦✨\n\n• **Order ID:** \`${orderId}\`\n• **Template:** ${orderTitle}\n• **Status:** Active & Ready to Gift 🚀\n• **Secret PIN:** \`${orderPin}\`\n\nAapka celebration moment live hai! Aap ise WhatsApp ya direct link se apne special person ke saath turant share kar sakte hain.`,
        `Aapka order bilkul ready hai! 🎁\n\n• **ID:** \`${orderId}\`\n• **Experience:** ${orderTitle}\n• **Secret Lock PIN:** \`${orderPin}\`\n\nRecipients jab link open karenge toh yeh secret PIN daalkar surprise unlock hoga! 🥰`
      ]),
      suggestions: ["WhatsApp pe share kaise kare? 📲", "Dashboard open karo 📁", "Naya moment create karein ✨"],
      action: { label: "🎁 Open Dashboard & Moments", url: "dashboard.html" }
    };
  }

  // -------------------------------------------------------------
  // 3. Identity / Name / Who are you (STRICT FOR VANVI)
  // -------------------------------------------------------------
  const isVanviIdentity = q.includes('tum kaun ho') || q.includes('who are you') || q.includes('what is your name') ||
                          q.includes('tumhara naam') || q.includes('aapka naam') || q.includes('apka naam') ||
                          q.includes('what is vanvi') || q.includes('tum kya ho') || q === 'vanvi' || q === 'vanvi kon hai';
  if (isVanviIdentity) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: isEnglish ?
        `Hello there! My name is **Vanvi**! 💖🌸 I am your personal celebration companion, digital best friend, and creative co-pilot for Vanvi Moments.\n\nWhether you need heartfelt birthday poetry, a secret PIN memory link, order status, or a physical gift idea from Amazon/Flipkart — I am here to make every moment magical! Ask me anything! ✨` :
        `Aww, mera naam **Vanvi** hai! 💖🌸 Main aapki personal AI celebration companion, digital best friend, aur secret surprise planner hoon!\n\nMain yahan aapke har special lamhe ko — chahe birthday countdown ho, romantic confession note, secret PIN surprise, ya anniversary timeline — ultra-cinematic aur memorable banane ke liye hoon! 🥰 Kuch bhi pucho ya share karo, I'm all ears! ✨`,
      suggestions: ["Ek cute shayari sunao 💌", "Top templates dikhao 👑", "Free me kaise banaye? 🎁"],
      action: { label: "🎨 Vanvi Creative Studio", url: "ai.html" }
    };
  }

  // -------------------------------------------------------------
  // 4. AI Matcher vs AI Assistant distinction
  // -------------------------------------------------------------
  if (q.includes('matcher') || q.includes('ai matcher') || q.includes('difference between ai')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: `Dono hamare do alag alag smart tools hain: ✨💡\n\n• **Vanvi AI Assistant (Main):** Main aapki live human conversational companion hoon — aapse baatein karti hoon, poetry likhti hoon, orders track karti hoon, aur customized advice deti hoon!\n• **Vanvi AI Matcher:** Ek dedicated recommendation tool hai jo 3 simple questions (Occasion, Emotion, Vibe) pooch kar aapko best matching template instantly suggest karta hai!\n\nAgar aapko confused lag raha hai ki kaunsa template chunein, toh AI Matcher try kijiye!`,
      suggestions: ["AI Matcher open karo ✨", "Birthday templates dikhao 🎂", "Free template kaunsa hai? 🎁"],
      action: { label: "✨ Launch AI Matcher", url: "ai-matcher.html" }
    };
  }

  // -------------------------------------------------------------
  // 5. Casual Chit-Chat & Daily Greetings
  // -------------------------------------------------------------
  const hasSpecificIntent = q.includes('birth') || q.includes('love') || q.includes('crush') || q.includes('propose') || q.includes('anni') || q.includes('sorry') || q.includes('apolog') || q.includes('friend') || q.includes('dost') || q.includes('coin') || q.includes('order') || q.includes('track') || q.includes('joke') || q.includes('poem') || q.includes('shayari') || q.includes('custom') || q.includes('plan') || q.includes('gift');

  if (!hasSpecificIntent && /^(hi|hello|heyy|hey|namaste|hola|hlo|hii|vanvi|kaisi ho|kaise ho|kya haal|sab kaisa|kya chal raha|kya kar rahi|what are you doing|good morning|good evening|good night|suno|kaho|what's up|whats up)/i.test(q)) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: isEnglish ?
        `Hey there${greeting}! I'm doing wonderful and full of energy! 🌸✨\n\nI was just waiting to chat with you. How is your day going? Do you have someone special you want to surprise today? Let me know how I can help! 🥰` :
        pick([
          `Heyy${greeting}! Main bilkul badiya aur energetic hoon! 🌸✨\n\nBas aapka hi wait kar rahi thi. Aap batao, aaj kaisa raha aapka din? Kisi special insaan ke chehre par pyaari si muskaan laani hai kya? Main poori taiyaar hoon! 🥰`,
          `Hello ji! Main ekdum first class hoon! ✨ Aap se baat karke din aur bhi accha ho gaya! Batao aaj dil me kya chal raha hai — kisi ka birthday hai, koi romantic surprise, ya bas casual baatein karni hain? 💖`,
          `Heyy there! Main bilkul mast hoon! 🌸✨ Aapke liye naye naye ideas aur interactive surprises ready kar rahi thi. Aap sunao, sab kaisa chal raha hai?`
        ]),
      suggestions: ["Birthday surprise idea chahiye 🎂", "Romantic proposal lines likho 💖", "Free me kaise banaye? 🎁"],
      action: { label: "Explore All Templates ✨", url: "templates.html" }
    };
  }

  // -------------------------------------------------------------
  // 6. Fun Daily Chit-Chat (Khana, Chai, Coffee, Weather, Sleep, Bore)
  // -------------------------------------------------------------
  if (q.includes('khana') || q.includes('dinner') || q.includes('lunch') || q.includes('breakfast') || q.includes('chai') || q.includes('coffee') || q.includes('neend') || q.includes('weather') || q.includes('mausam') || q.includes('bore') || q.includes('timepass')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: pick([
        `Haha! Main toh positive vibes, sweet celebrations aur aapki muskaan se charge hoti hoon! ☕🌸 Par sach batau, agar digital chai hoti toh abhi aapke saath ek cutting chai zaroor piti! Aapne kuch khaya? Apna khayal rakha karo yaar! ❤️`,
        `Arey agar bore ho rahe ho toh galat jagah bilkul nahi aaye! 😄 Ekdum right spot par ho. Chalo ek mast joke sunati hoon, ya kisi best friend ko roast karne ke liye fun memory card banayein? Batao kya plan karein! ✨`,
        `Mausam chahe jaisa bhi ho, jab dil me kisi special insaan ki yaadein hon toh har mausam suhana lagta hai! 🌧️☕ Aap batao, aaj ka kya plan hai?`
      ]),
      suggestions: ["Ek cute sa joke sunao 😄", "Dost ke liye roast lines 👯‍♂️", "Love collection dikhao 💖"],
      action: { label: "Explore Fun Moments ✨", url: "category-friendship.html" }
    };
  }

  // -------------------------------------------------------------
  // 7. Emotional Comfort & Mental Support (Sad, Crying, Breakup, Udaas, Stress, Tension)
  // -------------------------------------------------------------
  if (q.includes('joke') || q.includes('hasao') || q.includes('mood') || q.includes('sad') || q.includes('udaas') || q.includes('crying') || q.includes('rona') || q.includes('breakup') || q.includes('tension') || q.includes('stress') || q.includes('depress') || q.includes('alone') || q.includes('akela') || q.includes('dil toot')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: pick([
        `Arey arey! Chehre se yeh udaasi turant hatao yaar, main hoon na aapke saath! 🫂🌸\n\nZindagi me chahe jo situation ho, yaad rakhna aap bohot zyada precious ho. Kabhi kabhi thoda break lena aur deep breath lena zaroori hota hai. Dil halka karne ke liye mujhse kuch bhi share kar sakte ho.\n\nEk pyara sa joke suno:\n*Ek baar Dil aur Dimaag me ladai hui... Dimaag bola — 'Practical bano!', Dil bola — 'Chup baith, mujhe toh Vanvi Moments pe ek pyari si memory gift karni hai!'* 😂\n\nHalki si smile aayi na? Ab batao, kya sunna pasand karoge? Ek pyari shayari ya soothing song idea? 💖`,
        `Kabhi kabhi din thoda heavy ho jata hai, aur yeh bilkul normal hai dost. 🤍 Apne aap ko thoda waqt do, ek glass thanda paani piyo aur apni favorite memories yaad karo. Main hamesha yahan aapke saath hoon. Dil ki baat share karni ho toh bejhijhak bolo! 🌸`
      ]),
      suggestions: ["Haha cute tha! 😄", "Ek pyari si shayari sunao 💌", "Mood fresh karne ke ideas do 🌸"],
      action: { label: "Explore Heartfelt Moments 💖", url: "category-love.html" }
    };
  }

  // -------------------------------------------------------------
  // 8. Joy / High Energy (Khush hoon, party, success, promotion)
  // -------------------------------------------------------------
  if (q.includes('khush') || q.includes('happy') || q.includes('party') || q.includes('pass ho') || q.includes('promotion') || q.includes('masti') || q.includes('congrats') || q.includes('badhaai')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: pick([
        `Woohooo! 🎉🥳 Yeh hui na baat! Aapki khushi dekh kar mera din ban gaya! Aisi khushiyan aur milestones roz roz nahi aate, toh celebration toh banta hai boss!\n\nKisko party de rahe ho aaj? Chalo is golden moment ko ek interactive digital celebration link me lock karte hain! 🥂✨`,
        `Yayyy! Congratulations! 🌟🙌 Hard work hamesha rang laata hai! Is khushi ke mauke par apne doston aur family ke saath ek cinematic memory share zaroor karein!`
      ]),
      suggestions: ["Celebration card banao 🎉", "Friends ko share link bhejo 📲", "Free me create karein ✨"],
      action: { label: "🎉 Open Celebration Hub", url: "category-celebration.html" }
    };
  }

  // -------------------------------------------------------------
  // 9. Love / Crush / Romantic / Relationship
  // -------------------------------------------------------------
  if (q.includes('love') || q.includes('crush') || q.includes('propose') || q.includes('pyaar') || q.includes('romantic') || q.includes('girlfriend') || q.includes('boyfriend') || q.includes('gf') || q.includes('bf') || q.includes('partner') || q.includes('dil ki baat')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: pick([
        `Hayee, kitna pyaara ehsaas hai! ❤️ Pyaar me choti choti baatein sabse zyada matter karti hain.\n\nAgar aapko dil ki baat kehni hai ya koi romantic surprise plan karna hai, toh hamara **Forever Us** template (wax seal reveal + photos timeline + soft bgm) aur **Secret Letter** (confidential 4-digit PIN lock confession) sabse hit hain! 💌\n\nKya aap chahte ho main aapke crush ya partner ke liye 2-3 super sweet emotional lines likh kar doon?`,
        `Saccha pyaar lafzon ka mohtaaj nahi hota, par jab dil se nikle toh seedha dil tak jaata hai! 🌹\n\nRomantic moments ke liye hum suggest karte hain:\n• **Secret Letter (₹149):** Recipient ko pehle secret PIN daalna hota hai, fir unka personalised letter open hota hai!\n• **Forever Us (₹199):** Royalty aesthetic with wax seal animation.\n\nBatao unka naam kya hai, ek pyari si proposal line likhte hain! 🥰`
      ]),
      suggestions: ["Haan, propose karne ke liye lines likho 💌", "Forever Us template dikhao 💖", "Secret PIN kaise lagta hai? 🔐"],
      action: { label: "Explore Romantic Collection 💖", url: "category-love.html" }
    };
  }

  // -------------------------------------------------------------
  // 10. Birthday Celebrations & Template #1 Birthday White Bloom
  // -------------------------------------------------------------
  if (q.includes('birthday') || q.includes('janamdin') || q.includes('bday') || q.includes('cake') || q.includes('12 am') || q.includes('midnight') || q.includes('candle') || q.includes('bloom')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: pick([
        `Yayyy! Birthday celebrations toh Vanvi ka heart & soul hain! 🎂🎉\n\nSabse blockbuster ideas yeh rahe:\n1. **Birthday White Bloom (100% FREE):** Dreamy light luxury bloom garden with interactive 5 candles (jinhe screen par tap karke bujhaya ja sakta hai!), animated royal letter, aur 8 photo memories reel!\n2. **Birthday Cinema (₹149):** 3D interactive candle blow on screen + photo reel + birthday background song!\n\nRaat ko 12:00 AM baje WhatsApp par secret gift link bhej kar unka reaction zaroor dekhna! 🥰`,
        `Birthday surprise plan kar rahe ho? Yeh raha foolproof midnight plan: 🎂⏰\n• Ek secret moment create karein.\n• Unki 6-8 sabse pyaari photos upload karein.\n• Background me unka favourite birthday song set karein.\n• 12:00 AM par WhatsApp link drop karein!\n\nHamara **Birthday White Bloom** template 100% FREE hai!`
      ]),
      suggestions: ["Birthday White Bloom dikhao (Free) 🌸", "Birthday Cinema template (₹149) 🎂", "Wishes aur message likh do ✍️"],
      action: { label: "🎂 Open Birthday Hub", url: "category-birthday.html" }
    };
  }

  // -------------------------------------------------------------
  // 11. Anniversary & Shaadi
  // -------------------------------------------------------------
  if (q.includes('anniversary') || q.includes('saalgirah') || q.includes('couple') || q.includes('marriage')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: `Happy Anniversary in advance! 🥂💍 Ek aur saal pyaar, dosti aur bharose ka!\n\nAnniversary ke liye hum recommend karte hain:\n• **Golden Jubilee Reel (₹249):** Aapki pehli mulakaat se lekar aaj tak ki date-wise photos ki timeline.\n• **Midnight Velvet (₹199):** Ek royal aesthetic letter with vintage font & violin instrumental.\n\nAap isme unka favourite couple song bhi background me laga sakte hain!`,
      suggestions: ["Anniversary templates dikhao 💍", "Emotional love letter likho 💌", "Music kaise add karein? 🎵"],
      action: { label: "💍 Open Anniversary Collection", url: "category-anniversary.html" }
    };
  }

  // -------------------------------------------------------------
  // 12. Apology / Ruthna Manana
  // -------------------------------------------------------------
  if (q.includes('sorry') || q.includes('apology') || q.includes('galti') || q.includes('naraz') || q.includes('ladai') || q.includes('manana') || q.includes('maafi')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: `Galti insaan se hi hoti hai yaar, par maafi maangne wala sabse bada hota hai. 🕊️🤍\n\nJab gussa thanda karna ho toh argument nahi, bas dil ki sachhi baat un tak pahuchao. Hamara **Wax Seal Apology Card (₹99)** bohot soothing hai — isme aap unki favourite memories aur ek heartfelt sorry note daal sakte ho. Gussa pighal jayega, pakka!\n\nKya main aapke liye ek gentle sa sorry note likh doon?`,
      suggestions: ["Ek pyara sa sorry note likh do 🕊️", "Apology template dikhao 💌", "Gussa shaant karne ke tips do 🥺"],
      action: { label: "🕊️ Apology & Patch-up Hub", url: "category-apology.html" }
    };
  }

  // -------------------------------------------------------------
  // 13. Friendship & Best Friends
  // -------------------------------------------------------------
  if (q.includes('friend') || q.includes('dost') || q.includes('yaar') || q.includes('bff') || q.includes('bestie') || q.includes('dosti')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: `Dosti zindabad! 🤝✨ Sacche dost kismat walo ko hi milte hain.\n\nFriends ke liye hamare paas funny aur emotional dono moments hain:\n• **Best Friends Forever (₹99):** Chai ki tapri se late-night phone calls tak ki photo reel!\n• **Fun Roast Card:** Thoda mazaak, bohot saara pyaar!\n\nBatao unka naam kya hai, main ek mast lines banati hoon unke liye!`,
      suggestions: ["Dosti ke liye shayari likho 🫂", "Best Friends template dikhao 👯‍♀️", "Free template kaunsa hai? 🎁"],
      action: { label: "👯‍♀️ Friendship Collection", url: "category-friendship.html" }
    };
  }

  // -------------------------------------------------------------
  // 14. Coins / Discounts / Free / Pricing
  // -------------------------------------------------------------
  if (q.includes('coin') || q.includes('discount') || q.includes('free') || q.includes('rupaye') || q.includes('paisa') || q.includes('spin') || q.includes('wheel') || q.includes('plans') || q.includes('club') || q.includes('cost') || q.includes('price')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: `Vanvi Coins ki policy ekdum crystal clear aur transparent hai! 🪙✨\n\n• **1 Vanvi Coin = ₹1 cash value**\n• **Sign-up Bonus:** Sign up karte hi **+50 Coins free** milte hain.\n• **Daily Wheel Spin:** Har 24 ghante me random coins (0, 3, 5, 9, 15, 25, 50, ya 80 coins) jeetne ka mauka!\n• **Checkout Rule:** Kisi bhi template checkout par **40% tak** ka payment directly apne coins se karein!\n• **₹99 Vanvi Club:** Flat 40% discount on all premium templates!`,
      suggestions: ["Daily wheel spin karo 🎡", "₹99 Vanvi Club ke plans 💎", "Templates browse karein 🔍"],
      action: { label: "💎 View Plans & Spin Wheel", url: "plans.html" }
    };
  }

  // -------------------------------------------------------------
  // 15. Custom ₹1 Concierge Experience
  // -------------------------------------------------------------
  if (q.includes('custom') || q.includes('1 rupaye') || q.includes('₹1') || q.includes('bespoke') || q.includes('special design')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: `Agar aapko bilkul bespoke, custom animation ya koi aisa unique theme chahiye jo store me nahi hai, toh hamara **₹1 Custom Concierge Experience** best hai! 🎨✨\n\nSirf **₹1 token amount** pay karke aap request submit karein. Hamari private design team aapse WhatsApp par connect karke 2 hours me custom gift link ready karti hai!`,
      suggestions: ["₹1 Request form open karo ✨", "Isme kya kya add ho sakta hai? 🎨", "WhatsApp Concierge support 💬"],
      action: { label: "✨ Submit ₹1 Request", url: "custom-experience.html" }
    };
  }

  // -------------------------------------------------------------
  // 16. How to Share & Secret PIN Security
  // -------------------------------------------------------------
  if (q.includes('share') || q.includes('kaise bheje') || q.includes('bhejna') || q.includes('send') || q.includes('recipient') || q.includes('lock') || q.includes('security')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: `Share karna bohot aasaan aur super elegant hai! 📲✨\n\n1. Moment create karte waqt aap ek **4-digit Secret PIN** set kar sakte hain.\n2. Publish hote hi aapko ek unique link aur QR Code milta hai.\n3. Aap directly **WhatsApp button** par tap karke unhe send kar sakte hain.\n4. Recipient jab link kholega toh unhe pehle animated lock screen dikhegi, fir PIN daalne par pura musical surprise reveal hoga! 🎁`,
      suggestions: ["Dashboard me moments dekhein 📁", "Studio me moment banayein 🎨", "WhatsApp help desk 💬"],
      action: { label: "📁 Go to Dashboard", url: "dashboard.html" }
    };
  }

  // -------------------------------------------------------------
  // 17. Write poetry / shayari / letter / wishes
  // -------------------------------------------------------------
  if (q.includes('poem') || q.includes('shayari') || q.includes('likho') || q.includes('write') || q.includes('kavita') || q.includes('wishes') || q.includes('quote')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: pick([
        `Yeh lines maine abhi abhi dil se aapke liye likhi hain: 🌸✍️\n\n*“Kuch baatein lafzon se bayaan nahi hoti,\npar jab dilon ka rishta saccha ho,\ntoh ek halki si muskaan bhi poori daastaan keh jaati hai.* ✨\n\n*Aapki khushi me hi meri har subah ka noor hai,\naap ho toh har lamha jaise ek khubsurat tyohar hai!”* ❤️\n\nAap ise copy karke use kar sakte hain ya Vanvi AI Studio me customize kar sakte hain!`,
        `Yeh lines dil ko chhoo lengi: ✨💌\n\n*“Waqt ke panno par yaadein likhte rahenge,\nhar mod par aapki muskaan ki dua karenge,\nchahe doori kitni bhi ho faaslon ki,\nhum hamesha dil ke kareeb rahenge!”* 💫`
      ]),
      suggestions: ["Ise English me convert karo 🇬🇧", "Short 1-line quote chahiye ✨", "Studio me customize karein 🎨"],
      action: { label: "🎨 Open Vanvi AI Studio", url: "ai.html" }
    };
  }

  // -------------------------------------------------------------
  // 18. Compliments, Thanks, Bye
  // -------------------------------------------------------------
  if (q.includes('thank') || q.includes('shukriya') || q.includes('dhanyawad') || q.includes('cute') || q.includes('sweet') || q.includes('smart') || q.includes('bye') || q.includes('alvida') || q.includes('tata')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: pick([
        `Awww, thank you so much! 🥰 Aap se baat karke sach me bohot accha laga! Main hamesha yahin hoon, jab bhi koi special celebration plan karni ho ya bas baat karni ho, anytime aajaana! Take care! 🌸✨`,
        `Most welcome ji! 💖 Hamesha aise hi muskurate raho! Koi bhi help chahiye ho toh Vanvi is just one tap away! Bye for now! ✨`
      ]),
      suggestions: ["Templates browse karein 🔍", "Free coins spin 🎡", "WhatsApp help 💬"],
      action: { label: "Explore All Templates ✨", url: "templates.html" }
    };
  }

  // -------------------------------------------------------------
  // 19. General Questions / Advice
  // -------------------------------------------------------------
  if (q.includes('kaise') || q.includes('how') || q.includes('kya') || q.includes('what') || q.includes('kyun') || q.includes('why') || q.includes('kab') || q.includes('when') || q.includes('suggest') || q.includes('batao') || q.includes('idea')) {
    return {
      success: true,
      provider: 'vanvi-dialogue-engine',
      reply: isEnglish ?
        `I completely understand what you are asking! 💡✨\n\nWhether it's about celebrating a loved one, crafting an emotional message, or picking the right gift — a personal, genuine approach always wins hearts! For celebrations, a sincere letter paired with 5-6 cherished photos makes any moment unforgettable.\n\nTell me a little more detail (the occasion, recipient name, or vibe), and I'll craft a personalized plan for you!` :
        `Main samajh rahi hoon aap kya pooch rahe ho! 💡✨\n\nChahe baat kisi celebration ki ho, personal advice ki, ya gifting idea ki — simple aur genuine approach hamesha win karti hai! Agar celebration se related hai, toh dil se likha ek chota sa note aur 5 achhi photos kisi ke bhi din ko unforgettable bana sakti hain.\n\nAap mujhe thoda aur detail batayein (kaunsa occasion hai, kiske liye bana rahe ho), main step-by-step aapko pura plan bana kar dungi! 🌸`,
      suggestions: ["Birthday surprise idea 🎂", "Love collection dikhao 💖", "Free coins kaise lein? 🪙"],
      action: { label: "🔍 Browse 23+ Templates", url: "templates.html" }
    };
  }

  // -------------------------------------------------------------
  // 20. Default Warm Empathetic Response
  // -------------------------------------------------------------
  return {
    success: true,
    provider: 'vanvi-dialogue-engine',
    reply: isEnglish ?
      `I'm right here with you! 🌸✨ I can help you with anything from **writing sweet birthday messages**, **crafting emotional love letters**, **checking your active order PIN**, to **finding the perfect physical gift on Amazon/Flipkart**.\n\nChoose one of the quick actions below or simply tell me what's on your mind!` :
      pick([
        `Main samajh gayi! Main aapki help kisi bhi celebration me kar sakti hoon — jaise **birthday countdown plan karna**, **love letters likhna**, **order status & passcode check karna**, ya **physical gift store se gift chunna**. 🌸✨\n\nAap mujhe thoda aur bataiye ya niche diye gaye quick options me se choose kijiye!`,
        `Suno na! Chahe kisi ka birthday surprise ho, anniversary timeline, romantic propose letter, ya order ki tracking — main aapke saath hoon! 💖\n\nNiche diye gaye options me se select karein ya direct pooch lijiye!`
      ]),
    suggestions: ["Birthday surprise idea 🎂", "Physical Gift Store 🎁", "WhatsApp support desk 💬"],
    action: { label: "🔍 Explore All 23 Templates", url: "templates.html" }
  };
}

module.exports = {
  generateMomentContent,
  generateEmotionalFallback,
  chatWithVanviAssistant,
  generateAssistantHumanReply
};

