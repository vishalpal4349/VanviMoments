const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const results = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');

  // Look for any anchor or div containing both an image logo AND text like "Vanvi Moments"
  // For instance <a class="brand"...> <img ...> <span>Vanvi Moments</span> ...
  const matches = content.match(/<a[^>]+(?:brand|logo)[^>]*>([\s\S]*?)<\/a>/gi) || [];
  matches.forEach(m => {
    const hasImg = /<img[^>]+>/i.test(m);
    // remove img tag to check text
    const textOnly = m.replace(/<img[^>]*>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (hasImg && /Vanvi/i.test(textOnly)) {
      results.push({ file: f, match: m.trim().replace(/\s+/g, ' '), textOnly });
    }
  });

  // Also check general header blocks
  const headerMatches = content.match(/<header[^>]*>([\s\S]*?)<\/header>/gi) || [];
  headerMatches.forEach(h => {
    // Check if within header there is an img and adjacent span with "Vanvi Moments"
    const sub = h.match(/<div[^>]+(?:brand|logo)[^>]*>([\s\S]*?)<\/div>/gi) || [];
    sub.forEach(s => {
      const hasImg = /<img[^>]+>/i.test(s);
      const textOnly = s.replace(/<img[^>]*>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (hasImg && /Vanvi/i.test(textOnly)) {
        results.push({ file: f, match: s.trim().replace(/\s+/g, ' '), textOnly });
      }
    });
  });
});

console.log(`Found ${results.length} instances of duplicate logo + Vanvi Moments text:`);
results.forEach((r, i) => {
  console.log(`\n[${i+1}] ${r.file}:`);
  console.log(`  HTML: ${r.match.slice(0, 160)}`);
  console.log(`  Text: "${r.textOnly}"`);
});
