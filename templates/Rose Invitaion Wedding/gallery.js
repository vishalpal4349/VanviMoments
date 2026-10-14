// Photo gallery: polaroids hang from a rope. Scrolling / dragging horizontally
// moves the rope, and each polaroid swings like a pendulum with its own length,
// stiffness and damping - so they sway back and forth out of sync (gravity feel).
(function () {
  if (window.RoseInvite && RoseInvite.mode === 'edit') return; // edit mode: no swing/drag physics
  const scroller = document.getElementById('galleryScroll');
  if (!scroller) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Build per-card physics state. Longer rope (data-hang) → slower swing.
  const cards = Array.from(scroller.querySelectorAll('.polaroid')).map((el, i) => {
    const hang = parseFloat(el.dataset.hang) || 110;
    return {
      el,
      angle: 0,          // current tilt (deg)
      vel: 0,            // angular velocity
      stiffness: 0.02 * (130 / (hang + 90)),     // low = slow, loose pendulum
      damping: 0.93 + (i % 3) * 0.01,            // lower = more damping, settles sooner
      gain: 0.55 + ((i * 7) % 5) * 0.08,         // how strongly scroll pushes it
      idleAmp: 0.5 + (i % 2) * 0.35,             // gentle resting sway
      idleFreq: 0.4 + ((i * 3) % 4) * 0.1,
      idlePhase: i * 1.7,
    };
  });

  const MAX_ANGLE = 20;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  let lastScroll = scroller.scrollLeft;
  let vSmooth = 0;

  function frame(now) {
    const t = now / 1000;

    // scroll velocity (px/frame), smoothed
    const sl = scroller.scrollLeft;
    const raw = sl - lastScroll;
    lastScroll = sl;
    vSmooth += (raw - vSmooth) * 0.35;

    for (const c of cards) {
      // Inertia: the card lags behind the rope's motion, then springs back.
      const equil = clamp(vSmooth * 0.85 * c.gain, -MAX_ANGLE, MAX_ANGLE);
      c.vel += (equil - c.angle) * c.stiffness;
      c.vel *= c.damping;
      c.angle += c.vel;

      // A touch of perpetual idle sway so nothing ever looks frozen.
      const idle = Math.sin(t * c.idleFreq + c.idlePhase) * c.idleAmp;
      // Skip the write when the rounded value has not moved. The idle sway is
      // slow (0.4-0.7Hz), so near its turning points successive frames round to
      // the same string and the assignment would be pure cost.
      const next = `rotate(${(c.angle + idle).toFixed(3)}deg)`;
      if (next !== c.last) {
        c.el.style.transform = next;
        c.last = next;
      }
    }

    rafId = requestAnimationFrame(frame);
  }

  // --- Run the physics ONLY while the gallery is on screen -----------------
  // This loop used to be armed unconditionally at load and never stopped: a
  // layout read (scroller.scrollLeft) plus a transform write per card, every
  // frame, for the life of the page. Because the idle sway is a sin() of the
  // clock it never settles, so it kept the main thread busy at 60fps while the
  // visitor was still at the top of the page - which is what made the scroll
  // down to this section feel heavy.
  let rafId = null;
  let inView = false;

  function start() {
    if (rafId !== null || reduceMotion) return;
    // Resync before resuming: while stopped, scroll-snap or touch momentum may
    // have moved the scroller, and a stale lastScroll would read as one huge
    // velocity spike and fling every card to MAX_ANGLE on the first frame.
    lastScroll = scroller.scrollLeft;
    vSmooth = 0;
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    if (rafId === null) return;
    cancelAnimationFrame(rafId);
    rafId = null;
    // Cards keep whatever transform they last had, so nothing jumps.
  }

  // One place decides whether the loop should be running.
  function sync() {
    if (inView && !document.hidden) start();
    else stop();
  }

  if ('IntersectionObserver' in window) {
    // A generous margin so the swing is already alive by the time the section
    // is actually looked at, rather than visibly starting from dead still.
    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      sync();
    }, { rootMargin: '300px 0px' }).observe(scroller);
  } else {
    inView = true; // no observer: fall back to the old always-on behaviour
    sync();
  }

  // Nothing worth animating for a backgrounded tab.
  document.addEventListener('visibilitychange', sync);

  // --- Hide the scroll hint once the user starts scrolling --------------
  const hint = document.getElementById('galleryHint');
  if (hint) {
    const hideHint = () => {
      if (scroller.scrollLeft > 8) {
        hint.classList.add('is-hidden');
        scroller.removeEventListener('scroll', hideHint);
      }
    };
    scroller.addEventListener('scroll', hideHint, { passive: true });
  }

  // --- Drag / swipe to scroll the rope ---------------------------------
  let dragging = false;
  let startX = 0;
  let startScroll = 0;

  scroller.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return; // let touch use native momentum scroll
    dragging = true;
    startX = e.clientX;
    startScroll = scroller.scrollLeft;
    scroller.classList.add('is-dragging');
    scroller.setPointerCapture(e.pointerId);
  });

  scroller.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    scroller.scrollLeft = startScroll - (e.clientX - startX);
  });

  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    scroller.classList.remove('is-dragging');
    try { scroller.releasePointerCapture(e.pointerId); } catch (_) { /* ignore */ }
  };
  scroller.addEventListener('pointerup', endDrag);
  scroller.addEventListener('pointercancel', endDrag);
})();
