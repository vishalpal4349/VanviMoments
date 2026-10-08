const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'scratch' && file !== 'brain' && file !== '.gemini' && file !== '.agents') {
        results = results.concat(getHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(path.relative('.', fullPath).replace(/\\/g, '/'));
    }
  });
  return results;
}

const allPages = getHtmlFiles('.');
console.log(`Auditing ${allPages.length} HTML pages for mobile responsiveness issues...`);

const issues = [];

allPages.forEach(page => {
  const content = fs.readFileSync(page, 'utf8');
  
  // 1. Missing viewport meta
  if (!content.includes('<meta name="viewport"') && !content.includes("<meta content=\"width=device-width")) {
    issues.push({ page, type: 'MISSING_VIEWPORT' });
  }

  // 2. Potentially overflowing fixed widths (> 360px without max-width or media query)
  const fixedWidthMatches = content.match(/width:\s*([4-9]\d{2}|[1-9]\d{3})px/gi) || [];
  if (fixedWidthMatches.length > 0 && !content.includes('max-width: 100%') && !content.includes('max-width:')) {
    // Check if it's inside an iframe or non-responsive container
    issues.push({ page, type: 'POTENTIAL_FIXED_WIDTH_OVERFLOW', matches: fixedWidthMatches.slice(0, 3) });
  }

  // 3. Form input autozoom risk on iOS (inputs without 16px or font-size rule)
  const hasInputs = content.includes('<input') || content.includes('<textarea');
  if (hasInputs) {
    const hasAutozoomGuard = content.includes('font-size: 16px') || content.includes('font-size:16px') || content.includes('1rem') || content.includes('vanvi-inner-light.css') || content.includes('vanvi-global-experience.css') || content.includes('vanvi-custom-builder.css');
    if (!hasAutozoomGuard) {
      issues.push({ page, type: 'INPUT_ZOOM_RISK' });
    }
  }

  // 4. Dead button checks (empty onclick or href="#" without handler)
  const deadAnchorMatches = content.match(/<a\s+[^>]*href=["']#["'][^>]*>/gi) || [];
  const deadButtonMatches = content.match(/<button\s+[^>]*onclick=["'](?:return false;?)?["'][^>]*>/gi) || [];
  const unhandledAnchors = deadAnchorMatches.filter(a => !a.includes('onclick=') && !a.includes('id=') && !a.includes('data-'));
  if (unhandledAnchors.length > 0) {
    issues.push({ page, type: 'DEAD_ANCHOR', count: unhandledAnchors.length });
  }
});

console.log(`\nAudit complete. Found ${issues.length} potential issues across ${allPages.length} pages:`);
console.log(JSON.stringify(issues, null, 2));
