const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

function analyzeFile(file) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  console.log(`\n=== ANALYZING: ${file} ===`);
  
  // Find all buttons
  const buttons = [...content.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)];
  console.log(`Total buttons: ${buttons.length}`);
  
  buttons.forEach((b, i) => {
    const attrs = b[1];
    const text = b[2].replace(/<[^>]+>/g, '').trim().slice(0, 30);
    const id = (attrs.match(/id=["']([^"']+)["']/i) || [])[1];
    const classes = (attrs.match(/class=["']([^"']+)["']/i) || [])[1];
    const onclick = (attrs.match(/onclick=["']([^"']+)["']/i) || [])[1];
    const type = (attrs.match(/type=["']([^"']+)["']/i) || [])[1];

    let hasHandler = false;
    let reason = '';

    if (onclick) {
      hasHandler = true;
      reason = 'has inline onclick';
    } else if (type === 'submit') {
      hasHandler = true;
      reason = 'is form submit button';
    } else if (id && (content.includes(`'${id}'`) || content.includes(`"${id}"`) || content.includes(`#${id}`))) {
      hasHandler = true;
      reason = `id "${id}" referenced in script`;
    } else if (classes) {
      const classList = classes.split(/\s+/);
      for (const c of classList) {
        if (content.includes(`'.${c}'`) || content.includes(`".${c}"`) || content.includes(c) && content.includes('querySelectorAll')) {
          hasHandler = true;
          reason = `class "${c}" used in querySelectorAll`;
          break;
        }
      }
    }

    if (!hasHandler) {
      console.log(`  ❌ UNHANDLED BUTTON #${i+1}: [${text}] id="${id||''}" class="${classes||''}"`);
    }
  });

  // Check anchors
  const anchors = [...content.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
  anchors.forEach((a, i) => {
    const attrs = a[1];
    const text = a[2].replace(/<[^>]+>/g, '').trim().slice(0, 30);
    const href = (attrs.match(/href=["']([^"']*)["']/i) || [])[1];
    const onclick = (attrs.match(/onclick=["']([^"']+)["']/i) || [])[1];

    if ((!href || href === '#' || href.startsWith('javascript:void(0)')) && !onclick) {
      console.log(`  ❌ UNHANDLED ANCHOR #${i+1}: [${text}] href="${href}"`);
    }
  });
}

// Test all HTML files
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html')).sort();
console.log(`Running deep interactivity audit on all ${htmlFiles.length} HTML files...`);
htmlFiles.forEach(analyzeFile);
