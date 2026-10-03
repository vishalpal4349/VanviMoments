const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// 1. ai.html
const aiPath = path.join(ROOT, 'ai.html');
if (fs.existsSync(aiPath)) {
  let content = fs.readFileSync(aiPath, 'utf8');
  content = content.replace(/template-detail\.html\?template=/g, 'builder.html?template=');
  content = content.replace(/href="template-detail\.html[^"]*"/g, 'href="templates.html"');
  fs.writeFileSync(aiPath, content, 'utf8');
  console.log('Updated ai.html');
}

// 2. ai-matcher.html
const aiMatcherPath = path.join(ROOT, 'ai-matcher.html');
if (fs.existsSync(aiMatcherPath)) {
  let content = fs.readFileSync(aiMatcherPath, 'utf8');
  content = content.replace(/template-detail\.html\?template=/g, 'builder.html?template=');
  fs.writeFileSync(aiMatcherPath, content, 'utf8');
  console.log('Updated ai-matcher.html');
}

// 3. admin.html
const adminPath = path.join(ROOT, 'admin.html');
if (fs.existsSync(adminPath)) {
  let content = fs.readFileSync(adminPath, 'utf8');
  content = content.replace(/template-detail\.html\?template=/g, 'builder.html?template=');
  fs.writeFileSync(adminPath, content, 'utf8');
  console.log('Updated admin.html');
}

// 4. dashboard.html
const dashPath = path.join(ROOT, 'dashboard.html');
if (fs.existsSync(dashPath)) {
  let content = fs.readFileSync(dashPath, 'utf8');
  content = content.replace(/template-detail\.html\?template=/g, 'builder.html?template=');
  fs.writeFileSync(dashPath, content, 'utf8');
  console.log('Updated dashboard.html');
}

// 5. checkout.html
const checkoutPath = path.join(ROOT, 'checkout.html');
if (fs.existsSync(checkoutPath)) {
  let content = fs.readFileSync(checkoutPath, 'utf8');
  content = content.replace(/href="template-detail\.html"/g, 'href="templates.html"');
  content = content.replace(/replace\('checkout\.html', 'template-detail\.html'\)/g, "replace('checkout.html', 'builder.html')");
  fs.writeFileSync(checkoutPath, content, 'utf8');
  console.log('Updated checkout.html');
}

console.log('All remaining links updated cleanly!');
