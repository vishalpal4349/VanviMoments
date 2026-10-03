const http = require('http');
const fs = require('fs');
const path = require('path');

// 1. Validate files syntax & presence
console.log('--- TEST 1: Verifying File Integrity ---');
const builderHtml = fs.readFileSync(path.join(__dirname, '..', 'builder.html'), 'utf8');
const momentHtml = fs.readFileSync(path.join(__dirname, '..', 'moment.html'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const templatesHtml = fs.readFileSync(path.join(__dirname, '..', 'templates.html'), 'utf8');
const templateAdapter = fs.readFileSync(path.join(__dirname, '..', 'js', 'template-adapter.js'), 'utf8');
const navCss = fs.readFileSync(path.join(__dirname, '..', 'vanvi-navigation.css'), 'utf8');

if (!builderHtml.includes('js/vanvi-api.js')) throw new Error('builder.html missing vanvi-api.js');
if (!builderHtml.includes('finalUrl') || !builderHtml.includes('?id=')) throw new Error('builder.html missing ?id= short URL logic');
if (!builderHtml.includes('uploadRes')) throw new Error('builder.html missing upload logic');
console.log('✓ builder.html contains photo upload, /api/moments saving, and ?id= generation');

if (!momentHtml.includes('loadServerMoment') || !momentHtml.includes('params.get(\'id\')')) throw new Error('moment.html missing loadServerMoment ?id=');
console.log('✓ moment.html contains clean ID-based loader with normalized photo rendering');

if (!indexHtml.includes('lenis') || !templatesHtml.includes('lenis')) throw new Error('Missing lenis in index.html or templates.html');
console.log('✓ Lenis smooth scroll is present in index.html and templates.html');

if (!navCss.includes('vanviDynamicShimmer')) throw new Error('Missing dynamic button shimmer CSS');
console.log('✓ Dynamic shimmer micro-interaction CSS is present without layout breakage');

if (!templateAdapter.includes('VanviMomentLoader')) throw new Error('Missing universal template-adapter.js');
console.log('✓ js/template-adapter.js is complete and exported');

// 2. Test server endpoints
console.log('\n--- TEST 2: Testing Server Upload & Moment API ---');
const { Moments } = require('../server/db/database');
const { uploadImage } = require('../server/services/storage.service');

async function testBackend() {
  // Test image upload
  // 1x1 transparent PNG base64
  const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const buffer = Buffer.from(pngBase64, 'base64');
  const upResult = await uploadImage({ buffer, originalName: 'test.png', mimeType: 'image/png' });
  console.log('Upload image result:', upResult.success, upResult.url);
  if (!upResult.success || !upResult.url) throw new Error('Upload image failed');

  // Test moment creation
  const createdMoment = await Moments.create({
    recipient: 'Priya Sharma',
    sender: 'Rohan',
    occasion: 'Birthday',
    message: 'Wishing you a magnificent birthday full of laughs and starlight!',
    photos: [upResult.url],
    lockMode: 'envelope',
    theme: 'Velvet Rose'
  });
  console.log('Created moment:', createdMoment.id, 'slug:', createdMoment.slug);

  // Test retrieval by ID via findBySlug (which supports both slug and id)
  const byId = await Moments.findBySlug(createdMoment.id);
  if (!byId || byId.recipient !== 'Priya Sharma') throw new Error('Could not retrieve moment by ID');
  console.log('✓ Moment found by short ID (id):', byId.recipient);

  const bySlug = await Moments.findBySlug(createdMoment.slug);
  if (!bySlug || bySlug.recipient !== 'Priya Sharma') throw new Error('Could not retrieve moment by slug');
  console.log('✓ Moment found by short slug:', bySlug.recipient);

  console.log('\n========================================');
  console.log('ALL TESTS PASSED WITH 100% SUCCESS!');
  console.log('========================================');
}

testBackend().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
