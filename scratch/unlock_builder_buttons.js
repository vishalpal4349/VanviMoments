const fs = require('fs');

const edits = [
  {
    file: 'templates/temple-blossom-luxe/builder.html',
    from: '<i class="fa-solid fa-lock-open"></i> Unlock &amp; Remove Watermark (₹799)',
    to: '<i class="fa-solid fa-paper-plane"></i> Publish &amp; Share Live Link (₹799)'
  },
  {
    file: 'templates/love-in-clouds/builder.html',
    from: '<i class="fa-solid fa-lock-open"></i> Unlock &amp; Remove Watermark (₹799)',
    to: '<i class="fa-solid fa-paper-plane"></i> Publish &amp; Share Live Link (₹799)'
  },
  {
    file: 'templates/hues-whispers-luxe/builder.html',
    from: "nextBtn.textContent = 'Publish & Unlock (₹1,499) 👑';",
    to: "nextBtn.textContent = 'Publish & Share (₹1,499) 👑';"
  },
  {
    file: 'templates/cute-pastel-birthday/builder.html',
    from: 'Publish &amp; Unlock Keepsake (₹29)',
    to: 'Publish &amp; Share Keepsake (₹29)'
  },
  {
    file: 'templates/Birthday-Box/builder.html',
    from: '💳 Pay ₹149 &amp; Unlock Share Link',
    to: '✦ Publish &amp; Share Link (₹149)'
  },
  {
    file: 'templates/Birthday-Box/index.html',
    from: 'Unlock for ₹149',
    to: 'Create Yours (₹149)'
  }
];

edits.forEach(e => {
  if (fs.existsSync(e.file)) {
    let content = fs.readFileSync(e.file, 'utf8');
    if (content.includes(e.from)) {
      content = content.replace(e.from, e.to);
      fs.writeFileSync(e.file, content, 'utf8');
      console.log('Updated: ' + e.file);
    } else {
      console.log('Skipped (not found): ' + e.file);
    }
  }
});
