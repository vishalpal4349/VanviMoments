// Papercut Lotus Builder Controller — Vanvi Moments Studio
const STORAGE_KEY = 'papercutConfig';

const DEFAULT_CONFIG = {
  version: 1,
  brideName: 'Ankita',
  groomName: 'Kaushik',
  title: 'Ankita & Kaushik',
  hostNames: ['Ankita', 'Kaushik'],
  introNote: 'We cordially invite you to grace the auspicious occasion of the marriage of…',
  invocation: { symbol: 'ganesha', religion: 'hindu', script: 'devanagari', custom: '' },
  eventISO: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
  dateReveal: {
    enabled: true,
    lead: '',
    buttonLabel: 'Reveal the Date!',
    revealedLabel: 'Save the Date'
  },
  groomFamily: {
    enabled: true,
    name: 'Chi. Kaushik Sharma',
    relLabel: 'Son of',
    parentA: 'Shri Ramesh Chandra Sharma',
    parentB: 'Smt. Sunita Sharma',
    grandLabel: 'Grandson of',
    grandA: 'Late Shri Pandit Brij Mohan Sharma',
    grandB: 'Late Smt. Kamla Devi Sharma',
    gotraLabel: 'Gotra',
    gotra: 'Bharadwaj'
  },
  brideFamily: {
    enabled: true,
    name: 'Kum. Ankita Verma',
    relLabel: 'Daughter of',
    parentA: 'Shri Rajesh Kumar Verma',
    parentB: 'Smt. Meera Verma',
    grandLabel: 'Granddaughter of',
    grandA: 'Late Shri Hari Prasad Verma',
    grandB: 'Late Smt. Shanti Devi Verma',
    gotraLabel: 'Gotra',
    gotra: 'Kashyap'
  },
  ceremonies: [
    { name: 'Ring Ceremony', art: 'media/ring_ceremony.webp', date: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0], time: '19:00', venue: 'Sharma Residence, Jaipur', mapUrl: '', enabled: true },
    { name: 'Mehendi', art: 'media/mehendi.webp', date: new Date(Date.now() + 13 * 86400000).toISOString().split('T')[0], time: '11:00', venue: 'Sharma Residence, Jaipur', mapUrl: '', enabled: true },
    { name: 'Haldi', art: 'media/haldi.webp', date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], time: '10:00', venue: 'Sharma Residence, Jaipur', mapUrl: '', enabled: true },
    { name: 'Sangeet', art: 'media/sangeet.webp', date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], time: '19:00', venue: 'Sharma Residence, Jaipur', mapUrl: '', enabled: true },
    { name: 'Vivaah', art: 'media/vivaah.webp', date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0], time: '10:00', venue: 'Sharma Residence, Jaipur', mapUrl: '', enabled: true },
    { name: 'Reception', art: 'media/reception.webp', date: new Date(Date.now() + 16 * 86400000).toISOString().split('T')[0], time: '19:30', venue: 'Sharma Residence, Jaipur', mapUrl: '', enabled: true }
  ],
  gallery: {
    photosEnabled: true,
    notesEnabled: true,
    photos: [
      'media/photo-placeholder-1.svg',
      'media/photo-placeholder-2.svg',
      'media/photo-placeholder-3.svg'
    ],
    notes: [
      'Two souls, one journey - and every heart that walks beside them.',
      'From the first cup of chai to the last dance - thank you for being part of our story.',
      'Bring your best smile. We are saving a seat, a sweet and a song for you.'
    ]
  },
  compliments: {
    enabled: true,
    lead: 'With Best Compliments From:',
    lines: [
      'Shri Suresh Sharma & Family (Chacha-Chachi)',
      'Shri Manoj Sharma & Family (Tau-Tai)',
      'Smt. Asha Gupta & Family (Bua)',
      'Shri Rajendra Mehta & Family (Mama-Mami)'
    ]
  },
  note: {
    enabled: true,
    lead: 'A Note From Us',
    text: 'We can’t wait to celebrate this special day with you. Thank you for being part of our journey.'
  },
  music: { enabled: true, src: '', volume: 0.5 },
  social: { instagram: true, instagramUrl: '' }
};

let currentConfig = loadInitialConfig();

function loadInitialConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return deepMerge(DEFAULT_CONFIG, parsed);
    }
  } catch (e) {
    console.error('Error reading localStorage', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}

function deepMerge(base, over) {
  if (Array.isArray(base) || Array.isArray(over)) return over !== undefined ? over : base;
  if (typeof base !== 'object' || base === null) return over !== undefined ? over : base;
  if (typeof over !== 'object' || over === null) return base;
  const out = {};
  Object.keys(base).forEach((k) => { out[k] = deepMerge(base[k], over[k]); });
  Object.keys(over).forEach((k) => { if (!(k in base)) out[k] = over[k]; });
  return out;
}

function saveAndSync() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConfig));
  } catch (e) {}

  const iframe = document.getElementById('previewIframe');
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({
      type: 'UPDATE_CONFIG',
      config: currentConfig
    }, '*');
  }
}

// Elements
const elBrideName = document.getElementById('inputBrideName');
const elGroomName = document.getElementById('inputGroomName');
const elSymbol = document.getElementById('selectSymbol');
const elReligion = document.getElementById('selectReligion');
const elIntroNote = document.getElementById('inputIntroNote');

const elWeddingDate = document.getElementById('inputWeddingDate');
const elRevealBtn = document.getElementById('inputRevealBtn');
const elRevealAfter = document.getElementById('inputRevealAfter');
const elRevealLead = document.getElementById('inputRevealLead');

const elGroomFullName = document.getElementById('inputGroomFullName');
const elGroomParentA = document.getElementById('inputGroomParentA');
const elGroomParentB = document.getElementById('inputGroomParentB');
const elGroomGrandA = document.getElementById('inputGroomGrandA');
const elGroomGrandB = document.getElementById('inputGroomGrandB');
const elGroomGotraLabel = document.getElementById('inputGroomGotraLabel');
const elGroomGotra = document.getElementById('inputGroomGotra');

const elBrideFullName = document.getElementById('inputBrideFullName');
const elBrideParentA = document.getElementById('inputBrideParentA');
const elBrideParentB = document.getElementById('inputBrideParentB');
const elBrideGrandA = document.getElementById('inputBrideGrandA');
const elBrideGrandB = document.getElementById('inputBrideGrandB');
const elBrideGotraLabel = document.getElementById('inputBrideGotraLabel');
const elBrideGotra = document.getElementById('inputBrideGotra');

const elNote1 = document.getElementById('inputGalleryNote1');
const elNote2 = document.getElementById('inputGalleryNote2');
const elNote3 = document.getElementById('inputGalleryNote3');

const elComplimentLead = document.getElementById('inputComplimentLead');
const elComplimentLines = document.getElementById('inputComplimentLines');
const elNoteLead = document.getElementById('inputNoteLead');
const elNoteText = document.getElementById('inputNoteText');

const ceremoniesContainer = document.getElementById('ceremoniesListContainer');
const btnAddCeremony = document.getElementById('btnAddCeremony');

function populateFields() {
  if (elBrideName) elBrideName.value = currentConfig.brideName || '';
  if (elGroomName) elGroomName.value = currentConfig.groomName || '';
  if (elSymbol) elSymbol.value = (currentConfig.invocation && currentConfig.invocation.symbol) || 'ganesha';
  if (elReligion) elReligion.value = (currentConfig.invocation && currentConfig.invocation.religion) || 'hindu';
  if (elIntroNote) elIntroNote.value = currentConfig.introNote || '';

  if (elWeddingDate) elWeddingDate.value = currentConfig.eventISO || '';
  if (elRevealBtn) elRevealBtn.value = (currentConfig.dateReveal && currentConfig.dateReveal.buttonLabel) || 'Reveal the Date!';
  if (elRevealAfter) elRevealAfter.value = (currentConfig.dateReveal && currentConfig.dateReveal.revealedLabel) || 'Save the Date!';
  if (elRevealLead) elRevealLead.value = (currentConfig.dateReveal && currentConfig.dateReveal.lead) || '';

  const gf = currentConfig.groomFamily || {};
  if (elGroomFullName) elGroomFullName.value = gf.name || '';
  if (elGroomParentA) elGroomParentA.value = gf.parentA || '';
  if (elGroomParentB) elGroomParentB.value = gf.parentB || '';
  if (elGroomGrandA) elGroomGrandA.value = gf.grandA || '';
  if (elGroomGrandB) elGroomGrandB.value = gf.grandB || '';
  if (elGroomGotraLabel) elGroomGotraLabel.value = gf.gotraLabel || 'Gotra';
  if (elGroomGotra) elGroomGotra.value = gf.gotra || '';

  const bf = currentConfig.brideFamily || {};
  if (elBrideFullName) elBrideFullName.value = bf.name || '';
  if (elBrideParentA) elBrideParentA.value = bf.parentA || '';
  if (elBrideParentB) elBrideParentB.value = bf.parentB || '';
  if (elBrideGrandA) elBrideGrandA.value = bf.grandA || '';
  if (elBrideGrandB) elBrideGrandB.value = bf.grandB || '';
  if (elBrideGotraLabel) elBrideGotraLabel.value = bf.gotraLabel || 'Gotra';
  if (elBrideGotra) elBrideGotra.value = bf.gotra || '';

  const notes = (currentConfig.gallery && currentConfig.gallery.notes) || [];
  if (elNote1) elNote1.value = notes[0] || '';
  if (elNote2) elNote2.value = notes[1] || '';
  if (elNote3) elNote3.value = notes[2] || '';

  const comp = currentConfig.compliments || {};
  if (elComplimentLead) elComplimentLead.value = comp.lead || 'With Best Compliments From:';
  if (elComplimentLines) elComplimentLines.value = (comp.lines || []).join('\n');

  const nt = currentConfig.note || {};
  if (elNoteLead) elNoteLead.value = nt.lead || 'A Note From Us';
  if (elNoteText) elNoteText.value = nt.text || '';

  renderCeremoniesEditor();
}

