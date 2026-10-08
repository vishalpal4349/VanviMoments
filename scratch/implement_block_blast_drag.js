const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'block-blast.html');
let code = fs.readFileSync(filePath, 'utf8');

const targetFunctionBlock = `      function renderRack() {
        const rack = document.getElementById('piecesRack');
        rack.innerHTML = '';

        rackPieces.forEach((p, idx) => {
          const box = document.createElement('div');
          box.className = 'piece-box' + (p.used ? ' used' : '') + (selectedPieceIdx === idx ? ' selected' : '');
          
          if (!p.used) {
            const mini = document.createElement('div');
            mini.className = 'mini-grid';
            mini.style.gridTemplateRows = \`repeat(\${p.shape.length}, 14px)\`;
            mini.style.gridTemplateColumns = \`repeat(\${p.shape[0].length}, 14px)\`;

            p.shape.forEach(row => {
              row.forEach(val => {
                const mc = document.createElement('div');
                mc.className = 'mini-cell' + (val ? ' on' : '');
                mini.appendChild(mc);
              });
            });
            box.appendChild(mini);

            box.addEventListener('click', () => {
              selectedPieceIdx = selectedPieceIdx === idx ? null : idx;
              renderRack();
            });
          }
          rack.appendChild(box);
        });
      }`;

