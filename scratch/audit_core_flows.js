const fs = require('fs');

const pages = [
  'templates.html',
  'builder.html',
  'experience.html',
  'preview.html',
  'checkout.html',
  'share.html',
  'moment.html',
  'order-success.html',
  'profile.html',
  'dashboard.html',
  'refer.html',
  'rewards.html',
  'plans.html',
  'login.html',
  'signup.html',
  'forgot-password.html',
  'ai.html',
  'ai-matcher.html',
  'vanvi-assistant.html'
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

console.log(`\nTotal Core Flow Buttons: ${totalButtons} | Total Core Flow Forms: ${totalForms}`);
