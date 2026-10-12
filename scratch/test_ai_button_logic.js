const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- TESTING AI BUTTON CLICK LOGIC (FLOATING VS TOP HOME BAR) ---');

// 1. Read files
const navJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'vanvi-navigation.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// 2. Inspect js/vanvi-navigation.js click interceptor
assert(navJs.includes("const floatingAi = target.closest('#aiFloatBtn, .panda-ai-float, .ai-float, #vanviAssistantFloatPill, .vanvi-assistant-float-pill, .panda-float-pill');"),
  'Floating AI selector must match all floating buttons');
assert(navJs.includes("window.location.href = rootPrefix + 'vanvi-assistant.html';"),
  'Floating AI must navigate DIRECTLY to vanvi-assistant.html without modal');

assert(navJs.includes("const topNavAi = target.closest('[data-open-ai-hub], .nav-ai-btn, .desktop-nav a[href*=\"ai\"], .drawer-link[href*=\"ai\"], .btn-header-link[href*=\"ai\"], #topNavAiBtn, .header-ai-btn');"),
  'Top nav AI selector must match navbar/header AI buttons');
assert(navJs.includes("openVanviAiHub();"),
  'Top nav AI button must trigger openVanviAiHub()');

console.log('✅ [1/3] Static code inspection in js/vanvi-navigation.js passed!');

// 3. Inspect index.html markup
assert(indexHtml.includes('id="aiFloatBtn"'), 'Floating AI button id="aiFloatBtn" exists');
assert(indexHtml.includes('class="float-btn ai-float panda-ai-float"'), 'Floating AI button classes exist');
assert(indexHtml.includes('href="vanvi-assistant.html"'), 'Floating AI button targets vanvi-assistant.html');

assert(indexHtml.includes('data-open-ai-hub="true"'), 'Top desktop nav has data-open-ai-hub="true"');
assert(indexHtml.includes('onclick="openVanviAiHub(); return false;"'), 'Top desktop nav triggers openVanviAiHub()');

console.log('✅ [2/3] Index.html markup inspection passed!');

// 4. Lightweight browser mock simulation
class MockElement {
  constructor(tag, id = '', className = '', attrs = {}) {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.className = className;
    this.attributes = attrs;
    this.classList = {
      _classes: new Set(className.split(' ').filter(Boolean)),
      add: (c) => this.classList._classes.add(c),
      remove: (c) => this.classList._classes.delete(c),
      contains: (c) => this.classList._classes.has(c)
    };
    this.style = {};
    this.children = [];
    this.parentNode = null;
  }

  getAttribute(k) { return this.attributes[k] || null; }
  hasAttribute(k) { return k in this.attributes; }
  setAttribute(k, v) { this.attributes[k] = v; }
  appendChild(c) { c.parentNode = this; this.children.push(c); return c; }
  querySelector(sel) {
    if (sel.startsWith('#')) {
      const id = sel.slice(1);
      if (this.id === id) return this;
      for (const child of this.children) {
        if (child.id === id) return child;
        const found = child.querySelector && child.querySelector(sel);
        if (found) return found;
      }
    }
    return null;
  }
  closest(selector) {
    const selectors = selector.split(',').map(s => s.trim());
    let curr = this;
    while (curr) {
      for (const s of selectors) {
        if (s.startsWith('#') && curr.id === s.slice(1)) return curr;
        if (s.startsWith('.') && curr.classList.contains(s.slice(1))) return curr;
        if (s.startsWith('[') && s.includes('data-open-ai-hub') && curr.attributes['data-open-ai-hub']) return curr;
        if (s.includes('desktop-nav') && curr.attributes['data-open-ai-hub']) return curr;
      }
      curr = curr.parentNode;
    }
    return null;
  }
  addEventListener() {}
}

const listeners = [];
const mockDocument = {
  body: new MockElement('body'),
  addEventListener: (event, handler, capture) => {
    listeners.push({ event, handler, capture });
  },
  getElementById: (id) => {
    return mockDocument.body.querySelector('#' + id);
  },
  querySelector: (sel) => mockDocument.body.querySelector(sel),
  querySelectorAll: () => [],
  createElement: (tag) => new MockElement(tag)
};

const mockWindow = {
  document: mockDocument,
  location: { pathname: '/index.html', href: 'http://localhost:3000/index.html' },
  addEventListener: (event, handler) => {
    listeners.push({ event, handler });
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  }
};

// Create sandbox
const sandbox = {
  window: mockWindow,
  document: mockDocument,
  rootPrefix: '',
  history: { length: 2, back: () => {} },
  setTimeout: setTimeout,
  clearTimeout: clearTimeout
};

const vm = require('vm');
vm.createContext(sandbox);

// Run vanvi-navigation.js in sandbox
vm.runInContext(navJs, sandbox);

// Verify handlers
assert(listeners.length > 0, 'Click listener should be registered');
const clickListener = listeners.find(l => l.event === 'click' && l.capture === true);
assert(clickListener, 'Capturing click listener should be registered');

// Test 4A: Top Nav AI button click
const topNavBtn = new MockElement('a', 'topNavAi', 'desktop-nav-ai', { 'data-open-ai-hub': 'true' });
mockDocument.body.appendChild(topNavBtn);

let defaultPrevented = false;
let stopPropagated = false;
let stopImmediatePropagated = false;

const topNavEvent = {
  target: topNavBtn,
  preventDefault: () => { defaultPrevented = true; },
  stopPropagation: () => { stopPropagated = true; },
  stopImmediatePropagation: () => { stopImmediatePropagated = true; }
};

clickListener.handler(topNavEvent);
const hubModal = mockDocument.getElementById('vanviAiHubModal');
assert(hubModal && hubModal.classList.contains('is-open'), 'Top nav AI click must open #vanviAiHubModal with .is-open class');
assert(defaultPrevented === true, 'Top nav click must prevent default link navigation');
assert(stopImmediatePropagated === true, 'Top nav click must stop immediate propagation');
console.log('✅ [3A] Top navbar AI click successfully opens AI Atelier selection modal (#vanviAiHubModal.is-open)!');

// Close modal
sandbox.window.closeVanviAiHub();
assert(!hubModal.classList.contains('is-open'), 'closeVanviAiHub() must remove .is-open');
defaultPrevented = false;
stopImmediatePropagated = false;
sandbox.window.location.href = '/index.html';

const floatingBtn = new MockElement('a', 'aiFloatBtn', 'float-btn ai-float panda-ai-float');
mockDocument.body.appendChild(floatingBtn);

const floatEvent = {
  target: floatingBtn,
  preventDefault: () => { defaultPrevented = true; },
  stopPropagation: () => { stopPropagated = true; },
  stopImmediatePropagation: () => { stopImmediatePropagated = true; }
};

clickListener.handler(floatEvent);
assert(!hubModal.classList.contains('is-open'), 'Floating AI button MUST NEVER open the hub modal');
assert(sandbox.window.location.href.includes('vanvi-assistant.html'),
  `Floating button must navigate directly to vanvi-assistant.html. Actual: ${sandbox.window.location.href}`);
console.log('✅ [3B] Floating AI button navigates DIRECTLY to vanvi-assistant.html with ZERO modal!');

console.log('\n🎉 ALL AI NAVIGATION LOGIC TESTS PASSED 100%!');
