/*!
 * "Try it" opens the gift right here.
 *
 * Every Try-it link used to throw the visitor into a new tab, so picking a
 * second look meant coming back and starting again. Now the demo loads in a
 * phone-shaped frame over the page, with the gift's other looks as chips you
 * can flick between, and "Make this one" a tap away.
 *
 * Progressive: the links keep their href and target, so with JS off (or if
 * this file fails) they still open the demo the old way.
 */
(function (w, d) {
  'use strict';

  var DEMO = /\/gifts\/demo\/([a-z0-9-]+)/i;
  var modal = null, frame = null, titleEl = null, chipsEl = null, makeEl = null, noteEl = null;
  var lastFocus = null;

  function css() {
    if (d.getElementById('gp-modal-css')) return;
    var s = d.createElement('style');
    s.id = 'gp-modal-css';
    s.textContent = [
      '.gp-wrap{position:fixed;inset:0;z-index:4000;display:none;align-items:center;justify-content:center;',
      '  padding:clamp(12px,3vw,28px);background:rgba(8,6,28,.82);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}',
      '.gp-wrap.is-open{display:flex}',
      /* as a <dialog> it sits in the top layer, above other open dialogs
         (the homepage "Create a gift" picker is one) */
      'dialog.gp-wrap{width:100%;height:100%;max-width:none;max-height:none;margin:0;border:0;color:inherit;overflow:hidden}',
      'dialog.gp-wrap::backdrop{background:transparent}',
      '.gp-box{position:relative;display:flex;flex-direction:column;gap:12px;',
      '  height:100%;width:min(100%,430px);animation:gp-in .22s cubic-bezier(.34,1.56,.64,1)}',
      '@keyframes gp-in{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}',
      '@media (prefers-reduced-motion:reduce){.gp-box{animation:none}}',
      '.gp-head{display:flex;align-items:center;gap:10px;width:100%;color:#fff}',
      '.gp-title{font:800 1.02rem/1.25 system-ui,sans-serif;margin:0;flex:1;min-width:0;',
      '  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.gp-x{flex:0 0 auto;width:36px;height:36px;border-radius:50%;border:0;cursor:pointer;',
      '  background:rgba(255,255,255,.14);color:#fff;font-size:1.05rem;line-height:1;display:grid;place-items:center}',
      '.gp-x:hover{background:rgba(255,255,255,.26)}',
      '.gp-chips{display:flex;gap:7px;flex-wrap:wrap;width:100%}',
      '.gp-chip{border:1.5px solid rgba(255,255,255,.28);background:transparent;color:#fff;cursor:pointer;',
      '  border-radius:999px;padding:7px 13px;font:700 .76rem/1 system-ui,sans-serif;opacity:.82}',
      '.gp-chip:hover{opacity:1}',
      '.gp-chip.on{background:#fff;color:#141046;border-color:#fff;opacity:1}',
      '.gp-phone{position:relative;flex:1 1 auto;min-height:220px;width:100%;border-radius:26px;overflow:hidden;',
      '  background:#0b0830;border:1px solid rgba(255,255,255,.16);box-shadow:0 24px 60px rgba(0,0,0,.5)}',
      '.gp-phone iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#0b0830}',
      '.gp-spin{position:absolute;inset:0;display:grid;place-items:center;color:rgba(255,255,255,.7);',
      '  font:600 .82rem/1 system-ui,sans-serif}',
      '.gp-foot{display:flex;align-items:center;gap:10px;width:100%}',
      '.gp-note{flex:1;min-width:0;color:rgba(255,255,255,.62);font:500 .74rem/1.35 system-ui,sans-serif;margin:0}',
      '.gp-make{flex:0 0 auto;text-decoration:none;border-radius:999px;padding:11px 18px;',
      '  font:800 .84rem/1 system-ui,sans-serif;background:#FF3D7F;color:#fff;white-space:nowrap}',
      '.gp-make:hover{filter:brightness(1.08)}',
      'body.gp-locked{overflow:hidden}'
    ].join('');
    d.head.appendChild(s);
  }

  function build() {
    if (modal) return;
    css();
    var useDialog = typeof w.HTMLDialogElement === 'function' && 'showModal' in d.createElement('dialog');
    modal = d.createElement(useDialog ? 'dialog' : 'div');
    modal.className = 'gp-wrap';
    if (!useDialog) modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Gift preview');
    modal.innerHTML =
      '<div class="gp-box">' +
        '<div class="gp-head">' +
          '<p class="gp-title"></p>' +
          '<button type="button" class="gp-x" aria-label="Close preview">&#10005;</button>' +
        '</div>' +
        '<div class="gp-chips"></div>' +
        '<div class="gp-phone"><span class="gp-spin">Opening the gift…</span><iframe title="Gift preview" allow="autoplay; fullscreen"></iframe></div>' +
        '<div class="gp-foot">' +
          '<p class="gp-note">A live demo with sample words — yours will say what you write.</p>' +
          '<a class="gp-make" href="#">Make this one</a>' +
        '</div>' +
      '</div>';
    d.body.appendChild(modal);

    frame = modal.querySelector('iframe');
    titleEl = modal.querySelector('.gp-title');
    chipsEl = modal.querySelector('.gp-chips');
    makeEl = modal.querySelector('.gp-make');
    noteEl = modal.querySelector('.gp-spin');

    modal.querySelector('.gp-x').addEventListener('click', close);
    // Escape on a <dialog> fires "cancel"; close it our way (frame, focus, lock)
    modal.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
    // Escape here closes only the preview, not a picker dialog underneath
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
    });
    modal.addEventListener('mousedown', function (e) { if (e.target === modal) close(); });
    frame.addEventListener('load', function () {
      if (noteEl) noteEl.style.display = 'none';
      // the demo is same-origin, so its own Escape can reach us too
      try {
        frame.contentDocument.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') close();
        });
      } catch (err) {}
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
  }

  function show(url) {
    if (noteEl) noteEl.style.display = '';
    frame.src = url;
  }

  function open(info) {
    build();
    lastFocus = d.activeElement;
    titleEl.textContent = info.title || 'Preview';
    makeEl.href = info.make || ('/gifts/' + info.slug);

    chipsEl.innerHTML = '';
    if (info.looks.length > 1) {
      info.looks.forEach(function (look) {
        var b = d.createElement('button');
        b.type = 'button';
        b.className = 'gp-chip' + (look.url === info.url ? ' on' : '');
        b.textContent = look.label;
        b.addEventListener('click', function () {
          chipsEl.querySelectorAll('.gp-chip').forEach(function (x) { x.classList.remove('on'); });
          b.classList.add('on');
          show(look.url);
        });
        chipsEl.appendChild(b);
      });
    }
    chipsEl.style.display = info.looks.length > 1 ? '' : 'none';

    modal.classList.add('is-open');
    if (modal.showModal && !modal.open) {
      try { modal.showModal(); } catch (err) { /* not in the DOM yet or unsupported: the class still shows it */ }
    }
    d.body.classList.add('gp-locked');
    show(info.url);
    modal.querySelector('.gp-x').focus();
  }

  function close() {
    if (!modal) return;
    modal.classList.remove('is-open');
    if (modal.close && modal.open) {
      try { modal.close(); } catch (err) {}
    }
    d.body.classList.remove('gp-locked');
    frame.src = 'about:blank';
    // a <details> menu that opened this should not stay open behind it
    d.querySelectorAll('details[open]').forEach(function (x) { x.open = false; });
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* what to show: this link, plus the gift's other looks from the same menu */
  function gather(link) {
    var href = link.getAttribute('href') || '';
    var m = href.match(DEMO);
    if (!m) return null;
    var slug = m[1];

    var menu = link.closest('.tile-try-list, .gl-try-list');
    var looks = [];
    if (menu) {
      menu.querySelectorAll('a[href*="/gifts/demo/"]').forEach(function (a) {
        var src = a.querySelector('b') || a.querySelector('span') || a;
        var copy = src.cloneNode(true);
        copy.querySelectorAll('small').forEach(function (x) { x.remove(); });
        var label = copy.textContent.replace(/\s+/g, ' ').trim();
        looks.push({ url: a.getAttribute('href'), label: label.slice(0, 28) });
      });
    }

    var card = link.closest('.tile, .gift-card, article');
    var makeA = card && card.querySelector('.tile-link, .gift-btn--primary, a[href*="/gifts/"]:not([href*="/demo/"])');
    var titleNode = card && card.querySelector('.tile-link, .gift-card-title, h2, h3');

    return {
      slug: slug,
      url: href,
      looks: looks,
      make: makeA ? makeA.getAttribute('href') : null,
      title: titleNode ? titleNode.textContent.trim() : slug.replace(/-/g, ' ')
    };
  }

  d.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    var link = e.target.closest('a[href*="/gifts/demo/"]');
    if (!link) return;
    var info = gather(link);
    if (!info) return;
    e.preventDefault();
    open(info);
  });

})(window, document);
