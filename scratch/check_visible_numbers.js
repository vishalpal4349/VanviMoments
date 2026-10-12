const fs = require('fs');
const path = require('path');

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (!full.includes('node_modules') && !full.includes('.git') && !full.includes('scratch')) {
        walk(full);
      }
    } else if (f.endsWith('.html')) {
      const txt = fs.readFileSync(full, 'utf8');
      // strip href and value attributes
      const noHref = txt.replace(/href=["'][^"']*["']/g, '').replace(/value=["'][^"']*["']/g, '');
      if (noHref.includes('76314') || noHref.includes('79038') || noHref.includes('+91 76') || noHref.includes('+91 79')) {
        console.log('Visible number found in:', full);
      }
    }
  });
}

walk('.');
console.log('Scan completed.');
