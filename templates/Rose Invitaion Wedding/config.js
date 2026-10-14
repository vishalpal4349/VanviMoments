// Invitation config - the single source of truth for everything editable.
// Loads the couple's saved edits (localStorage) over the template defaults and
// exposes shared helpers for render.js / editor.js / social.js.
//
// Modes (from the URL):
//   ?edit=1     → the couple edits the template in place
//   ?preview=1  → the couple previews the real invitation (with a return bar)
//   (nothing)   → the final invitation guests see; ?to=Guest%20Name personalizes it
(function () {
  const params = new URLSearchParams(location.search);
  const mode = params.has('edit') ? 'edit' : params.has('preview') ? 'preview' : 'view';

  // Trial (?trial=1) - the "try before you buy" sandbox on the marketplace.
  // The shopper gets the REAL editor so they can feel how editing works, but
  // only the opening card is unlocked (the invocation, the line under it, and
  // the couple's names). Everything past the names is visible and locked:
  // enough to prove the experience, not enough to walk away with a finished
  // invitation.
  //
  // TRIAL_EDITABLE is the whole allowlist; render.js is the single place that
  // grants editability, so it is the only thing that needs to consult it.
  const trial = params.has('trial');
  const TRIAL_EDITABLE = [
    'invocation.religion',
    'invocation.script',
    // The line under the invocation. It only became editable at all after this
    // list was written, so it sat locked in the trial while the rest of the
    // opening card was open - the papercut templates already list it.
    'introNote',
    'bride',
    'groom',
  ];

  // The trial gets its OWN storage key. It still needs to persist, because
  // tapping Preview navigates the page (?edit=1 → ?preview=1) and the config is
  // re-read on load - without it the shopper's edits would vanish exactly when
  // they went to look at them. But it must not write to the real key, or a
  // shopper's trial edits would bleed into the marketplace preview everyone
  // else sees.
  const STORAGE_KEY = trial ? 'roseInviteTrialConfig' : 'roseInviteConfig';

  // The commerce params (?buy= checkout URL and the plan pricing) belong to the
  // shared platform toolbar now - it parses and sanitises them itself (see
  // /templates/_platform/toolbar.js). The template no longer touches them.

  // Ceremony catalog: the artwork for each type, and the DEFAULT name for it.
  // The couple chooses which ceremonies to include, edits date/time/venue, and
  // may rename any of them - see ceremonyName below. The id keeps selecting the
  // artwork and stays the RSVP key, so a rename can never orphan a reply that
  // has already come in against that ceremony.
  const CEREMONY_CATALOG = {
    ring: { name: 'Ring Ceremony', art: 'media/ringceremony.webp', splash: 'media/sangeet_splash.webp' },
    mehendi: { name: 'Mehendi', art: 'media/mehendi.webp', splash: 'media/mehendi_splash.webp' },
    haldi: { name: 'Haldi', art: 'media/Haldi.webp', splash: 'media/haldi_splash.webp' },
    sangeet: { name: 'Sangeet', art: 'media/sangeet.webp', splash: 'media/sangeet_splash.webp' },
    vivaah: { name: 'Vivaah', art: 'media/vivah.webp', splash: 'media/Varmala_splash.webp' },
    reception: { name: 'Reception', art: 'media/reception.webp', splash: 'media/reception_splash.webp' },
  };

  /**
   * What to call a ceremony: the couple's own name for it once they have typed
   * one, else the catalog default. Everything that shows a ceremony name goes
   * through here - the deck card, the RSVP date cards, the calendar popup and
   * the platform RSVP event list - so a rename reaches all of them at once.
   *
   * Clearing the field is therefore also how a host resets one: an empty name
   * falls back to the default rather than leaving an untitled card.
   */
  function ceremonyName(c) {
    const own = ((c && c.name) || '').trim();
    return own || ((CEREMONY_CATALOG[c && c.id] || {}).name) || '';
  }

  // Opening symbols - add new artwork here and it appears in the editor's picker.
  // Opening-invocation symbols - shared artwork under /templates/symbols/. The
  // host picks one from the invocation popover; add a file here and it appears
  // in the picker. Paths are relative to this template folder (../symbols/…).
  const SYMBOLS = [
    { id: 'ganesha', label: 'Ganesha', src: 'symbols/_ganesha.svg' },
    { id: 'buddha', label: 'Buddha', src: 'symbols/_buddha.svg' },
    { id: 'sindhi', label: 'Jhulelal', src: 'symbols/_sindhi.svg' },
    { id: 'sikh', label: 'Ik Onkar', src: 'symbols/_sikh.svg' },
    { id: 'jain', label: 'Ahimsa symbol', src: 'symbols/_jain.svg' },
    { id: 'buddhist', label: 'Dharma wheel', src: 'symbols/_buddhist.svg' },
    { id: 'parsi', label: 'Faravahar', src: 'symbols/_parsi.svg' },
    { id: 'christian', label: 'Cross', src: 'symbols/_christian.svg' },
    { id: 'none', label: 'None', src: '' },
  ];

  // Opening invocations, keyed by religion/tradition. Each carries an English
  // transliteration and - where the tradition has one - its native-script line
  // in one or more scripts. `font` MUST be a face that covers the script's
  // glyphs (loaded from Google Fonts in index.html); `rtl` flips direction.
  // Both the editor dropdown and render.js read this table, so the final card
  // only needs to store { religion, script } (see invocationLines()).
  const INVOCATIONS = {
    hindu: {
      label: 'Hindu',
      english: 'Shri Ganeshaya Namah',
      scripts: {
        devanagari: { label: 'Devanagari (Hindi/Marathi/Sanskrit/Nepali)', text: 'श्री गणेशाय नमः', font: 'Tiro Devanagari Sanskrit' },
        bengali: { label: 'Bengali', text: 'শ্রী গণেশায় নমঃ', font: 'Noto Sans Bengali' },
        gujarati: { label: 'Gujarati', text: 'શ્રી ગણેશાય નમઃ', font: 'Noto Sans Gujarati' },
        gurmukhi: { label: 'Gurmukhi (Punjabi)', text: 'ਸ਼੍ਰੀ ਗਣੇਸ਼ਾਯ ਨਮਃ', font: 'Noto Sans Gurmukhi' },
        odia: { label: 'Odia', text: 'ଶ୍ରୀ ଗଣେଶାୟ ନମଃ', font: 'Noto Sans Oriya' },
        tamil: { label: 'Tamil', text: 'ஸ்ரீ கணேசாய நமஹ', font: 'Noto Sans Tamil' },
        telugu: { label: 'Telugu', text: 'శ్రీ గణేశాయ నమః', font: 'Noto Sans Telugu' },
        kannada: { label: 'Kannada', text: 'ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ', font: 'Noto Sans Kannada' },
        malayalam: { label: 'Malayalam', text: 'ശ്രീ ഗണേശായ നമഃ', font: 'Noto Sans Malayalam' },
      },
    },
    sikh: {
      label: 'Sikh',
      english: 'Ik Onkar, Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh',
      scripts: {
        gurmukhi: { label: 'Gurmukhi', text: 'ੴ ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖ਼ਾਲਸਾ, ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ', font: 'Noto Sans Gurmukhi' },
      },
    },
    sindhi: {
      label: 'Sindhi',
      english: 'Jay Jhulelal',
      scripts: {
        devanagari: { label: 'Devanagari', text: 'जय झूलेलाल', font: 'Tiro Devanagari Sanskrit' },
        sindhi: { label: 'Sindhi', text: 'جھولےلال جي', font: 'Noto Naskh Arabic', rtl: true },
      },
    },
    jain: {
      label: 'Jain',
      english: 'Namo Arihantanam',
      scripts: {
        devanagari: { label: 'Devanagari', text: 'णमो अरिहंताणं', font: 'Tiro Devanagari Sanskrit' },
      },
    },
    buddhist: {
      label: 'Buddhist',
      english: 'Buddham Sharanam Gachhami',
      scripts: {
        devanagari: { label: 'Devanagari', text: 'बुद्धं शरणं गच्छामि', font: 'Tiro Devanagari Sanskrit' },
      },
    },
    christian: {
      label: 'Christian',
      english: 'In the name of the Father, the Son, and the Holy Spirit',
      scripts: {},
    },
    muslim: {
      label: 'Muslim',
      english: 'Bismillah ir-Rahman ir-Raheem',
      scripts: {
        // The Basmala, fully vowelled. Noto Naskh Arabic is already loaded for
        // the Sindhi line above and carries the tashkeel and the dagger alif in
        // ٱللَّٰه, so no new font is needed; rtl flips the line the same way.
        arabic: { label: 'Arabic', text: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', font: 'Noto Naskh Arabic', rtl: true },
      },
    },
    parsi: {
      label: 'Parsi',
      english: 'Blessings of Ahura Mazda',
      scripts: {
        gujarati: { label: 'Gujarati', text: 'અહુરા મઝદાના આશીર્વાદ', font: 'Noto Sans Gujarati' },
      },
    },
    none: {
      label: 'No invocation',
      english: 'With gratitude and joy, we begin…',
      scripts: {},
    },
  };

  // ---- Default wedding date -----------------------------------------------
  // A brand-new invitation (no saved config yet) used to open on a fixed,
  // eventually-past date (14 Dec 2025). 15 days out from whenever someone
  // actually creates the invitation reads as "soon" no matter when that is,
  // so the date scene and the ceremony schedule both look current the first
  // time a host sees them, rather than needing to be fixed by hand before
  // anything else.
  function isoDaysFromNow(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  // Shifts an already-computed yyyy-mm-dd by a number of days. Built on
  // Date.UTC/getUTC* (pure calendar-component arithmetic, no timezone
  // conversion) rather than `new Date(iso)`, which would read the bare
  // string as UTC and land a day early anywhere west of Greenwich.
  function addDaysISO(iso, days) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    d.setUTCDate(d.getUTCDate() + days);
    return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
  }

  // weddingDate IS the Vivaah ceremony's date - every other rite below is
  // scheduled relative to it, in the order the rites actually run.
  const WEDDING_ISO = isoDaysFromNow(15);

  const DEFAULTS = {
    version: 1,
    finalized: false,
    // religion + script pick the invocation text from INVOCATIONS; the English
    // transliteration and native-script line are derived (see invocationLines).
    invocation: { symbol: 'ganesha', religion: 'hindu', script: 'devanagari', custom: '' },
    // The line under the invocation on the cover. It sat in index.html as
    // static markup carrying its own <br />s until it became editable; the
    // newlines here are those same breaks and nl2br puts them back, so an
    // invitation nobody has touched still renders exactly as it always did.
    introNote: 'We cordially invite you to\ngrace the auspicious\noccasion of the marriage\nof…',
    bride: 'Divya',
    groom: 'Vivan',
    parents: {
      cards: [
        {
          enabled: true,
          name: 'Chi. Vivan Sharma',
          childLabel: 'Son of',
          parentA: 'Shri Ramesh Chandra Sharma',
          parentB: 'Smt. Sunita Sharma',
          grandLabel: 'Grandson of',
          grandA: 'Late Shri Pandit Brij Mohan Sharma',
          grandB: 'Late Smt. Kamla Devi Sharma',
          gotra: 'Bharadwaj',
        },
        {
          enabled: true,
          name: 'Sau. Ka. Divya Mehta',
          childLabel: 'Daughter of',
          parentA: 'Shri Vikram Mehta',
          parentB: 'Smt. Nandini Mehta',
          grandLabel: 'Granddaughter of',
          grandA: 'Late Shri Hari Prasad Mehta',
          grandB: 'Pushpa Devi Mehta',
          gotra: '',
        },
      ],
    },
    weddingDate: WEDDING_ISO,
    // Three of the six photo/postcard slots are marked `placeholder: true` so
    // a brand-new invitation's gallery previews as a populated strip rather
    // than three empty "+ Add photo" cards next to the two story cards -
    // renderGallery() shows "Your photo here" text for these instead of
    // hiding them the way a genuinely empty slot is hidden from guests. Text
    // rather than a stand-in image file: a CSS background-image that fails
    // to load (wrong path, blocked request, whatever) fails SILENTLY - no
    // broken-image icon - so a host would see nothing there instead of an
    // obvious placeholder. Text baked into the card can't silently fail like
    // that. The remaining three slots stay genuinely empty, same as before.
    gallery: {
      enabled: true,
      items: [
        { type: 'photo', image: '', placeholder: true, caption: '#howitstarted' },
        { type: 'postcard', image: '', placeholder: true, caption: '#adventures' },
        { type: 'story', text: 'Some stories begin with grand gestures. Ours started with a simple conversation.' },
        { type: 'photo', image: '', placeholder: true, caption: '#thelittlethings' },
        { type: 'postcard', image: '', caption: '#everyday' },
        { type: 'story', text: "Friendship grew into something more, and we realized life's best moments were the ones we shared together." },
        { type: 'photo', image: '', caption: '#foreverbegins' },
        { type: 'postcard', image: '', caption: '#usforever' },
      ],
    },
    // mapUrl: optional Google/Apple Maps share link for the venue's exact pin.
    // Left blank falls back to a text search on the venue name.
    // Dates are offsets from WEDDING_ISO (above) rather than fixed strings,
    // so the whole schedule shifts together for a brand-new invitation:
    // Vivaah lands ON that date, everything before it in the running order
    // sits on days before, Reception sits the day after. editor.js re-derives
    // these same offsets when a host changes weddingDate later, so the two
    // never drift apart.
    ceremonies: [
      { id: 'ring', enabled: true, date: addDaysISO(WEDDING_ISO, -2), time: '19:00', venue: 'Sharma Residence, Jaipur', mapUrl: '' },
      { id: 'mehendi', enabled: true, date: addDaysISO(WEDDING_ISO, -1), time: '11:00', venue: 'Sharma Residence, Jaipur', mapUrl: '' },
      { id: 'haldi', enabled: true, date: addDaysISO(WEDDING_ISO, -1), time: '16:00', venue: 'Sharma Residence, Jaipur', mapUrl: '' },
      { id: 'sangeet', enabled: true, date: addDaysISO(WEDDING_ISO, -1), time: '19:30', venue: 'The Grand Palace, Jaipur', mapUrl: '' },
      { id: 'vivaah', enabled: true, date: WEDDING_ISO, time: '20:00', venue: 'The Grand Palace, Jaipur', mapUrl: '' },
      { id: 'reception', enabled: true, date: addDaysISO(WEDDING_ISO, 1), time: '20:00', venue: 'Royal Banquet Hall, Jaipur', mapUrl: '' },
    ],
    compliments: {
      enabled: true,
      lead: 'With Best Compliments From:',
      lines: [
        'Shri Suresh Sharma & Family (Chacha-Chachi)',
        'Shri Manoj Sharma & Family (Tau-Tai)',
        'Smt. Asha Gupta & Family (Bua)',
        'Shri Rajendra Mehta & Family (Mama-Mami)',
      ],
    },
    // Free-form note card below the compliments card - a title + any extra
    // message the host wants to leave for their guests.
    notes: {
      enabled: true,
      lead: 'A Note From Us',
      text: 'We can’t wait to celebrate this special day with you. Thank you for being part of our journey.',
    },
    social: { instagram: true, instagramUrl: 'https://www.instagram.com/' },
    // Background music - plays softly on the guest-facing invitation with a
    // mute toggle top-right, and an "upload your own" control in edit mode
    // (see _platform/music.js, shared by every template). Leave src blank to
    // use the shared default track. Set enabled:false to turn the feature
    // off entirely.
    music: { enabled: true, src: '', volume: 0.5 },
  };

  // Saved values win over defaults; objects merge, arrays are taken wholesale.
  function deepMerge(base, over) {
    if (Array.isArray(base) || Array.isArray(over)) return over !== undefined ? over : base;
    if (typeof base !== 'object' || base === null) return over !== undefined ? over : base;
    if (typeof over !== 'object' || over === null) return base;
    const out = {};
    Object.keys(base).forEach((k) => { out[k] = deepMerge(base[k], over[k]); });
    Object.keys(over).forEach((k) => { if (!(k in base)) out[k] = over[k]; });
    return out;
  }

  // Trial editing persists to the SERVER (a trial_drafts row keyed by the
  // trial_token cookie), not localStorage - see TrialDraftController. The saved
  // draft is injected synchronously as window.__balconyTrial (a <script src>
  // before this file), which also carries the save endpoint + a CSRF token.
  // Non-trial standalone editing still uses localStorage (dev/preview only;
  // purchased hosts save over the platform bridge, see platform-adapter.js).
  function load() {
    if (trial) {
      const t = window.__balconyTrial;
      return deepMerge(DEFAULTS, (t && t.draft) || {});
    }
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved) return deepMerge(DEFAULTS, saved);
    } catch (_) { /* corrupt storage → fall back to the template */ }
    return deepMerge(DEFAULTS, {});
  }

  // Returns a Promise<boolean> in trial mode (server write), a boolean otherwise
  // - saveNow() normalises both, so callers can await either.
  function save() {
    if (trial) {
      const t = window.__balconyTrial;
      if (!t || !t.saveUrl) return Promise.resolve(false);
      return fetch(t.saveUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': t.csrf || '',
        },
        body: JSON.stringify({ config: RoseInvite.config }),
      }).then(function (r) { return r.ok; }).catch(function () { return false; });
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(RoseInvite.config));
      return true;
    } catch (_) {
      return false; // storage full/unavailable - editor shows a warning
    }
  }

  function reset() {
    if (trial) {
      const t = window.__balconyTrial;
      if (t && t.saveUrl) {
        fetch(t.saveUrl, {
          method: 'DELETE',
          headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': t.csrf || '' },
        }).catch(function () { /* best effort - the reload shows template defaults anyway */ });
      }
      return;
    }
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) { /* ignore */ }
  }

  // ---- Shared formatting helpers ---------------------------------------
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));

  const nl2br = (s) => esc(s).replace(/\n/g, '<br />');

  // ---- Gallery photo framing -------------------------------------------------
  // A photo/postcard item may carry px/py (0-100: which part of the picture sits
  // in the frame) and zoom (1 = just fills it, up to PHOTO_ZOOM_MAX). A photo
  // saved before framing existed has none of the three, and renders centred at
  // 1 - exactly what the old background-size:cover did.
  const PHOTO_ZOOM_MAX = 3;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  function photoFrame(item) {
    const num = (v, d) => (v == null || isNaN(+v) ? d : +v);
    return {
      px: clamp(num(item && item.px, 50), 0, 100),
      py: clamp(num(item && item.py, 50), 0, 100),
      zoom: clamp(num(item && item.zoom, 1), 1, PHOTO_ZOOM_MAX),
    };
  }

  // object-position picks the spot within cover's own crop; transform-origin at
  // that same spot makes the zoom close in on it, so a dragged-to corner stays
  // reachable at any zoom rather than scaling off out of the frame.
  function photoStyle(item) {
    const f = photoFrame(item);
    const at = f.px + '% ' + f.py + '%';
    return 'object-position:' + at + ';transform-origin:' + at + ';transform:scale(' + f.zoom + ')';
  }

  const parseDate = (iso) => new Date(iso + 'T00:00:00');

  // '2025-12-12' → 'Fri, 12 Dec 2025'
  function fmtDateLabel(iso) {
    if (!iso) return '';
    const d = parseDate(iso);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
      .replace(/(\w+) (\d)/, '$1 $2');
  }

  // '19:30' → '7:30 PM'
  function fmtTime(hhmm) {
    if (!hhmm) return '';
    const [h, m] = hhmm.split(':').map(Number);
    if (isNaN(h)) return '';
    const am = h < 12;
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ':' + String(m || 0).padStart(2, '0') + ' ' + (am ? 'AM' : 'PM');
  }

  function ordinal(n) {
    const v = n % 100;
    if (v >= 11 && v <= 13) return 'th';
    return { 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th';
  }

  // '2025-12-14' → '14<sup>th</sup> December 2025'
  function fmtLongDate(iso) {
    if (!iso) return '';
    const d = parseDate(iso);
    if (isNaN(d)) return '';
    const day = d.getDate();
    return day + '<sup>' + ordinal(day) + '</sup> ' +
      d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  }

  // Guest personalization comes from the share link: ?to=Mr.%20Joshi%20and%20Family
  function guestName() {
    const to = (params.get('to') || '').trim();
    return to.slice(0, 80); // sane length cap
  }

  // Unknown ids (e.g. the removed 'ganesha' in an older saved invitation) fall
  // back to "No symbol" rather than the first artwork, so nothing wrong shows.
  const NO_SYMBOL = { id: 'none', label: 'No symbol', src: '' };
  const symbolById = (id) => SYMBOLS.find((s) => s.id === id) || NO_SYMBOL;

  // Resolve an invocation selection { religion, script } into the SINGLE line
  // the card renders. `script` is either 'english' (the transliteration) or a
  // native-script key from the tradition - the host chooses one or the other,
  // never both. Falls back gracefully when the saved religion/script no longer
  // exist (default: the tradition's first native script, else English).
  function invocationLines(inv) {
    const sel = inv && inv.script;

    // Host's own free-text line.
    if (sel === 'custom') {
      return {
        religion: (inv && inv.religion) || 'hindu', script: 'custom',
        text: (inv.custom || '').trim(), english: '', font: '', rtl: false,
        isEnglish: false, isCustom: true,
      };
    }
    // Deliberately no line (the symbol may still show).
    if (sel === 'blank') {
      return {
        religion: (inv && inv.religion) || 'hindu', script: 'blank',
        text: '', english: '', font: '', rtl: false, isEnglish: false, isBlank: true,
      };
    }

    const religion = INVOCATIONS[(inv && inv.religion)] ? inv.religion : 'hindu';
    const rel = INVOCATIONS[religion];
    const scriptKeys = Object.keys(rel.scripts);

    let chosen;
    if (sel === 'english') chosen = 'english';
    else if (sel && rel.scripts[sel]) chosen = sel;
    else chosen = scriptKeys.length ? scriptKeys[0] : 'english';

    if (chosen === 'english') {
      return { religion: religion, script: 'english', text: rel.english || '', font: '', rtl: false, isEnglish: true };
    }
    const scr = rel.scripts[chosen];
    return { religion: religion, script: chosen, text: scr.text, font: scr.font, rtl: !!scr.rtl, isEnglish: false };
  }

  // A ceremony's map destination: an explicit Google/Apple Maps link the couple
  // pasted, else a Google Maps text search on the venue name. Only http(s) links
  // are honoured (so a stray "javascript:" or bad paste can't slip through).
  function mapLink(ceremony) {
    const raw = (ceremony && ceremony.mapUrl || '').trim();
    if (/^https?:\/\//i.test(raw)) return raw;
    const venue = (ceremony && ceremony.venue || '').trim();
    return venue
      ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(venue)
      : '';
  }

  window.RoseInvite = {
    mode,
    trial,
    TRIAL_EDITABLE,
    /** Can this config path be edited in the current mode? */
    canEdit: function (path) {
      if (mode !== 'edit') return false;
      return trial ? TRIAL_EDITABLE.indexOf(path) !== -1 : true;
    },
    config: load(),
    DEFAULTS,
    CEREMONY_CATALOG,
    ceremonyName,
    SYMBOLS,
    INVOCATIONS,
    invocationLines,
    STORAGE_KEY,
    save,
    reset,
    esc,
    nl2br,
    PHOTO_ZOOM_MAX,
    photoFrame,
    photoStyle,
    fmtDateLabel,
    fmtTime,
    fmtLongDate,
    guestName,
    symbolById,
    mapLink,
  };

  if (mode === 'edit') document.body.classList.add('is-editing');
  if (mode === 'preview') document.body.classList.add('is-previewing');
  if (trial) document.body.classList.add('is-trial');
})();
