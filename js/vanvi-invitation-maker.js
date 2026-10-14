/**
 * ==========================================================================
 * VANVI MOMENTS — ROYAL INVITATION STUDIO CONTROLLER 2.0
 * Ultra-Luxury WYSIWYG, 8 Royal Themes, 8 Typography Styles, Sacred Deities,
 * Live QR Code, Ceremony Presets, Background Shehnai & 4K/WhatsApp Export
 * ==========================================================================
 */

(function () {
  'use strict';

  // --- Studio State ---
  const state = {
    ratio: 'post', // 'post' (4:5) or 'story' (9:16)
    theme: 'theme-rajwada',
    coupleFont: 'font-pinyon',
    bodyFont: 'body-cormorant',
    borderStyle: 'border-double',
    goldShimmer: true,
    deityKey: 'ganesha',
    shlokaKey: 'ganesh',
    customShloka: '॥ श्री गणेशाय नमः ॥\nवक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
    hostGreeting: 'Together with their families, cordially invite you to celebrate the wedding of',
    groom: 'Aditya Sharma',
    groomParents: 'S/o Mrs. Sunita & Mr. Rajesh Sharma',
    bride: 'Priya Verma',
    brideParents: 'D/o Mrs. Rekha & Mr. Manoj Verma',
    eventBadge: 'WEDDING CEREMONY',
    eventDate: 'Sunday, 24th December 2026',
    eventTime: '7:00 PM Onwards',
    venueName: 'The Taj Lake Palace',
    venueAddress: 'Pichola, Udaipur, Rajasthan 313001',
    venueUrl: 'https://maps.google.com/?q=Taj+Lake+Palace+Udaipur',
    rsvpName: 'Sharma & Verma Family',
    rsvpPhone: '+91 98765 43210',
    showPhoto: false,
    photoData: null,
    showParents: true,
    showQR: true
  };

  // --- Sacred Deity SVGs ---
  const DEITY_SVGS = {
    ganesha: `
      <svg class="deity-badge-svg" viewBox="0 0 64 64" fill="currentColor">
        <path d="M32 4c-3 0-5 2-6 5-3 0-6 2-7 5-2 3-1 7 1 9-2 2-3 5-3 8 0 6 4 11 10 12v3c-3 1-6 3-8 6-3 3-4 7-4 11h34c0-4-1-8-4-11-2-3-5-5-8-6v-3c6-1 10-6 10-12 0-3-1-6-3-8 2-2 3-6 1-9-1-3-4-5-7-5-1-3-3-5-6-5zm-3 8c1-1 2-1 3-1s2 0 3 1v5h-6v-5zm-7 6c2 0 3 1 4 2v4c-2 0-3-1-4-2-1-1-1-3 0-4zm14 0c1 1 1 3 0 4-1 1-2 2-4 2v-4c1-1 2-2 4-2zm-8 7c2-1 6-1 8 0 2 1 3 3 3 5 0 3-3 6-7 6s-7-3-7-6c0-2 1-4 3-5zm4 17c5 0 9 3 11 7H19c2-4 6-7 11-7z"/>
      </svg>
    `,
    kalash: `
      <svg class="deity-badge-svg" viewBox="0 0 64 64" fill="currentColor">
        <path d="M32 6c-2 0-4 2-5 5-2-1-5 0-6 2-1 3 0 6 2 8-3 2-5 6-5 10 0 7 6 13 14 13s14-6 14-13c0-4-2-8-5-10 2-2 3-5 2-8-1-2-4-3-6-2-1-3-3-5-5-5zm-2 22h4c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9zm-9 22h22v4H21z"/>
      </svg>
    `,
    radhaKrishna: `
      <svg class="deity-badge-svg" viewBox="0 0 64 64" fill="currentColor">
        <path d="M22 6c-2 0-4 2-5 5s0 7 2 9c-3 3-4 7-4 11 0 8 7 15 17 15s17-7 17-15c0-4-1-8-4-11 2-2 3-6 2-9s-3-5-5-5l-10 4-10-4zm10 24c3 0 6 2 6 5s-3 5-6 5-6-2-6-5 3-5 6-5zm-14 20h28v4H18z"/>
      </svg>
    `,
    peacock: `
      <svg class="deity-badge-svg" viewBox="0 0 64 64" fill="currentColor">
        <path d="M32 6c-3 0-6 2-7 6-2 3-1 7 1 10-4 3-6 8-6 13 0 9 7 17 17 17s17-8 17-17c0-5-2-10-6-13 2-3 3-7 1-10-1-4-4-6-7-6zm0 18c3 0 5 2 5 5s-2 5-5 5-5-2-5-5 2-5 5-5zm-12 24h24v4H20z"/>
      </svg>
    `,
    crest: `
      <svg class="deity-badge-svg" viewBox="0 0 64 64" fill="currentColor">
        <path d="M32 4l6 8 10-3-3 10 9 6-8 7 4 10-10-2-6 8-6-8-10 2 4-10-8-7 9-6-3-10 10 3 6-8zm0 18c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z"/>
      </svg>
    `,
    none: ''
  };

  // --- Ceremony Presets ---
  const CEREMONY_PRESETS = {
    vivah: {
      badge: 'WEDDING CEREMONY',
      host: 'Together with their families, cordially invite you to celebrate the wedding of',
      shloka: '॥ श्री गणेशाय नमः ॥\nवक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
      theme: 'theme-rajwada',
      deity: 'ganesha'
    },
    sangeet: {
      badge: 'SANGEET & COCKTAIL NIGHT',
      host: 'Get ready for an evening of music, dance, laughter, and unforgettable memories celebrating',
      shloka: 'Two lives, two hearts, joined together in friendship, united forever in love.',
      theme: 'theme-peacock',
      deity: 'peacock'
    },
    haldi: {
      badge: 'HALDI RASAM',
      host: 'With radiant joy, turmeric splashes, and love, join us for the auspicious Haldi ceremony of',
      shloka: '॥ ॐ श्री लक्ष्मीनारायणाभ्यां नमः ॥\nमांगल्यम् भगवान विष्णुः मांगल्यम् गरुड़ध्वजः। मांगल्यम् पुण्डरीकाक्षो मंगलायतनो हरिः॥',
      theme: 'theme-haldi',
      deity: 'kalash'
    },
    mehendi: {
      badge: 'MEHENDI KI RAAT',
      host: 'In the fragrant swirls of fresh henna and festive beats, we solicit your gracious presence for the Mehendi of',
      shloka: '॥ ॐ श्री राधारमणे नमः ॥\nप्रेम की पावन धारा में, दो हृदयों का मिलन। आपके स्नेह और आशीर्वाद की सादर प्रतीक्षा॥',
      theme: 'theme-emerald',
      deity: 'radhaKrishna'
    },
    roka: {
      badge: 'ROKA & RING CEREMONY',
      host: 'With immense joy and the blessings of our elders, we invite you to celebrate the Engagement of',
      shloka: 'Together is a beautiful place to be. Celebrating our forever beginning.',
      theme: 'theme-ranipink',
      deity: 'crest'
    },
    reception: {
      badge: 'WEDDING RECEPTION',
      host: 'Under the glittering stars, join us for a royal gala dinner to celebrate the newlywed couple',
      shloka: 'Under the gracious presence of our elders and with boundless joy, welcome to the Reception of',
      theme: 'theme-obsidian',
      deity: 'crest'
    }
  };

  // --- Shloka Presets ---
  const SHLOKA_PRESETS = {
    ganesh: '॥ श्री गणेशाय नमः ॥\nवक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
    vishnu: '॥ ॐ श्री लक्ष्मीनारायणाभ्यां नमः ॥\nमांगल्यम् भगवान विष्णुः मांगल्यम् गरुड़ध्वजः। मांगल्यम् पुण्डरीकाक्षो मंगलायतनो हरिः॥',
    radhaKrishna: '॥ ॐ श्री राधारमणे नमः ॥\nप्रेम की पावन धारा में, दो हृदयों का मिलन। आपके स्नेह और आशीर्वाद की सादर प्रतीक्षा॥',
    modern: 'Two lives, two hearts, joined together in friendship, united forever in love.',
    none: ''
  };

  // --- DOM Elements ---
  const cardEl = document.getElementById('invitationCard');
  const canvasWrapper = document.getElementById('canvasDeviceWrapper');
  const qrContainer = document.getElementById('qrCodeContainer');
  const dispDeityWrap = document.getElementById('dispDeityWrap');
  const dispDetailsCluster = document.getElementById('dispDetailsCluster');

  // Input Elements
  const inpShloka = document.getElementById('inpShloka');
  const inpHostGreeting = document.getElementById('inpHostGreeting');
  const inpGroom = document.getElementById('inpGroom');
  const inpGroomParents = document.getElementById('inpGroomParents');
  const inpBride = document.getElementById('inpBride');
  const inpBrideParents = document.getElementById('inpBrideParents');
  const inpEventBadge = document.getElementById('inpEventBadge');
  const inpEventDate = document.getElementById('inpEventDate');
  const inpEventTime = document.getElementById('inpEventTime');
  const inpVenueName = document.getElementById('inpVenueName');
  const inpVenueAddress = document.getElementById('inpVenueAddress');
  const inpVenueUrl = document.getElementById('inpVenueUrl');
  const inpRsvpName = document.getElementById('inpRsvpName');
  const inpRsvpPhone = document.getElementById('inpRsvpPhone');
  const toggleParents = document.getElementById('toggleParents');
  const toggleQR = document.getElementById('toggleQR');
  const toggleGoldShimmer = document.getElementById('toggleGoldShimmer');

  // Display Elements
  const dispShloka = document.getElementById('dispShloka');
  const dispHostGreeting = document.getElementById('dispHostGreeting');
  const dispGroom = document.getElementById('dispGroom');
  const dispGroomParents = document.getElementById('dispGroomParents');
  const dispBride = document.getElementById('dispBride');
  const dispBrideParents = document.getElementById('dispBrideParents');
  const dispEventBadge = document.getElementById('dispEventBadge');
  const dispEventDate = document.getElementById('dispEventDate');
  const dispEventTime = document.getElementById('dispEventTime');
  const dispVenueName = document.getElementById('dispVenueName');
  const dispVenueAddress = document.getElementById('dispVenueAddress');
  const dispRsvpName = document.getElementById('dispRsvpName');
  const dispRsvpPhone = document.getElementById('dispRsvpPhone');
  const cardPhotoWrap = document.getElementById('cardPhotoWrap');
  const cardPhotoImg = document.getElementById('cardPhotoImg');
  const cardVenueQRBox = document.getElementById('cardVenueQRBox');

  // --- Initialize Studio ---
  function init() {
    setupTabSwitching();
    setupRatioToggle();
    setupThemes();
    setupCoupleFonts();
    setupBodyFonts();
    setupBorderStyles();
    setupDeities();
    setupCeremonies();
    setupInputSync();
    setupInlineEditableSync();
    setupPhotoUpload();
    setupShlokaPresets();
    setupAudioPlayer();
    setupExportHandlers();
    setupMobileDock();

    updateCardVisuals();
    renderQRCode();
  }

  // --- Studio Tabs Navigation ---
  function setupTabSwitching() {
    const tabBtns = document.querySelectorAll('.studio-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const targetTab = btn.getAttribute('data-tab');
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById(`panel_${targetTab}`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // --- Aspect Ratio Toggle ---
  function setupRatioToggle() {
    const ratioBtns = document.querySelectorAll('.ratio-btn');
    ratioBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        ratioBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        state.ratio = btn.getAttribute('data-ratio');
        canvasWrapper.className = `canvas-device-wrapper ratio-${state.ratio}`;
      });
    });
  }

  // --- 8 Royal Themes Setup ---
  function setupThemes() {
    const themeCards = document.querySelectorAll('.theme-card-option[data-theme]');
    themeCards.forEach(card => {
      card.addEventListener('click', () => {
        themeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        state.theme = card.getAttribute('data-theme');
        applyThemeClass(state.theme);
        renderQRCode();
      });
    });
  }

  function applyThemeClass(themeName) {
    // Preserve border and font classes
    cardEl.className = `vanvi-invitation-card ${themeName} ${state.borderStyle} ${state.goldShimmer ? 'gold-shimmer-active' : ''}`;
  }

  // --- Couple Typography Setup ---
  function setupCoupleFonts() {
    const fontCards = document.querySelectorAll('#coupleFontsGrid .font-card-option');
    fontCards.forEach(card => {
      card.addEventListener('click', () => {
        fontCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        state.coupleFont = card.getAttribute('data-font');
        dispGroom.className = `person-name gold-text ${state.coupleFont}`;
        dispBride.className = `person-name gold-text ${state.coupleFont}`;
      });
    });
  }

  // --- Body Typography Setup ---
  function setupBodyFonts() {
    const bodyCards = document.querySelectorAll('#bodyFontsGrid .font-card-option');
    bodyCards.forEach(card => {
      card.addEventListener('click', () => {
        bodyCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        state.bodyFont = card.getAttribute('data-body-font');
        if (dispDetailsCluster) {
          dispDetailsCluster.className = `card-details-cluster ${state.bodyFont}`;
        }
      });
    });
  }

  // --- Border Styles Setup ---
  function setupBorderStyles() {
    const borderBtns = document.querySelectorAll('[data-border-style]');
    borderBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        borderBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        state.borderStyle = btn.getAttribute('data-border-style');
        applyThemeClass(state.theme);
      });
    });

    if (toggleGoldShimmer) {
      toggleGoldShimmer.addEventListener('change', (e) => {
        state.goldShimmer = e.target.checked;
        applyThemeClass(state.theme);
      });
    }
  }

  // --- Sacred Deities & Emblems Setup ---
  function setupDeities() {
    const deityCards = document.querySelectorAll('#deityOptionsGrid .theme-card-option');
    deityCards.forEach(card => {
      card.addEventListener('click', () => {
        deityCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        state.deityKey = card.getAttribute('data-deity');
        if (dispDeityWrap) {
          dispDeityWrap.innerHTML = DEITY_SVGS[state.deityKey] || '';
          dispDeityWrap.style.display = state.deityKey === 'none' ? 'none' : 'flex';
        }
      });
    });
  }

  // --- Ceremony Quick Switcher Setup ---
  function setupCeremonies() {
    const ceremonyChips = document.querySelectorAll('[data-ceremony]');
    ceremonyChips.forEach(chip => {
      chip.addEventListener('click', () => {
        ceremonyChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const key = chip.getAttribute('data-ceremony');
        const preset = CEREMONY_PRESETS[key];
        if (!preset) return;

        // Update badge & host
        state.eventBadge = preset.badge;
        state.hostGreeting = preset.host;
        state.customShloka = preset.shloka;
        state.theme = preset.theme;
        state.deityKey = preset.deity;

        inpEventBadge.value = preset.badge;
        inpHostGreeting.value = preset.host;
        inpShloka.value = preset.shloka;

        dispEventBadge.textContent = preset.badge;
        dispHostGreeting.textContent = preset.host;
        dispShloka.innerHTML = preset.shloka.replace(/\n/g, '<br />');

        // Apply theme & deity
        applyThemeClass(state.theme);
        document.querySelectorAll('.theme-card-option[data-theme]').forEach(c => {
          c.classList.toggle('active', c.getAttribute('data-theme') === state.theme);
        });

        if (dispDeityWrap) {
          dispDeityWrap.innerHTML = DEITY_SVGS[state.deityKey] || '';
          dispDeityWrap.style.display = state.deityKey === 'none' ? 'none' : 'flex';
        }
        document.querySelectorAll('#deityOptionsGrid .theme-card-option').forEach(c => {
          c.classList.toggle('active', c.getAttribute('data-deity') === state.deityKey);
        });

        renderQRCode();
      });
    });
  }

  // --- Two-Way Input Synchronization ---
  function setupInputSync() {
    const bindSync = (inputEl, displayEl, stateKey, isHTML = false) => {
      if (!inputEl || !displayEl) return;
      inputEl.addEventListener('input', () => {
        state[stateKey] = inputEl.value;
        if (isHTML) {
          displayEl.innerHTML = inputEl.value.replace(/\n/g, '<br />');
        } else {
          displayEl.textContent = inputEl.value;
        }
      });
    };

    bindSync(inpShloka, dispShloka, 'customShloka', true);
    bindSync(inpHostGreeting, dispHostGreeting, 'hostGreeting');
    bindSync(inpGroom, dispGroom, 'groom');
    bindSync(inpGroomParents, dispGroomParents, 'groomParents');
    bindSync(inpBride, dispBride, 'bride');
    bindSync(inpBrideParents, dispBrideParents, 'brideParents');
    bindSync(inpEventBadge, dispEventBadge, 'eventBadge');
    bindSync(inpEventDate, dispEventDate, 'eventDate');
    bindSync(inpEventTime, dispEventTime, 'eventTime');
    bindSync(inpVenueName, dispVenueName, 'venueName');
    bindSync(inpVenueAddress, dispVenueAddress, 'venueAddress');
    bindSync(inpRsvpName, dispRsvpName, 'rsvpName');
    bindSync(inpRsvpPhone, dispRsvpPhone, 'rsvpPhone');

    if (inpVenueUrl) {
      inpVenueUrl.addEventListener('change', () => {
        state.venueUrl = inpVenueUrl.value.trim() || 'https://maps.google.com';
        renderQRCode();
      });
    }

    if (toggleParents) {
      toggleParents.addEventListener('change', (e) => {
        state.showParents = e.target.checked;
        dispGroomParents.style.display = state.showParents ? 'block' : 'none';
        dispBrideParents.style.display = state.showParents ? 'block' : 'none';
      });
    }

    if (toggleQR) {
      toggleQR.addEventListener('change', (e) => {
        state.showQR = e.target.checked;
        if (cardVenueQRBox) {
          cardVenueQRBox.style.display = state.showQR ? 'flex' : 'none';
        }
      });
    }
  }

  // --- Inline WYSIWYG Editable Sync ---
  function setupInlineEditableSync() {
    const bindInline = (dispEl, inpEl, stateKey) => {
      if (!dispEl || !inpEl) return;
      dispEl.addEventListener('input', () => {
        state[stateKey] = dispEl.textContent.trim();
        inpEl.value = state[stateKey];
      });
    };

    bindInline(dispGroom, inpGroom, 'groom');
    bindInline(dispBride, inpBride, 'bride');
    bindInline(dispEventBadge, inpEventBadge, 'eventBadge');
    bindInline(dispEventDate, inpEventDate, 'eventDate');
    bindInline(dispEventTime, inpEventTime, 'eventTime');
    bindInline(dispVenueName, inpVenueName, 'venueName');
    bindInline(dispVenueAddress, inpVenueAddress, 'venueAddress');
    bindInline(dispRsvpName, inpRsvpName, 'rsvpName');
    bindInline(dispRsvpPhone, inpRsvpPhone, 'rsvpPhone');
  }

  // --- Photo Upload & Preview ---
  function setupPhotoUpload() {
    const inpPhoto = document.getElementById('inpPhotoFile');
    const togglePhoto = document.getElementById('togglePhoto');
    const thumb = document.getElementById('photoPreviewThumb');
    const btnRemove = document.getElementById('btnRemovePhoto');

    if (togglePhoto) {
      togglePhoto.addEventListener('change', (e) => {
        state.showPhoto = e.target.checked;
        cardPhotoWrap.style.display = (state.showPhoto && state.photoData) ? 'block' : 'none';
      });
    }

    if (inpPhoto) {
      inpPhoto.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
          state.photoData = evt.target.result;
          state.showPhoto = true;
          if (togglePhoto) togglePhoto.checked = true;

          cardPhotoImg.src = state.photoData;
          cardPhotoWrap.style.display = 'block';

          if (thumb) {
            thumb.src = state.photoData;
            thumb.style.display = 'block';
          }
          if (btnRemove) btnRemove.style.display = 'inline-block';
        };
        reader.readAsDataURL(file);
      });
    }

    if (btnRemove) {
      btnRemove.addEventListener('click', () => {
        state.photoData = null;
        state.showPhoto = false;
        if (togglePhoto) togglePhoto.checked = false;
        if (inpPhoto) inpPhoto.value = '';
        cardPhotoWrap.style.display = 'none';
        cardPhotoImg.src = '';
        if (thumb) thumb.style.display = 'none';
        btnRemove.style.display = 'none';
      });
    }
  }

  // --- Shloka Presets ---
  function setupShlokaPresets() {
    const chips = document.querySelectorAll('[data-preset-shloka]');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const key = chip.getAttribute('data-preset-shloka');
        const text = SHLOKA_PRESETS[key] || '';
        inpShloka.value = text;
        dispShloka.innerHTML = text.replace(/\n/g, '<br />');
        dispShloka.style.display = text ? 'block' : 'none';
      });
    });
  }

  // --- Background Shehnai Audio Player ---
  function setupAudioPlayer() {
    const btnMusic = document.getElementById('btnToggleMusic');
    const audio = document.getElementById('weddingAudio');
    const icon = document.getElementById('musicPlayIcon');
    if (!btnMusic || !audio) return;

    let isPlaying = false;
    btnMusic.addEventListener('click', () => {
      if (isPlaying) {
        audio.pause();
        icon.textContent = '▶';
        isPlaying = false;
      } else {
        audio.play().then(() => {
          icon.textContent = '⏸';
          isPlaying = true;
        }).catch(() => {
          icon.textContent = '▶';
        });
      }
    });
  }

  // --- Live Google Maps QR Code Generator ---
  function renderQRCode() {
    if (!qrContainer || typeof QRCode === 'undefined') return;
    qrContainer.innerHTML = '';

    const colorMap = {
      'theme-rajwada': { dark: '#d4af37', light: '#29040e' },
      'theme-udaipur': { dark: '#b05c74', light: '#f7efe5' },
      'theme-emerald': { dark: '#e5b869', light: '#0d3b30' },
      'theme-champagne': { dark: '#8c6d48', light: '#ebe2d3' },
      'theme-peacock': { dark: '#ffd978', light: '#051426' },
      'theme-ranipink': { dark: '#fcd34d', light: '#4a0322' },
      'theme-haldi': { dark: '#fbbf24', light: '#421f02' },
      'theme-obsidian': { dark: '#e2b755', light: '#090a10' }
    };

    const scheme = colorMap[state.theme] || { dark: '#d4af37', light: '#29040e' };

    QRCode.toCanvas(state.venueUrl || 'https://maps.google.com', {
      width: 64,
      margin: 1,
      color: {
        dark: scheme.dark,
        light: scheme.light
      }
    }, function (err, canvas) {
      if (!err && canvas) {
        canvas.style.width = '52px';
        canvas.style.height = '52px';
        canvas.style.borderRadius = '6px';
        qrContainer.appendChild(canvas);
      }
    });
  }

  // --- WhatsApp & 4K PNG Export Handlers ---
  function setupExportHandlers() {
    const btnDownload = document.getElementById('btnTriggerDownload');
    const btnWebKeepsake = document.getElementById('btnTriggerWebKeepsake');
    const btnShareWA = document.getElementById('btnShareWhatsApp');
    const btnDoExport = document.getElementById('btnDoExportPNG');
    const btnDoShareWADirect = document.getElementById('btnDoShareWhatsAppDirect');

    const modalDownload = document.getElementById('modalDownload');
    const modalKeepsake = document.getElementById('modalWebKeepsake');

    const openModal = (m) => { if (m) m.classList.add('active'); };
    const closeModal = (m) => { if (m) m.classList.remove('active'); };

    if (btnDownload) btnDownload.addEventListener('click', () => openModal(modalDownload));
    if (btnWebKeepsake) btnWebKeepsake.addEventListener('click', () => openModal(modalKeepsake));

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-close-modal');
        closeModal(document.getElementById(id));
      });
    });

    // Close on backdrop click
    [modalDownload, modalKeepsake].forEach(m => {
      if (m) {
        m.addEventListener('click', (e) => {
          if (e.target === m) closeModal(m);
        });
      }
    });

    // WhatsApp Message Generator
    const shareViaWhatsApp = () => {
      const groom = state.groom;
      const bride = state.bride;
      const date = state.eventDate;
      const time = state.eventTime;
      const venue = state.venueName;
      const address = state.venueAddress;
      const maps = state.venueUrl;
      const rsvp = `${state.rsvpName} (${state.rsvpPhone})`;

      const text = `💍 *Wedding Invitation: ${groom} & ${bride}* 💍\n\n` +
        `Together with their families, cordially invite you to celebrate the ${state.eventBadge}!\n\n` +
        `📅 *Date:* ${date}\n` +
        `⏰ *Time:* ${time}\n` +
        `📍 *Venue:* ${venue}, ${address}\n` +
        `🗺️ *Google Maps:* ${maps}\n\n` +
        `💌 *RSVP:* ${rsvp}\n\n` +
        `✨ *Crafted with Vanvi Moments Luxe Studio*`;

      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    };

    if (btnShareWA) btnShareWA.addEventListener('click', shareViaWhatsApp);
    if (btnDoShareWADirect) btnDoShareWADirect.addEventListener('click', shareViaWhatsApp);

    // 4K Ultra-HD Export via html2canvas
    if (btnDoExport) {
      btnDoExport.addEventListener('click', async () => {
        btnDoExport.disabled = true;
        btnDoExport.innerHTML = '<span>⏳ Rendering 4K Card...</span>';

        try {
          if (typeof confetti === 'function') {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          }

          const canvas = await html2canvas(cardEl, {
            scale: 3, // Ultra-high resolution
            useCORS: true,
            allowTaint: true,
            backgroundColor: null
          });

          const link = document.createElement('a');
          link.download = `Vanvi_Royal_Invitation_${state.groom.replace(/\s+/g, '_')}_${state.bride.replace(/\s+/g, '_')}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();

          btnDoExport.innerHTML = '<span>✓ Download Complete!</span>';
          setTimeout(() => {
            btnDoExport.disabled = false;
            btnDoExport.innerHTML = '<span>📸 Download 4K Ultra-HD PNG</span>';
            closeModal(modalDownload);
          }, 1200);

        } catch (err) {
          console.error('Export Error:', err);
          alert('Could not render image. Please try again.');
          btnDoExport.disabled = false;
          btnDoExport.innerHTML = '<span>📸 Download 4K Ultra-HD PNG</span>';
        }
      });
    }
  }

  // --- Mobile Dock Toggle ---
  function setupMobileDock() {
    const btnEdit = document.getElementById('dockBtnEdit');
    const btnPreview = document.getElementById('dockBtnPreview');
    if (!btnEdit || !btnPreview) return;

    btnEdit.addEventListener('click', () => {
      btnEdit.classList.add('active');
      btnPreview.classList.remove('active');
      document.body.classList.remove('view-preview-mode');
    });

    btnPreview.addEventListener('click', () => {
      btnPreview.classList.add('active');
      btnEdit.classList.remove('active');
      document.body.classList.add('view-preview-mode');
    });
  }

  // --- Initial Visual Render ---
  function updateCardVisuals() {
    applyThemeClass(state.theme);
    dispGroom.className = `person-name gold-text ${state.coupleFont}`;
    dispBride.className = `person-name gold-text ${state.coupleFont}`;
    if (dispDetailsCluster) {
      dispDetailsCluster.className = `card-details-cluster ${state.bodyFont}`;
    }
  }

  // Run Studio
  document.addEventListener('DOMContentLoaded', init);

})();
