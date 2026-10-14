// Papercut Lotus - decorative behaviors with no per-event data, ported
// near-verbatim from the standalone design.html: the <deco-frame> custom
// element and the scroll-linked lotus rotation. The intro cover's
// tap-to-open is kept too, adjusted so edit mode auto-dismisses it (a host
// editing the invitation shouldn't be stuck behind a cover). The original
// inline photo-upload-to-blob-url script is dropped entirely - real photo
// handling now goes through the shared platform photo-picker, see editor.js.
(function () {
  /* Concave-cornered frame, drawn as stroked centreline paths.

     For a rect at (x,y) sized w x h with stroke thickness t and scoop s:
       o    = t / 2          half the stroke, so the band's OUTER edge
                             lands exactly on the rect
       arcR = s + o
       k    = sqrt(arcR^2 - o^2)
     Each arc's centre is the rect's corner point itself, which is what
     bends the corner inward. sweep-flag 0 is load-bearing - flipping it
     to 1 turns every corner convex. */
  var SVGNS = 'http://www.w3.org/2000/svg';

  function r2(v) { return Math.round(v * 100) / 100; }

  // One counter for every <deco-frame> on the page, so each instance's gold
  // gradient gets its own id - an SVG id has to be unique document-wide, and
  // this element can appear more than once (the two family cards, the
  // compliment card, the note card).
  var goldGradSeq = 0;

  // --gold-stops (the same light-dark-light-dark sheen the fixed edge bars
  // and the date-reveal card use, see :root in styles.css) is a CSS gradient
  // stop LIST - "colour offset%, colour offset%, ...". An SVG <stop> element
  // wants the same two pieces, just as attributes rather than one CSS value,
  // so this is a straight reformat rather than a new source of truth - three
  // places now render the identical ramp because they all point at one list.
  function goldStopEls(raw) {
    return raw.split(',').map(function (part) {
      var bits = part.trim().split(/\s+/);
      var color = bits[0], offset = bits[1] || '0%';
      if (!color) return '';
      return '<stop offset="' + offset + '" stop-color="' + color + '"/>';
    }).join('');
  }

  function scoopPath(x, y, w, h, t, s) {
    var o = t / 2;
    // Keep opposite arcs from meeting in the middle on a narrow frame.
    s = Math.max(0, Math.min(s, Math.min(w, h) / 2 - t));
    var arcR = s + o;
    var k = Math.sqrt(Math.max(0, arcR * arcR - o * o));
    function arc(ex, ey) {
      return ' A ' + r2(arcR) + ' ' + r2(arcR) + ' 0 0 0 ' + r2(ex) + ' ' + r2(ey);
    }
    return 'M ' + r2(x + k) + ' ' + r2(y + o) +
      ' H ' + r2(x + w - k) + arc(x + w - o, y + k) +
      ' V ' + r2(y + h - k) + arc(x + w - k, y + h - o) +
      ' H ' + r2(x + k) + arc(x + o, y + h - k) +
      ' V ' + r2(y + k) + arc(x + k, y + o) + ' Z';
  }

  function DecoFrame() {
    return Reflect.construct(HTMLElement, [], DecoFrame);
  }
  DecoFrame.prototype = Object.create(HTMLElement.prototype);
  DecoFrame.prototype.constructor = DecoFrame;
  Object.setPrototypeOf(DecoFrame, HTMLElement);

  DecoFrame.prototype.connectedCallback = function () {
    this.setAttribute('aria-hidden', 'true');
    if (!this._svg) {
      this._svg = document.createElementNS(SVGNS, 'svg');
      this.appendChild(this._svg);
    }
    var self = this;
    // Redraw on resize rather than scaling one viewBox: scaling is what
    // turns the corner arcs into ellipses when w and h differ.
    this._ro = new ResizeObserver(function () { self.draw(); });
    this._ro.observe(this);
    this.draw();
  };

  DecoFrame.prototype.disconnectedCallback = function () {
    if (this._ro) { this._ro.disconnect(); this._ro = null; }
  };

  DecoFrame.prototype.draw = function () {
    var cs = getComputedStyle(this);
    function num(prop, dflt) {
      var v = parseFloat(cs.getPropertyValue(prop));
      return isFinite(v) ? v : dflt;
    }
    function col(prop, dflt) {
      return cs.getPropertyValue(prop).trim() || dflt;
    }

    var dx = num('--frame-shadow-dx', 0);
    var dy = num('--frame-shadow-dy', 4);
    var blur = num('--frame-shadow-blur', 30);
    // Room for the shadow, or the filter clips it at the viewBox edge.
    var pad = blur + Math.max(Math.abs(dx), Math.abs(dy)) + 4;

    var box = this.getBoundingClientRect();
    var w = num('--frame-width', box.width);
    var h = num('--frame-height', box.height);
    if (!(w > 2 && h > 2)) return;

    var inset = num('--frame-inset', 17);
    var outerT = num('--frame-outer-thickness', 20);
    var outerS = num('--frame-outer-scoop', 46);
    var innerT = num('--frame-inner-thickness', 14);
    var innerS = num('--frame-inner-scoop', 40);
    var sq = num('--frame-square-size', 24);
    var outerC = col('--frame-outer-color', '#1C374D');
    var innerC = col('--frame-inner-color', '#448F91');
    var sqC = col('--frame-square-color', innerC);
    var fillC = col('--frame-fill', 'none');

    // Which half of the frame THIS element draws. Default 'all' is every
    // existing caller (reveal plaque, gallery frame) - one element, both
    // bands, unchanged. 'outer'/'inner' let a card use TWO <deco-frame>s
    // sharing the same box (see .card__frame--outer/--inner in styles.css)
    // with something else - .card__crown's lotus - placed between them in
    // the DOM, so it genuinely sits behind the teal band and in front of
    // the navy one, rather than only ever being able to sit in front of or
    // behind the frame as a single atomic piece.
    var layer = col('--frame-layer', 'all');
    var wantOuter = layer !== 'inner';
    var wantInner = layer !== 'outer';

    // Optional gold trim, traced on the frame's own outer edge (same x/y/w/h
    // the outer band uses) so its outer boundary lands exactly where the
    // navy's does - it reads as a slim keyline finishing that edge, not a
    // second frame outside it. Off (0) by default: only .card__frame opts in
    // (styles.css), so every other caller of this element - the reveal
    // plaque, the gallery frame - is unchanged.
    //
    // Painted with the SAME sheen the fixed edge bars and the date-reveal
    // card use (--gold-stops), not a flat gold - a plain <path stroke="#..">
    // cannot take a CSS gradient value directly, so goldStopEls turns the
    // token into real SVG <stop>s under a gradient built just below, and the
    // path references it with stroke="url(#id)" instead of a colour.
    var goldT = num('--frame-gold-thickness', 0);
    var goldStopsRaw = cs.getPropertyValue('--gold-stops').trim();
    if (goldT > 0 && !this._goldGradId) this._goldGradId = 'pc-frame-gold-' + (++goldGradSeq);

    var iw = w - inset * 2, ih = h - inset * 2;
    var out = [];
    // Kept OUT of the filtered group on purpose - see the note at the
    // innerHTML assignment below.
    var panel = '';

    // Optional panel behind everything, tracing the innermost band's
    // INSIDE edge. It has to be built as a thick centreline, not a
    // t = 0 rect: a t = 0 rect centres its corner arcs on its own
    // corners, while the band's inside edge keeps its arcs centred on
    // the band's rect corners. Those are different curves and they
    // cross, which bites a chunk out of the arc and leaks the layer
    // below through the gap.
    //   o    = bt - lap   puts the centreline on that inside edge
    //   arcR = bs + lap   keeps the arc on the same centre point
    // lap tucks the fill a pixel under the band so the shared edge
    // does not show an antialiasing seam.
    if (wantInner && fillC !== 'none') {
      var useInner = innerT > 0 && iw > innerT * 2 && ih > innerT * 2;
      var bo = useInner ? inset : 0;
      var bw = useInner ? iw : w;
      var bh = useInner ? ih : h;
      var bt = useInner ? innerT : outerT;
      var bs = useInner ? innerS : outerS;
      var lap = Math.min(1, bt);
      if (bt > 0 && bw > bt * 2 && bh > bt * 2) {
        panel = '<path d="' +
          scoopPath(bo, bo, bw, bh, (bt - lap) * 2, bs - bt + lap * 2) +
          '" fill="' + fillC + '"/>';
      }
    }

    // 1. squares tucked flush INSIDE the inner rect's corners - their
    //    own corner sits on the rect's corner, they are not centred on
    //    it. The concave scoop is what leaves them showing.
    if (wantInner && sq > 0 && iw > sq && ih > sq) {
      var sx = w - inset - sq, sy = h - inset - sq;
      out.push('<g fill="' + sqC + '">' +
        [[inset, inset], [sx, inset], [inset, sy], [sx, sy]].map(function (p) {
          return '<rect x="' + r2(p[0]) + '" y="' + r2(p[1]) +
            '" width="' + sq + '" height="' + sq + '"/>';
        }).join('') + '</g>');
    }

    // 2. inner frame
    if (wantInner && innerT > 0 && iw > innerT * 2 && ih > innerT * 2) {
      out.push('<path d="' + scoopPath(inset, inset, iw, ih, innerT, innerS) +
        '" fill="none" stroke="' + innerC + '" stroke-width="' + innerT + '"/>');
    }

    // 3. outer frame - kept as its own string rather than pushed into `out`,
    // because --frame-shadow-split (below) needs to give it a filter of its
    // own, separate from the squares + inner frame that came before it.
    var outerPath = '';
    if (wantOuter && outerT > 0 && w > outerT * 2 && h > outerT * 2) {
      outerPath = '<path d="' + scoopPath(0, 0, w, h, outerT, outerS) +
        '" fill="none" stroke="' + outerC + '" stroke-width="' + outerT + '"/>';
    }

    // 4. gold trim - painted straight after the outer band (same group, same
    // shadow treatment) so it sits on top as a keyline along that band's own
    // outer edge, thin enough to read as a finishing line rather than a
    // second band of its own. The gradient runs left-to-right (x1 0 -> x2 1,
    // objectBoundingBox is the default gradientUnits) - the same direction
    // --gold-edge runs, which is what the date-reveal card and the modal box
    // border it with, rather than --gold-edge-down's top-to-bottom (that one
    // is for the fixed edge bars, which are vertical strips).
    var goldDefs = '';
    if (wantOuter && goldT > 0 && w > goldT * 2 && h > goldT * 2) {
      goldDefs = '<defs><linearGradient id="' + this._goldGradId + '" x1="0" y1="0" x2="1" y2="0">' +
        goldStopEls(goldStopsRaw) + '</linearGradient></defs>';
      outerPath += '<path d="' + scoopPath(0, 0, w, h, goldT, outerS) +
        '" fill="none" stroke="url(#' + this._goldGradId + ')" stroke-width="' + goldT + '"/>';
    }

    // Geometry stays in plain 0..w / 0..h coordinates; the shadow room
    // comes from a negative viewBox origin instead of offsetting paths.
    var vw = w + pad * 2, vh = h + pad * 2;
    this._svg.setAttribute('viewBox', -pad + ' ' + -pad + ' ' + vw + ' ' + vh);
    this._svg.setAttribute('width', vw);
    this._svg.setAttribute('height', vh);
    this._svg.style.left = -pad + 'px';
    this._svg.style.top = -pad + 'px';
    // drop-shadow, not box-shadow: box-shadow traces the border box and
    // would draw a square shadow straight across the concave corners.
    //
    // The panel is emitted BEFORE the filtered group, not inside it.
    // drop-shadow flattens whatever it wraps into one silhouette and
    // paints the blur behind that - with an opaque panel in the group
    // there is no opening for a shadow to form in, and anything that
    // did form would be covered by the panel itself. Left outside, the
    // group is a ring with a transparent middle, so its shadow blurs
    // inward across the opening and lands on the panel underneath.
    var shadowFilter = 'filter:drop-shadow(' + dx + 'px ' + dy + 'px ' +
      blur + 'px ' + col('--frame-shadow-color', 'rgba(0, 0, 0, 0.75)') + ')';

    // --frame-shadow-split opts a caller OUT of that combined-ring shadow and
    // INTO two separate ones: squares + inner frame filtered on their own,
    // then the outer frame filtered separately again and painted after (so
    // paint order, and the finished look, is unchanged - the outer band still
    // sits visually on top). Both groups use the SAME --frame-shadow-* knobs,
    // so this is not two different shadows, it is the same one shadow cast
    // TWICE - once by each band's own silhouette rather than once by the
    // whole ring's. Each layer now casts onto whatever is directly beneath
    // IT: the outer band's shadow lands on the inner band and the panel, and
    // the inner band's own shadow lands on the panel too, in its own opening.
    //
    // Off (0) by default, which is the exact prior behaviour - the branch
    // .reveal-plaque__frame still takes, and needs to: its outer and inner
    // bands are the SAME colour, and its own comment above already depends on
    // treating the two as one ring so the shadow blurs inward across the
    // window opening. Splitting them there would move that inward blur's
    // edge from the inner band's opening out to the outer band's, changing an
    // effect this property was not written to touch.
    var splitShadow = num('--frame-shadow-split', 0) > 0;

    if (splitShadow) {
      this._svg.innerHTML = goldDefs + panel +
        '<g style="' + shadowFilter + '">' + out.join('') + '</g>' +
        '<g style="' + shadowFilter + '">' + outerPath + '</g>';
    } else {
      this._svg.innerHTML = goldDefs + panel +
        '<g style="' + shadowFilter + '">' + out.join('') + outerPath + '</g>';
    }
  };

  customElements.define('deco-frame', DecoFrame);
}());

