"use strict";

const confetti = (typeof window !== "undefined" && window.confetti) ? window.confetti : function() {};
import { weddingConfig } from "./templateConfig.js";

/**
 * Vanvi Moments — Royal Palace Wedding Experience Engine (Template 02)
 * High-Performance Animation & Interaction Core for Anushka & Virat (#VirushkaWeds)
 */

const isTouch = window.matchMedia("(pointer:coarse)").matches;

// Configuration with fallback (supports custom localStorage & live studio updates)
let initialCustom = null;
try {
  const localSaved = localStorage.getItem("vanvi_custom_wedding_config");
  if (localSaved) initialCustom = JSON.parse(localSaved);
} catch (e) {}

const C = (typeof window.__WEDDING_CONFIG__ !== "undefined" && window.__WEDDING_CONFIG__) 
  ? window.__WEDDING_CONFIG__ 
  : (initialCustom || weddingConfig);

/**
 * Real-time reactive updates from the Builder studio
 */
function applyLiveConfig(newCfg) {
  if (!newCfg) return;
  Object.assign(C, newCfg);

  if (newCfg.couple) {
    const bride = newCfg.couple.bride || "Anushka";
    const groom = newCfg.couple.groom || "Virat";
    const mono = newCfg.couple.monogram || `${bride.charAt(0)}&${groom.charAt(0)}`;
    const hashtag = newCfg.couple.hashtag || `#${groom}${bride}Weds`;
    const venue = newCfg.couple.venue || "Taj Lake Palace, Udaipur";

    const cBrideEl = document.getElementById("cBride");
    const cGroomEl = document.getElementById("cGroom");
    if (cBrideEl) cBrideEl.textContent = bride;
    if (cGroomEl) cGroomEl.textContent = groom;

    const pl1 = document.querySelector(".pl-n1");
    const pl2 = document.querySelector(".pl-n2");
    if (pl1) pl1.textContent = bride;
    if (pl2) pl2.textContent = groom;

    const navMono = document.querySelector(".nav-monogram");
    if (navMono) navMono.textContent = mono;

    const iBride = document.querySelector(".i-bride");
    const iGroom = document.querySelector(".i-groom");
    if (iBride) iBride.textContent = bride;
    if (iGroom) iGroom.textContent = groom;

    const letterMono = document.querySelector(".letter-monogram");
    const letterNames = document.querySelector(".letter-names");
    if (letterMono) letterMono.textContent = mono;
    if (letterNames) letterNames.textContent = `${groom} & ${bride} ❤️`;

    const stBride = document.getElementById("stRvBride");
    const stGroom = document.getElementById("stRvGroom");
    if (stBride) stBride.textContent = bride;
    if (stGroom) stGroom.textContent = groom;

    const ttHash = document.getElementById("ttkHashtag");
    const linkHash = document.getElementById("hashtagLink");
    if (ttHash) ttHash.textContent = hashtag;
    if (linkHash) linkHash.textContent = hashtag;

    const ttVen = document.getElementById("ttkVenue");
    if (ttVen) ttVen.innerHTML = venue.replace(",", "<br>");

    const waxSym = document.querySelector(".wax-symbol");
    if (waxSym) waxSym.textContent = mono;

    const ftNames = document.querySelector(".ft-names");
    if (ftNames) ftNames.textContent = `${bride} & ${groom}`;
  }

  if (newCfg.letter) {
    const lTitle = document.querySelector(".letter-title");
    const lBody = document.querySelector(".letter-body");
    const lClose = document.querySelector(".letter-closing");
    if (lTitle && newCfg.letter.salutation) lTitle.textContent = newCfg.letter.salutation;
    if (lBody && newCfg.letter.body) lBody.textContent = newCfg.letter.body;
    if (lClose && newCfg.letter.closing) lClose.textContent = newCfg.letter.closing;
  }

  if (newCfg.story && newCfg.story.verse) {
    const stVerse = document.getElementById("stRvVerse");
    if (stVerse) stVerse.textContent = newCfg.story.verse;
  }

  if (newCfg.invite) {
    const bParents = document.getElementById("iBrideParents");
    const gParents = document.getElementById("iGroomParents");
    const bGp = document.getElementById("iFamGpBride");
    const gGp = document.getElementById("iFamGpGroom");
    if (bParents && newCfg.invite.brideFather) bParents.textContent = newCfg.invite.brideFather;
    if (gParents && newCfg.invite.groomFather) gParents.textContent = newCfg.invite.groomFather;
    if (bGp && newCfg.invite.brideGF) bGp.innerHTML = `<em>Blessed by</em><br>${newCfg.invite.brideGF}`;
    if (gGp && newCfg.invite.groomGF) gGp.innerHTML = `<em>Blessed by</em><br>${newCfg.invite.groomGF}`;
  }

  if (newCfg.themes && newCfg.themes.current) {
    document.body.setAttribute("data-theme", newCfg.themes.current);
    document.querySelectorAll(".theme-pill").forEach(p => {
      p.classList.toggle("active", p.dataset.theme === newCfg.themes.current);
    });
  }
}

window.addEventListener("message", (e) => {
  if (e.data && e.data.type === "UPDATE_CONFIG") {
    applyLiveConfig(e.data.config);
  }
});

