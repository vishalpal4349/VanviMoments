const fs = require('fs');
const path = require('path');

const templates = [
  {
    id: 'heritage-maroon',
    name: 'Heritage Maroon — Rajputana Glory',
    slug: 'heritage-maroon',
    price: 2499,
    originalPrice: 4999,
    category: 'Wedding',
    badge: '👑 Royal Heritage',
    icon: '🏰',
    theme: {
      bgMain: '#2b070f',
      accent: '#d4af37',
      cardBg: '#fffaf4',
      textColor: '#1a0409',
      fontHead: "'Cinzel', serif",
      fontBody: "'Cormorant Garamond', serif"
    },
    heroTagline: '✦ Shahi Farman of Vivah ✦',
    desc: 'Inspired by Mewar royal palatial heritage with golden jharokha arches, Auspicious Shahi Farman, Rajasthani folk shehnai, and 1-click WhatsApp RSVP.'
  },
  {
    id: 'ivory-palace',
    name: 'Ivory Palace — Eternal Elegance',
    slug: 'ivory-palace',
    price: 2499,
    originalPrice: 4999,
    category: 'Wedding',
    badge: '🕊️ Imperial Ivory',
    icon: '🏛️',
    theme: {
      bgMain: '#1a1918',
      accent: '#d8c292',
      cardBg: '#ffffff',
      textColor: '#242220',
      fontHead: "'Playfair Display', serif",
      fontBody: "'Plus Jakarta Sans', sans-serif"
    },
    heroTagline: '✦ An Imperial Celebration ✦',
    desc: 'Pristine Italianate marble colonnades, white roses, pure champagne foil accents, and timeless quiet luxury.'
  },
  {
    id: 'midnight-gold',
    name: 'Midnight Gold — Celestial Vows',
    slug: 'midnight-gold',
    price: 2999,
    originalPrice: 5999,
    category: 'Wedding',
    badge: '✨ Starry Night',
    icon: '🌌',
    theme: {
      bgMain: '#080a14',
      accent: '#ffd700',
      cardBg: '#12162a',
      textColor: '#f1f5f9',
      fontHead: "'Cinzel', serif",
      fontBody: "'Outfit', sans-serif"
    },
    heroTagline: '✦ Written In The Stars ✦',
    desc: 'Deep cosmic obsidian backdrop, celestial starlight particles, luminous 24K gold foil typography, and astronomical wedding countdown.'
  },
  {
    id: 'pastel-garden',
    name: 'Pastel Garden — English Meadows',
    slug: 'pastel-garden',
    price: 1999,
    originalPrice: 3999,
    category: 'Wedding',
    badge: '🌸 English Bloom',
    icon: '🌿',
    theme: {
      bgMain: '#242f22',
      accent: '#e09f87',
      cardBg: '#fffbf7',
      textColor: '#233221',
      fontHead: "'Cormorant Garamond', serif",
      fontBody: "'Plus Jakarta Sans', sans-serif"
    },
    heroTagline: '✦ Under The Blossoming Canopy ✦',
    desc: 'Delicate peach petals, soft sage foliage, deckled paper edges, and romantic acoustic courtyard melodies.'
  },
  {
    id: 'south-indian-sacred',
    name: 'South Indian Sacred — Muhurtham',
    slug: 'south-indian-sacred',
    price: 2499,
    originalPrice: 4999,
    category: 'Wedding',
    badge: '🛕 Temple Auspicious',
    icon: '🪷',
    theme: {
      bgMain: '#3d0a14',
      accent: '#f59e0b',
      cardBg: '#fefcf8',
      textColor: '#29060c',
      fontHead: "'Cinzel', serif",
      fontBody: "'Cormorant Garamond', serif"
    },
    heroTagline: '✦ Shubh Mangala Muhurtham ✦',
    desc: 'Vedic chants, sacred mango leaf toranam, golden brass diya glow, traditional nadaswaram melodies, and sacred pheras.'
  },
  {
    id: 'minimal-editorial',
    name: 'Minimal Editorial — Vogue Love',
    slug: 'minimal-editorial',
    price: 2299,
    originalPrice: 4599,
    category: 'Wedding',
    badge: '🖤 Modern Editorial',
    icon: '📰',
    theme: {
      bgMain: '#111111',
      accent: '#c97a5b',
      cardBg: '#f7f7f5',
      textColor: '#111111',
      fontHead: "'Cinzel', serif",
      fontBody: "'Plus Jakarta Sans', sans-serif"
    },
    heroTagline: '✦ The Wedding Issue ✦',
    desc: 'High-fashion editorial layout, generous negative space, bold serif statements, and contemporary magazine aesthetics.'
  },
  {
    id: 'royal-mughal',
    name: 'Royal Mughal — Sheesh Mahal',
    slug: 'royal-mughal',
    price: 2999,
    originalPrice: 5999,
    category: 'Wedding',
    badge: '👑 Mughal Splendour',
    icon: '🕌',
    theme: {
      bgMain: '#092126',
      accent: '#d4af37',
      cardBg: '#faf6ee',
      textColor: '#081f23',
      fontHead: "'Cinzel', serif",
      fontBody: "'Cormorant Garamond', serif"
    },
    heroTagline: '✦ Dastan-e-Mohabbat ✦',
    desc: 'Intricate Sheesh Mahal jaali lattice motifs, deep peacock teal and imperial ruby accents with royal sitar melodies.'
  },
  {
    id: 'modern-champagne',
    name: 'Modern Champagne — Chic Soirée',
    slug: 'modern-champagne',
    price: 2199,
    originalPrice: 4399,
    category: 'Wedding',
    badge: '🥂 Champagne Chic',
    icon: '🍾',
    theme: {
      bgMain: '#1c1713',
      accent: '#d5bda5',
      cardBg: '#fdfbf9',
      textColor: '#241e18',
      fontHead: "'Playfair Display', serif",
      fontBody: "'Plus Jakarta Sans', sans-serif"
    },
    heroTagline: '✦ Toast To Forever ✦',
    desc: 'Effervescent champagne fizz accents, cashmere cream glassmorphic layers, modern jazz rhythm, and chic cocktail elegance.'
  },
  {
    id: 'celestial-wedding',
    name: 'Celestial Wedding — Cosmic Union',
    slug: 'celestial-wedding',
    price: 2799,
    originalPrice: 5499,
    category: 'Wedding',
    badge: '🔮 Cosmic Love',
    icon: '⭐',
    theme: {
      bgMain: '#0f051d',
      accent: '#e2b857',
      cardBg: '#1b0e31',
      textColor: '#f8fafc',
      fontHead: "'Cinzel', serif",
      fontBody: "'Plus Jakarta Sans', sans-serif"
    },
    heroTagline: '✦ When Two Universes Align ✦',
    desc: 'Mystical starlight nebulae, custom couple zodiac constellation mapping, ethereal cosmic glow, and interactive star blessings.'
  },
  {
    id: 'floral-romance',
    name: 'Floral Romance — Parisian Bloom',
    slug: 'floral-romance',
    price: 2299,
    originalPrice: 4499,
    category: 'Wedding',
    badge: '🌹 Parisian Chic',
    icon: '💐',
    theme: {
      bgMain: '#2e111a',
      accent: '#e07a5f',
      cardBg: '#fffaf8',
      textColor: '#2b0e17',
      fontHead: "'Playfair Display', serif",
      fontBody: "'Cormorant Garamond', serif"
    },
    heroTagline: '✦ La Vie En Rose ✦',
    desc: 'Lush blooming botanical arches, hand-pressed French florals, romantic acoustic waltz, and interactive scratch note reveal.'
  },
  {
    id: 'vintage-palace',
    name: 'Vintage Palace — Old World Mewar',
    slug: 'vintage-palace',
    price: 2499,
    originalPrice: 4999,
    category: 'Wedding',
    badge: '📜 Vintage Heritage',
    icon: '🕰️',
    theme: {
      bgMain: '#261710',
      accent: '#c6a052',
      cardBg: '#faf3e6',
      textColor: '#2e1c14',
      fontHead: "'Cinzel', serif",
      fontBody: "'Cormorant Garamond', serif"
    },
    heroTagline: '✦ Royal Gazette & Telegram ✦',
    desc: 'Aged sepia parchment, antique royal seal stamps, vintage typewriter notes, and timeless heritage charm.'
  },
  {
    id: 'contemporary-luxe',
    name: 'Contemporary Luxe — Architectural',
    slug: 'contemporary-luxe',
    price: 2899,
    originalPrice: 5799,
    category: 'Wedding',
    badge: '⚡ Avant-Garde Luxe',
    icon: '💎',
    theme: {
      bgMain: '#0a0a0a',
      accent: '#d97706',
      cardBg: '#18181b',
      textColor: '#fafafa',
      fontHead: "'Cinzel', serif",
      fontBody: "'Plus Jakarta Sans', sans-serif"
    },
    heroTagline: '✦ The Pinnacle of Modern Grandeur ✦',
    desc: 'Brushed titanium borders, deep matte black surfaces, magnetic 3D touch transitions, and ultra-crisp typography.'
  },
  {
    id: 'temple-grandeur',
    name: 'Temple Grandeur — Vedic Heritage',
    slug: 'temple-grandeur',
    price: 2499,
    originalPrice: 4999,
    category: 'Wedding',
    badge: '🛕 Vedic Mandapam',
    icon: '🕉️',
    theme: {
      bgMain: '#451006',
      accent: '#eab308',
      cardBg: '#fffbeb',
      textColor: '#320a03',
      fontHead: "'Cinzel', serif",
      fontBody: "'Cormorant Garamond', serif"
    },
    heroTagline: '✦ Sacred Agni & Seven Sacred Vows ✦',
    desc: 'Sacred terracotta mandapam, auspicious sandalwood aroma, Vedic hymns, temple brass bells, and eternal divine blessings.'
  }
];

