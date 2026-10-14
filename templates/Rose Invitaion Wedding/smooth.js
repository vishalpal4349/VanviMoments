// Global smooth scrolling for the whole invitation (Lenis), synced with GSAP
// ScrollTrigger so the reveals/scrubs stay in step. Degrades to native scroll
// if Lenis isn't available or the user prefers reduced motion.
(function () {
  if (window.RoseInvite && RoseInvite.mode === 'edit') return; // native scroll while editing
  if (typeof Lenis === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lenis = new Lenis({
    duration: 1.15,               // higher = slower, more glide
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth ease-out
    smoothWheel: true,
  });
  window.__lenis = lenis;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (gsap && ScrollTrigger) {
    // Drive Lenis from GSAP's ticker and keep ScrollTrigger updated.
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    // Standalone smooth scroll if GSAP isn't present.
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
})();