// ==========================================================================
// 1. INTERACTIVE GOLD RING FOLLOWER CURSOR
// ==========================================================================
(function initCursor() {
  if (isTouch) return;
  const ring = document.getElementById("cRing");
  const dot = document.getElementById("cDot");
  if (!ring || !dot) return;

  let rX = 0, rY = 0, mouseX = -200, mouseY = -200;
  let active = false;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
    if (!active) {
      active = true;
      document.body.classList.add("cursor-active");
    }
  });

  function renderRing() {
    rX += (mouseX - rX) * 0.082;
    rY += (mouseY - rY) * 0.082;
    ring.style.left = rX + "px";
    ring.style.top = rY + "px";
    ring.style.boxShadow = document.body.classList.contains("ch")
      ? "0 0 44px 16px rgba(200, 134, 10, 0.55)"
      : "0 0 20px 4px rgba(160, 24, 48, 0.25)";
    requestAnimationFrame(renderRing);
  }
  renderRing();

  function attachCursorHover() {
    document.querySelectorAll("a, button, .ev-node, .tt, .gal-item, .shagun-wax-seal, .preset-chip").forEach((el) => {
      el.addEventListener("mouseenter", () => document.body.classList.add("ch"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("ch"));
    });
  }
  attachCursorHover();
  window._attachCursorHover = attachCursorHover;
})();

// ==========================================================================
// 2. PRELOADER & HERO REVEAL
// ==========================================================================
function revealHero() {
  document.body.classList.remove("pl-active");
  const palace = document.querySelector(".hl-palace");
  const heroCopy = document.getElementById("heroCopy");
  if (palace) palace.classList.add("in");
  if (heroCopy) heroCopy.classList.add("in");
}

function runPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) {
    revealHero();
    return;
  }
  setTimeout(() => preloader.classList.add("li"), 300);
  setTimeout(() => preloader.classList.add("ni"), 700);
  setTimeout(() => {
    preloader.classList.add("away");
    setTimeout(() => {
      preloader.style.display = "none";
      revealHero();
    }, 500);
  }, 1600);
}

document.body.classList.add("pl-active");
if (document.readyState === "complete") {
  runPreloader();
} else {
  window.addEventListener("load", runPreloader);
}
setTimeout(() => {
  if (document.body.classList.contains("pl-active")) {
    revealHero();
    const preloader = document.getElementById("preloader");
    if (preloader) preloader.style.display = "none";
  }
}, 4000);

// ==========================================================================
// 3. 3D PALACE PARALLAX SCROLL ENGINE
// ==========================================================================
const heroWrap = document.getElementById("heroWrap");
const heroPin = document.getElementById("heroPin");
const palaceEl = document.getElementById("l3");
const heroCopy = document.getElementById("heroCopy");
const heroMoon = document.getElementById("heroMoon");
const scrollNudge = document.getElementById("scrollNudge");

let rawProgress = 0, lerpedProgress = 0, curMouseX = 0, curMouseY = 0, rafHero = null;

function getHeroProgress() {
  if (!heroWrap) return 0;
  const top = heroWrap.getBoundingClientRect().top + window.scrollY;
  const height = heroWrap.offsetHeight - window.innerHeight;
  return Math.min(1, Math.max(0, (window.scrollY - top) / height));
}

function driveHero() {
  lerpedProgress += (rawProgress - lerpedProgress) * 0.06;
  const p = lerpedProgress;
  const mx = isTouch ? 0 : curMouseX;
  const my = isTouch ? 0 : curMouseY;

  if (heroMoon) {
    heroMoon.style.transform = `translateY(${p * -28 + my * -5}px) translateX(${mx * -3}px)`;
  }
  if (palaceEl) {
    const scale = 1 + p * 0.45;
    const rotY = mx * -14;
    const rotX = my * -9;
    palaceEl.style.transform = `perspective(1400px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateX(calc(-50% + ${(rotY * 0.5).toFixed(1)}px)) scale(${scale})`;
    palaceEl.style.filter = `drop-shadow(0 ${(20 + p * 30).toFixed(0)}px ${(50 + p * 40).toFixed(0)}px rgba(0,0,0,${(0.28 + p * 0.22).toFixed(2)})) drop-shadow(0 4px 16px rgba(200,134,10,${(0.1 + p * 0.08).toFixed(2)}))`;
  }
  if (heroCopy) {
    const fadeOutStart = 0.55;
    const fadeOutEnd = 0.88;
    const opacityP = Math.max(0, Math.min(1, (p - fadeOutStart) / (fadeOutEnd - fadeOutStart)));
    heroCopy.style.opacity = (1 - opacityP).toFixed(3);
    heroCopy.style.transform = `translateY(${p * -32}px)`;
    heroCopy.style.filter = opacityP > 0 ? `blur(${(opacityP * 16).toFixed(1)}px)` : "";
    heroCopy.style.letterSpacing = opacityP > 0 ? (opacityP * 0.1).toFixed(3) + "em" : "";
  }
  if (scrollNudge) {
    scrollNudge.style.opacity = String(Math.max(0, 1 - p / 0.18));
  }

  if (heroWrap && window.scrollY < heroWrap.offsetHeight) {
    rafHero = requestAnimationFrame(driveHero);
  } else {
    rafHero = null;
  }
}

window.addEventListener("scroll", () => {
  rawProgress = getHeroProgress();
  if (!rafHero && heroWrap && window.scrollY < heroWrap.offsetHeight) {
    rafHero = requestAnimationFrame(driveHero);
  }
}, { passive: true });

