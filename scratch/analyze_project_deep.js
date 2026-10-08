const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Scan all HTML files
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

// Also scan templates
const templatesDir = path.join(rootDir, 'templates');
const templateDirs = fs.existsSync(templatesDir) ? fs.readdirSync(templatesDir).filter(d => fs.statSync(path.join(templatesDir, d)).isDirectory()) : [];

const templateHtmlFiles = [];
templateDirs.forEach(td => {
  const dir = path.join(templatesDir, td);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  files.forEach(f => {
    templateHtmlFiles.push({ template: td, file: f, relPath: `templates/${td}/${f}` });
  });
});

// 2. Scan server routes
const serverRoutesDir = path.join(rootDir, 'server', 'routes');
const routeFiles = fs.existsSync(serverRoutesDir) ? fs.readdirSync(serverRoutesDir).filter(f => f.endsWith('.js')) : [];

const apiEndpoints = [];
routeFiles.forEach(rf => {
  const content = fs.readFileSync(path.join(serverRoutesDir, rf), 'utf8');
  const lines = content.split('\n');
  lines.forEach(line => {
    const match = line.match(/router\.(get|post|put|delete|patch)\(['"`]([^'"`]+)['"`]/i);
    if (match) {
      const baseName = rf.replace('.routes.js', '');
      apiEndpoints.push({ method: match[1].toUpperCase(), path: `/api/${baseName}${match[2] === '/' ? '' : match[2]}`, file: rf });
    }
  });
});

// 3. Parse each HTML file in detail
const pageAnalysis = {};

htmlFiles.forEach(hf => {
  const filePath = path.join(rootDir, hf);
  const content = fs.readFileSync(filePath, 'utf8');

  // Title
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : hf;

  // Forms
  const forms = [];
  const formMatches = content.match(/<form[^>]*>([\s\S]*?)<\/form>/gi) || [];
  formMatches.forEach(fm => {
    const idMatch = fm.match(/id=['"]([^'"]+)['"]/i);
    const actionMatch = fm.match(/action=['"]([^'"]+)['"]/i);
    const onsubmitMatch = fm.match(/onsubmit=['"]([^'"]+)['"]/i);
    forms.push({ id: idMatch ? idMatch[1] : null, action: actionMatch ? actionMatch[1] : null, onsubmit: onsubmitMatch ? onsubmitMatch[1] : null });
  });

  // Buttons & Links
  const links = [];
  const linkMatches = content.match(/<a\s+[^>]*href=['"]([^'"]*)['"][^>]*>([\s\S]*?)<\/a>/gi) || [];
  linkMatches.forEach(lm => {
    const hrefM = lm.match(/href=['"]([^'"]*)['"]/i);
    const textM = lm.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (hrefM) links.push({ href: hrefM[1], text: textM.slice(0, 40) });
  });

  const buttons = [];
  const buttonMatches = content.match(/<button[^>]*>([\s\S]*?)<\/button>/gi) || [];
  buttonMatches.forEach(bm => {
    const idM = bm.match(/id=['"]([^'"]+)['"]/i);
    const clickM = bm.match(/onclick=['"]([^'"]+)['"]/i);
    const typeM = bm.match(/type=['"]([^'"]+)['"]/i);
    const textM = bm.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    buttons.push({ id: idM ? idM[1] : null, onclick: clickM ? clickM[1].slice(0, 50) : null, type: typeM ? typeM[1] : 'button', text: textM.slice(0, 40) });
  });

  // LocalStorage keys
  const lsKeys = new Set();
  const lsMatches = content.match(/localStorage\.(getItem|setItem|removeItem)\(['"`]([^'"`]+)['"`]/g) || [];
  lsMatches.forEach(m => {
    const k = m.match(/['"`]([^'"`]+)['"`]/);
    if (k) lsKeys.add(k[1]);
  });

  // API calls
  const apiCalls = new Set();
  const fetchMatches = content.match(/fetch\(['"`]([^'"`]+)['"`]/g) || [];
  fetchMatches.forEach(m => {
    const u = m.match(/['"`]([^'"`]+)['"`]/);
    if (u) apiCalls.add(u[1]);
  });

  // Auth & Payment check
  const usesAuth = content.includes('vanvi_token') || content.includes('/api/auth') || content.includes('requireAuth') || content.includes('vanviUser');
  const usesRazorpay = content.includes('Razorpay') || content.includes('/api/payments') || content.includes('rzp');

  // Polish status heuristic
  let polish = '🟢 POLISHED';
  if (hf === 'coming-soon.html') polish = '⚪ PLACEHOLDER / COMING SOON';
  else if (hf === 'terms.html' || hf === 'privacy.html' || hf === 'refund.html') polish = '🟢 POLISHED';
  else if (content.length < 15000 && !hf.startsWith('category-')) polish = '🟡 FUNCTIONAL BUT NEEDS UI POLISH';

  pageAnalysis[hf] = {
    title,
    sizeBytes: content.length,
    formsCount: forms.length,
    linksCount: links.length,
    buttonsCount: buttons.length,
    forms,
    sampleLinks: links.slice(0, 15),
    sampleButtons: buttons.slice(0, 15),
    localStorageKeys: Array.from(lsKeys),
    apiCalls: Array.from(apiCalls),
    usesAuth,
    usesRazorpay,
    polish
  };
});

// Write summary JSON to scratch
fs.writeFileSync(path.join(__dirname, 'project_analysis.json'), JSON.stringify({
  totalHtmlPages: htmlFiles.length,
  htmlFiles,
  templateDirs,
  templateHtmlFiles,
  apiEndpoints,
  pageAnalysis
}, null, 2));

console.log('Project analysis JSON written successfully!');
console.log(`Discovered: ${htmlFiles.length} root HTML pages, ${templateDirs.length} templates (${templateHtmlFiles.length} template pages), ${apiEndpoints.length} API endpoints.`);
