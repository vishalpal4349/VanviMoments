const fs = require('fs');

const file = 'templates/hues-whispers-luxe/index.html';
let html = fs.readFileSync(file, 'utf8');

// 1. Replace envelope-open-form with new structure
const oldFormStart = html.indexOf('<form method="dialog" class="envelope-open-form">');
const oldFormEnd = html.indexOf('</form>', oldFormStart) + 7;

if (oldFormStart === -1) {
  console.error('Could not find envelope-open-form in index.html');
  process.exit(1);
}

const newForm = `<form method="dialog" class="envelope-open-form">
  <button type="submit" class="envelope-open-button" data-envelope-open aria-label="Tap here to open wedding invitation">
    <span class="envelope-seal-aura" aria-hidden="true"></span>
    <span class="envelope-seal" aria-hidden="true">
      <svg viewBox="0 0 100 100" class="envelope-seal-ring" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="50" cy="50" r="44" stroke="#f47858" stroke-width="1.2" opacity=".6"></circle>
        <circle cx="50" cy="51" r="29" stroke="#500707" stroke-width="2.2" opacity=".7"></circle>
        <circle cx="50" cy="49" r="29" stroke="#e36044" stroke-width=".9" opacity=".65"></circle>
        <g stroke="#540808" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M50 64C39 63 32 55 33 45C34 35 44 30 52 34C60 27 72 37 67 47C76 57 61 68 50 64Z"></path>
          <path d="M43 39C43 31 54 32 57 39C66 36 68 44 60 49C61 58 50 60 45 53C35 51 36 42 43 39Z"></path>
          <path d="M45 42C47 37 55 38 56 44L49 49L45 42ZM49 49L45 53M56 44L60 49M33 45L38 49M57 39L52 34"></path>
          <path d="M50 65V78M50 73C41 76 34 71 32 63C40 62 47 66 50 73ZM50 70C58 71 65 67 68 60C58 58 52 62 50 70Z"></path>
        </g>
        <g stroke="#f18764" stroke-width=".85" stroke-linecap="round" stroke-linejoin="round" opacity=".7" transform="translate(-.7 -1)">
          <path d="M50 64C39 63 32 55 33 45C34 35 44 30 52 34C60 27 72 37 67 47C76 57 61 68 50 64Z"></path>
          <path d="M43 39C43 31 54 32 57 39C66 36 68 44 60 49C61 58 50 60 45 53C35 51 36 42 43 39ZM45 42C47 37 55 38 56 44L49 49L45 42Z"></path>
          <path d="M50 65V78M50 73C41 76 34 71 32 63C40 62 47 66 50 73ZM50 70C58 71 65 67 68 60C58 58 52 62 50 70Z"></path>
        </g>
      </svg>
    </span>
    <span class="envelope-tap-badge">
      <span class="tap-sparkle">✦</span>
      <span class="tap-text">TAP TO OPEN</span>
      <span class="tap-sparkle">✦</span>
    </span>
  </button>
</form>`;

html = html.slice(0, oldFormStart) + newForm + html.slice(oldFormEnd);

// 2. Enhance script for iframe envelope support and toggle message
const oldScriptPattern = `    const inIframe = (function() {
      try { return window.self !== window.top; } catch(e) { return true; }
    })();
    const isDirect = new URLSearchParams(window.location.search).has('no_envelope');

    if (inIframe || isDirect) {
      if (dialog) {
        try { dialog.close(); } catch(e) {}
        dialog.style.display = 'none';
      }
      document.documentElement.dataset.invitationEntrance = 'open';
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    } else {
      if (dialog) {
        try { dialog.showModal(); } catch(e) { dialog.open = true; }
      }
    }`;

const newScriptBlock = `    const inIframe = (function() {
      try { return window.self !== window.top; } catch(e) { return true; }
    })();
    const urlParams = new URLSearchParams(window.location.search);
    const forceEnvelope = urlParams.get('envelope') === '1';
    const isDirect = urlParams.has('no_envelope');

    if ((inIframe && !forceEnvelope) || isDirect) {
      if (dialog) {
        try { dialog.close(); } catch(e) {}
        dialog.style.display = 'none';
      }
      document.documentElement.dataset.invitationEntrance = 'open';
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    } else {
      if (dialog) {
        dialog.style.display = '';
        try { dialog.showModal(); } catch(e) { dialog.open = true; }
      }
    }

    // Support builder postMessage to test unboxing ceremony anytime
    window.addEventListener('message', (e) => {
      if (e.data && (e.data.type === 'VANVI_TOGGLE_ENVELOPE' || e.data.type === 'VANVI_OPEN_ENVELOPE')) {
        if (dialog) {
          dialog.classList.remove('is-opening');
          dialog.style.display = '';
          try { dialog.showModal(); } catch(err) { dialog.open = true; }
        }
      }
    });`;

if (html.includes(oldScriptPattern)) {
  html = html.replace(oldScriptPattern, newScriptBlock);
  console.log('Successfully updated script block');
} else {
  console.log('Script pattern not found directly, checking script tags');
}

fs.writeFileSync(file, html, 'utf8');
console.log('Successfully updated', file);