/* Anything carrying data-spin rotates with vertical scroll position; the
   value is degrees per pixel scrolled, and a negative one counter-spins
   (the two arch flowers are a mirrored pair).

   The rotation FOLLOWS the scroll rather than being pinned to it. Each element
   keeps its own current angle and eases toward the scroll's angle every frame,
   so it gathers speed as you start, trails a moment after you stop, and coasts
   to a halt wherever it happens to be. Nothing here is a physics engine - it is
   one exponential ease per frame, which is what gives weight cheaply.

   No snapping: the elements come to rest naturally rather than being pulled
   onto a grid once the page goes still. */
(function () {
  var spinners = [].slice.call(document.querySelectorAll('[data-spin]'));
  if (!spinners.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var rates = spinners.map(function (el) {
    return parseFloat(el.getAttribute('data-spin')) || 0;
  });

  // Fraction of the remaining distance closed each frame. Lower = heavier and
  // slower to catch up; higher = tighter to the scroll. 0.11 trails by roughly
  // a tenth of a second at 60fps, which reads as weight rather than as lag.
  var EASE = 0.11;
  // Below this the movement is invisible, so the loop stops rather than
  // spending frames on hundredths of a degree.
  var EPS = 0.02;

  var cur = [];
  var target = [];
  var running = false;

  function aim() {
    var y = window.scrollY;
    for (var i = 0; i < spinners.length; i++) target[i] = y * rates[i];
  }

  function frame() {
    var moving = false;
    for (var i = 0; i < spinners.length; i++) {
      var d = target[i] - cur[i];
      if (d > EPS || d < -EPS) {
        cur[i] += d * EASE;
        moving = true;
      } else {
        cur[i] = target[i];
      }
      // The `rotate` property rather than `transform`: these elements are
      // centred on their anchor with `translate` and the flower rings carry a
      // fixed stagger in `transform`. All three compose, so writing `rotate`
      // disturbs neither.
      spinners[i].style.rotate = cur[i] + 'deg';
    }
    running = moving;
    if (moving) requestAnimationFrame(frame);
  }

  function run() {
    if (!running) { running = true; requestAnimationFrame(frame); }
  }

  // Passive keeps this off the scroll path; the loop coalesces to one write per
  // frame however often scroll fires.
  addEventListener('scroll', function () { aim(); run(); }, { passive: true });

  // Start already at the scroll's angle rather than at zero: a page restored
  // part-way down would otherwise sweep the whole way round on load.
  aim();
  for (var i = 0; i < spinners.length; i++) {
    cur[i] = target[i];
    spinners[i].style.rotate = cur[i] + 'deg';
  }
}());

/* Intro cover: tap (or click) to open. */
(function () {
  var intro = document.getElementById('intro');
  if (!intro) return;

  function open() {
    if (intro.classList.contains('is-open')) return;
    intro.classList.add('is-open');
    // On the BODY, not the cover: the arch flowers are in .hero, outside .intro
    // entirely, so they cannot be reached from the cover's own class. They turn
    // upward as it lifts - see .arch-flower in styles.css.
    document.body.classList.add('is-opened');
    document.documentElement.style.overflow = '';
    intro.setAttribute('aria-hidden', 'true');
  }

  // A host editing the invitation shouldn't be stuck behind a "tap to open"
  // cover while every other scene is what they're there to edit - but neither
  // should the cover be swept off screen, because the opening invocation, its
  // symbol and the note all live ON it and are among the things being edited.
  // So in edit mode we do NOT open it: editor.css drops it out of `fixed` and
  // lays it out as an ordinary panel in the page, reachable by scrolling.
  // No click listener either, so a stray click can't slide it away mid-edit.
  var PC = window.Papercut;
  if (PC && PC.mode === 'edit') return;

  // Lock scrolling from script, not markup: if JS never runs the page
  // is still usable rather than frozen behind an undismissable cover.
  document.documentElement.style.overflow = 'hidden';

  // The button is the target, not the whole panel - a guest who taps
  // anywhere on the cover to see if it moves should not have it slide away
  // on them; "Tap to open" says what it does because it is the one thing
  // that does it.
  var openBtn = intro.querySelector('.intro__open');
  if (openBtn) openBtn.addEventListener('click', open);
}());

/* Ceremony carousel - the track slides, so the focused card moves aside and
   its neighbour comes in. Skipped in edit mode: there the host edits every
   card in place (styles.css wraps them into rows rather than windowing three
   of them), so cloning them would duplicate the [data-edit] fields and a
   track transform would fight the layout (see styles.css's is-editing rules).
   Mobile keeps the script running but the CSS stacks the cards and hides the
   clones. Must stay in sync with the transition on .carousel__track. */
(function () {
  var PC = window.Papercut;
  if (PC && PC.mode === 'edit') return;

  var SLIDE_MS = 550;
  var track = document.querySelector('.carousel__track');
  if (!track) return;
  var viewport = track.parentElement;
  var dotsWrap = document.querySelector('.carousel__dots');

  var cards = [], n = 0, index = 0, busy = false, timer;

  function place(animate) {
    if (!cards.length) return;
    if (!animate) track.style.transition = 'none';

    var card = cards[index];
    // Measure rather than multiply a card width by an index: this stays
    // correct whatever the gap and clamp() resolve to.
    var x = viewport.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);
    track.style.transform = 'translateX(' + x + 'px)';

    cards.forEach(function (c, i) { c.classList.toggle('is-active', i === index); });
    syncDots();

    if (!animate) {
      void track.offsetWidth;      // commit before re-arming
      track.style.transition = '';
    }
  }

  function go(by) {
    if (busy || !cards.length) return;
    busy = true;
    index += by;
    place(true);

    // A timer rather than transitionend: with reduced motion the transition
    // is off and transitionend would never fire, leaving the carousel stuck.
    clearTimeout(timer);
    timer = setTimeout(function () {
      busy = false;
      if (index < n) { index += n; place(false); }
      else if (index >= n * 2) { index -= n; place(false); }
    }, SLIDE_MS + 40);
  }

  // A dot jumps straight to its ceremony rather than stepping there one card
  // at a time. Landing directly in the MIDDLE clone set (n + i, already inside
  // the [n, 2n) range go() keeps things in) means there is no wrap to correct
  // afterwards, unlike go() which can walk off either end of that range.
  function gotoReal(i) {
    if (busy || !cards.length || i === index - n) return;
    busy = true;
    index = n + i;
    place(true);
    clearTimeout(timer);
    timer = setTimeout(function () { busy = false; }, SLIDE_MS + 40);
  }

  // One dot per real ceremony (never per clone). Rebuilt whenever build() runs,
  // since the host can enable/disable ceremonies while the invitation is open.
  // Skipped entirely at n <= 1 - a single dot points at nothing to jump BETWEEN.
  function renderDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    dotsWrap.hidden = n <= 1;
    if (n <= 1) return;

    for (var i = 0; i < n; i++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel__dot';
      dot.setAttribute('aria-label', 'Go to ceremony ' + (i + 1) + ' of ' + n);
      (function (idx) { dot.addEventListener('click', function () { gotoReal(idx); }); }(i));
      dotsWrap.appendChild(dot);
    }
    syncDots();
  }

  // index is always inside SOME multiple of n once settled (go()'s own timer
  // guarantees [n, 2n) at rest, but this runs mid-slide too) - the double
  // modulo normalises either a negative or an over-range value to [0, n).
  function syncDots() {
    if (!dotsWrap || n <= 1) return;
    var real = ((index % n) + n) % n;
    var dots = dotsWrap.children;
    for (var i = 0; i < dots.length; i++) {
      var on = i === real;
      dots[i].classList.toggle('is-active', on);
      if (on) dots[i].setAttribute('aria-current', 'true');
      else dots[i].removeAttribute('aria-current');
    }
  }

  // (Re)build against the current originals - render.js populates the track
  // after this script parses and may repopulate it later. A full set of clones
  // either side means a slide never runs out of cards to reveal; after each
  // move the index rewinds into the middle set with the transition off, which
  // is invisible because the clone it lands on is identical to the card left.
  function build() {
    Array.prototype.slice.call(track.querySelectorAll('.ceremony--clone'))
      .forEach(function (c) { c.parentNode.removeChild(c); });

    var originals = Array.prototype.slice.call(track.children);
    n = originals.length;
    renderDots();
    if (!n) { cards = []; return; }

    function clone(c) {
      var copy = c.cloneNode(true);
      copy.classList.add('ceremony--clone');
      copy.setAttribute('aria-hidden', 'true');
      return copy;
    }
    originals.forEach(function (c) { track.appendChild(clone(c)); });
    originals.slice().reverse().forEach(function (c) {
      track.insertBefore(clone(c), track.firstChild);
    });

    cards = Array.prototype.slice.call(track.children);
    // The FIRST card of the middle set, so the carousel opens on the first
    // ceremony. This was n + 1, which with the original three landed on the
    // middle one and read as deliberate centring; with the full six rites in
    // date order it just opened on the second and looked like the first had
    // been skipped.
    index = n;
    busy = false;
    place(false);
  }

  var prev = document.querySelector('.carousel__nav--prev');
  var next = document.querySelector('.carousel__nav--next');
  if (prev) prev.addEventListener('click', function () { go(-1); });
  if (next) next.addEventListener('click', function () { go(1); });

  addEventListener('resize', function () { place(false); });
  document.addEventListener('papercut:ceremonies-rendered', build);

  build();
}());

