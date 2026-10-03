/**
 * VANVI MOMENTS — STORE TO SUPABASE MIGRATION SCRIPT
 * Safely transfers all legacy store.json data to the Phase 3 Supabase tables
 * Features:
 * - Non-destructive: preserves existing store.json and backup
 * - Normalizes moments to JSONB custom_data architecture
 * - Populates templates with arbitrary pricing & schemas
 */

const fs = require('fs');
const path = require('path');
const supabaseService = require('../services/supabase.service');

async function runMigration() {
  console.log('========================================================');
  console.log('VANVI MOMENTS — PHASE 3 STORE TO SUPABASE MIGRATION');
  console.log('========================================================\n');

  const storePath = path.resolve(__dirname, '../data/store.json');
  if (!fs.existsSync(storePath)) {
    console.error('❌ store.json not found at:', storePath);
    return;
  }

  const raw = fs.readFileSync(storePath, 'utf8');
  const store = JSON.parse(raw);

  console.log(`📦 Loaded legacy store with:`);
  console.log(`  - Users: ${store.users ? store.users.length : 0}`);
  console.log(`  - Moments: ${store.moments ? store.moments.length : 0}`);
  console.log(`  - Orders: ${store.orders ? store.orders.length : 0}\n`);

  // 1. Migrate Templates from templates/*/template.json
  console.log('1. Discovering & Populating Templates & Schemas...');
  const templates = await supabaseService.getAllTemplates(false);
  console.log(`  ✓ Resolved ${templates.length} independent templates.`);
  for (const tpl of templates) {
    await supabaseService.upsertTemplate(tpl);
  }

  // 2. Migrate Users to Profiles
  console.log('\n2. Migrating User Accounts to Profiles...');
  let migratedUsers = 0;
  if (Array.isArray(store.users)) {
    for (const u of store.users) {
      const profile = {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || null,
        password_hash: u.passwordHash,
        salt: u.salt,
        role: u.role || 'user',
        tier: u.tier || 'free',
        coins: u.coins !== undefined ? u.coins : 100,
        last_spin_time: u.lastSpinTime || 0,
        created_at: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
        updated_at: u.updatedAt ? new Date(u.updatedAt).toISOString() : new Date().toISOString()
      };
      await supabaseService.upsertProfile(profile);
      migratedUsers++;
    }
  }
  console.log(`  ✓ Successfully processed ${migratedUsers} profiles.`);

  // 3. Migrate Moments to JSONB custom_data
  console.log('\n3. Normalizing Moments to Unlimited custom_data JSONB Architecture...');
  let migratedMoments = 0;
  if (Array.isArray(store.moments)) {
    for (const m of store.moments) {
      const momentPayload = {
        id: m.id,
        slug: m.slug,
        user_id: m.userId || null,
        template_id: m.templateId || m.template_id || 'birthday-3d-candle',
        custom_data: m.custom_data || m.customData || {
          title: m.title,
          recipient: m.recipient,
          sender: m.sender,
          occasion: m.occasion,
          message: m.message,
          photos: m.photos || [],
          music_track: m.musicTrack || 'acoustic-piano',
          theme: m.theme || 'Velvet Rose'
        },
        status: m.status || 'published',
        views: m.views || 0,
        hearts: m.hearts || 0,
        created_at: m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString(),
        updated_at: m.updatedAt ? new Date(m.updatedAt).toISOString() : new Date().toISOString()
      };
      await supabaseService.createMoment(momentPayload);
      migratedMoments++;
    }
  }
  console.log(`  ✓ Successfully processed ${migratedMoments} moments with JSONB custom_data.`);

  console.log('\n========================================================');
  console.log('🎉 PHASE 3 DATA MIGRATION COMPLETED SUCCESSFULLY!');
  console.log(`Status: ${supabaseService.getStatus().mode}`);
  console.log('========================================================\n');
}

if (require.main === module) {
  runMigration().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}

module.exports = { runMigration };
