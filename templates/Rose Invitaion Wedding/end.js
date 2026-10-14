// Closing section: smooth mouse parallax. The backdrop drifts opposite the
// cursor for a gentle 3D depth. GSAP quickTo eases it; a manual lerp is the
// fallback if GSAP isn't available - either way it glides, never jerky.
(function () {
  if (window.RoseInvite && RoseInvite.mode === 'edit') return;
  const section = document.querySelector('.scene--end');
  if (!section) return;

  const bg = section.querySelector('.end__bg');
  if (!bg) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const BG_SHIFT = 5;  // max px the backdrop moves
  const EASE = 0.06;   // fallback lerp - lower = smoother/slower follow

  const pos = { x: 0, y: 0 }; // eased offset (-1 … 1)

  function apply() {
    bg.style.transform =
      `scale(1.1) translate3d(${(-pos.x * BG_SHIFT).toFixed(2)}px, ${(-pos.y * BG_SHIFT).toFixed(2)}px, 0)`;
  }

  let setX, setY;
  if (window.gsap) {
    const cfg = { duration: 0.9, ease: 'power3.out', onUpdate: apply };
    setX = window.gsap.quickTo(pos, 'x', cfg);
    setY = window.gsap.quickTo(pos, 'y', cfg);
  } else {
    let tx = 0, ty = 0, raf = null;
    const loop = () => {
      pos.x += (tx - pos.x) * EASE;
      pos.y += (ty - pos.y) * EASE;
      apply();
      if (Math.abs(tx - pos.x) > 0.0005 || Math.abs(ty - pos.y) > 0.0005) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    };
    setX = (v) => { tx = v; if (!raf) raf = requestAnimationFrame(loop); };
    setY = (v) => { ty = v; };
  }

  section.addEventListener('mousemove', (e) => {
    const r = section.getBoundingClientRect();
    setX(((e.clientX - r.left) / r.width - 0.5) * 2);
    setY(((e.clientY - r.top) / r.height - 0.5) * 2);
  });

  section.addEventListener('mouseleave', () => {
    setX(0);
    setY(0);
  });
})();