/* Gallery pagers (photos + notes): one frame per view. A beaded pull cord hangs
   in each frame's top opening - drag it down (or tap) to advance to the NEXT
   image/note, wrapping around; the rope stretches while dragging and springs
   back on release. Side arrows step through too, and a note below tells the
   visitor to pull. Runs in every mode; rebuilt on re-render (add/remove). */
(function () {
  var PC = window.Papercut;
  var api = {};

  // Wire a pager's cord: drag past a small threshold (or tap/keyboard) → onPull.
  function wirePull(pager, onPull) {
    var pull = pager.querySelector('.gallery__pull');
    if (!pull) return;
    var knob = pull.querySelector('.gallery__pull-knob');
    if (!knob) return;

    // THRESHOLD used to sit 4px under the old MAX (90) so the last stretch of
    // travel was "commit" room past the trigger point. Scaled down with MAX
    // to keep that same relationship - a THRESHOLD at or above MAX would make
    // onPull unreachable, since dy is clamped to MAX before the >= check.
    var REST = 6, MAX = 45, THRESHOLD = 41;
    var dragging = false, startY = 0, moved = false;
    function setPull(px) { pull.style.setProperty('--pull', px + 'px'); }

    knob.addEventListener('pointerdown', function (e) {
      dragging = true; moved = false; startY = e.clientY;
      pull.classList.add('is-dragging');
      if (knob.setPointerCapture && e.pointerId != null) {
        try { knob.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
      }
    });
    knob.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dy = Math.max(0, Math.min(MAX, e.clientY - startY));
      if (dy > 3) moved = true;
      setPull(REST + dy);
      e.preventDefault();
    });
    function end(e) {
      if (!dragging) return;
      dragging = false;
      pull.classList.remove('is-dragging');
      var dy = Math.max(0, Math.min(MAX, e.clientY - startY));
      setPull(REST);            // rope springs back
      if (dy >= THRESHOLD) onPull();
    }
    knob.addEventListener('pointerup', end);
    knob.addEventListener('pointercancel', end);

    knob.setAttribute('tabindex', '0');
    knob.setAttribute('role', 'button');
    knob.setAttribute('aria-label', 'Pull to see the next');
    knob.addEventListener('click', function () { if (!moved) onPull(); });
    knob.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPull(); }
    });
  }

  function initPager(pager) {
    var kind = pager.getAttribute('data-gallery');
    var slot = pager.querySelector('.frame__slot');   // the fixed, clipped opening
    var reel = pager.querySelector('.frame__reel');    // the row that slides inside it
    if (!slot || !reel) return;
    var prev = pager.querySelector('.gallery__nav--prev');
    var next = pager.querySelector('.gallery__nav--next');
    var pull = pager.querySelector('.gallery__pull');
    var hint = pager.querySelector('.gallery__hint');
    var remove = pager.querySelector('.gallery__remove');
    var reorder = pager.querySelector('.gallery__reorder');
    var adjust = pager.querySelector('.frame__adjust');
    var index = 0;
    // Set once the guest works the gallery by any means - the cord, an arrow,
    // a keyboard. The hint has done its job at that point and repeating it
    // would just be motion on the page.
    var touched = false;

    function count() { return reel.children.length; }

    function markTouched() {
      if (touched) return;
      touched = true;
      if (pull) pull.classList.remove('gallery__pull--hint');
    }

    function update(animate) {
      var n = count();
      if (index > n - 1) index = Math.max(0, n - 1);
      if (index < 0) index = 0;
      if (!animate) reel.style.transition = 'none';
      // Slide the reel by the opening's width - the frame itself never moves.
      reel.style.transform = 'translateX(' + (-index * slot.clientWidth) + 'px)';
      if (!animate) { void reel.offsetWidth; reel.style.transition = ''; }
      // Only offer navigation (arrows, cord, note) when there's more than one.
      var many = n > 1;
      if (prev) { prev.hidden = !many; prev.disabled = index <= 0; }
      if (next) { next.hidden = !many; next.disabled = index >= n - 1; }
      if (pull) pull.hidden = !many;
      if (hint) hint.hidden = !many;
      // The single remove button targets whichever cell is currently shown.
      if (remove) remove.dataset.idx = index;
      // Same for reorder, plus each arrow goes dead at the end it cannot move
      // toward - a disabled control says "this is already first" where a live
      // one that quietly does nothing just reads as broken. render.js owns
      // whether the group is shown at all (edit mode, more than one card).
      if (reorder) {
        var rb = reorder.querySelectorAll('[data-idx]');
        for (var k = 0; k < rb.length; k++) {
          rb[k].dataset.idx = index;
          var dir = +rb[k].dataset.dir;
          rb[k].disabled = dir < 0 ? index <= 0 : index >= n - 1;
        }
      }
      // Tug the cord for a guest who has not used it yet, so it reads as the
      // control it is. Gated on `many` for the same reason the cord itself is:
      // with one slide there is nowhere to page to, and a cord that beckons
      // then does nothing is worse than a still one. Editing hosts are left
      // alone - they have arrows, and a moving rope beside a text field is a
      // distraction.
      if (pull) {
        var isGuest = !(PC && PC.mode === 'edit');
        pull.classList.toggle('gallery__pull--hint', many && isGuest && !touched);
      }
      // Photo adjust toolbar: only when editing a filled cell; retarget its idx.
      if (adjust) {
        var editing = PC && PC.mode === 'edit';
        var cur = reel.children[index];
        var filled = !!(cur && cur.querySelector('.frame__photo-view'));
        adjust.hidden = !(editing && filled);
        if (editing) {
          var ab = adjust.querySelectorAll('[data-idx]');
          for (var j = 0; j < ab.length; j++) ab[j].dataset.idx = index;
        }
      }
    }

    // The cord loops, so a pull always brings a fresh image/note into view.
    function pullNext() { markTouched(); var n = count(); if (n) { index = (index + 1) % n; update(true); } }

    if (prev) prev.addEventListener('click', function () { markTouched(); if (index > 0) { index--; update(true); } });
    if (next) next.addEventListener('click', function () { markTouched(); if (index < count() - 1) { index++; update(true); } });
    // Taking hold of the cord counts even if the guest does not pull far enough
    // to advance - they have understood what it is, which is all the hint was for.
    if (pull) pull.addEventListener('pointerdown', markTouched);
    wirePull(pager, pullNext);

    api[kind] = {
      refresh: function () { update(false); },
      goto: function (i) { index = i; update(false); },
    };
    update(false);
  }

  function initAll() {
    var pagers = document.querySelectorAll('.gallery__pager');
    for (var i = 0; i < pagers.length; i++) {
      var p = pagers[i];
      if (p._pagerInit) {
        var k = p.getAttribute('data-gallery');
        if (api[k]) api[k].refresh();
        continue;
      }
      p._pagerInit = true;
      initPager(p);
    }
  }

  // Let editor.js jump a pager to a slide after add/remove/photo.
  if (PC) PC.galleryGoto = function (kind, i) { if (api[kind]) api[kind].goto(i); };

  addEventListener('resize', function () {
    for (var k in api) if (api[k]) api[k].refresh();
  });
  document.addEventListener('papercut:gallery-rendered', initAll);

  initAll();
}());
