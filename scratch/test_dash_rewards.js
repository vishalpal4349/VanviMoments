const fs = require('fs');
const http = require('http');

async function testUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, length: data.length, body: data });
      });
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function run() {
  console.log('Testing dashboard.html and rewards.html...');

  const dashRes = await testUrl('http://localhost:5500/dashboard.html');
  console.log(`dashboard.html status: ${dashRes.status}, bytes: ${dashRes.length}`);
  
  const rewRes = await testUrl('http://localhost:5500/rewards.html');
  console.log(`rewards.html status: ${rewRes.status}, bytes: ${rewRes.length}`);

  // Checks on dashboard.html
  console.log('\n--- DASHBOARD CHECKS ---');
  console.log('Has Ananya:', dashRes.body.toLowerCase().includes('ananya'));
  console.log('Has Vanvi brand:', dashRes.body.includes('VANVI') || dashRes.body.includes('Vanvi'));
  console.log('Has vanvi-navigation.css:', dashRes.body.includes('vanvi-navigation.css'));
  console.log('Has vanviGoBack:', dashRes.body.includes('function vanviGoBack'));
  console.log('Has safeGoBack:', dashRes.body.includes('function safeGoBack'));
  console.log('Has Share & QR action:', dashRes.body.includes('Share &amp; QR') || dashRes.body.includes('share.html'));
  console.log('Has tab count badges:', dashRes.body.includes('tab-count-badge'));
  console.log('Has bottom dock:', dashRes.body.includes('vanvi-bottom-dock'));

  // Checks on rewards.html
  console.log('\n--- REWARDS CHECKS ---');
  console.log('Has Ananya:', rewRes.body.toLowerCase().includes('ananya'));
  console.log('Has Vanvi brand:', rewRes.body.includes('VANVI') || rewRes.body.includes('Vanvi'));
  console.log('Has vanvi-navigation.css:', rewRes.body.includes('vanvi-navigation.css'));
  console.log('Has vanviGoBack:', rewRes.body.includes('function vanviGoBack'));
  console.log('Has safeGoBack:', rewRes.body.includes('function safeGoBack'));
  console.log('Has Fortune Wheel:', rewRes.body.includes('rewardWheelDisc'));
  console.log('Has Refer & Earn:', rewRes.body.includes('tabPaneReferral'));
  console.log('Has Coupons:', rewRes.body.includes('couponListWrap'));
  console.log('Has bottom dock:', rewRes.body.includes('vanvi-bottom-dock'));

  console.log('\n>>> AUTOMATED CHECKS FINISHED <<<');
}

run();
