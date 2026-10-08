const fs = require('fs');
const files = fs.readdirSync('scratch');

console.log('--- Scanning tests for admin.html references ---');
files.forEach(f => {
  if (f.endsWith('.js')) {
    const txt = fs.readFileSync('scratch/' + f, 'utf8');
    if (txt.includes('admin.html') || txt.includes('adminProductsTbody') || txt.includes('adminTemplatesTbody')) {
      console.log('File references admin:', f);
      const lines = txt.split('\n');
      lines.forEach((l, i) => {
        if (l.includes('admin.html') || l.includes('Tbody') || l.includes('openEditTemplate') || l.includes('openProduct')) {
          console.log(`  Line ${i+1}: ${l.trim().slice(0, 100)}`);
        }
      });
    }
  }
});
