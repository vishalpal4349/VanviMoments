const fs = require('fs');
const path = require('path');

const dirs = fs.readdirSync('templates').filter(f => fs.statSync(path.join('templates', f)).isDirectory());

console.log(`Found ${dirs.length} template folders in templates/`);

const templateFolderAudit = [];

dirs.forEach(folder => {
  const fullPath = path.join('templates', folder);
  const files = fs.readdirSync(fullPath);
  
  // Find potential images
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f));
  
  // Look in assets or media subdirs
  let subImages = [];
  ['assets', 'media', 'images', 'assets/images'].forEach(sub => {
    const sp = path.join(fullPath, sub);
    if (fs.existsSync(sp) && fs.statSync(sp).isDirectory()) {
      try {
        const sFiles = fs.readdirSync(sp).filter(f => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f));
        subImages = subImages.concat(sFiles.map(sf => path.join(sub, sf)));
      } catch(e) {}
    }
  });

  templateFolderAudit.push({
    folder,
    hasIndex: files.includes('index.html'),
    hasBuilder: files.includes('builder.html'),
    hasJson: files.includes('template.json'),
    directImages: imageFiles,
    subImages: subImages
  });
});

console.log('--- Template Folders & Available Visuals ---');
templateFolderAudit.forEach(t => {
  const allImgs = [...t.directImages, ...t.subImages];
  console.log(`[${t.folder}] - index: ${t.hasIndex}, builder: ${t.hasBuilder}, imgs: ${allImgs.length} (${allImgs.slice(0, 3).join(', ')})`);
});