if (!isTouch && heroPin) {
  heroPin.addEventListener("mousemove", (e) => {
    curMouseX = e.clientX / window.innerWidth - 0.5;
    curMouseY = e.clientY / window.innerHeight - 0.5;
    if (!rafHero) rafHero = requestAnimationFrame(driveHero);
  });
  heroPin.addEventListener("mouseleave", () => {
    curMouseX = 0;
    curMouseY = 0;
    if (!rafHero) rafHero = requestAnimationFrame(driveHero);
  });
}

// ==========================================================================
// 4. REAL-TIME WEDDING COUNTDOWN TIMER
// ==========================================================================
(function initCountdown() {
  const cdEl = document.getElementById("heroCountdown");
  if (!cdEl) return;

  function getTargetDate() {
    try {
      if (C.couple && C.couple.date) {
        const d = new Date(C.couple.date + "T00:00:00");
        if (!isNaN(d)) return d;
      }
    } catch (e) {}
    return new Date("2026-12-12T00:00:00");
  }

  const target = getTargetDate();

  function update() {
    const diff = target - Date.now();
    if (diff <= 0) {
      cdEl.innerHTML = `<span class="hc-cd-unit"><span class="hc-cd-num" style="color:var(--gold)">We're Married ♥</span></span>`;
      return;
    }
    const days = Math.floor(diff / 864e5);
    const hrs = String(Math.floor((diff % 864e5) / 36e5)).padStart(2, "0");
    const min = String(Math.floor((diff % 36e5) / 6e4)).padStart(2, "0");
    const sec = String(Math.floor((diff % 6e4) / 1e3)).padStart(2, "0");

    cdEl.innerHTML = `
      <span class="hc-cd-unit"><span class="hc-cd-num">${days}</span><span class="hc-cd-label">Days</span></span>
      <span class="hc-cd-sep">·</span>
      <span class="hc-cd-unit"><span class="hc-cd-num">${hrs}</span><span class="hc-cd-label">Hrs</span></span>
      <span class="hc-cd-sep">·</span>
      <span class="hc-cd-unit"><span class="hc-cd-num">${min}</span><span class="hc-cd-label">Min</span></span>
      <span class="hc-cd-sep">·</span>
      <span class="hc-cd-unit"><span class="hc-cd-num">${sec}</span><span class="hc-cd-label">Sec</span></span>
    `;
  }
  update();
  setInterval(update, 1000);
})();

// ==========================================================================
// 5. PETAL PARTICLES SYSTEM
// ==========================================================================
class Petals {
  constructor(id, opts = {}) {
    this.el = document.getElementById(id);
    this.max = opts.max || 6;
    this.rate = opts.rate || 1400;
    this.src = "https://assets.shaadipath.com/templates/template02/assets/elements/Element%202.webp";
    this.active = false;
    this.pool = new Set();
    this._iv = null;
  }

  spawn() {
    if (!this.el) return;
    if (this.pool.size >= this.max) {
      const first = this.pool.values().next().value;
      first?.remove();
      this.pool.delete(first);
    }
    const sz = 45 + Math.random() * 50;
    const left = 5 + Math.random() * 90;
    const dur = 10 + Math.random() * 8;
    const drift = (Math.random() - 0.5) * 80;
    const rot = (Math.random() - 0.5) * 40;

    const wrap = document.createElement("div");
    wrap.style.cssText = `position:absolute;width:${sz}px;height:${sz}px;left:${left}%;bottom:-${sz}px;pointer-events:none`;
    const img = document.createElement("img");
    img.src = this.src;
    img.loading = "lazy";
    img.style.cssText = `width:100%;height:100%;object-fit:contain;mix-blend-mode:screen;filter:drop-shadow(0 0 12px rgba(200,134,10,0.70)) drop-shadow(0 0 30px rgba(200,134,10,0.35))`;
    wrap.appendChild(img);

    const anim = wrap.animate([
      { transform: "translateY(0) translateX(0) rotate(0deg)", opacity: 0 },
      { transform: `translateY(-8vh) translateX(${drift * 0.15}px) rotate(${rot * 0.3}deg)`, opacity: 0.8, offset: 0.06 },
      { transform: `translateY(-55vh) translateX(${drift * 0.7}px) rotate(${rot * 0.8}deg)`, opacity: 0.65, offset: 0.55 },
      { transform: `translateY(-95vh) translateX(${drift}px) rotate(${rot}deg)`, opacity: 0.3, offset: 0.9 },
      { transform: `translateY(-115vh) translateX(${drift}px) rotate(${rot}deg)`, opacity: 0 }
    ], { duration: dur * 1000, easing: "ease-in", fill: "forwards" });

    anim.onfinish = () => {
      wrap.remove();
      this.pool.delete(wrap);
    };

    this.el.appendChild(wrap);
    this.pool.add(wrap);
  }

  start() {
    if (this.active || !this.el) return;
    this.active = true;
    const r = isTouch ? this.rate * 2 : this.rate;
    this._iv = setInterval(() => { if (this.active) this.spawn(); }, r);
    this.spawn();
  }

  stop() {
    this.active = false;
    clearInterval(this._iv);
  }
}

