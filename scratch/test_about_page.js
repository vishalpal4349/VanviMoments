const http = require('http');
const fs = require('fs');

http.get('http://localhost:5500/about.html', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('=== VANVI ABOUT.HTML VERIFICATION SUITE ===\n');
    console.log('✓ HTTP Status:', res.statusCode);
    console.log('✓ Content Size:', data.length, 'bytes\n');

    const checks = [
      // 1. Hero checks
      ['Hero Kicker: About VanviMoments ✦', data.includes('About VanviMoments ✦')],
      ['Hero Headline: Made for moments worth remembering.', data.includes('Made for moments') && data.includes('worth remembering.')],
      ['Hero Memory Visual Present', data.includes('hero-memory-visual')],

      // 2. The Idea checks
      ['The Idea Section: A digital keepsake with a soul', data.includes('A digital keepsake with a soul.')],
      ['The Idea Glass Card', data.includes('class="idea-card"')],

      // 3. How It Works flow
      ['How It Works Header', data.includes('How It Works')],
      ['Step 1: Choose', data.includes('Choose')],
      ['Step 2: Personalize', data.includes('Personalize')],
      ['Step 3: Preview', data.includes('Preview')],
      ['Step 4: Create', data.includes('Create')],
      ['Step 5: Share', data.includes('Share')],

      // 4. What you can create
      ['Birthday Card', data.includes('Birthday Specials')],
      ['Love Card', data.includes('Love &amp; Romance') || data.includes('Love & Romance')],
      ['Anniversary Card', data.includes('Anniversaries')],
      ['Friendship Card', data.includes('Friendship')],
      ['Family Card', data.includes('Family &amp; Mom')],
      ['Apology Card', data.includes('Sincere Apologies')],
      ['Celebration Card', data.includes('Celebrations')],
      ['Memories Card', data.includes('Memories')],
      ['VIP Experiences Card', data.includes('VIP Experiences')],

      // 5. Vanvi AI section
      ['Vanvi AI Title', data.includes('Meet Vanvi AI Studio')],
      ['Vanvi AI Description', data.includes('Tell Vanvi what you have in mind')],
      ['Link to ai-matcher.html', data.includes('href="ai-matcher.html"')],

      // 6. Why Vanvi
      ['Why VanviMoments Title', data.includes('Why VanviMoments')],
      ['Pillar: Personal', data.includes('Personal')],
      ['Pillar: Beautiful', data.includes('Beautiful')],
      ['Pillar: Interactive', data.includes('Interactive')],
      ['Pillar: Easy to Create', data.includes('Easy to Create')],
      ['Pillar: Shareable', data.includes('Shareable')],
      ['Pillar: Made for Memories', data.includes('Made for Memories')],

      // 7. Final Closing CTA
      ['Closing CTA Headline: Your next moment starts here.', data.includes('Your next moment starts here.')],
      ['CTA Create Button links to builder.html', data.includes('href="builder.html"') && data.includes('Create a Moment')],
      ['CTA Explore Button links to templates.html', data.includes('href="templates.html"') && data.includes('Explore Templates')],

      // 8. Navigation & Constraints
      ['Logo is BRAND ONLY (not an <a> link)', !/<a[^>]*class=["'][^"']*header-brand/i.test(data)],
      ['Floating small ‹ Back button', data.includes('btn-nav-back') && data.includes('safeGoBack()')],
      ['Global Bottom Navigation Dock', data.includes('class="bottom vanvi-bottom-dock"')],
      ['Enforces overflow-x: hidden', data.includes('overflow-x: hidden !important')],
      ['Responsive Viewport Meta', data.includes('name="viewport"')]
    ];

    let passed = 0;
    checks.forEach(([desc, test]) => {
      if (test) {
        console.log(`  ✅ PASS: ${desc}`);
        passed++;
      } else {
        console.error(`  ❌ FAIL: ${desc}`);
      }
    });

    console.log(`\nResult: ${passed} / ${checks.length} passed.`);

    // Check all hrefs point to real files
    console.log('\n--- Link Integrity Audit ---');
    const hrefMatches = data.match(/href="([^"#?]+)(?:[#?][^"]*)?"/g) || [];
    const uniqueFiles = [...new Set(hrefMatches.map(m => m.replace(/^href="/, '').replace(/[#?].*$/, '').replace(/"$/, '')))];
    
    let linksOk = true;
    uniqueFiles.forEach(file => {
      if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js')) {
        const fullPath = 'c:/Users/RISHU KUMARI/VanviMoments/' + file;
        const exists = fs.existsSync(fullPath);
        if (exists) {
          console.log(`  ✓ Link target exists: ${file}`);
        } else {
          console.error(`  ✗ Dead link target: ${file}`);
          linksOk = false;
        }
      }
    });

    if (passed === checks.length && linksOk) {
      console.log('\n🎉 ABOUT.HTML IS ULTRA PREMIUM AND 100% VERIFIED!');
    }
  });
}).on('error', (err) => {
  console.error('Request failed:', err.message);
});
