const fs = require('fs');

const builderCss = `/* Vanvi Moments — Hey Birthday Builder (100% Exact Amadowish Design System) */
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

:root {
  --bg: #fff8f5;
  --bg-soft: #fdf0ec;
  --surface: #ffffff;
  --ink: #2b1b24;
  --ink-soft: #5d4a55;
  --muted: #6e5a65;
  --accent: #b4476c;
  --rose: #b4476c;
  --rose-deep: #943656;
  --rose-soft: #fbe6ec;
  --rose-glow: #f6c6d3;
  --gold: #e9b44c;
  --line: #f1e3e0;
  --line-strong: #e6d0d2;
  --tint: #ffd9e6;
  --shadow-sm: 0 2px 8px rgba(94, 50, 70, 0.06);
  --shadow-md: 0 14px 34px rgba(94, 50, 70, 0.1);
  --shadow-lg: 0 30px 70px rgba(94, 50, 70, 0.16);
  --radius-xl: 32px;
  --radius-lg: 24px;
  --radius-md: 16px;
  --radius-sm: 12px;
  --serif: 'Playfair Display', Georgia, 'Times New Roman', serif;
  --sans: 'Nunito', 'Segoe UI', system-ui, -apple-system, sans-serif;
  --hand: 'Caveat', 'Segoe Print', cursive;
  --header-h: 70px;
  --container: 1040px;
  --gutter: 20px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  min-height: 100vh;
  font-family: var(--sans);
  background-color: var(--bg);
  color: var(--ink);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

/* Site Header */
.site-header {
  height: var(--header-h);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  z-index: 50;
}
.header-inner {
  max-width: calc(var(--container) + var(--gutter) * 2);
  margin: 0 auto;
  padding: 0 var(--gutter);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.site-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--ink);
}
.brand-mark {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #ff8fbd, #df679c);
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(223, 103, 156, 0.35);
}
.brand-name {
  font-family: var(--serif);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink);
}
.header-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Buttons */
.aw-btn {
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
  border: 1px solid transparent;
  border-radius: 999px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  min-height: 46px;
  padding: 11px 24px;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.2;
  text-decoration: none;
  transition: transform .18s, box-shadow .18s, background .18s, border-color .18s, color .18s;
  display: inline-flex;
  cursor: pointer;
}
.aw-btn:active:not(:disabled) {
  transform: translateY(1px) scale(.98);
}
.aw-btn:disabled {
  opacity: .55;
  cursor: not-allowed;
}
.aw-btn-primary {
  color: #fff;
  background: linear-gradient(105deg, var(--rose-deep), var(--rose) 55%, #cc6a88);
  box-shadow: 0 10px 22px rgba(180, 71, 108, 0.28);
}
.aw-btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(180, 71, 108, 0.36);
}
.aw-btn-ghost {
  background: var(--surface);
  color: var(--rose-deep);
  border-color: var(--line-strong);
}
.aw-btn-ghost:hover:not(:disabled) {
  background: var(--rose-soft);
  border-color: var(--rose-glow);
}
.aw-btn-small {
  min-height: 36px;
  padding: 7px 16px;
  font-size: 13.5px;
}

/* Container & Create Layout */
.container {
  width: 100%;
  max-width: calc(var(--container) + var(--gutter) * 2);
  padding: 0 var(--gutter);
  margin: 0 auto;
}
.create {
  padding-top: 28px;
  padding-bottom: 72px;
}
.create-top {
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  display: flex;
}
.create-step-label {
  color: var(--muted);
  font-size: 14px;
  font-weight: 800;
}
.progress {
  background: #f3dfdc;
  border-radius: 999px;
  height: 6px;
  margin-bottom: 28px;
  overflow: hidden;
}
.progress-fill {
  background: linear-gradient(90deg, #f0b6aa, var(--accent));
  border-radius: 999px;
  height: 100%;
  transition: width .35s ease;
}

.create-grid {
  grid-template-columns: 260px minmax(0, 1fr);
  align-items: start;
  gap: 28px;
  display: grid;
}

/* Stepper Sidebar */
.stepper {
  top: calc(var(--header-h) + 20px);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 18px 14px;
  position: sticky;
}
.stepper-title {
  border-bottom: 1px solid var(--line);
  margin-bottom: 8px;
  padding: 0 8px 10px;
  font-weight: 800;
  font-size: 14px;
  color: var(--ink);
}
.stepper ol {
  gap: 3px;
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
}
.stepper-item {
  text-align: left;
  width: 100%;
  color: var(--muted);
  background: transparent;
  border: 0;
  border-radius: 12px;
  align-items: center;
  gap: 10px;
  padding: 8px;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  cursor: pointer;
  transition: all .2s;
}
.stepper-item:not(:disabled):hover {
  background: var(--bg-soft);
  color: var(--ink);
}
.stepper-item.is-done {
  color: var(--ink-soft);
}
.stepper-item.is-current {
  background: var(--tint);
  color: var(--ink);
}
.stepper-dot {
  background: var(--bg-soft);
  width: 26px;
  height: 26px;
  color: var(--muted);
  border-radius: 50%;
  flex: none;
  place-items: center;
  font-size: 12.5px;
  font-weight: 900;
  display: grid;
  transition: all .2s;
}
.stepper-item.is-done .stepper-dot {
  background: color-mix(in srgb, var(--accent) 18%, white);
  color: var(--accent);
}
.stepper-item.is-current .stepper-dot {
  background: var(--accent);
  color: #fff;
}
.stepper-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  overflow: hidden;
}
.stepper-preview {
  width: 100%;
  margin-top: 14px;
}

/* Wizard Card */
.wizard-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: clamp(24px, 4vw, 44px);
}
.wizard-eyebrow {
  letter-spacing: .16em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--accent) 72%, black);
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 800;
}
.wizard-title {
  font-family: var(--serif);
  letter-spacing: -.025em;
  margin-bottom: 12px;
  font-size: clamp(28px, 3.6vw, 40px);
  font-weight: 700;
  line-height: 1.15;
}
.wizard-intro {
  color: var(--ink-soft);
  max-width: 640px;
  margin-bottom: 22px;
  font-size: 15.5px;
}

/* Fields & Form Controls */
.field {
  margin-bottom: 22px;
}
.field-label {
  color: #4a3040;
  margin-bottom: 7px;
  font-weight: 800;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.field-label-note {
  color: var(--muted);
  font-weight: 500;
  font-size: 12.5px;
}
.input {
  resize: vertical;
  background: #fffefd;
  border: 1px solid #e6cfc9;
  border-radius: 14px;
  width: 100%;
  padding: 13px 16px;
  font-size: 16px;
  color: var(--ink);
  font-family: inherit;
  transition: border-color .2s, box-shadow .2s;
  outline: none;
}
.input::placeholder {
  color: #b8a3a8;
}
.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 16%, transparent);
}
textarea.input {
  line-height: 1.5;
}

/* Tips Box */
.tips {
  border-radius: var(--radius-md);
  background: #fdf3ef;
  border: 1px solid #f3dcd3;
  margin-bottom: 22px;
  padding: 16px 20px;
}
.tips-title {
  color: #8f4353;
  margin-bottom: 6px;
  font-weight: 800;
  font-size: 14px;
}
.tips ul {
  color: var(--ink-soft);
  gap: 4px;
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  display: grid;
}

/* Dropzone & Photo Gallery */
.dropzone {
  border-radius: var(--radius-lg);
  text-align: center;
  cursor: pointer;
  background: #fffafb;
  border: 2px dashed #e7c1c9;
  padding: 32px 20px;
  transition: border-color .2s, background .2s;
}
.dropzone:hover {
  border-color: var(--accent);
  background: var(--rose-soft);
}
.dropzone-icon {
  font-size: 36px;
}
.dropzone-text {
  margin-top: 8px;
  font-size: 16px;
}
.dropzone-text strong {
  color: var(--rose-deep);
}
.dropzone-sub {
  color: var(--muted);
  margin-top: 4px;
  font-size: 13.5px;
}

.thumbs {
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
}
.thumb {
  position: relative;
}
.thumb-frame {
  aspect-ratio: 1;
  border: 1px solid var(--line);
  background: #faf2f3;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
}
.thumb-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumb-num {
  position: absolute;
  top: 6px;
  left: 6px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 6px;
}
.thumb-remove {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #e53e3e;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 14px;
  line-height: 1;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

/* Wizard Navigation */
.wizard-nav {
  border-top: 1px solid var(--line);
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  padding-top: 22px;
  display: flex;
}
.wizard-nav-group {
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
  display: flex;
}

/* Share Screen / Link Box */
.link-box {
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, #fff6f3, #fdeef2);
  border: 1px solid #f0cfc8;
  margin-top: 12px;
  padding: 24px;
}
.link-box-title {
  font-family: var(--serif);
  margin-bottom: 6px;
  font-size: 26px;
  font-weight: 700;
  color: var(--ink);
}
.link-box-sub {
  color: var(--ink-soft);
  margin-bottom: 16px;
  font-size: 15px;
}
.link-row {
  gap: 10px;
  display: flex;
}
.link-input {
  font-family: Consolas, Menlo, monospace;
  font-size: 14px;
  background: #fff;
}
.share-row {
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
  display: flex;
}
.share-btn {
  border: 1px solid var(--line-strong);
  color: var(--ink-soft);
  background: #fff;
  border-radius: 999px;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
  display: inline-flex;
  cursor: pointer;
  transition: all .2s;
}
.share-btn:hover {
  border-color: var(--rose-glow);
  color: var(--rose-deep);
  transform: translateY(-1px);
}
.share-whatsapp {
  color: #1c7a47;
  background: #f0fbf4;
  border-color: #bfe6cf;
}
.share-whatsapp:hover {
  background: #e4f7eb;
}

/* Live Preview Overlay (Modal Phone Frame) */
.preview-overlay {
  z-index: 100;
  background: rgba(30, 20, 25, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  flex-direction: column;
  animation: .25s fadeIn;
  display: none;
  position: fixed;
  inset: 0;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.preview-overlay.open {
  display: flex;
}
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.preview-modal-shell {
  background: #fff;
  border-radius: var(--radius-xl);
  box-shadow: 0 30px 80px rgba(0,0,0,0.4);
  width: 420px;
  max-width: 100%;
  height: 820px;
  max-height: 94vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 8px solid #2b1b24;
}

.preview-bar {
  color: #fbe9ee;
  background: #2b1b24;
  flex: none;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
  display: flex;
  font-size: 13px;
  font-weight: 700;
}
.preview-scroll {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
}
.preview-scroll iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .create-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .stepper {
    position: static;
    margin-bottom: 8px;
  }
  .stepper ol {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
  .stepper-text {
    display: none;
  }
  .stepper-item {
    justify-content: center;
    padding: 6px;
  }
  .wizard-card {
    padding: 22px 18px;
    border-radius: var(--radius-lg);
  }
  .preview-modal-shell {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    border-radius: 0;
    border: none;
  }
  .preview-overlay {
    padding: 0;
  }
}
`;

fs.writeFileSync('templates/Hey Birthday/builder.css', builderCss, 'utf8');
console.log('Saved templates/Hey Birthday/builder.css, bytes:', fs.statSync('templates/Hey Birthday/builder.css').size);
