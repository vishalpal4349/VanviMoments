const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const issues = [];
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('href="login"') || content.includes('href="signup"')) {
    issues.push(`${file}: extensionless auth link`);
  }
  // Check script tags for missing files
  const scriptSrcs = content.match(/src="([^"]+\.js)"/g) || [];
  scriptSrcs.forEach(src => {
    const p = src.replace('src="', '').replace('"', '');
    if (!p.startsWith('http') && !fs.existsSync(p)) {
      issues.push(`${file}: missing script ${p}`);
    }
  });

  // Check link tags for missing CSS files
  const cssSrcs = content.match(/href="([^"]+\.css)"/g) || [];
  cssSrcs.forEach(src => {
    const p = src.replace('href="', '').replace('"', '');
    if (!p.startsWith('http') && !fs.existsSync(p)) {
      issues.push(`${file}: missing stylesheet ${p}`);
    }
  });
});

console.log('Total issues found:', issues.length);
issues.forEach(i => console.log(' - ' + i));
