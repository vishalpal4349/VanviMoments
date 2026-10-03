const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const buttonIssues = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Extract all <button> tags
  const btnMatches = [...content.matchAll(/<button\b([^>]*)>(.*?)<\/button>/gis)];
  
  btnMatches.forEach((m, idx) => {
    const attrs = m[1];
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    const hasOnclick = /onclick\s*=/i.test(attrs);
    const hasId = /id\s*=\s*["']([^"']+)["']/i.exec(attrs);
    const isSubmit = /type\s*=\s*["']submit["']/i.test(attrs);
    const idVal = hasId ? hasId[1] : null;

    let isHandled = hasOnclick || isSubmit;
    if (idVal) {
      // Check if id is referenced in script or CSS
      const idPattern = new RegExp(`['"]#?${idVal}['"]|getElementById\\(['"]${idVal}['"]\\)|querySelector\\(['"][^'"]*#${idVal}['"]\\)`, 'i');
      if (idPattern.test(content) || content.includes(`'${idVal}'`) || content.includes(`"${idVal}"`)) {
        isHandled = true;
      }
    }
    
    // Check if it has classes like accordion, filter, tab, close, modal which are handled via querySelectorAll
    if (/class\s*=\s*["'][^"']*(filter|tab|chip|pill|accordion|modal-close|close|preset|cat-btn|faq-q|option|drawer)[^"']*["']/i.test(attrs)) {
      isHandled = true;
    }

    if (!isHandled) {
      buttonIssues.push({
        file,
        buttonText: text.substring(0, 30),
        attrs: attrs.trim()
      });
    }
  });
});

console.log(`Total unhandled button suspects: ${buttonIssues.length}`);
buttonIssues.forEach(iss => {
  console.log(`[${iss.file}] "${iss.buttonText}" -> ${iss.attrs}`);
});