const PetalManagers = {
  hero: new Petals("petalHero", { max: isTouch ? 4 : 8, rate: 1200 }),
  invite: new Petals("petalInvite", { max: isTouch ? 3 : 5, rate: 2200 }),
  events: new Petals("petalEvents", { max: isTouch ? 5 : 10, rate: 1200 }),
  story: new Petals("petalStory", { max: isTouch ? 2 : 4, rate: 3000 }),
  gallery: new Petals("petalGallery", { max: isTouch ? 2 : 4, rate: 3000 }),
  things: new Petals("petalThings", { max: isTouch ? 2 : 4, rate: 3200 }),
  rsvp: new Petals("petalRsvp", { max: isTouch ? 2 : 4, rate: 2500 })
};

const petalIO = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    const key = target.id === "heroWrap" ? "hero" : target.id;
    const pm = PetalManagers[key];
    if (pm) isIntersecting ? pm.start() : pm.stop();
  });
}, { threshold: 0.08 });

["heroWrap", "invite", "events", "story", "gallery", "things", "rsvp"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) petalIO.observe(el);
});

// ==========================================================================
// 6. ELEPHANT CONFETTI BRIDGE (CANVAS RAIN & INTERACTIVE BLAST)
// ==========================================================================
(function initElephantConfetti() {
  const canvas = document.getElementById("confettiRain");
  const bridge = document.getElementById("elephBridge");
  if (!canvas || !bridge) return;
  const ctx = canvas.getContext("2d");
  const extraH = 200;

  function resize() {
    canvas.width = bridge.offsetWidth;
    canvas.height = bridge.offsetHeight + extraH;
    canvas.style.height = (bridge.offsetHeight + extraH) + "px";
  }

  const origins = {
    left: { x: bridge.offsetWidth * 0.28, y: bridge.offsetHeight * 0.15 },
    right: { x: bridge.offsetWidth * 0.72, y: bridge.offsetHeight * 0.15 }
  };

  function updateOrigins() {
    resize();
    const bRect = bridge.getBoundingClientRect();
    const lImg = document.querySelector("#elephL img, #elephL .eleph-svg");
    const rImg = document.querySelector("#elephR img, #elephR .eleph-svg");
    if (lImg) {
      const lr = lImg.getBoundingClientRect();
      origins.left = { x: lr.left - bRect.left + lr.width * 0.85, y: lr.top - bRect.top + lr.height * 0.1 };
    }
    if (rImg) {
      const rr = rImg.getBoundingClientRect();
      origins.right = { x: rr.left - bRect.left + rr.width * 0.15, y: rr.top - bRect.top + rr.height * 0.1 };
    }
  }

  const colors = ["#A01830", "#F0E0B0", "#C8860A", "#6B8E7A", "#1A2C5B", "#E8C060", "#FAF4E4", "#C8380A"];
  const shapes = ["rect", "circle", "petal"];

  class Particle {
    constructor(side) {
      this.side = side;
      this.init();
      this.y = Math.random() * (bridge.offsetHeight + extraH);
    }
    init() {
      const o = this.side === "left" ? origins.left : origins.right;
      const dir = this.side === "left" ? 1 : -1;
      this.ox = o.x;
      this.oy = o.y;
      this.x = this.ox + (Math.random() - 0.5) * 20;
      this.y = this.oy + Math.random() * 10;
      this.vx = dir * (0.5 + Math.random() * 1.5) + (Math.random() - 0.5) * 0.6;
      this.vy = 0.6 + Math.random() * 1.8;
      this.vr = (Math.random() - 0.5) * 5;
      this.rot = Math.random() * 360;
      this.sz = 5 + Math.random() * 9;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.shape = shapes[Math.floor(Math.random() * shapes.length)];
      this.alpha = 0.7 + Math.random() * 0.3;
      this.decay = 0.001 + Math.random() * 0.001;
    }
    update(maxH) {
      this.x += this.vx;
      this.vy += 0.035;
      this.y += this.vy;
      this.rot += this.vr;
      this.alpha -= this.decay;
      if (this.y > maxH + 10 || this.alpha <= 0) {
        this.init();
      }
    }
    draw(c) {
      c.save();
      c.globalAlpha = Math.max(0, this.alpha);
      c.fillStyle = this.color;
      c.translate(this.x, this.y);
      c.rotate(this.rot * Math.PI / 180);
      const h = this.sz;
      if (this.shape === "rect") {
        c.fillRect(-h / 2, -h / 4, h, h / 2);
      } else if (this.shape === "circle") {
        c.beginPath();
        c.arc(0, 0, h / 2, 0, Math.PI * 2);
        c.fill();
      } else {
        c.beginPath();
        c.moveTo(0, -h / 2);
        c.quadraticCurveTo(h / 2, 0, 0, h / 2);
        c.quadraticCurveTo(-h / 2, 0, 0, -h / 2);
        c.fill();
      }
      c.restore();
    }
  }

  const count = isTouch ? 50 : 90;
  let particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(i < count / 2 ? "left" : "right"));
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update(canvas.height);
      p.draw(ctx);
    });
    requestAnimationFrame(loop);
  }

  const brIO = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      brIO.disconnect();
      updateOrigins();
      loop();
    }
  }, { threshold: 0.1 });
  brIO.observe(bridge);

  window.addEventListener("resize", updateOrigins);

  // Interactive Tap to Blast from Elephants
  function blastFrom(el, side) {
    const rect = el.getBoundingClientRect();
    const count = 35;
    for (let i = 0; i < count; i++) {
      const p = new Particle(side);
      p.x = side === "left" ? rect.right - 20 : rect.left + 20;
      p.y = rect.top + rect.height * 0.15;
      p.vx = (side === "left" ? 1 : -1) * (2 + Math.random() * 4) + (Math.random() - 0.5) * 2;
      p.vy = -2 - Math.random() * 3;
      particles.push(p);
      setTimeout(() => {
        const idx = particles.indexOf(p);
        if (idx !== -1) particles.splice(idx, 1);
      }, 4000);
    }
    showToast("✨ The Royal Elephants shower their blessings!");
  }

  const eleL = document.getElementById("elephL");
  const eleR = document.getElementById("elephR");
  if (eleL) eleL.addEventListener("click", () => blastFrom(eleL, "left"));
  if (eleR) eleR.addEventListener("click", () => blastFrom(eleR, "right"));
})();

