const fs = require('fs');
const path = require('path');

const files = ['index.html', 'products.html', 'checkout.html', 'order-success.html', 'login.html', 'signup.html'];
const root = process.cwd();

let issues = 0;

files.forEach(file => {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  
  // Check images
  const imgMatches = content.match(/<img[^>]+src=["']([^"']+)["']/gi) || [];
  imgMatches.forEach(tag => {
    const src = tag.match(/src=["']([^"']+)["']/i)[1];
    if (src.startsWith('http') || src.startsWith('data:')) return;
    const cleanSrc = src.split('?')[0].split('#')[0];
    const fullPath = path.join(root, cleanSrc);
    if (!fs.existsSync(fullPath)) {
      console.log(`[404 IMG] ${file}: ${src}`);
      issues++;
    }
  });

  // Check script tags
  const scriptMatches = content.match(/<script[^>]+src=["']([^"']+)["']/gi) || [];
  scriptMatches.forEach(tag => {
    const src = tag.match(/src=["']([^"']+)["']/i)[1];
    if (src.startsWith('http') || src.startsWith('//')) return;
    const cleanSrc = src.split('?')[0].split('#')[0];
    const fullPath = path.join(root, cleanSrc);
    if (!fs.existsSync(fullPath)) {
      console.log(`[404 SCRIPT] ${file}: ${src}`);
      issues++;
    }
  });

  // Check css link tags
  const cssMatches = content.match(/<link[^>]+href=["']([^"']+)["']/gi) || [];
  cssMatches.forEach(tag => {
    const href = tag.match(/href=["']([^"']+)["']/i)[1];
    if (href.startsWith('http') || href.startsWith('//') || href.startsWith('data:') || href.startsWith('#')) return;
    const cleanHref = href.split('?')[0].split('#')[0];
    const fullPath = path.join(root, cleanHref);
    if (!fs.existsSync(fullPath)) {
      console.log(`[404 CSS/LINK] ${file}: ${href}`);
      issues++;
    }
  });
});

console.log(`Scan completed. Total asset issues found: ${issues}`);
