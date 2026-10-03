const fs = require('fs');
const path = require('path');

const filePath = "C:\\Users\\RISHU KUMARI\\.gemini\\antigravity-ide\\brain\\c3bf8515-d3ed-4052-9d9f-f51389df543f\\.system_generated\\steps\\1828\\content.md";
const raw = fs.readFileSync(filePath, 'utf8');

// Extract all headings, nav links, button texts, features, text snippets
const headings = raw.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi) || [];
console.log('=== HEADINGS (' + headings.length + ') ===');
headings.slice(0, 30).forEach(h => console.log(h.replace(/<[^>]+>/g, '').trim()));

const links = raw.match(/<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi) || [];
console.log('\n=== KEY LINKS & NAVIGATION (' + links.length + ') ===');
const seen = new Set();
links.forEach(l => {
  const text = l.replace(/<[^>]+>/g, '').trim();
  const hrefMatch = l.match(/href=["']([^"']*)["']/);
  const href = hrefMatch ? hrefMatch[1] : '';
  if (text && !seen.has(href)) {
    seen.add(href);
    console.log(`${text} -> ${href}`);
  }
});
