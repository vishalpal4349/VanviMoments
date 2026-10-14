// Papercut Lotus - config. Same modes/trial/storage/buyMeta contract as the
// other templates (see rose-invitation/config.js, simple-card/config.js):
//
// Modes (from the URL):
//   ?edit=1     → edit in place
//   ?preview=1  → preview with a return bar
//   (nothing)   → the final invitation guests see; ?to=Guest%20Name
//                 personalizes it in stand-alone/trial mode
(function () {
  const params = new URLSearchParams(location.search);
  const mode = params.has('edit') ? 'edit' : params.has('preview') ? 'preview' : 'view';

  const trial = params.has('trial');
  // A shopper gets to try the hero names and the invitation note; the family
  // cards, the gallery photo and its keepsake note require purchase - same
  // split as rose-invitation's TRIAL_EDITABLE (a taste of editing, not the
  // whole product).
  const TRIAL_EDITABLE = ['brideName', 'groomName', 'introNote', 'invocation.religion'];

  // ---- Opening invocation -------------------------------------------------
  // Ported wholesale from rose-invitation/config.js so both templates offer the
  // host exactly the same choice. Keep the two tables identical: add a
  // tradition, script or symbol there and add it here too.

  // Shared artwork under ./symbols/
  const SYMBOLS = [
    { id: 'ganesha', label: 'Ganesha', src: './symbols/_ganesha.svg' },
    { id: 'buddha', label: 'Buddha', src: './symbols/_buddha.svg' },
    { id: 'sindhi', label: 'Jhulelal', src: './symbols/_sindhi.svg' },
    { id: 'sikh', label: 'Ik Onkar', src: './symbols/_sikh.svg' },
    { id: 'jain', label: 'Ahimsa symbol', src: './symbols/_jain.svg' },
    { id: 'buddhist', label: 'Dharma wheel', src: './symbols/_buddhist.svg' },
    { id: 'parsi', label: 'Faravahar', src: './symbols/_parsi.svg' },
    { id: 'christian', label: 'Cross', src: './symbols/_christian.svg' },
    { id: 'none', label: 'None', src: '' },
  ];

  // Each tradition carries an English transliteration and, where it has one,
  // its native-script line(s). `font` MUST be a face covering that script's
  // glyphs (loaded from Google Fonts in index.html); `rtl` flips direction.
  // A saved config only stores { religion, script } - see invocationLines().
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

  // An unknown id (e.g. a symbol dropped from SYMBOLS since the invitation was
  // saved) falls back to "no symbol" rather than to the first artwork, so a
  // stale config never shows the wrong deity.
  const NO_SYMBOL = { id: 'none', label: 'No symbol', src: '' };
  const symbolById = (id) => SYMBOLS.find((s) => s.id === id) || NO_SYMBOL;

  // Resolve { religion, script } into the SINGLE line the cover renders.
  // `script` is either 'english' (the transliteration) or a native-script key
  // from that tradition - one or the other, never both. Falls back gracefully
  // when a saved religion/script no longer exists: the tradition's first
  // native script, else English.
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

  const STORAGE_KEY = trial ? 'papercutTrialConfig' : 'papercutConfig';

  // The commerce params (?buy= + plan pricing) belong to the shared platform
  // toolbar - it parses and sanitises them itself (see
  // /templates/_platform/toolbar.js). This template never touches them.

  // ---- Default wedding date -----------------------------------------------
  // A brand-new invitation (no saved config yet) used to open on a fixed,
  // eventually-past date (8 Feb 2026). 15 days out from whenever someone
  // actually creates the invitation reads as "soon" no matter when that is,
  // so the date-reveal mechanism and the ceremony schedule both look current
  // the first time a host sees them, rather than needing to be fixed by hand
  // before anything else.
  //
  // MONTHS/ordinalOf mirror editor.js's date-picker helpers (kept separate
  // rather than shared - config.js and editor.js are already two independent
  // small files here, and this is the only date math config.js needs).
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  function ordinalOf(n) {
    const teen = n % 100 >= 11 && n % 100 <= 13;
    const suffix = teen ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' })[n % 10] || 'th';
    return n + suffix;
  }

  // today + days, in the VISITOR's own local calendar - this is "how many
  // days from now", not a stored/round-tripped date, so the browser's local
  // notion of today is the right clock to use.
  function isoDaysFromNow(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  // Shifts an already-computed yyyy-mm-dd by a number of days. Built on
  // Date.UTC/getUTC* (pure calendar-component arithmetic, no timezone
  // conversion) rather than `new Date(iso)`, for the same reason editor.js's
  // applyISO avoids that constructor: it would read the bare string as UTC
  // and land a day early anywhere west of Greenwich.
  function addDaysISO(iso, days) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    d.setUTCDate(d.getUTCDate() + days);
    return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
  }

  // The wedding date IS the Vivaah date (see the ceremonies array below) -
  // every other rite is scheduled relative to it, in the order the rites
  // actually run.
  const VIVAAH_ISO = isoDaysFromNow(15);
  const [VIVAAH_Y, VIVAAH_MO, VIVAAH_D] = VIVAAH_ISO.split('-').map(Number);

  const DEFAULTS = {
    version: 1,
    finalized: false,

    // religion + script pick the text from INVOCATIONS; the transliteration
    // and native-script line are derived (see invocationLines). The defaults
    // reproduce the line this template used to hard-code on the intro cover.
    invocation: { symbol: 'ganesha', religion: 'hindu', script: 'devanagari', custom: '' },

    brideName: 'Ankita',
    groomName: 'Kaushik',
    // Derived (see syncDerived below) - kept flat so GenericTemplateRuntime
    // can pick them straight up for the admin dashboard / OG image without
    // this template needing its own PHP runtime class.
    title: 'Ankita & Kaushik',
    hostNames: ['Ankita', 'Kaushik'],

    introNote: 'We cordially invite you to grace the auspicious occasion of the marriage of…',

    // Shown inside the pond once the visitor taps to reveal it.
    eventDate: ordinalOf(VIVAAH_D) + ' ' + MONTHS[VIVAAH_MO - 1] + ' ' + VIVAAH_Y,

    // The date plaque (media/date.png) carries three separate panels, so the
    // date is stored in three pieces rather than parsed out of eventDate -
    // 'February' and '8th' cannot be recovered from one string reliably once a
    // host types something like 'Dec 25, 2026'. eventDate is kept above,
    // untouched, so the old reveal section still works when it comes back.
    // Canonical machine value behind the three display pieces. The editor's
    // calendar writes this and derives the rest from it; nothing renders it
    // directly, it exists so re-opening the picker lands on the date already
    // chosen rather than on today.
    // ---- Date reveal -------------------------------------------------------
    // The interactive paper mechanism (see date-reveal.js). It reads the DATE
    // from eventISO below - there is no second copy of it here, so the picker
    // that sets the plaque sets this too and the two can never disagree.
    //
    // `flower` is the host's own artwork, rotated during the reveal. It is a
    // path under this template folder, like ceremony art.
    dateReveal: {
      enabled: true,
      // Empty by default: the card is the three plaques and the button, and
      // the design has no heading over them. A host who wants a line above
      // the plaques can type one in - the editor shows the field either way.
      lead: '',
      buttonLabel: 'Reveal the Date!',
      // Replaces the button once the dials have settled.
      revealedLabel: 'Save the Date',
      bloomLeft: 'media/date_flower_left.webp',
      bloomRight: 'media/date_flower_right.webp',
    },

    eventISO: VIVAAH_ISO,
    eventDay: ordinalOf(VIVAAH_D),
    eventMonth: MONTHS[VIVAAH_MO - 1],
    eventYear: String(VIVAAH_Y),

    // enabled: the host can take this card out of the invitation and put it
    // back (editor.js card-remove / card-restore). Content is left untouched
    // while it is out, so restoring returns the card as it was.
    groomFamily: {
      enabled: true,
      name: 'Chi. Kaushik Sharma',
      relLabel: 'Son of',
      parentA: 'Shri Ramesh Chandra Sharma',
      parentB: 'Smt. Sunita Sharma',
      grandLabel: 'Grandson of',
      grandA: 'Late Shri Pandit Brij Mohan Sharma',
      grandB: 'Late Smt. Kamla Devi Sharma',
      // The word in front of the gotra - editable, because it is not the
      // same word in every community.
      gotraLabel: 'Gotra',
      gotra: 'Bharadwaj',
    },
    brideFamily: {
      // Rose-invitation's second family card, word for word (its
      // parents.cards[1]) - including the empty gotra, which is what
      // demonstrates that the line drops out when a family does not use one.
      enabled: true,
      name: 'Sau. Ka. Ankita Mehta',
      relLabel: 'Daughter of',
      parentA: 'Shri Vikram Mehta',
      parentB: 'Smt. Nandini Mehta',
      grandLabel: 'Granddaughter of',
      grandA: 'Late Shri Hari Prasad Mehta',
      grandB: 'Pushpa Devi Mehta',
      gotraLabel: 'Gotra',
      gotra: '',
    },

    // Up to 5 photos and up to 5 keepsake notes, each shown one-per-frame in its
    // own arrowed carousel (see render.js / app.js / editor.js). Flat arrays so
    // the shared editor-kit can address a note by path (gallery.notes.2, …).
    // Three of each, so the PREVIEW shows a working carousel. It used to be one
    // empty string and one note, and an empty string is not a photo: render.js's
    // livePhotos() drops blanks, and with nothing left it hides the whole photo
    // pager for anyone who is not editing - so the preview showed a lone note
    // frame and no gallery at all.
    // The placeholder art is deliberately obviously placeholder (see
    // media/photo-placeholder-1.svg). deepMerge replaces arrays wholesale rather
    // than merging them index by index, so an invitation that has already saved
    // its own gallery keeps exactly what it saved and never inherits these.
    gallery: {
      // Either half of the gallery can be removed in the editor and put back,
      // the same way the compliment and note CARDS can (see applyCardState).
      // Flat booleans beside the arrays rather than wrapping each half in an
      // object: photos/notes are arrays in every invitation already saved, and
      // reshaping them would strand those. Undefined counts as ON, so an older
      // config with neither flag keeps both halves.
      photosEnabled: true,
      notesEnabled: true,

      photos: [
        'media/photo-placeholder-1.svg',
        'media/photo-placeholder-2.svg',
        'media/photo-placeholder-3.svg',
      ],
      notes: [
        'Two souls, one journey - and every heart that walks beside them.',
        'From the first cup of chai to the last dance - thank you for being part of our story.',
        'Bring your best smile. We are saving a seat, a sweet and a song for you.',
      ],
    },

    // The ceremony carousel. The artwork is part of the template design (a
    // papercut scene per rite), so `art` is not host-editable; the couple edits
    // the name, date, time and venue of each. Kept a flat array so render.js
    // can address fields by path (ceremonies.0.date, …) for the shared
    // editor-kit's [data-edit] wiring.
    //
    // Ordered as the rites actually run - ring, mehendi, haldi, then sangeet,
    // vivaah, reception - which is the same sequence rose-invitation uses.
    // Haldi shares a day with Sangeet (morning vs evening), as it usually does.
    // date/time are STORED as ISO ('2026-02-04', 24h '19:00') so the editor can
    // hand them straight to a native <input type="date"> / <input type="time">;
    // render.js formats them for the guest ("Wed, 4 Feb 2026", "7:00 PM").
    // Same shape rose-invitation uses, for the same reason.
    //
    // mapUrl: an explicit Google/Apple Maps link. Empty falls back to a maps
    // SEARCH on the venue text, which is what this template did for every
    // ceremony before the field existed.
    //
    // enabled: the host can drop a ceremony from the invitation and put it
    // back. The entry keeps its details while it is out.
    // Dates are offsets from VIVAAH_ISO (the date-reveal date, above) rather
    // than fixed strings, so the whole schedule shifts together for a
    // brand-new invitation: Vivaah lands ON that date, everything before it
    // in the running order sits on days before, Reception sits the day after.
    // editor.js's date-pick action re-derives these same offsets when a host
    // changes the date later, so the two never drift apart.
    ceremonies: [
      { name: 'Ring Ceremony', art: 'media/ring_ceremony.webp', date: addDaysISO(VIVAAH_ISO, -3), time: '19:00', venue: 'Sharma Residence, Jaipur', mapUrl: '', enabled: true },
      { name: 'Mehendi', art: 'media/mehendi.webp', date: addDaysISO(VIVAAH_ISO, -2), time: '11:00', venue: 'Sharma Residence, Jaipur', mapUrl: '', enabled: true },
      { name: 'Haldi', art: 'media/haldi.webp', date: addDaysISO(VIVAAH_ISO, -1), time: '10:00', venue: 'Sharma Residence, Jaipur', mapUrl: '', enabled: true },
      { name: 'Sangeet', art: 'media/sangeet.webp', date: addDaysISO(VIVAAH_ISO, -1), time: '19:00', venue: 'Sharma Residence, Jaipur', mapUrl: '', enabled: true },
      { name: 'Vivaah', art: 'media/vivaah.webp', date: VIVAAH_ISO, time: '10:00', venue: 'Sharma Residence, Jaipur', mapUrl: '', enabled: true },
      { name: 'Reception', art: 'media/reception.webp', date: addDaysISO(VIVAAH_ISO, 1), time: '19:30', venue: 'Sharma Residence, Jaipur', mapUrl: '', enabled: true },
    ],

    // The media row at the foot of the invitation (see social.js / index.html's
    // .scene--social). Only the Instagram handle is host-set; the locations and
    // calendar popups are both derived from `ceremonies` above, so they need no
    // config of their own and can never fall out of step with the ceremony
    // cards. Left empty, the Instagram button offers instagram.com itself.
    // `instagram` switches the button itself off - a couple with no page to
    // share should not be left offering one (see renderSocial in render.js).
    social: { instagram: true, instagramUrl: '' },

    // Background music - plays softly on the guest-facing invitation with a
    // mute toggle top-right, and an "upload your own" control in edit mode
    // (see _platform/music.js, shared by every template). Leave src blank to
    // use the shared default track. Set enabled:false to turn the feature
    // off entirely.
    music: { enabled: true, src: '', volume: 0.5 },

    // "With Best Compliments From" card - a lead line + any number of name lines
    // (add/remove in the editor). Hidden from guests when no line has text.
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

    // Free-form note card below the compliments - a title + message. (Named
    // `note` to avoid clashing with the gallery's keepsake `gallery.notes`.)
    // Hidden from guests when the message is empty.
    note: {
      enabled: true,
      lead: 'A Note From Us',
      text: 'We can’t wait to celebrate this special day with you. Thank you for being part of our journey.',
    },
  };

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
  // trial_token cookie), not localStorage - see TrialDraftController. The
  // saved draft is injected synchronously as window.__balconyTrial (a
  // <script src> in index.html before this file), which also carries the
  // save endpoint + a CSRF token. Non-trial standalone editing still uses
  // localStorage (dev/preview only; purchased hosts save over the platform
  // bridge, see platform-adapter.js) - same split as rose-invitation/config.js.
  // media/date_flower_left.png and _right.png were renamed to .webp (and the
  // old files deleted) in an image-optimisation pass - DEFAULTS points at the
  // new names, but a draft saved BEFORE that pass still has the old ones
  // baked in, which wins over the default in the merge and 404s on screen
  // (the two files are simply gone). Patch just these two known-renamed
  // paths back onto the current default rather than requiring every
  // already-saved draft to be manually cleared.
  function normalizeConfig(cfg) {
    if (cfg.dateReveal) {
      if (cfg.dateReveal.bloomLeft === 'media/date_flower_left.png') {
        cfg.dateReveal.bloomLeft = DEFAULTS.dateReveal.bloomLeft;
      }
      if (cfg.dateReveal.bloomRight === 'media/date_flower_right.png') {
        cfg.dateReveal.bloomRight = DEFAULTS.dateReveal.bloomRight;
      }
    }
    return cfg;
  }

  function load() {
    const urlData = params.get('data');
    if (urlData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(urlData))));
        if (decoded) return normalizeConfig(deepMerge(DEFAULTS, decoded));
      } catch (_) {
        try {
          const parsed = JSON.parse(decodeURIComponent(urlData));
          if (parsed) return normalizeConfig(deepMerge(DEFAULTS, parsed));
        } catch (e) {}
      }
    }
    if (trial) {
      const t = window.__balconyTrial;
      return normalizeConfig(deepMerge(DEFAULTS, (t && t.draft) || {}));
    }
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved) return normalizeConfig(deepMerge(DEFAULTS, saved));
    } catch (_) { /* corrupt storage → fall back to the template */ }
    return deepMerge(DEFAULTS, {});
  }

  // Recomputes the flat passthrough fields from the names right before every
  // persistence path (trial/standalone save() below, and the edit-mode
  // save() platform-adapter.js installs) - this avoids relying on DOM event
  // ordering between editor-kit's own [data-edit] input listener and a
  // template-local one.
  function syncDerived() {
    const cfg = window.Papercut.config;
    cfg.hostNames = [cfg.brideName, cfg.groomName].filter(Boolean);
    cfg.title = cfg.hostNames.join(' and ');
  }

  // Returns a Promise<boolean> in trial mode (server write), a boolean
  // otherwise - editor-kit's saveNow() normalises both.
  function save() {
    syncDerived();
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
        body: JSON.stringify({ config: Papercut.config }),
      }).then(function (r) { return r.ok; }).catch(function () { return false; });
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Papercut.config));
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

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));

  function guestName() {
    const to = (params.get('to') || '').trim();
    return to.slice(0, 80);
  }

  window.Papercut = {
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
    SYMBOLS,
    INVOCATIONS,
    symbolById,
    invocationLines,
    STORAGE_KEY,
    save,
    reset,
    syncDerived,
    esc,
    guestName,
  };

  if (mode === 'edit') document.body.classList.add('is-editing');
  if (mode === 'preview') document.body.classList.add('is-previewing');
  if (trial) document.body.classList.add('is-trial');
})();
