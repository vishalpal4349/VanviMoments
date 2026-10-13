const fs = require('fs');

console.log('--- AUDITING AUTH PAGES & GOOGLE AUTH SYSTEM ---');

function checkPage(file, expectedIds) {
  if (!fs.existsSync(file)) {
    console.error(`FAIL: ${file} does not exist`);
    return false;
  }
  const content = fs.readFileSync(file, 'utf8');
  let ok = true;
  for (const id of expectedIds) {
    if (!content.includes(id)) {
      console.error(`FAIL in ${file}: Missing identifier/token "${id}"`);
      ok = false;
    }
  }
  if (ok) {
    console.log(`PASS: ${file} verified (${content.length} bytes, all ${expectedIds.length} checks OK)`);
  }
  return ok;
}

const loginPass = checkPage('login.html', [
  'loginForm',
  'loginEmail',
  'loginPassword',
  'btnTogglePwd',
  'rememberMe',
  'btnLoginSubmit',
  'loginStatus',
  'googleLoginBtn',
  'btn-google-highlight',
  'vanvi-google-auth.js',
  'triggerAuthSuccessCelebration'
]);

const signupPass = checkPage('signup.html', [
  'signupForm',
  'signupName',
  'signupEmail',
  'signupPassword',
  'btnTogglePwd',
  'btnSignupSubmit',
  'signupStatus',
  'googleLoginBtn',
  'btn-google-highlight',
  'vanvi-google-auth.js',
  'triggerAuthSuccessCelebration'
]);

const forgotPass = checkPage('forgot-password.html', [
  'step1Form',
  'recoveryIdentifier',
  'btnSendOtp',
  'step2Form',
  'step3Form',
  'vanviGoBack'
]);

const googleAuthPass = checkPage('js/vanvi-google-auth.js', [
  'VanviGoogleAuth',
  'signIn',
  'handleGoogleCredential',
  'createGoogleModal',
  'vanviGAccountList',
  '/api/auth/google'
]);

if (loginPass && signupPass && forgotPass && googleAuthPass) {
  console.log('\nALL AUTH VERIFICATION CHECKS PASSED SUCCESSFULLY! 🚀');
} else {
  console.error('\nSOME CHECKS FAILED! ❌');
  process.exit(1);
}
