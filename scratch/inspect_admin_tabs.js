const fs = require('fs');
const html = fs.readFileSync('admin.html', 'utf8');

const navItems = [...html.matchAll(/class="[^"]*nav-item[^"]*"[^>]*data-tab="([^"]+)"[^>]*>([\s\S]*?)<\/button>/g)].map(m => {
  return {
    tab: m[1],
    label: m[2].replace(/<[^>]+>/g, '').trim()
  };
});

console.log('Admin navigation items (' + navItems.length + '):');
navItems.forEach(n => console.log(' - ' + n.tab + ': ' + n.label));

const authCheck = html.includes('requireAdmin') || html.includes('vanvi_admin') || html.includes('checkAdmin') || html.includes('adminToken');
console.log('Admin Auth Mechanism in HTML:', authCheck);
