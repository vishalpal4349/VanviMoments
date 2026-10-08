const fs = require('fs');
const path = require('path');

const plansPath = path.join(__dirname, '..', 'plans.html');
let content = fs.readFileSync(plansPath, 'utf8');

// 1. Updated CSS for stacked pods and compact 3D slider cards
const oldCssTarget = `/* Compact Slider Container & Tracks */
.plans-slider-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.plans-slider-track {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 6px 4px 16px;
}
.plans-slider-track::-webkit-scrollbar {
  display: none;
}

/* Compact Slider Cards */
.compact-slider-card {
  flex: 0 0 calc(33.333% - 11px);
  min-width: 285px;
  max-width: 360px;
  scroll-snap-align: start;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(255, 248, 252, 0.98));
  border: 1.5px solid rgba(255, 120, 175, 0.3);
  border-radius: 26px;
  padding: 22px 20px;
  box-shadow: 
    0 16px 40px -8px rgba(255, 56, 128, 0.08),
    0 4px 12px rgba(44, 18, 36, 0.03),
    inset 0 2px 2px #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  overflow: hidden;
}`;

const newCssReplacement = `/* Stacked Stage Pods (Credits -> Coins -> Subscriptions) */
.plans-stage-pod {
  margin-bottom: 32px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(255, 248, 252, 0.82));
  border: 1.5px solid rgba(255, 120, 175, 0.24);
  border-radius: 26px;
  padding: 20px clamp(14px, 2.5vw, 24px) 20px;
  box-shadow: 0 10px 30px rgba(44, 18, 36, 0.04), inset 0 1px 0 #fff;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: border-color 0.25s, box-shadow 0.25s;
}
.plans-stage-pod:hover {
  border-color: rgba(255, 120, 175, 0.4);
  box-shadow: 0 14px 38px rgba(255, 42, 122, 0.08), inset 0 1px 0 #fff;
}
.stage-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.stage-header-title {
  flex: 1;
  min-width: 240px;
}
.stage-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 850;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 999px;
  margin-bottom: 4px;
}
.stage-badge.badge-pink {
  background: #fdf2f8;
  border: 1px solid #fbcfe8;
  color: #be185d;
}
.stage-badge.badge-green {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #047857;
}
.stage-badge.badge-gold {
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #b45309;
}
.stage-badge.badge-purple {
  background: #f5f3ff;
  border: 1px solid #ddd6fe;
  color: #6b21a8;
}
.stage-h2 {
  font-family: var(--font-serif);
  font-size: clamp(20px, 3.2vw, 26px);
  color: #2c1224;
  margin: 2px 0 3px;
  font-weight: 800;
  letter-spacing: -0.3px;
}
.stage-p {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.45;
  max-width: 680px;
}

/* Compact Slider Container & Tracks */
.plans-slider-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.plans-slider-track {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 6px 4px 16px;
}
.plans-slider-track::-webkit-scrollbar {
  display: none;
}

/* Ultra Compact 3D Clay Slider Cards */
.compact-slider-card {
  flex: 0 0 280px;
  min-width: 270px;
  max-width: 300px;
  scroll-snap-align: start;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(255, 248, 252, 0.98));
  border: 1.5px solid rgba(255, 120, 175, 0.28);
  border-radius: 22px;
  padding: 18px 16px;
  box-shadow: 
    0 10px 24px -4px rgba(255, 56, 128, 0.07),
    0 2px 6px rgba(44, 18, 36, 0.03),
    inset 0 2px 2px #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  overflow: hidden;
}`;

if (content.includes(oldCssTarget)) {
  content = content.replace(oldCssTarget, newCssReplacement);
  console.log('✅ CSS updated successfully');
} else {
  console.warn('⚠️ CSS target not found exactly, will check');
}

fs.writeFileSync(plansPath, content, 'utf8');
