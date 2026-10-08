const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'block-blast.html');
let code = fs.readFileSync(filePath, 'utf8');

// Replacement CSS with 3D tactile hard polish and drag ghost
const oldStyleTarget = `    /* 8x8 Grid */
    .blast-board {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-template-rows: repeat(8, 1fr);
      gap: 5px;
      width: min(92vw, 360px);
      height: min(92vw, 360px);
      background: rgba(255, 255, 255, 0.88);
      border: 2px solid var(--border-pink);
      border-radius: 20px;
      padding: 10px;
      box-shadow: 0 12px 36px rgba(100, 50, 90, 0.1);
      margin-bottom: 18px;
    }
    .blast-cell {
      background: rgba(255, 240, 246, 0.5);
      border-radius: 6px;
      transition: background 0.15s ease, transform 0.2s ease;
      cursor: pointer;
    }
    .blast-cell.filled {
      background: linear-gradient(135deg, #ff2a7a, #e11d68);
      box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.4), 0 2px 6px rgba(255, 42, 122, 0.35);
    }
    .blast-cell.hover-preview {
      background: rgba(255, 42, 122, 0.35) !important;
    }
    .blast-cell.clearing {
      animation: cellBlast 0.35s ease forwards;
    }
    @keyframes cellBlast {
      0% { transform: scale(1); filter: brightness(2); }
      50% { transform: scale(1.2); opacity: 0.8; }
      100% { transform: scale(0); opacity: 0; }
    }

    /* 3 Pieces Spawn Rack */
    .pieces-rack {
      display: flex;
      justify-content: center;
      gap: 12px;
      width: 100%;
      min-height: 90px;
      margin-bottom: 16px;
    }
    .piece-box {
      flex: 1;
      max-width: 110px;
      height: 90px;
      background: rgba(255, 255, 255, 0.9);
      border: 1.5px solid var(--border-pink);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(100, 50, 90, 0.06);
      transition: all 0.2s ease;
      position: relative;
    }
    .piece-box.selected {
      border-color: var(--rose-main);
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(255, 42, 122, 0.3);
      background: #fff0f6;
    }
    .piece-box.used {
      opacity: 0.2;
      pointer-events: none;
      border-style: dashed;
    }
    .mini-grid {
      display: grid;
      gap: 3px;
    }
    .mini-cell {
      width: 14px;
      height: 14px;
      border-radius: 3px;
      background: transparent;
    }
    .mini-cell.on {
      background: linear-gradient(135deg, #ff2a7a, #d97706);
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }`;

