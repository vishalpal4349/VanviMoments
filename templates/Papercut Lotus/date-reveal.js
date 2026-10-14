// Papercut - the date reveal mechanism.
//
// Three paper dials behind cut windows. Blank until the guest presses the
// button, then they roll and settle on the wedding date while the host's
// flower turns once around its own centre.
//
// Self-contained by design: it reads PC.config, owns the .reveal-* namespace,
// and no other section's script knows it exists.
//
// The date comes from cfg.eventISO - the machine value the editor's date
// picker writes (see editor.js applyISO) - so the plaque and this mechanism
// can never disagree about the day. The display fields (eventDay/Month/Year)
// are only a fallback for a config saved before eventISO existed.
(function () {
  var PC = window.Papercut;
  if (!PC) return;

  var section = document.getElementById('pcDateReveal');
  if (!section) return;

  var cfg = PC.config;
  var opts = cfg.dateReveal || {};

  // Declared before the first resolveDate() below, which reads MONTHS_LONG on
  // its fallback path - function declarations hoist, `var` initialisers do not.
  var MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  var MONTHS_LONG = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

  // The section is `hidden` in the markup and only unhidden once we know there
  // is a date to reveal - an invitation with no date should show no mechanism
  // rather than one that reveals nothing.
  var when = resolveDate();
  if (!when || opts.enabled === false) return;

  var btn = document.getElementById('pcRevealBtn');
  var after = document.getElementById('pcRevealAfter');
  var said = document.getElementById('pcRevealSaid');
  var editing = PC.mode === 'edit';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  section.hidden = false;

  // The host is shown the settled result rather than a blank card: in the
  // editor this is a thing being arranged, not a surprise being kept, and a
  // mechanism that reads empty until you press it looks broken while editing.
  if (editing) {
    settleAll(true);
    section.classList.add('is-preview');
    announce();
    if (btn) btn.disabled = true;
    // Both states at once for the host - the button, and the line that takes
    // its place - stacked by the .is-preview rule rather than overlaid.
    if (after) after.hidden = false;

    // render.js calls this after the host edits anything, so moving the date
    // moves the dials. Guest mode deliberately exposes nothing: there is no
    // handle from outside to make the date appear early.
    PC.dateReveal = {
      refresh: function () {
        var next = resolveDate();
        if (!next) return;
        when = next;
        settleAll(true);
        announce();
      },
    };
    return;
  }

  var spent = false;
  if (btn) btn.addEventListener('click', run);

  // ---- the reveal -----------------------------------------------------------

  function run() {
    // Once per visit. A refresh brings the blank card back, which is what
    // makes it a moment rather than a widget.
    if (spent) return;
    spent = true;

    section.classList.add('is-revealing');
    if (btn) {
      btn.classList.add('is-pressed');
      btn.disabled = true;
      window.setTimeout(function () { btn.classList.remove('is-pressed'); }, 180);
    }

    if (reduced) {
      // No roll. The values arrive in the same order, gently, so the sequence
      // still reads as date -> month -> year without anything travelling.
      settleAll(false);
      announce();
      window.setTimeout(function () {
        section.classList.remove('is-revealing');
        section.classList.add('is-revealed');
        showAfter();
      }, 90 + 2 * 260 + 420);
      return;
    }


    // Sequential settle: date, then month, then year. The stagger is in the
    // durations rather than in delays, so all three start together and the
    // later ones simply keep going - which is how a real set of dials behaves.
    roll('day', dayCells(), 2, 1750);
    roll('month', monthCells(), 2, 2250);
    roll('year', yearCells(), 2, 2750);

    window.setTimeout(function () {
      section.classList.remove('is-revealing');
      section.classList.add('is-revealed');
      showAfter();
      announce();
    }, 2750 + 420);
  }

  /** The line that stands in the spent button's place. */
  function showAfter() {
    if (after) after.hidden = false;
  }

  /**
   * Build one dial's strip and roll it.
   *
   * The strip is written HERE, at press time, rather than rendered into the
   * page and hidden: before the press the window genuinely contains nothing,
   * so the date cannot be read out of the DOM.
   *
   * `loops` decoy passes go in front of the real value, which is the last cell
   * - so the roll always ends on the target, however long it ran.
   */
  function roll(name, cells, loops, duration) {
    var dial = section.querySelector('[data-dial="' + name + '"]');
    if (!dial) return;
    var strip = dial.querySelector('[data-strip]');
    if (!strip) return;

    var seq = [''];                       // a blank cell to start on
    for (var l = 0; l < loops; l++) seq = seq.concat(cells.all);
    seq = seq.concat(cells.all.slice(0, cells.index + 1));

    strip.innerHTML = seq.map(function (v) {
      return '<span class="reveal-cell">' + v + '</span>';
    }).join('');

    var last = seq.length - 1;
    strip.style.transition = 'none';
    strip.style.transform = 'translateY(0)';

    // Commit the start position before arming the transition, or the browser
    // coalesces the two writes and nothing moves.
    void strip.offsetHeight;

    strip.style.transition = 'transform ' + duration + 'ms cubic-bezier(0.16, 1, 0.3, 1)';
    strip.style.transform = 'translateY(calc(' + (-last) + ' * var(--cell-h)))';

    // The tiny settle once it lands - a paper wheel does not stop dead.
    window.setTimeout(function () {
      dial.classList.add('is-set');
      window.setTimeout(function () { dial.classList.remove('is-set'); }, 420);
    }, duration);
  }

  /** Put every dial on its final value with no roll (edit mode, reduced motion). */
  function settleAll(instant) {
    [['day', dayCells()], ['month', monthCells()], ['year', yearCells()]]
      .forEach(function (pair, i) {
        var dial = section.querySelector('[data-dial="' + pair[0] + '"]');
        if (!dial) return;
        var strip = dial.querySelector('[data-strip]');
        strip.style.transition = 'none';
        strip.style.transform = 'translateY(0)';
        strip.innerHTML = '<span class="reveal-cell">' + pair[1].all[pair[1].index] + '</span>';
        if (instant) return;
        // Gentle sequential appearance, the reduced-motion path.
        dial.classList.add('is-fading');
        window.setTimeout(function () { dial.classList.add('is-shown'); }, 90 + i * 260);
      });
  }

  function announce() {
    if (!said) return;
    said.textContent = when.day + ' ' + MONTHS_LONG[when.month - 1] + ' ' + when.year;
  }

  // ---- dial contents --------------------------------------------------------

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function dayCells() {
    var all = [];
    for (var d = 1; d <= 31; d++) all.push(pad(d));
    return { all: all, index: when.day - 1 };
  }

  function monthCells() {
    return { all: MONTHS.slice(), index: when.month - 1 };
  }

  /** Years around the real one, so the wheel has somewhere to travel. */
  function yearCells() {
    var all = [];
    for (var y = when.year - 4; y <= when.year + 3; y++) all.push(String(y));
    return { all: all, index: all.indexOf(String(when.year)) };
  }

  // ---- the date -------------------------------------------------------------

  /**
   * eventISO first; the display fields only if an older config has no ISO.
   * Returns null when there is nothing usable, which keeps the whole section
   * off the page rather than showing a mechanism with nothing behind it.
   */
  function resolveDate() {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(cfg.eventISO || ''));
    if (m) {
      return { year: +m[1], month: +m[2], day: +m[3] };
    }

    var day = parseInt(String(cfg.eventDay || '').replace(/\D+/g, ''), 10);
    var year = parseInt(String(cfg.eventYear || '').replace(/\D+/g, ''), 10);
    var month = MONTHS_LONG.indexOf(String(cfg.eventMonth || '').toUpperCase()) + 1;
    if (!day || !year || !month) return null;

    return { year: year, month: month, day: day };
  }
})();
