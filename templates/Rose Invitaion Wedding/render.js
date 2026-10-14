// Renders every editable section of the invitation from RoseInvite.config.
// Runs before the animation scripts so they initialize against the final DOM.
// In edit mode it additionally renders the editing affordances (contenteditable
// fields via data-edit, control chips, add-tiles); editor.js wires the behavior.
(function () {
  const RI = window.RoseInvite;
  if (!RI) return;

  const cfg = RI.config;
  const edit = RI.mode === 'edit';
  const esc = RI.esc;
  const nl2br = RI.nl2br;

  // data-edit helper: emits the contenteditable hooks only in edit mode.
  // `path` walks into RoseInvite.config (e.g. "gallery.items.2.caption").
  //
  // This is the ONLY place editability is granted, so it is also where the trial
  // allowlist is enforced. A locked field is emitted with data-locked instead of
  // data-edit: it still renders, it just isn't contenteditable and editor.js's
  // delegated handlers (which all match on [data-edit]) never see it. Locking in
  // CSS alone would be theatre - the field would still be typeable.
  function ed(path, opts) {
    if (!edit) return '';
    if (!RI.canEdit(path)) return ' data-locked="1" title="Buy this template to edit"';
    const o = opts || {};
    return ' data-edit="' + path + '"' +
      (o.multiline ? ' data-edit-multiline="1"' : '') +
      (o.placeholder ? ' data-edit-placeholder="' + esc(o.placeholder) + '"' : '') +
      ' contenteditable="plaintext-only" spellcheck="false"';
  }

  function guestHtml() {
    if (edit) {
      return '<span class="edit-guest" title="Filled in automatically for each guest from the share link (?to=Guest Name)">Guest Name &amp; Family</span>';
    }
    return esc(RI.guestName() || 'Dear Family & Friends');
  }

  // Guest greeting used on the welcome card, the closing easel, and the RSVP.
  // Personalized plan → the guest's name (a placeholder in the host's preview,
  // which carries no specific guest). Default/common plan → '' so callers omit it
  // entirely (a shared link has no single addressee to greet).
  function greetingHtml() {
    if (!RI.hideNameField) return '';   // default/common plan → no greeting
    if (edit) return guestHtml();       // editor's "Guest Name & Family" hint
    return RI.guestName() ? esc(RI.guestName()) : 'Guest’s Name';
  }

  const chip = (action, section, label) => (
    edit ? '<button class="edit-chip" type="button" data-action="' + action + '" data-section="' + section + '">' + label + '</button>' : ''
  );

  const restoreStrip = (section, label) => (
    '<div class="edit-restore"><span>' + esc(label) + ' removed</span>' +
    '<button type="button" data-action="section-restore" data-section="' + section + '">Restore</button></div>'
  );

  // ---- Opening invocation ----------------------------------------------
  // Driven by a religion + script selection (see config INVOCATIONS). Exactly
  // ONE line renders: either the tradition's native-script line (in its own
  // font/direction) OR the English transliteration - whichever the host picked,
  // never both. English uses the template's primary serif, since the Devanagari
  // face named in .invite__blessing has no Latin worth setting a sentence in.
  function renderInvocation() {
    const bless = document.querySelector('.invite__bless');
    if (!bless) return;

    const sym = RI.symbolById(cfg.invocation.symbol);
    const symEl = bless.querySelector('.invite__ganesha');
    if (symEl) {
      if (sym.src) {
        // Mask (not <img src>) so CSS colours the symbol to match the line text.
        symEl.style.webkitMaskImage = "url('" + sym.src + "')";
        symEl.style.maskImage = "url('" + sym.src + "')";
        symEl.hidden = false;
      } else {
        symEl.hidden = true;
      }
    }

    const line = RI.invocationLines(cfg.invocation);
    const lineEl = bless.querySelector('.invite__blessing');
    // Older render passes may have created a second (English) line - remove it,
    // since only one line renders now.
    const staleEn = bless.querySelector('.invite__blessing-en');
    if (staleEn) staleEn.remove();

    if (lineEl) {
      if (line.text) {
        lineEl.hidden = false;
        lineEl.textContent = line.text;
        lineEl.style.fontFamily = line.isEnglish
          ? 'var(--font-primary)'
          : (line.font ? '"' + line.font + '", var(--font-primary)' : '');
        lineEl.setAttribute('dir', line.rtl ? 'rtl' : 'ltr');
      } else {
        // No line (blank / empty custom): hide it entirely.
        lineEl.hidden = true;
      }
    }

    // With neither a line nor a symbol, skip the whole blessing screen in the
    // final view - the invitation opens straight on the welcome card instead of
    // an empty first screen. Kept visible while editing so the host can still
    // choose a line or symbol.
    const screen = document.querySelector('.screen--welcome');
    if (screen) screen.classList.toggle('no-bless', !line.text && !sym.src && !edit);

    // Edit affordance: a single button opening the invocation picker (religion,
    // and - for Hindu - the regional script). Consults canEdit so the trial
    // sandbox honours its allowlist.
    let btn = bless.querySelector('.edit-symbol-btn');
    if (edit && RI.canEdit('invocation.religion') && !btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'edit-symbol-btn';
      btn.dataset.action = 'invocation-pick';
      btn.textContent = 'Change invocation ▾';
      bless.insertBefore(btn, bless.firstChild);
    }
  }

  // ---- Welcome card + names reveal ---------------------------------------
  function renderWelcome() {
    const to = document.querySelector('.invite__to');
    if (to) {
      const g = greetingHtml();
      to.innerHTML = g;
      to.hidden = g === '';
    }

    // The invitation line under the invocation. Editable here the same way
    // papercut and royale already have it - it was the one template left
    // where this line could only be changed by editing index.html. The host's
    // own line breaks are honoured (multiline + nl2br), which is what keeps
    // the default's four short lines rather than reflowing them into a block.
    const msg = document.querySelector('.invite__message');
    if (msg) {
      msg.innerHTML = '<span' + ed('introNote', { multiline: true, placeholder: 'Your invitation line…' }) +
        '>' + nl2br(cfg.introNote || '') + '</span>';
    }

    const names = document.querySelector('.reveal__names');
    if (names) {
      names.innerHTML =
        '<span class="reveal__name"' + ed('bride', { placeholder: 'Bride' }) + '>' + esc(cfg.bride) + '</span>' +
        '<span class="reveal__amp">and</span>' +
        '<span class="reveal__name"' + ed('groom', { placeholder: 'Groom' }) + '>' + esc(cfg.groom) + '</span>';
    }
  }

  // ---- Family detail cards ------------------------------------------------
  function detailCardHtml(card, i) {
    const p = 'parents.cards.' + i + '.';
    const grand = edit || card.grandA || card.grandB;
    const gotra = edit || card.gotra;
    return (
      '<article class="invite invite--detail">' +
      (edit ? '<button class="edit-chip edit-chip--card" type="button" data-action="parent-card-remove" data-index="' + i + '">✕ Remove card</button>' : '') +
      '<div class="invite__inner">' +
      '<h3 class="detail__name"' + ed(p + 'name', { placeholder: 'Name' }) + '>' + esc(card.name) + '</h3>' +
      '<p class="detail__block">' +
      '<span class="detail__label"' + ed(p + 'childLabel', { placeholder: 'Son / Daughter of' }) + '>' + esc(card.childLabel) + '</span>' +
      '<span class="detail__person"' + ed(p + 'parentA', { placeholder: 'Father’s name' }) + '>' + esc(card.parentA) + '</span>' +
      '<span class="detail__amp">&amp;</span>' +
      '<span class="detail__person"' + ed(p + 'parentB', { placeholder: 'Mother’s name' }) + '>' + esc(card.parentB) + '</span>' +
      '</p>' +
      (grand
        ? '<p class="detail__block">' +
          '<span class="detail__label"' + ed(p + 'grandLabel', { placeholder: 'Grandson / Granddaughter of' }) + '>' + esc(card.grandLabel) + '</span>' +
          '<span class="detail__person"' + ed(p + 'grandA', { placeholder: 'Grandfather’s name' }) + '>' + esc(card.grandA) + '</span>' +
          '<span class="detail__amp">&amp;</span>' +
          '<span class="detail__person"' + ed(p + 'grandB', { placeholder: 'Grandmother’s name' }) + '>' + esc(card.grandB) + '</span>' +
          '</p>'
        : '') +
      (gotra
        ? '<p class="detail__gotra"' + ed(p + 'gotra', { placeholder: 'Gotra (optional)' }) + '>' + esc(card.gotra) + '</p>'
        : '') +
      '</div></article>'
    );
  }

  function renderDetails() {
    const scene = document.querySelector('.scene--details');
    if (!scene) return;
    const wrap = scene.querySelector('.details__cards');
    const cards = cfg.parents.cards;
    const anyOn = cards.some((c) => c.enabled);
    // "Filled" = a name or any parent/grandparent/gotra text. An enabled-but-
    // empty card is dropped from the preview + final (kept while editing).
    const familyFilled = (c) => !!((c.name || c.parentA || c.parentB || c.grandA || c.grandB || c.gotra || '').trim());

    if (!edit) {
      // The fountain video lives in this section too and must survive even when
      // no family cards remain. So never hide the whole section - just drop the
      // family content (cards + vines); the fountain stays.
      const shown = cards.filter((c) => c.enabled && familyFilled(c));
      scene.hidden = false;
      scene.classList.toggle('details--no-cards', shown.length === 0);
      wrap.innerHTML = shown.map((c) => detailCardHtml(c, cards.indexOf(c))).join('');
      return;
    }

    scene.hidden = false;
    scene.classList.toggle('edit-empty', !anyOn);
    wrap.innerHTML = cards.map((c, i) => {
      if (c.enabled) return detailCardHtml(c, i);
      const who = i === 0 ? 'first' : 'second';
      return (
        '<div class="edit-add-card"><p>' + (who === 'first' ? 'First' : 'Second') + ' family card removed</p>' +
        '<button type="button" data-action="parent-card-add" data-index="' + i + '">+ Add card</button></div>'
      );
    }).join('');
    if (!anyOn) {
      wrap.insertAdjacentHTML('afterbegin',
        '<p class="edit-note">Both cards removed - the family cards, blue splash and rose vines won’t appear. The fountain video still will.</p>');
    }
  }

  // ---- Wedding date (petal reveal) ----------------------------------------
  function renderDate() {
    const main = document.querySelector('.date__main');
    if (main) main.innerHTML = RI.fmtLongDate(cfg.weddingDate);
    if (edit) {
      const card = document.getElementById('dateCard');
      let field = document.querySelector('.edit-date-field');
      if (card && !field) {
        field = document.createElement('label');
        field.className = 'edit-date-field';
        field.innerHTML = 'Wedding date <input type="date" data-edit-input="weddingDate" />';
        card.appendChild(field);
      }
      const input = document.querySelector('.edit-date-field input');
      if (input) input.value = cfg.weddingDate;

      // Typed alternative to the calendar above - on iOS Safari a
      // type="date" field is a scrolling wheel with no way to type at all,
      // so day/month/year get their own plain number fields too. Built once
      // and left in place, like the calendar field; either one can drive the
      // date, and both stay in sync with whichever was used last.
      let manual = document.querySelector('.edit-date-manual');
      if (card && !manual) {
        manual = document.createElement('div');
        manual.className = 'edit-date-manual';
        manual.innerHTML =
          '<label><span>Day</span><input type="number" min="1" max="31" class="edit-date-manual__day"></label>' +
          '<label><span>Month</span><input type="number" min="1" max="12" class="edit-date-manual__month"></label>' +
          '<label><span>Year</span><input type="number" min="1900" max="2999" class="edit-date-manual__year"></label>';
        card.appendChild(manual);

        const dayInp = manual.querySelector('.edit-date-manual__day');
        const moInp = manual.querySelector('.edit-date-manual__month');
        const yrInp = manual.querySelector('.edit-date-manual__year');

        // Reuses the calendar field's own [data-edit-input] pipeline (kit's
        // generic change delegation - persist, save, dispatch
        // balcony:field-changed) rather than duplicating it: a valid typed
        // date is written onto that field and a change event is fired on it,
        // so editor.js's existing weddingDate handling (re-render, cascade
        // to the ceremony schedule) runs exactly as it does for a real pick.
        manual.addEventListener('change', () => {
          const day = parseInt(dayInp.value, 10);
          const mo = parseInt(moInp.value, 10);
          const yr = parseInt(yrInp.value, 10);
          if (day < 1 || day > 31 || mo < 1 || mo > 12 || !/^\d{4}$/.test(String(yr))) return;
          const iso = yr + '-' + String(mo).padStart(2, '0') + '-' + String(day).padStart(2, '0');
          if (iso === input.value) return;
          input.value = iso;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
      const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(cfg.weddingDate || '');
      if (manual && parts) {
        manual.querySelector('.edit-date-manual__year').value = parts[1];
        manual.querySelector('.edit-date-manual__month').value = +parts[2];
        manual.querySelector('.edit-date-manual__day').value = +parts[3];
      }
    }
  }

  // ---- Gallery (hanging polaroids) -----------------------------------------
  const HANG = [118, 150, 86, 132, 100, 120, 150, 92, 110, 140];
  // Must match the .polaroid--* widths in styles.css (desktop/tablet), since the
  // cards are absolutely positioned by these values.
  const CARD_W = { photo: 350, postcard: 490, story: 350 };

  function galleryItemHtml(item, i, left) {
    const controls = edit
      ? '<div class="pol-controls">' +
        '<button type="button" data-action="gallery-move" data-dir="-1" data-index="' + i + '" title="Move left">◀</button>' +
        '<button type="button" data-action="gallery-remove" data-index="' + i + '" title="Remove card">✕</button>' +
        '<button type="button" data-action="gallery-move" data-dir="1" data-index="' + i + '" title="Move right">▶</button>' +
        '</div>'
      : '';
    const open = '<div class="polaroid" data-hang="' + HANG[i % HANG.length] + '" style="left: ' + left + 'px;">' +
      '<img class="polaroid__knot" src="media/gallery-rope-vertical.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />' + controls;

    if (item.type === 'story') {
      return open +
        '<div class="polaroid__card polaroid--story">' +
        '<p' + ed('gallery.items.' + i + '.text', { multiline: true, placeholder: 'Write your story…' }) + '>' + nl2br(item.text || '') + '</p>' +
        '</div></div>';
    }
    const cls = item.type === 'postcard' ? 'polaroid--postcard' : 'polaroid--photo';
    const img = item.image
      ? '<img class="polaroid__img" src="' + esc(item.image) + '" alt="" draggable="false" ' +
        'loading="lazy" decoding="async" style="' + RI.photoStyle(item) + '" />'
      : '';
    // While editing, the picture area IS the control - the same four gestures
    // the other templates use: tap to choose or swap the photo, drag to move
    // it inside its frame, wheel or pinch to zoom. That replaced an
    // "+ Add photo" button and a -/+ and "Change photo" bar laid over the
    // picture, which were controls for a thing whose obvious control is the
    // thing itself, and which on a phone covered a third of the frame.
    const adjustable = !!(edit && RI.canEdit('gallery.items'));
    let photoInner;
    if (adjustable) {
      photoInner = img || '<span class="pol-photo-hint">Tap to add a photo</span>';
    } else {
      // A demo card (placeholder: true, no image of its own) reads as
      // unfinished on purpose - see the note in config.js's DEFAULTS.
      photoInner = img || (!edit && item.placeholder ? '<span class="polaroid__placeholder">Your photo here</span>' : '');
    }
    const photoAttrs = ' class="polaroid__photo' + (item.image ? ' has-photo' : '') + (adjustable ? ' is-adjustable' : '') + '"' +
      (adjustable
        ? ' data-index="' + i + '" title="' +
          (item.image ? 'Tap to change · drag to move · scroll or pinch to zoom' : 'Tap to add a photo') + '"'
        : '');
    return open +
      '<figure class="polaroid__card ' + cls + '">' +
      '<div' + photoAttrs + '>' + photoInner + '</div>' +
      '<figcaption class="polaroid__caption"' + ed('gallery.items.' + i + '.caption', { placeholder: '#caption' }) + '>' + esc(item.caption || '') + '</figcaption>' +
      '</figure></div>';
  }

  function renderGallery() {
    const scene = document.querySelector('.scene--gallery');
    if (!scene) return;
    const track = scene.querySelector('.gallery__track');
    // Empty polaroids (a photo/postcard with no image, or a story with no text)
    // are dropped from the preview + final; the host still sees them to fill
    // in while editing. A demo placeholder (placeholder: true, see
    // config.js's DEFAULTS) is the one exception - it's meant to be visible
    // by default, with "Your photo here" standing in until the host adds a
    // real one.
    const galleryFilled = (it) => !!(it.type === 'story'
      ? (it.text || '').trim()
      : ((it.image || '').trim() || it.placeholder));
    const items = edit ? cfg.gallery.items : cfg.gallery.items.filter(galleryFilled);
    const on = cfg.gallery.enabled && (items.length > 0 || edit);

    let strip = scene.querySelector('.edit-restore');
    if (strip) strip.remove();
    scene.querySelectorAll(':scope > .edit-chip, :scope > .edit-gal-nav').forEach((el) => el.remove());

    if (!edit) {
      scene.hidden = !on;
      if (!on) return;
    } else {
      scene.hidden = false;
      scene.classList.toggle('edit-off', !cfg.gallery.enabled);
      if (!cfg.gallery.enabled) {
        scene.insertAdjacentHTML('afterbegin', restoreStrip('gallery', 'Photo gallery'));
        track.innerHTML = '<div class="gallery__rope" aria-hidden="true"></div>';
        return;
      }
      scene.insertAdjacentHTML('beforeend', chip('section-remove', 'gallery', '✕ Remove gallery'));
      // Plain left/right browsing while editing (no swing physics)
      scene.insertAdjacentHTML('beforeend',
        '<button class="edit-gal-nav edit-gal-nav--left" type="button" data-action="gallery-scroll" data-dir="-1" aria-label="Scroll gallery left">‹</button>' +
        '<button class="edit-gal-nav edit-gal-nav--right" type="button" data-action="gallery-scroll" data-dir="1" aria-label="Scroll gallery right">›</button>');
    }

    // Rope, then the cards. The vine is NOT emitted here: it lives outside the
    // track, as a child of .scene--gallery, so that it stays put while this
    // content scrolls horizontally. Re-adding it to this string would drop it
    // back into the scrolling layer.
    let html = '<div class="gallery__rope" aria-hidden="true"></div>';
    let left = 160;
    items.forEach((item, i) => {
      html += galleryItemHtml(item, i, left);
      left += CARD_W[item.type] + 120;
    });

    if (edit) {
      if (items.length < 10) {
        html +=
          '<div class="polaroid edit-add-pol" style="left: ' + left + 'px;">' +
          '<div class="edit-add-pol__box"><p>Add a card (' + items.length + '/10)</p>' +
          '<button type="button" data-action="gallery-add" data-type="photo">+ Portrait photo</button>' +
          '<button type="button" data-action="gallery-add" data-type="postcard">+ Landscape photo</button>' +
          '<button type="button" data-action="gallery-add" data-type="story">+ Text card</button>' +
          '</div></div>';
        left += 300 + 120;
      }
    }

    track.innerHTML = html;
    track.style.width = Math.max(left + 320, window.innerWidth) + 'px';
  }

  // ---- Ceremonies -----------------------------------------------------------
  function ceremonyCardHtml(c, i) {
    const cat = RI.CEREMONY_CATALOG[c.id];
    const pin =
      '<span class="cere-card__pin" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
      '<path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.4" /></svg></span>';

    let when;
    if (edit) {
      // Time is optional: shown with a remove (✕) button, or an "+ Add time"
      // button when the couple has cleared it.
      const timeRow = c.time
        ? '<p class="cere-card__time cere-card__time--edit">' +
          '<input type="time" data-edit-input="ceremonies.' + i + '.time" value="' + esc(c.time) + '" />' +
          '<button type="button" class="cere-time-x" data-action="ceremony-time-remove" data-index="' + i + '" title="Remove time">✕</button>' +
          '</p>'
        : '<p class="cere-card__time"><button type="button" class="cere-time-add" data-action="ceremony-time-add" data-index="' + i + '">+ Add time</button></p>';
      when = '<p class="cere-card__date"><input type="date" data-edit-input="ceremonies.' + i + '.date" value="' + esc(c.date) + '" /></p>' + timeRow;
    } else {
      when = '<p class="cere-card__date">' + esc(RI.fmtDateLabel(c.date)) + '</p>' +
        (c.time ? '<p class="cere-card__time">' + esc(RI.fmtTime(c.time)) + '</p>' : '');
    }

    const toggle = edit
      ? '<label class="cere-toggle" title="Include this ceremony">' +
        '<input type="checkbox" data-edit-toggle="ceremonies.' + i + '.enabled"' + (c.enabled ? ' checked' : '') + ' />' +
        '<span>' + (c.enabled ? 'Included' : 'Excluded') + '</span></label>'
      : '';

    let venue;
    if (edit) {
      // Editable venue text + a field to paste a Google/Apple Maps share link
      venue =
        '<p class="cere-card__venue">' + pin +
        '<span' + ed('ceremonies.' + i + '.venue', { placeholder: 'Venue, City' }) + '>' + esc(c.venue) + '</span>' +
        '</p>' +
        '<label class="cere-card__maplink">' +
        '<span>📍 Maps link</span>' +
        '<input type="url" data-edit-input="ceremonies.' + i + '.mapUrl" ' +
        'placeholder="Paste Google / Apple Maps link (optional)" value="' + esc(c.mapUrl || '') + '" /></label>';
    } else {
      // Tapping the venue opens the map (explicit link, else a venue search)
      const link = RI.mapLink(c);
      venue = link
        ? '<a class="cere-card__venue cere-card__venue--link" href="' + esc(link) + '" target="_blank" rel="noopener">' +
          pin + '<span>' + esc(c.venue) + '</span>' +
          '<span class="cere-card__go" aria-hidden="true">›</span></a>'
        : '<p class="cere-card__venue">' + pin + '<span>' + esc(c.venue) + '</span></p>';
    }

    return (
      '<article class="cere-card' + (edit && !c.enabled ? ' is-off' : '') + '" data-splash="' + esc(cat.splash) + '">' +
      toggle +
      '<div class="cere-card__body">' +
      '<h3 class="cere-card__name"' + ed('ceremonies.' + i + '.name', { placeholder: 'Ceremony name' }) + '>' +
      esc(RI.ceremonyName(c)) + '</h3>' +
      '<img class="cere-card__divider" src="media/floral-divider.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />' +
      when +
      venue +
      '</div>' +
      '<img class="cere-card__art" src="' + esc(cat.art) + '" alt="" aria-hidden="true" loading="lazy" decoding="async" />' +
      '</article>'
    );
  }

  function renderCeremonies() {
    const deck = document.getElementById('ceremonyDeck');
    if (deck) {
      // Only render ceremonies still in the catalog - an older saved invitation
      // may carry a removed type (e.g. Baraat); those are silently dropped.
      const known = cfg.ceremonies.filter((c) => RI.CEREMONY_CATALOG[c.id]);
      const list = edit ? known : known.filter((c) => c.enabled);
      deck.innerHTML = list.map((c) => ceremonyCardHtml(c, cfg.ceremonies.indexOf(c))).join('');

      const splash = document.getElementById('deckSplash');
      const first = known.find((c) => c.enabled);
      if (splash && first) splash.src = RI.CEREMONY_CATALOG[first.id].splash;
    }

    syncRsvpEvents();
  }

  // The RSVP section (shared /templates/_platform/rsvp.js) has no idea what a
  // "ceremony" is - it just wants "here are the included events, by name and
  // date". Broadcasting that on every ceremonies render (toggle, date edit, on
  // load) is what makes the host's RSVP preview auto-update, per the generic
  // 'balcony:rsvp-events-changed' contract any template can implement.
  function syncRsvpEvents() {
    const events = cfg.ceremonies
      .filter((c) => c.enabled && RI.CEREMONY_CATALOG[c.id])
      .map((c) => ({ key: c.id, name: RI.ceremonyName(c), date: c.date || null }));
    document.dispatchEvent(new CustomEvent('balcony:rsvp-events-changed', { detail: { events } }));
  }

  // rsvp.js (loaded after this file) asks once for the current state on
  // mount, in case its own init runs before ours has fired at least once.
  document.addEventListener('balcony:rsvp-events-request', syncRsvpEvents);

  // ---- Compliment card --------------------------------------------------------
  function renderCompliments() {
    const scene = document.querySelector('.scene--compliment');
    if (!scene) return;
    const card = scene.querySelector('.compliment-card');
    const on = cfg.compliments.enabled;
    // Empty (no compliment lines with text) → dropped from preview + final.
    const hasContent = cfg.compliments.lines.some((l) => (l || '').trim());

    let strip = scene.querySelector('.edit-restore');
    if (strip) strip.remove();

    if (!edit) {
      scene.hidden = !on || !hasContent;
      if (!on || !hasContent) return;
    } else {
      scene.hidden = false;
      scene.classList.toggle('edit-off', !on);
      if (!on) {
        scene.insertAdjacentHTML('afterbegin', restoreStrip('compliments', 'Compliments card'));
        card.innerHTML = '';
        return;
      }
    }

    let html = '<p class="compliment__lead"' + ed('compliments.lead', { placeholder: 'With Best Compliments From:' }) + '>' + esc(cfg.compliments.lead) + '</p>';
    html += '<img class="compliment__divider" src="media/floral-divider.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />';
    cfg.compliments.lines.forEach((line, i) => {
      html += '<p class="compliment__line">' +
        '<span' + ed('compliments.lines.' + i, { placeholder: 'Name & Family (relation)' }) + '>' + esc(line) + '</span>' +
        (edit ? '<button type="button" class="edit-line-x" data-action="compliment-line-remove" data-index="' + i + '" title="Remove line">✕</button>' : '') +
        '</p>';
    });
    if (edit) {
      html += '<button type="button" class="edit-add-line" data-action="compliment-line-add">+ Add a line</button>';
      html += chip('section-remove', 'compliments', '✕ Remove card');
    }
    card.innerHTML = html;
  }

  // ---- Notes card -------------------------------------------------------------
  // A free-form note below the compliments card: a title (lead) + a multiline
  // message. Same show/hide + restore-strip behaviour as the compliment card.
  function renderNotes() {
    const scene = document.querySelector('.scene--notes');
    if (!scene) return;
    const card = scene.querySelector('.notes-card');
    const on = cfg.notes.enabled;
    // Empty (no note text) → dropped from preview + final.
    const hasContent = (cfg.notes.text || '').trim();

    let strip = scene.querySelector('.edit-restore');
    if (strip) strip.remove();

    if (!edit) {
      scene.hidden = !on || !hasContent;
      if (!on || !hasContent) return;
    } else {
      scene.hidden = false;
      scene.classList.toggle('edit-off', !on);
      if (!on) {
        scene.insertAdjacentHTML('afterbegin', restoreStrip('notes', 'Notes card'));
        card.innerHTML = '';
        return;
      }
    }

    let html = '<p class="notes__lead"' + ed('notes.lead', { placeholder: 'A Note From Us' }) + '>' + esc(cfg.notes.lead) + '</p>';
    html += '<img class="notes__divider" src="media/floral-divider.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />';
    html += '<p class="notes__text"' + ed('notes.text', { multiline: true, placeholder: 'Write any extra notes for your guests…' }) + '>' + nl2br(cfg.notes.text || '') + '</p>';
    if (edit) {
      html += chip('section-remove', 'notes', '✕ Remove card');
    }
    card.innerHTML = html;
  }

  // ---- Closing easel + RSVP (guest-personalized spots) --------------------------
  function renderEnd() {
    // The closing easel is a guest-personalized send-off. On the no-guest common
    // link, drop the whole section so the invitation ends at the social CTA.
    const end = document.querySelector('.scene--end');
    if (end && RI.commonLink) {
      end.hidden = true;
      return;
    }
    if (end) end.hidden = false;

    const names = document.querySelector('.easel__names');
    if (names) {
      const g = greetingHtml();
      names.innerHTML = g;
      names.hidden = g === '';
    }
  }

  // '2025-12-12' → '12 Dec' for the attendance cards.
  function shortDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return '';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  // Attendance is asked PER DATE - a single date can hold several ceremonies, and
  // a guest is either coming that day or not. Each card lists the ceremonies on
  // that date and one Yes / Maybe / No answer.
  function rsvpDateCardHtml(date, ceremonies) {
    const names = ceremonies
      .map((c) => RI.ceremonyName(c))
      .filter(Boolean)
      .join(' · ');
    const group = 'rsvp-' + date;
    const dis = edit ? ' disabled' : '';
    const opt = (value, label) =>
      '<label class="rsvp-date__opt">' +
      '<input class="rsvp-date__radio" type="radio" name="' + esc(group) + '" value="' + value + '"' + dis + ' />' +
      '<span class="rsvp-date__mark" aria-hidden="true"></span>' +
      '<span class="rsvp-date__label">' + label + '</span>' +
      '</label>';
    return (
      '<div class="rsvp-date" data-date="' + esc(date) + '">' +
      '<p class="rsvp-date__date">' + esc(shortDate(date)) + '</p>' +
      '<p class="rsvp-date__names">' + esc(names) + '</p>' +
      '<div class="rsvp-date__opts">' +
      opt('attending', 'Yes') + opt('maybe', 'Maybe') + opt('not-attending', 'No') +
      '</div></div>'
    );
  }

  function renderRsvp() {
    // Greeting: on the personalized plan, address the guest by name - a
    // placeholder stands in for the host's preview, which has no specific guest.
    // On the default/common plan there is no greeting at all; the guest types
    // their own name in the field below.
    const title = document.querySelector('.rsvp__title');
    if (title) {
      const g = greetingHtml();
      title.hidden = g === '';
      title.innerHTML = g ? '<strong>' + g + ',</strong>' : '';
    }

    // The 'Your name' field only appears on the common (shared) plan; it's hidden
    // on the personalized plan - including its preview - where each guest is known.
    const nameGroup = document.getElementById('rsvpNameGroup');
    if (nameGroup) nameGroup.hidden = !!RI.hideNameField;

    // Group the host's enabled ceremonies by date, in chronological order; each
    // group (ceremonies within a date sorted by time) becomes one attendance card.
    const grid = document.getElementById('rsvpCeremonies');
    if (grid) {
      const enabled = cfg.ceremonies.filter((c) => c.enabled && c.date && RI.CEREMONY_CATALOG[c.id]);
      const byDate = {};
      const order = [];
      enabled.forEach((c) => {
        if (!byDate[c.date]) { byDate[c.date] = []; order.push(c.date); }
        byDate[c.date].push(c);
      });
      order.sort(); // ISO dates sort chronologically
      grid.innerHTML = order.map((date) => {
        const list = byDate[date].slice().sort((a, b) => (a.time || '').localeCompare(b.time || ''));
        return rsvpDateCardHtml(date, list);
      }).join('');
    }

    // RSVP is a shared platform feature now (see /templates/_platform/rsvp.js);
    // it renders itself into #balcony-rsvp, including the edit-mode note.
  }

  // ---- Social buttons -----------------------------------------------------------
  function renderSocial() {
    const igBtn = document.getElementById('igBtn');
    if (!igBtn) return;
    const socials = igBtn.closest('.socials');
    const on = cfg.social.instagram;

    if (!edit) {
      igBtn.hidden = !on;
      return;
    }

    igBtn.hidden = false;
    igBtn.classList.toggle('edit-off', !on);
    let wrap = igBtn.parentElement.classList.contains('edit-ig-wrap') ? igBtn.parentElement : null;
    if (!wrap) {
      wrap = document.createElement('span');
      wrap.className = 'edit-ig-wrap';
      igBtn.replaceWith(wrap);
      wrap.appendChild(igBtn);
    }
    let old = wrap.querySelector('.edit-chip, .edit-ig-restore');
    if (old) old.remove();
    if (on) {
      wrap.insertAdjacentHTML('beforeend',
        '<button class="edit-chip edit-chip--ig" type="button" data-action="section-remove" data-section="instagram">✕</button>');
    } else {
      wrap.insertAdjacentHTML('beforeend',
        '<button class="edit-ig-restore" type="button" data-action="section-restore" data-section="instagram">+ Add Instagram</button>');
    }
    // Locations & calendar derive from the ceremonies - nothing to edit directly.
    const locBtn = document.getElementById('locBtn');
    const calBtn = document.getElementById('calBtn');
    if (locBtn) locBtn.title = 'Locations - filled automatically from your ceremonies';
    if (calBtn) calBtn.title = 'Calendar - filled automatically from your ceremonies';
    if (socials && !socials.parentElement.querySelector('.edit-social-note')) {
      socials.insertAdjacentHTML('afterend',
        '<p class="edit-note edit-social-note">Locations &amp; calendar are generated from your ceremony details. Click Instagram to set your page link.</p>');
    }
  }

  function renderAll() {
    renderInvocation();
    renderWelcome();
    renderDetails();
    renderDate();
    renderGallery();
    renderCeremonies();
    renderCompliments();
    renderNotes();
    renderEnd();
    renderRsvp();
    renderSocial();
  }

  RI.render = {
    all: renderAll,
    invocation: renderInvocation,
    welcome: renderWelcome,
    details: renderDetails,
    date: renderDate,
    gallery: renderGallery,
    ceremonies: renderCeremonies,
    compliments: renderCompliments,
    notes: renderNotes,
    end: renderEnd,
    rsvp: renderRsvp,
    social: renderSocial,
  };

  renderAll();
})();