// ==========================================================================
// 7. EVENTS ROADMAP DYNAMIC SVG TRACK DRAWING
// ==========================================================================
(function initEventsRoadmap() {
  const evSection = document.getElementById("events");
  const evStage = document.getElementById("evStage");
  const svg = document.getElementById("evJourneySvg");
  const track = document.getElementById("ejTrack");
  const drawn = document.getElementById("ejDrawn");
  if (!evSection || !evStage || !svg || !track || !drawn) return;

  function buildEventsDOM() {
    const events = C.events || [];
    evStage.innerHTML = events.map((ev, idx) => {
      const heroClass = ev.hero || ev.id === "shaadi" ? "ev-node--hero" : "";
      const delay = (idx * 0.1).toFixed(2);
      return `
        <article class="ev-node ${heroClass} scroll-in" style="--sd:${delay}s" data-idx="${idx}">
          <div class="ev-icon-wrap">
            <img src="${ev.icon}" alt="${ev.name}" class="ev-icon" onerror="this.style.display='none'">
            <div class="ev-glow"></div>
          </div>
          <span class="ev-name">${ev.name}</span>
          <span class="ev-date">${ev.displayDate || (ev.date + " · " + ev.time)}</span>
          <div class="ev-detail">
            <p class="ev-venue">${ev.venue}</p>
            <p class="ev-desc">${ev.desc}</p>
            <a href="${ev.mapsLink || '#'}" target="_blank" rel="noopener noreferrer" class="ev-cta">📍 Open in Google Maps</a>
          </div>
        </article>
      `;
    }).join("");

    setTimeout(() => {
      evStage.querySelectorAll(".scroll-in").forEach(el => el.classList.add("vis"));
      if (window._attachCursorHover) window._attachCursorHover();
      layoutPath();
    }, 150);
  }

  buildEventsDOM();

  function getPoints() {
    const nodes = Array.from(evStage.querySelectorAll(".ev-node"));
    const secRect = evSection.getBoundingClientRect();
    return nodes.map(n => {
      const icon = n.querySelector(".ev-icon-wrap") || n;
      const r = icon.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - secRect.left,
        y: r.top + r.height / 2 - secRect.top
      };
    });
  }

  function generateCurve(pts) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const mx = ((p1.x + p2.x) / 2).toFixed(1);
      const my = ((p1.y + p2.y) / 2).toFixed(1);
      const curve = (i % 2 === 0 ? 1 : -1) * Math.min(50, Math.abs(p2.x - p1.x) * 0.3);
      d += ` Q ${(parseFloat(mx) + curve).toFixed(1)} ${(parseFloat(my) - 20).toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  }

  function layoutPath() {
    const w = evSection.offsetWidth;
    const h = evSection.offsetHeight;
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

    const pts = getPoints();
    if (pts.length < 2) return;
    const d = generateCurve(pts);
    track.setAttribute("d", d);
    drawn.setAttribute("d", d);

    if (drawn.getTotalLength) {
      const len = drawn.getTotalLength();
      drawn.style.strokeDasharray = len;
      drawn.style.strokeDashoffset = len;
      drawn._total = len;
    }
    updateDraw();
  }

  function updateDraw() {
    if (!drawn._total) return;
    const sRect = evSection.getBoundingClientRect();
    const winH = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (winH - sRect.top) / (evSection.offsetHeight + winH)));
    drawn.style.strokeDashoffset = (drawn._total * (1 - progress)).toFixed(1);
  }

  window.addEventListener("scroll", updateDraw, { passive: true });
  window.addEventListener("resize", layoutPath);
})();

// ==========================================================================
// 8. THEATRICAL CURTAIN PULL REVEAL ENGINE
// ==========================================================================
(function initCurtainReveal() {
  const story = document.getElementById("story");
  const bride = document.getElementById("stBride");
  const groom = document.getElementById("stGroom");
  const curtL = document.getElementById("stCurtL");
  const curtR = document.getElementById("stCurtR");
  const reveal = document.getElementById("stReveal");
  const petalsContainer = document.getElementById("stPetals");
  if (!story || !bride || !groom || !curtL || !curtR || !reveal) return;

  let pulled = false, ready = false, revealed = false, lastP = 0;

  function spawnSanctumPetal() {
    if (!petalsContainer) return;
    const sz = 6 + Math.random() * 10;
    const left = 10 + Math.random() * 80;
    const dur = 5000 + Math.random() * 3000;
    const drift = (Math.random() - 0.5) * 80;
    const col = ["rgba(160,24,48,0.3)", "rgba(200,134,10,0.25)", "rgba(107,142,122,0.25)"][Math.floor(Math.random() * 3)];

    const p = document.createElement("div");
    p.style.cssText = `position:absolute;width:${sz}px;height:${sz}px;left:${left}%;top:-${sz}px;pointer-events:none;border-radius:50% 10% 50% 10%;background:${col};mix-blend-mode:multiply`;
    petalsContainer.appendChild(p);

    p.animate([
      { transform: "translateY(0) translateX(0) rotate(0deg)", opacity: 0 },
      { transform: `translateY(4vh) translateX(${drift * 0.1}px) rotate(40deg)`, opacity: 0.9, offset: 0.05 },
      { transform: `translateY(60vh) translateX(${drift * 0.85}px) rotate(230deg)`, opacity: 0.4, offset: 0.85 },
      { transform: `translateY(90vh) translateX(${drift}px) rotate(360deg)`, opacity: 0 }
    ], { duration: dur, easing: "linear", fill: "forwards" }).onfinish = () => p.remove();
  }

  function triggerPull() {
    if (pulled) return;
    pulled = true;
    bride.classList.add("st-pull");
    groom.classList.add("st-pull");
    setTimeout(() => {
      ready = true;
      updateCurtains(getScrollP());
    }, 750);
  }

  function getScrollP() {
    if (!ready) return 0;
    const r = story.getBoundingClientRect();
    const start = window.innerHeight * 0.6;
    const total = window.innerHeight * 0.9;
    return Math.min(1, Math.max(0, (start - r.top) / total));
  }

  function updateCurtains(p) {
    if (Math.abs(p - lastP) < 0.002) return;
    lastP = p;
    const eased = p < 1 ? 1 - Math.pow(1 - p, 3.2) : 1;
    const pct = (eased * 100).toFixed(2);

    curtL.style.transform = `translateX(-${pct}%)`;
    curtR.style.transform = `translateX(${pct}%)`;
    curtL.style.filter = `drop-shadow(${(eased * 30).toFixed(1)}px 0 36px rgba(0,0,0,${(eased * 0.65).toFixed(2)}))`;
    curtR.style.filter = `drop-shadow(-${(eased * 30).toFixed(1)}px 0 36px rgba(0,0,0,${(eased * 0.65).toFixed(2)}))`;

    const charShift = eased * 28;
    bride.style.transform = `translateX(-${charShift.toFixed(1)}px)`;
    groom.style.transform = `translateX(${charShift.toFixed(1)}px)`;

    if (eased >= 0.7 && !revealed) {
      revealed = true;
      reveal.classList.add("revealed");
      let count = 0;
      const iv = setInterval(() => {
        spawnSanctumPetal();
        if (++count >= 24) clearInterval(iv);
      }, 160);
    }
  }

  window.addEventListener("scroll", () => {
    if (ready) updateCurtains(getScrollP());
  }, { passive: true });

  const storyIO = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
      triggerPull();
      storyIO.disconnect();
    }
  }, { threshold: [0.2] });
  storyIO.observe(story);
})();

// ==========================================================================
// 9. 3D PERSPECTIVE TILT ON CARDS (MOUSE & TOUCH)
// ==========================================================================
(function initTilt() {
  function attachTilt(el) {
    if (el._tiltActive) return;
    el._tiltActive = true;

    el.addEventListener("mousemove", function (e) {
      const r = this.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      this.style.transition = "transform 0.08s ease";
      this.style.transform = `perspective(800px) rotateX(${(y * -12).toFixed(2)}deg) rotateY(${(x * 14).toFixed(2)}deg) scale(1.02)`;
    });

    el.addEventListener("mouseleave", function () {
      this.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
      this.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    });
  }

  document.querySelectorAll(".ev-node, .gal-item, .invite-card, .letter-card, .tt").forEach(attachTilt);
})();

// ==========================================================================
// 10. GALLERY POPULATION & FULLSCREEN LIGHTBOX
// ==========================================================================
(function initGallery() {
  const grid = document.getElementById("galGrid");
  const modal = document.getElementById("lightboxModal");
  const img = document.getElementById("lightboxImg");
  const cap = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxClose");
  const backdrop = document.getElementById("lightboxBackdrop");
  if (!grid || !modal || !img || !cap) return;

  const photos = (C.gallery && C.gallery.photos) || [];
  grid.innerHTML = photos.map((p, i) => {
    const src = typeof p === "string" ? p : p.src;
    const caption = (p.caption || "Royal Wedding Moment") + (p.location ? " · " + p.location : "");
    const tall = i === 0 ? "gal-tall" : "";
    return `
      <div class="gal-item ${tall} scroll-in" style="--sd:${(i * 0.08).toFixed(2)}s" data-idx="${i}">
        <img src="${src}" alt="Anushka & Virat" loading="lazy">
      </div>
    `;
  }).join("");

  grid.querySelectorAll(".gal-item").forEach((item, idx) => {
    item.addEventListener("click", () => {
      const p = photos[idx];
      const src = typeof p === "string" ? p : p.src;
      img.src = src;
      cap.textContent = (p.caption || "Anushka & Virat") + (p.location ? " — " + p.location : "");
      modal.classList.add("open");
    });
  });

  function close() { modal.classList.remove("open"); }
  if (closeBtn) closeBtn.addEventListener("click", close);
  if (backdrop) backdrop.addEventListener("click", close);
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
})();

// ==========================================================================
// 11. SHAGUN MODAL & INTERACTIVE WAX SEAL
// ==========================================================================
(function initShagun() {
  const modal = document.getElementById("shagunModal");
  const openBtn = document.getElementById("openShagunBtn");
  const closeBtn = document.getElementById("closeShagunBtn");
  const backdrop = document.getElementById("shagunBackdrop");
  const seal = document.getElementById("waxSealBtn");
  const content = document.getElementById("shagunContent");
  const copyBtn = document.getElementById("copyUpiBtn");
  const upiText = document.getElementById("upiIdText");
  if (!modal || !openBtn) return;

  function open() { modal.classList.add("open"); }
  function close() { modal.classList.remove("open"); }

  openBtn.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", close);
  if (backdrop) backdrop.addEventListener("click", close);

  if (seal && content) {
    seal.addEventListener("click", () => {
      seal.style.transform = "scale(0.8) rotate(45deg)";
      seal.style.opacity = "0";
      setTimeout(() => {
        seal.parentElement.style.display = "none";
        content.style.display = "block";
        showToast("✨ Royal Shagun Envelope Unfolded!");
      }, 300);
    });
  }

  if (copyBtn && upiText) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(upiText.textContent.trim());
      showToast("📋 UPI ID copied to clipboard!");
    });
  }
})();

// ==========================================================================
// 12. WHATSAPP RSVP PETAL EXPLOSION BURST
// ==========================================================================
(function initRsvpBurst() {
  const btn = document.getElementById("rsvpWaBtn");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    burstPetals(btn);
  });
})();

function burstPetals(el) {
  const r = el.getBoundingClientRect();
  const ox = r.left + r.width / 2;
  const oy = r.top + r.height / 2;
  const src = "https://assets.shaadipath.com/templates/template02/assets/elements/Element%202.webp";

  for (let i = 0; i < 20; i++) {
    const wrap = document.createElement("div");
    const sz = 12 + Math.random() * 16;
    const angle = (i / 20) * 360 + (Math.random() - 0.5) * 20;
    const dist = 70 + Math.random() * 90;
    const tx = Math.cos(angle * Math.PI / 180) * dist;
    const ty = Math.sin(angle * Math.PI / 180) * dist;

    wrap.style.cssText = `position:fixed;left:${ox}px;top:${oy}px;width:${sz}px;height:${sz}px;transform:translate(-50%,-50%);pointer-events:none;z-index:9999`;
    const img = document.createElement("img");
    img.src = src;
    img.style.cssText = "width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply";
    wrap.appendChild(img);
    document.body.appendChild(wrap);

    wrap.animate([
      { transform: "translate(-50%,-50%) scale(0.2) rotate(0deg)", opacity: 1 },
      { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.1) rotate(${Math.random() * 360}deg)`, opacity: 0.9, offset: 0.5 },
      { transform: `translate(calc(-50% + ${tx * 1.4}px), calc(-50% + ${ty * 1.4 + 50}px)) scale(0.2) rotate(540deg)`, opacity: 0 }
    ], { duration: 1100 + Math.random() * 400, easing: "ease-out", fill: "forwards" }).onfinish = () => wrap.remove();
  }
}

