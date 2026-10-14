/*
 * Deterministic filesystem audit for every directory under templates/.
 * Run with: node scratch/audit_template_catalog.js
 */
const fs = require('fs');
const path = require('path');
const catalog = require('../js/vanvi-templates-data.js').getAll();

const repo = path.resolve(__dirname, '..');
const templatesRoot = path.join(repo, 'templates');
const required = ['index.html', 'builder.html', 'preview.html', 'template.json'];
const folders = fs.readdirSync(templatesRoot, { withFileTypes: true })
  .filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
const results = [];
const missingRefs = [];

function isExternal(value) {
  return /^(?:https?:|data:|mailto:|tel:|javascript:|#|\/\/|\/)/i.test(value) || value.includes('{{');
}
function walk(dir, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, found);
    else if (/\.(?:html|css|js)$/i.test(entry.name)) found.push(file);
  }
  return found;
}
function addReferences(text, file, root, folder) {
  const patterns = [
    /(?:src|href)\s*=\s*["']([^"'#?]+)["']/gi,
    /url\(\s*["']?([^"')?]+)["']?\s*\)/gi,
    /(?:fetch|new\s+Audio)\(\s*["']([^"')?]+)["']/gi
  ];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const ref = match[1].trim();
      if (!ref || isExternal(ref)) continue;
      const target = path.resolve(path.dirname(file), decodeURIComponent(ref.replace(/\\/g, '/')));
      if (!fs.existsSync(target)) missingRefs.push({ folder, file: path.relative(root, file), ref });
    }
  }
}

for (const folder of folders) {
  const root = path.join(templatesRoot, folder);
  const missingFiles = required.filter(file => !fs.existsSync(path.join(root, file)));
  let jsonError = null;
  let json = null;
  if (!missingFiles.includes('template.json')) {
    try { json = JSON.parse(fs.readFileSync(path.join(root, 'template.json'), 'utf8')); }
    catch (error) { jsonError = error.message; }
  }
  for (const file of walk(root)) addReferences(fs.readFileSync(file, 'utf8'), file, root, folder);
  const registrations = catalog.filter(template => {
    const paths = [template.templatePath, template.previewPath, template.builderPath].filter(Boolean);
    return paths.some(value => path.normalize(value).startsWith(path.normalize(`templates/${folder}/`)));
  });
  results.push({ folder, missingFiles, jsonValid: !jsonError && !!json, jsonError, metadata: json && {
    name: json.name, category: json.category, price: json.price,
    hasCustomization: Boolean(json.customizableFields || json.schema || json.defaultConfig)
  }, catalogIds: registrations.map(template => template.id) });
}

const catalogBrokenPaths = catalog.flatMap(template => ['templatePath', 'previewPath', 'builderPath']
  .filter(key => template[key])
  .filter(key => !fs.existsSync(path.join(repo, template[key])))
  .map(key => ({ id: template.id, key, value: template[key] })));
const output = { generatedAt: new Date().toISOString(), templateFolders: folders.length, catalogEntries: catalog.length,
  missingRequiredFiles: results.filter(result => result.missingFiles.length), invalidJson: results.filter(result => result.jsonError),
  unregisteredFolders: results.filter(result => !result.catalogIds.length).map(result => result.folder), missingRefs,
  catalogBrokenPaths, results };
fs.writeFileSync(path.join(__dirname, 'template-catalog-audit.json'), JSON.stringify(output, null, 2));
console.log(JSON.stringify({ templateFolders: output.templateFolders, catalogEntries: output.catalogEntries,
  missingRequiredFileFolders: output.missingRequiredFiles.length, invalidJsonFolders: output.invalidJson.length,
  unregisteredFolders: output.unregisteredFolders.length, missingLocalReferences: output.missingRefs.length,
  catalogBrokenPaths: output.catalogBrokenPaths.length }, null, 2));