const newStyleReplacement = `    /* 3D HARD POLISH 8x8 Grid */
    .blast-board {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-template-rows: repeat(8, 1fr);
      gap: 6px;
      width: min(92vw, 360px);
      height: min(92vw, 360px);
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(255, 245, 250, 0.95));
      border: 2px solid rgba(255, 120, 175, 0.45);
      border-radius: 22px;
      padding: 10px;
      box-shadow: 
        0 20px 45px -10px rgba(100, 40, 80, 0.16),
        0 0 0 1px rgba(255, 255, 255, 0.9),
        inset 0 2px 4px rgba(255, 255, 255, 0.9);
      margin-bottom: 14px;
      touch-action: none;
    }
    .blast-cell {
      background: rgba(255, 238, 246, 0.65);
      border: 1px solid rgba(255, 180, 210, 0.35);
      border-radius: 8px;
      transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
      cursor: pointer;
      position: relative;
      box-shadow: inset 0 2px 3px rgba(255, 255, 255, 0.8), 0 2px 4px rgba(44, 18, 36, 0.04);
    }
    .blast-cell.filled {
      background: linear-gradient(135deg, #ff2a7a 0%, #ff529a 50%, #d97706 100%);
      border-color: rgba(255, 255, 255, 0.8);
      box-shadow: 
        inset 0 2.5px 3px rgba(255, 255, 255, 0.85),
        inset 0 -2.5px 3px rgba(160, 20, 80, 0.35),
        0 4px 10px rgba(255, 42, 122, 0.35);
      transform: scale(0.98);
    }
    .blast-cell.hover-preview {
      background: linear-gradient(135deg, rgba(255, 42, 122, 0.45), rgba(217, 119, 6, 0.45)) !important;
      border-color: #ff2a7a !important;
      box-shadow: 0 0 12px rgba(255, 42, 122, 0.5), inset 0 0 6px #fff !important;
      transform: scale(1.04);
    }
    .blast-cell.hover-invalid {
      background: rgba(239, 68, 68, 0.3) !important;
      border-color: #ef4444 !important;
    }
    .blast-cell.clearing {
      animation: cellBlast 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes cellBlast {
      0% { transform: scale(1); filter: brightness(2.5); box-shadow: 0 0 20px #ff2a7a; }
      40% { transform: scale(1.25); opacity: 0.9; }
      100% { transform: scale(0); opacity: 0; }
    }

    /* 3 Pieces Spawn Rack (Swipeable & Draggable) */
    .pieces-rack {
      display: flex;
      justify-content: center;
      gap: 12px;
      width: 100%;
      min-height: 94px;
      margin-bottom: 16px;
      touch-action: none;
    }
    .piece-box {
      flex: 1;
      max-width: 110px;
      height: 94px;
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(255, 248, 252, 0.95));
      border: 1.5px solid rgba(255, 120, 175, 0.35);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      box-shadow: 
        0 6px 16px rgba(100, 50, 90, 0.06),
        inset 0 2px 2px #fff;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
      position: relative;
      touch-action: none;
      user-select: none;
    }
    .piece-box:active {
      cursor: grabbing;
    }
    .piece-box.selected {
      border-color: var(--rose-main);
      transform: translateY(-4px);
      box-shadow: 0 10px 26px rgba(255, 42, 122, 0.32), inset 0 2px 2px #fff;
      background: #fff0f6;
    }
    .piece-box.dragging {
      opacity: 0.35;
      transform: scale(0.95);
      border-style: dashed;
    }
    .piece-box.used {
      opacity: 0.2;
      pointer-events: none;
      border-style: dashed;
    }
    .mini-grid {
      display: grid;
      gap: 3.5px;
      pointer-events: none;
    }
    .mini-cell {
      width: 15px;
      height: 15px;
      border-radius: 4px;
      background: transparent;
    }
    .mini-cell.on {
      background: linear-gradient(135deg, #ff2a7a 0%, #ff529a 50%, #d97706 100%);
      box-shadow: inset 0 1.5px 2px rgba(255, 255, 255, 0.7), 0 2px 4px rgba(44, 18, 36, 0.15);
    }

    /* Floating Drag Ghost (Follows Touch / Cursor) */
    .blast-drag-ghost {
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      display: none;
      transform: translate(-50%, -50%);
      filter: drop-shadow(0 14px 28px rgba(255, 42, 122, 0.45));
      transition: transform 0.05s linear;
    }
    .blast-drag-ghost .mini-grid {
      gap: 5px;
    }
    .blast-drag-ghost .mini-cell.on {
      width: 32px;
      height: 32px;
      border-radius: 7px;
      background: linear-gradient(135deg, #ff2a7a, #d97706);
      box-shadow: inset 0 2.5px 3px rgba(255, 255, 255, 0.8), 0 4px 8px rgba(0, 0, 0, 0.25);
    }

    /* 3D Push Button Styling */
    .btn-3d-tactile {
      padding: 10px 22px;
      border-radius: 999px;
      background: linear-gradient(135deg, #ffffff, #fff0f6);
      border: 1.5px solid rgba(255, 120, 175, 0.4);
      color: var(--text-dark);
      font-weight: 850;
      font-size: 13px;
      cursor: pointer;
      box-shadow: 0 4px 0 rgba(217, 70, 120, 0.4), 0 8px 16px rgba(44, 18, 36, 0.06);
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-3d-tactile:hover {
      transform: translateY(-1.5px);
      box-shadow: 0 5px 0 rgba(217, 70, 120, 0.45), 0 10px 20px rgba(255, 42, 122, 0.15);
      border-color: var(--rose-main);
    }
    .btn-3d-tactile:active {
      transform: translateY(3px);
      box-shadow: 0 1px 0 rgba(217, 70, 120, 0.4), 0 2px 6px rgba(44, 18, 36, 0.08);
    }`;

code = code.replace(oldStyleTarget, newStyleReplacement);

// Add the drag ghost markup before </main>
const ghostHtml = `
    <!-- Floating Drag Ghost for Swipeable Blocks -->
    <div id="blastDragGhost" class="blast-drag-ghost"></div>
  </main>`;

code = code.replace('  </main>', ghostHtml);

// Update Restart button to 3D tactile class
code = code.replace('<button type="button" onclick="resetGame()" style="padding:10px 20px; border-radius:12px; background:#fff; border:1.5px solid var(--border-pink); font-weight:800; font-size:12.5px; cursor:pointer;">', '<button type="button" onclick="resetGame()" class="btn-3d-tactile">');

// Update gameplay JavaScript to include full touch & pointer drag and swipeable physics
const oldScriptStart = "      let board = Array(8).fill(null).map(() => Array(8).fill(0));\n      let score = 0;\n      let selectedPieceIdx = null;\n      let rackPieces = [];\n      let rewarded = false;";

const newScriptStart = `      let board = Array(8).fill(null).map(() => Array(8).fill(0));
      let score = 0;
      let selectedPieceIdx = null;
      let rackPieces = [];
      let rewarded = false;

      // Audio feedback synth
      let audioCtx = null;
      function playTone(freq, type = 'sine', duration = 0.1) {
        try {
          if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          if (audioCtx.state === 'suspended') audioCtx.resume();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + duration);
        } catch (e) {}
      }`;

code = code.replace(oldScriptStart, newScriptStart);

fs.writeFileSync(filePath, code, 'utf8');
console.log('✅ block-blast.html CSS and variables updated');
