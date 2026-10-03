const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// 1. Verify zero external QR references
const filesToCheck = ['share.html', 'moment.html', 'js/vanvi-qr.js', 'server/server.js'];
filesToCheck.forEach(file => {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  assert(!content.includes('api.qrserver.com'), `No api.qrserver.com in ${file}`);
  assert(!content.includes('chart.googleapis.com'), `No google chart QR in ${file}`);
});

// 2. Test js/vanvi-qr.js functionality
const vanviQrCode = fs.readFileSync(path.join(root, 'js', 'vanvi-qr.js'), 'utf8');
assert(vanviQrCode.includes('renderBrandedCard'), 'VanviQR contains renderBrandedCard()');
assert(vanviQrCode.includes('downloadCard'), 'VanviQR contains downloadCard()');
assert(vanviQrCode.includes('toDataURL'), 'VanviQR contains toDataURL()');
assert(vanviQrCode.includes('render'), 'VanviQR contains render()');

// 3. Test share.html UI & logic
const shareHtml = fs.readFileSync(path.join(root, 'share.html'), 'utf8');
assert(shareHtml.includes('js/vanvi-qr.js'), 'share.html loads local js/vanvi-qr.js');
assert(shareHtml.includes('js/vanvi-templates-data.js'), 'share.html loads template registry');
assert(shareHtml.includes('standaloneQrCanvas'), 'share.html contains standalone QR canvas');
assert(shareHtml.includes('brandedQrCardCanvas'), 'share.html contains branded QR card canvas');
assert(shareHtml.includes('btnCopyLink'), 'share.html has copy link button');
assert(shareHtml.includes('btnShareWA'), 'share.html has WhatsApp share button');
assert(shareHtml.includes('btnDownloadQr'), 'share.html has standalone QR download button');
assert(shareHtml.includes('btnDownloadCard'), 'share.html has branded card download button');
assert(shareHtml.includes('https://vanvimoments.shop/m/'), 'share.html formats canonical /m/{slug} URLs');
assert(shareHtml.includes('template_id') || shareHtml.includes('templateId'), 'share.html resolves template by template_id');

// 4. Test server/server.js /m/:slug routing
const serverJs = fs.readFileSync(path.join(root, 'server', 'server.js'), 'utf8');
assert(serverJs.includes("app.get('/m/:slug'"), 'server.js provides canonical /m/:slug route');
assert(serverJs.includes('moment.template_id') || serverJs.includes('moment.templateId'), 'server.js route resolves template via template_id');

// 5. Test existing 9 templates are unharmed
const templatesDir = path.join(root, 'templates');
const templateDirs = fs.readdirSync(templatesDir).filter(d => fs.statSync(path.join(templatesDir, d)).isDirectory());
assert(templateDirs.length >= 9, `All original templates preserved (found ${templateDirs.length})`);
templateDirs.forEach(td => {
  const hasIndex = fs.existsSync(path.join(templatesDir, td, 'index.html'));
  assert(hasIndex, `Template ${td} has intact index.html`);
});

console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
