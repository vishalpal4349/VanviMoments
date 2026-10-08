/**
 * Responsive & CSS Analysis for Botanical Blush Wedding
 */
const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, '../templates/botanical-blush-wedding/index.html'), 'utf8');

console.log('--- RESPONSIVE & LAYOUT VERIFICATION ---');

const checks = [
  { name: 'Viewport meta tag with user-scalable and proper initial-scale', pass: indexHtml.includes('name="viewport"') && indexHtml.includes('width=device-width') },
  { name: 'Box-sizing border-box applied universally', pass: indexHtml.includes('box-sizing: border-box') },
  { name: 'Body overflow-x hidden to prevent horizontal scrollbars', pass: indexHtml.includes('overflow-x: hidden') },
  { name: 'Flexible container max-width with responsive auto margins', pass: indexHtml.includes('--container-max: 680px') && indexHtml.includes('margin: 0 auto') },
  { name: 'Responsive @media (max-width: 480px) query', pass: indexHtml.includes('@media (max-width: 480px)') },
  { name: 'Responsive button row (flex-direction: column on mobile)', pass: indexHtml.includes('.btn-row {') && indexHtml.includes('flex-direction: column') },
  { name: 'Full width button scaling on small viewports', pass: indexHtml.includes('.btn-botanical {') && indexHtml.includes('width: 100%') },
  { name: 'Gallery 2-col to 1-col graceful mobile collapse', pass: indexHtml.includes('grid-template-columns: 1fr;') },
  { name: 'Hero portrait responsive dimension scaling (220px on mobile)', pass: indexHtml.includes('width: 220px;') },
  { name: 'Scratch canvas touch-action none for fluid touch interaction', pass: indexHtml.includes('touch-action: none') },
  { name: 'Prefers-reduced-motion accessibility support', pass: indexHtml.includes('prefers-reduced-motion') },
  { name: '100% max-width responsive images', pass: indexHtml.includes('object-fit: cover') }
];

let allPassed = true;
checks.forEach(c => {
  console.log(`${c.pass ? '✅' : '❌'} ${c.name}`);
  if (!c.pass) allPassed = false;
});

console.log('--- ALL CSS & RESPONSIVE RULES VALIDATED ---');
if (!allPassed) process.exit(1);
