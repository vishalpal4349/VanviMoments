// Full link + asset + route audit across all HTML pages
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const pages = fs.readdirSync(root).filter(f => f.endsWith('.html'));
const existing = new Set(pages);
const issues = [];
const linkCounts = {};

for (const p of pages) {
  const html = fs.readFileSync(path.join(root, p), 'utf8');
  // hrefs
  const hrefs = [...html.matchAll(/href=["']([^"'#?]+)(?:[#?][^"']*)?["']/g)].map(m => m[1]);
  const srcs = [...html.matchAll(/src=["']([^"']+)["']/g)].map(m => m[1]);
  const locs = [...html.matchAll(/(?:location\.href|location\.assign|window\.open|location\.replace)\s*\(?\s*=?\s*["'`]([^"'`$]+)["'`]/g)].map(m => m[1]);
  const all = [...hrefs, ...locs];
  for (const h of all) {
    if (!h || h.startsWith('http') || h.startsWith('mailto:') || h.startsWith('tel:') || h.startsWith('javascript:') || h.startsWith('data:') || h.startsWith('//')) continue;
    let target = h.replace(/^\.?\//, '');
    if (target === '' ) target = 'index.html';
    if (target.endsWith('.html')) {
      if (!existing.has(target)) issues.push(`${p}: broken page link -> ${h}`);
      linkCounts[target] = (linkCounts[target] || 0) + 1;
    } else if (target.endsWith('.css') || target.endsWith('.js') || /\.(png|jpg|jpeg|svg|webp|ico|gif)$/i.test(target)) {
      if (!fs.existsSync(path.join(root, target))) issues.push(`${p}: missing asset -> ${h}`);
    } else if (!target.includes('/') && !target.includes('.')) {
      // extensionless route like /templates
      issues.push(`${p}: extensionless route (verify server handles) -> ${h}`);
    }
  }
  for (const s of srcs) {
    if (!s || s.startsWith('http') || s.startsWith('data:') || s.startsWith('//') || s.includes('${')) continue;
    const t = s.replace(/^\.?\//, '');
    if (!fs.existsSync(path.join(root, t))) issues.push(`${p}: missing src -> ${s}`);
  }
  // empty hrefs
  const emptyH = (html.match(/href=["']#["']/g) || []).length;
  if (emptyH) issues.push(`${p}: ${emptyH} href="#" dead anchors`);
  // dark bg detection
  if (/background(?:-color)?\s*:\s*#(0[0-9a-f]|1[0-9a-f])[0-9a-f]{4}\b/i.test(html) && !/moment\.html|404/.test(p)) {
    issues.push(`${p}: possible dark background color`);
  }
  // viewport meta
  if (!/<meta[^>]*name="viewport"/.test(html)) issues.push(`${p}: missing viewport meta`);
  if (!/<meta[^>]*name="description"/.test(html)) issues.push(`${p}: missing meta description`);
  if (!/<title[^>]*>/.test(html)) issues.push(`${p}: missing title`);
  const t = (html.match(/<title[^>]*>([^<]*)<\/title>/) || [])[1] || '';
  if (/preview|untitled|test/i.test(t)) issues.push(`${p}: weak title -> "${t}"`);
}
console.log('Pages:', pages.length);
console.log('Orphan pages (not linked from anywhere):', pages.filter(p => !linkCounts[p] && p !== 'index.html').join(', ') || 'none');
console.log('\nISSUES (' + issues.length + '):');
issues.forEach(i => console.log(' -', i));
