const https = require('https');

const testUrls = [
  'https://happybirthday-liart-chi.vercel.app/image/bg.png',
  'https://happybirthday-liart-chi.vercel.app/image/cake_3d.png',
  'https://happybirthday-liart-chi.vercel.app/happybirthday.mp3',
  'https://happybirthday-liart-chi.vercel.app/image/nap.png',
  'https://happybirthday-liart-chi.vercel.app/image/hop.png',
  'https://happybirthday-liart-chi.vercel.app/image/giftbox.png',
  'https://happybirthday-liart-chi.vercel.app/image/heartAnimation.gif',
  'https://happybirthday-liart-chi.vercel.app/image/mewmew.gif'
];

testUrls.forEach(url => {
  https.get(url, res => {
    console.log(url, res.statusCode, res.headers['content-type'], res.headers['content-length']);
  }).on('error', err => {
    console.error(url, err.message);
  });
});
