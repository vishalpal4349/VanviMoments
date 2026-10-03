const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hasBottomInHtml = content.includes('class="bottom') || content.includes('class="vanvi-bottom-dock') || content.includes("class='bottom") || content.includes("class='vanvi-bottom-dock");
  const hasNavCss = content.includes('vanvi-navigation.css');
  const hasNavJs = content.includes('vanvi-navigation.js');
  if (hasBottomInHtml || hasNavJs) {
    console.log(`[${f}] hasBottomInHtml: ${hasBottomInHtml}, hasNavCss: ${hasNavCss}, hasNavJs: ${hasNavJs}`);
  }
});
