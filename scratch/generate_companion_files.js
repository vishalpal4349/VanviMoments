// scratch/generate_companion_files.js
// Creates modular companion files requested in the prompt.

const fs = require('fs');

const master = fs.readFileSync('WEBSITE_A_TO_Z_MAP.md', 'utf8');

function extractSection(heading, nextHeading) {
  const start = master.indexOf(heading);
  if (start === -1) return '';
  const end = nextHeading ? master.indexOf(nextHeading, start) : master.length;
  return master.slice(start, end).trim();
}

// 1. WEBSITE_QUICK_SUMMARY.md
const quickSummary = `# VANVI MOMENTS — EXECUTIVE QUICK SUMMARY
${extractSection('## 21. SHORT EXECUTIVE SUMMARY', '## 1. COMPLETE PAGE INVENTORY TABLE')}

${extractSection('## 24. FINAL FORENSIC CONCLUSION', '')}
`;
fs.writeFileSync('WEBSITE_QUICK_SUMMARY.md', quickSummary, 'utf8');

// 2. WEBSITE_BUTTON_MAP.md
const buttonMap = `# VANVI MOMENTS — COMPLETE BUTTON & INTERACTION MAP
${extractSection('## 5. TEMPLATE CARD BUTTON MATRIX', '## 6. PROFILE / ACCOUNT & REFERRAL SYSTEM')}

${extractSection('## 16. CLICKABLE ELEMENT & LINK AUDIT', '## 17. MASTER FEATURE MATRIX')}
`;
fs.writeFileSync('WEBSITE_BUTTON_MAP.md', buttonMap, 'utf8');

// 3. WEBSITE_FLOW_MAP.md
const flowMap = `# VANVI MOMENTS — COMPLETE USER FLOW & NAVIGATION MAP
${extractSection('## 3. COMPLETE WEBSITE NAVIGATION MAP', '## 4. TEMPLATE SYSTEM — FULL FLOW')}

${extractSection('## 4. TEMPLATE SYSTEM — FULL FLOW', '## 5. TEMPLATE CARD BUTTON MATRIX')}

${extractSection('## 19. COMPLETE USER JOURNEYS', '## 20. MISSING / ORPHAN PAGES & CODE AUDIT')}
`;
fs.writeFileSync('WEBSITE_FLOW_MAP.md', flowMap, 'utf8');

// 4. WEBSITE_FEATURE_MATRIX.md
const featureMatrix = `# VANVI MOMENTS — MASTER FEATURE MATRIX
${extractSection('## 17. MASTER FEATURE MATRIX', '## 18. PAGE POLISH STATUS CLASSIFICATION')}
`;
fs.writeFileSync('WEBSITE_FEATURE_MATRIX.md', featureMatrix, 'utf8');

// 5. WEBSITE_POLISH_STATUS.md
const polishStatus = `# VANVI MOMENTS — PAGE POLISH & HEALTH STATUS
${extractSection('## 18. PAGE POLISH STATUS CLASSIFICATION', '## 19. COMPLETE USER JOURNEYS')}

${extractSection('## 20. MISSING / ORPHAN PAGES & CODE AUDIT', '## 22. MASTER FILE STRUCTURE & REPOSITORY INDEX')}
`;
fs.writeFileSync('WEBSITE_POLISH_STATUS.md', polishStatus, 'utf8');

console.log('Successfully generated all companion markdown files.');
