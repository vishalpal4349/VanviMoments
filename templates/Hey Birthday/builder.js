/**
 * Vanvi Moments — Hey Birthday Builder Controller (100% Exact Amadowish Workflow)
 */

(function () {
  'use strict';

  const defaultData = {
    recipientName: "Emma",
    senderName: "Rahul",
    notes: [
      "Some people slowly become important without you even noticing when it happened. You're definitely one of those people. ❤️",
      "I hope this year gives you plenty of moments that make you genuinely happy — even the little ones you never planned for. ✨",
      "You have a genuinely good heart, and I hope life keeps giving you people and moments that deserve that side of you. 🌷",
      "Here's to more good conversations, silly memories, unexpected laughs, and many more stories worth remembering. 😂❤️"
    ],
    letter: [
      "As it's a special day, I didn't want to write this in some overly formal way. 😌",
      "So, first of all…",
      "Happiest Birthday to one of the genuinely good people in my life! ❤️🎂",
      "I have this little habit of writing something for the people who matter to me on their birthdays, and sending it in a slightly extra way. Of course, you had to be one of those people.",
      "I hope this year brings you plenty of good days, a few well-earned surprises, and people around you who see just how amazing you are.",
      "You have this quiet way of making things a little better just by being around — even on the most ordinary days. Not everyone can do that.",
      "So today, take a moment to actually feel appreciated, because you really are.",
      "And please…",
      "Laugh a little more. Smile a little more. Not every moment of life needs to be taken so seriously.",
      "Be happy, live freely, make beautiful memories, and enjoy your day as much as you possibly can. ❤️",
      "Happy Birthday, once again. 🎂❤️"
    ],
    photos: [
      "assets/photo1.jpg",
      "assets/photo2.jpg",
      "assets/photo3.jpg",
      "assets/photo4.jpg",
      "assets/photo5.jpg"
    ]
  };

  let state = { ...defaultData };
  let currentStep = 1;

  // Load from localStorage if present
  try {
    const saved = localStorage.getItem('vanvi_birthday_data');
    if (saved) {
      state = { ...state, ...JSON.parse(saved) };
    }
  } catch (e) {}

  // Elements
  const fieldRecipient = document.getElementById('fieldRecipient');
  const fieldSender = document.getElementById('fieldSender');
  const fieldNote1 = document.getElementById('fieldNote1');
  const fieldNote2 = document.getElementById('fieldNote2');
  const fieldNote3 = document.getElementById('fieldNote3');
  const fieldNote4 = document.getElementById('fieldNote4');
  const fieldLetter = document.getElementById('fieldLetter');
  const fileUploader = document.getElementById('fileUploader');
  const dropzoneBox = document.getElementById('dropzoneBox');
  const thumbsList = document.getElementById('thumbsList');

  const progressFill = document.getElementById('progressFill');
  const stepCounterLabel = document.getElementById('stepCounterLabel');
  const stepperItems = document.querySelectorAll('.stepper-item');

  const previewOverlay = document.getElementById('previewOverlay');
  const previewIframe = document.getElementById('previewIframe');
  const previewBarTitle = document.getElementById('previewBarTitle');
  const btnClosePreview = document.getElementById('btnClosePreview');

  const finalShareUrl = document.getElementById('finalShareUrl');
  const btnCopyShareLink = document.getElementById('btnCopyShareLink');
  const btnShareWa = document.getElementById('btnShareWa');
  const linkBoxTitle = document.getElementById('linkBoxTitle');

  // Populate form with state
  function populateForm() {
    if (fieldRecipient) fieldRecipient.value = state.recipientName;
    if (fieldSender) fieldSender.value = state.senderName;
    if (fieldNote1) fieldNote1.value = state.notes[0] || '';
    if (fieldNote2) fieldNote2.value = state.notes[1] || '';
    if (fieldNote3) fieldNote3.value = state.notes[2] || '';
    if (fieldNote4) fieldNote4.value = state.notes[3] || '';
    if (fieldLetter) fieldLetter.value = state.letter.join('\n');
    renderThumbs();
  }

  // Save inputs to state
  function saveForm() {
    state.recipientName = fieldRecipient.value.trim() || defaultData.recipientName;
    state.senderName = fieldSender.value.trim() || defaultData.senderName;
    state.notes[0] = fieldNote1.value.trim() || defaultData.notes[0];
    state.notes[1] = fieldNote2.value.trim() || defaultData.notes[1];
    state.notes[2] = fieldNote3.value.trim() || defaultData.notes[2];
    state.notes[3] = fieldNote4.value.trim() || defaultData.notes[3];

    const lines = fieldLetter.value.split('\n').map(s => s.trim()).filter(Boolean);
    state.letter = lines.length ? lines : [...defaultData.letter];

    try {
      localStorage.setItem('vanvi_birthday_data', JSON.stringify(state));
    } catch (e) {}
  }

  // Render photo thumbnails
  function renderThumbs() {
    if (!thumbsList) return;
    thumbsList.innerHTML = '';
    state.photos.forEach((src, idx) => {
      const li = document.createElement('li');
      li.className = 'thumb';
      li.innerHTML = `
        <div class="thumb-frame">
          <img src="${src}" alt="Photo ${idx + 1}">
          <span class="thumb-num">${idx + 1}</span>
          <button type="button" class="thumb-remove" data-index="${idx}" title="Remove photo">&times;</button>
        </div>
      `;
      thumbsList.appendChild(li);
    });

    thumbsList.querySelectorAll('.thumb-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const removeIdx = parseInt(btn.getAttribute('data-index'), 10);
        state.photos.splice(removeIdx, 1);
        saveForm();
        renderThumbs();
      });
    });
  }

  // File Upload Handling
  if (dropzoneBox && fileUploader) {
    dropzoneBox.addEventListener('click', () => fileUploader.click());
    dropzoneBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileUploader.click();
      }
    });

    fileUploader.addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      let loaded = 0;
      files.slice(0, 5).forEach(f => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (state.photos.length >= 5) state.photos.shift();
          state.photos.push(event.target.result);
          loaded++;
          if (loaded === files.slice(0, 5).length) {
            saveForm();
            renderThumbs();
          }
        };
        reader.readAsDataURL(f);
      });
    });
  }

  // Stepper & Multi-step navigation
  function goToStep(stepNum) {
    saveForm();
    currentStep = stepNum;

    // Show/hide steps
    document.querySelectorAll('.wizard-step').forEach(stepEl => {
      stepEl.style.display = 'none';
      stepEl.classList.remove('active');
    });
    const targetStep = document.getElementById('step-' + stepNum);
    if (targetStep) {
      targetStep.style.display = 'block';
      targetStep.classList.add('active');
    }

    // Update progress bar & label
    const percent = ((stepNum / 6) * 100).toFixed(1);
    if (progressFill) progressFill.style.width = percent + '%';
    if (stepCounterLabel) stepCounterLabel.textContent = `Step ${stepNum} of 6`;

    // Update sidebar stepper
    stepperItems.forEach(item => {
      const num = parseInt(item.getAttribute('data-step'), 10);
      item.classList.remove('is-current', 'is-done');
      const dot = item.querySelector('.stepper-dot');

      if (num < stepNum) {
        item.classList.add('is-done');
        if (dot) dot.textContent = '✓';
      } else if (num === stepNum) {
        item.classList.add('is-current');
        if (dot) dot.textContent = num;
      } else {
        if (dot) dot.textContent = num;
      }
    });

    // If final share step, update share box
    if (stepNum === 6) {
      generateShareDetails();
    }

    // Scroll smoothly to top of wizard card
    const wizardCard = document.querySelector('.wizard-card');
    if (wizardCard) {
      wizardCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Next and Previous button listeners
  document.querySelectorAll('.btn-next-step').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = parseInt(btn.getAttribute('data-next'), 10);
      goToStep(next);
    });
  });

  document.querySelectorAll('.btn-prev-step').forEach(btn => {
    btn.addEventListener('click', () => {
      const prev = parseInt(btn.getAttribute('data-prev'), 10);
      goToStep(prev);
    });
  });

  // Stepper item clicks
  stepperItems.forEach(item => {
    item.addEventListener('click', () => {
      const stepNum = parseInt(item.getAttribute('data-step'), 10);
      goToStep(stepNum);
    });
  });

  // Generate share link & WhatsApp text
  function generateShareDetails() {
    saveForm();
    if (linkBoxTitle) linkBoxTitle.textContent = `For ${state.recipientName} 🎂`;

    const baseUrl = window.location.origin + window.location.pathname.replace('builder.html', 'index.html');
    const params = new URLSearchParams();
    params.set('recipient', state.recipientName);
    params.set('sender', state.senderName);
    state.notes.forEach((n, i) => params.set('note' + (i + 1), n));
    params.set('letter', state.letter.join('\n'));

    const fullUrl = baseUrl + '?' + params.toString();
    if (finalShareUrl) finalShareUrl.value = fullUrl;

    const waMsg = encodeURIComponent(`🎂 Happy Birthday ${state.recipientName}! Here is a special interactive surprise portal crafted for you on Vanvi Moments:\n\n${fullUrl}`);
    if (btnShareWa) btnShareWa.href = `https://api.whatsapp.com/send?text=${waMsg}`;
  }

  // Copy Link button
  if (btnCopyShareLink && finalShareUrl) {
    btnCopyShareLink.addEventListener('click', () => {
      finalShareUrl.select();
      finalShareUrl.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(finalShareUrl.value).then(() => {
        btnCopyShareLink.textContent = '✓ Copied!';
        setTimeout(() => {
          btnCopyShareLink.textContent = 'Copy Link';
        }, 2000);
      });
    });
  }

  // Open Preview Modal
  function openLivePreview() {
    saveForm();
    if (previewBarTitle) previewBarTitle.textContent = `Previewing surprise for ${state.recipientName} 💗`;
    if (previewIframe) {
      previewIframe.src = './index.html?t=' + Date.now();
      previewIframe.onload = () => {
        previewIframe.contentWindow.postMessage({
          type: 'VANVI_UPDATE_DATA',
          payload: state
        }, '*');
      };
    }
    if (previewOverlay) previewOverlay.classList.add('open');
  }

  function closeLivePreview() {
    if (previewOverlay) previewOverlay.classList.remove('open');
  }

  // Preview button listeners
  const btnTopPreview = document.getElementById('btnTopPreview');
  const btnQuickPreview = document.getElementById('btnQuickPreview');
  const btnSidePreview = document.getElementById('btnSidePreview');
  const btnModalOpenPreview = document.getElementById('btnModalOpenPreview');
  const btnEditAgain = document.getElementById('btnEditAgain');

  if (btnTopPreview) btnTopPreview.addEventListener('click', openLivePreview);
  if (btnQuickPreview) btnQuickPreview.addEventListener('click', openLivePreview);
  if (btnSidePreview) btnSidePreview.addEventListener('click', openLivePreview);
  if (btnClosePreview) btnClosePreview.addEventListener('click', closeLivePreview);
  if (btnModalOpenPreview) btnModalOpenPreview.addEventListener('click', () => {
    generateShareDetails();
    window.open(finalShareUrl.value, '_blank');
  });
  if (btnEditAgain) btnEditAgain.addEventListener('click', () => goToStep(1));

  if (previewOverlay) {
    previewOverlay.addEventListener('click', (e) => {
      if (e.target === previewOverlay) closeLivePreview();
    });
  }

  // Initialize
  populateForm();

})();
