const fs = require('fs');
const html = fs.readFileSync('scratch/vercel_raw.html', 'utf8');

const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (bodyMatch) {
  let bodyWithoutScripts = bodyMatch[1].replace(/<script[\s\S]*?<\/script>/gi, '').trim();
  fs.writeFileSync('scratch/body.html', bodyWithoutScripts, 'utf8');
  console.log('Saved to scratch/body.html! Length:', bodyWithoutScripts.length);
}
