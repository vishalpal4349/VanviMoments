const fs = require('fs');

const content = fs.readFileSync('admin.html', 'utf8');
const lines = content.split(/\r?\n/);
console.log('Total lines:', lines.length);

console.log('--- Sidebar and Tab sections ---');
lines.forEach((line, idx) => {
  if (
    line.includes('admin-sidebar') ||
    line.includes('tab-view') ||
    line.includes('data-section') ||
    line.includes('class="view-pane') ||
    line.includes('tab-btn') ||
    line.includes('id="view-') ||
    line.includes('id="tab-') ||
    line.includes('class="nav-tab')
  ) {
    console.log(`${idx + 1}: ${line.trim().slice(0, 100)}`);
  }
});
