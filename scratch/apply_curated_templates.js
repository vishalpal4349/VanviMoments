const fs = require('fs');

// Master curated thumbnails mapping for all 42 templates
const CURATED_THUMBNAILS = {
  'birthday-wish-1': 'https://cdn.cutiepage.in/static/products/birthday-wish1.jpg',
  'birthday-wish-2': 'https://cdn.cutiepage.in/static/products/birthday-wish2.jpg',
  'birthday-gf': 'https://cdn.cutiepage.in/template-seeds/girlfriends-day/cover.png',
  'apology-dashboard': 'https://cdn.cutiepage.in/static/special-apology.webp',
  'birthday-white-bloom-001': 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=700&auto=format&fit=crop&q=80',
  'birthday-3d-candle-surprise': 'https://cdn.cutiepage.in/template-previews/birthday-surprise/cover-msvjd9ve.jpg',
  'birthday-bloom': 'https://cdn.cutiepage.in/static/sweet-birthday.webp',
  'birthday-cinema': 'https://cdn.cutiepage.in/template-seeds/netflix-story/cover.webp',
  'midnight-cake-surprise': 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=700&auto=format&fit=crop&q=80',
  'retro-birthday-polaroid': 'https://cdn.cutiepage.in/static/birthday-wish4-v2.png',
  'little-love': 'https://cdn.cutiepage.in/template-seeds/couples-day/cover.webp',
  'forever-us': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=700&auto=format&fit=crop&q=80',
  'moonlight-story': 'https://cdn.cutiepage.in/template-previews/couples-day-v2/cover-msw1f6yw.png',
  'secret-wax-letter': 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=700&auto=format&fit=crop&q=80',
  'the-proposal-reel': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&auto=format&fit=crop&q=80',
  'golden-anniversary-walk': 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=700&auto=format&fit=crop&q=80',
  'everlasting-vows': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=700&auto=format&fit=crop&q=80',
  'royal-wedding-story': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=700&auto=format&fit=crop&q=80',
  'best-friend-chaos': 'https://cdn.cutiepage.in/template-seeds/friendship-day/cover.webp',
  'memory-puzzle': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&auto=format&fit=crop&q=80',
  'memory-note': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=700&auto=format&fit=crop&q=80',
  'timeline-odyssey': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=700&auto=format&fit=crop&q=80',
  'maaf-kar-do': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=700&auto=format&fit=crop&q=80',
  'maa-papa-tribute': 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=700&auto=format&fit=crop&q=80',
  'diwali-sparkler': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=700&auto=format&fit=crop&q=80',
  'graduation-victory': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&auto=format&fit=crop&q=80',
  'royal-heritage-cinema': 'https://cdn.cutiepage.in/template-previews/wife-day/cover-mu8umzzl.jpg',
  'golden-dynasty-celebration': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=700&auto=format&fit=crop&q=80',
  'miss-you-constellation': 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=700&auto=format&fit=crop&q=80',
  'midnight-thoughts-letter': 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=700&auto=format&fit=crop&q=80',
  'just-because-spark': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=700&auto=format&fit=crop&q=80',
  'random-act-of-love': 'https://cdn.cutiepage.in/template-seeds/girlfriends-day/cover.png',
  'thank-you-golden-sunset': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=80',
  'appreciation-tribute-reel': 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=700&auto=format&fit=crop&q=80',
  'farewell-memory-lane': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=700&auto=format&fit=crop&q=80',
  'farewell-golden-horizon': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&auto=format&fit=crop&q=80',
  'good-luck-lucky-clover': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=700&auto=format&fit=crop&q=80',
  'good-luck-champion': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=700&auto=format&fit=crop&q=80',
  'new-beginning-sunrise': 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=700&auto=format&fit=crop&q=80',
  'new-beginning-milestone-film': 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=700&auto=format&fit=crop&q=80',
  'golden-anniversary': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=700&auto=format&fit=crop&q=80',
  'valentine-constellation': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=700&auto=format&fit=crop&q=80'
};

let code = fs.readFileSync('js/vanvi-templates-data.js', 'utf8');

// For each key, update or inject thumbnail in the template definition
for (const [id, url] of Object.entries(CURATED_THUMBNAILS)) {
  // Regex to match the template object block
  const idRegex = new RegExp(`id:\\s*['"]${id}['"]([\\s\\S]*?)(accentColor|templatePath)`, 'm');
  const match = code.match(idRegex);
  if (match) {
    let block = match[0];
    if (block.includes('thumbnail:')) {
      // Replace existing thumbnail
      block = block.replace(/thumbnail:\s*['"][^'"]*['"]/, `thumbnail: '${url}'`);
    } else {
      // Insert thumbnail before accentColor or templatePath
      block = block.replace(/(accentColor|templatePath)/, `thumbnail: '${url}',\n      $1`);
    }
    code = code.replace(match[0], block);
  }
}

