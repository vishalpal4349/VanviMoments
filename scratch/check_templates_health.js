const fs = require('fs');
const path = require('path');

const templateDirs = fs.readdirSync('templates').filter(f => fs.statSync(path.join('templates', f)).isDirectory());

console.log('Total template directories:', templateDirs.length);

templateDirs.forEach(dir => {
  const dirPath = path.join('templates', dir);
  const files = fs.readdirSync(dirPath);
  const hasIndex = files.includes('index.html');
  const hasBuilder = files.includes('builder.html');
  const hasPreview = files.includes('preview.html');
  console.log(`${dir.padEnd(30)} -> index: ${hasIndex ? '✅' : '❌'}, builder: ${hasBuilder ? '✅' : '❌'}, preview: ${hasPreview ? '✅' : '❌'}`);
});
