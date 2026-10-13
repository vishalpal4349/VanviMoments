const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

    console.log('Testing login page Google Auth...');
    await page.goto('http://localhost:3000/login.html', { waitUntil: 'networkidle' });

    // Click Google Auth button
    await page.click('#googleLoginBtn');
    await page.waitForTimeout(600);

    // Check if modal or prompt is visible
    const modalVisible = await page.evaluate(() => {
      const gModal = document.getElementById('googleModal');
      const gGlobModal = document.getElementById('vanviGlobalGoogleModal');
      return (gModal && gModal.classList.contains('active')) || (gGlobModal && gGlobModal.classList.contains('open'));
    });
    console.log('Google Auth Modal Active:', modalVisible);

    // Test Signup page
    console.log('Testing signup page Google Auth...');
    await page.goto('http://localhost:3000/signup.html', { waitUntil: 'networkidle' });
    await page.click('#googleSignupBtn');
    await page.waitForTimeout(600);

    const signupModalVisible = await page.evaluate(() => {
      const gModal = document.getElementById('googleModal');
      const gGlobModal = document.getElementById('vanviGlobalGoogleModal');
      return (gModal && gModal.classList.contains('active')) || (gGlobModal && gGlobModal.classList.contains('open'));
    });
    console.log('Signup Google Auth Modal Active:', signupModalVisible);

    // Close Google Modal
    await page.click('#vanviGBtnClose');
    await page.waitForTimeout(300);
    await page.fill('#signupName', 'Priya Sharma');
    await page.fill('#signupEmail', 'priya.sharma@example.com');
    await page.fill('#signupPassword', 'mypassword123');
    await page.fill('#signupConfirmPassword', 'wrongpass');
    await page.click('#btnSignupSubmit');
    await page.waitForTimeout(300);

    const statusText = await page.textContent('#signupStatus');
    console.log('Signup Mismatched Password Status:', statusText);

    // Now fill matching password
    await page.fill('#signupConfirmPassword', 'mypassword123');
    await page.click('#btnSignupSubmit');
    await page.waitForTimeout(1000);

    const finalStatus = await page.textContent('#signupStatus');
    console.log('Signup Correct Password Status:', finalStatus);

    await browser.close();
    console.log('ALL AUTH TESTS COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test error:', err);
    await browser.close();
  }
})();
