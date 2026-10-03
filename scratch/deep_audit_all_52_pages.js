const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const allFiles = fs.readdirSync(root);
const htmlFiles = allFiles.filter(f => f.endsWith('.html')).sort();

console.log(`Starting deep audit on ${htmlFiles.length} HTML pages...\n`);

const results = [];

htmlFiles.forEach((file) => {
  const fullPath = path.join(root, file);
  const content = fs.readFileSync(fullPath, 'utf8');

  const report = {
    file,
    buttonsCount: 0,
    deadButtons: [],
    anchorsCount: 0,
    deadAnchors: [],
    formsCount: 0,
    unhandledForms: [],
    hasViewport: false,
    hasOverflowGuard: false,
    isDarkTheme: false,
    issues: []
  };

  // Viewport
  report.hasViewport = /name=["']viewport["']/i.test(content);
  if (!report.hasViewport) report.issues.push('Missing meta viewport');

  // Overflow Guard
  report.hasOverflowGuard = content.includes('overflow-x') || content.includes('vanvi-inner-light.css') || content.includes('vanvi-navigation.css');

  // Dark Theme check (old obsidian theme vs new light luxury)
  if (content.includes('vanvi-core.css') && !content.includes('vanvi-inner-light.css')) {
    report.isDarkTheme = true;
    report.issues.push('Uses legacy dark obsidian theme');
  }

  // Buttons Audit
  const buttonMatches = [...content.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)];
  report.buttonsCount = buttonMatches.length;

  buttonMatches.forEach((m) => {
    const attrs = m[1];
    const innerText = m[2].replace(/<[^>]+>/g, '').trim() || '[Icon/Empty]';
    const hasOnclick = /onclick=["'][^"']+["']/i.test(attrs);
    const idMatch = attrs.match(/id=["']([^"']+)["']/i);
    const classMatch = attrs.match(/class=["']([^"']+)["']/i);
    const typeMatch = attrs.match(/type=["']([^"']+)["']/i);
    const id = idMatch ? idMatch[1] : null;

    // Check if ID is referenced in scripts
    let isHandledInScript = false;
    if (id) {
      const idPattern = new RegExp(`['"#]${id}['"]`, 'i');
      const scripts = [...content.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
      isHandledInScript = scripts.some(s => idPattern.test(s[1]));
    }

    const isSubmitInForm = typeMatch && typeMatch[1] === 'submit';

    // If not submit, no onclick, and ID not handled in script -> dead button!
    if (!hasOnclick && !isSubmitInForm && (!id || !isHandledInScript)) {
      // Check if it has a data-dismiss or bootstrap/modal attribute
      const isModalClose = /data-dismiss|modal-close/i.test(attrs);
      if (!isModalClose) {
        report.deadButtons.push({ text: innerText.slice(0, 30), id, snippet: m[0].slice(0, 80) });
      }
    }
  });

  // Anchors Audit
  const anchorMatches = [...content.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
  report.anchorsCount = anchorMatches.length;

  anchorMatches.forEach((m) => {
    const attrs = m[1];
    const innerText = m[2].replace(/<[^>]+>/g, '').trim() || '[Icon]';
    const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
    const hasOnclick = /onclick=["'][^"']+["']/i.test(attrs);
    const href = hrefMatch ? hrefMatch[1].trim() : '';

    if (!href || href === '#' || href.startsWith('javascript:void(0)')) {
      if (!hasOnclick) {
        report.deadAnchors.push({ text: innerText.slice(0, 30), href, snippet: m[0].slice(0, 80) });
      }
    } else if (!href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('#')) {
      // Relative file check
      const targetFile = href.split('#')[0].split('?')[0];
      if (targetFile && !fs.existsSync(path.join(root, targetFile))) {
        report.deadAnchors.push({ text: innerText.slice(0, 30), href, issue: 'Target file does not exist' });
      }
    }
  });

  // Forms Audit
  const formMatches = [...content.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)];
  report.formsCount = formMatches.length;

  formMatches.forEach((m) => {
    const attrs = m[1];
    const hasOnsubmit = /onsubmit=["'][^"']+["']/i.test(attrs);
    const idMatch = attrs.match(/id=["']([^"']+)["']/i);
    const id = idMatch ? idMatch[1] : null;

    let isHandledInScript = false;
    if (id) {
      const idPattern = new RegExp(`['"#]${id}['"]`, 'i');
      const scripts = [...content.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
      isHandledInScript = scripts.some(s => idPattern.test(s[1]) && s[1].includes('submit'));
    }

    if (!hasOnsubmit && (!id || !isHandledInScript) && !/action=["'][^"']+["']/i.test(attrs)) {
      report.unhandledForms.push({ id, snippet: m[0].slice(0, 80) });
    }
  });

  results.push(report);
});

console.log('=== AUDIT COMPLETE ===');
let totalDeadBtns = 0;
let totalDeadLinks = 0;
let totalIssues = 0;

results.forEach(r => {
  totalDeadBtns += r.deadButtons.length;
  totalDeadLinks += r.deadAnchors.length;
  totalIssues += r.issues.length;

  if (r.deadButtons.length > 0 || r.deadAnchors.length > 0 || r.issues.length > 0 || r.unhandledForms.length > 0) {
    console.log(`\n❌ [NEEDS ATTENTION] ${r.file}:`);
    if (r.issues.length) console.log(`   - Issues: ${r.issues.join(', ')}`);
    if (r.deadButtons.length) {
      console.log(`   - Dead Buttons (${r.deadButtons.length}):`);
      r.deadButtons.forEach(b => console.log(`       [${b.text}] ID: ${b.id || 'none'}`));
    }
    if (r.deadAnchors.length) {
      console.log(`   - Dead Links (${r.deadAnchors.length}):`);
      r.deadAnchors.forEach(a => console.log(`       [${a.text}] Href: ${a.href} (${a.issue || 'no handler'})`));
    }
    if (r.unhandledForms.length) {
      console.log(`   - Unhandled Forms: ${r.unhandledForms.map(f => f.id).join(', ')}`);
    }
  } else {
    console.log(`✅ [PERFECT] ${r.file} (${r.buttonsCount} btns, ${r.anchorsCount} links)`);
  }
});

console.log(`\nTotal Summary:`);
console.log(`- Audited: ${results.length} files`);
console.log(`- Dead Buttons: ${totalDeadBtns}`);
console.log(`- Dead Links: ${totalDeadLinks}`);
console.log(`- General Issues: ${totalIssues}`);
