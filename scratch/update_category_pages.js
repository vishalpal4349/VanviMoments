const fs = require('fs');

const catFiles = [
  'category-birthday.html',
  'category-love.html',
  'category-anniversary.html',
  'category-friendship.html',
  'category-memories.html',
  'category-celebration.html',
  'category-family.html',
  'category-apology.html',
  'category-free.html',
  'category-premium.html'
];

catFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace card-actions block inside template string
  const oldActionPattern = /<div class="card-actions">[\s\S]*?<a class="btn-preview"[\s\S]*?<\/a>[\s\S]*?<a class="btn-create"[\s\S]*?<\/a>[\s\S]*?<\/div>/i;

  const newActions = `<div class="card-actions">
        <a class="btn-preview" href="template-detail.html?template=\${encodeURIComponent(t.id)}" title="Live Interactive Experience">👁️ Experience</a>
        <a class="btn-create" href="template-detail.html?template=\${encodeURIComponent(t.id)}&mode=studio" title="Make It Yours">✨ Make It Yours →</a>
      </div>`;

  if (oldActionPattern.test(content)) {
    content = content.replace(oldActionPattern, newActions);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated card actions in ${file}`);
  } else {
    console.warn(`Pattern not matched in ${file}`);
  }
});

console.log('Category pages card actions updated successfully.');