const replacementFunctionBlock = `      let isDragging = false;
      let draggedPieceIdx = null;
      let dragStartX = 0;
      let dragStartY = 0;
      let hasDragged = false;
      let hoveredTarget = null;

      function getCellFromPoint(clientX, clientY) {
        const boardEl = document.getElementById('blastBoard');
        if (!boardEl) return null;
        const rect = boardEl.getBoundingClientRect();
        if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
          return null;
        }
        const cellWidth = rect.width / 8;
        const cellHeight = rect.height / 8;
        const c = Math.floor((clientX - rect.left) / cellWidth);
        const r = Math.floor((clientY - rect.top) / cellHeight);
        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
          return { r, c };
        }
        return null;
      }

      function clearPreviews() {
        document.querySelectorAll('.blast-cell.hover-preview, .blast-cell.hover-invalid').forEach(el => {
          el.classList.remove('hover-preview', 'hover-invalid');
        });
      }

      function updateDragPreview(piece, target) {
        clearPreviews();
        if (!target || !piece) return;
        const valid = canPlace(piece.shape, target.r, target.c);
        for (let pr = 0; pr < piece.shape.length; pr++) {
          for (let pc = 0; pc < piece.shape[0].length; pc++) {
            if (piece.shape[pr][pc]) {
              const br = target.r + pr;
              const bc = target.c + pc;
              if (br < 8 && bc < 8) {
                const cellEl = document.querySelector(\`.blast-cell[data-r="\${br}"][data-c="\${bc}"]\`);
                if (cellEl) {
                  cellEl.classList.add(valid ? 'hover-preview' : 'hover-invalid');
                }
              }
            }
          }
        }
      }

      function populateGhost(shape) {
        const ghost = document.getElementById('blastDragGhost');
        if (!ghost) return;
        ghost.innerHTML = '';
        const mini = document.createElement('div');
        mini.className = 'mini-grid';
        mini.style.gridTemplateRows = \`repeat(\${shape.length}, 32px)\`;
        mini.style.gridTemplateColumns = \`repeat(\${shape[0].length}, 32px)\`;

        shape.forEach(row => {
          row.forEach(val => {
            const mc = document.createElement('div');
            mc.className = 'mini-cell' + (val ? ' on' : '');
            mini.appendChild(mc);
          });
        });
        ghost.appendChild(mini);
      }

      function placePieceAt(pieceIdx, r, c) {
        const piece = rackPieces[pieceIdx];
        if (!piece || piece.used) return false;

        if (canPlace(piece.shape, r, c)) {
          // Place piece
          for (let pr = 0; pr < piece.shape.length; pr++) {
            for (let pc = 0; pc < piece.shape[0].length; pc++) {
              if (piece.shape[pr][pc]) {
                board[r + pr][c + pc] = 1;
                score += 10;
              }
            }
          }
          piece.used = true;
          selectedPieceIdx = null;

          playTone(520, 'triangle', 0.12);
          if (navigator.vibrate) navigator.vibrate(25);

          // Clear lines
          clearLines();

          // Check if all 3 pieces used
          if (rackPieces.every(p => p.used)) {
            spawnRackPieces();
          } else {
            renderRack();
          }

          renderBoard();
          updateHUD();

          if (score >= 500 && !rewarded) {
            rewarded = true;
            playTone(880, 'sine', 0.4);
            const awardRes = VanviGames.awardCoins(10, 'Block Blast 500 Pts');
            updateHUD();

            VanviGames.showResultModal({
              title: '500 Points Blasted! 💥',
              score: \`\${score} Points\`,
              scoreLabel: 'Spatial Mastery',
              coinsAwarded: awardRes.awarded,
              isSuccess: true,
              restartText: 'Keep Blasting (Endless) ➔',
              onRestart: window.continueEndless
            });
          }
          return true;
        }
        return false;
      }

      function renderRack() {
        const rack = document.getElementById('piecesRack');
        rack.innerHTML = '';

        rackPieces.forEach((p, idx) => {
          const box = document.createElement('div');
          box.className = 'piece-box' + (p.used ? ' used' : '') + (selectedPieceIdx === idx ? ' selected' : '');
          box.dataset.pieceIdx = idx;
          
          if (!p.used) {
            const mini = document.createElement('div');
            mini.className = 'mini-grid';
            mini.style.gridTemplateRows = \`repeat(\${p.shape.length}, 15px)\`;
            mini.style.gridTemplateColumns = \`repeat(\${p.shape[0].length}, 15px)\`;

            p.shape.forEach(row => {
              row.forEach(val => {
                const mc = document.createElement('div');
                mc.className = 'mini-cell' + (val ? ' on' : '');
                mini.appendChild(mc);
              });
            });
            box.appendChild(mini);

            // Pointer & Touch Swipeable Drag-and-Drop
            box.addEventListener('pointerdown', (e) => {
              if (p.used) return;
              e.preventDefault();
              isDragging = true;
              draggedPieceIdx = idx;
              dragStartX = e.clientX;
              dragStartY = e.clientY;
              hasDragged = false;
              hoveredTarget = null;

              populateGhost(p.shape);
              const ghost = document.getElementById('blastDragGhost');
              if (ghost) {
                ghost.style.display = 'block';
                ghost.style.left = \`\${e.clientX}px\`;
                ghost.style.top = \`\${e.clientY - 60}px\`;
              }
              box.classList.add('dragging');
              playTone(400, 'sine', 0.06);

              function onPointerMove(moveEvent) {
                if (!isDragging) return;
                const dx = moveEvent.clientX - dragStartX;
                const dy = moveEvent.clientY - dragStartY;
                if (Math.hypot(dx, dy) > 8) hasDragged = true;

                const fingerYOffset = 60;
                const checkX = moveEvent.clientX;
                const checkY = moveEvent.clientY - fingerYOffset;

                if (ghost) {
                  ghost.style.left = \`\${checkX}px\`;
                  ghost.style.top = \`\${checkY}px\`;
                }

                hoveredTarget = getCellFromPoint(checkX, checkY);
                updateDragPreview(rackPieces[draggedPieceIdx], hoveredTarget);
              }

              function onPointerUp(upEvent) {
                window.removeEventListener('pointermove', onPointerMove);
                window.removeEventListener('pointerup', onPointerUp);
                window.removeEventListener('pointercancel', onPointerUp);

                clearPreviews();
                if (ghost) ghost.style.display = 'none';
                box.classList.remove('dragging');

                if (hasDragged && hoveredTarget) {
                  const placed = placePieceAt(draggedPieceIdx, hoveredTarget.r, hoveredTarget.c);
                  if (!placed) {
                    playTone(220, 'sawtooth', 0.1);
                  }
                } else if (!hasDragged) {
                  // Fallback: tap-to-select
                  selectedPieceIdx = selectedPieceIdx === idx ? null : idx;
                  playTone(selectedPieceIdx !== null ? 500 : 350, 'sine', 0.05);
                  renderRack();
                }

                isDragging = false;
                draggedPieceIdx = null;
                hoveredTarget = null;
              }

              window.addEventListener('pointermove', onPointerMove, { passive: false });
              window.addEventListener('pointerup', onPointerUp);
              window.addEventListener('pointercancel', onPointerUp);
            });
          }
          rack.appendChild(box);
        });
      }`;

