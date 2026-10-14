// Date-reveal section: a pile of rose petals covers the date. The user brushes
// them aside with the mouse / finger; once ~30% of the surface is uncovered,
// the remaining petals are blown away by the "wind" and the date is revealed.
(function () {
  if (window.RoseInvite && RoseInvite.mode === 'edit') return; // edit mode: date shown directly
  const stage = document.getElementById('petalStage');
  const layer = document.getElementById('petalLayer');
  const dateCard = document.getElementById('dateCard');
  const hint = document.querySelector('.date__hint');
  if (!stage || !layer || !dateCard) return;

  const PETAL_SRC = [
    'media/rose_petals/Property 1=pink1.png',
    'media/rose_petals/Property 1=pink2.png',
    'media/rose_petals/Property 1=re2.png',
    'media/rose_petals/Property 1=red1.png',
    'media/rose_petals/Property 1=red3.png',
    'media/rose_petals/Property 1=yellow.png',
  ];

  const REVEAL_TARGET = 0.25; // uncover 25% of the surface to trigger the wind
  const BRUSH_R = 62;         // radius (px) the pointer pushes petals within
  const GRID_CELL = 32;       // coverage sampling resolution (px)

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0, H = 0;
  let surface = { x: 0, y: 0, w: 0, h: 0 };
  let petals = [];
  let grid = null;
  let triggered = false;
  let pending = false;
  let enabled = false; // brushing turns on only once the petals are on screen

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];

  function place(p) {
    p.el.style.transform =
      `translate(${p.x - p.size / 2}px, ${p.y - p.size / 2}px) rotate(${p.rot}deg)`;
  }

  function addPetal(x, y, size) {
    const img = document.createElement('img');
    img.className = 'petal';
    img.src = encodeURI(pick(PETAL_SRC));
    img.alt = '';
    img.draggable = false;
    img.style.width = size + 'px';
    const p = { el: img, x, y, size, rot: rand(0, 360), r: size * 0.46 };
    place(p);
    layer.appendChild(img);
    petals.push(p);
    return p;
  }

  function build() {
    W = stage.clientWidth;
    H = stage.clientHeight;

    surface.w = Math.min(680, W * 0.86);
    surface.h = Math.min(320, H * 0.5);
    surface.x = (W - surface.w) / 2;
    surface.y = (H - surface.h) / 2;
    // Elliptical cluster: soft, rounded silhouette instead of a hard rectangle
    surface.cx = surface.x + surface.w / 2;
    surface.cy = surface.y + surface.h / 2;
    surface.a = surface.w / 2;
    surface.b = surface.h / 2;

    petals.forEach((p) => p.el.remove());
    petals = [];

    if (reduceMotion) {
      // No brushing game for reduced-motion users - just show the date.
      revealDate();
      return;
    }

    const { cx, cy, a, b } = surface;
    // normalised elliptical distance of a point from the cluster centre
    const et = (x, y) => Math.hypot((x - cx) / a, (y - cy) / b);

    // Jittered grid, but clipped to a feathered ellipse so the pile reads as an
    // organic mound: dense core, thinning ragged edge - no straight boundaries.
    const step = 28;
    for (let gy = cy - b - step; gy <= cy + b + step; gy += step) {
      for (let gx = cx - a - step; gx <= cx + a + step; gx += step) {
        const x = gx + rand(-step * 0.5, step * 0.5);
        const y = gy + rand(-step * 0.5, step * 0.5);
        const t = et(x, y);
        if (t > 1.18) continue;                       // outside the ragged edge
        if (t > 0.92 && Math.random() < (t - 0.92) / 0.30) continue; // feather
        addPetal(x, y, t < 0.72 ? rand(56, 86) : rand(34, 62));
      }
    }

    // Fill pass: small petals in the core to plug any gaps (rejection sampled)
    const fillCount = Math.round((surface.w * surface.h) / 1500);
    for (let i = 0; i < fillCount; i++) {
      let x, y, tries = 0;
      do {
        x = rand(cx - a, cx + a);
        y = rand(cy - b, cy + b);
        tries++;
      } while (tries < 12 && et(x, y) > 0.92);
      addPetal(x, y, rand(26, 44));
    }

    // A few loose petals drifting around the mound (like the mockup)
    for (let i = 0; i < 20; i++) {
      const ang = rand(0, Math.PI * 2);
      const spread = rand(1.2, 1.9);
      addPetal(cx + Math.cos(ang) * a * spread, cy + Math.sin(ang) * b * spread, rand(28, 50));
    }

    buildGrid();
    updateCoverage();
  }

  function buildGrid() {
    const cols = Math.max(1, Math.round(surface.w / GRID_CELL));
    const rows = Math.max(1, Math.round(surface.h / GRID_CELL));
    const cw = surface.w / cols;
    const ch = surface.h / rows;
    // Only sample cells that fall inside the ellipse, so coverage matches the
    // organic shape (a rectangular grid would count empty corners as "revealed")
    const cells = [];
    for (let r = 0; r < rows; r++) {
      const cy = surface.y + (r + 0.5) * ch;
      for (let c = 0; c < cols; c++) {
        const cx = surface.x + (c + 0.5) * cw;
        if (Math.hypot((cx - surface.cx) / surface.a, (cy - surface.cy) / surface.b) <= 1) {
          cells.push({ x: cx, y: cy });
        }
      }
    }
    grid = { cells, total: cells.length || 1 };
  }

  function updateCoverage() {
    if (!grid || triggered) return;
    let covered = 0;
    for (let k = 0; k < grid.cells.length; k++) {
      const cell = grid.cells[k];
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        const dx = cell.x - p.x;
        const dy = cell.y - p.y;
        if (dx * dx + dy * dy < p.r * p.r) { covered++; break; }
      }
    }
    const revealed = 1 - covered / grid.total;
    if (revealed >= REVEAL_TARGET) blowAway();
  }

  function scheduleCoverage() {
    if (pending || triggered) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; updateCoverage(); });
  }

  // --- Brushing ---------------------------------------------------------
  let down = false;

  function pointerXY(e) {
    const rect = stage.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function brush(e) {
    if (triggered) return;
    const { x, y } = pointerXY(e);
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      let dx = p.x - x;
      let dy = p.y - y;
      let d = Math.hypot(dx, dy);
      if (d < BRUSH_R) {
        if (d < 0.01) { const a = rand(0, Math.PI * 2); dx = Math.cos(a); dy = Math.sin(a); d = 1; }
        const push = BRUSH_R + 12;
        p.x = x + (dx / d) * push;
        p.y = y + (dy / d) * push;
        // keep petals loosely within the stage
        p.x = Math.max(-30, Math.min(W + 30, p.x));
        p.y = Math.max(-30, Math.min(H + 30, p.y));
        p.rot += rand(-40, 40);
        place(p);
      }
    }
    scheduleCoverage();
  }

  stage.addEventListener('pointerdown', (e) => {
    if (!enabled) return; // ignore until the petals are properly on screen
    down = true;
    brush(e);
  });
  window.addEventListener('pointermove', (e) => { if (down && enabled) brush(e); }, { passive: true });
  window.addEventListener('pointerup', () => { down = false; });
  window.addEventListener('pointercancel', () => { down = false; });

  // --- Reveal -----------------------------------------------------------
  function blowAway() {
    if (triggered) return;
    triggered = true;
    down = false;
    // Every petal is about to animate, so make sure they are promoted even if
    // this was reached without enableBrush() having run (the reduced-motion and
    // no-IntersectionObserver paths both skip it).
    layer.classList.add('petals-live');

    const cx = W / 2;
    const cy = H / 2;
    // Elliptical region (the date box) the keepers frame
    const a = surface.w * 0.5;
    const b = surface.h * 0.5;
    const ellipseR = (ang) => {
      const c = Math.cos(ang), s = Math.sin(ang);
      return (a * b) / Math.hypot(b * c, a * s);
    };

    // Keep 10–12 petals; the rest fly off the screen from every side.
    const keepCount = Math.round(rand(10, 12));
    const order = petals.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [order[i], order[j]] = [order[j], order[i]];
    }
    const keepers = order.slice(0, Math.min(keepCount, petals.length));
    const keepSet = new Set(keepers);

    petals.forEach((p, i) => {
      if (keepSet.has(i)) {
        // Settle the keepers evenly around the date, just outside its edge.
        const kPos = keepers.indexOf(i);
        const ang = (kPos / keepers.length) * Math.PI * 2 + rand(-0.22, 0.22);
        const r = ellipseR(ang) + rand(20, 52);
        const nx = cx + Math.cos(ang) * r;
        const ny = cy + Math.sin(ang) * r;
        const spin = rand(60, 240) * (Math.random() < 0.5 ? -1 : 1);
        p.el.classList.add('is-flying');
        p.el.style.transitionDelay = rand(0, 0.2) + 's';
        requestAnimationFrame(() => {
          p.el.style.transform =
            `translate(${nx - p.size / 2}px, ${ny - p.size / 2}px) rotate(${p.rot + spin}deg)`;
        });
        return;
      }

      // Everyone else flies radially outward, past the nearest edge, and fades.
      let dx = p.x - cx;
      let dy = p.y - cy;
      let ang = Math.atan2(dy, dx);
      if (Math.hypot(dx, dy) < 0.01) ang = rand(0, Math.PI * 2);
      ang += rand(-0.25, 0.25);
      const tx = Math.cos(ang);
      const ty = Math.sin(ang);
      const edgeX = tx > 0 ? (W - cx) / tx : tx < 0 ? -cx / tx : Infinity;
      const edgeY = ty > 0 ? (H - cy) / ty : ty < 0 ? -cy / ty : Infinity;
      const edge = Math.min(edgeX, edgeY);
      const target = edge + p.size + rand(60, 220); // clear off the screen
      const nx = cx + tx * target;
      const ny = cy + ty * target;
      const spin = rand(180, 640) * (Math.random() < 0.5 ? -1 : 1);

      p.el.classList.add('is-gone');
      p.el.style.transitionDelay = rand(0, 0.22) + 's';
      requestAnimationFrame(() => {
        p.el.style.transform =
          `translate(${nx - p.size / 2}px, ${ny - p.size / 2}px) rotate(${p.rot + spin}deg)`;
      });
    });

    revealDate();
    stage.style.touchAction = 'auto'; // page can scroll again
    layer.style.pointerEvents = 'none'; // petals no longer intercept input
    setTimeout(spawnDrift, 700); // a few petals keep drifting past the date

    // Give the layers back once the fly-off has finished: the slowest is
    // .is-flying at 1.7s plus up to 0.22s of stagger. Nothing moves these
    // petals again afterwards, so holding ~414 compositor layers for the rest
    // of the visit would be pure waste.
    setTimeout(() => layer.classList.remove('petals-live'), 2100);
  }

  function revealDate() {
    dateCard.classList.add('is-revealed');
    if (hint) hint.classList.add('is-hidden');
  }

  // 4–5 petals that gently drift down and sway across the revealed date
  function spawnDrift() {
    const n = Math.round(rand(4, 5));
    for (let i = 0; i < n; i++) {
      const img = document.createElement('img');
      img.className = 'petal petal--drift';
      img.src = encodeURI(pick(PETAL_SRC));
      img.alt = '';
      img.draggable = false;
      img.style.width = rand(30, 54) + 'px';
      img.style.left = rand(0.06, 0.94) * W + 'px';
      img.style.setProperty('--fall', (H + 160) + 'px');
      img.style.setProperty('--sway', rand(-80, 80) + 'px');
      img.style.setProperty('--spin', rand(160, 520) * (Math.random() < 0.5 ? -1 : 1) + 'deg');
      img.style.animationDuration = rand(11, 19) + 's';
      img.style.animationDelay = rand(0, 6) + 's';
      layer.appendChild(img);
    }
  }

  // --- Init / resize ----------------------------------------------------
  build();

  // Brushing turns on only once the petals are essentially all on screen AND
  // the user has stopped scrolling - otherwise a swipe that's scrolling INTO
  // the section would wipe the petals before they're even visible. Until then
  // the stage scrolls like the rest of the page (touch-action: auto).
  stage.style.touchAction = 'auto';

  if (!reduceMotion && 'IntersectionObserver' in window) {
    let inView = false;
    let settleTimer = null;

    function enableBrush() {
      if (enabled || triggered) return;
      enabled = true;
      stage.style.touchAction = 'none'; // now capture brush gestures
      // Promote the petals only now - see .petals-live in styles.css.
      layer.classList.add('petals-live');
    }
    function disableBrush() {
      enabled = false;
      down = false;
      stage.style.touchAction = 'auto';
      // Scrolling away mid blow-away must not strip the promotion out from
      // under that animation; blowAway() owns the class once it has started
      // and clears it on its own timer.
      if (!triggered) layer.classList.remove('petals-live');
    }
    // Enable a short moment after scrolling settles, so an in-flight scroll
    // gesture is never treated as a brush.
    function scheduleEnable() {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => { if (inView) enableBrush(); }, 400);
    }

    const io = new IntersectionObserver((entries) => {
      inView = entries[0].intersectionRatio >= 0.9; // petals fully on screen
      if (!inView) disableBrush();
      else scheduleEnable();
    }, { threshold: [0, 0.5, 0.9, 1] });
    io.observe(stage);

    // Keep pushing the enable moment while the page is still scrolling.
    window.addEventListener('scroll', () => {
      if (enabled || triggered || !inView) return;
      scheduleEnable();
    }, { passive: true });
  } else {
    // No IntersectionObserver: brushing is live from the start, so the petals
    // are movable from the start and need the promotion straight away.
    enabled = true;
    stage.style.touchAction = 'none';
    layer.classList.add('petals-live');
  }

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (triggered) return; // don't rebuild mid/after reveal
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });
})();
