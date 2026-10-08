const fs = require('fs');
const path = require('path');

const targetFilePath = path.join(__dirname, '..', 'js', 'vanvi-templates-data.js');
let content = fs.readFileSync(targetFilePath, 'utf8');

const weddingIds = [
  'heritage-maroon',
  'ivory-palace',
  'midnight-gold',
  'pastel-garden',
  'south-indian-sacred',
  'minimal-editorial',
  'royal-mughal',
  'modern-champagne',
  'celestial-wedding',
  'floral-romance',
  'vintage-palace',
  'contemporary-luxe',
  'temple-grandeur'
];

weddingIds.forEach(id => {
  const marker = `"id": "${id}",`;
  if (content.includes(marker)) {
    const patch = `"id": "${id}",
    "features": [
      "Cinematic Grand Hero Reveal",
      "Live Wedding Countdown",
      "Sacred Family Blessing Decree",
      "Ceremony Schedule with Maps",
      "Guest Concierge & Dress Code",
      "1-Click WhatsApp Direct RSVP"
    ],
    "previewRecipient": "Tanya & Rohan",
    "previewSender": "The Sharma & Kapoor Families",
    "previewMessage": "With the blessings of our families, we warmly invite you to celebrate our sacred wedding ceremonies.",`;
    content = content.replace(marker, patch);
  }
});

fs.writeFileSync(targetFilePath, content, 'utf8');
console.log('Successfully patched all required fields into new wedding templates in js/vanvi-templates-data.js');