// Generate each template
templates.forEach(t => {
  const dir = path.join(__dirname, '..', 'templates', t.id);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // 1. template.json
  const tplJson = {
    id: t.id,
    name: t.name,
    slug: t.slug,
    category: t.category,
    categorySlug: 'wedding',
    price: t.price,
    originalPrice: t.originalPrice,
    isFree: false,
    badge: t.badge,
    tier: 'Signature',
    isLuxury: true,
    type: `${t.name} Digital Keepsake`,
    icon: t.icon,
    tags: ['wedding', 'luxury', 'digital-invitation', t.id, 'rsvp', 'events'],
    description: t.desc,
    builder: {
      type: 'custom',
      photoLimit: 8,
      hasDate: true,
      hasSoundtrack: true,
      builderPath: 'templates/vanvi-royal-wedding/builder.html',
      previewPath: `templates/${t.id}/index.html`
    },
    schema: {
      fields: [
        { key: 'bride', label: 'Bride Name', type: 'text', default: 'Tanya' },
        { key: 'groom', label: 'Groom Name', type: 'text', default: 'Rohan' },
        { key: 'date', label: 'Wedding Date', type: 'text', default: '12th December 2026' },
        { key: 'venue', label: 'Venue', type: 'text', default: 'The Grand Palace Grounds' },
        { key: 'whatsapp', label: 'WhatsApp RSVP', type: 'tel', default: '917631442934' }
      ]
    }
  };
  fs.writeFileSync(path.join(dir, 'template.json'), JSON.stringify(tplJson, null, 2));

  // 2. index.html
  const isDarkCard = t.theme.cardBg.startsWith('#1') || t.theme.cardBg.startsWith('#0');
  const cardText = isDarkCard ? '#f8fafc' : t.theme.textColor;
  const cardBorder = t.theme.accent;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${t.name} | Vanvi Moments</title>
  <meta name="description" content="${t.desc}">
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,700;1,500&family=Playfair+Display:ital,wght@0,600;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-page: ${t.theme.bgMain};
      --accent: ${t.theme.accent};
      --card-bg: ${t.theme.cardBg};
      --card-text: ${cardText};
      --font-head: ${t.theme.fontHead};
      --font-body: ${t.theme.fontBody};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #090204;
      color: #fff;
      font-family: var(--font-body);
      min-height: 100vh;
      overflow-x: hidden;
    }
    #device {
      max-width: 480px;
      margin: 0 auto;
      background: var(--bg-page);
      min-height: 100vh;
      box-shadow: 0 0 60px rgba(0,0,0,0.85);
      position: relative;
    }
    /* Hero */
    .hero {
      text-align: center;
      padding: 60px 24px 40px;
      background: radial-gradient(circle at 50% 25%, rgba(255,255,255,0.06), transparent 70%);
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .badge {
      font-family: var(--font-head);
      font-size: 10px;
      letter-spacing: 2.5px;
      color: var(--accent);
      text-transform: uppercase;
      display: inline-block;
      margin-bottom: 14px;
    }
    .names {
      font-family: var(--font-head);
      font-size: 40px;
      line-height: 1.1;
      color: #fff;
    }
    .amp {
      font-style: italic;
      color: var(--accent);
      font-size: 30px;
      display: block;
      margin: 2px 0;
    }
    .rule {
      width: 42px;
      height: 1.5px;
      background: var(--accent);
      margin: 16px auto;
    }
    .date-str {
      font-size: 14px;
      letter-spacing: 1px;
      color: var(--accent);
    }
    .venue-str {
      font-size: 12.5px;
      color: rgba(255,255,255,0.8);
      margin-top: 6px;
    }

    /* Countdown */
    .countdown {
      display: inline-flex;
      gap: 12px;
      margin-top: 20px;
      background: rgba(0,0,0,0.35);
      border: 1px solid var(--accent);
      padding: 10px 18px;
      border-radius: 99px;
    }
    .cd-item { text-align: center; }
    .cd-val { font-size: 16px; font-weight: 800; color: var(--accent); display: block; }
    .cd-lbl { font-size: 9px; text-transform: uppercase; color: rgba(255,255,255,0.6); }

    /* Sections */
    .section {
      padding: 32px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .sec-head {
      text-align: center;
      margin-bottom: 20px;
    }
    .sec-kicker {
      font-size: 9.5px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--accent);
    }
    .sec-title {
      font-family: var(--font-head);
      font-size: 24px;
      color: #fff;
      margin-top: 4px;
    }
    .card {
      background: var(--card-bg);
      color: var(--card-text);
      border: 1px solid ${cardBorder};
      border-radius: 18px;
      padding: 20px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      margin-bottom: 14px;
    }
    .card h3 {
      font-family: var(--font-head);
      font-size: 18px;
      color: var(--accent);
      margin-bottom: 6px;
    }
    .card p {
      font-size: 13px;
      line-height: 1.6;
    }

    /* Action Buttons */
    .btn-action {
      display: block;
      width: 100%;
      background: var(--accent);
      color: #000;
      border: 0;
      padding: 12px;
      border-radius: 12px;
      font-weight: 800;
      font-size: 13px;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      margin-top: 10px;
    }
    .btn-wa {
      background: #15803d;
      color: #fff;
    }

    /* Footer */
    .footer {
      text-align: center;
      padding: 36px 20px;
      font-size: 11px;
      color: rgba(255,255,255,0.6);
    }
    .footer-mark {
      font-family: var(--font-head);
      color: var(--accent);
      font-size: 13px;
      margin-bottom: 6px;
    }
  </style>
</head>
<body>
  <div id="device">
    <!-- Hero -->
    <header class="hero">
      <span class="badge">${t.heroTagline}</span>
      <h1 class="names">
        <span id="brideName">Tanya</span>
        <span class="amp">&amp;</span>
        <span id="groomName">Rohan</span>
      </h1>
      <div class="rule"></div>
      <div class="date-str" id="weddingDate">12th December 2026</div>
      <div class="venue-str" id="venueName">The Grand Palace Grounds, Udaipur</div>

      <div class="countdown">
        <div class="cd-item"><span class="cd-val" id="cdD">00</span><span class="cd-lbl">Days</span></div>
        <div class="cd-item"><span class="cd-val" id="cdH">00</span><span class="cd-lbl">Hours</span></div>
        <div class="cd-item"><span class="cd-val" id="cdM">00</span><span class="cd-lbl">Mins</span></div>
        <div class="cd-item"><span class="cd-val" id="cdS">00</span><span class="cd-lbl">Secs</span></div>
      </div>
    </header>

    <!-- Divine Farman -->
    <section class="section">
      <div class="sec-head">
        <span class="sec-kicker">Divine Blessing</span>
        <h2 class="sec-title">${t.name}</h2>
      </div>
      <div class="card">
        <h3>With the Blessings of Our Families</h3>
        <p>
          "We joyfully invite you to share our happiest day as we exchange vows and step into forever. Your presence, blessings, and laughter will make our sacred union complete."
        </p>
      </div>
    </section>

    <!-- Itinerary -->
    <section class="section">
      <div class="sec-head">
        <span class="sec-kicker">The Celebrations</span>
        <h2 class="sec-title">Ceremony Schedule</h2>
      </div>
      <div class="card">
        <h3>🌼 Sacred Haldi &amp; Mehendi</h3>
        <p>11 Dec 2026 • 11:00 AM • Courtyard Gardens<br>Dress Code: Sunshine Yellow &amp; Mint Green</p>
      </div>
      <div class="card">
        <h3>✨ The Royal Sangeet Night</h3>
        <p>11 Dec 2026 • 07:30 PM • Palace Ballroom<br>Dress Code: Radiant Jewel Tones</p>
      </div>
      <div class="card">
        <h3>🪷 Sacred Vows &amp; Sunset Pheras</h3>
        <p>12 Dec 2026 • 05:30 PM • Sunset Mandap<br>Dress Code: Traditional Royal Attire</p>
      </div>
    </section>

    <!-- RSVP -->
    <section class="section">
      <div class="sec-head">
        <span class="sec-kicker">Honour Us With Your Presence</span>
        <h2 class="sec-title">RSVP</h2>
      </div>
      <div class="card">
        <h3>Confirm Your Attendance</h3>
        <p>Please let us know if you will be joining our wedding festivities.</p>
        <button type="button" class="btn-action btn-wa" onclick="sendWaRSVP()">💬 Send 1-Click WhatsApp RSVP</button>
        <a href="../../checkout.html?templateId=${t.id}&price=${t.price}&name=${encodeURIComponent(t.name)}" class="btn-action">Personalize This Experience (₹${t.price}) →</a>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-mark">VANVI MOMENTS ATELIER</div>
      <p>${t.name} • Lifetime Keepsake</p>
    </footer>
  </div>

  <script>
    const params = new URLSearchParams(window.location.search);
    const bride = params.get('bride') || 'Tanya';
    const groom = params.get('groom') || 'Rohan';
    const date = params.get('date') || '12th December 2026';
    const venue = params.get('venue') || 'The Grand Palace Grounds, Udaipur';
    const wa = params.get('whatsapp') || '917631442934';

    document.getElementById('brideName').textContent = bride;
    document.getElementById('groomName').textContent = groom;
    document.getElementById('weddingDate').textContent = date;
    document.getElementById('venueName').textContent = venue;

    function sendWaRSVP() {
      const msg = encodeURIComponent('Namaste ' + bride + ' & ' + groom + '!\\n\\nI am delighted to RSVP for your wedding at ' + venue + '. Looking forward to celebrating with you! ✨');
      window.open('https://wa.me/' + wa + '?text=' + msg, '_blank');
    }

    // Countdown
    const target = new Date('2026-12-12T18:00:00').getTime();
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) return;
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60)) / (1000 * 60));
      const s = Math.floor((diff % 1000) / 1000);
      document.getElementById('cdD').textContent = d < 10 ? '0' + d : d;
      document.getElementById('cdH').textContent = h < 10 ? '0' + h : h;
      document.getElementById('cdM').textContent = m < 10 ? '0' + m : m;
      document.getElementById('cdS').textContent = s < 10 ? '0' + s : s;
    }
    tick();
    setInterval(tick, 1000);
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(dir, 'index.html'), html);
});

console.log('Successfully generated all ' + templates.length + ' additional original wedding templates!');
