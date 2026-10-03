const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

console.log('--- AUDITING MOBILE & UX GAPS ACROSS ALL PAGES ---');

const findings = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');

  // Check 1: Missing meta tags (description, og:title, favicon)
  if (!content.includes('rel="icon"') && !content.includes("rel='icon'")) {
    findings.push({ file: f, issue: 'Missing favicon <link rel="icon">' });
  }

  // Check 2: Form validation - inputs without labels or placeholders
  const emptyInputs = [...content.matchAll(/<input(?![^>]*placeholder)(?![^>]*type=["'](?:hidden|checkbox|radio|submit|button)["'])[^>]*>/gi)];
  if (emptyInputs.length > 0) {
    findings.push({ file: f, issue: `${emptyInputs.length} input(s) missing placeholder attribute` });
  }

  // Check 3: Check if there are raw "Lorem ipsum" or placeholder texts
  if (/lorem ipsum/i.test(content)) {
    findings.push({ file: f, issue: 'Contains Lorem Ipsum placeholder text' });
  }

  // Check 4: Check if images have empty or missing alt text
  const imgMissingAlt = [...content.matchAll(/<img(?![^>]*\balt=)[^>]*>/gi)];
  if (imgMissingAlt.length > 0) {
    findings.push({ file: f, issue: `${imgMissingAlt.length} <img> tag(s) missing alt attribute` });
  }
});

console.log('Total findings:', findings.length);
findings.forEach(fd => {
  console.log(`[${fd.file}] ${fd.issue}`);
});
