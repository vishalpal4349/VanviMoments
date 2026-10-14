const fs = require('fs');

const file = 'js/vanvi-templates-data.js';
let content = fs.readFileSync(file, 'utf8');

// Replace the return block in renderCard
const startMarker = 'return `\n        <article class="vanvi-card';
const startMarkerCRLF = 'return `\r\n        <article class="vanvi-card';

const newReturn = `return \`
        <article class="vanvi-card \${isLux ? 'is-luxury' : ''}" data-cat="\${escapeHtml(catSlug)}" id="card-\${t.id}">
          <div class="card-art-box" onclick="window.location.href='\${directPreviewUrl}'" title="Experience \${escapeHtml(t.name)}">
            <div class="vanvi-brand-corner-badge" title="Vanvi Moments Original">
              <img src="assets/vanvi-moments-official-logo.png" alt="Vanvi Moments" class="brand-badge-img" loading="lazy">
            </div>
            <span class="card-badge-top-right \${isFree ? 'free' : (isLux ? 'luxury' : 'price')}">
              \${isFree ? '🎁 Free' : (isLux ? '✦ Signature' : \`₹\${p}\`)}
            </span>
            <!-- Ambient blurred aura behind image so colors glow without letterbox -->
            <img class="card-art-backdrop" src="\${thumb}" alt="" aria-hidden="true" loading="lazy">
            <!-- Centerpiece uncropped artwork: perfectly centered & framed -->
            <img class="card-art-img" src="\${thumb}" alt="\${escapeHtml(t.name)}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1513151233558-d860c5398176?w=700&auto=format&fit=crop&q=80';">
            \${videoSrc ? \`
              <video class="card-art-video" src="\${escapeHtml(videoSrc)}" poster="\${thumb}" muted loop playsinline preload="none" onmouseenter="this.play()" onmouseleave="this.pause()" aria-hidden="true"></video>
            \` : ''}
          </div>

          <div class="card-body">
            <div class="card-exp-hint">
              <span class="exp-hint-pill">\${escapeHtml(expHint)}</span>
            </div>
            <div class="card-header-meta">
              <h3 class="card-title" title="\${escapeHtml(t.name)}">\${escapeHtml(t.name)}</h3>
            </div>
            <p class="card-tagline" title="\${escapeHtml(tagline)}">\${escapeHtml(tagline)}</p>

            <div class="card-meta-row">
              <div class="card-price-cluster">
                <span class="price-now \${isFree ? 'free' : (isLux ? 'luxury' : '')}">\${isFree ? 'FREE' : \`₹\${p}\`}</span>
                \${isFree ? '' : \`<span class="price-orig">₹\${orig}</span>\`}
                \${discountText ? \`<span class="discount-pill">\${discountText}</span>\` : ''}
              </div>
              <div class="card-status-subtle">
                <span class="status-dot">✦</span>
                <span class="status-txt">\${isFree ? 'Forever Free' : 'Lifetime Access'}</span>
              </div>
            </div>

            <div class="card-actions-grid">
              <a href="\${directPreviewUrl}" class="btn-take-look" title="Preview \${escapeHtml(t.name)}">
                <span>Preview</span>
              </a>
              <a href="\${directBuilderUrl}" class="btn-make-yours" title="Create \${escapeHtml(t.name)}">
                <span>Create ✦</span>
              </a>
            </div>
          </div>
        </article>
      \`;`;

const regex = /return `\s*<article class="vanvi-card[\s\S]*?<\/article>\s*`;/;
if (regex.test(content)) {
  content = content.replace(regex, newReturn);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully cleaned renderCard in vanvi-templates-data.js!');
} else {
  console.log('Regex did not match');
}
