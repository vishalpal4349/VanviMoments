const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((l, idx) => {
    // Check for Rewards dock or button pointing to games.html or wrong
    if (l.includes('bottomNavRewards') || (/title=["']Rewards["']/i.test(l) && l.includes('<a'))) {
      if (!l.includes('rewards.html')) {
        console.log(`[${file}:${idx+1}] Dock Rewards wrong: ${l.trim()}`);
      }
    }

    // Check for Wheel / Spin pointing to dashboard or wrong
    if (/wheel|spin/i.test(l) && l.includes('<a') && !l.includes('rewards.html') && !l.includes('#') && !l.includes('modal')) {
      if (!l.includes('data-') && !l.includes('target="_blank"')) {
        console.log(`[${file}:${idx+1}] Wheel link non-rewards: ${l.trim()}`);
      }
    }

    // Check for Arcade / Games nav
    if (l.includes('bottomNavGames') || (/title=["']Games["']/i.test(l) && l.includes('<a'))) {
      if (!l.includes('games.html')) {
        console.log(`[${file}:${idx+1}] Dock Games wrong: ${l.trim()}`);
      }
    }
  });
});
