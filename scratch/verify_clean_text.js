const fs = require('fs');

const html = fs.readFileSync('forgot-password.html', 'utf8');
// remove script and style tags
const noScript = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
const noTags = noScript.replace(/<[^>]+>/g, ' ');

if (noTags.includes('76314') || noTags.includes('79038') || noTags.includes('+91')) {
  console.log('VISIBLE NUMBER FOUND IN TEXT:', noTags.match(/.{0,30}(?:76314|79038|\+91).{0,30}/g));
} else {
  console.log('Zero visible phone numbers in forgot-password.html! Clean!');
}
