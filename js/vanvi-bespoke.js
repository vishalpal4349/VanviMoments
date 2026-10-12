/**
 * VANVI MOMENTS — BESPOKE CONCIERGE & LIVE ORDER POPUP CONTROLLER
 * Features:
 * 1. Live Order Social Proof Toast (1.8s trigger with luxury rotations)
 * 2. Bespoke VIP Modal & "Contact Admin" commission dispatch
 * 3. LocalStorage + Server sync (/api/custom-requests/submit)
 * 4. Automatic pre-formatted WhatsApp redirect to +91 7631442934
 */

(function () {
  'use strict';

  const VANVI_WHATSAPP_NUMBER = '917631442934';

  // ─── 1. LIVE ORDER / BOOKING SOCIAL PROOF POPUP ─────────────────────
  const RECENT_ACTIVITIES = [
    {
      icon: '💍',
      tag: 'Bespoke Website',
      title: 'Priya & Rohan (Mumbai)',
      detail: 'Reserved 100% Custom Wedding Site (₹4,999)',
      time: '2 mins ago'
    },
    {
      icon: '✨',
      tag: 'Custom Template',
      title: 'Aarav Verma (Delhi)',
      detail: 'Customized Royal Palace Baithak (₹999)',
      time: '6 mins ago'
    },
    {
      icon: '👑',
      tag: 'Couture Universe',
      title: 'Dr. Siddharth & Tanya (Bengaluru)',
      detail: 'Secured www.siddharthtanya.in (₹19,999)',
      time: '14 mins ago'
    },
    {
      icon: '🎂',
      tag: 'Milestone Bespoke',
      title: 'Meera Kapoor (Jaipur)',
      detail: 'Commissioned 3D Candle Keepsake (₹1,499)',
      time: '21 mins ago'
    },
    {
      icon: '💌',
      tag: 'Bespoke Website',
      title: 'Kabir & Ananya (Hyderabad)',
      detail: 'Booked Slot for Dec 2026 Wedding (₹4,999)',
      time: '32 mins ago'
    }
  ];

  let currentToastIdx = 0;
  let toastElement = null;

  function initLiveOrderToast() {
    if (document.getElementById('vanviLiveOrderToast')) return;

    toastElement = document.createElement('div');
    toastElement.id = 'vanviLiveOrderToast';
    toastElement.className = 'vanvi-live-order-toast';
    toastElement.setAttribute('role', 'status');
    toastElement.setAttribute('aria-live', 'polite');

    document.body.appendChild(toastElement);

    // Initial popup after 1.8 seconds as requested
    setTimeout(() => {
      showNextLiveOrder();
    }, 1800);

    // Gentle rotation every 14 seconds
    setInterval(() => {
      if (toastElement && !toastElement.classList.contains('dismissed')) {
        showNextLiveOrder();
      }
    }, 14000);
  }

  function showNextLiveOrder() {
    if (!toastElement || toastElement.classList.contains('dismissed')) return;

    const item = RECENT_ACTIVITIES[currentToastIdx % RECENT_ACTIVITIES.length];
    currentToastIdx++;

    toastElement.classList.remove('active');

    setTimeout(() => {
      toastElement.innerHTML = `
        <div class="vanvi-live-toast-avatar">${item.icon}</div>
        <div class="vanvi-live-toast-content">
          <div class="vanvi-live-toast-header">
            <span class="vanvi-live-toast-tag">${escapeHtml(item.tag)}</span>
            <span class="vanvi-live-toast-time">${escapeHtml(item.time)}</span>
          </div>
          <div class="vanvi-live-toast-title">${escapeHtml(item.title)}</div>
          <div class="vanvi-live-toast-detail">${escapeHtml(item.detail)}</div>
        </div>
        <button type="button" class="vanvi-live-toast-close" title="Dismiss" onclick="dismissLiveOrderToast(event)">&times;</button>
      `;

      toastElement.classList.add('active');

      // Auto-hide after 6.5 seconds
      setTimeout(() => {
        if (toastElement) toastElement.classList.remove('active');
      }, 6500);
    }, 350);
  }

  window.dismissLiveOrderToast = function (e) {
    if (e) e.stopPropagation();
    if (toastElement) {
      toastElement.classList.remove('active');
      toastElement.classList.add('dismissed');
    }
  };

  // ─── 2. BESPOKE CONCIERGE MODAL & FORM DISPATCH ───────────────────────
  function initBespokeModalDOM() {
    if (document.getElementById('vanviBespokeModalBackdrop')) return;

    const modal = document.createElement('div');
    modal.id = 'vanviBespokeModalBackdrop';
    modal.className = 'vanvi-bespoke-modal-backdrop';
    modal.innerHTML = `
      <div class="vanvi-bespoke-modal-card" onclick="event.stopPropagation()">
        <button type="button" class="vanvi-modal-close-pill" onclick="closeBespokeModal()" title="Close">&times;</button>
        
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:24px;">👑</span>
          <span style="font-size:11px; font-weight:850; text-transform:uppercase; letter-spacing:1.5px; color:#be123c;">VANVI BESPOKE CONCIERGE</span>
        </div>
        
        <h3 style="font-family:'Cormorant Garamond', Georgia, serif; font-size:26px; color:#4c0519; margin:6px 0 2px;">
          Your Vision, <span style="font-style:italic; color:#be123c;">Crafted from Scratch</span>
        </h3>
        <p style="font-size:12px; color:#724c65; line-height:1.5;">
          Direct communication with our Lead Art Director. No generic templates — handcrafted entirely for you.
        </p>

        <div class="modal-curiosity-banner">
          <span style="font-size:18px;">🔒</span>
          <div style="font-size:11.5px; color:#92400e; line-height:1.45;">
            <strong>Exclusive Atelier Slots:</strong> We take only 3 bespoke commissions per month to preserve perfection. Submit below to hold your reservation.
          </div>
        </div>

        <form id="vanviBespokeModalForm" onsubmit="handleBespokeModalSubmit(event)">
          <div class="modal-form-grid">
            <div class="modal-form-field">
              <label for="bmName">Your Full Name *</label>
              <input id="bmName" name="name" required placeholder="e.g. Priya Sharma & Rohan">
            </div>
            
            <div class="modal-form-field">
              <label for="bmContact">WhatsApp / Phone *</label>
              <input id="bmContact" name="contact" required placeholder="+91 98765 43210">
            </div>

            <div class="modal-form-field">
              <label for="bmEmail">Email Address</label>
              <input id="bmEmail" name="email" type="email" placeholder="priya@example.com">
            </div>

            <div class="modal-form-field">
              <label for="bmServiceType">Service Requested *</label>
              <select id="bmServiceType" name="serviceType" required>
                <option value="Bespoke Custom Website (Starting ₹4,999)">👑 Bespoke Custom Website (From Scratch · ₹4,999 - ₹19,999)</option>
                <option value="Bespoke Custom Template (Starting ₹999)">✨ Bespoke Custom Template (₹999 - ₹19,999)</option>
                <option value="Full Couture Universe with Domain (₹19,999)">💎 Couture Universe with Domain (₹19,999)</option>
              </select>
            </div>

            <div class="modal-form-field">
              <label for="bmOccasion">Occasion / Event *</label>
              <input id="bmOccasion" name="occasion" required placeholder="e.g. Wedding, Milestone 25th, Proposal">
            </div>

            <div class="modal-form-field">
              <label for="bmEventDate">Target Date / Launch</label>
              <input id="bmEventDate" name="eventDate" type="date">
            </div>

            <div class="modal-form-field">
              <label for="bmBudget">Approx. Budget</label>
              <select id="bmBudget" name="budget">
                <option value="₹999 – ₹2,499">₹999 – ₹2,499 (Mini Bespoke)</option>
                <option value="₹4,999 – ₹9,999" selected>₹4,999 – ₹9,999 (Signature Website)</option>
                <option value="₹19,999 (Full Couture with Domain)">₹19,999 (Full Couture with Domain .in)</option>
                <option value="Discuss on WhatsApp">Discuss on WhatsApp with Team</option>
              </select>
            </div>

            <div class="modal-form-field">
              <label for="bmAesthetic">Preferred Style</label>
              <input id="bmAesthetic" name="style" placeholder="e.g. Royal Rajputana, Ivory Floral, Velvet Dark">
            </div>

            <div class="modal-form-field full">
              <label for="bmIdea">Describe Your Story & Wishes *</label>
              <textarea id="bmIdea" name="idea" required placeholder="Tell us about the couple/honoree, custom music preference, rituals (3D wax seal, falling petals, RSVP), or special surprises..."></textarea>
            </div>
          </div>

          <button type="submit" id="btnBespokeSubmit" class="btn-modal-submit-dispatch">
            <span>Submit &amp; Open WhatsApp Confirmation</span> <span>💬➔</span>
          </button>
          
          <div style="text-align:center; margin-top:10px;">
            <a href="https://wa.me/917631442934?text=Hi%20Vanvi%20Concierge%2C%20I%20want%20to%20speak%20with%20the%20Admin%20about%20a%20Bespoke%20Commission" target="_blank" rel="noopener noreferrer" style="font-size:11.5px; color:#15803d; font-weight:750; text-decoration:none;">
              💬 Or directly chat with Admin on WhatsApp (+91 76314 42934)
            </a>
          </div>
        </form>
      </div>
    `;

    modal.addEventListener('click', () => {
      closeBespokeModal();
    });

    document.body.appendChild(modal);
  }

  window.openBespokeModal = function (serviceType, defaultBudget) {
    initBespokeModalDOM();
    const backdrop = document.getElementById('vanviBespokeModalBackdrop');
    if (!backdrop) return;

    if (serviceType) {
      const select = document.getElementById('bmServiceType');
      if (select) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].text.includes(serviceType) || select.options[i].value.includes(serviceType)) {
            select.selectedIndex = i;
            break;
          }
        }
      }
    }

    if (defaultBudget) {
      const bSelect = document.getElementById('bmBudget');
      if (bSelect) {
        for (let i = 0; i < bSelect.options.length; i++) {
          if (bSelect.options[i].value.includes(defaultBudget)) {
            bSelect.selectedIndex = i;
            break;
          }
        }
      }
    }

    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeBespokeModal = function () {
    const backdrop = document.getElementById('vanviBespokeModalBackdrop');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  window.handleBespokeModalSubmit = async function (e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = document.getElementById('btnBespokeSubmit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Locking Your Slot...</span>';
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const reqId = 'VANVI-BESPOKE-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = new Date().toISOString();

    const requestPayload = {
      requestId: reqId,
      id: reqId,
      name: data.name,
      contact: data.contact,
      email: data.email || null,
      serviceType: data.serviceType,
      occasion: data.occasion,
      eventDate: data.eventDate || 'TBD',
      budget: data.budget,
      style: data.style || 'Bespoke Atelier Signature',
      idea: data.idea,
      theme: `${data.serviceType} — ${data.occasion}`,
      status: 'Submitted',
      createdAt: timestamp
    };

    // 1. Save to localStorage for instant admin dashboard reflection
    try {
      const existing = JSON.parse(localStorage.getItem('vanvi_custom_requests') || '[]');
      existing.unshift(requestPayload);
      localStorage.setItem('vanvi_custom_requests', JSON.stringify(existing));
    } catch (err) {}

    // 2. Dispatch to backend API for admin email alert & database storage
    try {
      fetch('/api/custom-requests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      }).catch(() => {});
    } catch (err) {}

    // 3. Construct beautiful, pre-formatted WhatsApp message ready to send
    const waText = encodeURIComponent(
`💍 *VANVI MOMENTS — BESPOKE COMMISSION REQUEST* 👑
━━━━━━━━━━━━━━━━━━━━
✦ *Request ID:* #${reqId}
✦ *Client Name:* ${data.name}
✦ *Contact:* ${data.contact}
✦ *Service:* ${data.serviceType}
✦ *Occasion:* ${data.occasion}
✦ *Target Date:* ${data.eventDate || 'Upcoming'}
✦ *Approx Budget:* ${data.budget}
✦ *Aesthetic Style:* ${data.style || 'Custom Atelier'}
━━━━━━━━━━━━━━━━━━━━
📝 *Story & Vision:*
"${data.idea}"
━━━━━━━━━━━━━━━━━━━━
✨ *Sent via Vanvi Moments Bespoke Atelier Concierge*`
    );

    const waUrl = `https://wa.me/${VANVI_WHATSAPP_NUMBER}?text=${waText}`;

    // Close modal & notify
    closeBespokeModal();
    if (window.showToast) {
      window.showToast('✓ Bespoke commission saved! Opening WhatsApp concierge...');
    }

    // Redirect to WhatsApp
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 400);

    form.reset();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Submit &amp; Open WhatsApp Confirmation</span> <span>💬➔</span>';
    }
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Auto-boot when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initLiveOrderToast();
      initBespokeModalDOM();
    });
  } else {
    initLiveOrderToast();
    initBespokeModalDOM();
  }
})();
