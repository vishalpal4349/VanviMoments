const fs = require('fs');

const code = fs.readFileSync('c:\\Users\\RISHU KUMARI\\VanviMoments\\scratch\\readable_receiver.js', 'utf8');

// Find all HTML tags, text, and structure
const lines = code.split('\n');

const relevant = lines.filter(l => 
  l.includes('children:[') ||
  l.includes('className:') ||
  l.includes('label:') ||
  l.includes('title:') ||
  l.includes('text:') ||
  l.includes('heading:') ||
  l.includes('placeholder:') ||
  l.includes('button') ||
  l.includes('onClick') ||
  l.includes('audio') ||
  l.includes('sound')
);

fs.writeFileSync('c:\\Users\\RISHU KUMARI\\VanviMoments\\scratch\\extracted_structure.txt', relevant.join('\n'), 'utf8');
console.log('Saved extracted_structure.txt. Found relevant lines:', relevant.length);
