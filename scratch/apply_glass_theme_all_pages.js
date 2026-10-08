const fs = require('fs');
const path = require('path');

const HEAD_SNIPPET = `<script>(function(){try{var t=localStorage.getItem('vanvi_aesthetic_theme')||'clay';var f=localStorage.getItem('vanvi_font_pref')||'royal';document.documentElement.setAttribute('data-vanvi-theme',t);document.documentElement.setAttribute('data-vanvi-font',f);}catch(e){}})();</script>`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let modifiedCount = 0;
const details = [];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Ensure Instant Head Theme & Font Sync
  const hasHeadSync = content.includes('data-vanvi-theme') && content.includes('vanvi_aesthetic_theme');
  if (!hasHeadSync) {
    if (content.includes('<head>')) {
      content = content.replace('<head>', '<head>\n  ' + HEAD_SNIPPET);
    } else if (/<head[^>]*>/i.test(content)) {
      content = content.replace(/<head[^>]*>/i, match => match + '\n  ' + HEAD_SNIPPET);
    }
  }

  // 2. Ensure vanvi-navigation.css
  const hasNavCss = content.includes('vanvi-navigation.css');
  if (!hasNavCss) {
    // Insert before </head>
    if (content.includes('</head>')) {
      content = content.replace('</head>', '  <link rel="stylesheet" href="vanvi-navigation.css">\n</head>');
    }
  }

  // 3. Ensure js/vanvi-navigation.js
  const hasNavJs = content.includes('vanvi-navigation.js');
  if (!hasNavJs) {
    // Insert before </body>
    if (content.includes('</body>')) {
      content = content.replace('</body>', '  <script src="js/vanvi-navigation.js"></script>\n</body>');
    }
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    details.push({
      file,
      addedHeadSync: !hasHeadSync,
      addedNavCss: !hasNavCss,
      addedNavJs: !hasNavJs
    });
  }
});

console.log(`Successfully processed ${files.length} HTML files.`);
console.log(`Modified ${modifiedCount} files.`);
console.log('Details:', JSON.stringify(details, null, 2));
