const fs = require('fs');
const path = require('path');

function scanDirectory(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'scratch') {
        scanDirectory(fullPath, list);
      }
    } else if (entry.name.endsWith('.html')) {
      list.push(fullPath);
    }
  }
  return list;
}

const allHtmlFiles = scanDirectory('.');

const brokenFiles = [];

for (const file of allHtmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let issues = [];

  // Check 1: Broken favicon string
  if (content.includes('font-size=%2290%22') || content.includes('</text></svg>">') || content.includes('</text></svg>')) {
    issues.push('BROKEN_FAVICON_SVG_TEXT');
  }

  // Check 2: Stray text in <head> outside of valid tags (title, style, script, meta, link, base, etc.)
  const headMatch = content.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (headMatch) {
    const headContent = headMatch[1];
    const noValidTags = headContent
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<title[\s\S]*?<\/title>/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/<link[^>]*>/gi, '')
      .replace(/<base[^>]*>/gi, '')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, '');

    const leftover = noValidTags.replace(/<[^>]+>/g, '').trim();
    if (leftover.length > 0) {
      issues.push(`STRAY_HEAD_TEXT: ${JSON.stringify(leftover)}`);
    }
  }

  // Check 3: Check between </head> and <body>
  const betweenMatch = content.match(/<\/head>([\s\S]*?)<body[^>]*>/i);
  if (betweenMatch) {
    const textBetween = betweenMatch[1].replace(/<!--[\s\S]*?-->/g, '').trim();
    if (textBetween.length > 0) {
      issues.push(`TEXT_BETWEEN_HEAD_AND_BODY: ${JSON.stringify(textBetween)}`);
    }
  }

  // Check 4: Check top of body before any tag
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<(?:div|header|nav|section|main|aside|article|h1|h2|p|span|a|button|form|table|canvas)/i);
  if (bodyMatch) {
    const topBody = bodyMatch[1].replace(/<!--[\s\S]*?-->/g, '').trim();
    if (topBody.length > 0) {
      issues.push(`STRAY_TOP_BODY: ${JSON.stringify(topBody)}`);
    }
  }

  if (issues.length > 0) {
    console.log(`\n❌ ${file}:`);
    issues.forEach(i => console.log('   - ' + i));
    brokenFiles.push({ file, issues });
  }
}

console.log('\n=======================================');
console.log('Total files with issues:', brokenFiles.length);