function renderCeremoniesEditor() {
  if (!ceremoniesContainer) return;
  ceremoniesContainer.innerHTML = '';

  const list = currentConfig.ceremonies || [];
  list.forEach((c, idx) => {
    const item = document.createElement('div');
    item.className = 'ceremony-item-card';
    item.innerHTML = `
      <div class="ceremony-top-row">
        <span class="ceremony-badge">#${idx + 1} ${c.name || 'Ceremony'}</span>
        <button type="button" class="btn-remove-item" data-remove-ceremony="${idx}" title="Remove ceremony">&times;</button>
      </div>
      <div class="form-grid-2">
        <div class="form-field">
          <label class="field-label">Name</label>
          <input type="text" class="field-input" data-ceremony-field="name" data-idx="${idx}" value="${c.name || ''}" />
        </div>
        <div class="form-field">
          <label class="field-label">Date</label>
          <input type="date" class="field-input" data-ceremony-field="date" data-idx="${idx}" value="${c.date || ''}" />
        </div>
      </div>
      <div class="form-grid-2">
        <div class="form-field">
          <label class="field-label">Time</label>
          <input type="time" class="field-input" data-ceremony-field="time" data-idx="${idx}" value="${c.time || '10:00'}" />
        </div>
        <div class="form-field">
          <label class="field-label">Venue</label>
          <input type="text" class="field-input" data-ceremony-field="venue" data-idx="${idx}" value="${c.venue || ''}" />
        </div>
      </div>
    `;
    ceremoniesContainer.appendChild(item);
  });
}

