"use strict";

import { weddingConfig } from "./templateConfig.js";

/**
 * Vanvi Moments — Wedding Builder Studio Controller
 * Real-time reactive editing and device view management
 */

// Clone initial state from weddingConfig or localStorage
let currentConfig = JSON.parse(JSON.stringify(weddingConfig));

const iframe = document.getElementById("previewIframe");
const previewContainer = document.getElementById("previewContainer");

// ==========================================================================
// 1. TABS MANAGEMENT
// ==========================================================================
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    tabButtons.forEach(b => b.classList.remove("active"));
    tabPanels.forEach(p => p.classList.remove("active"));

    btn.classList.add("active");
    const panel = document.getElementById(`tab-${target}`);
    if (panel) panel.classList.add("active");
  });
});

// ==========================================================================
// 2. DEVICE PREVIEW SWITCHER
// ==========================================================================
const devButtons = document.querySelectorAll(".dev-btn");
devButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const view = btn.dataset.view;
    devButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    previewContainer.className = `preview-frame-container ${view}-view`;
  });
});

// ==========================================================================
// 3. FORM CONTROLS & REALTIME CONFIG SYNC
// ==========================================================================
function readFormData() {
  currentConfig.couple.bride = document.getElementById("inpBride").value.trim();
  currentConfig.couple.groom = document.getElementById("inpGroom").value.trim();
  currentConfig.couple.monogram = document.getElementById("inpMonogram").value.trim();
  currentConfig.couple.date = document.getElementById("inpDate").value;
  currentConfig.couple.venue = document.getElementById("inpVenue").value.trim();
  currentConfig.couple.hashtag = document.getElementById("inpHashtag").value.trim();
  currentConfig.couple.whatsapp = document.getElementById("inpWhatsapp").value.trim();

  // Family Lineage
  currentConfig.invite.blessing = document.getElementById("inpBlessing").value.trim();
  currentConfig.invite.brideFather = document.getElementById("inpBrideParents").value.trim();
  currentConfig.invite.brideGF = document.getElementById("inpBrideGp").value.trim();
  currentConfig.invite.groomFather = document.getElementById("inpGroomParents").value.trim();
  currentConfig.invite.groomGF = document.getElementById("inpGroomGp").value.trim();

  // Letter
  currentConfig.letter.salutation = document.getElementById("inpSalutation").value.trim();
  currentConfig.letter.body = document.getElementById("inpLetterBody").value.trim();
  currentConfig.letter.closing = document.getElementById("inpClosing").value.trim();
  currentConfig.letter.signature = document.getElementById("inpSignature").value.trim();

  // Story
  currentConfig.story.verse = document.getElementById("inpStoryVerse").value.trim();
  currentConfig.story.tags = document.getElementById("inpStoryTags").value.split(",").map(s => s.trim()).filter(Boolean);

  // Gallery
  currentConfig.gallery.photos[0] = document.getElementById("inpPhoto0").value.trim();
  currentConfig.gallery.photos[1] = document.getElementById("inpPhoto1").value.trim();
  currentConfig.gallery.photos[2] = document.getElementById("inpPhoto2").value.trim();
  currentConfig.gallery.photos[3] = document.getElementById("inpPhoto3").value.trim();

  // Theme
  const selectedTheme = document.querySelector('input[name="builderTheme"]:checked')?.value || "royal-mewar";
  currentConfig.themes.current = selectedTheme;

  return currentConfig;
}

function syncToPreview() {
  const cfg = readFormData();
  try {
    localStorage.setItem("vanvi_custom_wedding_config", JSON.stringify(cfg));
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: "UPDATE_CONFIG", config: cfg }, "*");
    }
  } catch (e) {
    console.error("Sync error:", e);
  }
}

// Attach auto-sync on input change
document.querySelectorAll(".builder-sidebar input, .builder-sidebar textarea").forEach(el => {
  el.addEventListener("input", syncToPreview);
});

document.querySelectorAll('input[name="builderTheme"]').forEach(el => {
  el.addEventListener("change", syncToPreview);
});

// ==========================================================================
// 4. EVENTS MANAGER
// ==========================================================================
const eventsListContainer = document.getElementById("eventsEditorList");

