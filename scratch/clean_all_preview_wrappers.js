const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '..', 'templates');
const cleanPreviewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Direct Experience | Vanvi Moments</title>
  <script>
    (function() {
      const search = window.location.search || '';
      const hash = window.location.hash || '';
      window.location.replace('index.html' + search + hash);
    })();
  </script>
</head>
<body style="background:#000; margin:0; display:flex; align-items:center; justify-content:center; height:100vh; color:#fff; font-family:sans-serif;">
  <p>Entering template...</p>
</body>
</html>
`;

if (fs.existsSync(templatesDir)) {
  const entries = fs.readdirSync(templatesDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const pFile = path.join(templatesDir, entry.name, 'preview.html');
      const iFile = path.join(templatesDir, entry.name, 'index.html');
      if (fs.existsSync(iFile)) {
        fs.writeFileSync(pFile, cleanPreviewHtml, 'utf8');
        console.log('Cleaned preview.html for templates/' + entry.name);
      }
    }
  }
}

// Also check root folder templates that had preview.html
const rootFolders = ['floral-mehendi-story', 'sacred-temple-edition', 'golden-lake-collection'];
for (const folder of rootFolders) {
  const pFile = path.join(__dirname, '..', folder, 'preview.html');
  const iFile = path.join(__dirname, '..', folder, 'index.html');
  if (fs.existsSync(iFile)) {
    fs.writeFileSync(pFile, cleanPreviewHtml, 'utf8');
    console.log('Cleaned preview.html for root ' + folder);
  }
}
