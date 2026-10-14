// Welcome screen: the invitation OPENS ON A TAP OR A SCROLL. The cover sheet -
// the opening invocation and greeting - slides up out of the viewport behind
// the side florals, so the branches stay put while the sheet passes behind them,
// uncovering the couple's names on a backdrop that stays and zooms. One-shot
// CSS class toggle, not an animation scrubbed to the scroll position.
//
// This replaces the old three-stage scroll scrub (blessing → greeting → names).
// Because the opening is now a gesture, the page is held still until one has
// been made - a scroll included, which opens the sheet with its first tick
// rather than dragging the page out from under an unopened one.
(function () {
  if (window.RoseInvite && RoseInvite.mode === 'edit') return; // edit mode: static layout
  const screen = document.querySelector('.screen--welcome');
  const cover = document.getElementById('coverSheet');
  if (!screen || !cover) return;

  const bg = screen.querySelector('.screen__bg');

  const BG_SHIFT = 15;     // max px the background drifts with the mouse
  const P_EASE = 0.06;     // parallax easing fallback (when GSAP is absent)

  const parallax = { x: 0, y: 0 };  // eased mouse offset (-1 … 1)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Drive only translate; the scale (overscan + open zoom) lives in CSS so it
  // can transition independently of the mouse parallax.
  function applyBg() {
    bg.style.translate =
      `${(-parallax.x * BG_SHIFT).toFixed(2)}px ${(-parallax.y * BG_SHIFT).toFixed(2)}px`;
  }

  // --- Scroll lock, held until the sheet opens ------------------------------
  // Belt and braces, because the two kinds of scrolling need different holds:
  // the class stops native scrolling (all that reduced-motion visitors have,
  // since smooth.js bails for them), and lenis.stop() stops the virtualised
  // kind, which ignores overflow. smooth.js runs after this file but before
  // DOMContentLoaded, so that is the earliest window.__lenis exists.
  const root = document.documentElement;
  root.classList.add('cover-locked');
  // A reload would otherwise restore the previous scroll position underneath a
  // locked, unopened sheet.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  let opened = false;

  document.addEventListener('DOMContentLoaded', () => {
    if (!opened && window.__lenis) window.__lenis.stop();
  });

  function open() {
    if (opened) return;
    opened = true;

    root.classList.remove('cover-locked');
    if (window.__lenis) window.__lenis.start();
    screen.classList.add('is-open');

    cover.removeEventListener('click', open);
    window.removeEventListener('wheel', open);
    window.removeEventListener('touchmove', open);
    window.removeEventListener('keydown', openOnKey);
  }

  // Two ways through, both landing on the same one-shot open().
  //
  // TAP ANYWHERE. .cover is a transparent full-viewport layer (inset:0, and
  // everything painted above it - the florals at z-index 3, the bottom fade at
  // 4 - is pointer-events:none), so this one listener catches a tap on any part
  // of the screen, not just on the cue. The cue button's own click bubbles to
  // here as well, which is what covers Enter/Space while it has focus.
  //
  // SCROLL. This was deliberately removed once: the greeting is the
  // invitation's opening beat and a scroll used to skip straight past it. It is
  // back by request, and the cost is smaller than it was - the sheet still
  // plays its full slide-up either way, so a scrolling guest sees the beat
  // rather than missing it; they just do not have to find the cue to get it.
  //
  // These have to be caught as GESTURES, not as scroll events. html.cover-locked
  // is overflow:hidden and lenis is stopped, so nothing actually scrolls yet and
  // no scroll event is ever fired: wheel is mouse and trackpad, touchmove is a
  // drag on a phone, and the keys are the ones a keyboard user presses when they
  // expect the page to move. All passive - none of them cancels anything.
  const SCROLL_KEYS = [' ', 'Spacebar', 'PageDown', 'ArrowDown', 'End'];
  function openOnKey(e) {
    if (SCROLL_KEYS.indexOf(e.key) !== -1) open();
  }

  cover.addEventListener('click', open);
  window.addEventListener('wheel', open, { passive: true });
  window.addEventListener('touchmove', open, { passive: true });
  window.addEventListener('keydown', openOnKey);

  // --- Smooth mouse parallax on the background (florals stay put → depth) ---
  // GSAP quickTo gives buttery easing; fall back to a manual lerp if absent.
  let setX, setY;
  if (window.gsap) {
    const cfg = { duration: 0.9, ease: 'power3.out', onUpdate: applyBg };
    setX = window.gsap.quickTo(parallax, 'x', cfg);
    setY = window.gsap.quickTo(parallax, 'y', cfg);
  } else {
    let tx = 0, ty = 0, raf = null;
    const loop = () => {
      parallax.x += (tx - parallax.x) * P_EASE;
      parallax.y += (ty - parallax.y) * P_EASE;
      applyBg();
      if (Math.abs(tx - parallax.x) > 0.0005 || Math.abs(ty - parallax.y) > 0.0005) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    };
    setX = (v) => { tx = v; if (!raf) raf = requestAnimationFrame(loop); };
    setY = (v) => { ty = v; };
  }

  if (!reduceMotion) {
    screen.addEventListener('mousemove', (e) => {
      const r = screen.getBoundingClientRect();
      setX(((e.clientX - r.left) / r.width - 0.5) * 2);
      setY(((e.clientY - r.top) / r.height - 0.5) * 2);
    });
    screen.addEventListener('mouseleave', () => {
      setX(0);
      setY(0);
    });
  }

  applyBg();  // set the initial background transform
})();

// Family, compliment and note cards: rise & fade with a staggered inner reveal
// as each scrolls in. All three share the CSS, so they share the observer too -
// it only ever adds .is-visible, and the stylesheet decides what that means.
(function () {
  if (window.RoseInvite && RoseInvite.mode === 'edit') return; // edit mode: cards always visible
  const cards = document.querySelectorAll('.invite--detail, .compliment-card, .notes-card');
  if (!cards.length) return;

  // Fallback: no IntersectionObserver support → just show everything.
  if (!('IntersectionObserver' in window)) {
    cards.forEach((c) => c.classList.add('is-visible'));
    return;
  }

  // Only NOW do the compliment/note cards get their hidden start state. Every
  // return above this line leaves them plainly visible instead of stranded at
  // opacity 0 with nothing coming to reveal them. The family cards do not use
  // this flag - they hide unconditionally and rely on editor.css to show them
  // in edit mode, which is the behaviour they already had.
  document.documentElement.classList.add('has-reveal');

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target); // reveal once, then stop watching
        }
      });
    },
    { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
  );

  cards.forEach((card) => io.observe(card));
})();

// Fountain video: loaded and started only once its scene nears the viewport -
// `data-src` (not `src`) on the <video> keeps the browser from fetching the
// 1.8MB file at all until then, so a guest who never scrolls this far never
// downloads it.
(function () {
  const video = document.getElementById('fountainVideo');
  if (!video) return;
  const src = video.dataset.src;
  if (!src) return;

  function load() {
    video.src = src;
    video.load();
    video.play().catch(() => { /* autoplay may be blocked until a gesture; loop/muted retries are unnecessary here - the scroll that brought this into view already counts as one */ });
  }

  if (!('IntersectionObserver' in window)) {
    load();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          load();
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '600px 0px' } // start loading well before it scrolls into view
  );
  io.observe(video);
})();
