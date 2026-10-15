// Root entrypoint for cloud hosting environments (Render / Railway / Heroku)
const app = require('./server/server.js');
const PORT = process.env.PORT || 3000;

if (app && typeof app.listen === 'function' && !app._isListening) {
  app._isListening = true;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 [Render Entrypoint] Vanvi Moments cloud backend live on 0.0.0.0:${PORT}`);
  });
}
