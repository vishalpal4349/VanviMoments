const fs = require('fs');

let c = fs.readFileSync('scratch/templates_9a98677_utf8.html', 'utf8');

// Replace the nav brand link with the standardized 32px official logo header
const oldBrand = c.match(/<a href="index\.html" class="nav-brand-static"[\s\S]*?<\/a>/);
console.log('Found old brand in 9a98677:', !!oldBrand);

const newBrand = `<a href="index.html" class="nav-brand-static" title="Vanvi Moments Keepsake Atelier" style="display:inline-flex; align-items:center; text-decoration:none;">
        <img src="assets/vanvi-moments-logo-header.png" alt="Vanvi Moments" style="height:32px; width:auto; max-width:145px; object-fit:contain; filter:drop-shadow(0 2px 6px rgba(255,42,122,0.22));" />
        <span style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">Vanvi Moments✦</span>
      </a>`;

if (oldBrand) {
  c = c.replace(oldBrand[0], newBrand);
}

fs.writeFileSync('templates.html', c, 'utf8');
console.log('Successfully restored templates.html from 9a98677! New length:', c.length);
