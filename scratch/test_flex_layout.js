// Test flexbox layout with jsdom / CSS logic
const { JSDOM } = require('jsdom');

const dom = new JSDOM(`<!DOCTYPE html>
<html>
<head>
<style>
  html, body {
    height: 100vh;
    margin: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  header {
    height: 60px;
    flex: 0 0 60px;
  }
  main {
    flex: 1 1 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .feed {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
  }
  .dock {
    flex: 0 0 auto;
  }
</style>
</head>
<body>
  <header>Header</header>
  <main>
    <div class="feed">
      <div style="height: 5000px;">Huge Content</div>
    </div>
    <div class="dock">Dock</div>
  </main>
</body>
</html>`);

console.log('DOM initialized successfully');
