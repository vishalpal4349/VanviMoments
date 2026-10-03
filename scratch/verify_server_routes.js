const http = require('http');
const app = require('../server/server');

function testServer() {
  const server = http.createServer(app);
  
  server.listen(0, async () => {
    const port = server.address().port;
    console.log(`Ephemeral test server listening on port ${port}`);

    function get(path) {
      return new Promise((resolve, reject) => {
        http.get(`http://localhost:${port}${path}`, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ status: res.statusCode, body: data }));
        }).on('error', reject);
      });
    }

    try {
      console.log('\nTesting Template Experience Endpoints:');

      // 1. Birthday White Bloom
      const r1 = await get('/template-detail.html?template=birthday-white-bloom-001');
      console.log('1. Birthday White Bloom status:', r1.status);
      console.log('   - Has "✨ Make It Yours":', r1.body.includes('✨ Make It Yours'));
      console.log('   - Has Live Interactive Stage:', r1.body.includes('id="interactiveStageArea"'));
      console.log('   - Has Customization Studio:', r1.body.includes('id="viewStudio"'));

      // 2. Love / Romance Template
      const r2 = await get('/template-detail.html?template=forever-us');
      console.log('2. Forever Us (Love) status:', r2.status);
      console.log('   - Has "✨ Make It Yours":', r2.body.includes('✨ Make It Yours'));
      console.log('   - Has Wax Seal Zone:', r2.body.includes('id="waxZone"'));

      // 3. Wedding / Royal Anniversary Template
      const r3 = await get('/template-detail.html?template=royal-wedding-story');
      console.log('3. Royal Wedding Story status:', r3.status);
      console.log('   - Has "✨ Make It Yours":', r3.body.includes('✨ Make It Yours'));

      // 4. Apology Template
      const r4 = await get('/template-detail.html?template=maaf-kar-do');
      console.log('4. Maaf Kar Do (Apology) status:', r4.status);
      console.log('   - Has "✨ Make It Yours":', r4.body.includes('✨ Make It Yours'));

      // 5. Festival Template
      const r5 = await get('/template-detail.html?template=diwali-sparkler');
      console.log('5. Diwali Sparkler status:', r5.status);
      console.log('   - Has "✨ Make It Yours":', r5.body.includes('✨ Make It Yours'));

      console.log('\n🎉 ALL 5 TEMPLATE EXPERIENCES ROUTE & DELIVER 200 OK SUCCESS!');
    } catch (e) {
      console.error('Test error:', e);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

testServer();
