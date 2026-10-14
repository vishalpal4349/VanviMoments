// Papercut Lotus - renders window.Papercut.config into the static DOM shell
// in index.html.
//
// Unlike rose-invitation's render.js (which rebuilds innerHTML per scene to
// support add/remove/reorder of repeating lists - polaroids, ceremonies),
// papercut has no repeating/orderable content: fixed hero names, fixed two
// family cards, one gallery photo + one note. So this file takes the
// simpler route of mutating the existing static elements directly by id,
// closer to simple-card's approach - while still emitting the same
// [data-edit]/[data-locked] attributes the shared _platform/editor-kit.js
// and editor.css expect, exactly like rose-invitation's `ed()` helper does.
(function () {
  const PC = window.Papercut;
  if (!PC) return;
  const cfg = PC.config;

  // ---- Inline-editable text helper ----------------------------------------
  // Mirrors rose-invitation's ed() helper, but applied to an existing element
  // instead of emitted into an HTML string: sets the visible text, and in
  // edit mode marks the field either editable ([data-edit]) or locked
  // ([data-locked], trial-only) so editor-kit.js's generic [data-edit]
  // delegation and editor.css's styling both pick it up for free.
  function editable(el, path, value, opts) {
    if (!el) return;
    opts = opts || {};
    el.textContent = value || '';

    if (PC.mode !== 'edit') {
      el.removeAttribute('contenteditable');
      el.removeAttribute('data-edit');
      el.removeAttribute('data-edit-multiline');
      el.removeAttribute('data-edit-placeholder');
      el.removeAttribute('data-locked');
      el.removeAttribute('spellcheck');
      el.removeAttribute('title');
      return;
    }

    if (PC.canEdit(path)) {
      el.setAttribute('contenteditable', 'plaintext-only');
      el.dataset.edit = path;
      el.spellcheck = false;
      if (opts.multiline) el.dataset.editMultiline = '1';
      if (opts.placeholder) el.dataset.editPlaceholder = opts.placeholder;
      el.removeAttribute('data-locked');
      el.removeAttribute('title');
    } else {
      el.removeAttribute('contenteditable');
      el.setAttribute('data-locked', '1');
      el.title = 'Buy this template to edit';
    }
  }

  const $ = (id) => document.getElementById(id);

  // ---- Removable cards --------------------------------------------------------
  // The family, compliment and note cards can be taken out of the invitation and
  // put back (rose-invitation does the same for its sections). The switch is an
  // `enabled` flag on the card's own config branch; the CONTENT is left alone
  // while it is out, so restoring brings the card back exactly as it was.
  //
  // Guests simply never see a removed card. The host sees a slot in its place
  // with a Restore button - without that the card would vanish with no way back,
  // which is how "remove" becomes "lose your work".
  const CARD_LABEL = {
    groomFamily: "Groom's family card",
    brideFamily: "Bride's family card",
    compliments: 'Compliments card',
    note: 'Note card',
  };

  /**
   * Show/hide one removable card and manage its edit-mode chrome.
   * Returns whether the card should go on to render its content at all.
   */
  function applyCardState(key, branch) {
    const card = document.querySelector('[data-card="' + key + '"]');
    if (!card) return true;

    // Undefined counts as on: a config saved before this existed has no flag,
    // and those invitations must not silently lose their cards.
    const on = branch.enabled !== false;
    const editing = PC.mode === 'edit';

    card.hidden = !on;

    // The restore slot is a sibling of the card, created on demand so the
    // static markup stays clean.
    let slot = card.parentNode.querySelector('[data-card-slot="' + key + '"]');
    if (!on && editing) {
      if (!slot) {
        slot = document.createElement('div');
        slot.className = 'card-slot';
        slot.dataset.cardSlot = key;
        card.parentNode.insertBefore(slot, card.nextSibling);
      }
      slot.innerHTML =
        '<span class="card-slot__text">' + PC.esc(CARD_LABEL[key] || 'Card') + ' removed</span>' +
        '<button type="button" class="card-slot__btn" data-action="card-restore" data-card="' + key + '">' +
        '+ Add it back</button>';
      slot.hidden = false;
    } else if (slot) {
      slot.hidden = true;
    }

    // The remove chip lives on the card itself, added once.
    if (on && editing && PC.canEdit(key)) {
      let chip = card.querySelector('.card-remove');
      if (!chip) {
        chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'card-remove';
        chip.dataset.action = 'card-remove';
        chip.dataset.card = key;
        chip.setAttribute('aria-label', 'Remove ' + (CARD_LABEL[key] || 'card'));
        chip.title = 'Remove this card';
        chip.innerHTML = '&times; Remove card';
        card.appendChild(chip);
      }
      chip.hidden = false;
    } else {
      const chip = card.querySelector('.card-remove');
      if (chip) chip.hidden = true;
    }

    return on;
  }

  // ---- Hero names -----------------------------------------------------------
  // .bride-name/.groom-name size themselves off the viewport (clamp(...) in
  // styles.css), which handles ordinary names fine but knows nothing about
  // the STRING itself - a long name (or two words typed as one, with no
  // space to wrap at) can still run past the edge of a narrow phone screen
  // at the clamp's own minimum. Shrunk here instead: read how wide the text
  // actually rendered (scrollWidth) against how much room it has
  // (clientWidth - a block-level child of width:100% .couple, so this IS the
  // available width), and step the font down in inline px until it fits or
  // hits a floor.
  //
  // This only works because styles.css keeps the element on ONE line
  // (white-space: nowrap) by default - wrapping is what a browser does
  // instead of overflowing, and a wrapped line's scrollWidth never exceeds
  // its clientWidth, so the shrink below would never see a reason to fire.
  // Only once the floor is hit and it STILL doesn't fit does this add
  // .name-wrap, which is what actually lets styles.css wrap the line (and
  // break mid-word if it must) as the true last resort.
  const NAME_FONT_FLOOR = 18;

  function fitNameToWidth(el) {
    if (!el) return;
    // Clear back to the CSS-defined (clamp) size and undo any previous
    // last-resort wrap before measuring, so a shorter edit or a wider
    // viewport can recover rather than only ever shrinking/wrapping further
    // from whatever the last pass left behind.
    el.style.fontSize = '';
    el.classList.remove('name-wrap');
    if (!el.textContent || !el.textContent.trim()) return;
    let size = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > el.clientWidth + 1 && size > NAME_FONT_FLOOR) {
      size -= 1;
      el.style.fontSize = size + 'px';
    }
    if (el.scrollWidth > el.clientWidth + 1) el.classList.add('name-wrap');
  }

  function fitNames() {
    fitNameToWidth($('pcBrideName'));
    fitNameToWidth($('pcGroomName'));
  }

  function renderNames() {
    editable($('pcBrideName'), 'brideName', cfg.brideName, { placeholder: 'Bride' });
    editable($('pcGroomName'), 'groomName', cfg.groomName, { placeholder: 'Groom' });
    fitNames();
  }

  // Re-fit on resize (rotating a phone, or a desktop window narrowing) and
  // once webfonts actually finish loading - a size fitted against the
  // fallback font can be wrong once the real one swaps in (FOUT), since
  // glyph widths differ between the two.
  window.addEventListener('resize', fitNames);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitNames).catch(function () {});
  }

  // Live while a host types, not just on the next full render - editor-kit's
  // shared [data-edit] wiring updates cfg and the DOM's own text directly on
  // 'input' without calling back into this template, so the fit needs its
  // own listener rather than piggybacking on renderNames().
  document.addEventListener('input', function (e) {
    const el = e.target;
    if (el && (el.id === 'pcBrideName' || el.id === 'pcGroomName')) fitNameToWidth(el);
  });

  // ---- Opening invocation --------------------------------------------------
  // Same contract as rose-invitation's renderInvocation(): a religion + script
  // selection resolves to exactly ONE line - the tradition's native script in
  // its own font and direction, OR the English transliteration, never both -
  // with an optional symbol above it.
  function renderInvocation() {
    const inner = document.querySelector('.intro__inner');
    if (!inner) return;

    const sym = PC.symbolById(cfg.invocation.symbol);
    const symEl = inner.querySelector('.intro__symbol');
    if (symEl) {
      if (sym.src) {
        // A mask rather than an <img src>, so CSS tints the symbol to the same
        // ink as the line instead of showing the artwork's own colours.
        symEl.style.webkitMaskImage = "url('" + sym.src + "')";
        symEl.style.maskImage = "url('" + sym.src + "')";
        symEl.hidden = false;
      } else {
        symEl.hidden = true;
      }
    }

    const line = PC.invocationLines(cfg.invocation);
    const lineEl = $('pcInvocation');
    if (lineEl) {
      if (line.text) {
        lineEl.hidden = false;
        lineEl.textContent = line.text;
        // English falls back to the template's serif: the Noto faces are script
        // display faces and read oddly for a full English sentence.
        lineEl.style.fontFamily = line.isEnglish
          ? 'var(--font-serif)'
          : (line.font ? '"' + line.font + '", var(--font-serif)' : '');
        lineEl.setAttribute('dir', line.rtl ? 'rtl' : 'ltr');
      } else {
        // 'blank', or a custom line the host has emptied.
        lineEl.hidden = true;
      }
    }

    // Edit affordance: one button that opens the picker. canEdit keeps the
    // trial sandbox honest about its allowlist.
    let btn = inner.querySelector('.edit-symbol-btn');
    if (PC.mode === 'edit' && PC.canEdit('invocation.religion') && !btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'edit-symbol-btn';
      btn.dataset.action = 'invocation-pick';
      btn.textContent = 'Change invocation ▾';
      inner.insertBefore(btn, inner.firstChild);
    }
  }

  /**
   * Fill one element with the guest's name, or hide it.
   *
   * The name is NOT config - it comes from ?to= per invite - so this is the
   * same three-way decision everywhere it appears: the host editing sees a
   * locked placeholder so they know the slot exists; a common link has no one
   * guest to name and shows nothing; a personalised link prints the name.
   * Shared by the intro cover and the closing line, because two copies of this
   * would eventually disagree about one of those three cases.
   */
  function renderGuestName(el) {
    if (!el) return;

    if (PC.mode === 'edit') {
      el.hidden = false;
      el.textContent = 'Guest name (filled in automatically per invite)';
      el.classList.add('edit-guest');
      el.setAttribute('data-locked', '1');
      el.title = 'Filled in automatically for each guest - not editable here';
      return;
    }

    el.classList.remove('edit-guest');
    el.removeAttribute('data-locked');
    el.removeAttribute('title');

    if (PC.commonLink) { el.hidden = true; return; }
    const name = PC.guestName ? PC.guestName() : '';
    if (!name) { el.hidden = true; return; }
    el.hidden = false;
    el.textContent = name;
  }

  // ---- Intro cover: note + guest greeting -----------------------------------
  function renderIntro() {
    editable($('pcIntroNote'), 'introNote', cfg.introNote, {
      multiline: true,
      placeholder: 'Write your invitation note…',
    });

    renderGuestName($('pcGuestGreeting'));
  }

  // ---- Closing line, under the media row ------------------------------------
  function renderFarewell() {
    renderGuestName($('pcFarewellGuest'));
  }

  // ---- Family cards -----------------------------------------------------------
  function renderFamily(prefix, path, family) {
    // Removed: nothing inside needs wiring, and the fields must NOT be made
    // editable - a contenteditable in a hidden card is a focus trap.
    if (!applyCardState(path, family)) return;

    editable($(prefix + 'CardName'), path + '.name', family.name, { placeholder: 'Full name' });
    editable($(prefix + 'RelLabel'), path + '.relLabel', family.relLabel, { placeholder: 'e.g. Son of' });
    editable($(prefix + 'ParentA'), path + '.parentA', family.parentA, { placeholder: "Parent's name" });
    editable($(prefix + 'ParentB'), path + '.parentB', family.parentB, { placeholder: "Parent's name" });
    editable($(prefix + 'GrandLabel'), path + '.grandLabel', family.grandLabel, { placeholder: 'e.g. Grandson of' });
    editable($(prefix + 'GrandA'), path + '.grandA', family.grandA, { placeholder: "Grandparent's name" });
    editable($(prefix + 'GrandB'), path + '.grandB', family.grandB, { placeholder: "Grandparent's name" });

    // The label as well as the value. "Gotra" is one community's word for it,
    // so a host who needs a different one (or none) can now say so.
    //
    // Defaulted HERE rather than relying on the config: editable() writes
    // `value || ''`, so an invitation saved before this field existed would
    // have had the word silently erased from its cards on the next render.
    editable($(prefix + 'GotraLabel'), path + '.gotraLabel', family.gotraLabel || 'Gotra', { placeholder: 'Gotra' });
    editable($(prefix + 'Gotra'), path + '.gotra', family.gotra, { placeholder: 'Bharadwaj' });

    // Rose's rule, ported: a row a family did not fill is dropped from the
    // guest's card rather than printed as a dangling label ("Granddaughter of"
    // with nobody after it, or a bare "Gotra:"). While EDITING both stay, or
    // there would be no field to type the missing name into.
    //
    // Grandparents go together: rose keeps the block when either name is set,
    // since "Grandson of X" alone is a legitimate line.
    var editing = PC.mode === 'edit';
    var grandRow = $(prefix + 'GrandLabel');
    grandRow = grandRow && grandRow.closest('.card__block');
    if (grandRow) {
      grandRow.hidden = !(editing || (family.grandA || '').trim() || (family.grandB || '').trim());
    }
    var gotraRow = $(prefix + 'Gotra');
    gotraRow = gotraRow && gotraRow.closest('.card__gotra');
    if (gotraRow) {
      gotraRow.hidden = !(editing || (family.gotra || '').trim());
    }
  }

  // ---- Gallery: photo carousel + keepsake-note carousel -----------------------
  // Two carousels, each up to GALLERY_MAX. The ORNATE FRAME (border + opening) is
  // fixed and static in index.html; only the content INSIDE its opening changes.
  // render.js fills each frame's inner reel with one cell per photo/note; app.js
  // slides the reel behind the clipped opening (cord pull / arrow). The Add and
  // Remove controls (edit only) are static too - we just toggle their visibility.
  const GALLERY_MAX = 5;

  // Placeholder shown in an empty photo cell (a picture icon on grey) so it reads
  // as "a photo goes here". The "Tap to add" line is appended only in edit mode.
  const IMG_ICON =
    '<svg class="frame__ph-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="3" y="3" width="18" height="18" rx="2.5" />' +
    '<circle cx="8.5" cy="9" r="1.8" />' +
    '<path d="M21 15.5 16 10.5 5 21.5" />' +
    '</svg>';

  const GALLERY_LABEL = {
    photos: 'Photo gallery',
    notes: 'Keepsake notes',
  };

  /**
   * applyCardState's contract, for the two gallery carousels: hide a removed
   * one, offer a restore slot in its place while editing, and put a remove chip
   * on a live one. Returns whether the carousel should render its content.
   *
   * A separate function rather than a call into applyCardState because these
   * are not [data-card] elements and their flags hang off cfg.gallery rather
   * than off a top-level branch - the two things that helper hard-codes.
   * The chrome reuses .card-remove / .card-slot so the two removals look and
   * behave alike; .gallery__pager is already position:relative, which is all
   * the absolutely-positioned chip needs.
   */
  function applyGalleryState(kind) {
    const pager = document.querySelector('.gallery__pager[data-gallery="' + kind + '"]');
    if (!pager) return true;

    const flag = kind === 'photos' ? 'photosEnabled' : 'notesEnabled';
    // Undefined counts as on - see the DEFAULTS note in config.js.
    const on = cfg.gallery[flag] !== false;
    const editing = PC.mode === 'edit';
    const canEdit = editing && PC.canEdit('gallery.' + kind);

    pager.hidden = !on;

    let slot = pager.parentNode.querySelector('[data-gallery-slot="' + kind + '"]');
    if (!on && editing) {
      if (!slot) {
        slot = document.createElement('div');
        slot.className = 'card-slot';
        slot.dataset.gallerySlot = kind;
        pager.parentNode.insertBefore(slot, pager.nextSibling);
      }
      slot.innerHTML =
        '<span class="card-slot__text">' + PC.esc(GALLERY_LABEL[kind]) + ' removed</span>' +
        '<button type="button" class="card-slot__btn" data-action="gallery-section-restore" ' +
        'data-kind="' + kind + '">+ Add it back</button>';
      slot.hidden = false;
    } else if (slot) {
      slot.hidden = true;
    }

    if (on && canEdit) {
      let chip = pager.querySelector('.card-remove');
      if (!chip) {
        chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'card-remove';
        chip.dataset.action = 'gallery-section-remove';
        chip.dataset.kind = kind;
        chip.setAttribute('aria-label', 'Remove the ' + GALLERY_LABEL[kind].toLowerCase());
        chip.title = 'Remove this section';
        chip.innerHTML = '&times; Remove section';
        pager.appendChild(chip);
      }
      chip.hidden = false;
    } else {
      const chip = pager.querySelector('.card-remove');
      if (chip) chip.hidden = true;
    }

    return on;
  }

  function updateGalleryControls(kind, addId, canEdit, count) {
    const add = $(addId);
    if (add) add.hidden = !(canEdit && count < GALLERY_MAX);
    // Both reels may go down to none: each has a trailing add-cell that is
    // always there to start again, so there is nothing to protect.
    const rm = document.querySelector('.gallery__pager[data-gallery="' + kind + '"] .gallery__remove');
    if (rm) rm.hidden = !(canEdit && count > 0);
    // Reorder appears under the same condition as remove: editing, and with
    // something to reorder against. app.js handles which of its two arrows is
    // live once it is on screen.
    const mv = document.querySelector('.gallery__pager[data-gallery="' + kind + '"] .gallery__reorder');
    if (mv) mv.hidden = !(canEdit && count > 1);
  }

  // A photo is stored either as a plain URL (legacy) or an object carrying its
  // in-frame adjustment: src + object-position (px/py, 0–100%) + zoom. Normalise
  // to the object form for rendering. editor.js mutates the stored object.
  function photoOf(p) {
    const o = (p && typeof p === 'object') ? p : { src: (typeof p === 'string' ? p : '') };
    return {
      src: o.src || '',
      px: o.px == null ? 50 : o.px,
      py: o.py == null ? 50 : o.py,
      // 1.2, not 1: at zoom 1, object-fit:cover fills one axis exactly (zero
      // crop slack there), so dragging on THAT axis has nothing to reveal -
      // only the other axis pans. The small default overzoom guarantees both
      // axes always have crop room to drag through.
      zoom: o.zoom || 1.2,
    };
  }
  PC.photoOf = photoOf; // editor.js reuses it

  /**
   * The photos actually worth showing, with any blanks dropped - and the stored
   * array rewritten to match.
   *
   * An empty entry used to be how a slot was "reserved": + Add photo pushed ''
   * and the host filled it afterwards. Leave one unfilled and it stayed in the
   * array forever, so a gap appeared BETWEEN real photos and no amount of
   * adding could close it. Nothing reserves a slot any more (see gallery-add in
   * editor.js), and compacting here also cleans up invitations already saved
   * with a hole in them.
   */
  function livePhotos() {
    const raw = Array.isArray(cfg.gallery.photos) ? cfg.gallery.photos : [];
    const live = raw.filter((p) => photoOf(p).src);
    if (live.length !== raw.length) cfg.gallery.photos = live;
    return live;
  }

  // DEFAULTS.gallery.photos (config.js) ships three sample images so a
  // brand-new invitation shows a working carousel while a host is still
  // editing. They are never real content though - outside the editor
  // (preview or the guest-facing page) they should read as "no photos yet",
  // not as three photos the host apparently chose. Identified by path rather
  // than a flag on the config, since these are never persisted differently
  // from a real photo otherwise.
  const PLACEHOLDER_PHOTO_RE = /^media\/photo-placeholder-\d+\.svg$/;
  function isPlaceholderPhoto(src) {
    return PLACEHOLDER_PHOTO_RE.test(src || '');
  }

  function renderGalleryPhotos() {
    const reel = $('pcGalleryPhotoTrack');
    if (!reel) return;
    // Removed: applyGalleryState has hidden the pager and drawn the restore
    // slot, and there is nothing to fill a hidden reel with.
    if (!applyGalleryState('photos')) return;
    const canEdit = PC.mode === 'edit' && PC.canEdit('gallery.photos');
    let photos = livePhotos();
    if (!canEdit) photos = photos.filter((p) => !isPlaceholderPhoto(photoOf(p).src));

    const cells = photos.map((p, i) => {
      const o = photoOf(p);
      // Filled cell - the image, positioned/zoomed per its adjustment. In edit
      // the view is draggable (pan) + scroll-zoom; a plain tap (no drag)
      // opens the picker to replace it (see endPan in editor.js) - the same
      // thing the small ↺ control in frame__adjust does, just reachable from
      // the photo itself rather than a small button underneath.
      const style = 'object-position:' + o.px + '% ' + o.py + '%;transform:scale(' + o.zoom + ')';
      return '<li class="frame__cell">' +
        '<div class="frame__photo-view' + (canEdit ? ' is-adjustable' : '') + '"' +
        (canEdit ? ' data-idx="' + i + '" title="Tap to replace · drag to reposition · scroll to zoom"' : '') + '>' +
        '<img class="frame__photo" src="' + PC.esc(o.src) + '" alt="" style="' + style + '" draggable="false">' +
        '</div>' +
        '</li>';
    });

    // ONE empty cell, always last, and only while editing with room to spare.
    // It is the add target rather than a stored slot: picking here appends
    // (its data-idx is one past the end), so nothing is reserved and no blank
    // can end up between two photos. Guests never see it - with no photos at
    // all they get an empty reel and the pager hides itself.
    if (canEdit && photos.length < GALLERY_MAX) {
      cells.push(
        '<li class="frame__cell">' +
        '<button type="button" class="frame__photo-btn" data-action="gallery-photo" ' +
        'data-idx="' + photos.length + '" aria-label="Add a photograph">' +
        '<span class="frame__ph">' + IMG_ICON +
        '<span class="frame__ph-text">Tap to add a photograph</span>' +
        '</span>' +
        '</button>' +
        '</li>'
      );
    }

    reel.innerHTML = cells.join('');

    // No photos and not editing: there is nothing to frame, so the whole pager
    // goes rather than showing a guest an empty opening. (It used to default to
    // one blank entry, which is exactly the placeholder-nobody-asked-for this
    // change removes.)
    const pager = document.querySelector('.gallery__pager[data-gallery="photos"]');
    if (pager) pager.hidden = !canEdit && photos.length === 0;

    // Counted on real photos: the trailing add-cell is chrome, and counting it
    // would offer a Remove for a photo that does not exist.
    updateGalleryControls('photos', 'pcGalleryPhotoAdd', canEdit, photos.length);
  }

  /**
   * The notes with something written in them, and the stored array rewritten to
   * match - the same compaction livePhotos() does, for the same reason: a blank
   * left in the middle of the list showed a guest an empty frame between two
   * real notes.
   *
   * Compaction runs only when NOT editing. A note is typed in place, so it is
   * necessarily empty for as long as it takes to write the first character;
   * dropping it mid-render would pull the field out from under the caret.
   */
  function liveNotes(canEdit) {
    const raw = Array.isArray(cfg.gallery.notes) ? cfg.gallery.notes : [];
    if (canEdit) return raw;
    const live = raw.filter((n) => (n || '').trim());
    if (live.length !== raw.length) cfg.gallery.notes = live;
    return live;
  }

  function renderGalleryNotes() {
    const reel = $('pcGalleryNoteTrack');
    if (!reel) return;
    if (!applyGalleryState('notes')) return;
    const canEdit = PC.mode === 'edit' && PC.canEdit('gallery.notes');
    const notes = liveNotes(canEdit);

    const cells = notes.map((_, i) => (
      '<li class="frame__cell frame__cell--text">' +
      '<p class="frame__text" data-note-idx="' + i + '"></p>' +
      '</li>'
    ));

    // The add target, last and edit-only - the counterpart of the photo reel's
    // empty cell. Writing in it appends, so no blank note is stored up front.
    if (canEdit && notes.length < GALLERY_MAX) {
      cells.push(
        '<li class="frame__cell frame__cell--text">' +
        '<button type="button" class="frame__note-btn" data-action="gallery-add" data-kind="notes">' +
        '<span class="frame__ph-text">Tap to add a note</span>' +
        '</button>' +
        '</li>'
      );
    }

    reel.innerHTML = cells.join('');

    reel.querySelectorAll('[data-note-idx]').forEach((el) => {
      const i = +el.dataset.noteIdx;
      editable(el, 'gallery.notes.' + i, notes[i], { multiline: true, placeholder: 'Write a keepsake note…' });
    });

    // Nothing written and nobody editing: no frame rather than an empty one.
    const pager = document.querySelector('.gallery__pager[data-gallery="notes"]');
    if (pager) pager.hidden = !canEdit && notes.length === 0;

    updateGalleryControls('notes', 'pcGalleryNoteAdd', canEdit, notes.length);
  }

  function renderGallery() {
    renderGalleryPhotos();
    renderGalleryNotes();

    // .gallery holds nothing but these two pagers, so once both are gone all a
    // guest would scroll through is the section's own padding. Read back the
    // pagers' rendered state rather than the config flags: that also covers the
    // half that hides itself for having no content, so one test handles both
    // reasons a pager can be absent.
    // The host always keeps the section - the restore slots live in it.
    const section = document.querySelector('.gallery');
    if (section) {
      const anyShown = Array.prototype.slice
        .call(section.querySelectorAll('.gallery__pager'))
        .some((p) => !p.hidden);
      section.hidden = PC.mode !== 'edit' && !anyShown;
    }

    // Let app.js (re)position the pagers against the fresh slides.
    document.dispatchEvent(new CustomEvent('papercut:gallery-rendered'));
  }

  // ---- Ceremonies carousel ----------------------------------------------------
  // A fixed three-card carousel (artwork is part of the design; the couple edits
  // name/date/time/venue). Built here rather than mutated by id because the cards
  // repeat: each field is emitted with a data-cfield marker, then editable() wires
  // it to its ceremonies.<i>.<field> path. app.js reads the built cards to run the
  // slide (view/preview) or leaves them in place (edit).
  // Outlined pin, the same drawing rose-invitation uses (its .cere-card__pin).
  // Stroked in currentColor rather than filled, so it takes the venue line's
  // own colour instead of carrying a solid disc of --ceremony-ink.
  const PIN_SVG =
    '<svg class="ceremony__pin" viewBox="0 0 24 24" width="18" height="18" fill="none" ' +
    'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true">' +
    '<path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z" />' +
    '<circle cx="12" cy="10" r="2.4" />' +
    '</svg>';

  // The chevron marks the venue as tappable, so it only earns its place when
  // the venue actually opens something. A ceremony's own mapUrl wins; with none
  // set this falls back to a maps SEARCH on the venue text, which is what every
  // ceremony used before the field existed. Empty both ways: no link, no
  // chevron. (Same precedence as rose-invitation's mapLink.)
  function mapLink(c) {
    const raw = ((c && c.mapUrl) || '').trim();
    if (/^https?:\/\//i.test(raw)) return raw;
    const v = ((c && c.venue) || '').trim();
    return v ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(v) : '';
  }

  // ---- Date / time display ----------------------------------------------------
  // Stored ISO, shown long. Anything that is NOT an ISO date is passed straight
  // through: invitations saved before this change hold free text like
  // "Wed, 4 Feb 2026", and those must keep reading correctly rather than
  // blanking out. The date input simply stays empty for them until the host
  // picks a date, which then converts that ceremony to the ISO form.
  const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

  function fmtCeremonyDate(value) {
    const s = (value || '').trim();
    if (!s) return '';
    if (!ISO_DATE.test(s)) return s;
    const d = new Date(s + 'T00:00:00');
    if (isNaN(d)) return s;
    return d.toLocaleDateString('en-GB', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });
  }

  // '19:30' -> '7:30 PM'. Free text (an older config) passes through.
  function fmtCeremonyTime(value) {
    const s = (value || '').trim();
    if (!s) return '';
    const m = s.match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return s;
    const h = +m[1];
    const min = m[2];
    if (isNaN(h)) return s;
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ':' + min + ' ' + (h < 12 ? 'AM' : 'PM');
  }

  function renderCeremonies() {
    const track = $('pcCeremonyTrack');
    if (!track) return;
    const all = cfg.ceremonies || [];
    const editing = PC.mode === 'edit';

    // Guests see only the ceremonies the host kept; the host sees every entry,
    // excluded ones included, so they can put one back.
    //
    // Index BEFORE filtering, so `i` is always the position in the real config
    // array. Numbering the survivors instead would renumber every ceremony
    // after an excluded one, and each card's edit paths point at its index.
    const list = all
      .map((c, i) => ({ c: c, i: i }))
      .filter((entry) => editing || entry.c.enabled !== false);

    track.innerHTML = list.map((entry) => {
      const c = entry.c;
      const i = entry.i;
      const off = c.enabled === false;

      // In edit mode the venue is contenteditable, so it stays a <p>: wrapping
      // a field the host types into inside an <a> means every click follows the
      // link instead of placing the caret. Same split rose makes.
      const link = editing ? '' : mapLink(c);
      const where = link
        ? '<a class="ceremony__where ceremony__where--link" href="' + PC.esc(link) + '" ' +
          'target="_blank" rel="noopener">' + PIN_SVG +
          '<span data-cfield="venue"></span>' +
          '<span class="ceremony__go" aria-hidden="true">›</span></a>'
        : '<p class="ceremony__where">' + PIN_SVG + '<span data-cfield="venue"></span></p>';

      // Native pickers rather than free text: the host gets their platform's
      // own calendar and clock, and the stored value is unambiguous. `value`
      // is only set for an ISO string - handing a native date input
      // "Wed, 4 Feb 2026" makes it render blank AND report itself valid.
      const when = editing
        ? '<p class="ceremony__when ceremony__when--edit">' +
          '<input type="date" class="cere-field" aria-label="Ceremony date" ' +
          'data-edit-input="ceremonies.' + i + '.date" value="' +
          (ISO_DATE.test((c.date || '').trim()) ? PC.esc(c.date) : '') + '">' +
          '<input type="time" class="cere-field" aria-label="Ceremony time" ' +
          'data-edit-input="ceremonies.' + i + '.time" value="' + PC.esc(c.time || '') + '">' +
          '</p>'
        : '<p class="ceremony__when">' +
          '<span>' + PC.esc(fmtCeremonyDate(c.date)) + '</span>' +
          '<span>' + PC.esc(fmtCeremonyTime(c.time)) + '</span>' +
          '</p>';

      // Pasting a share link is the reliable way to point at an exact venue -
      // a search on the name can land on the wrong branch of it.
      const maps = editing
        ? '<label class="cere-maps">' +
          '<span class="cere-maps__label">Maps link</span>' +
          '<input type="url" class="cere-field" data-edit-input="ceremonies.' + i + '.mapUrl" ' +
          'placeholder="Paste a Google Maps link (optional)" value="' + PC.esc(c.mapUrl || '') + '">' +
          '</label>'
        : '';

      // Include/exclude, so a ceremony can be dropped and brought back without
      // the host having to retype it.
      const toggle = editing
        ? '<label class="cere-toggle" title="Include this ceremony in the invitation">' +
          '<input type="checkbox" data-edit-toggle="ceremonies.' + i + '.enabled"' +
          (off ? '' : ' checked') + '>' +
          '<span>' + (off ? 'Not included' : 'Included') + '</span></label>'
        : '';

      return '<li class="ceremony' + (off ? ' ceremony--off' : '') + '">' +
        '<article class="ceremony__card">' +
        toggle +
        '<img class="ceremony__art" src="' + PC.esc(c.art) + '" alt="' + PC.esc(c.name) + '" loading="lazy" decoding="async">' +
        '<h3 class="ceremony__name" data-cfield="name"></h3>' +
        when +
        where +
        maps +
        '</article>' +
        '</li>';
    }).join('');

    // Bind against the entry's index in the FULL array, not its position in the
    // row. Those differ for a guest the moment a ceremony is excluded, and
    // binding to the row position would write the edit into the wrong entry.
    // Date and time are inputs now (see `when` above), so only name and venue
    // are still contenteditable here.
    const items = track.children;
    const PLACE = { name: 'Ceremony', venue: 'Venue' };
    for (let row = 0; row < items.length; row++) {
      const entry = list[row];
      if (!entry) continue;
      items[row].querySelectorAll('[data-cfield]').forEach((el) => {
        const f = el.dataset.cfield;
        editable(el, 'ceremonies.' + entry.i + '.' + f, entry.c[f], { placeholder: PLACE[f] });
      });
    }

    // Let app.js (re)build its slide against the fresh cards.
    document.dispatchEvent(new CustomEvent('papercut:ceremonies-rendered'));

    // Keep the RSVP shop-window preview in step with every toggle/date edit -
    // see syncRsvpEvents below, which does the actual translation.
    syncRsvpEvents();
  }

  // The shared RSVP section (_platform/rsvp.js) has no idea what a "ceremony"
  // is - it only wants "here are the included events, by name and date". This
  // is the generic 'balcony:rsvp-events-changed' contract any template can
  // implement; rose-invitation does the same translation for its own shape.
  // Papercut's ceremony objects already carry name/date directly (no id ->
  // catalog lookup like rose needs), so the mapping is just a filter.
  function syncRsvpEvents() {
    const events = cfg.ceremonies
      .filter((c) => c.enabled)
      .map((c, i) => ({ key: String(i), name: c.name, date: c.date || null }));
    document.dispatchEvent(new CustomEvent('balcony:rsvp-events-changed', { detail: { events } }));
  }

  // rsvp.js asks once for the current state on mount, in case its own init
  // runs before renderCeremonies has fired at least once.
  document.addEventListener('balcony:rsvp-events-request', syncRsvpEvents);


  // ---- Compliment card --------------------------------------------------------
  // A lead line + any number of name lines (add/remove in the editor). Empty of
  // content → dropped from the guest view (like rose-invitation).
  function renderCompliments() {
    const scene = document.querySelector('.scene--compliment');
    if (!scene) return;
    const box = $('pcComplimentLines');
    const editing = PC.mode === 'edit';
    const canEdit = editing && PC.canEdit('compliments.lines');
    const lines = Array.isArray(cfg.compliments.lines) ? cfg.compliments.lines : [];
    const hasContent = lines.some((l) => (l || '').trim());

    const on = applyCardState('compliments', cfg.compliments);

    // Two separate reasons a guest may not see this card, and both still hold:
    // the host removed it, or it was left empty. The scene stays in the flow
    // while editing so the restore slot has somewhere to sit.
    if (!editing) {
      scene.hidden = !(on && hasContent);
      if (scene.hidden) return;
    } else {
      scene.hidden = false;
      if (!on) return;
    }

    editable($('pcComplimentLead'), 'compliments.lead', cfg.compliments.lead, {
      placeholder: 'With Best Compliments From:',
    });

    box.innerHTML = lines.map((_, i) => (
      '<p class="compliment__line">' +
      '<span class="card__elder" data-cl-idx="' + i + '"></span>' +
      (canEdit ? '<button type="button" class="card-line-x" data-action="compliment-line-remove" data-idx="' + i + '" aria-label="Remove line">✕</button>' : '') +
      '</p>'
    )).join('');

    box.querySelectorAll('[data-cl-idx]').forEach((el) => {
      const i = +el.dataset.clIdx;
      editable(el, 'compliments.lines.' + i, lines[i], { placeholder: 'Name & Family (relation)' });
    });

    const add = $('pcComplimentAdd');
    if (add) add.hidden = !canEdit;
  }

  // ---- Note card --------------------------------------------------------------
  // A free-form message from the couple. Empty → dropped from the guest view.
  function renderNote() {
    const scene = document.querySelector('.scene--note');
    if (!scene) return;
    const editing = PC.mode === 'edit';
    const hasContent = (cfg.note.text || '').trim();

    const on = applyCardState('note', cfg.note);

    if (!editing) {
      scene.hidden = !(on && hasContent);
      if (scene.hidden) return;
    } else {
      scene.hidden = false;
      if (!on) return;
    }

    editable($('pcNoteLead'), 'note.lead', cfg.note.lead, { placeholder: 'A Note From Us' });
    editable($('pcNoteText'), 'note.text', cfg.note.text, {
      multiline: true,
      placeholder: 'Write any extra notes for your guests…',
    });
  }

  // ---- Date reveal ------------------------------------------------------------
  // Only the text and the blooms; the mechanism itself is date-reveal.js, which
  // decides whether the section appears at all (it needs a date to reveal) and
  // owns the dials. Nothing here writes the date - that is the whole point of
  // the section, and this function runs on every keystroke in edit mode.
  //
  // "Reveal our date" stays config-driven rather than inline-editable, matching
  // the template's other button labels ("Tap to open", "Tap to reveal the date"),
  // none of which are editable in place either.
  function renderDateReveal() {
    const scene = $('pcDateReveal');
    if (!scene) return;
    const dr = cfg.dateReveal || {};

    // The lead is optional and ships empty - the design has no heading over
    // the plaques. Guests only see it if the host writes one; the host always
    // sees it, or there would be nothing to write into.
    const lead = $('pcRevealLead');
    if (lead) {
      lead.hidden = PC.mode !== 'edit' && !(dr.lead || '').trim();
      editable(lead, 'dateReveal.lead', dr.lead, { placeholder: 'A line above the date…' });
    }

    const label = $('pcRevealBtnLabel');
    if (label) label.textContent = dr.buttonLabel || 'Reveal the Date!';

    // Shown in the button's place after the reveal; date-reveal.js decides
    // when, this only decides what it says.
    const after = $('pcRevealAfter');
    if (after) after.textContent = dr.revealedLabel || 'Save the Date';

    const blooms = [['pcRevealBloomLeft', dr.bloomLeft], ['pcRevealBloomRight', dr.bloomRight]];
    blooms.forEach(([id, src]) => {
      const el = $(id);
      if (el && src) el.setAttribute('src', src);
    });

    // The wedding-date picker. It used to hang off the .datecard plaque in the
    // pond section; that section is gone and this is now the only place the
    // date appears, so the control moves here with it. Added once and left in
    // place - editor.js calls this renderer again after every pick.
    if (PC.mode === 'edit' && PC.canEdit('eventDay') && !scene.querySelector('.edit-date-btn')) {
      const card = scene.querySelector('.reveal-card');
      if (card) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'edit-date-btn';
        btn.dataset.action = 'date-pick';
        btn.textContent = 'Pick a date ▾';
        card.appendChild(btn);
      }
    }

    // Re-settle the dials when the host moves the date. A no-op on first render,
    // because date-reveal.js has not run yet; from then on it keeps the editor's
    // preview honest.
    if (PC.dateReveal) PC.dateReveal.refresh();
  }

  // ---- Media row: the Instagram button ----------------------------------------
  // The one removable icon in the row - locations and calendar are derived from
  // the ceremonies, but not every couple has a page to share. Same contract as
  // applyCardState: guests never see a removed button; the host gets a remove
  // chip on a live one and an "add it back" pill in its place once it is off.
  function renderSocial() {
    const igBtn = $('pcIgBtn');
    if (!igBtn) return;
    if (!cfg.social) cfg.social = { instagram: true, instagramUrl: '' };
    // Undefined counts as on - see the DEFAULTS note in config.js.
    const on = cfg.social.instagram !== false;
    const canEdit = PC.mode === 'edit' && PC.canEdit('social');

    igBtn.hidden = !on;
    if (!canEdit) return;

    // Wrapped once, so the chip can pin to the icon's corner.
    let wrap = igBtn.parentElement.classList.contains('social-wrap') ? igBtn.parentElement : null;
    if (!wrap) {
      wrap = document.createElement('span');
      wrap.className = 'social-wrap';
      igBtn.replaceWith(wrap);
      wrap.appendChild(igBtn);

      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'social-remove';
      chip.dataset.action = 'social-remove';
      chip.setAttribute('aria-label', 'Remove the Instagram button');
      chip.title = 'Remove Instagram';
      chip.innerHTML = '&times;';
      wrap.appendChild(chip);

      const restore = document.createElement('button');
      restore.type = 'button';
      restore.className = 'card-slot__btn social-restore';
      restore.dataset.action = 'social-restore';
      restore.textContent = '+ Add Instagram';
      wrap.appendChild(restore);
    }
    wrap.querySelector('.social-remove').hidden = !on;
    wrap.querySelector('.social-restore').hidden = on;
  }

  function renderAll() {
    renderNames();
    renderInvocation();
    renderIntro();
    renderFamily('pcGroom', 'groomFamily', cfg.groomFamily);
    renderFamily('pcBride', 'brideFamily', cfg.brideFamily);
    renderGallery();
    renderCeremonies();
    renderCompliments();
    renderNote();
    renderDateReveal();
    renderSocial();
    renderFarewell();
  }

  // Published for social.js, which builds the locations and calendar popups
  // from the same ceremonies these format for the ceremony cards. Shared rather
  // than reimplemented: two copies of "how this template writes a date" would
  // drift, and the popup would then disagree with the card it came from.
  PC.mapLink = mapLink;
  PC.fmtCeremonyDate = fmtCeremonyDate;
  PC.fmtCeremonyTime = fmtCeremonyTime;

  PC.render = {
    all: renderAll,
    names: renderNames,
    invocation: renderInvocation,
    intro: renderIntro,
    gallery: renderGallery,
    ceremonies: renderCeremonies,
    compliments: renderCompliments,
    note: renderNote,
    dateReveal: renderDateReveal,
    social: renderSocial,
    farewell: renderFarewell,
  };

  renderAll();
})();
