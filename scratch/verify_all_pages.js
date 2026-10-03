const http = require('http');

const pages = [
  '/',
  '/index.html',
  '/templates.html',
  '/login.html',
  '/signup.html',
  '/forgot-password.html',
  '/constellation-of-love.html',
  '/gem-catch.html',
  '/heart-rain.html',
  '/love-puzzle.html',
  '/memory-rush.html',
  '/quick-tap.html',
  '/rewards.html',
  '/unlock-gift.html',
  '/word-whisper.html',
  '/profile.html',
  '/dashboard.html',
  '/plans.html',
  '/category-birthday.html',
  '/category-love.html'
];

async function checkPage(path) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let issues = [];
        if (res.statusCode !== 200) {
          issues.push(`Status code: ${res.statusCode}`);
        }
        if (data.includes('font-size=%2290%22')) {
          issues.push('Contains broken favicon text!');
        }
        if (data.includes('</text></svg>">')) {
          issues.push('Contains stray </text></svg>">');
        }
        // Check for stray `">` in the head
        const headMatch = data.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
        if (headMatch) {
          if (headMatch[1].includes('">') && !headMatch[1].includes('content="') && !headMatch[1].includes('href="') && !headMatch[1].includes('src="')) {
            issues.push('Possible stray ">" in head');
          }
        }
        // Check for stray emoji at the very start of body
        const bodyMatch = data.match(/<body[^>]*>([\s\S]*?)<(?:header|nav|div|main|section|canvas)/i);
        if (bodyMatch) {
          const stripped = bodyMatch[1].replace(/<!--[\s\S]*?-->/g, '').trim();
          if (stripped.length > 0) {
            issues.push(`Stray text before header: ${JSON.stringify(stripped)}`);
          }
        }
        resolve({ path, statusCode: res.statusCode, issues });
      });
    }).on('error', (err) => {
      resolve({ path, error: err.message });
    });
  });
}

(async () => {
  let allPass = true;
  for (const page of pages) {
    const result = await checkPage(page);
    if (result.issues && result.issues.length > 0) {
      console.log(`❌ ${page}:`, result.issues);
      allPass = false;
    } else if (result.error) {
      console.log(`❌ ${page} error:`, result.error);
      allPass = false;
    } else {
      console.log(`✅ ${page} — Clean (HTTP ${result.statusCode})`);
    }
  }

  if (allPass) {
    console.log('\n🎉 ALL 20 TESTED PAGES ARE COMPLETELY CLEAN AND FREE OF STRAY CONTENT!');
  } else {
    console.log('\n⚠️ Some issues found.');
  }
})();
