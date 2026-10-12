const fs = require('fs');

const pages = ['index.html', 'products.html', 'checkout.html', 'order-success.html', 'login.html', 'signup.html'];
let imgIssues = [];

pages.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const noScript = content.replace(/<script[\s\S]*?<\/script>/gi, '');
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = imgRegex.exec(noScript)) !== null) {
    const src = match[1];
    if (!src.startsWith('http') && !src.startsWith('//') && !src.startsWith('data:') && !src.includes('${')) {
      const cleanPath = src.split('?')[0].split('#')[0];
      if (!fs.existsSync(cleanPath)) {
        imgIssues.push({ file, asset: src });
      }
    }
  }
});

console.log('Real missing static images:', imgIssues.length);
if (imgIssues.length > 0) {
  console.log(JSON.stringify(imgIssues, null, 2));
} else {
  console.log('✅ 100% STATIC IMAGES FOUND AND RESOLVED ON DISK.');
}
