const { execSync } = require('child_process');

const commits = ['796c068', '8a9183d', '952e3f5', 'f7bc6fd', 'HEAD'];

commits.forEach(c => {
  try {
    const log = execSync(`git log -1 --format="%h - %s" ${c}`).toString().trim();
    const login = execSync(`git show ${c}:login.html`).toString();
    console.log(`\n================== ${log} ==================`);
    const titleMatch = login.match(/<title>([^<]+)<\/title>/);
    console.log('Title:', titleMatch ? titleMatch[1] : 'N/A');
    console.log('Has 3D Clay Girl image:', login.includes('vanvi-clay-girl-login.jpg'));
    console.log('Has clay-avatar-img:', login.includes('clay-avatar-img'));
    console.log('Has clay-girl-stage:', login.includes('clay-girl-stage'));
    console.log('Has 100 free coins:', login.includes('100 free coins') || login.includes('+100'));
    const cssMatch = login.match(/<link[^>]+href="([^"]+\.css)"/);
    console.log('CSS linked:', cssMatch ? cssMatch[1] : 'inline');
    console.log('File size:', login.length);
  } catch (e) {
    console.error(`Error checking ${c}:`, e.message);
  }
});
