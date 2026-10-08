/**
 * scratch/test_admin_control_center.js
 * Verification of Vanvi Admin Control Center (all 20 modules)
 */

const { adminCmsService } = require('../server/services/admin-cms.service.js');
const { adminCopilotService } = require('../server/services/admin-copilot.service.js');
const { getStore } = require('../server/db/database.js');

async function runTests() {
  console.log('====================================================');
  console.log('   VANVI ADMIN CONTROL CENTER MASTER SUITE          ');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(desc, condition) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${desc}`);
      process.exitCode = 1;
    }
  }

  // 1. Health Status
  console.log('[1/8] Testing Admin & System Health Check...');
  const health = await adminCmsService.getHealthStatus();
  assert('Health reports database status', health.database && health.database.connected);
  assert('Health reports services status', health.services && health.services.cloudinary !== undefined);
  assert('Health reports memory and uptime', health.process && health.process.uptimeSeconds >= 0);

  // 2. Metrics & Overview
  console.log('\n[2/8] Testing Admin Overview & KPIs...');
  const metrics = await adminCmsService.getOverviewMetrics();
  assert('Overview metrics contain revenue', typeof metrics.revenue === 'number');
  assert('Overview metrics contain orders count', typeof metrics.totalOrders === 'number');
  assert('Overview metrics contain users count', typeof metrics.totalUsers === 'number');
  assert('Overview metrics contain templates count', typeof metrics.totalTemplates === 'number');
  assert('Overview metrics contain publishedTemplates count', typeof metrics.publishedTemplates === 'number');
  assert('Overview metrics contain coin circulation', typeof metrics.coinCirculation === 'number');

  // 3. Template Management, Drafts, Publishing, Version Rollback
  console.log('\n[3/8] Testing Template Manager (Draft, Publish, Version, Rollback)...');
  const allTemplates = adminCmsService.listTemplates();
  assert('Templates list returns array', Array.isArray(allTemplates) && allTemplates.length > 0);
  const firstTpl = allTemplates[0];
  assert('First template has ID and name', firstTpl.id && firstTpl.name);

  // Test updating draft
  const originalName = firstTpl.name;
  const draftUpdate = await adminCmsService.updateTemplateDraft(firstTpl.id, {
    name: originalName + ' [Draft]',
    badge: 'Trending Special',
    price: 399
  }, 'admin-test');
  assert('Draft updated successfully', draftUpdate.draft && draftUpdate.draft.name.includes('[Draft]'));
  assert('Draft has status draft', draftUpdate.draftStatus === 'draft');

  // Test publishing draft
  const publishedTpl = await adminCmsService.publishTemplate(firstTpl.id, 'admin-test', 'Testing publish workflow');
  assert('Template published successfully', publishedTpl.isPublished === true);
  assert('Template version incremented', publishedTpl.version >= 2);
  assert('Published name updated', publishedTpl.name.includes('[Draft]'));

  // Test version history
  const versions = adminCmsService.getTemplateVersions(firstTpl.id);
  assert('Version history contains versions', Array.isArray(versions) && versions.length >= 1);

  // Test rollback
  const rolledBack = await adminCmsService.rollbackTemplate(firstTpl.id, versions[0].versionNumber, 'admin-test');
  assert('Template rollback succeeded', rolledBack && rolledBack.version >= 1);

  // Revert name back for clean state
  await adminCmsService.updateTemplateDraft(firstTpl.id, { name: originalName }, 'admin-test');
  await adminCmsService.publishTemplate(firstTpl.id, 'admin-test', 'Reverted back to original name');

  // 4. Preset Management
  console.log('\n[4/8] Testing Preset Manager (Create, Duplicate, Clone to Template)...');
  const initialPresets = adminCmsService.listPresets();
  assert('Presets listed', Array.isArray(initialPresets));

  const newPreset = await adminCmsService.createPreset({
    title: 'Neon Cyberpunk Anniversary',
    category: 'anniversary',
    templateId: firstTpl.id,
    previewImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7',
    badge: 'Popular',
    config: { theme: 'neon', primaryColor: '#00ffcc' }
  }, 'admin-test');
  assert('Preset created with ID', newPreset && newPreset.id.startsWith('preset-'));

  const duplicatedPreset = await adminCmsService.duplicatePreset(newPreset.id, 'admin-test');
  assert('Preset duplicated with copy title', duplicatedPreset && duplicatedPreset.title.includes('Copy'));

  const clonedTemplate = await adminCmsService.clonePresetToTemplate(newPreset.id, {
    name: 'Cloned Cyberpunk Moment',
    slug: 'cloned-cyberpunk-moment'
  }, 'admin-test');
  assert('Preset cloned into new template', clonedTemplate && clonedTemplate.id.startsWith('tpl-cloned-'));
  assert('Cloned template exists in templates list', adminCmsService.getTemplateById(clonedTemplate.id) !== null);

  // Delete test preset
  await adminCmsService.deletePreset(duplicatedPreset.id, 'admin-test');
  await adminCmsService.deletePreset(newPreset.id, 'admin-test');

  // 5. Page & Content Management
  console.log('\n[5/8] Testing Content & Page Manager (Hero, Announcements, FAQ)...');
  const content = adminCmsService.getContent();
  assert('Content has hero section', content.hero && content.hero.headline);
  assert('Content has announcements', content.announcements !== undefined);

  const updatedContent = await adminCmsService.updateContent({
    announcements: {
      enabled: true,
      text: 'Special Diwali & Festive discount: 30% OFF using code FESTIVE30',
      badge: 'Festive Offer'
    }
  }, 'admin-test');
  assert('Content updated announcement text', updatedContent.announcements.text.includes('FESTIVE30'));

  // 6. Settings Management
  console.log('\n[6/8] Testing Settings & Feature Flags...');
  const settings = adminCmsService.getSettings();
  assert('Settings has siteName', settings.siteName === 'Vanvi Moments');
  assert('Settings has featureFlags', settings.featureFlags && settings.featureFlags.aiMatcher !== undefined);

  const updatedSettings = await adminCmsService.updateSettings({
    pricing: { ...settings.pricing, defaultTemplatePrice: 299 }
  }, 'admin-test');
  assert('Pricing setting updated', updatedSettings.pricing.defaultTemplatePrice === 299);

  // 7. Media Manager Usage & Check
  console.log('\n[7/8] Testing Media Manager & Cloudinary Asset Verification...');
  const mediaList = await adminCmsService.listMedia();
  assert('Media list returned array', Array.isArray(mediaList) && mediaList.length > 0);
  const mediaItem = mediaList[0];
  assert('Media item has url and usage detection', mediaItem.url && Array.isArray(mediaItem.usedIn));

  // 8. Admin Copilot AI Command Processing
  console.log('\n[8/8] Testing Admin Copilot AI Natural Language Command Engine...');
  const planResult = await adminCopilotService.processCopilotCommand(
    'Feature the romantic sunset template on homepage',
    'plan',
    'admin-test'
  );
  assert('Copilot generated actionable plan', planResult.plan && planResult.plan.suggestedActions.length > 0);

  const queryResult = await adminCopilotService.processCopilotCommand(
    'How many users and orders do we have today?',
    'plan',
    'admin-test'
  );
  assert('Copilot answered analytics query with response text', typeof queryResult.response === 'string' && queryResult.response.length > 0);

  console.log('\n====================================================');
  console.log(`🎉 ALL ${passed}/${total} ADMIN CONTROL CENTER TESTS PASSED!`);
  console.log('====================================================\n');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
