const fs = require('fs');
const path = require('path');

const tPath = path.join(__dirname, '..', 'templates.html');
let code = fs.readFileSync(tPath, 'utf8');

code = code.replace(
  `      .recommendations-grid > * {
        flex: 0 0 162px !important;
        width: 162px !important;
        scroll-snap-align: start;
      }`,
  `      .recommendations-grid > * {
        flex: 0 0 clamp(168px, 48vw, 178px) !important;
        width: clamp(168px, 48vw, 178px) !important;
        scroll-snap-align: start;
      }`
);

code = code.replace(
  `    .rail-card-wrapper {
      flex: 0 0 162px;
      width: 162px;
      scroll-snap-align: start;
    }`,
  `    .rail-card-wrapper {
      flex: 0 0 clamp(168px, 48vw, 178px);
      width: clamp(168px, 48vw, 178px);
      scroll-snap-align: start;
    }`
);

fs.writeFileSync(tPath, code, 'utf8');
console.log('✅ Updated templates.html mobile card width to clamp(168px, 48vw, 178px)');