code = code.replace(targetFunctionBlock, replacementFunctionBlock);

// Replace onBoardCellClick to use placePieceAt
const oldOnBoardCellClick = `      function onBoardCellClick(r, c) {
        if (selectedPieceIdx === null) return;
        const piece = rackPieces[selectedPieceIdx];
        if (!piece || piece.used) return;

        if (canPlace(piece.shape, r, c)) {
          // Place piece
          for (let pr = 0; pr < piece.shape.length; pr++) {
            for (let pc = 0; pc < piece.shape[0].length; pc++) {
              if (piece.shape[pr][pc]) {
                board[r + pr][c + pc] = 1;
                score += 10;
              }
            }
          }
          piece.used = true;
          selectedPieceIdx = null;

          // Clear lines
          clearLines();

          // Check if all 3 pieces used
          if (rackPieces.every(p => p.used)) {
            spawnRackPieces();
          } else {
            renderRack();
          }

          renderBoard();
          updateHUD();

          if (score >= 500 && !rewarded) {
            rewarded = true;
            const awardRes = VanviGames.awardCoins(10, 'Block Blast 500 Pts');
            updateHUD();

            VanviGames.showResultModal({
              title: '500 Points Blasted! 💥',
              score: \`\${score} Points\`,
              scoreLabel: 'Spatial Mastery',
              coinsAwarded: awardRes.awarded,
              isSuccess: true,
              restartText: 'Keep Blasting (Endless) ➔',
              onRestart: window.continueEndless
            });
          }
        }
      }`;

const newOnBoardCellClick = `      function onBoardCellClick(r, c) {
        if (selectedPieceIdx === null) return;
        placePieceAt(selectedPieceIdx, r, c);
      }`;

code = code.replace(oldOnBoardCellClick, newOnBoardCellClick);

// Add row clear sparkles & sound
const oldClearLines = `        const clearedLines = rowsToClear.length + colsToClear.length;
        if (clearedLines > 0) {
          score += clearedLines * 100;
          rowsToClear.forEach(r => {
            for (let c = 0; c < 8; c++) board[r][c] = 0;
          });
          colsToClear.forEach(c => {
            for (let r = 0; r < 8; r++) board[r][c] = 0;
          });
        }`;

const newClearLines = `        const clearedLines = rowsToClear.length + colsToClear.length;
        if (clearedLines > 0) {
          score += clearedLines * 100;
          playTone(720, 'sine', 0.25);
          if (clearedLines > 1) {
            setTimeout(() => playTone(960, 'triangle', 0.3), 120);
          }
          rowsToClear.forEach(r => {
            for (let c = 0; c < 8; c++) {
              board[r][c] = 0;
              const cell = document.querySelector(\`.blast-cell[data-r="\${r}"][data-c="\${c}"]\`);
              if (cell) cell.classList.add('clearing');
            }
          });
          colsToClear.forEach(c => {
            for (let r = 0; r < 8; r++) {
              board[r][c] = 0;
              const cell = document.querySelector(\`.blast-cell[data-r="\${r}"][data-c="\${c}"]\`);
              if (cell) cell.classList.add('clearing');
            }
          });
        }`;

code = code.replace(oldClearLines, newClearLines);

fs.writeFileSync(filePath, code, 'utf8');
console.log('✅ block-blast.html successfully upgraded with swipeable drag & drop + 3D hard polish!');
