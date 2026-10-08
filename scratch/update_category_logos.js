const fs = require('fs');
const path = require('path');

const updates = [
  {
    file: 'category-birthday.html',
    regex: /<a href="index\.html" class="brand-link" title="Vanvi Moments">[\s\S]*?<\/a>/,
    replace: `<a href="index.html" class="brand-link" title="Vanvi Moments Home">
    <img src="assets/vanvi-moments-logo-header.png" alt="Vanvi Moments" class="header-brand-img" style="height: 32px; width: auto; max-width: 145px; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(255, 42, 122, 0.22));" />
    <span class="brand-tag">BIRTHDAYS</span>
  </a>`
  },
  {
    file: 'category-anniversary.html',
    regex: /<a href="index\.html" class="brand-link" title="Vanvi Moments">[\s\S]*?<\/a>/,
    replace: `<a href="index.html" class="brand-link" title="Vanvi Moments Home">
    <img src="assets/vanvi-moments-logo-header.png" alt="Vanvi Moments" class="header-brand-img" style="height: 32px; width: auto; max-width: 145px; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(255, 42, 122, 0.22));" />
    <span class="brand-tag">ANNIVERSARY</span>
  </a>`
  },
  {
    file: 'category-love.html',
    regex: /<a href="index\.html" class="brand-link" title="Vanvi Moments">[\s\S]*?<\/a>/,
    replace: `<a href="index.html" class="brand-link" title="Vanvi Moments Home">
    <img src="assets/vanvi-moments-logo-header.png" alt="Vanvi Moments" class="header-brand-img" style="height: 32px; width: auto; max-width: 145px; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(255, 42, 122, 0.22));" />
    <span class="brand-tag">ROMANCE</span>
  </a>`
  },
  {
    file: 'category-apology.html',
    regex: /<a href="index\.html" class="brand-link" title="Vanvi Moments">[\s\S]*?<\/a>/,
    replace: `<a href="index.html" class="brand-link" title="Vanvi Moments Home">
    <img src="assets/vanvi-moments-logo-header.png" alt="Vanvi Moments" class="header-brand-img" style="height: 32px; width: auto; max-width: 145px; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(255, 42, 122, 0.22));" />
    <span class="brand-tag">APOLOGY</span>
  </a>`
  },
  {
    file: 'category-friendship.html',
    regex: /<a href="index\.html" class="brand-link" title="Vanvi Moments">[\s\S]*?<\/a>/,
    replace: `<a href="index.html" class="brand-link" title="Vanvi Moments Home">
    <img src="assets/vanvi-moments-logo-header.png" alt="Vanvi Moments" class="header-brand-img" style="height: 32px; width: auto; max-width: 145px; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(255, 42, 122, 0.22));" />
    <span class="brand-tag">BESTIES</span>
  </a>`
  },
  {
    file: 'category-celebration.html',
    regex: /<a href="index\.html" class="brand-link" title="Vanvi Moments">[\s\S]*?<\/a>/,
    replace: `<a href="index.html" class="brand-link" title="Vanvi Moments Home">
    <img src="assets/vanvi-moments-logo-header.png" alt="Vanvi Moments" class="header-brand-img" style="height: 32px; width: auto; max-width: 145px; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(255, 42, 122, 0.22));" />
    <span class="brand-tag">CELEBRATIONS</span>
  </a>`
  },
  {
    file: 'category-family.html',
    regex: /<a href="index\.html" class="brand-link" title="Vanvi Moments">[\s\S]*?<\/a>/,
    replace: `<a href="index.html" class="brand-link" title="Vanvi Moments Home">
    <img src="assets/vanvi-moments-logo-header.png" alt="Vanvi Moments" class="header-brand-img" style="height: 32px; width: auto; max-width: 145px; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(255, 42, 122, 0.22));" />
    <span class="brand-tag">FAMILY</span>
  </a>`
  },
  {
    file: 'category-memories.html',
    regex: /<a href="index\.html" class="brand-link" title="Vanvi Moments">[\s\S]*?<\/a>/,
    replace: `<a href="index.html" class="brand-link" title="Vanvi Moments Home">
    <img src="assets/vanvi-moments-logo-header.png" alt="Vanvi Moments" class="header-brand-img" style="height: 32px; width: auto; max-width: 145px; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(255, 42, 122, 0.22));" />
    <span class="brand-tag">MEMORIES</span>
  </a>`
  },
  {
    file: 'category-premium.html',
    regex: /<a href="index\.html" class="brand-link" title="Vanvi Moments">[\s\S]*?<\/a>/,
    replace: `<a href="index.html" class="brand-link" title="Vanvi Moments Home">
    <img src="assets/vanvi-moments-logo-header.png" alt="Vanvi Moments" class="header-brand-img" style="height: 32px; width: auto; max-width: 145px; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(255, 42, 122, 0.22));" />
    <span class="brand-tag-royal">VIP ATELIER</span>
  </a>`
  },
  {
    file: 'category-free.html',
    regex: /<a href="index\.html" class="brand-link" title="Vanvi Moments">[\s\S]*?<\/a>/,
    replace: `<a href="index.html" class="brand-link" title="Vanvi Moments Home">
    <img src="assets/vanvi-moments-logo-header.png" alt="Vanvi Moments" class="header-brand-img" style="height: 32px; width: auto; max-width: 145px; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(255, 42, 122, 0.22));" />
    <span class="brand-tag">FREE</span>
  </a>`
  },
  {
    file: 'coming-soon.html',
    regex: /<a href="index\.html" class="header-brand" title="Vanvi Moments">[\s\S]*?<\/a>/,
    replace: `<a href="index.html" class="header-brand" title="Vanvi Moments Home">
      <img src="assets/vanvi-moments-logo-header.png" alt="Vanvi Moments" class="header-brand-img" style="height: 32px; width: auto; max-width: 140px; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(255, 42, 122, 0.22));" />
      <span class="brand-tag">WORKSHOP</span>
    </a>`
  },
  {
    file: 'checkout.html',
    regex: /<a href="index\.html" class="brand-link" title="Vanvi Moments">[\s\S]*?<\/a>/,
    replace: `<a href="index.html" class="brand-link" title="Vanvi Moments Home">
    <img src="assets/vanvi-moments-logo-header.png" alt="Vanvi Moments" class="header-brand-img" style="height: 32px; width: auto; max-width: 145px; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(255, 42, 122, 0.22));" />
    <span class="chk-badge" style="font-size: 10px; font-weight: 850; color: #ff2a7a; background: #fff0f5; padding: 2px 8px; border-radius: 99px; border: 1px solid rgba(255,42,122,0.25);">CHECKOUT</span>
  </a>`
  }
];

updates.forEach(u => {
  const p = path.join(__dirname, '..', u.file);
  if (!fs.existsSync(p)) {
    console.error('File not found:', p);
    return;
  }
  let content = fs.readFileSync(p, 'utf8');
  if (u.regex.test(content)) {
    content = content.replace(u.regex, u.replace);
    fs.writeFileSync(p, content, 'utf8');
    console.log(`✅ Updated brand logo in ${u.file}`);
  } else {
    console.warn(`⚠️ Regex did not match in ${u.file}`);
  }
});

console.log('All brand logos updated!');
