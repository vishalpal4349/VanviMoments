const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '..', 'templates');
const dirs = fs.readdirSync(templatesDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

const report = [];

dirs.forEach(d => {
  const tDir = path.join(templatesDir, d);
  const bPath = path.join(tDir, 'builder.html');
  const iPath = path.join(tDir, 'index.html');

  const item = {
    template: d,
    hasBuilder: fs.existsSync(bPath),
    hasIndex: fs.existsSync(iPath),
    indexHasLockScript: false,
    indexBuilderLinks: [],
    builderHasMessageListener: false,
    builderSwitchFunc: null
  };

  if (item.hasIndex) {
    const ic = fs.readFileSync(iPath, 'utf8');
    item.indexHasLockScript = ic.includes('vanvi-template-lock.js');
    const links = ic.match(/<a[^>]*href=["'][^"']*builder\.html[^"']*["'][^>]*>.*?<\/a>/gis) || [];
    item.indexBuilderLinks = links.map(l => l.replace(/\s+/g, ' ').substring(0, 100));
  }

  if (item.hasBuilder) {
    const bc = fs.readFileSync(bPath, 'utf8');
    item.builderHasMessageListener = bc.includes("type === 'VANVI_SWITCH_TO_EDIT'") || bc.includes('VANVI_SWITCH_TO_EDIT');
    if (bc.includes('setMobileView(')) item.builderSwitchFunc = 'setMobileView';
    else if (bc.includes('switchMobileTab(')) item.builderSwitchFunc = 'switchMobileTab';
    else if (bc.includes('switchTab(')) item.builderSwitchFunc = 'switchTab';
  }

  report.push(item);
});

console.log(JSON.stringify(report, null, 2));
