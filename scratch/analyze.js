const fs = require('fs');
const html = fs.readFileSync('scratch/vercel_raw.html', 'utf8');

// Find all src, href, url(...) and script sources
const srcMatches = [...html.matchAll(/src=["']([^"']+)["']/g)].map(m => m[1]);
const bgMatches = [...html.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(m => m[1]);
const audios = [...html.matchAll(/(https?:\/\/[^\s"'<>]+\.(?:mp3|wav|ogg|m4a))/g)].map(m => m[1]);

console.log('--- SRC MATCHES ---');
console.log([...new Set(srcMatches)]);

console.log('\n--- BACKGROUND URL MATCHES ---');
console.log([...new Set(bgMatches)]);

console.log('\n--- AUDIO MATCHES ---');
console.log([...new Set(audios)]);

// Check where scripts and stages are
const sections = [...html.matchAll(/<section[^>]*id=["']([^"']+)["']/g)].map(m => m[1]);
console.log('\n--- SECTION IDS ---');
console.log(sections);

// Check classes or main containers
const mainDivs = [...html.matchAll(/<div[^>]*class=["']([^"']+)["']/g)].map(m => m[1]);
console.log('\n--- MAIN CONTAINER CLASSES (First 20) ---');
console.log([...new Set(mainDivs)].slice(0, 20));
