const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === '.gemini' || file === 'scratch') continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getFiles('.').filter(f => f.endsWith('.html'));

const pages = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'No Title';
  
  const buttons = (content.match(/<button[\s>]/gi) || []).length;
  const links = (content.match(/<a[\s>]/gi) || []).length;
  const forms = (content.match(/<form[\s>]/gi) || []).length;
  const apis = [];
  const apiMatches = content.matchAll(/\/api\/[a-zA-Z0-9_\-\/]+/g);
  for (const m of apiMatches) {
    if (!apis.includes(m[0])) apis.push(m[0]);
  }
  const hasRazorpay = content.includes('Razorpay') || content.includes('rzp');
  const hasAuth = content.includes('vanvi_token') || content.includes('vanvi_user') || content.includes('/api/auth');

  // Extract major button text & targets
  const buttonItems = [];
  const btnRegex = /<button[^>]*>([\s\S]*?)<\/button>/gi;
  let bMatch;
  while ((bMatch = btnRegex.exec(content)) !== null) {
    const rawText = bMatch[1].replace(/<[^>]+>/g, '').trim();
    if (rawText && rawText.length < 50) {
      buttonItems.push(rawText);
    }
  }

  // Extract major link targets
  const linkTargets = [];
  const linkRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let lMatch;
  while ((lMatch = linkRegex.exec(content)) !== null) {
    const href = lMatch[1].trim();
    const text = lMatch[2].replace(/<[^>]+>/g, '').trim();
    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      linkTargets.push({ text: text.substring(0, 40), href });
    }
  }

  pages.push({
    file: file.replace(/\\/g, '/'),
    title,
    buttonsCount: buttons,
    linksCount: links,
    formsCount: forms,
    apis,
    hasRazorpay,
    hasAuth,
    sizeKB: (content.length / 1024).toFixed(1),
    sampleButtons: buttonItems.slice(0, 10),
    sampleLinks: linkTargets.slice(0, 10)
  });
});

console.log('Total pages analyzed:', pages.length);
fs.writeFileSync('scratch/page_inventory.json', JSON.stringify(pages, null, 2));
console.log('Saved inventory to scratch/page_inventory.json');