function renderEventsEditor() {
  eventsListContainer.innerHTML = currentConfig.events.map((ev, i) => `
    <div class="event-item-card" data-idx="${i}">
      <div class="event-item-top">
        <span class="event-item-title">${ev.name}</span>
        <button class="btn-del-event" onclick="window._deleteEvent(${i})">&times;</button>
      </div>
      <div class="form-group">
        <label>Ceremony Name</label>
        <input type="text" value="${ev.name}" oninput="window._updateEvent(${i}, 'name', this.value)">
      </div>
      <div class="form-group">
        <label>Date & Time Label</label>
        <input type="text" value="${ev.displayDate || ''}" oninput="window._updateEvent(${i}, 'displayDate', this.value)">
      </div>
      <div class="form-group">
        <label>Venue Location</label>
        <input type="text" value="${ev.venue || ''}" oninput="window._updateEvent(${i}, 'venue', this.value)">
      </div>
    </div>
  `).join("");
}

window._updateEvent = (idx, field, val) => {
  currentConfig.events[idx][field] = val;
  syncToPreview();
};

window._deleteEvent = (idx) => {
  if (currentConfig.events.length <= 1) {
    showToast("⚠️ Keep at least one event!");
    return;
  }
  currentConfig.events.splice(idx, 1);
  renderEventsEditor();
  syncToPreview();
  showToast("Event removed");
};

const btnAddEvent = document.getElementById("btnAddEvent");
if (btnAddEvent) {
  btnAddEvent.addEventListener("click", () => {
    currentConfig.events.push({
      id: "event-" + Date.now(),
      name: "New Ceremony",
      displayDate: "12 Dec · 5:00 PM",
      time: "17:00",
      venue: "Palace Courtyard",
      desc: "Joyful celebration and warm rituals.",
      icon: "https://assets.shaadipath.com/templates/template02/assets/icons/icon-shaadi.webp",
      mapsLink: "https://maps.google.com"
    });
    renderEventsEditor();
    syncToPreview();
    showToast("✨ New ceremony added!");
  });
}

renderEventsEditor();

// ==========================================================================
// 5. PRESETS & ACTIONS
// ==========================================================================
const btnApply = document.getElementById("btnApplyPreview");
if (btnApply) {
  btnApply.addEventListener("click", () => {
    syncToPreview();
    showToast("⚡ Preview updated successfully!");
  });
}

const btnReset = document.getElementById("btnResetConfig");
if (btnReset) {
  btnReset.addEventListener("click", () => {
    localStorage.removeItem("vanvi_custom_wedding_config");
    location.reload();
  });
}

const loadVirushkaBtn = document.getElementById("loadVirushkaBtn");
if (loadVirushkaBtn) {
  loadVirushkaBtn.addEventListener("click", () => {
    localStorage.removeItem("vanvi_custom_wedding_config");
    showToast("✨ Loaded Anushka & Virat Royal Pichola preset!");
    setTimeout(() => location.reload(), 500);
  });
}

// Template Switcher (Palace vs Mirror Reveal)
const templateSelector = document.getElementById("templateSelector");
if (templateSelector && iframe) {
  // If selector is present, set iframe src to default selected
  iframe.src = templateSelector.value;
  templateSelector.addEventListener("change", (e) => {
    iframe.src = e.target.value;
    showToast(`🔀 Switched template preview`);
    setTimeout(syncToPreview, 500);
  });
}

const saveAndLaunchBtn = document.getElementById("saveAndLaunchBtn");
if (saveAndLaunchBtn) {
  saveAndLaunchBtn.addEventListener("click", () => {
    const cfg = readFormData();
    localStorage.setItem("vanvi_custom_wedding_config", JSON.stringify(cfg));
    showToast("🚀 Opening Customized Wedding Invitation!");
    const targetUrl = (templateSelector && templateSelector.value.includes("mirror-reveal"))
      ? "../mirror-reveal/index.html"
      : "./index.html";
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 600);
  });
}

// Toast utility
function showToast(msg) {
  const hub = document.getElementById("builderToastHub");
  if (!hub) return;
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  hub.appendChild(t);
  setTimeout(() => {
    t.remove();
  }, 2800);
}
