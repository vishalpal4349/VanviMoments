const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const matches = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Match any tag that acts as a brand link or header brand
  const brandBlocks = content.match(/<a[^>]*class=["'][^"']*(?:brand|logo)[^"']*["'][^>]*>[\s\S]*?<\/a>/gi) || [];

  brandBlocks.forEach(block => {
    const hasImg = /<img[^>]+>/i.test(block);
    // remove img tag completely
    const noImg = block.replace(/<img[^>]*>/gi, '');
    // check if "vanvi" or "moments" is in the text
    const textOnly = noImg.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    if (hasImg && (/vanvi/i.test(textOnly) || /moments/i.test(textOnly))) {
      matches.push({
        file,
        block: block.replace(/\s+/g, ' ').slice(0, 250),
        textOnly
      });
    }
  });
});

console.log(`Found ${matches.length} multiline brand blocks with both logo and text:`);
matches.forEach((m, i) => {
  console.log(`\n--- [${i+1}] ${m.file} ---`);
  console.log('HTML:', m.block);
  console.log('Text:', m.textOnly);
});
