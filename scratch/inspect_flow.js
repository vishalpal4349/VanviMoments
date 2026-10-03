const fs = require('fs');
const html = fs.readFileSync('scratch/vercel_raw.html', 'utf8');

// Find all script tags
const scripts = [...html.matchAll(/<script[\s\S]*?<\/script>/gi)].map(m => m[0]);
console.log('Total script blocks:', scripts.length);

scripts.forEach((s, idx) => {
  if (s.includes('src=')) {
    console.log(`Script ${idx} (External):`, s.substring(0, 100));
  } else {
    console.log(`Script ${idx} (Inline, Length ${s.length}):`, s.substring(0, 300) + '...');
  }
});

// Find body innerHTML structure (elements directly under body)
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
if (bodyMatch) {
  const bodyContent = bodyMatch[1];
  console.log('\n--- BODY LENGTH ---', bodyContent.length);
}
