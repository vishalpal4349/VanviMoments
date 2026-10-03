const http = require('http');
const fs = require('fs');
const path = require('path');

const pages = [
  'coming-soon.html',
  'contact.html',
  'privacy.html',
  'terms.html',
  'profile.html',
  'login.html'
];

async function checkLocalFile(filename) {
  const filePath = path.join(__dirname, '..', filename);
  if (!fs.existsSync(filePath)) {
    return { file: filename, exists: false };
  }
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check Ananya absence
  const hasAnanya = /ananya/i.test(content);

  // Check overflow-x hidden
  const hasOverflowX = content.includes('overflow-x: hidden') || content.includes('overflow-x:hidden');

  // Check logo is not a link pointing to index or reloading
  const logoAsLink = /<a[^>]+class=["'][^"']*logo[^"']*["'][^>]*href=/i.test(content);

  // Check safeGoBack or back button
  const hasBackButton = /safeGoBack|history\.back|btn-back/i.test(content);

  return {
    file: filename,
    exists: true,
    hasAnanya,
    hasOverflowX,
    logoAsLink,
    hasBackButton,
    size: content.length
  };
}

async function run() {
  console.log('--- Verifying Pages Locally ---');
  for (const page of pages) {
    const result = await checkLocalFile(page);
    console.log(JSON.stringify(result, null, 2));
  }
}

run();
