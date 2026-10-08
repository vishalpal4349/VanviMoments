const { JSDOM } = require('jsdom');
const html = `
<div class="word-stage">
  <span class="w1">Handcrafted with <span class="w-em">LOVE.</span></span>
  <span class="w2">Immortalized in <span class="w-em">TIME.</span></span>
  <span class="w3">Bespoke &amp; <span class="w-em">TIMELESS.</span></span>
  <span class="w4">Pure &amp; <span class="w-em">UNFORGETTABLE.</span></span>
</div>
`;
const doc = new JSDOM(html).window.document;
console.log('Matches for ".word-stage span:nth-child(1)":');
doc.querySelectorAll('.word-stage span:nth-child(1)').forEach(el => {
  console.log(` - Class: "${el.className}", Text: "${el.textContent.trim()}"`);
});
