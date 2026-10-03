const http = require('http');
const { Users, CoinLedger } = require('../server/db/database');

async function runTests() {
  console.log('--- Testing Google Auth & Data Storage Flow ---');

  // 1. Direct DB Repository Test
  const testEmail = `g_test_${Date.now()}@gmail.com`;
  const createdUser = await Users.create({
    name: 'Aman Google Test',
    email: testEmail,
    googleId: 'g_1029384756',
    picture: 'https://lh3.googleusercontent.com/a/testavatar',
    provider: 'google',
    role: 'user',
    tier: 'free',
    coins: 100
  });

  console.log('1. User Created in DB:', {
    id: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
    picture: createdUser.picture,
    provider: createdUser.provider,
    coins: createdUser.coins
  });

  if (!createdUser.picture || createdUser.provider !== 'google') {
    throw new Error('Google picture or provider was not persisted properly!');
  }

  // 2. Test User Retrieval by Email
  const foundUser = await Users.findByEmail(testEmail);
  if (!foundUser || foundUser.id !== createdUser.id) {
    throw new Error('Failed to find user by Google email!');
  }
  console.log('2. Successfully retrieved user by email.');

  // 3. Test Users.listAll safe mapping
  const allUsers = await Users.listAll({ query: 'Aman Google Test' });
  if (!allUsers.some(u => u.email === testEmail)) {
    throw new Error('User not listed in Users.listAll!');
  }
  const listedUser = allUsers.find(u => u.email === testEmail);
  if (listedUser.passwordHash !== undefined || listedUser.salt !== undefined) {
    throw new Error('Security risk: passwordHash or salt leaked in listAll!');
  }
  console.log('3. Users.listAll securely strips passwords and includes Google attributes:', {
    id: listedUser.id,
    name: listedUser.name,
    email: listedUser.email,
    provider: listedUser.provider,
    picture: listedUser.picture,
    hasPasswordHash: listedUser.passwordHash !== undefined
  });

  // 4. Test Users.update
  const updatedUser = await Users.update(createdUser.id, {
    coins: 250,
    tier: 'member',
    templateCredits: 3
  });
  if (updatedUser.coins !== 250 || updatedUser.tier !== 'member' || updatedUser.templateCredits !== 3) {
    throw new Error('Users.update failed to update wallet or tier!');
  }
  console.log('4. Users.update successfully updated wallet and tier:', {
    coins: updatedUser.coins,
    tier: updatedUser.tier,
    templateCredits: updatedUser.templateCredits
  });

  // 5. Test Users.delete
  const deleteSuccess = await Users.delete(createdUser.id);
  if (!deleteSuccess) {
    throw new Error('Users.delete failed!');
  }
  const deletedCheck = await Users.findById(createdUser.id);
  if (deletedCheck !== null) {
    throw new Error('User was not removed from DB store!');
  }
  console.log('5. Users.delete successfully removed test account.');

  console.log('\n>>> ALL GOOGLE AUTH DATA REPOSITORY TESTS PASSED SUCCESSFULLY! ✨ <<<');
}

runTests().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
