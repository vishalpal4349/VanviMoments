// Balcony platform adapter - bridges the invitation to the Balcony website
// when the template is mounted through the contract runtime (index.ts).
//
// The runtime loads this page in an iframe with the event payload in the URL
// hash (#platform=<base64url JSON>). This script runs after config.js and
// BEFORE render.js, so the config it assembles here is what the template
// renders on first paint - no flash of demo defaults, no async handshake.
//
// Modes:
//   view (default)  - guests; config comes only from the payload
//   ?edit=1         - the host edits IN the template; the template's own
//                     editor drives everything, but saves go to the platform
//                     (balcony:save) instead of this browser's localStorage,
//                     and Finalize hands control back to the platform.
//
// Outbound messages to the parent page (see TemplateBridgeMessage):
//   { type: 'balcony:ready' }                     adapter applied the payload
//   { type: 'balcony:rsvp', status, dates, headcount, message }
//                                                 guest submitted the RSVP
//   { type: 'balcony:save', config }              edit-mode autosave
//   { type: 'balcony:finalize' }                  host tapped Finalize
(function () {
  const RI = window.RoseInvite;
  if (!RI) return;

  // Marketplace preview (?planNotice=1): RSVP now works on BOTH plans - the
  // common plan simply collects the guest's name - so there's no longer a
  // "Personalised only" lock to show here; the preview renders RSVP as-is.

  const match = /[#&]platform=([A-Za-z0-9_-]+)/.exec(location.hash);
  if (!match) return; // stand-alone mode - the template behaves as before

  let payload;
  try {
    const b64 = match[1].replace(/-/g, '+').replace(/_/g, '/');
    payload = JSON.parse(decodeURIComponent(escape(atob(b64))));
  } catch (_) {
    return; // malformed payload - render the template defaults rather than break
  }

  // Saved values win over defaults; objects merge, arrays are taken wholesale
  // (same rules as config.js's own merge).
  function deepMerge(base, over) {
    if (Array.isArray(base) || Array.isArray(over)) return over !== undefined ? over : base;
    if (typeof base !== 'object' || base === null) return over !== undefined ? over : base;
    if (typeof over !== 'object' || over === null) return base;
    const out = {};
    Object.keys(base).forEach((k) => { out[k] = deepMerge(base[k], over[k]); });
    Object.keys(over).forEach((k) => { if (!(k in base)) out[k] = over[k]; });
    return out;
  }

  const event = payload.event || {};
  const overrides = payload.sectionOverrides || {};

  // The no-guest "common link" of a Personalised event drops every guest spot:
  // no greeting, no closing easel (see render.js). Set before hideNameField so
  // the common link reads like the shared plan for these spots.
  RI.commonLink = !!event.commonLink;

  // Whether this invitation has ever been published. A 'draft' status means the
  // host is about to make it live for the FIRST time, so the toolbar's go-live
  // button reads "Make it Live" rather than "Push to live" (see editor.js mount).
  RI.hasPublished = event.status !== 'draft';

  // The RSVP 'Your name' field is asked for whenever we don't already know who
  // is replying - which is every common-link visit, since one shared link is
  // the primary way an invitation is shared. It's hidden only on a personalized
  // link, where the guest arrived on their own slug and is named in the payload.
  // Set early so edit mode sees it too.
  RI.hideNameField = !!(payload.guest && (payload.guest.name || payload.guest.greeting));

  // Platform mode never trusts this browser's localStorage - the host's edits
  // arrive in the payload (sectionOverrides.__templateConfig, the template's
  // native config shape, written by the in-template editor below).
  let cfg = deepMerge(RI.DEFAULTS, overrides.__templateConfig || {});

  // Generic EventData fields fill anything the template config didn't set.
  if (!overrides.__templateConfig) {
    if (Array.isArray(event.coupleNames) && event.coupleNames.length >= 2) {
      cfg.bride = event.coupleNames[0];
      cfg.groom = event.coupleNames[1];
    }
    if (event.date) cfg.weddingDate = event.date;
  }

  RI.config = cfg;
  RI.platform = true;

  // Re-encode the payload with the CURRENT config - used by the editor's
  // Preview/Back navigation so in-progress edits survive the page change.
  RI.platformHash = function () {
    const next = Object.assign({}, payload, {
      sectionOverrides: Object.assign({}, overrides, {
        __templateConfig: JSON.parse(JSON.stringify(RI.config)),
      }),
    });
    const json = JSON.stringify(next);
    const b64 = btoa(unescape(encodeURIComponent(json)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return '#platform=' + b64;
  };

  // Tell the platform which mode this load is in. The template navigates itself
  // between ?edit=1 and ?preview=1, so the parent has no other way to know - and
  // it needs to know, to offer device viewports while previewing.
  window.parent.postMessage({ type: 'balcony:mode', mode: RI.mode }, '*');

  // ---- Edit mode: the template's editor, saving to the platform ----------
  if (RI.mode === 'edit') {
    RI.save = function () {
      window.parent.postMessage(
        { type: 'balcony:save', config: JSON.parse(JSON.stringify(RI.config)) }, '*'
      );
      return true;
    };
    // Real gallery-photo uploads (see editor.js): same-origin endpoint, so the
    // iframe posts to it directly rather than round-tripping through the
    // parent. Only set when the payload carries a real event id - the trial
    // editor has no event to upload against and keeps its data-URL fallback.
    RI.uploadUrl = event.id ? ('/host/events/' + event.id + '/media') : null;
    // Same idea, for the background-music "upload your own" control
    // (_platform/music.js).
    RI.audioUploadUrl = event.id ? ('/host/events/' + event.id + '/audio') : null;
    // Resetting in platform mode returns to the template defaults (the
    // platform draft is replaced on the next autosave).
    RI.reset = function () {};
    window.parent.postMessage({ type: 'balcony:ready' }, '*');
    return; // guests-only wiring below doesn't apply while editing
  }

  cfg.finalized = true;

  // Guests can't persist config edits from platform mode.
  RI.save = function () { return false; };

  // RSVP is included with every purchase and is never plan-gated - see
  // config/templates.php, where the rsvpCta section is 'required' => true
  // for every template. This used to hide .scene--rsvp when the platform
  // payload listed 'rsvpCta' in sectionOverrides.__disabled; nothing on the
  // backend has ever actually populated that list with it, and per product
  // policy nothing should - RSVP cannot be a section a plan turns off.

  // Personalized greeting: the platform guest record replaces the ?to= param.
  const guest = payload.guest;
  if (guest && (guest.greeting || guest.name)) {
    const name = guest.greeting ||
      (guest.familyName ? guest.name + ' & ' + guest.familyName : guest.name);
    RI.guestName = function () { return String(name).slice(0, 80); };
  }

  // ---- RSVP bridge ------------------------------------------------------
  // rsvp.js owns validation and the result panel; when a guest submits a valid
  // response it calls RI.reportRsvp(payload). Here that becomes a message to the
  // platform. Stand-alone (no platform), RI.reportRsvp is simply never defined.
  RI.reportRsvp = function (payload) {
    window.parent.postMessage(Object.assign({ type: 'balcony:rsvp' }, payload), '*');
  };

  window.parent.postMessage({ type: 'balcony:ready' }, '*');
})();