// ==========================================================================
// 13. SHOWER YOUR BLESSINGS & PRESET CHIPS
// ==========================================================================
(function initBlessings() {
  const form = document.getElementById("gbForm");
  const list = document.getElementById("gbList");
  const msgBox = document.getElementById("gbMsg");
  const presetChips = document.querySelectorAll(".preset-chip");
  if (!form || !list) return;

  const storageKey = "vanvi_virushka_blessings";
  const defaultBlessings = [
    {
      name: "Sunita Maasi 🌸",
      text: "Wishing Virat & Anushka a lifetime of divine love, starlit laughter, and endless romance!",
      time: "Just now"
    },
    {
      name: "Rohan & Pooja ✨",
      text: "The most stunning couple! May God shower endless blessings on your new beginning.",
      time: "1 hr ago"
    },
    {
      name: "The Sharma Family 🪷",
      text: "May your bond grow stronger with each passing sunrise. So proud of you both!",
      time: "3 hrs ago"
    }
  ];

  let stored = [];
  try {
    stored = JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch (e) {}

  const blessings = [...stored, ...defaultBlessings];

  function render() {
    list.innerHTML = blessings.map(b => `
      <div class="gb-card">
        <div class="gb-card-top">
          <span class="gb-card-name">${b.name}</span>
          <span class="gb-card-time">${b.time}</span>
        </div>
        <p class="gb-card-text">“${b.text}”</p>
      </div>
    `).join("");
  }
  render();

  // Preset chips click
  presetChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const txt = chip.getAttribute("data-text");
      if (msgBox) {
        msgBox.value = txt;
        msgBox.focus();
        showToast(`Selected: ${txt}`);
      }
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
        colors: ["#C8860A", "#A01830", "#FAF4E4"]
      });
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("gbName").value.trim();
    const text = document.getElementById("gbMsg").value.trim();
    if (!name || !text) return;

    const newB = { name, text, time: "Just now" };
    blessings.unshift(newB);
    stored.unshift(newB);
    try {
      localStorage.setItem(storageKey, JSON.stringify(stored));
    } catch (e) {}

    render();
    form.reset();
    showToast("🪷 Sacred Blessing Sent to Anushka & Virat!");
    
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.75 },
      colors: ["#A01830", "#C8860A", "#FAF4E4", "#6B8E7A"]
    });
  });
})();

