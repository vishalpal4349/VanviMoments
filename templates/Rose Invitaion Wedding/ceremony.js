// Ceremonies: Premium interactive stacked card deck.
// Smooth swipe mechanics, swipe arrows, indicator dots, and 3D depth layering.
(function () {
  window.initCeremonyDeck = function () {
    if (window.RoseInvite && RoseInvite.mode === 'edit') return;
    const deck = document.getElementById('ceremonyDeck');
    if (!deck) return;

    const cards = Array.from(deck.querySelectorAll('.cere-card'));
    if (!cards.length) return;

    const splash = document.getElementById('deckSplash');
    const G = window.gsap;

    // Elegant depth offsets for stacked cards - 100% solid, fully opaque
    const SLOTS = [
      { x: 0, y: 0, r: 0, s: 1, o: 1 },
      { x: 14, y: -12, r: 2.5, s: 0.96, o: 1 },
      { x: -14, y: -22, r: -2.5, s: 0.92, o: 1 },
      { x: 10, y: -30, r: 1.8, s: 0.88, o: 1 },
      { x: -8, y: -36, r: -1.2, s: 0.84, o: 1 },
      { x: 6, y: -42, r: 1.0, s: 0.80, o: 1 },
    ];
    const slotFor = (pos) => SLOTS[Math.min(pos, SLOTS.length - 1)];

    if (G) cards.forEach((c) => { c.style.transition = 'none'; });

    let order = cards.map((_, i) => i);

    // Create or find controls wrapper
    let controls = document.getElementById('deckControls');
    if (!controls) {
      controls = document.createElement('div');
      controls.id = 'deckControls';
      controls.className = 'deck-nav-controls';
      controls.innerHTML = `
        <button type="button" class="deck-nav-btn deck-prev-btn" id="deckPrevBtn" aria-label="Previous Ceremony">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div class="deck-dots-wrap" id="deckDotsWrap"></div>
        <button type="button" class="deck-nav-btn deck-next-btn" id="deckNextBtn" aria-label="Next Ceremony">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      `;
      const hint = document.querySelector('.ceremonies__hint');
      if (hint && hint.parentNode) {
        hint.parentNode.insertBefore(controls, hint.nextSibling);
      } else if (deck.parentNode) {
        deck.parentNode.appendChild(controls);
      }
    }

    // Render dots
    const dotsWrap = document.getElementById('deckDotsWrap');
    if (dotsWrap) {
      dotsWrap.innerHTML = cards.map((c, i) => `<span class="deck-dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></span>`).join('');
      dotsWrap.querySelectorAll('.deck-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
          const targetIdx = parseInt(e.target.dataset.idx, 10);
          while (order[0] !== targetIdx) {
            order.push(order.shift());
          }
          layout(true);
        });
      });
    }

    function updateDots() {
      if (!dotsWrap) return;
      const currentFront = order[0];
      dotsWrap.querySelectorAll('.deck-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentFront);
      });
    }

    function place(el, v, animate) {
      if (G) {
        const props = { x: v.x, y: v.y, rotation: v.r, scale: v.s, opacity: v.o };
        if (animate) G.to(el, Object.assign({ duration: 0.45, ease: 'power2.out', overwrite: true }, props));
        else G.set(el, props);
      } else {
        el.style.transform = `translate(${v.x}px, ${v.y}px) rotate(${v.r}deg) scale(${v.s})`;
        el.style.opacity = v.o;
      }
    }

    function updateSplash() {
      if (!splash) return;
      const src = cards[order[0]].dataset.splash;
      if (!src || splash.getAttribute('src') === src) return;
      splash.src = src;
      splash.style.animation = 'none';
      void splash.offsetWidth;
      splash.style.animation = '';
    }

    function layout(animate) {
      order.forEach((cardIdx, pos) => {
        const el = cards[cardIdx];
        el.style.zIndex = String(cards.length - pos);
        place(el, slotFor(pos), animate);
      });
      updateSplash();
      updateDots();
    }

    layout(false);

    function nextCard() {
      const frontEl = cards[order[0]];
      if (G) {
        G.to(frontEl, {
          x: 280,
          rotation: 18,
          opacity: 0,
          duration: 0.32,
          ease: 'power2.in',
          onComplete: () => {
            frontEl.style.zIndex = '0';
            order.push(order.shift());
            layout(true);
          }
        });
      } else {
        order.push(order.shift());
        layout(true);
      }
    }

    function prevCard() {
      const lastIdx = order.pop();
      order.unshift(lastIdx);
      const newFront = cards[lastIdx];
      newFront.style.zIndex = String(cards.length + 1);
      if (G) {
        G.fromTo(newFront, 
          { x: -280, rotation: -18, opacity: 0 },
          { x: 0, rotation: 0, opacity: 1, duration: 0.4, ease: 'power2.out', onComplete: () => layout(false) }
        );
      } else {
        layout(true);
      }
    }

    const prevBtn = document.getElementById('deckPrevBtn');
    const nextBtn = document.getElementById('deckNextBtn');
    if (prevBtn) prevBtn.onclick = (e) => { e.preventDefault(); prevCard(); };
    if (nextBtn) nextBtn.onclick = (e) => { e.preventDefault(); nextCard(); };

    // Touch & Mouse Pointer Swiping
    const THRESHOLD = 50; // Responsive threshold for phones
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let dx = 0;
    let currentCard = null;

    deck.onpointerdown = (e) => {
      currentCard = cards[order[0]];
      if (!currentCard.contains(e.target) && e.target !== currentCard) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      dx = 0;
      if (G) G.killTweensOf(currentCard);
      currentCard.classList.add('is-dragging');
      try { currentCard.setPointerCapture(e.pointerId); } catch(_) {}
    };

    deck.onpointermove = (e) => {
      if (!dragging || !currentCard) return;
      dx = e.clientX - startX;
      const dy = (e.clientY - startY) * 0.2;
      if (G) {
        G.set(currentCard, { x: dx, y: dy, rotation: dx * 0.05 });
      } else {
        currentCard.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.05}deg)`;
      }
    };

    function handleDragEnd(e) {
      if (!dragging || !currentCard) return;
      dragging = false;
      currentCard.classList.remove('is-dragging');
      try { currentCard.releasePointerCapture(e.pointerId); } catch (_) {}

      if (dx > THRESHOLD) {
        nextCard();
      } else if (dx < -THRESHOLD) {
        nextCard();
      } else {
        place(currentCard, slotFor(0), true);
      }
      currentCard = null;
    }

    deck.onpointerup = handleDragEnd;
    deck.onpointercancel = handleDragEnd;
  };

  // Run on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initCeremonyDeck);
  } else {
    window.initCeremonyDeck();
  }
})();
