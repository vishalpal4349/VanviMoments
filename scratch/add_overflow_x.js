const fs = require('fs');

const files = [
  'block-blast.html',
  'brain-test.html',
  'builder.html',
  'cross-math.html',
  'experience.html',
  'gem-merge.html',
  'heart-sort.html',
  'periodic-quiz.html',
  'preview.html'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (!content.includes('overflow-x: hidden')) {
    if (content.includes('</style>')) {
      content = content.replace('</style>', '  body { overflow-x: hidden; }\n</style>');
    } else if (content.includes('</head>')) {
      content = content.replace('</head>', '  <style>body { overflow-x: hidden; }</style>\n</head>');
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log('Added overflow-x: hidden to:', f);
  }
});