// Now update renderCard function to use the luxury centered showcase with blurred aura
const oldRenderRegex = /renderCard\(t\)\s*\{[\s\S]*?return `\s*<article[\s\S]*?<\/article>\s*`;\s*\}/;

const newRenderCode = `renderCard(t) {
      if (!t) return '';
      const p = Number(t.price || 0);
      const orig = Number(t.originalPrice || (p > 0 ? Math.round(p * 2.8 / 10) * 10 - 1 : 0));
      const isFree = t.isFree || p === 0;
      const isLux = !!t.isLuxury || t.price >= 249;
      const safeId = encodeURIComponent(t.id);
      const safeOccasion = encodeURIComponent(t.category || 'Celebration');

      // Category label with emoji
      let catBadge = t.category || 'Moment';
      const cLower = catBadge.toLowerCase();
      if (cLower.includes('birthday')) catBadge = '🎂 Birthday';
      else if (cLower.includes('love') || cLower.includes('romance')) catBadge = '💖 Romance';
      else if (cLower.includes('anniversary') || cLower.includes('wedding')) catBadge = '💍 Anniversary';
      else if (cLower.includes('friend')) catBadge = '👯 Friendship';
      else if (cLower.includes('apology')) catBadge = '🕊️ Apology';
      else if (cLower.includes('family')) catBadge = '👨‍👩‍👦 Family';
      else if (cLower.includes('celebration')) catBadge = '🎉 Celebration';
      else if (cLower.includes('memory') || cLower.includes('milestone')) catBadge = '📸 Keepsake';
      else if (cLower.includes('miss')) catBadge = '🌙 Miss You';
      else if (cLower.includes('thank')) catBadge = '🙏 Gratitude';
      else if (cLower.includes('farewell')) catBadge = '✈️ Farewell';
      else if (cLower.includes('luck')) catBadge = '🍀 Good Luck';
      else if (cLower.includes('beginning')) catBadge = '🌅 New Dawn';

      const thumb = t.thumbnail || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=700&auto=format&fit=crop&q=80';
      const discountText = t.discount || (orig > p ? \`\${Math.round(((orig - p) / orig) * 100)}% off\` : '');
      const rating = t.rating || '4.9';

      return \`
        <article class="vanvi-card \${isLux ? 'is-luxury' : ''}" id="card-\${t.id}">
          <div class="card-art-box" onclick="window.location.href='preview.html?template=\${safeId}'" title="Experience \${escapeHtml(t.name)}">
            <span class="card-badge-top-left">\${escapeHtml(catBadge)}</span>
            <span class="card-badge-top-right \${isFree ? 'free' : (isLux ? 'luxury' : 'price')}">
              \${isFree ? '🎁 Free' : (isLux ? '✦ Signature' : \`₹\${p}\`)}
            </span>
            <!-- Ambient blurred aura behind image so colors glow without letterbox -->
            <img class="card-art-backdrop" src="\${thumb}" alt="" aria-hidden="true" loading="lazy">
            <!-- Centerpiece uncropped artwork: perfectly centered & framed -->
            <img class="card-art-img" src="\${thumb}" alt="\${escapeHtml(t.name)}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1513151233558-d860c5398176?w=700&auto=format&fit=crop&q=80';">
          </div>

          <div class="card-body">
            <div class="card-header-meta">
              <h3 class="card-title" title="\${escapeHtml(t.name)}">\${escapeHtml(t.name)}</h3>
            </div>
            <p class="card-tagline" title="\${escapeHtml(t.tagline || t.description)}">\${escapeHtml(t.tagline || t.description)}</p>

            <div class="card-meta-row">
              <div class="card-price-cluster">
                <span class="price-now \${isFree ? 'free' : (isLux ? 'luxury' : '')}">\${isFree ? 'FREE' : \`₹\${p}\`}</span>
                \${isFree ? '' : \`<span class="price-orig">₹\${orig}</span>\`}
                \${discountText ? \`<span class="discount-pill">\${discountText}</span>\` : ''}
              </div>
              <div class="card-rating-cluster" title="Rated \${rating} out of 5 stars">
                <span class="card-star">★</span>
                <span class="card-rating-num">\${rating}</span>
              </div>
            </div>

            <div class="card-actions-grid">
              <a href="preview.html?template=\${safeId}" class="btn-take-look" title="Take a look at \${escapeHtml(t.name)}">
                <span class="btn-text-full">Take a look</span>
                <span class="btn-text-short">Preview</span>
              </a>
              <a href="builder.html?template=\${safeId}&occasion=\${safeOccasion}" class="btn-make-yours" title="Make it yours in 30 seconds">
                <span class="btn-text-full">Make it yours ✨</span>
                <span class="btn-text-short">Create ✨</span>
              </a>
            </div>
          </div>
        </article>
      \`;
    }`;

code = code.replace(oldRenderRegex, newRenderCode);
fs.writeFileSync('js/vanvi-templates-data.js', code, 'utf8');
console.log('Successfully updated vanvi-templates-data.js with curated thumbnails and centered luxury artwork!');
