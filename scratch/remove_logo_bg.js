const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const srcPath = fs.existsSync('c:\\Users\\RISHU KUMARI\\Downloads\\vanvi moments home logo.jpeg') 
  ? 'c:\\Users\\RISHU KUMARI\\Downloads\\vanvi moments home logo.jpeg'
  : 'C:\\Users\\RISHU KUMARI\\.gemini\\antigravity-ide\\brain\\571b4179-b23b-48c9-8b3b-280dfcd95ff7\\.user_uploaded\\media_1791212579851.png';
const destOriginal = path.join(__dirname, '..', 'assets', 'vanvi-moments-logo-original.png');
const destTransparent = path.join(__dirname, '..', 'assets', 'vanvi-moments-logo.png');

// First, copy the original high-res logo
fs.copyFileSync(srcPath, destOriginal);
console.log('Copied original to:', destOriginal);

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];
let executablePath = null;
for (const p of CHROME_PATHS) {
  if (fs.existsSync(p)) { executablePath = p; break; }
}

(async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage();
  
  const base64 = fs.readFileSync(srcPath).toString('base64');
  
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head><style>body { margin: 0; background: transparent; }</style></head>
    <body>
      <canvas id="c"></canvas>
      <img id="srcImg" src="data:image/png;base64,${base64}" />
    </body>
    </html>
  `);

  const transparentBase64 = await page.evaluate(async () => {
    const img = document.getElementById('srcImg');
    await new Promise(r => { if (img.complete) r(); else img.onload = r; });
    
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    
    // Transparent background extraction:
    // Pure white / off-white background keying with smooth anti-aliased gradient
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Calculate brightness / lightness
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const chroma = maxC - minC;
      const lightness = (maxC + minC) / 2;
      
      // If the pixel is very close to white and has almost zero chroma (neutral white/off-white)
      if (lightness > 248 && chroma < 12) {
        data[i + 3] = 0; // Pure transparent
      } else if (lightness > 230 && chroma < 22) {
        // Smooth feathered alpha for delicate edges
        const factor = (lightness - 230) / (248 - 230);
        data[i + 3] = Math.max(0, Math.min(255, Math.round(data[i + 3] * (1 - factor * 0.95))));
      }
    }
    
    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL('image/png').split(',')[1];
  });

  fs.writeFileSync(destTransparent, Buffer.from(transparentBase64, 'base64'));
  console.log('Saved transparent logo to:', destTransparent);
  
  // Also create a ready-to-use header logo version in assets/vanvi-moments-logo-header.png
  // with tight crop around the artwork
  const croppedBase64 = await page.evaluate(async () => {
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const w = canvas.width;
    const h = canvas.height;
    
    let minX = w, maxX = 0, minY = h, maxY = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const a = data[(y * w + x) * 4 + 3];
        if (a > 15) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    
    const cropW = Math.max(1, maxX - minX + 1);
    const cropH = Math.max(1, maxY - minY + 1);
    
    const c2 = document.createElement('canvas');
    c2.width = cropW;
    c2.height = cropH;
    const ctx2 = c2.getContext('2d');
    ctx2.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
    
    return c2.toDataURL('image/png').split(',')[1];
  });

  const destCropped = path.join(__dirname, '..', 'assets', 'vanvi-moments-logo-header.png');
  fs.writeFileSync(destCropped, Buffer.from(croppedBase64, 'base64'));
  console.log('Saved tightly cropped logo to:', destCropped);

  await browser.close();
})();
