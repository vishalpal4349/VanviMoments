/**
 * ==========================================================================
 * VANVI MOMENTS — INVITATION MAKER STUDIO JS
 * Premium Vanvi invitation-making flow
 * Wedding & Birthday Switcher, 4-Step Navigation, Real-time Preview, 4K Download
 * ==========================================================================
 */

(function () {
  'use strict';

  // --- STATE ---
  const state = {
    occasion: 'wedding', // 'wedding' | 'birthday'
    ratio: 'post',       // 'post' (4:5) | 'story' (9:16)
    currentStep: 1,      // 1: Details, 2: Design, 3: Style, 4: Download
    theme: 'rajwada',
    font: 'pinyon',
    hideKicker: false,
    hideConnector: false,
    photoUrl: '',
    photoPos: 28,

    // Data values
    name1: 'Priya',
    name2: 'Aarav',
    date: '2026-12-11',
    time: '19:00',
    venue: 'The Grand Palace, Udaipur, Rajasthan',
    mapsUrl: 'https://maps.google.com',
    message: 'With the blessings of our elders, we invite you to celebrate',
    kicker: 'Shubh Vivah',
    connector: 'weds',
    badge: 'WEDDING CEREMONY',
    shloka: '॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ॥',
    rsvp: 'Sharma & Verma Family'
  };

  // --- FAN ASSETS (Vanvi template artwork) ---
  const FAN_ASSETS = {
    wedding: {
      left: { img: 'assets/templates/floral-mehendi-story.jpg', alt: 'Floral Mehendi wedding invitation', theme: 'udaipur', name: 'Floral Mehendi Story' },
      center: { img: 'assets/templates/royal-palace-wedding.jpg', alt: 'Royal Palace wedding invitation', theme: 'rajwada', name: 'Royal Palace Vivah' },
      right: { img: 'assets/templates/vanvi-temple-blossom-luxe.jpg', alt: 'Temple Blossom wedding invitation', theme: 'ranipink', name: 'Temple Blossom Luxe' }
    },
    birthday: {
      left: { img: 'assets/templates/vanvi-birthday-bold-luxe.jpg', alt: 'Vanvi bold birthday invitation', theme: 'neon', name: 'Birthday Bold Luxe' },
      center: { img: 'assets/templates/vanvi-birthday-showcase.jpg', alt: 'Vanvi birthday invitation', theme: 'pastel', name: 'Birthday Celebration' },
      right: { img: 'assets/templates/cute-pastel-birthday.jpg', alt: 'Pastel birthday invitation', theme: 'milestone', name: 'Pastel Birthday' }
    },
    housewarming: {
      left: { img: 'assets/templates/golden-lake-collection.jpg', alt: 'Golden celebration invitation', theme: 'udaipur', name: 'Golden Lake' },
      center: { img: 'assets/templates/marigold-garden-vivah.jpg', alt: 'Marigold celebration invitation', theme: 'rajwada', name: 'Marigold Garden' },
      right: { img: 'assets/templates/vanvi-birthday-vibrant.jpg', alt: 'Vibrant celebration invitation', theme: 'haldi', name: 'Golden Celebration' }
    }
  };

  // --- TEMPLATE CATALOGS (Vanvi artwork) ---
  const DESIGNS_CATALOG = {
    wedding: [
      { id: 'rajwada', name: 'Royal Palace Vivah', theme: 'rajwada', category: 'royal', img: 'assets/templates/royal-palace-wedding.jpg' },
      { id: 'kanjeevaram', name: 'Floral Mehendi Story', theme: 'udaipur', category: 'royal', img: 'assets/templates/floral-mehendi-story.jpg' },
      { id: 'blush', name: 'Temple Blossom Luxe', theme: 'ranipink', category: 'floral', img: 'assets/templates/vanvi-temple-blossom-luxe.jpg' },
      { id: 'peacock', name: 'Peacock Garden', theme: 'peacock', category: 'floral', bg: 'radial-gradient(120% 90% at 50% 30%, #084852, #053138 55%, #021a1e)' },
      { id: 'emerald', name: 'Emerald Mandap', theme: 'emerald', category: 'classic', bg: 'radial-gradient(120% 90% at 50% 30%, #06392c, #03251c 55%, #021510)' },
      { id: 'haldi', name: 'Haldi Sunshine', theme: 'haldi', category: 'classic', bg: 'radial-gradient(120% 90% at 50% 30%, #5a2e04, #3d1d02 55%, #220f01)' }
    ],
    birthday: [
      { id: 'balloon', name: 'Birthday Celebration', theme: 'pastel', category: 'royal', img: 'assets/templates/vanvi-birthday-showcase.jpg' },
      { id: 'milestone', name: 'Pastel Birthday', theme: 'milestone', category: 'royal', img: 'assets/templates/cute-pastel-birthday.jpg' },
      { id: 'afterdark', name: 'Birthday Bold Luxe', theme: 'neon', category: 'classic', img: 'assets/templates/vanvi-birthday-bold-luxe.jpg' },
      { id: 'starlight', name: 'Midnight Starlight', theme: 'starlight', category: 'classic', bg: 'radial-gradient(120% 90% at 50% 30%, #0d1b38, #070f22 55%, #020610)' },
      { id: 'carousel', name: 'Royal Carousel', theme: 'carousel', category: 'floral', bg: 'radial-gradient(120% 90% at 50% 30%, #4a1525, #320c18 55%, #19050b)' }
    ],
    housewarming: [
      { id: 'grihapravesh', name: 'Griha Pravesh Bliss', theme: 'rajwada', category: 'royal', img: 'assets/invilix/demo-housewarming-v2.webp' },
      { id: 'warmhome', name: 'Sweet Abode Arch', theme: 'udaipur', category: 'classic', bg: 'radial-gradient(120% 90% at 50% 30%, #421021, #2b0814 55%, #18030b)' },
      { id: 'shubharambh', name: 'Shubh Mandap', theme: 'emerald', category: 'royal', bg: 'radial-gradient(120% 90% at 50% 30%, #06392c, #03251c 55%, #021510)' },
      { id: 'goldenblessings', name: 'Golden Blessings', theme: 'haldi', category: 'classic', bg: 'radial-gradient(120% 90% at 50% 30%, #5a2e04, #3d1d02 55%, #220f01)' }
    ]
  };

  // --- DOM CACHE ---
  const dom = {
    // Occasion
    pickWedding: document.getElementById('pickWedding'),
    pickBirthday: document.getElementById('pickBirthday'),
    pickHousewarming: document.getElementById('pickHousewarming'),
    detailsHeading: document.getElementById('detailsHeading'),
    detailsSub: document.getElementById('detailsSub'),
    labelBride: document.getElementById('labelBride'),
    labelGroom: document.getElementById('labelGroom'),
    fieldBrideWrap: document.getElementById('fieldBrideWrap'),
    fieldGroomWrap: document.getElementById('fieldGroomWrap'),

    // Hero Fan
    heroFan: document.getElementById('heroFan'),
    fanCardLeft: document.getElementById('fanCardLeft'),
    fanCardCenter: document.getElementById('fanCardCenter'),
    fanCardRight: document.getElementById('fanCardRight'),
    fanImgLeft: document.getElementById('fanImgLeft'),
    fanImgCenter: document.getElementById('fanImgCenter'),
    fanImgRight: document.getElementById('fanImgRight'),

    // Steps
    stepButtons: document.querySelectorAll('.ivm-steps-btn'),
    panes: {
      1: document.getElementById('paneDetails'),
      2: document.getElementById('paneDesign'),
      3: document.getElementById('paneStyle'),
      4: document.getElementById('paneDownload')
    },
    btnNextToDesign: document.getElementById('btnNextToDesign'),
    btnBackToDetails: document.getElementById('btnBackToDetails'),
    btnNextToStyle: document.getElementById('btnNextToStyle'),
    btnBackToDesign: document.getElementById('btnBackToDesign'),
    btnNextToDownload: document.getElementById('btnNextToDownload'),

    // Form Inputs
    inputBride: document.getElementById('f-bride'),
    inputGroom: document.getElementById('f-groom'),
    inputDate: document.getElementById('f-date'),
    inputTime: document.getElementById('f-time'),
    inputVenue: document.getElementById('f-venue'),
    inputMaps: document.getElementById('f-maps'),
    inputMessage: document.getElementById('f-message'),

    // Wording Accordion
    btnToggleWording: document.getElementById('btnToggleWording'),
    wordingBody: document.getElementById('wordingBody'),
    inputKicker: document.getElementById('w-kicker'),
    btnEyeKicker: document.getElementById('btnEyeKicker'),
    inputConnector: document.getElementById('w-connector'),
    btnEyeConnector: document.getElementById('btnEyeConnector'),

    // Photo
    photoThumb: document.getElementById('photoThumb'),
    photoFileIn: document.getElementById('photoFileIn'),
    btnRemovePhoto: document.getElementById('btnRemovePhoto'),
    cloudinaryUrlIn: document.getElementById('cloudinaryUrlIn'),
    btnLoadCloudinary: document.getElementById('btnLoadCloudinary'),
    photoPosSlider: document.getElementById('photoPosSlider'),

    // Designs Grid & Filters
    designGrid: document.getElementById('designGrid'),
    designFilterChips: document.getElementById('designFilterChips'),

    // Style elements
    paletteSwatchesGroup: document.getElementById('paletteSwatchesGroup'),
    dispActivePaletteName: document.getElementById('dispActivePaletteName'),
    customColorPicker: document.getElementById('customColorPicker'),
    fontPairButtons: document.querySelectorAll('.ivm-st-pair'),
    dispActiveFontName: document.getElementById('dispActiveFontName'),

    // Download Pane
    dlCards: document.querySelectorAll('.ivm-dl-card'),
    btnPrimaryDownloadPNG: document.getElementById('btnPrimaryDownloadPNG'),
    btnSideDownloadPNG: document.getElementById('btnSideDownloadPNG'),
    btnNavDownload: document.getElementById('btnNavDownload'),
    btnShareWhatsApp: document.getElementById('btnShareWhatsApp'),
    btnLivingKeepsake: document.getElementById('btnLivingKeepsake'),

    // Preview
    dispPreviewCardName: document.getElementById('dispPreviewCardName'),
    segRatioPost: document.getElementById('segRatioPost'),
    segRatioStory: document.getElementById('segRatioStory'),
    liveCardStage: document.getElementById('liveCardStage'),
    cardCanvas: document.getElementById('cardCanvas'),
    cardDeityWrap: document.getElementById('cardDeityWrap'),
    dispCardShloka: document.getElementById('dispCardShloka'),
    dispCardMessage: document.getElementById('dispCardMessage'),
    cardPhotoWrap: document.getElementById('cardPhotoWrap'),
    cardPhotoImg: document.getElementById('cardPhotoImg'),
    dispCardName1: document.getElementById('dispCardName1'),
    dispCardConnector: document.getElementById('dispCardConnector'),
    dispCardName2: document.getElementById('dispCardName2'),
    dispCardBadge: document.getElementById('dispCardBadge'),
    dispCardDateTime: document.getElementById('dispCardDateTime'),
    dispCardVenue: document.getElementById('dispCardVenue'),
    dispCardQr: document.getElementById('dispCardQr'),
    dispCardRsvp: document.getElementById('dispCardRsvp'),

    // Mobile Dock
    dockBtnForm: document.getElementById('dockBtnForm'),
    dockBtnCard: document.getElementById('dockBtnCard'),
    dockBtnDl: document.getElementById('dockBtnDl')
  };

  // --- INITIALIZATION ---
  function init() {
    updateHeroFan('wedding');
    renderDesignGrid('all');
    bindEvents();
    renderLivePreview();
    updateQRCode();
  }

  // --- OCCASION SWITCHING ---
  function switchOccasion(newOccasion) {
    if (state.occasion === newOccasion) return;
    state.occasion = newOccasion;

    dom.pickWedding.setAttribute('aria-pressed', newOccasion === 'wedding' ? 'true' : 'false');
    dom.pickBirthday.setAttribute('aria-pressed', newOccasion === 'birthday' ? 'true' : 'false');
    if (dom.pickHousewarming) {
      dom.pickHousewarming.setAttribute('aria-pressed', newOccasion === 'housewarming' ? 'true' : 'false');
    }

    updateHeroFan(newOccasion);

    if (newOccasion === 'wedding') {
      dom.detailsHeading.textContent = 'Wedding Details';
      dom.detailsSub.textContent = 'Fill in bride & groom names, date and venue to customize your card.';
      dom.labelBride.textContent = "Bride's name";
      dom.labelGroom.textContent = "Groom's name";

      state.name1 = 'Priya';
      state.name2 = 'Aarav';
      state.kicker = 'Shubh Vivah';
      state.connector = 'weds';
      state.badge = 'WEDDING CEREMONY';
      state.shloka = '॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ॥';
      state.message = 'With the blessings of our elders, we invite you to celebrate';
      state.theme = 'rajwada';
      dom.dispPreviewCardName.textContent = 'Rajwada Royale';

      dom.cardDeityWrap.style.display = 'flex';
      dom.cardDeityWrap.innerHTML = `
        <svg viewBox="0 0 100 100">
          <path d="M50 8 C40 8 32 16 32 26 C32 34 38 40 45 42 C42 45 40 49 40 54 C40 62 46 68 53 68 C58 68 62 65 64 61 C68 65 74 68 80 68 C83 68 86 67 88 65 C85 62 82 58 82 54 C82 46 88 40 88 32 C88 22 78 12 66 10 C61 9 55 8 50 8 Z M50 14 C54 14 58 15 62 16 C72 18 80 26 80 34 C80 40 76 45 74 50 C76 52 78 55 80 58 C76 60 72 60 68 58 C66 54 62 50 58 50 C54 50 50 54 48 58 C46 54 46 50 48 46 C52 46 56 42 56 36 C56 30 50 26 44 26 C40 26 38 28 38 30 C38 24 43 14 50 14 Z M51 22 C53 22 55 24 55 26 C55 28 53 30 51 30 C49 30 47 28 47 26 C47 24 49 22 51 22 Z"/>
        </svg>`;

      if (dom.btnLivingKeepsake) {
        dom.btnLivingKeepsake.href = 'templates.html?cat=wedding';
        dom.btnLivingKeepsake.innerHTML = `<span>Explore Wedding 3D Keepsakes</span> <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
      }
    } else if (newOccasion === 'birthday') {
      dom.detailsHeading.textContent = 'Birthday Details';
      dom.detailsSub.textContent = 'Fill in birthday star name, age turning, and party venue.';
      dom.labelBride.textContent = "Birthday Person's Name";
      dom.labelGroom.textContent = 'Turning / Age (e.g. 1st, Sweet 16, 25th)';

      state.name1 = 'Aarav';
      state.name2 = 'Turning 1st';
      state.kicker = "You're Invited To Celebrate!";
      state.connector = 'is';
      state.badge = 'BIRTHDAY CELEBRATION';
      state.shloka = '✦ LET’S CELEBRATE TOGETHER ✦';
      state.message = 'Join us for fun, cake, balloons & joyous memories';
      state.theme = 'pastel';
      dom.dispPreviewCardName.textContent = 'Balloon Pop Vibrant';

      dom.cardDeityWrap.style.display = 'flex';
      dom.cardDeityWrap.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
          <path d="M12 2v2M4.93 4.93l1.41 1.41M19.07 4.93l-1.41 1.41"></path>
        </svg>`;

      if (dom.btnLivingKeepsake) {
        dom.btnLivingKeepsake.href = 'templates.html?cat=birthday';
        dom.btnLivingKeepsake.innerHTML = `<span>Explore Birthday 3D Keepsakes</span> <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
      }
    } else if (newOccasion === 'housewarming') {
      dom.detailsHeading.textContent = 'Housewarming Details';
      dom.detailsSub.textContent = 'Fill in family names, new home name, date and muhurat time.';
      dom.labelBride.textContent = "Family / Host Name";
      dom.labelGroom.textContent = 'New Home Name (e.g. Dream Villa)';

      state.name1 = 'Sharma Family';
      state.name2 = 'Aashirwad Villa';
      state.kicker = 'Griha Pravesh';
      state.connector = 'welcomes you to';
      state.badge = 'GRIHA PRAVESH CEREMONY';
      state.shloka = '॥ ॐ नमो भगवते वासुदेवाय नमः ॥';
      state.message = 'With the blessings of God and elders, we step into our new home';
      state.theme = 'rajwada';
      dom.dispPreviewCardName.textContent = 'Griha Pravesh Bliss';

      dom.cardDeityWrap.style.display = 'flex';
      dom.cardDeityWrap.innerHTML = `
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
          <path d="M4 15 16 5l12 10M7 13v14h18V13"/>
          <path d="M13 27v-8h6v8"/>
        </svg>`;

      if (dom.btnLivingKeepsake) {
        dom.btnLivingKeepsake.href = 'templates.html?cat=all';
        dom.btnLivingKeepsake.innerHTML = `<span>Explore All Keepsakes</span> <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
      }
    }

    // Sync input values
    dom.inputBride.value = state.name1;
    dom.inputGroom.value = state.name2;
    dom.inputKicker.value = state.kicker;
    dom.inputConnector.value = state.connector;
    dom.inputMessage.value = state.message;

    renderDesignGrid('all');
    renderLivePreview();
  }

  // --- UPDATE HERO FAN CARDS ---
  function updateHeroFan(occasion) {
    const data = FAN_ASSETS[occasion] || FAN_ASSETS.wedding;
    if (dom.fanImgLeft) {
      dom.fanImgLeft.src = data.left.img;
      dom.fanImgLeft.alt = data.left.alt;
    }
    if (dom.fanImgCenter) {
      dom.fanImgCenter.src = data.center.img;
      dom.fanImgCenter.alt = data.center.alt;
    }
    if (dom.fanImgRight) {
      dom.fanImgRight.src = data.right.img;
      dom.fanImgRight.alt = data.right.alt;
    }
  }

  // --- STEP NAVIGATION ---
  function goToStep(stepNum) {
    state.currentStep = stepNum;

    // Update Tab Headers
    dom.stepButtons.forEach(btn => {
      const s = parseInt(btn.getAttribute('data-step'), 10);
      btn.setAttribute('aria-selected', s === stepNum ? 'true' : 'false');
    });

    // Update Panes
    Object.keys(dom.panes).forEach(k => {
      const pane = dom.panes[k];
      if (parseInt(k, 10) === stepNum) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    // Scroll smoothly to maker panel on mobile
    if (window.innerWidth < 1024) {
      document.body.classList.remove('ivm-view-preview');
      dom.dockBtnForm.classList.add('active');
      dom.dockBtnCard.classList.remove('active');
    }
  }

  // --- RENDER DESIGN GRID ---
  function renderDesignGrid(filter) {
    const list = DESIGNS_CATALOG[state.occasion] || [];
    dom.designGrid.innerHTML = '';

    list.forEach(item => {
      if (filter !== 'all' && item.category !== filter) return;

      const isSelected = item.theme === state.theme;
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'ivm-tcard';
      card.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      card.setAttribute('data-theme', item.theme);
      card.setAttribute('data-name', item.name);

      card.innerHTML = `
        <div class="ivm-tcard-preview" style="background: ${item.bg || '#1a1016'};">
          ${item.img ? `<img src="${item.img}" alt="${item.name}" class="ivm-tcard-img" />` : `
            <div style="font-size:10px;letter-spacing:0.1em;opacity:0.8;margin-bottom:4px;color:#ecc978;">VANVI LUXE</div>
            <div style="font-family:'Pinyon Script',cursive;font-size:18px;color:#ecc978;">${state.name1}</div>
            <div style="font-size:10px;opacity:0.85;">${state.connector}</div>
            <div style="font-family:'Pinyon Script',cursive;font-size:18px;color:#ecc978;">${state.name2}</div>
          `}
        </div>
        <div class="ivm-tn">
          <span>${item.name}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        state.theme = item.theme;
        dom.dispPreviewCardName.textContent = item.name;
        dom.dispActivePaletteName.textContent = item.name;

        // Update selected states
        dom.designGrid.querySelectorAll('.ivm-tcard').forEach(c => c.setAttribute('aria-pressed', 'false'));
        card.setAttribute('aria-pressed', 'true');

        // Apply theme to card
        applyTheme(item.theme);
      });

      dom.designGrid.appendChild(card);
    });
  }

  // --- THEME & FONT APPLICATION ---
  function applyTheme(themeName) {
    // Clear existing theme classes
    dom.cardCanvas.className = 'ivm-card-canvas';
    dom.cardCanvas.classList.add(`theme-${themeName}`);

    // Update swatches active state
    if (dom.paletteSwatchesGroup) {
      dom.paletteSwatchesGroup.querySelectorAll('.ivm-st-th').forEach(th => {
        const t = th.getAttribute('data-theme');
        th.setAttribute('aria-checked', t === themeName ? 'true' : 'false');
      });
    }
  }

  function applyFont(fontName) {
    state.font = fontName;

    // Reset fonts
    dom.dispCardName1.className = 'ivm-card-name';
    dom.dispCardName2.className = 'ivm-card-name';

    dom.dispCardName1.classList.add(`font-${fontName}`);
    dom.dispCardName2.classList.add(`font-${fontName}`);

    dom.fontPairButtons.forEach(btn => {
      const f = btn.getAttribute('data-font');
      btn.setAttribute('aria-checked', f === fontName ? 'true' : 'false');
    });

    const activePair = Array.from(dom.fontPairButtons).find(b => b.getAttribute('data-font') === fontName);
    if (activePair) {
      dom.dispActiveFontName.textContent = activePair.querySelector('.ivm-st-pair-n').textContent;
    }
  }

  // --- LIVE PREVIEW RENDERING ---
  function renderLivePreview() {
    dom.dispCardName1.textContent = state.name1 || 'Name 1';
    dom.dispCardName2.textContent = state.name2 || 'Name 2';
    dom.dispCardConnector.textContent = state.connector;
    dom.dispCardConnector.style.display = state.hideConnector ? 'none' : 'block';

    dom.dispCardShloka.textContent = state.kicker;
    dom.dispCardShloka.style.display = state.hideKicker ? 'none' : 'block';

    dom.dispCardMessage.textContent = state.message;
    dom.dispCardBadge.textContent = state.badge;

    // Format Date & Time nicely
    dom.dispCardDateTime.textContent = formatEventDateTime(state.date, state.time);
    dom.dispCardVenue.textContent = state.venue;

    // Apply active theme & font
    applyTheme(state.theme);
    applyFont(state.font);
  }

  function formatEventDateTime(dateStr, timeStr) {
    let formattedDate = dateStr;
    try {
      const d = new Date(dateStr + 'T12:00:00');
      if (!isNaN(d.getTime())) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const dayName = days[d.getDay()];
        const dayNum = d.getDate();
        const monthName = months[d.getMonth()];
        const year = d.getFullYear();

        let suffix = 'th';
        if (dayNum % 10 === 1 && dayNum !== 11) suffix = 'st';
        else if (dayNum % 10 === 2 && dayNum !== 12) suffix = 'nd';
        else if (dayNum % 10 === 3 && dayNum !== 13) suffix = 'rd';

        formattedDate = `${dayName}, ${dayNum}${suffix} ${monthName} ${year}`;
      }
    } catch (e) {}

    let formattedTime = timeStr;
    if (timeStr) {
      const parts = timeStr.split(':');
      let hour = parseInt(parts[0], 10);
      const min = parts[1] || '00';
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12 || 12;
      formattedTime = `${hour}:${min} ${ampm}`;
    }

    return `${formattedDate} • ${formattedTime}`;
  }

  // --- QR CODE GENERATOR ---
  function updateQRCode() {
    if (!window.QRCode) return;
    const url = state.mapsUrl || 'https://maps.google.com';
    dom.dispCardQr.innerHTML = '';

    window.QRCode.toCanvas(
      url,
      {
        width: 36,
        margin: 0,
        color: {
          dark: '#1e020a',
          light: '#ffffff'
        }
      },
      function (error, canvas) {
        if (!error && canvas) {
          canvas.style.borderRadius = '3px';
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          dom.dispCardQr.appendChild(canvas);
        }
      }
    );
  }

  // --- ASPECT RATIO TOGGLE ---
  function setRatio(newRatio) {
    state.ratio = newRatio;
    if (newRatio === 'post') {
      dom.segRatioPost.setAttribute('aria-pressed', 'true');
      dom.segRatioStory.setAttribute('aria-pressed', 'false');
      dom.liveCardStage.classList.remove('ratio-story');
      dom.liveCardStage.classList.add('ratio-post');
    } else {
      dom.segRatioPost.setAttribute('aria-pressed', 'false');
      dom.segRatioStory.setAttribute('aria-pressed', 'true');
      dom.liveCardStage.classList.remove('ratio-post');
      dom.liveCardStage.classList.add('ratio-story');
    }

    // Sync download format cards in step 4
    dom.dlCards.forEach(c => {
      const r = c.getAttribute('data-dl-ratio');
      c.setAttribute('aria-checked', r === newRatio ? 'true' : 'false');
    });
  }

  // --- DIRECT 4K PNG DOWNLOAD ---
  async function downloadCardPNG() {
    if (!window.html2canvas) {
      alert('Generating high-resolution canvas engine...');
      return;
    }

    const downloadButtons = [dom.btnPrimaryDownloadPNG, dom.btnSideDownloadPNG, dom.btnNavDownload];
    downloadButtons.forEach(btn => {
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span>Rendering 4K Card...</span>`;
      }
    });

    try {
      const scaleFactor = window.innerWidth < 768 ? 2.5 : 3.5;
      const canvas = await window.html2canvas(dom.cardCanvas, {
        scale: scaleFactor,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const filename = `${state.name1}_${state.name2}_VanviMoments_Card.png`.replace(/\s+/g, '_');
      link.download = filename;
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Confetti celebration
      if (window.confetti) {
        window.confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('Error generating card image. Please try again.');
    } finally {
      downloadButtons.forEach(btn => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Download card</span>
          `;
        }
      });
    }
  }

  // --- WHATSAPP SHARE ---
  function shareViaWhatsApp() {
    const text = encodeURIComponent(
      `✨ *INVITATION: ${state.name1} & ${state.name2}*\n\n` +
      `📅 *Date:* ${formatEventDateTime(state.date, state.time)}\n` +
      `📍 *Venue:* ${state.venue}\n` +
      `🗺️ *Google Maps:* ${state.mapsUrl}\n\n` +
      `We warmly invite you to celebrate with us!\n` +
      `— Created with Vanvi Moments`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  }

  // --- EVENT BINDINGS ---
  function bindEvents() {
    // 1. Occasion
    dom.pickWedding.addEventListener('click', () => switchOccasion('wedding'));
    dom.pickBirthday.addEventListener('click', () => switchOccasion('birthday'));
    if (dom.pickHousewarming) {
      dom.pickHousewarming.addEventListener('click', () => switchOccasion('housewarming'));
    }

    // Hero Fan Click -> Select Design & Smooth Scroll
    function selectFanCard(cardKey) {
      const cur = FAN_ASSETS[state.occasion]?.[cardKey];
      if (cur) {
        state.theme = cur.theme;
        dom.dispPreviewCardName.textContent = cur.name;
        dom.dispActivePaletteName.textContent = cur.name;
        applyTheme(cur.theme);
        if (dom.designGrid) {
          dom.designGrid.querySelectorAll('.ivm-tcard').forEach(c => {
            const isMatch = c.getAttribute('data-theme') === cur.theme;
            c.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
          });
        }
        document.querySelector('.ivm-maker')?.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (dom.fanCardLeft) dom.fanCardLeft.addEventListener('click', () => selectFanCard('left'));
    if (dom.fanCardCenter) dom.fanCardCenter.addEventListener('click', () => selectFanCard('center'));
    if (dom.fanCardRight) dom.fanCardRight.addEventListener('click', () => selectFanCard('right'));

    // 2. Step Navigation
    dom.stepButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const s = parseInt(btn.getAttribute('data-step'), 10);
        goToStep(s);
      });
    });

    dom.btnNextToDesign.addEventListener('click', () => goToStep(2));
    dom.btnBackToDetails.addEventListener('click', () => goToStep(1));
    dom.btnNextToStyle.addEventListener('click', () => goToStep(3));
    dom.btnBackToDesign.addEventListener('click', () => goToStep(2));
    dom.btnNextToDownload.addEventListener('click', () => goToStep(4));

    // 3. Inputs Real-time Binding
    dom.inputBride.addEventListener('input', e => { state.name1 = e.target.value; renderLivePreview(); });
    dom.inputGroom.addEventListener('input', e => { state.name2 = e.target.value; renderLivePreview(); });
    dom.inputDate.addEventListener('input', e => { state.date = e.target.value; renderLivePreview(); });
    dom.inputTime.addEventListener('input', e => { state.time = e.target.value; renderLivePreview(); });
    dom.inputVenue.addEventListener('input', e => { state.venue = e.target.value; renderLivePreview(); });
    dom.inputMessage.addEventListener('input', e => { state.message = e.target.value; renderLivePreview(); });
    dom.inputMaps.addEventListener('input', e => { state.mapsUrl = e.target.value; updateQRCode(); });

    // 4. Wording Accordion & Toggles
    dom.btnToggleWording.addEventListener('click', () => {
      const isOpen = dom.wordingBody.classList.toggle('open');
      dom.btnToggleWording.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    dom.inputKicker.addEventListener('input', e => { state.kicker = e.target.value; renderLivePreview(); });
    dom.btnEyeKicker.addEventListener('click', () => {
      state.hideKicker = !state.hideKicker;
      dom.btnEyeKicker.setAttribute('aria-pressed', state.hideKicker ? 'true' : 'false');
      dom.btnEyeKicker.querySelector('span').textContent = state.hideKicker ? 'Show' : 'Hide';
      renderLivePreview();
    });

    dom.inputConnector.addEventListener('input', e => { state.connector = e.target.value; renderLivePreview(); });
    dom.btnEyeConnector.addEventListener('click', () => {
      state.hideConnector = !state.hideConnector;
      dom.btnEyeConnector.setAttribute('aria-pressed', state.hideConnector ? 'true' : 'false');
      dom.btnEyeConnector.querySelector('span').textContent = state.hideConnector ? 'Show' : 'Hide';
      renderLivePreview();
    });

    // 5. Photo Upload & Cloudinary
    dom.photoFileIn.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = ev => {
          state.photoUrl = ev.target.result;
          dom.cardPhotoImg.src = state.photoUrl;
          dom.cardPhotoWrap.style.display = 'block';
          dom.photoThumb.style.backgroundImage = `url(${state.photoUrl})`;
        };
        reader.readAsDataURL(file);
      }
    });

    dom.btnLoadCloudinary.addEventListener('click', () => {
      const url = dom.cloudinaryUrlIn.value.trim();
      if (url) {
        state.photoUrl = url;
        dom.cardPhotoImg.src = url;
        dom.cardPhotoWrap.style.display = 'block';
        dom.photoThumb.style.backgroundImage = `url(${url})`;
      }
    });

    dom.btnRemovePhoto.addEventListener('click', () => {
      state.photoUrl = '';
      dom.cardPhotoImg.src = '';
      dom.cardPhotoWrap.style.display = 'none';
      dom.photoThumb.style.backgroundImage = 'none';
      dom.cloudinaryUrlIn.value = '';
      dom.photoFileIn.value = '';
    });

    dom.photoPosSlider.addEventListener('input', e => {
      state.photoPos = e.target.value;
      dom.cardPhotoImg.style.objectPosition = `50% ${state.photoPos}%`;
    });

    // 6. Filter Chips
    if (dom.designFilterChips) {
      dom.designFilterChips.querySelectorAll('.ivm-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          dom.designFilterChips.querySelectorAll('.ivm-chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
          chip.setAttribute('aria-pressed', 'true');
          renderDesignGrid(chip.getAttribute('data-filter'));
        });
      });
    }

    // 7. Palette Swatches & Custom Color
    if (dom.paletteSwatchesGroup) {
      dom.paletteSwatchesGroup.querySelectorAll('.ivm-st-th').forEach(th => {
        th.addEventListener('click', () => {
          const t = th.getAttribute('data-theme');
          if (t) {
            state.theme = t;
            dom.dispActivePaletteName.textContent = th.querySelector('.ivm-st-name').textContent;
            applyTheme(t);
          }
        });
      });
    }

    if (dom.customColorPicker) {
      dom.customColorPicker.addEventListener('input', e => {
        const hex = e.target.value;
        dom.cardCanvas.className = 'ivm-card-canvas';
        dom.cardCanvas.style.background = `radial-gradient(120% 90% at 50% 30%, ${hex}, #000000)`;
        dom.dispActivePaletteName.textContent = 'Custom Palette';
      });
    }

    // 8. Font Pairings
    dom.fontPairButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const font = btn.getAttribute('data-font');
        applyFont(font);
      });
    });

    // 9. Aspect Ratio
    dom.segRatioPost.addEventListener('click', () => setRatio('post'));
    dom.segRatioStory.addEventListener('click', () => setRatio('story'));

    dom.dlCards.forEach(c => {
      c.addEventListener('click', () => {
        const r = c.getAttribute('data-dl-ratio');
        setRatio(r);
      });
    });

    // 10. Downloads
    dom.btnPrimaryDownloadPNG.addEventListener('click', downloadCardPNG);
    dom.btnSideDownloadPNG.addEventListener('click', downloadCardPNG);
    dom.btnNavDownload.addEventListener('click', downloadCardPNG);
    dom.btnShareWhatsApp.addEventListener('click', shareViaWhatsApp);

    // 11. Mobile Dock
    if (dom.dockBtnForm) {
      dom.dockBtnForm.addEventListener('click', () => {
        document.body.classList.remove('ivm-view-preview');
        dom.dockBtnForm.classList.add('active');
        dom.dockBtnCard.classList.remove('active');
        goToStep(1);
      });
    }

    if (dom.dockBtnCard) {
      dom.dockBtnCard.addEventListener('click', () => {
        document.body.classList.add('ivm-view-preview');
        dom.dockBtnForm.classList.remove('active');
        dom.dockBtnCard.classList.add('active');
        dom.liveCardStage.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (dom.dockBtnDl) {
      dom.dockBtnDl.addEventListener('click', () => {
        downloadCardPNG();
      });
    }

    // 12. Inline Card Editing 2-Way Binding
    dom.dispCardName1.addEventListener('input', e => {
      state.name1 = e.target.textContent;
      dom.inputBride.value = state.name1;
    });

    dom.dispCardName2.addEventListener('input', e => {
      state.name2 = e.target.textContent;
      dom.inputGroom.value = state.name2;
    });

    dom.dispCardVenue.addEventListener('input', e => {
      state.venue = e.target.textContent;
      dom.inputVenue.value = state.venue;
    });
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
