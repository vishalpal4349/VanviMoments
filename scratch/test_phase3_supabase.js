const fs = require('fs');
const path = require('path');
const supabaseService = require('../server/services/supabase.service');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

async function runPhase3Tests() {
  console.log('====================================================');
  console.log('VANVI MOMENTS — PHASE 3 SUPABASE INTEGRATION TESTS');
  console.log('====================================================\n');

  // 1. Database Connection & Service Status
  const status = supabaseService.getStatus();
  assert(status && status.mode, `Database service status active (Mode: ${status.mode})`);
  assert(status.tables.length === 7, `Architecture specifies all 7 required tables: ${status.tables.join(', ')}`);

  // 2. Templates Read & Unlimited Pricing Validation
  const templates = await supabaseService.getAllTemplates(true);
  assert(templates.length >= 9, `Resolved all active templates (Count: ${templates.length})`);
  
  const sampleTpl = await supabaseService.getTemplateById('birthday-3d-candle');
  assert(sampleTpl && sampleTpl.template_id === 'birthday-3d-candle', 'Resolved template by template_id (birthday-3d-candle)');
  assert(sampleTpl.price !== undefined, `Template price is data-driven (Price: ₹${sampleTpl.price})`);

  // Dynamic template schema resolution
  const schema = await supabaseService.getTemplateSchema('birthday-3d-candle');
  assert(schema && Array.isArray(schema.fields) && schema.fields.length > 0, `Template schema retrieved dynamically (${schema.fields.length} fields)`);

  // 3. Dynamic Template Creation with Arbitrary Price (Unlimited Architecture)
  const testTplId = `test-future-tpl-${Date.now()}`;
  const customTpl = {
    template_id: testTplId,
    name: 'Future Spatial Nebula Keepsake',
    price: 349.50, // Arbitrary non-tiered price
    category: 'Future',
    builder_strategy: 'common',
    config: { version: '2.0.0', customFx: 'nebula_warp' },
    is_active: true
  };
  const savedTpl = await supabaseService.upsertTemplate(customTpl);
  assert(savedTpl && savedTpl.price === 349.50, `Arbitrary price template created without fixed tiers (Price: ₹${savedTpl.price})`);

  // 4. Moment Creation with JSONB custom_data
  const testSlug = `test-moment-${Date.now()}`;
  const testMomentPayload = {
    slug: testSlug,
    template_id: 'birthday-3d-candle',
    custom_data: {
      title: 'Happy 21st Birthday Diya!',
      recipient: 'Diya',
      sender: 'Aman',
      occasion: 'Birthday',
      secretWishes: ['You are magical', 'Never stop smiling'],
      cakeType: 'Velvet Rose Gold 3D',
      ambientTrack: 'acoustic-piano',
      unlimitedExtraField1: 'Arbitrary bespoke value'
    },
    status: 'published'
  };

  const createdMoment = await supabaseService.createMoment(testMomentPayload);
  assert(createdMoment && createdMoment.slug === testSlug, `Moment created with slug "${testSlug}"`);
  assert(createdMoment.template_id === 'birthday-3d-candle' || createdMoment.templateId === 'birthday-3d-candle', 'Moment preserves exact template_id');

  // 5. Slug Lookup & custom_data JSONB Read
  const fetchedMoment = await supabaseService.getMomentBySlug(testSlug);
  assert(fetchedMoment !== null, `Retrieved moment by slug "${testSlug}"`);
  assert(fetchedMoment.custom_data && fetchedMoment.custom_data.recipient === 'Diya', 'Retrieved custom_data JSONB payload accurately');
  assert(fetchedMoment.custom_data.unlimitedExtraField1 === 'Arbitrary bespoke value', 'Preserved arbitrary non-standard custom_data fields');

  // 6. Moment Update Test
  const updatedMoment = await supabaseService.updateMoment(testSlug, {
    views: 5,
    hearts: 3
  });
  assert(updatedMoment !== null, 'Updated moment stats successfully');

  // 7. /m/:slug Routing & Template Resolution Test
  const serverPath = path.resolve(__dirname, '../server/server.js');
  const serverCode = fs.readFileSync(serverPath, 'utf8');
  assert(serverCode.includes("app.get('/m/:slug'"), 'server.js provides canonical /m/:slug route');
  assert(serverCode.includes('supabaseService.getMomentBySlug(slug)'), '/m/:slug routes through supabaseService adapter layer');

  // 8. DDL Migration Schema Check
  const ddlPath = path.resolve(__dirname, '../server/db/migrations/002_supabase_unlimited_templates.sql');
  const ddlContent = fs.readFileSync(ddlPath, 'utf8');
  const requiredTables = ['profiles', 'templates', 'template_schemas', 'moments', 'moment_assets', 'orders', 'payments'];
  requiredTables.forEach(t => {
    assert(ddlContent.includes(`CREATE TABLE IF NOT EXISTS ${t}`), `Supabase DDL includes table "${t}"`);
  });
  assert(ddlContent.includes('ENABLE ROW LEVEL SECURITY'), 'Supabase DDL enables Row Level Security (RLS)');

  console.log(`\nPhase 3 Tests finished: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runPhase3Tests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
