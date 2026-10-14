const http = require('http');

function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000' + path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('--- Testing Vanvi Moments Endpoints ---');

  // Test 1: index.html contains Birthday 2.0 and Cute Sorry
  try {
    const res = await fetchUrl('/index.html');
    const hasBday2 = res.body.includes('Birthday 2.0') && res.body.includes('VM-B20');
    const hasCuteSorry = res.body.includes('Cute Sorry') && res.body.includes('₹29');
    console.log('1. index.html Free & Premium sliders:', {
      status: res.status,
      hasBirthday2InFreeSlider: hasBday2,
      hasCuteSorryInSlider: hasCuteSorry
    });
  } catch(e) {
    console.error('Test 1 failed:', e.message);
  }

  // Test 2: category-free.html contains vanvi-templates-data.js
  try {
    const res = await fetchUrl('/category-free.html');
    console.log('2. category-free.html status:', res.status, 'includes vanvi-templates-data.js:', res.body.includes('vanvi-templates-data.js'));
  } catch(e) {
    console.error('Test 2 failed:', e.message);
  }

  // Test 3: category-apology.html
  try {
    const res = await fetchUrl('/category-apology.html');
    console.log('3. category-apology.html status:', res.status, 'includes vanvi-templates-data.js:', res.body.includes('vanvi-templates-data.js'));
  } catch(e) {
    console.error('Test 3 failed:', e.message);
  }

  // Test 4: templates/sorry-bubu/index.html
  try {
    const res = await fetchUrl('/templates/sorry-bubu/index.html');
    console.log('4. templates/sorry-bubu/index.html status:', res.status, 'has Watermark element:', res.body.includes('vanviWatermark'), 'title:', res.body.includes('Cute Sorry'));
  } catch(e) {
    console.error('Test 4 failed:', e.message);
  }

  // Test 5: templates/sorry-bubu/builder.html
  try {
    const res = await fetchUrl('/templates/sorry-bubu/builder.html');
    console.log('5. templates/sorry-bubu/builder.html status:', res.status, 'price ₹29:', res.body.includes('₹29'), 'image upload:', res.body.includes('uploadImageFile'));
  } catch(e) {
    console.error('Test 5 failed:', e.message);
  }

  // Test 6: templates/Birthday 2.0/index.html
  try {
    const res = await fetchUrl('/templates/Birthday%202.0/index.html');
    console.log('6. templates/Birthday 2.0/index.html status:', res.status, 'has canvas:', res.body.includes('ambientCanvas'));
  } catch(e) {
    console.error('Test 6 failed:', e.message);
  }

  // Test 7: templates/Birthday 2.0/builder.html
  try {
    const res = await fetchUrl('/templates/Birthday%202.0/builder.html');
    console.log('7. templates/Birthday 2.0/builder.html status:', res.status, 'upload button:', res.body.includes('btnChooseHeroPhoto'));
  } catch(e) {
    console.error('Test 7 failed:', e.message);
  }

  // Test 8: api/templates discovery
  try {
    const res = await fetchUrl('/api/templates');
    const json = JSON.parse(res.body);
    const cuteSorry = json.find ? json.find(t => t.template_id === 'cute-sorry' || t.name === 'Cute Sorry') : null;
    const bday2 = json.find ? json.find(t => t.template_id === 'birthday-2-0' || t.name === 'Birthday 2.0') : null;
    console.log('8. api/templates response:', {
      total: Array.isArray(json) ? json.length : 'not array',
      foundCuteSorry: cuteSorry ? { name: cuteSorry.name, price: cuteSorry.price } : null,
      foundBirthday2: bday2 ? { name: bday2.name, price: bday2.price } : null
    });
  } catch(e) {
    console.log('Test 8 notice (if /api/templates not standard route):', e.message);
  }
}

runTests();
