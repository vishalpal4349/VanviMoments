const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

console.log('Auditing Meta Tags across ' + files.length + ' HTML files...');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hasViewport = content.toLowerCase().includes('name="viewport"');
  const hasTitle = content.toLowerCase().includes('<title>');
  const hasDesc = content.toLowerCase().includes('name="description"');
  const hasOgTitle = content.toLowerCase().includes('property="og:title"');
  const hasFavicon = content.toLowerCase().includes('rel="icon"');

  const issues = [];
  if (!hasViewport) issues.push('missing viewport');
  if (!hasTitle) issues.push('missing title');
  if (!hasDesc) issues.push('missing meta description');
  if (!hasOgTitle) issues.push('missing og:title');
  if (!hasFavicon) issues.push('missing favicon');

  if (issues.length > 0) {
    console.log(`- ${f}: ${issues.join(', ')}`);
  } else {
    console.log(`✓ ${f}: all SEO & meta tags present`);
  }
});

