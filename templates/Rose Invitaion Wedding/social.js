// Instagram + Locations popups.
// - Instagram icon → asks to open the couple's Instagram page.
// - Location icon  → lists the venues, grouped by ceremony.
(function () {
  const RI = window.RoseInvite;
  if (RI && RI.mode === 'edit') return; // editor.js owns these buttons in edit mode

  const modal = document.getElementById('modal');
  const content = document.getElementById('modalContent');
  const igBtn = document.getElementById('igBtn');
  const locBtn = document.getElementById('locBtn');
  const calBtn = document.getElementById('calBtn');
  if (!modal || !content) return;

  // Ceremonies for the calendar popup, derived from the couple's edited config
  // (date = YYYY-MM-DD, time = 24h HH:MM), in chronological order.
  const CEREMONIES = RI.config.ceremonies
    .filter((c) => c.enabled)
    .map((c) => ({
      name: RI.ceremonyName(c),
      dateLabel: RI.fmtDateLabel(c.date),
      timeLabel: RI.fmtTime(c.time),
      date: c.date,
      time: c.time,
      venue: c.venue,
      mapUrl: RI.mapLink(c), // explicit Maps link, else a venue search
    }))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  // Group the ceremonies by day (chronological, matching CEREMONIES order)
  const DAYS = [];
  CEREMONIES.forEach((c) => {
    let d = DAYS.find((x) => x.dateLabel === c.dateLabel);
    if (!d) { d = { date: c.date, dateLabel: c.dateLabel, list: [] }; DAYS.push(d); }
    d.list.push(c);
  });

  const joinNames = (arr) => (
    arr.length <= 1 ? (arr[0] || '') : arr.slice(0, -1).join(', ') + ' & ' + arr[arr.length - 1]
  );

  const pad = (n) => String(n).padStart(2, '0');

  const icsEsc = (s) => String(s).replace(/([,;\\])/g, '\\$1');

  // One all-day VEVENT covering a day's ceremonies
  function veventForDay(day) {
    const dt = day.date.replace(/-/g, '');
    const d = new Date(day.date + 'T00:00:00');
    d.setDate(d.getDate() + 1); // all-day DTEND is exclusive
    const end = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
    const names = joinNames(day.list.map((c) => c.name));
    const desc = day.list.map((c) => icsEsc(
      c.name + (c.timeLabel ? ' - ' + c.timeLabel : '') + (c.venue ? ' · ' + c.venue : '')
    )).join('\\n');
    const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    return [
      'BEGIN:VEVENT', 'UID:day-' + dt + '@invitation', 'DTSTAMP:' + stamp,
      'DTSTART;VALUE=DATE:' + dt, 'DTEND;VALUE=DATE:' + end,
      'SUMMARY:' + icsEsc(names), 'DESCRIPTION:' + desc, 'LOCATION:' + icsEsc(day.list[0].venue),
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsEsc(names), 'END:VALARM',
      'END:VEVENT',
    ];
  }

  const wrapIcs = (events) => [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Rose Invitation//EN', 'CALSCALE:GREGORIAN',
  ].concat(events, 'END:VCALENDAR').join('\r\n');

  const icsForDay = (day) => wrapIcs(veventForDay(day));
  const icsAll = () => wrapIcs(DAYS.reduce((acc, d) => acc.concat(veventForDay(d)), []));

  function downloadIcs(name, ics) {
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  // ---- Editable data (from the couple's config) -------------------------
  const INSTAGRAM_URL = RI.config.social.instagramUrl || 'https://www.instagram.com/';

  // Group ceremonies by venue (in first-appearance order) for the locations popup.
  // Each group carries the venue's map link (the first one set wins for the venue).
  const LOCATIONS = [];
  CEREMONIES.forEach((c) => {
    if (!c.venue) return;
    let l = LOCATIONS.find((x) => x.address === c.venue);
    if (!l) {
      // venue = the name (before the first comma); rest = everything after it
      // (e.g. the city). Kept separate so the name isn't repeated in both lines.
      l = {
        names: [],
        venue: c.venue.split(',')[0].trim(),
        rest: c.venue.split(',').slice(1).join(',').trim(),
        address: c.venue,
        mapUrl: c.mapUrl,
      };
      LOCATIONS.push(l);
    }
    l.names.push(c.name);
  });
  LOCATIONS.forEach((l) => { l.ceremonies = joinNames(l.names); });

  const mapsUrl = (q) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));

  // ---- Open / close ---------------------------------------------------
  let lastFocus = null;

  function openModal(html) {
    content.innerHTML = html;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (window.__lenis) window.__lenis.stop();
    const focusable = modal.querySelector('a, button:not([data-close]), [tabindex]');
    (focusable || modal.querySelector('[data-close]')).focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (window.__lenis) window.__lenis.start();
    if (lastFocus) lastFocus.focus();
  }

  modal.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-close')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // ---- Instagram popup ------------------------------------------------
  if (igBtn) {
    igBtn.addEventListener('click', () => {
      openModal(
        '<h3 class="modal__title" id="modalTitle">Follow the Couple</h3>' +
        '<img class="modal__divider" src="media/floral-divider.webp" alt="" aria-hidden="true" />' +
        '<p class="modal__text">Would you like to open the couple\'s Instagram page?</p>' +
        '<div class="modal__actions">' +
        '<a class="modal__btn modal__btn--primary" href="' + INSTAGRAM_URL + '" target="_blank" rel="noopener">Open Instagram</a>' +
        '<button class="modal__btn" type="button" data-close>Not now</button>' +
        '</div>'
      );
    });
  }

  // ---- Locations popup ------------------------------------------------
  if (locBtn) {
    locBtn.addEventListener('click', () => {
      const items = LOCATIONS.map((l) => (
        '<a class="loc" href="' + (l.mapUrl || mapsUrl(l.address)) + '" target="_blank" rel="noopener">' +
        '<span class="loc__pin" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
        '<path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/>' +
        '</svg></span>' +
        '<span class="loc__text">' +
        '<span class="loc__ceremonies">' + esc(l.ceremonies) + '</span>' +
        '<span class="loc__venue">' + esc(l.venue) + '</span>' +
        (l.rest ? '<span class="loc__addr">' + esc(l.rest) + '</span>' : '') +
        '</span>' +
        '<span class="loc__go" aria-hidden="true">›</span>' +
        '</a>'
      )).join('');
      openModal(
        '<h3 class="modal__title" id="modalTitle">Ceremony Locations</h3>' +
        '<img class="modal__divider" src="media/floral-divider.webp" alt="" aria-hidden="true" />' +
        '<div class="loc-list">' + items + '</div>'
      );
    });
  }

  // ---- Calendar popup -------------------------------------------------
  const calSvg =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
    '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 3v4M16 3v4"/>' +
    '</svg>';

  if (calBtn) {
    calBtn.addEventListener('click', () => {
      // One row per date: the date, its ceremonies, and a single add option.
      const items = DAYS.map((day, i) => (
        '<button class="loc" type="button" data-cal-day="' + i + '">' +
        '<span class="loc__pin" aria-hidden="true">' + calSvg + '</span>' +
        '<span class="loc__text">' +
        '<span class="loc__ceremonies">' + esc(day.dateLabel) + '</span>' +
        '<span class="loc__venue">' + esc(joinNames(day.list.map((c) => c.name))) + '</span>' +
        '</span>' +
        '<span class="loc__go" aria-hidden="true">+</span>' +
        '</button>'
      )).join('');

      openModal(
        '<h3 class="modal__title" id="modalTitle">Add to Calendar</h3>' +
        '<img class="modal__divider" src="media/floral-divider.webp" alt="" aria-hidden="true" />' +
        '<div class="loc-list">' + items + '</div>' +
        '<div class="modal__actions">' +
        '<button class="modal__btn modal__btn--primary" type="button" data-cal-all>Add all dates</button>' +
        '</div>'
      );
    });
  }

  // Delegated: single date row, or the "add all" button
  content.addEventListener('click', (e) => {
    if (e.target.closest('[data-cal-all]')) {
      downloadIcs('all-ceremonies.ics', icsAll());
      return;
    }
    const row = e.target.closest('[data-cal-day]');
    if (row) {
      const day = DAYS[+row.dataset.calDay];
      if (day) downloadIcs('ceremonies-' + day.date + '.ics', icsForDay(day));
    }
  });
})();
