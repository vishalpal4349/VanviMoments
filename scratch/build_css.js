const fs = require('fs');

const rawCss = fs.readFileSync('scratch/amadowish/BirthdayReceiver.css', 'utf8');

const header = `/* Vanvi Moments — Hey Birthday Interactive Experience */
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
  font-family: 'Nunito', Segoe UI, -apple-system, sans-serif;
  background-color: #fffaf5;
  -webkit-font-smoothing: antialiased;
}

/* Subtle Vanvi Moments brand pill */
.vanvi-badge {
  position: fixed;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(223, 103, 156, 0.25);
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 11px;
  font-weight: 700;
  color: #c85089;
  letter-spacing: 0.05em;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(99, 67, 89, 0.08);
  transition: all 0.2s ease;
}
.vanvi-badge:hover {
  background: #ffffff;
  transform: translateX(-50%) translateY(-1px);
  box-shadow: 0 6px 18px rgba(223, 103, 156, 0.18);
  color: #df679c;
}
.vanvi-badge svg {
  width: 12px;
  height: 12px;
  fill: #ff8fbd;
}

/* Enhancements for handwritten font */
.tpl-birthday .handwritten-title,
.tpl-birthday .handwritten-small,
.tpl-birthday .mega-title {
  font-family: 'Caveat', 'Segoe Print', 'Comic Sans MS', cursive !important;
}

.tpl-birthday h1, .tpl-birthday h2, .tpl-birthday .letter-lines {
  font-family: 'Playfair Display', Georgia, serif;
}

/* Lightbox overlay for museum spotlight on mobile */
.album-card.spotlight {
  transform: scale(1.08) rotate(0deg) !important;
  z-index: 10;
  box-shadow: 0 20px 50px rgba(74, 53, 80, 0.35) !important;
}
`;

fs.writeFileSync('templates/Hey Birthday/style.css', header + '\n' + rawCss, 'utf8');
console.log('Saved templates/Hey Birthday/style.css, bytes:', fs.statSync('templates/Hey Birthday/style.css').size);
