// Phase 4 - Cloudinary Media Upload System Test Suite
const assert = require('assert');
const path = require('path');
const fs = require('fs');

async function runTests() {
  console.log('🧪 Starting Phase 4 Cloudinary Integration Tests...\n');
  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}:`, err.message);
    }
  }

  async function asyncTest(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}:`, err.message);
    }
  }

  // 1. Module imports
  const cloudinaryService = require('../server/services/cloudinary.service');
  const storageService = require('../server/services/storage.service');
  const supabaseService = require('../server/services/supabase.service');

  // Test 1: Configuration detection
  test('Cloudinary configuration detection (handles missing or partial credentials gracefully)', () => {
    const isConfigured = cloudinaryService.isConfigured;
    // In local dev without env variables filled, it should return false cleanly without crashing
    assert.strictEqual(typeof isConfigured, 'boolean');
    const safeConfig = cloudinaryService.getSafeConfig();
    assert.strictEqual(safeConfig.uploadPreset, 'vanvi_moments');
    assert.strictEqual(safeConfig.apiSecret, undefined, 'API secret must NEVER be exposed in safe config');
  });

  // Test 2: Structured folder generation
  test('Structured folder path generation matches Cloudinary Architecture specs', () => {
    const momentFolder = cloudinaryService.getFolderPath('moment', 'mom_12345');
    assert.strictEqual(momentFolder, 'vanvi_moments/moments/mom_12345');

    const templateFolder = cloudinaryService.getFolderPath('template', 'bday_neon_3d');
    assert.strictEqual(templateFolder, 'vanvi_moments/templates/bday_neon_3d');

    const brandingFolder = cloudinaryService.getFolderPath('branding');
    assert.strictEqual(brandingFolder, 'vanvi_moments/branding');
  });

  // Test 3: Client signature generation (security)
  test('Client signature generation produces SHA-1 hex without leaking API Secret', () => {
    const origCloud = process.env.CLOUDINARY_CLOUD_NAME;
    const origKey = process.env.CLOUDINARY_API_KEY;
    const origSecret = process.env.CLOUDINARY_API_SECRET;
    try {
      process.env.CLOUDINARY_CLOUD_NAME = 'test_cloud';
      process.env.CLOUDINARY_API_KEY = 'test_key_123';
      process.env.CLOUDINARY_API_SECRET = 'test_secret_key_123';
      const sigData = cloudinaryService.generateClientSignature({
        folder: 'vanvi_moments/moments/test_mom',
        timestamp: 1700000000
      });
      assert.ok(sigData.signature, 'Should return a signature string');
      assert.strictEqual(sigData.signature.length, 40, 'SHA-1 signature is 40 hex chars');
      assert.strictEqual(sigData.apiSecret, undefined, 'Signature payload must not contain secret');
    } finally {
      process.env.CLOUDINARY_CLOUD_NAME = origCloud;
      process.env.CLOUDINARY_API_KEY = origKey;
      process.env.CLOUDINARY_API_SECRET = origSecret;
    }
  });

  // Test 4: Local fallback image upload with metadata
  await asyncTest('Storage service image upload via fallback/local preserves metadata and moment_assets', async () => {
    const sampleImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const uploadRes = await storageService.uploadMedia(sampleImageBase64, {
      templateId: 'bday_neon_3d',
      momentId: 'mom_test_img_001',
      assetType: 'photo'
    });

    assert.ok(uploadRes.url, 'Must return url');
    assert.ok(uploadRes.public_id, 'Must return public_id');
    assert.strictEqual(uploadRes.resource_type, 'image');
    assert.strictEqual(uploadRes.moment_id, 'mom_test_img_001');
    assert.strictEqual(uploadRes.template_id, 'bday_neon_3d');
    assert.strictEqual(uploadRes.asset_type, 'photo');

    // Verify stored in moment_assets via supabase service
    const assets = await supabaseService.getMomentAssets('mom_test_img_001');
    assert.ok(Array.isArray(assets));
    assert.ok(assets.length >= 1);
    assert.strictEqual(assets[0].moment_id, 'mom_test_img_001');
    assert.strictEqual(assets[0].asset_type, 'photo');
  });

  // Test 5: Audio upload with format detection
  await asyncTest('Storage service audio upload handles audio MIME type properly', async () => {
    const sampleAudioBase64 = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA';
    const uploadRes = await storageService.uploadMedia(sampleAudioBase64, {
      templateId: 'anniv_scroll_2d',
      momentId: 'mom_test_audio_002',
      assetType: 'music'
    });

    assert.ok(uploadRes.url);
    assert.strictEqual(uploadRes.resource_type, 'audio');
    assert.strictEqual(uploadRes.format, 'mp3');
    assert.strictEqual(uploadRes.asset_type, 'music');
    assert.strictEqual(uploadRes.moment_id, 'mom_test_audio_002');
  });

  // Test 6: Video upload with format detection
  await asyncTest('Storage service video upload handles video MIME type properly', async () => {
    const sampleVideoBase64 = 'data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAAAAG1wNDJpc29tYXZjMQAA';
    const uploadRes = await storageService.uploadMedia(sampleVideoBase64, {
      templateId: 'bday_neon_3d',
      momentId: 'mom_test_vid_003',
      assetType: 'video'
    });

    assert.ok(uploadRes.url);
    assert.strictEqual(uploadRes.resource_type, 'video');
    assert.strictEqual(uploadRes.format, 'mp4');
    assert.strictEqual(uploadRes.asset_type, 'video');
    assert.strictEqual(uploadRes.moment_id, 'mom_test_vid_003');
  });

  // Test 7: Optimization URL helper generates valid Cloudinary transformation URLs
  test('Cloudinary getOptimizedUrl applies safe transformations', () => {
    const rawUrl = 'https://res.cloudinary.com/demo/image/upload/v1234567/sample.jpg';
    const optimized = cloudinaryService.getOptimizedUrl(rawUrl, { width: 800, quality: 'auto' });
    assert.ok(optimized.includes('f_auto,q_auto'));
    assert.ok(optimized.includes('w_800'));

    // Non-cloudinary url returns as is
    const localUrl = '/uploads/sample.jpg';
    assert.strictEqual(cloudinaryService.getOptimizedUrl(localUrl), localUrl);
  });

  // Test 8: Asset retrieval by momentId
  await asyncTest('Retrieving moment assets by momentId returns all linked assets', async () => {
    const assets = await supabaseService.getMomentAssets('mom_test_img_001');
    assert.ok(assets.length > 0);
    assert.strictEqual(assets[0].template_id, 'bday_neon_3d');
  });

  // Summary
  console.log(`\n========================================`);
  console.log(`Phase 4 Cloudinary Results: ${passed} / ${total} passed`);
  console.log(`========================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
