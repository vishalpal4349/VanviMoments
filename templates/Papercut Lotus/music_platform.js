// Shared background-music: guest-facing playback + mute toggle, and (in edit
// mode) a small floating control letting the host upload their own track or
// fall back to the shared default. One implementation instead of one per
// template - every template's namespace object (Papercut/RoseInvite/
// SimpleCard/SimpleAnnouncement) already carries the same shape this needs:
//   NS.mode                    - 'edit' | 'preview' | 'view'
//   NS.config.music            - { enabled, src, volume } (added to each
//                                 template's DEFAULTS; src '' means "use the
//                                 shared default track below")
//   NS.canEdit('music')        - already exists on every template (used to
//                                 gate other fields the same way); false in
//                                 the shopper trial, true for a real host
//   NS.audioUploadUrl          - '/host/events/{id}/audio', set by each
//                                 template's platform-adapter.js the same
//                                 way uploadUrl already is for photos; null
//                                 in trial/standalone dev
//   NS.save()                  - already exists on every template
//
// Usage: the last line of each template's own bootstrap script (app.js) -
//   if (window.BalconyMusic) window.BalconyMusic.mount(RI);
window.BalconyMusic = (function () {
  // Ships with every template as the shared default - a host who never
  // touches the music setting still gets a working, on-theme track rather
  // than silence. Absolute (not relative to the template folder) because
  // it lives once under /templates/music/, not copied into each template.
  // URL-encoded (the filename has a space) - encodeURI would be run on this
  // every use otherwise, and a literal space in a src attribute is asking
  // for a browser/environment to disagree on how to resolve it.
  var DEFAULT_TRACK = '/templates/music/Jashn-e-bahara%20Instrumental.mp3';

  var ICON_ON =
    '<svg class="music-toggle__icon music-toggle__icon--on" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M4 9v6h4l5 4V5L8 9H4z"/>' +
    '<path d="M16.5 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
    '<path d="M19 6a8 8 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
    '</svg>';
  var ICON_OFF =
    '<svg class="music-toggle__icon music-toggle__icon--off" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M4 9v6h4l5 4V5L8 9H4z"/>' +
    '<path d="M16.5 9.5l5 5M21.5 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
    '</svg>';
  var ICON_NOTE =
    '<svg class="music-toggle__icon" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/>' +
    '<circle cx="17" cy="16" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/>' +
    '</svg>';

  function clamp01(n) { return Math.max(0, Math.min(1, n)); }

  function xsrfToken() {
    var m = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function mount(NS) {
    if (!NS) return;
    if (NS.mode === 'edit') mountEditControl(NS);
    else mountPlayback(NS);
  }

  // ---- Guest-facing playback + mute toggle ---------------------------------
  // Autoplay reality: browsers block audible autoplay until the visitor
  // interacts with the page. The outer Balcony frame grants
  // `allow="autoplay"`, so we try immediately; if refused, the first gesture
  // anywhere on the page unlocks it. The toggle then mutes/unmutes.
  function mountPlayback(NS) {
    var cfg = (NS.config && NS.config.music) || {};
    if (cfg.enabled === false) return;

    var src = (cfg.src || '').trim() || DEFAULT_TRACK;

    var audio = new Audio();
    audio.loop = true;
    // 'metadata', not 'auto': loading the whole track on every page view,
    // including the majority of guests who never turn the music on, is
    // exactly the cost this avoids. Audible autoplay is blocked until a
    // gesture anyway, so nothing needs the audio data until the unlock below
    // or the toggle calls play() - and that call starts the full fetch by
    // itself. The header is enough to confirm the file is playable, which is
    // all the button-reveal below waits for.
    audio.preload = 'metadata';
    audio.volume = typeof cfg.volume === 'number' ? clamp01(cfg.volume) : 0.5;
    audio.src = src;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'music-toggle';
    btn.hidden = true; // revealed once we know a track can play
    btn.innerHTML = ICON_ON + ICON_OFF;
    document.body.appendChild(btn);

    // Host previews open the template with ?muted=1 so background music
    // doesn't autoplay in the dashboard workspace; the visitor unmutes with
    // this toggle.
    var startMuted = false;
    try { startMuted = new URLSearchParams(window.location.search).get('muted') === '1'; } catch (e) {}
    var wantsSound = !startMuted;

    function reflect() {
      btn.classList.toggle('is-muted', !wantsSound);
      btn.setAttribute('aria-pressed', String(!wantsSound));
      btn.setAttribute('aria-label', wantsSound ? 'Mute music' : 'Play music');
      btn.title = wantsSound ? 'Mute music' : 'Play music';
    }

    function tryPlay() {
      if (!wantsSound) return;
      var p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(function () { /* blocked - a later gesture will retry */ });
      }
    }

    // Reveal the control only once the browser confirms it can play this
    // file. Both events, because which one arrives depends on how much the
    // browser decided to fetch: under preload='metadata' it parses the
    // header and fires loadedmetadata, and may never buffer enough for
    // canplay until something calls play(). Waiting on canplay alone would
    // leave the toggle hidden for good.
    function revealToggle() { btn.hidden = false; }
    audio.addEventListener('loadedmetadata', revealToggle, { once: true });
    audio.addEventListener('canplay', revealToggle, { once: true });

    // A host's own uploaded track failing to load (moved, deleted, a format
    // the browser can't play) shouldn't leave the guest with silence - fall
    // back to the shared default once.
    audio.addEventListener('error', function () {
      if (audio.src.indexOf(DEFAULT_TRACK) === -1) {
        audio.src = DEFAULT_TRACK;
        audio.load();
        tryPlay();
      }
    });

    tryPlay(); // first attempt - often blocked by the autoplay policy, that's expected

    // Unlock on the first genuine interaction anywhere except the button
    // itself (the button runs its own logic below).
    var GESTURES = ['pointerdown', 'keydown', 'touchstart', 'scroll'];
    function unlock(e) {
      if (e && e.target && btn.contains(e.target)) return;
      if (wantsSound && audio.paused) tryPlay();
      if (!audio.paused) disarmUnlock();
    }
    // Symmetrical, because the page coming back from the background may need
    // to wait for a gesture all over again - re-adding the same listener for
    // the same event is a no-op, so arming twice is harmless.
    function armUnlock() {
      GESTURES.forEach(function (t) { window.addEventListener(t, unlock, { passive: true }); });
    }
    function disarmUnlock() {
      GESTURES.forEach(function (t) { window.removeEventListener(t, unlock); });
    }
    armUnlock();

    btn.addEventListener('click', function () {
      wantsSound = !wantsSound;
      if (wantsSound) { audio.muted = false; tryPlay(); }
      else { audio.pause(); }
      reflect();
    });

    // ---- Stopping when the invitation is no longer on screen ---------------
    // Audio started by a page has a life of its own on a phone. The browser
    // hands it a media session, and a media session is meant to survive the
    // screen locking, the app being switched away from and - in an in-app
    // browser like WhatsApp's - the sheet being swiped shut, complete with a
    // lock-screen control nobody asked for. That is the right behaviour for a
    // music app and quite wrong for an invitation: a guest who opened one and
    // put the phone in their pocket kept hearing it.
    //
    // Three moments, because no one event covers them all:
    //   visibilitychange  tab switched away, app backgrounded, screen locked
    //   pagehide          navigated away or closed - and, with persisted set,
    //                     frozen into the back/forward cache, from which the
    //                     page can come back alive and want its sound again
    //   pageshow          ... exactly that, restored
    //
    // beforeunload and unload are deliberately not used. They are unreliable
    // on mobile - iOS often never fires them - and merely registering one
    // disqualifies the page from the back/forward cache, making 'back' slower
    // for every guest to fix a case pagehide already covers.
    var pausedByUs = false;

    function suspend() {
      if (audio.paused) return;   // already off, or the guest muted it
      pausedByUs = true;
      audio.pause();
    }

    function resume() {
      if (!pausedByUs) return;    // only restart what this code stopped
      pausedByUs = false;
      tryPlay();
      // Returning to a page is not always a fresh gesture as far as the
      // autoplay policy is concerned, so be ready to wait for the next tap.
      armUnlock();
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) suspend();
      else resume();
    });

    window.addEventListener('pagehide', function (e) {
      suspend();
      if (!e.persisted) {
        // A real teardown rather than a freeze: let go of the audio itself,
        // so nothing of it - least of all a lock-screen control - outlives
        // the page that was playing it.
        pausedByUs = false;
        audio.removeAttribute('src');
        audio.load();
      }
    });

    window.addEventListener('pageshow', function (e) {
      if (e.persisted) resume();
    });

    reflect();
  }

  // ---- Host edit-mode control -----------------------------------------------
  // A floating note button (same corner the guest-facing toggle occupies)
  // that opens a tiny popover: current track, "Upload your own", and a
  // "Use default" reset once a host has one. Self-contained (its own file
  // input, its own upload call) so it works the same whether or not the
  // template also loads _platform/editor-kit.js - simple-card and
  // simple-announcement don't.
  function mountEditControl(NS) {
    if (NS.canEdit && !NS.canEdit('music')) return; // shopper trial - no music upload to try
    var cfg = NS.config.music || (NS.config.music = { enabled: true, src: '', volume: 0.5 });

    function persist() {
      Promise.resolve(NS.save()).then(function (ok) {
        if (ok) document.dispatchEvent(new CustomEvent('balcony:saved'));
      });
    }

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'music-toggle music-toggle--edit';
    btn.setAttribute('aria-label', 'Background music');
    btn.title = 'Background music';
    btn.innerHTML = ICON_NOTE;
    document.body.appendChild(btn);

    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.hidden = true;
    document.body.appendChild(input);

    var pop = null;
    var errorMsg = '';

    function closePop() { if (pop) { pop.remove(); pop = null; } }

    function paint() {
      closePop();
      var hasOwn = (cfg.src || '').trim() !== '';
      pop = document.createElement('div');
      pop.className = 'music-pop';
      pop.innerHTML =
        '<p class="music-pop__title">Background music</p>' +
        '<p class="music-pop__current">' + (hasOwn ? 'Your uploaded track' : 'Default track - Jashn-e-Bahara') + '</p>' +
        (errorMsg ? '<p class="music-pop__error">' + errorMsg + '</p>' : '') +
        '<div class="music-pop__row">' +
        '<button type="button" class="music-pop__btn" data-music="upload">Upload your own</button>' +
        (hasOwn ? '<button type="button" class="music-pop__btn music-pop__btn--ghost" data-music="reset">Use default</button>' : '') +
        '</div>';
      document.body.appendChild(pop);
      var r = btn.getBoundingClientRect();
      pop.style.top = (r.bottom + window.scrollY + 8) + 'px';
      pop.style.right = (window.innerWidth - r.right) + 'px';
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (pop) { closePop(); return; }
      errorMsg = '';
      paint();
    });

    document.addEventListener('pointerdown', function (e) {
      if (pop && !pop.contains(e.target) && e.target !== btn && !btn.contains(e.target)) closePop();
    });

    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-music]');
      if (!t || !pop || !pop.contains(t)) return;
      if (t.dataset.music === 'upload') {
        input.click();
      } else if (t.dataset.music === 'reset') {
        cfg.src = '';
        errorMsg = '';
        paint();
        persist();
      }
    });

    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      input.value = '';
      if (!file) return;

      // 8 MB is generous for a soft background track and far short of what
      // would make an invitation slow to open.
      if (file.size > 8 * 1024 * 1024) {
        errorMsg = 'That file is too large - please keep it under 8 MB.';
        paint();
        return;
      }

      if (NS.audioUploadUrl) {
        var form = new FormData();
        form.append('audio', file);
        fetch(NS.audioUploadUrl, {
          method: 'POST',
          credentials: 'same-origin',
          headers: { Accept: 'application/json', 'X-XSRF-TOKEN': xsrfToken() },
          body: form,
        })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (res) {
            if (res && res.url) {
              cfg.src = res.url;
              errorMsg = '';
              paint();
              persist();
            } else {
              errorMsg = "Couldn't upload that file - please check your connection.";
              paint();
            }
          })
          .catch(function () {
            errorMsg = "Couldn't upload that file - please check your connection.";
            paint();
          });
      } else {
        // Trial/standalone dev - no event to upload against yet. A local
        // object URL previews the pick; like editor-kit's own pickPhoto in
        // this same mode, it doesn't survive a reload.
        cfg.src = URL.createObjectURL(file);
        errorMsg = '';
        paint();
        persist();
      }
    });
  }

  return { mount: mount, DEFAULT_TRACK: DEFAULT_TRACK };
})();