// ==========================================================================
// 14. HASHTAG COPY WITH TOAST
// ==========================================================================
(function initHashtagCopy() {
  const card = document.getElementById("ttHashtagCard");
  const link = document.getElementById("hashtagLink");
  const tag = (C.couple && C.couple.hashtag) || "#VirushkaWeds";

  function copyTag() {
    navigator.clipboard.writeText(tag);
    showToast(`📋 Copied official hashtag: ${tag}`);
  }

  if (card) card.addEventListener("click", copyTag);
  if (link) link.addEventListener("click", copyTag);
})();

// ==========================================================================
// 15. AUDIO ENGINE (CORNER BUTTON TOGGLE & EQUALIZER BARS)
// ==========================================================================
(function initMusicEngine() {
  const audio = document.getElementById("bgMusic");
  const dock = document.getElementById("audioDock");
  const btn = document.getElementById("musicBtn");
  const icon = document.getElementById("musicIcon");
  if (!audio || !dock || !btn) return;

  let isPlaying = false;
  audio.volume = 0.55;

  function setPlaying(playing) {
    isPlaying = playing;
    dock.classList.toggle("playing", playing);
    if (icon) icon.textContent = playing ? "🔔" : "🔕";
  }

  window.toggleMusic = function () {
    if (isPlaying) {
      audio.pause();
      setPlaying(false);
      showToast("🔕 Royal Music Paused");
    } else {
      audio.play().then(() => {
        setPlaying(true);
        showToast("🔔 Playing Royal Shehnai & Sitar");
      }).catch(() => setPlaying(false));
    }
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    window.toggleMusic();
  });
  dock.addEventListener("click", () => window.toggleMusic());

  // Auto-pause when page hidden & resume on return
  let pausedForAway = false;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      if (!audio.paused) {
        pausedForAway = true;
        audio.pause();
      }
    } else if (pausedForAway) {
      pausedForAway = false;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  });

  // Autoplay attempt on first user interaction
  function onFirstInteraction() {
    audio.play().then(() => setPlaying(true)).catch(() => {});
    document.removeEventListener("touchstart", onFirstInteraction);
    document.removeEventListener("click", onFirstInteraction);
    document.removeEventListener("scroll", onFirstInteraction);
  }

  document.addEventListener("touchstart", onFirstInteraction, { once: true, passive: true });
  document.addEventListener("click", onFirstInteraction, { once: true });
  document.addEventListener("scroll", onFirstInteraction, { once: true, passive: true });
})();

