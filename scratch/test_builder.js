const fs = require('fs');
const path = require('path');
const templatesData = require('../js/vanvi-templates-data.js');

const html = fs.readFileSync('builder.html', 'utf8');

console.log('Builder Hub File size:', html.length);
const templates = templatesData.templates;
if (!Array.isArray(templates) || templates.length === 0) {
  throw new Error('Template catalog is empty');
}

templates.forEach(template => {
  if (!template.builderPath) {
    throw new Error(`Missing builder path for template: ${template.id}`);
  }

  const builderPath = path.resolve(__dirname, '..', template.builderPath);
  if (!fs.existsSync(builderPath)) {
    throw new Error(`Missing bespoke builder file for template: ${template.id} (${template.builderPath})`);
  }

  const content = fs.readFileSync(builderPath, 'utf8');
  const loadsSharedEngine = content.includes('vanvi-builder-core.js') || content.includes('vanvi-api.js');
  const hasInteractiveBuilder = /<(?:button|input|textarea)\b/i.test(content) &&
    /<script\b/i.test(content) &&
    /<\/html>/i.test(content);
  const redirectTarget = content.match(/(?:window\.)?location\.replace\(\s*['"]([^'"]+builder\.html)/i);
  const hasBuilderRedirect = redirectTarget &&
    fs.existsSync(path.resolve(path.dirname(builderPath), redirectTarget[1]));
  if (!loadsSharedEngine && !hasInteractiveBuilder && !hasBuilderRedirect) {
    throw new Error(`Builder ${template.id} is missing its interactive editor entry points`);
  }
});

console.log(`ALL ${templates.length} CATALOG BUILDERS AND ROUTE CHECKS PASSED!`);
