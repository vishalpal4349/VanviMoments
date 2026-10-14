/**
 * ==========================================================================
 * VANVI MOMENTS — ROYAL INVITATION STUDIO CONTROLLER
 * Real-time WYSIWYG sync, QR Code Generator, 4K Canvas Export & Presets
 * ==========================================================================
 */

(function () {
  'use strict';

  // --- Studio State ---
  const state = {
    ratio: 'post', // 'post' (4:5) or 'story' (9:16)
    theme: 'theme-rajwada',
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

  // --- Shloka & Wording Presets ---
  const PRESETS = {
    shlokas: {
      ganesh: '॥ श्री गणेशाय नमः ॥\nवक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
      vishnu: '॥ ॐ श्री लक्ष्मीनारायणाभ्यां नमः ॥\nमांगल्यम् भगवान विष्णुः मांगल्यम् गरुड़ध्वजः। मांगल्यम् पुण्डरीकाक्षो मंगलायतनो हरिः॥',
      radhaKrishna: '॥ ॐ श्री राधारमणे नमः ॥\nप्रेम की पावन धारा में, दो हृदयों का मिलन। आपके स्नेह और आशीर्वाद की सादर प्रतीक्षा॥',
      modern: 'Two lives, two hearts, joined together in friendship, united forever in love.',
      none: ''
    },
    wordingTones: {
      royal: {
        host: 'Under the gracious presence of our elders and with boundless joy, we invite you to celebrate the auspicious wedding of',
        badge: 'ROYAL VIVAH CEREMONY'
      },
      traditional: {
        host: 'With the divine blessings of our ancestors and family, we cordially solicit your esteemed presence on the auspicious wedding of',
        badge: 'SHUBH VIVAH'
      },
      modern: {
        host: 'We would be honored to have you celebrate with us as we step into our forever together:',
        badge: 'WEDDING CELEBRATION'
      },
      cocktail: {
        host: 'Get ready for an evening of laughter, music, dance and unforgettable memories celebrating',
        badge: 'SANGEET & COCKTAIL NIGHT'
      }
    }
  };

  // --- DOM Elements ---
  const cardEl = document.getElementById('invitationCard');
  const canvasWrapper = document.getElementById('canvasDeviceWrapper');
  const qrContainer = document.getElementById('qrCodeContainer');

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

  // Card Display Elements
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

  // --- Render State to Card ---
  function renderCard() {
    if (!cardEl) return;

    // Theme class
    cardEl.className = `vanvi-invitation-card ${state.theme}`;

    // Aspect ratio
    if (canvasWrapper) {
      canvasWrapper.className = `canvas-device-wrapper ratio-${state.ratio}`;
    }

    // Texts
    if (dispShloka) {
      dispShloka.innerText = state.customShloka;
      dispShloka.style.display = state.customShloka.trim() ? 'block' : 'none';
    }
    if (dispHostGreeting) dispHostGreeting.innerText = state.hostGreeting;
    if (dispGroom) dispGroom.innerText = state.groom;
    if (dispGroomParents) {
      dispGroomParents.innerText = state.groomParents;
      dispGroomParents.style.display = state.showParents && state.groomParents.trim() ? 'block' : 'none';
    }
    if (dispBride) dispBride.innerText = state.bride;
    if (dispBrideParents) {
      dispBrideParents.innerText = state.brideParents;
      dispBrideParents.style.display = state.showParents && state.brideParents.trim() ? 'block' : 'none';
    }
    if (dispEventBadge) dispEventBadge.innerText = state.eventBadge;
    if (dispEventDate) dispEventDate.innerText = state.eventDate;
    if (dispEventTime) dispEventTime.innerText = state.eventTime;
    if (dispVenueName) dispVenueName.innerText = state.venueName;
    if (dispVenueAddress) dispVenueAddress.innerText = state.venueAddress;

    if (dispRsvpName) dispRsvpName.innerText = state.rsvpName;
    if (dispRsvpPhone) dispRsvpPhone.innerText = state.rsvpPhone;

    // Photo
    if (cardPhotoWrap && cardPhotoImg) {
      if (state.showPhoto && state.photoData) {
        cardPhotoImg.src = state.photoData;
        cardPhotoWrap.classList.add('visible');
      } else {
        cardPhotoWrap.classList.remove('visible');
      }
    }

    // QR Visibility
    if (cardVenueQRBox) {
      cardVenueQRBox.style.display = state.showQR ? 'flex' : 'none';
    }

    renderVenueQRCode();
  }

  // --- Generate Royal Gold QR Code for Venue Route ---
  function renderVenueQRCode() {
    if (!qrContainer || !state.showQR) return;
    qrContainer.innerHTML = '';

    const url = state.venueUrl && state.venueUrl.trim()
      ? state.venueUrl.trim()
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(state.venueName + ' ' + state.venueAddress)}`;

    if (window.QRCode) {
      try {
        const qrCanvas = document.createElement('canvas');
        window.QRCode.toCanvas(qrCanvas, url, {
          width: 80,
          margin: 1,
          color: {
            dark: '#2c1224',
            light: '#ffffff'
          }
        }, function (error) {
          if (!error) {
            qrContainer.appendChild(qrCanvas);
          } else {
            console.warn('QRCode generation failed, fallback image used');
            qrContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(url)}" alt="QR Code"/>`;
          }
        });
      } catch (e) {
        qrContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(url)}" alt="QR Code"/>`;
      }
    } else {
      qrContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(url)}" alt="QR Code"/>`;
    }
  }

  // --- Initialize Form Inputs ---
  function initForm() {
    const bindInput = (el, key) => {
      if (!el) return;
      el.addEventListener('input', e => {
        state[key] = e.target.value;
        renderCard();
      });
    };

    bindInput(inpShloka, 'customShloka');
    bindInput(inpHostGreeting, 'hostGreeting');
    bindInput(inpGroom, 'groom');
    bindInput(inpGroomParents, 'groomParents');
    bindInput(inpBride, 'bride');
    bindInput(inpBrideParents, 'brideParents');
    bindInput(inpEventBadge, 'eventBadge');
    bindInput(inpEventDate, 'eventDate');
    bindInput(inpEventTime, 'eventTime');
    bindInput(inpVenueName, 'venueName');
    bindInput(inpVenueAddress, 'venueAddress');
    bindInput(inpVenueUrl, 'venueUrl');
    bindInput(inpRsvpName, 'rsvpName');
    bindInput(inpRsvpPhone, 'rsvpPhone');

    // Toggles
    if (toggleParents) {
      toggleParents.addEventListener('change', e => {
        state.showParents = e.target.checked;
        renderCard();
      });
    }
    if (toggleQR) {
      toggleQR.addEventListener('change', e => {
        state.showQR = e.target.checked;
        renderCard();
      });
    }

    // Two-way inline editing inside the card
    const bindInline = (dispEl, inpEl, key) => {
      if (!dispEl) return;
      dispEl.addEventListener('input', () => {
        state[key] = dispEl.innerText;
        if (inpEl) inpEl.value = dispEl.innerText;
      });
    };

    bindInline(dispGroom, inpGroom, 'groom');
    bindInline(dispBride, inpBride, 'bride');
    bindInline(dispEventDate, inpEventDate, 'eventDate');
    bindInline(dispVenueName, inpVenueName, 'venueName');
  }

  // --- Theme Selection ---
  function initThemes() {
    const themeCards = document.querySelectorAll('.theme-card-option');
    themeCards.forEach(card => {
      card.addEventListener('click', () => {
        themeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.theme = card.getAttribute('data-theme');
        renderCard();
      });
    });
  }

  // --- Tabs Navigation ---
  function initTabs() {
    const tabBtns = document.querySelectorAll('.studio-tab-btn');
    const panels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const target = btn.getAttribute('data-tab');
        const activePanel = document.getElementById(`panel_${target}`);
        if (activePanel) activePanel.classList.add('active');
      });
    });
  }

  // --- Aspect Ratio Buttons ---
  function initRatioToggle() {
    const ratioBtns = document.querySelectorAll('.ratio-btn');
    ratioBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        ratioBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.ratio = btn.getAttribute('data-ratio');
        renderCard();
      });
    });
  }

  // --- Presets Engine (Shlokas & Tones) ---
  function initPresets() {
    // Shloka Chips
    document.querySelectorAll('[data-preset-shloka]').forEach(chip => {
      chip.addEventListener('click', () => {
        const key = chip.getAttribute('data-preset-shloka');
        if (PRESETS.shlokas[key] !== undefined) {
          state.customShloka = PRESETS.shlokas[key];
          if (inpShloka) inpShloka.value = state.customShloka;
          renderCard();
        }
      });
    });

    // Tone Chips
    document.querySelectorAll('[data-preset-tone]').forEach(chip => {
      chip.addEventListener('click', () => {
        const key = chip.getAttribute('data-preset-tone');
        const tone = PRESETS.wordingTones[key];
        if (tone) {
          state.hostGreeting = tone.host;
          state.eventBadge = tone.badge;
          if (inpHostGreeting) inpHostGreeting.value = tone.host;
          if (inpEventBadge) inpEventBadge.value = tone.badge;
          renderCard();
        }
      });
    });
  }

  // --- Photo Uploader ---
  function initPhotoUploader() {
    const fileInput = document.getElementById('inpPhotoFile');
    const togglePhoto = document.getElementById('togglePhoto');
    const photoThumb = document.getElementById('photoPreviewThumb');
    const btnRemovePhoto = document.getElementById('btnRemovePhoto');

    if (togglePhoto) {
      togglePhoto.addEventListener('change', e => {
        state.showPhoto = e.target.checked;
        renderCard();
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', e => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (evt) {
          state.photoData = evt.target.result;
          state.showPhoto = true;
          if (togglePhoto) togglePhoto.checked = true;
          if (photoThumb) {
            photoThumb.src = state.photoData;
            photoThumb.style.display = 'block';
          }
          if (btnRemovePhoto) btnRemovePhoto.style.display = 'inline-block';
          renderCard();
        };
        reader.readAsDataURL(file);
      });
    }

    if (btnRemovePhoto) {
      btnRemovePhoto.addEventListener('click', () => {
        state.photoData = null;
        state.showPhoto = false;
        if (fileInput) fileInput.value = '';
        if (togglePhoto) togglePhoto.checked = false;
        if (photoThumb) photoThumb.style.display = 'none';
        btnRemovePhoto.style.display = 'none';
        renderCard();
      });
    }
  }

  // --- Mobile Dock Toggle (< 920px) ---
  function initMobileDock() {
    const tabEdit = document.getElementById('dockTabEdit');
    const tabPreview = document.getElementById('dockTabPreview');

    if (tabEdit && tabPreview) {
      tabEdit.addEventListener('click', () => {
        tabEdit.classList.add('active');
        tabPreview.classList.remove('active');
        document.body.classList.remove('view-preview-mode');
      });

      tabPreview.addEventListener('click', () => {
        tabPreview.classList.add('active');
        tabEdit.classList.remove('active');
        document.body.classList.add('view-preview-mode');
      });
    }
  }

  // --- Export Modal & High-Resolution Download ---
  function initExportEngine() {
    const btnDownloadTrigger = document.getElementById('btnTriggerDownload');
    const btnDockDownload = document.getElementById('btnDockDownload');
    const modalDownload = document.getElementById('modalDownload');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnConfirmDownload = document.getElementById('btnConfirmDownload');
    const btnShareWhatsApp = document.getElementById('btnShareWhatsApp');

    function openModal() {
      if (modalDownload) modalDownload.classList.add('active');
    }
    function closeModal() {
      if (modalDownload) modalDownload.classList.remove('active');
    }

    if (btnDownloadTrigger) btnDownloadTrigger.addEventListener('click', openModal);
    if (btnDockDownload) btnDockDownload.addEventListener('click', openModal);
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (modalDownload) {
      modalDownload.addEventListener('click', e => {
        if (e.target === modalDownload) closeModal();
      });
    }

    // High-Res 4K Image Render with html2canvas
    if (btnConfirmDownload) {
      btnConfirmDownload.addEventListener('click', async () => {
        btnConfirmDownload.disabled = true;
        btnConfirmDownload.innerHTML = `<span>Generating 4K Ultra-HD Card...</span>`;

        try {
          if (!window.html2canvas) {
            // Dynamically load html2canvas if not loaded
            await new Promise((res, rej) => {
              const s = document.createElement('script');
              s.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
              s.onload = res;
              s.onerror = rej;
              document.head.appendChild(s);
            });
          }

          const canvas = await window.html2canvas(cardEl, {
            scale: 3, // 3x resolution for print & crisp WhatsApp quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: null
          });

          const dataUrl = canvas.toDataURL('image/png', 1.0);
          const link = document.createElement('a');
          const cleanName = `${state.groom}_${state.bride}_Invitation`.replace(/[^a-zA-Z0-9_]/g, '');
          link.download = `VanviMoments_${cleanName}.png`;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Confetti celebration
          if (window.confetti) {
            window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          }

          btnConfirmDownload.innerHTML = `<span>✓ Downloaded Successfully!</span>`;
          setTimeout(() => {
            btnConfirmDownload.disabled = false;
            btnConfirmDownload.innerHTML = `<span>Download 4K Card (PNG)</span>`;
            closeModal();
          }, 1800);
        } catch (err) {
          console.error('Download error:', err);
          alert('Could not generate canvas download. Please take a high-res screenshot or check connection.');
          btnConfirmDownload.disabled = false;
          btnConfirmDownload.innerHTML = `<span>Download 4K Card (PNG)</span>`;
        }
      });
    }

    // Share via WhatsApp
    if (btnShareWhatsApp) {
      btnShareWhatsApp.addEventListener('click', () => {
        const msg = encodeURIComponent(
          `*${state.eventBadge}*\n\n` +
          `Warm Greetings!\n` +
          `${state.hostGreeting}\n\n` +
          `💍 *${state.groom}* & *${state.bride}*\n\n` +
          `📅 *Date:* ${state.eventDate}\n` +
          `⏰ *Time:* ${state.eventTime}\n` +
          `📍 *Venue:* ${state.venueName}, ${state.venueAddress}\n\n` +
          `🗺️ *Google Maps Route:* ${state.venueUrl}\n` +
          `📞 *RSVP:* ${state.rsvpName} (${state.rsvpPhone})\n\n` +
          `_Handcrafted with Love on Vanvi Moments_`
        );
        window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
      });
    }
  }

  // --- Interactive Web Keepsake Modal ---
  function initWebKeepsake() {
    const btnWebTrigger = document.getElementById('btnTriggerWebKeepsake');
    const modalWeb = document.getElementById('modalWebKeepsake');
    const btnCloseWeb = document.getElementById('btnCloseWebModal');
    const inpLiveWebUrl = document.getElementById('inpLiveWebUrl');
    const btnCopyWebUrl = document.getElementById('btnCopyWebUrl');
    const btnOpenWebUrl = document.getElementById('btnOpenWebUrl');

    function openModal() {
      // Encode config into URL params
      const payload = btoa(unescape(encodeURIComponent(JSON.stringify(state))));
      const keepsakeUrl = `${window.location.origin}/preview.html?template=temple-royal-wedding&inviteData=${payload}`;

      if (inpLiveWebUrl) inpLiveWebUrl.value = keepsakeUrl;
      if (btnOpenWebUrl) btnOpenWebUrl.href = keepsakeUrl;
      if (modalWeb) modalWeb.classList.add('active');
    }

    function closeModal() {
      if (modalWeb) modalWeb.classList.remove('active');
    }

    if (btnWebTrigger) btnWebTrigger.addEventListener('click', openModal);
    if (btnCloseWeb) btnCloseWeb.addEventListener('click', closeModal);
    if (modalWeb) {
      modalWeb.addEventListener('click', e => {
        if (e.target === modalWeb) closeModal();
      });
    }

    if (btnCopyWebUrl && inpLiveWebUrl) {
      btnCopyWebUrl.addEventListener('click', () => {
        navigator.clipboard.writeText(inpLiveWebUrl.value).then(() => {
          btnCopyWebUrl.textContent = 'Copied! ✨';
          setTimeout(() => { btnCopyWebUrl.textContent = 'Copy'; }, 2000);
        });
      });
    }
  }

  // --- Initialization on DOM Ready ---
  document.addEventListener('DOMContentLoaded', () => {
    initForm();
    initThemes();
    initTabs();
    initRatioToggle();
    initPresets();
    initPhotoUploader();
    initMobileDock();
    initExportEngine();
    initWebKeepsake();
    renderCard();
  });

})();
