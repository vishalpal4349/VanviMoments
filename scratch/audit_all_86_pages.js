const fs = require('fs');

const allHtml = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const mismatches = [];

allHtml.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const aRegex = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;

  while ((m = aRegex.exec(content)) !== null) {
    const fullTag = m[0];
    const target = m[1].trim();
    const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

    // Ignore dynamic templates like ${...}
    if (target.includes('${')) continue;

    // Check 1: 404 targets
    if (target.includes('.html')) {
      const cleanPath = target.split('#')[0].split('?')[0];
      if (cleanPath && !fs.existsSync(cleanPath)) {
        mismatches.push({ file, text, target, type: '404_PAGE_NOT_FOUND' });
      }
    }

    // Check 2: Semantic mismatches
    // Wheel / Spin button
    if (/wheel|spin/i.test(text) && !/terms|policy|faq|privacy|refund/i.test(file)) {
      if (!target.includes('rewards.html') && !target.includes('Modal') && !fullTag.includes('Modal') && !fullTag.includes('execute') && !fullTag.includes('onclick')) {
        mismatches.push({ file, text, target, type: 'MISLINKED_WHEEL_BUTTON' });
      }
    }

    // Rewards button
    if ((/^rewards$/i.test(text) || /my rewards/i.test(text)) && !/terms|policy|faq/i.test(file)) {
      if (target !== 'rewards.html' && target !== '#') {
        mismatches.push({ file, text, target, type: 'MISLINKED_REWARDS_BUTTON' });
      }
    }

    // Arcade / Games button
    if ((/arcade/i.test(text) || /mini-games|all games/i.test(text)) && !target.includes('games.html') && !target.includes('game-') && !target.startsWith('http')) {
      // Check if it's breadcrumb or navigation
      if (target === 'index.html' && text === 'Arcade') {
        mismatches.push({ file, text, target, type: 'MISLINKED_ARCADE_BREADCRUMB' });
      }
    }

    // Pricing / Plans button
    if ((/^plans$/i.test(text) || /^pricing$/i.test(text) || /vip plans/i.test(text)) && target !== 'plans.html') {
      if (!target.includes('plans.html') && !target.startsWith('http') && !fullTag.includes('onclick')) {
        mismatches.push({ file, text, target, type: 'MISLINKED_PLANS_BUTTON' });
      }
    }

    // Dashboard / My Moments
    if ((/^dashboard$/i.test(text) || /my moments/i.test(text)) && !target.includes('dashboard.html') && target !== '#') {
      if (!target.startsWith('http') && !fullTag.includes('onclick')) {
        mismatches.push({ file, text, target, type: 'MISLINKED_DASHBOARD_BUTTON' });
      }
    }
  }
});

console.log('Total mismatches found across entire site:', mismatches.length);
mismatches.forEach(m => {
  console.log(`[${m.file}] [${m.type}] "${m.text}" -> "${m.target}"`);
});
