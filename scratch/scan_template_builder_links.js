const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '..', 'templates');
const dirs = fs.readdirSync(templatesDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

const findings = [];

dirs.forEach(d => {
  const tDir = path.join(templatesDir, d);
  const indexPath = path.join(tDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    const matches = [];

    const linkMatches = content.match(/href=["'][^"']*builder\.html[^"']*["']/gi);
    if (linkMatches) matches.push(...linkMatches);

    const btnMatches = content.match(/<a[^>]*builder[^>]*>.*?<\/a>/gis);
    if (btnMatches) {
      matches.push(...btnMatches.map(b => b.replace(/\s+/g, ' ').substring(0, 100)));
    }

    // Check script files
    const allFiles = fs.readdirSync(tDir);
    allFiles.filter(f => f.endsWith('.js')).forEach(jf => {
      const jc = fs.readFileSync(path.join(tDir, jf), 'utf8');
      const jm = jc.match(/builder\.html/g);
      if (jm) matches.push(jf + ' has builder.html reference');
    });

    if (matches.length > 0) {
      findings.push({ template: d, matches });
    }
  }
});

console.log('Found ' + findings.length + ' templates with builder links/references:');
findings.forEach(f => {
  console.log('\n--- Template: ' + f.template + ' ---');
  f.matches.slice(0, 5).forEach(m => console.log('  ', m));
});