function bindInputListeners() {
  function handleInput() {
    currentConfig.brideName = elBrideName ? elBrideName.value.trim() : 'Ankita';
    currentConfig.groomName = elGroomName ? elGroomName.value.trim() : 'Kaushik';
    currentConfig.title = currentConfig.brideName + ' & ' + currentConfig.groomName;
    currentConfig.hostNames = [currentConfig.brideName, currentConfig.groomName];

    if (!currentConfig.invocation) currentConfig.invocation = {};
    if (elSymbol) currentConfig.invocation.symbol = elSymbol.value;
    if (elReligion) currentConfig.invocation.religion = elReligion.value;
    if (elIntroNote) currentConfig.introNote = elIntroNote.value;

    if (elWeddingDate && elWeddingDate.value) {
      currentConfig.eventISO = elWeddingDate.value;
      const [y, m, d] = elWeddingDate.value.split('-').map(Number);
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const teen = d % 100 >= 11 && d % 100 <= 13;
      const suffix = teen ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' })[d % 10] || 'th';
      currentConfig.eventDay = d + suffix;
      currentConfig.eventMonth = months[m - 1] || '';
      currentConfig.eventYear = String(y);
    }

    if (!currentConfig.dateReveal) currentConfig.dateReveal = {};
    if (elRevealBtn) currentConfig.dateReveal.buttonLabel = elRevealBtn.value;
    if (elRevealAfter) currentConfig.dateReveal.revealedLabel = elRevealAfter.value;
    if (elRevealLead) currentConfig.dateReveal.lead = elRevealLead.value;

    if (!currentConfig.groomFamily) currentConfig.groomFamily = {};
    if (elGroomFullName) currentConfig.groomFamily.name = elGroomFullName.value;
    if (elGroomParentA) currentConfig.groomFamily.parentA = elGroomParentA.value;
    if (elGroomParentB) currentConfig.groomFamily.parentB = elGroomParentB.value;
    if (elGroomGrandA) currentConfig.groomFamily.grandA = elGroomGrandA.value;
    if (elGroomGrandB) currentConfig.groomFamily.grandB = elGroomGrandB.value;
    if (elGroomGotraLabel) currentConfig.groomFamily.gotraLabel = elGroomGotraLabel.value;
    if (elGroomGotra) currentConfig.groomFamily.gotra = elGroomGotra.value;

    if (!currentConfig.brideFamily) currentConfig.brideFamily = {};
    if (elBrideFullName) currentConfig.brideFamily.name = elBrideFullName.value;
    if (elBrideParentA) currentConfig.brideFamily.parentA = elBrideParentA.value;
    if (elBrideParentB) currentConfig.brideFamily.parentB = elBrideParentB.value;
    if (elBrideGrandA) currentConfig.brideFamily.grandA = elBrideGrandA.value;
    if (elBrideGrandB) currentConfig.brideFamily.grandB = elBrideGrandB.value;
    if (elBrideGotraLabel) currentConfig.brideFamily.gotraLabel = elBrideGotraLabel.value;
    if (elBrideGotra) currentConfig.brideFamily.gotra = elBrideGotra.value;

    if (!currentConfig.gallery) currentConfig.gallery = {};
    currentConfig.gallery.notes = [
      elNote1 ? elNote1.value : '',
      elNote2 ? elNote2.value : '',
      elNote3 ? elNote3.value : ''
    ].filter(Boolean);

    if (!currentConfig.compliments) currentConfig.compliments = {};
    if (elComplimentLead) currentConfig.compliments.lead = elComplimentLead.value;
    if (elComplimentLines) {
      currentConfig.compliments.lines = elComplimentLines.value.split('\n').map(s => s.trim()).filter(Boolean);
    }

    if (!currentConfig.note) currentConfig.note = {};
    if (elNoteLead) currentConfig.note.lead = elNoteLead.value;
    if (elNoteText) currentConfig.note.text = elNoteText.value;

    saveAndSync();
  }

  const inputs = document.querySelectorAll('.field-input, .field-textarea, .field-select');
  inputs.forEach(el => {
    el.addEventListener('input', handleInput);
    el.addEventListener('change', handleInput);
  });

  // Ceremony delegated events
  if (ceremoniesContainer) {
    ceremoniesContainer.addEventListener('input', (e) => {
      const field = e.target.getAttribute('data-ceremony-field');
      const idx = parseInt(e.target.getAttribute('data-idx'), 10);
      if (field && !isNaN(idx) && currentConfig.ceremonies[idx]) {
        currentConfig.ceremonies[idx][field] = e.target.value;
        saveAndSync();
      }
    });

    ceremoniesContainer.addEventListener('click', (e) => {
      const rem = e.target.closest('[data-remove-ceremony]');
      if (rem) {
        const idx = parseInt(rem.getAttribute('data-remove-ceremony'), 10);
        if (!isNaN(idx)) {
          currentConfig.ceremonies.splice(idx, 1);
          renderCeremoniesEditor();
          saveAndSync();
        }
      }
    });
  }

  if (btnAddCeremony) {
    btnAddCeremony.addEventListener('click', () => {
      currentConfig.ceremonies.push({
        name: 'New Rite',
        art: 'media/haldi.webp',
        date: currentConfig.eventISO || '',
        time: '18:00',
        venue: 'Grand Palace, Jaipur',
        mapUrl: '',
        enabled: true
      });
      renderCeremoniesEditor();
      saveAndSync();
    });
  }
}

