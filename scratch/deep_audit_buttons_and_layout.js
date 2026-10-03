const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const report = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const issues = [];
  
  // 1. Check viewport
  if (!content.includes('viewport')) {
    issues.push('Missing viewport meta');
  }

  // 2. Check vanvi-navigation.css
  const hasNavCss = content.includes('vanvi-navigation.css');
  const hasNavJs = content.includes('vanvi-navigation.js');
  
  // 3. Find buttons and anchors acting as buttons
  const buttonTags = content.match(/<button\b[^>]*>(.*?)<\/button>/gis) || [];
  const btnAnchors = content.match(/<a\b[^>]*class=["'][^"']*\b(btn|button|cta)\b[^"']*["'][^>]*>(.*?)<\/a>/gis) || [];
  
  // 4. Dead hrefs
  const deadHrefs = [];
  const allAnchors = content.match(/<a\b[^>]*href=["']([^"']*)["'][^>]*>/gi) || [];
  allAnchors.forEach(a => {
    const m = a.match(/href=["']([^"']*)["']/i);
    if (m) {
      const h = m[1].trim();
      if (h === '#' || h === 'javascript:void(0)' || h === 'javascript:;') {
        // check if has onclick or id
        if (!a.includes('onclick') && !a.includes('id=') && !a.includes('data-')) {
          deadHrefs.push(a);
        }
      }
    }
  });
  if (deadHrefs.length) {
    issues.push(`Found ${deadHrefs.length} potentially dead anchors without onclick/id: ${deadHrefs.slice(0, 2).join('; ')}`);
  }

  // 5. Header buttons count
  const headerMatch = content.match(/<header\b[^>]*>(.*?)<\/header>/is);
  let headerBtnCount = 0;
  if (headerMatch) {
    const hContent = headerMatch[1];
    const hBtns = hContent.match(/<(button|a)\b[^>]*class=["'][^"']*(btn|action|header-btn|login-btn|tbtn)[^"']*["'][^>]*>/gi) || [];
    headerBtnCount = hBtns.length;
    if (headerBtnCount > 1) {
      // Check if there are responsive hide classes or if vanvi-navigation.css handles it
      const hasResponsiveHide = hContent.includes('desktop-only') || 
                                hContent.includes('mobile-hide') || 
                                hContent.includes('btn-header-secondary') || 
                                hContent.includes('btn-header-link') ||
                                hContent.includes('@media') ||
                                content.includes('@media (max-width: 768px)') ||
                                content.includes('@media(max-width: 768px)') ||
                                (hasNavCss && (hContent.includes('btn-header-link') || hContent.includes('btn-header-action')));
      if (!hasResponsiveHide) {
        issues.push(`Header has ${headerBtnCount} action buttons and might crowd mobile view`);
      }
    }
  }

  // 6. Check for legacy 'Ananya' branding
  if (/ananya/i.test(content)) {
    // Exclude if it's in a comment or test
    const cleanContent = content.replace(/<!--[\s\S]*?-->/g, '');
    if (/ananya/i.test(cleanContent)) {
      issues.push("Found 'Ananya' brand occurrence");
    }
  }

  // 7. Check for unstyled or standard raw buttons
  let rawButtonsCount = 0;
  buttonTags.forEach(b => {
    if (!b.includes('class=')) {
      rawButtonsCount++;
    }
  });
  if (rawButtonsCount > 0) {
    issues.push(`${rawButtonsCount} buttons have NO class attribute`);
  }

  // 8. Check for inline style overflow issues
  if (content.includes('width: 100vw') || content.includes('width:100vw')) {
    issues.push("Contains '100vw' which causes horizontal scroll on Windows browsers");
  }

  report.push({
    file,
    hasNavCss,
    hasNavJs,
    totalButtons: buttonTags.length,
    totalBtnAnchors: btnAnchors.length,
    headerBtnCount,
    issues
  });
});

console.log('--- AUDIT SUMMARY ---');
const withIssues = report.filter(r => r.issues.length > 0);
console.log(`Total files: ${report.length}, Files with potential issues: ${withIssues.length}`);
withIssues.forEach(r => {
  console.log(`\n[${r.file}] (Btns: ${r.totalButtons}, BtnLinks: ${r.totalBtnAnchors})`);
  r.issues.forEach(iss => console.log(`  ⚠ ${iss}`));
});