// ==========================================================================
// 16. THEME SWITCHER DOCK
// ==========================================================================
(function initThemeSwitcher() {
  const pills = document.querySelectorAll(".theme-pill");
  pills.forEach(p => {
    p.addEventListener("click", () => {
      const t = p.dataset.theme;
      document.body.setAttribute("data-theme", t);
      pills.forEach(x => x.classList.remove("active"));
      p.classList.add("active");
      showToast(`👑 Switched to ${p.title} theme!`);
    });
  });
})();

// ==========================================================================
// 17. GLOBAL TOAST NOTIFICATION UTILITY
// ==========================================================================
function showToast(msg) {
  const hub = document.getElementById("toastHub");
  if (!hub) return;
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  hub.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateY(-10px)";
    t.style.transition = "all 0.3s ease";
    setTimeout(() => t.remove(), 300);
  }, 2800);
}

// SCROLL REVEAL OBSERVER
const scrollIO = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) {
      target.classList.add("vis");
      scrollIO.unobserve(target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".scroll-in").forEach(el => scrollIO.observe(el));

// ═══════════════════════════════════════════════════════════════════
// VANVI MOMENTS — WATERMARK ENTITLEMENT SYSTEM (AUTO-REMOVE ON PURCHASE)
// ═══════════════════════════════════════════════════════════════════
function applyWatermarkEntitlement() {
  const badge = document.getElementById("demoWatermarkBadge");
  if (!badge) return;

  const params = new URLSearchParams(window.location.search);
  const isPurchased = Boolean(
    params.get("purchased") === "true" ||
    params.get("paid") === "true" ||
    params.get("status") === "paid" ||
    localStorage.getItem("vanvi_royal_vivah_purchased") === "true" ||
    (window.vanviActiveMoment && (
      window.vanviActiveMoment.isPurchased === true ||
      window.vanviActiveMoment.status === "published" ||
      window.vanviActiveMoment.status === "paid"
    ))
  );

  if (isPurchased) {
    badge.hidden = true;
    badge.style.display = "none";
    try {
      badge.remove();
    } catch (e) {}
  } else {
    badge.hidden = false;
    badge.style.display = "inline-flex";
  }
}

// Check watermark entitlement on load and whenever moment data updates
applyWatermarkEntitlement();
window.addEventListener("vanvi:momentLoaded", applyWatermarkEntitlement);
window.addEventListener("storage", applyWatermarkEntitlement);
