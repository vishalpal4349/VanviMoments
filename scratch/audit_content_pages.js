const fs = require('fs');

const pages = [
  'about.html',
  'contact.html',
  'faq.html',
  'privacy.html',
  'terms.html',
  'refund.html',
  'products.html',
  'custom-experience.html',
  'constellation-of-love.html',
  'coming-soon.html',
  '404.html',
  'admin.html'
];

let totalButtons = 0;
let totalForms = 0;

pages.forEach(p => {
  const content = fs.readFileSync(p, 'utf8');
  const btnMatches = (content.match(/<button/gi) || []).length + (content.match(/class="[^"]*btn[^"]*"/gi) || []).length;
  const formMatches = (content.match(/<form/gi) || []).length;
  const hasInnerLight = content.includes('vanvi-inner-light.css');
  const hasNav = content.includes('vanvi-navigation.css');
  totalButtons += btnMatches;
  totalForms += formMatches;
  console.log(`${p} - Buttons: ${btnMatches} | Forms: ${formMatches} | InnerLight: ${hasInnerLight} | Nav: ${hasNav}`);
});

console.log(`\nTotal Content Buttons: ${totalButtons} | Total Content Forms: ${totalForms}`);
