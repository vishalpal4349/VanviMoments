const fs = require('fs');
const html = fs.readFileSync('scratch/vercel_raw.html', 'utf8');

const regex = /(?:src|href)=["']([^"']+\.(?:png|jpg|jpeg|gif|svg|webp|mp3|wav|ogg))["']/gi;
const matches = [...html.matchAll(regex)].map(m => m[1]);

const cssUrls = [...html.matchAll(/url\(["']?([^"')]+\.(?:png|jpg|jpeg|gif|svg|webp|mp3|wav|ogg))["']?\)/gi)].map(m => m[1]);

const allAssets = [...new Set([...matches, ...cssUrls])];
console.log('Total unique assets found:', allAssets.length);
console.log(allAssets);