// Section navigation pills
document.querySelectorAll('.pill-nav-item').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pill-nav-item').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const secId = pill.getAttribute('data-section');
    const target = document.getElementById(secId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Device Mockup Switcher
const btnDevicePhone = document.getElementById('btnDevicePhone');
const btnDeviceDesktop = document.getElementById('btnDeviceDesktop');
const deviceMockup = document.getElementById('deviceMockup');

if (btnDevicePhone && btnDeviceDesktop && deviceMockup) {
  btnDevicePhone.addEventListener('click', () => {
    btnDevicePhone.classList.add('active');
    btnDeviceDesktop.classList.remove('active');
    deviceMockup.classList.remove('mode-desktop');
  });

  btnDeviceDesktop.addEventListener('click', () => {
    btnDeviceDesktop.classList.add('active');
    btnDevicePhone.classList.remove('active');
    deviceMockup.classList.add('mode-desktop');
  });
}

// Mobile View Tabs (Customize vs Live Preview)
const tabBtnEditor = document.getElementById('tabBtnEditor');
const tabBtnPreview = document.getElementById('tabBtnPreview');
const dockPreviewBtn = document.getElementById('mobileDockPreviewBtn');
const dockPreviewLabel = document.getElementById('dockPreviewBtnLabel');

function showEditorTab() {
  document.body.classList.remove('viewing-preview');
  if (tabBtnEditor) tabBtnEditor.classList.add('active');
  if (tabBtnPreview) tabBtnPreview.classList.remove('active');
  if (dockPreviewLabel) dockPreviewLabel.textContent = 'Preview';
}

function showPreviewTab() {
  document.body.classList.add('viewing-preview');
  if (tabBtnPreview) tabBtnPreview.classList.add('active');
  if (tabBtnEditor) tabBtnEditor.classList.remove('active');
  if (dockPreviewLabel) dockPreviewLabel.textContent = 'Customize';
}

if (tabBtnEditor) tabBtnEditor.addEventListener('click', showEditorTab);
if (tabBtnPreview) tabBtnPreview.addEventListener('click', showPreviewTab);

if (dockPreviewBtn) {
  dockPreviewBtn.addEventListener('click', () => {
    if (document.body.classList.contains('viewing-preview')) {
      showEditorTab();
    } else {
      showPreviewTab();
    }
  });
}

// Publish Modal & Share Flow
const modal = document.getElementById('publishModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const headerPublishBtn = document.getElementById('headerPublishBtn');
const mobileDockPublishBtn = document.getElementById('mobileDockPublishBtn');
const btnPayNow = document.getElementById('btnPayNow');
const stepCheckout = document.getElementById('modalStepCheckout');
const stepSuccess = document.getElementById('modalStepSuccess');
const publishedLinkInput = document.getElementById('publishedLinkInput');
const copyUrlBtn = document.getElementById('copyUrlBtn');
const copyBtnText = document.getElementById('copyBtnText');
const modalWhatsappBtn = document.getElementById('modalWhatsappBtn');
const modalOpenLiveBtn = document.getElementById('modalOpenLiveBtn');

function openPublishModal() {
  if (!modal) return;
  modal.classList.add('is-open');
  if (stepCheckout) stepCheckout.classList.remove('hidden');
  if (stepSuccess) stepSuccess.classList.add('hidden');
}

function closePublishModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
}

if (headerPublishBtn) headerPublishBtn.addEventListener('click', openPublishModal);
if (mobileDockPublishBtn) mobileDockPublishBtn.addEventListener('click', openPublishModal);
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closePublishModal);

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePublishModal();
  });
}

let generatedLiveUrl = '';

if (btnPayNow) {
  btnPayNow.addEventListener('click', () => {
    try {
      localStorage.setItem('papercut_published', '1');
    } catch (e) {}

    // Encode configuration in URL
    const jsonStr = JSON.stringify(currentConfig);
    const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
    const origin = window.location.origin;
    const path = window.location.pathname.replace('builder.html', 'index.html');
    generatedLiveUrl = `${origin}${path}?published=true&data=${encodeURIComponent(b64)}`;

    if (publishedLinkInput) publishedLinkInput.value = generatedLiveUrl;
    if (modalOpenLiveBtn) modalOpenLiveBtn.href = generatedLiveUrl;

    if (stepCheckout) stepCheckout.classList.add('hidden');
    if (stepSuccess) stepSuccess.classList.remove('hidden');
  });
}

if (copyUrlBtn) {
  copyUrlBtn.addEventListener('click', () => {
    if (publishedLinkInput) {
      publishedLinkInput.select();
      navigator.clipboard.writeText(publishedLinkInput.value).then(() => {
        if (copyBtnText) copyBtnText.textContent = 'Copied!';
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'Copy';
        }, 2000);
      });
    }
  });
}

if (modalWhatsappBtn) {
  modalWhatsappBtn.addEventListener('click', () => {
    const bride = currentConfig.brideName || 'Ankita';
    const groom = currentConfig.groomName || 'Kaushik';
    const text = `🌸 You are warmly invited to the auspicious wedding celebration of *${bride} & ${groom}*! 🪷\n\nExperience our interactive wedding invitation with the date-reveal mechanism and schedule:\n${generatedLiveUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  });
}

// Initial boot
populateFields();
bindInputListeners();
