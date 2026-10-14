// Balcony platform RSVP - the shared, template-agnostic guest RSVP section.
//
// RSVP is a common platform feature: the host defines RSVP events (Mehendi,
// Haldi, …) from their dashboard, and this one module renders them + collects
// responses identically on EVERY template. A template opts in with a single
// mount point:  <div id="balcony-rsvp"></div>  and includes this script.
//
// Data comes from the platform payload in the URL hash (#platform=…), the same
// envelope platform-adapter.js reads - decoded here independently so this module
// is self-contained. Responses are submitted to the parent page via a
// postMessage bridge (balcony:rsvp), which owns the CSRF token + endpoint.
(function () {
  var mount = document.getElementById('balcony-rsvp');
  if (!mount) return; // template didn't opt in

  // Defined before the dispatch below: renderForm() is called before the
  // "helpers" section runs, and a `var` assignment (unlike a function
  // declaration) is NOT hoisted - leaving it below would make STATUS_LABEL
  // undefined inside renderForm and crash the whole section.
  var STATUS_LABEL = { attending: 'Yes', maybe: 'Maybe', 'not-attending': 'No' };

  // Generic UI glyphs (a person, a phone, …) drawn inline so the section stays
  // one self-contained file with no image requests. They use currentColor, so
  // they re-tint with the theme like everything else. Ceremonies carry no icon
  // at all - see iconSlot.
  //
  // Up here for the same reason STATUS_LABEL is: glyph() runs during the
  // dispatch below, and a `var` assignment is not hoisted. Left down in the
  // helpers section this read `undefined.heart` and threw before the card was
  // ever written, taking the whole section down in every mode.
  var GLYPH = {
    name: '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-7 2-7 4.5V20h14v-1.5C19 16 16 14 12 14Z"/>',
    contact: '<path d="M6.6 3h3l1.5 4-2.2 1.6a12 12 0 0 0 5.5 5.5L16 11.9l4 1.5v3A2.5 2.5 0 0 1 17.5 19 14.5 14.5 0 0 1 5 6.5 2.5 2.5 0 0 1 6.6 3Z"/>',
    schedule: '<path d="M7 2v2M17 2v2M3.5 8h17M5 5h14a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 19 21H5a1.5 1.5 0 0 1-1.5-1.5v-13A1.5 1.5 0 0 1 5 5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    message: '<path d="M3.5 6.5h17v11h-17z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m3.5 7 8.5 6 8.5-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    heart: '<path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z"/>',
    day: '<path d="M7 2v2M17 2v2M3.5 8h17M5 5h14a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 19 21H5a1.5 1.5 0 0 1-1.5-1.5v-13A1.5 1.5 0 0 1 5 5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  };

  // Party size bounds. Keep MAX in step with RsvpResponse::MAX_GUEST_COUNT -
  // the server clamps to it, so a larger number here would silently shrink on
  // save.
  var MIN_PEOPLE = 1;
  var MAX_PEOPLE = 10;

  // The party-size control: a stepper, so a guest on a phone can tap − / +
  // instead of fighting a number keyboard. The field stays typable (and the
  // buttons stay real <button>s) so keyboard and screen-reader users aren't
  // locked out. `dis` renders it disabled for the host's WYSIWYG preview.
  function peopleHtml(value, dis) {
    return '<div class="brsvp-stepper">' +
      '<button type="button" class="brsvp-stepper__btn" data-step="-1" aria-label="One person fewer"' + dis + '>&minus;</button>' +
      '<input type="number" class="brsvp-stepper__value" inputmode="numeric" min="' + MIN_PEOPLE + '" max="' + MAX_PEOPLE + '" value="' + value + '"' + dis + '>' +
      '<button type="button" class="brsvp-stepper__btn" data-step="1" aria-label="One person more"' + dis + '>+</button>' +
      '</div>';
  }

  var params = new URLSearchParams(location.search);
  var mode = params.has('edit') ? 'edit' : params.has('preview') ? 'preview' : 'view';
  var payload = decodePayload();

  // Theme. Every colour in the section is derived from ONE accent (see the
  // token block at the top of rsvp.css), so a single hex re-themes the whole
  // form - the purple in the design is just the default. Set on the mount, not
  // on .brsvp, because .brsvp declares the defaults itself and a declaration
  // always beats an inherited value; rsvp.css reads --brsvp-accent-set first.
  // This is the hook a per-invitation colour arrives through.
  var accent = readAccent(payload);
  if (accent) mount.style.setProperty('--brsvp-accent-set', accent);

  var events = (payload && payload.event && payload.event.rsvpEvents) || [];
  // The host can manage events inline - the editor sets this,
  // and passes ALL events (incl. hidden) to manage, vs. the enabled-only `events`.
  var canManage = !!(payload && payload.event && payload.event.rsvpManageable);
  var manageEvents = (payload && payload.event && payload.event.rsvpManageEvents) || events;
  // Some templates (e.g. rose-invitation's Ceremonies) drive RSVP from their
  // own schedule - the host edits it there, not here, so this section goes
  // read-only for them (see renderAutoEdit).
  var autoManaged = !!(payload && payload.event && payload.event.rsvpAutoManaged);

  // While editing, the host sees the guest form itself - options, head-count and
  // message present but disabled. A template with its own schedule gets a
  // read-only, auto-updating list (renderAutoEdit); otherwise each event's
  // name + date are editable and a plus adds one (renderHostEdit). Non-
  // manageable plans get a plain read-only note.
  if (mode === 'edit') {
    if (canManage) { if (autoManaged) renderAutoEdit(events); else renderHostEdit(manageEvents); }
    else renderNote(events);
    return;
  }

  // Who is answering. A personalized link carries the guest, so it asks for
  // nothing about them - it is already their invitation. The common (shared)
  // link carries nobody, so it has to ask for both a name and a number: that
  // pair is what RsvpController turns into a guest, and the number is what
  // makes a second reply update the first rather than create a stranger.
  var guest = (payload && payload.guest) || null;

  if (events.length) {
    renderForm(events, (guest && guest.rsvpResponses) || {}, (guest && guest.rsvpMessage) || '',
      { needsName: !guest, needsContact: !guest, contact: (guest && guest.rsvpContact) || '' });
  } else if (!payload) {
    // Nobody has bought this template yet, so there are no rsvp_events to draw
    // - but the trial IS the shop window, and hiding the section there means a
    // buyer, or an admin choosing the section's colour, cannot see that the
    // RSVP form exists at all. Draw it from the template's own schedule
    // instead, over the same 'balcony:rsvp-events-request' contract the host's
    // editor preview uses.
    //
    // Gated on there being NO payload, which is what makes this the trial
    // (?preview=1&trial=1 carries none) - a host viewing a real invitation
    // always arrives with one (platform-adapter.js sets it from the #platform=
    // hash the runtime's iframe loads this page with), so a real guest whose
    // host has an empty schedule still falls through to the hidden branch
    // below rather than seeing sample ceremonies as if they were theirs.
    //
    // No longer gated on mode === 'preview': every template also opens
    // completely standalone with no payload and no query string at all - a
    // developer working on the template's own files directly, outside the
    // platform entirely - and that plain view was the one case this left
    // hidden. Nothing about the trial/preview intent above depends on which
    // of 'view'/'preview' the plain URL happens to carry; !payload alone is
    // what actually distinguishes it from a real guest.
    renderPreview();
  } else {
    // A real guest with nothing to answer: the section stays hidden entirely.
    mount.hidden = true;
  }

  // ---- helpers -------------------------------------------------------------

  /**
   * The guest form as a shop-window preview, built from whatever schedule the
   * template broadcasts. Fully interactive so the design can be judged, but it
   * submits nowhere: there is no event and no parent bridge to submit to, and
   * showing a "your response is saved" would be a lie. Repaints on every
   * 'balcony:rsvp-events-changed', so editing the schedule in the trial editor
   * keeps this in step. Falls back to a stock schedule for a template that
   * doesn't broadcast one, so the section is never empty here.
   *
   * Common vs personalized: with no real platform payload there is no real
   * guest either, so this has nothing to key that decision off - except that
   * every template already carries its OWN standalone personalization
   * signal for exactly this no-payload case (?to=, read the same way each
   * template's own config.js reads it: for the guest's name on the page
   * itself). Reusing it here lets a plain URL preview either identity form
   * on demand - bare for the common link, ?to=A+Name for what a
   * personalized one looks like - without this module inventing a second,
   * competing query param for the same idea.
   */
  function renderPreview() {
    var FALLBACK = [
      { id: 'p1', key: null, name: 'Mehendi', date: null },
      { id: 'p2', key: null, name: 'Sangeet', date: null },
      { id: 'p3', key: null, name: 'Wedding', date: null },
    ];

    var toName = (params.get('to') || '').trim();

    function paint(list) {
      var evs = (list && list.length ? list : FALLBACK).map(function (e, i) {
        // The form keys radios by id; a broadcast item only has a key.
        return { id: e.id || ('p' + i), key: e.key || null, name: e.name, date: e.date || null };
      });

      renderForm(evs, {}, '', {
        needsName: !toName,
        needsContact: !toName,
        contact: '',
        preview: true,
      });
    }

    var answered = false;
    document.addEventListener('balcony:rsvp-events-changed', function (ev) {
      answered = true;
      paint((ev.detail && ev.detail.events) || []);
    });
    // Ask BEFORE painting the fallback: dispatchEvent runs listeners inline, so
    // a template that broadcasts a schedule answers within this call and the
    // stock names never flash on screen first.
    document.dispatchEvent(new CustomEvent('balcony:rsvp-events-request'));
    if (!answered) paint(null);
  }

  function decodePayload() {
    var m = /[#&]platform=([A-Za-z0-9_-]+)/.exec(location.hash);
    if (!m) return null;
    try {
      var b64 = m[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(decodeURIComponent(escape(atob(b64))));
    } catch (_) {
      return null;
    }
  }

  // A CSS colour is about to be written into a style attribute, so only a plain
  // hex is accepted - anything else is ignored rather than injected.
  function readAccent(p) {
    var v = p && p.event && p.event.rsvpAccent;

    return typeof v === 'string' && /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim()) ? v.trim() : null;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return '';
    // en-GB, not the browser's locale: dates always read day, month, year.
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // Read-only note for plans that can't manage RSVP here (e.g. shared link).
  function renderNote(evs) {
    var list = evs.length
      ? '<ul class="brsvp-note__list">' + evs.map(function (e) {
        return '<li>' + esc(e.name) + (e.date ? ' <span>· ' + esc(fmtDate(e.date)) + '</span>' : '') + '</li>';
      }).join('') + '</ul>'
      : '<p class="brsvp-note__empty">No RSVP events yet - add them from your dashboard’s RSVP page.</p>';
    mount.innerHTML =
      '<div class="brsvp brsvp-note">' +
      headerHtml('') +
      '<p class="brsvp-note__lead">Guests will reply to these events. Manage them from your RSVP dashboard.</p>' +
      list + '</div>';
  }

  // Host editing for a template that drives RSVP from its own schedule (e.g.
  // rose-invitation's Ceremonies): the guest form itself, fully read-only -
  // name, date, and which events even appear are ALL decided by that
  // template's own section, not here. Repaints instantly whenever the
  // template's schedule changes: it asks once via 'balcony:rsvp-events-request'
  // (the template may not have finished its own init yet when this script
  // runs) and stays subscribed to 'balcony:rsvp-events-changed' after that -
  // a generic contract any template with a live schedule can implement.
  function renderAutoEdit(evs) {
    function paint(list) {
      var rows = list.map(function (e) {
        return '<div class="brsvp-event">' +
          '<div class="brsvp-event__head">' +
          '<span class="brsvp-event__name">' + esc(e.name) + '</span>' +
          (e.date ? '<span class="brsvp-event__date">' + glyph('day', 'brsvp-event__cal') + esc(fmtDate(e.date)) + '</span>' : '') +
          '</div>' +
          '<div class="brsvp-opts">' +
          ['attending', 'maybe', 'not-attending'].map(function (st) {
            return '<label class="brsvp-opt"><input type="radio" name="s-auto-' + esc(e.key || e.id) + '" value="' + st + '" disabled><span>' + STATUS_LABEL[st] + '</span></label>';
          }).join('') +
          '</div></div>';
      }).join('') || '<p class="brsvp-note__empty">No events included yet - turn one on above.</p>';

      mount.innerHTML =
        '<div class="brsvp brsvp-host">' +
        headerHtml('') +
        '<p class="brsvp-host__lead">This is what your guests see. It updates automatically from the event schedule above - the contact details, answers, head-count and message are filled in by guests, so they’re shown here but disabled. A personal link already knows who its guest is, so it asks for neither name nor number.</p>' +
        '<div class="brsvp-host__preview">' + identityHtml(true, true, '', ' disabled') + '</div>' +
        '<div class="brsvp-headcount brsvp-host__preview">' +
        '<span class="brsvp-headcount__label">How many of you are coming?</span>' +
        peopleHtml(MIN_PEOPLE, ' disabled') +
        '<span class="brsvp-headcount__hint">Counts for every event a guest says Yes or Maybe to, below. Up to ' + MAX_PEOPLE + ' people.</span></div>' +
        '<div class="brsvp-events">' + rows + '</div>' +
        '<div class="brsvp-host__preview">' +
        fieldHtml('message',
          '<textarea class="brsvp-input brsvp-message__box" rows="3" aria-label="Message or wishes for the couple" placeholder="Leave the couple a wish (optional)" disabled></textarea>') +
        '</div>' +
        '</div>';
    }

    paint(evs);
    document.addEventListener('balcony:rsvp-events-changed', function (ev) {
      paint((ev.detail && ev.detail.events) || []);
    });
    document.dispatchEvent(new CustomEvent('balcony:rsvp-events-request'));
  }

  // Host editing: the guest form itself, with the answers / head-count / message
  // shown but DISABLED (a WYSIWYG preview). Only each event's name + date are
  // editable, and a "+" adds one. Every change is handed to the parent editor.
  function renderHostEdit(evs) {
    mount.innerHTML =
      '<div class="brsvp brsvp-host">' +
      headerHtml('') +
      '<p class="brsvp-host__lead">This is what your guests see. Edit each event’s name and date; the contact details, answers, head-count and message are filled in by guests, so they’re shown here but disabled. A personal link already knows who its guest is, so it asks for neither name nor number.</p>' +
      '<div class="brsvp-host__preview">' + identityHtml(true, true, '', ' disabled') + '</div>' +
      '<div class="brsvp-headcount brsvp-host__preview">' +
      '<span class="brsvp-headcount__label">How many of you are coming?</span>' +
      peopleHtml(MIN_PEOPLE, ' disabled') +
      '<span class="brsvp-headcount__hint">Counts for every event a guest says Yes or Maybe to, below. Up to ' + MAX_PEOPLE + ' people.</span></div>' +
      '<div class="brsvp-events"></div>' +
      '<div class="brsvp-host__preview">' +
      fieldHtml('message',
        '<textarea class="brsvp-input brsvp-message__box" rows="3" aria-label="Message or wishes for the couple" placeholder="Leave the couple a wish (optional)" disabled></textarea>') +
      '</div>' +
      '</div>';

    var eventsEl = mount.querySelector('.brsvp-events');
    var pending = {}; // tempId -> row model awaiting its real id

    evs.forEach(function (e) {
      eventsEl.appendChild(eventColumn({ id: e.id, name: e.name, date: e.date || null }));
    });

    // "+" add column - always the last item in the row.
    var addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'brsvp-host__add';
    addBtn.setAttribute('aria-label', 'Add event');
    addBtn.innerHTML = '<span class="brsvp-host__plus" aria-hidden="true">+</span><span>Add event</span>';
    addBtn.addEventListener('click', function () {
      var col = eventColumn({ id: null, name: '', date: null });
      eventsEl.insertBefore(col, addBtn);
      col.querySelector('.brsvp-host__name').focus();
    });
    eventsEl.appendChild(addBtn);

    // The parent hands back the real id after an add, so the new column becomes
    // editable / deletable without a reload.
    window.addEventListener('message', function (ev) {
      if (ev.source !== window.parent) return;
      var m = ev.data;
      if (!m || m.type !== 'balcony:rsvp-added' || !pending[m.tempId]) return;
      pending[m.tempId].id = m.id;
      var col = eventsEl.querySelector('[data-tempid="' + m.tempId + '"]');
      if (col) { col.dataset.id = m.id; col.removeAttribute('data-tempid'); }
      delete pending[m.tempId];
    });

    function eventColumn(e) {
      var col = document.createElement('div');
      col.className = 'brsvp-event brsvp-host__event';
      if (e.id) col.dataset.id = e.id;
      var gid = e.id || ('n' + Math.random().toString(36).slice(2, 7));
      col.innerHTML =
        '<div class="brsvp-event__head brsvp-host__head">' +
        '<button type="button" class="brsvp-host__del" title="Remove event" aria-label="Remove event">×</button>' +
        '<input class="brsvp-host__name" type="text" maxlength="120" placeholder="Event name" value="' + esc(e.name || '') + '">' +
        '<input class="brsvp-host__date" type="date" value="' + esc(e.date || '') + '">' +
        '</div>' +
        '<div class="brsvp-opts">' +
        ['attending', 'maybe', 'not-attending'].map(function (st) {
          return '<label class="brsvp-opt"><input type="radio" name="s-' + gid + '" value="' + st + '" disabled><span>' + STATUS_LABEL[st] + '</span></label>';
        }).join('') +
        '</div>';

      var nameEl = col.querySelector('.brsvp-host__name');
      var dateEl = col.querySelector('.brsvp-host__date');

      function commit() {
        var name = nameEl.value.trim();
        var date = dateEl.value || null;
        if (!e.id) {
          if (!name || col.dataset.tempid) return; // need a name; don't add twice
          e.name = name; e.date = date;
          var tempId = 'tmp-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
          col.dataset.tempid = tempId;
          pending[tempId] = e;
          window.parent.postMessage({ type: 'balcony:rsvp-add', name: name, date: date, tempId: tempId }, '*');
        } else {
          if (!name) { nameEl.value = e.name; return; } // never blank an existing name
          if (name !== e.name || date !== e.date) {
            e.name = name; e.date = date;
            window.parent.postMessage({ type: 'balcony:rsvp-update', id: e.id, name: name, date: date, enabled: true }, '*');
          }
        }
      }

      nameEl.addEventListener('change', commit);
      dateEl.addEventListener('change', commit);
      nameEl.addEventListener('blur', function () {
        if (!e.id && !col.dataset.tempid && !nameEl.value.trim()) col.remove();
      });

      col.querySelector('.brsvp-host__del').addEventListener('click', function () {
        if (e.id) {
          if (!window.confirm('Delete “' + (e.name || 'this event') + '” and all its responses?')) return;
          window.parent.postMessage({ type: 'balcony:rsvp-delete', id: e.id }, '*');
        }
        col.remove();
      });

      return col;
    }
  }

  // ---- Chrome ---------------------------------------------------------------

  function glyph(key, cls) {
    return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + (GLYPH[key] || '') + '</svg>';
  }

  // A round icon well around one of the built-in glyphs, for the section
  // heading and the field rows.
  //
  // It used to take a second argument that stamped data-icon and left the well
  // EMPTY, as a slot for a template to fill with per-ceremony artwork. No
  // template ever filled it, so the only thing it produced was a blank circle
  // in front of every ceremony - both are gone now, and every well this draws
  // has a glyph in it.
  function iconSlot(key) {
    return '<span class="brsvp-ico" aria-hidden="true">' +
      glyph(key, 'brsvp-ico__svg') + '</span>';
  }

  // The little line flourish either side of the title and on the divider.
  function flourish(cls) {
    return '<svg class="' + cls + '" viewBox="0 0 48 12" fill="none" aria-hidden="true">' +
      '<path d="M2 6c8-5 14 5 22 0M24 6c8-5 14 5 22 0" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' +
      '<circle cx="24" cy="6" r="1.6" fill="currentColor"/></svg>';
  }

  // Closing credit: the invite's only mention of who built it. Fixed brand
  // purple rather than --brsvp-accent - this is Balcony's mark, not the
  // couple's, so it shouldn't re-tint per invitation.
  function brandHtml() {
    return '<div class="brsvp__brand" style="margin-top:24px; text-align:center;">' +
      '<span class="brsvp__brand-label" style="font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#9c6370; opacity:0.8;">Crafted with love by</span>' +
      '<div style="font-family:\'Cormorant Garamond\', serif; font-size:18px; font-weight:700; letter-spacing:3px; color:#6d1b2d; text-transform:uppercase; margin-top:4px;">VANVI MOMENTS</div>' +
      '<div style="font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#c2506b; font-weight:600;">Couture Digital Invitations</div>' +
      '</div>';
  }

  // Card header: flourish · RSVP · flourish, a one-line invitation, and a heart.
  function headerHtml(lead) {
    return '<div class="brsvp__head">' +
      '<div class="brsvp__title">' + flourish('brsvp__title-mark') +
      '<span class="brsvp__title-text">Your Presence Matters</span>' + flourish('brsvp__title-mark brsvp__title-mark--flip') + '</div>' +
      (lead ? '<p class="brsvp__lead">' + lead + '</p>' : '') +
      glyph('heart', 'brsvp__head-heart') +
      '</div>';
  }

  // Icon well + heading + sub-line, introducing a group of rows.
  function sectionHeadHtml(title, sub) {
    return '<div class="brsvp-section">' + iconSlot('schedule') +
      '<div><span class="brsvp-section__title">' + title + '</span>' +
      (sub ? '<span class="brsvp-section__sub">' + sub + '</span>' : '') +
      '</div></div>';
  }

  // A field row: icon well and control side by side, no heading. The control's
  // own placeholder says what goes in it, which drops a line of chrome per
  // field - so every control passed here MUST carry an aria-label, since a
  // placeholder is not an accessible name and disappears the moment someone
  // starts typing.
  function fieldHtml(icon, control, note) {
    return '<div class="brsvp-field">' +
      '<div class="brsvp-field__row">' + iconSlot(icon) + control + '</div>' +
      (note ? '<span class="brsvp-field__hint">' + note + '</span>' : '') +
      '</div>';
  }

  // The "who is answering" block.
  //
  // A PERSONALIZED link asks for neither field. It already knows who this is
  // from the slug it arrived on, and the number it used to ask for was never
  // matched against anything - resolveGuest identifies the guest by guestId
  // and only filed the typed number beside the reply. So it was a required
  // field standing between an invited guest and a two-tap answer, in exchange
  // for a value the host already has.
  //
  // The COMMON link keeps both: with no guest behind it, the name is who
  // replied and the number is the identity - it is what makes a second reply
  // update the first instead of creating a stranger.
  //
  // `dis` renders it disabled for the host's WYSIWYG preview in edit mode.
  function identityHtml(needsName, needsContact, contact, dis) {
    if (!needsName && !needsContact) return '';

    return '<div class="brsvp-identity">' +
      (needsName
        ? fieldHtml('name',
          '<input type="text" class="brsvp-input brsvp-identity__name" maxlength="255" autocomplete="name" aria-label="Your name" placeholder="Your name"' + dis + '>')
        : '') +
      (needsContact
        ? fieldHtml('contact',
          '<input type="tel" class="brsvp-input brsvp-identity__contact" maxlength="20" inputmode="numeric" autocomplete="tel" aria-label="Contact number" placeholder="10-digit mobile number" value="' + esc(contact || '') + '"' + dis + '>',
          'Reply again from this number any time to update your answer.')
        : '') +
      '</div>';
  }

  function renderForm(evs, saved, savedMessage, who) {
    // The head-count is asked once for the whole invitation, not per ceremony.
    // Seed it from any saved "coming" answer.
    var initialCount = 1;
    evs.forEach(function (e) {
      var mine = saved[e.id] || {};
      if ((mine.status === 'attending' || mine.status === 'maybe') && mine.guestCount) {
        initialCount = mine.guestCount;
      }
    });

    var rows = evs.map(function (e) {
      var mine = saved[e.id] || {};
      var opts = ['attending', 'maybe', 'not-attending'].map(function (st) {
        var on = mine.status === st ? ' checked' : '';
        return '<label class="brsvp-opt"><input type="radio" name="s-' + e.id + '" value="' + st + '"' + on + '>' +
          '<span>' + STATUS_LABEL[st] + '</span></label>';
      }).join('');
      // No icon well. A ceremony row used to open with an empty round well for
      // a template to fill against data-icon; no template ever did, so every
      // ceremony carried a blank tinted circle. The name is what identifies a
      // ceremony here, and it now starts at the edge of the row.
      return '<div class="brsvp-event" data-id="' + e.id + '">' +
        '<div class="brsvp-event__head">' +
        '<span class="brsvp-event__name">' + esc(e.name) + '</span>' +
        (e.date ? '<span class="brsvp-event__date">' + glyph('day', 'brsvp-event__cal') + esc(fmtDate(e.date)) + '</span>' : '') +
        '</div>' +
        '<div class="brsvp-opts">' + opts + '</div>' +
        '</div>';
    }).join('');

    mount.innerHTML =
      '<div class="brsvp">' +
      headerHtml('Let us know so we can make the arrangements just right.') +
      '<form class="brsvp__form">' +
      identityHtml(who.needsName, who.needsContact, who.contact, '') +
      // Who is coming, and how many of them - the party size belongs with the
      // rest of "about you", above the schedule, not stranded after it. Always
      // on screen: it used to appear only once a ceremony was marked Yes or
      // Maybe, which was logical (party size means nothing if you aren't
      // coming) but simply read as a missing field. The answer is still ignored
      // on submit when nobody is coming.
      '<div class="brsvp-headcount">' +
      '<span class="brsvp-headcount__label">How many of you are coming?</span>' +
      peopleHtml(initialCount, '') +
      '<span class="brsvp-headcount__hint">Counts for every event you say Yes or Maybe to, below. Up to ' + MAX_PEOPLE + ' people.</span>' +
      '</div>' +
      '<div class="brsvp-rule">' + flourish('brsvp-rule__mark') + '</div>' +
      sectionHeadHtml('Event Schedule', 'Let us know which events you’ll be joining.') +
      '<div class="brsvp-events">' + rows + '</div>' +
      fieldHtml('message',
        '<textarea class="brsvp-input brsvp-message__box" rows="3" maxlength="1000" aria-label="Message or wishes for the couple" placeholder="Leave the couple a wish (optional)">' + esc(savedMessage || '') + '</textarea>') +
      '<p class="brsvp__error" hidden>Please answer for each event.</p>' +
      '<button type="submit" class="brsvp__submit">' + glyph('heart', 'brsvp__submit-heart') + 'Send RSVP</button>' +
      '<p class="brsvp__footnote">' + (who.preview
        ? 'Preview - your guests will be able to send this once your invitation is live.'
        : 'Thank you! Your response means a lot to us.') + '</p>' +
      '</form>' +
      '<div class="brsvp__result" hidden><p class="brsvp__thanks"></p>' +
      '<button type="button" class="brsvp__change">Change response</button></div>' +
      brandHtml() +
      '</div>';

    var form = mount.querySelector('.brsvp__form');
    var result = mount.querySelector('.brsvp__result');
    var errEl = mount.querySelector('.brsvp__error');
    var headcountEl = mount.querySelector('.brsvp-headcount');
    var peopleEl = headcountEl.querySelector('.brsvp-stepper__value');

    // Clamp to MIN..MAX and grey out whichever button can't move any further,
    // so the ceiling is visible rather than a silently ignored tap. Runs on
    // typing too - the field accepts a keyboard, and "0" or "99" has to land
    // somewhere sane before it reaches the server.
    function setPeople(n) {
      n = Math.max(MIN_PEOPLE, Math.min(MAX_PEOPLE, parseInt(n, 10) || MIN_PEOPLE));
      peopleEl.value = n;
      Array.prototype.forEach.call(headcountEl.querySelectorAll('.brsvp-stepper__btn'), function (btn) {
        var next = n + parseInt(btn.dataset.step, 10);
        btn.disabled = next < MIN_PEOPLE || next > MAX_PEOPLE;
      });
      return n;
    }

    headcountEl.addEventListener('click', function (ev) {
      var btn = ev.target.closest('.brsvp-stepper__btn');
      if (btn) setPeople(parseInt(peopleEl.value, 10) + parseInt(btn.dataset.step, 10));
    });
    // Only on change/blur, not input: clamping mid-typing would rewrite "1" to
    // "1" the instant someone starts typing "10".
    peopleEl.addEventListener('change', function () { setPeople(peopleEl.value); });
    setPeople(peopleEl.value);

    // How many events the guest is currently coming to (Yes or Maybe).
    function goingCount() {
      return evs.filter(function (e) {
        var c = form.querySelector('input[name="s-' + e.id + '"]:checked');
        return c && (c.value === 'attending' || c.value === 'maybe');
      }).length;
    }

    form.addEventListener('change', function (ev) {
      if (!ev.target.closest('input[type="radio"]')) return;
      errEl.hidden = true;
    });

    // Let a guest un-pick an option chosen by mistake: clicking the already-
    // selected one clears it (native radios can't otherwise be unchecked). The
    // radios sit inside their <label>, so capture the prior state on the label's
    // pointerdown - before the forwarded click toggles the radio.
    Array.prototype.forEach.call(form.querySelectorAll('.brsvp-opt'), function (label) {
      var radio = label.querySelector('input[type="radio"]');
      if (!radio) return;
      label.addEventListener('pointerdown', function () { radio._wasChecked = radio.checked; });
      radio.addEventListener('click', function () {
        if (radio._wasChecked) {
          radio.checked = false;
          radio.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    });

    var nameEl = form.querySelector('.brsvp-identity__name'); // absent on a personalized link
    var contactEl = form.querySelector('.brsvp-identity__contact');

    // One error line serves every rule, so it carries its own message.
    function fail(msg, focusEl) {
      errEl.textContent = msg;
      errEl.hidden = false;
      if (focusEl) focusEl.focus();
    }

    form.addEventListener('input', function (ev) {
      if (ev.target === nameEl || ev.target === contactEl) errEl.hidden = true;
    });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      // Shop-window preview: there is no invitation to attach a reply to, so
      // say so rather than faking a saved response.
      if (who.preview) {
        errEl.className = 'brsvp__error brsvp__error--note'; // a note, not a fault
        return fail('This is a preview - responses are collected once the invitation is live.', null);
      }

      if (nameEl && !nameEl.value.trim()) {
        return fail('Please tell us your name.', nameEl);
      }
      // Same rule the server applies (Phone::key): 10 digits once anything a
      // guest might type around them - spaces, +91, dashes - is stripped.
      //
      // Only when the field is on screen. A personalized link has no contact
      // input at all (see identityHtml), and demanding a number that is not
      // being asked for would make its form unsubmittable.
      var contact = contactEl ? contactEl.value.replace(/\D+/g, '') : '';
      if (contactEl && contact.length < 10) {
        return fail('Please enter a valid 10-digit contact number.', contactEl);
      }

      var missing = evs.some(function (e) {
        return !form.querySelector('input[name="s-' + e.id + '"]:checked');
      });
      if (missing) { return fail('Please answer for each event.', null); }

      // One head-count for the whole invitation, applied to every event the
      // guest marked Yes or Maybe (null for the ones they're not attending).
      var count = goingCount() > 0 ? setPeople(peopleEl.value) : null;

      var responses = evs.map(function (e) {
        var checked = form.querySelector('input[name="s-' + e.id + '"]:checked');
        var isGoing = checked.value === 'attending' || checked.value === 'maybe';
        return { rsvpEventId: e.id, status: checked.value, guestCount: isGoing ? count : null };
      });

      var messageEl = form.querySelector('.brsvp-message__box');
      var message = messageEl ? messageEl.value.trim() : '';

      // Hand off to the parent page, which holds the CSRF token + endpoint.
      // `name` only matters on the common link; the server ignores it once a
      // guestId is known.
      window.parent.postMessage({
        type: 'balcony:rsvp',
        name: nameEl ? nameEl.value.trim() : '',
        contact: contact,
        responses: responses,
        message: message,
      }, '*');
      showResult(responses);
    });

    mount.querySelector('.brsvp__change').addEventListener('click', function () {
      result.hidden = true;
      form.hidden = false;
    });

    function showResult(responses) {
      var byId = {};
      responses.forEach(function (r) { byId[r.rsvpEventId] = r; });
      var lines = evs.map(function (e) {
        var r = byId[e.id] || {};
        var extra = (r.status === 'attending' || r.status === 'maybe') && r.guestCount ? ' (' + r.guestCount + ')' : '';
        return '<li><span>' + esc(e.name) + '</span><span>' + (STATUS_LABEL[r.status] || '-') + extra + '</span></li>';
      }).join('');
      mount.querySelector('.brsvp__thanks').innerHTML =
        'Thanks! Your response is saved.<ul class="brsvp__result-list">' + lines + '</ul>';
      form.hidden = true;
      result.hidden = false;
    }
  }
})();
