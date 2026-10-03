/**
 * Vanvi Moments — Birthday 3D Candle & Polaroid Magic
 * Template ID: birthday-3d-candle-surprise
 * Fully responsive, interactive 3D birthday celebration experience.
 */

(function () {
  'use strict';

  // Default Experience Configuration
  var templateData = {
    recipient: 'Beautiful',
    sender: 'With all my love ❤️',
    title: 'Happy Birthday!',
    message: 'To the most wonderful person in my life. Thank you for always being my source of encouragement, my strong support, and the joy in my life. I wish you to always be beautiful, happy, and successful in everything. I love you very much! 💕',
    music: 'happybirthday.mp3',
    photos: [
      { src: 'image.jpg', caption: '"The smile that makes every single day brighter ✨"', tag: '#DayOne 🌸' },
      { src: 'image/photo_roses.jpg', caption: '"More graceful than all the roses in the garden 🌹"', tag: '#Prettiest 💐' },
      { src: 'flower.jpg', caption: '"Cozy warmth and peaceful happiness by your side ❄️🔥"', tag: '#AlwaysWithYou ☕' },
      { src: 'image/photo_cake.jpg', caption: '"Happy Birthday to the most special person in the world! 🎂💖"', tag: '#BirthdayQueen 👑' }
    ],
    scratchCards: [
      {
        icon: '🌟',
        frontTitle: 'Birthday Wish #1',
        frontSub: 'Mystery Birthday Blessing ✨',
        backTag: '🌟 VIP Birthday Wish',
        backTitle: 'Endless Smiles & Joy',
        backText: '"May your year ahead overflow with boundless happiness, radiant health, and 365 days of genuine smiles!"'
      },
      {
        icon: '🤝',
        frontTitle: 'Forever Promise #2',
        frontSub: 'Heartfelt Commitment ❤️',
        backTag: '🤝 Lifetime Promise',
        backTitle: 'Always By Your Side',
        backText: '"I promise to always stand beside you, cheer for every dream you chase, and hold your hand through everything."'
      },
      {
        icon: '🧸',
        frontTitle: 'Special Voucher #3',
        frontSub: 'Unlimited Pampering Pass 💖',
        backTag: '💖 Exclusive Voucher',
        backTitle: 'Unlimited Pampering Pass',
        backText: '"Lifetime pass for unlimited warm hugs, sweet midnight ice creams, and 100% undivided attention whenever you need!"'
      }
    ]
  };

  // Safe string helper
  function escapeText(str) {
    return String(str || '').replace(/[&<>"']/g, function(s) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s];
    });
  }

  // Load customizations from URL Query parameters or localStorage
  function loadCustomizationData() {
    try {
      var params = new URLSearchParams(window.location.search);

      // Check URL parameters
      var rec = params.get('recipient') || params.get('name') || params.get('to');
      if (rec && rec.trim()) templateData.recipient = rec.trim();

      var snd = params.get('sender') || params.get('from');
      if (snd && snd.trim()) templateData.sender = snd.trim();

      var msg = params.get('message') || params.get('text');
      if (msg && msg.trim()) templateData.message = msg.trim();

      var tit = params.get('title');
      if (tit && tit.trim()) templateData.title = tit.trim();

      // Check for saved moment ID in localStorage (vanvi_user_moments)
      var momentId = params.get('id');
      if (momentId) {
        var rawMoments = localStorage.getItem('vanvi_user_moments');
        if (rawMoments) {
          var list = JSON.parse(rawMoments);
          var found = list.find(function (m) { return m.id === momentId || m.slug === momentId; });
          if (found) {
            if (found.recipient) templateData.recipient = found.recipient;
            if (found.sender) templateData.sender = found.sender;
            if (found.message) templateData.message = found.message;
            if (found.photos && Array.isArray(found.photos) && found.photos.length > 0) {
              found.photos.forEach(function (p, idx) {
                if (idx < templateData.photos.length) {
                  if (typeof p === 'string') templateData.photos[idx].src = p;
                  else if (p && p.src) templateData.photos[idx].src = p.src;
                }
              });
            }
          }
        }
      }

      // Check custom photos from URL params (e.g., photo1, photo2)
      for (var pi = 0; pi < 4; pi++) {
        var pUrl = params.get('photo' + (pi + 1));
        if (pUrl && pUrl.trim()) {
          templateData.photos[pi].src = pUrl.trim();
        }
      }
    } catch (e) {
      console.warn('[VanviMoments] Note reading customization:', e);
    }
  }

  loadCustomizationData();

  // Expose global letter variables for typewriter
  window.textLetterH2 = templateData.title || 'Happy Birthday!';
  window.textLetterP = templateData.message;

  // Apply customizations to DOM elements
  function applyCustomizationsToDOM() {
    // 1. Headline
    var headline = document.querySelector('.headline');
    if (headline) {
      headline.textContent = 'Hey! ' + templateData.recipient + ' i have surprise for you';
    }

    // 2. SVG Heart Banner text
    var svgTextPath = document.querySelector('#theSvg textPath');
    if (svgTextPath) {
      svgTextPath.textContent = '🌹Happy Birthday 🌹.........................................................................................................................................🌹 ' + templateData.recipient + ' !🌹';
    }

    // 3. Card in envelope
    var cardText = document.querySelector('#castle .card .text');
    if (cardText) {
      cardText.innerHTML = 'Happy<br> Birthday<br> ' + escapeText(templateData.recipient) + ' !';
    }

    // 4. Letter Signature
    var signature = document.querySelector('#letterScene .signature');
    if (signature) {
      signature.innerHTML = '<br>' + escapeText(templateData.sender);
    }

    // 5. Audio
    var audio = document.getElementById('bgm');
    if (audio && templateData.music) {
      audio.src = templateData.music;
    }

    // 6. Polaroids
    var polaroidDeck = document.getElementById('polaroidDeck');
    if (polaroidDeck) {
      var polaroidCards = polaroidDeck.querySelectorAll('.polaroid-card');
      polaroidCards.forEach(function (card, idx) {
        if (templateData.photos[idx]) {
          var img = card.querySelector('img');
          var caption = card.querySelector('.polaroid-caption');
          var tag = card.querySelector('.polaroid-tag');
          if (img && templateData.photos[idx].src) img.src = templateData.photos[idx].src;
          if (caption && templateData.photos[idx].caption) caption.textContent = templateData.photos[idx].caption;
          if (tag && templateData.photos[idx].tag) tag.textContent = templateData.photos[idx].tag;
        }
      });
    }

    // 7. Finale Title & Text
    var finaleTitle = document.querySelector('#finaleStage .finale-title');
    if (finaleTitle) {
      finaleTitle.textContent = 'Happy Birthday ' + templateData.recipient + '! 🎉';
    }
  }

  // Preloader & Init
  var pageLoader = document.getElementById('pageLoader');
  function showLoader() { pageLoader && pageLoader.classList.add('show'); document.body.classList.remove('is-loaded'); }
  function hideLoader() { pageLoader && pageLoader.classList.remove('show'); }

  showLoader();
  setTimeout(function () {
    try {
      applyCustomizationsToDOM();
      hideLoader();
      document.body.classList.add('is-loaded');
    } catch (e) {
      console.error('Initialization error:', e);
      hideLoader();
      document.body.classList.add('is-loaded');
    }
  }, 1000);

  // Listen for Live PostMessage updates from Vanvi Studio/Builder
  window.addEventListener('message', function (event) {
    if (!event.data) return;
    var d = event.data;
    if (d.type === 'VANVI_UPDATE_DATA' || d.recipient || d.message) {
      if (d.recipient) templateData.recipient = d.recipient;
      if (d.sender) templateData.sender = d.sender;
      if (d.message) {
        templateData.message = d.message;
        window.textLetterP = d.message;
      }
      applyCustomizationsToDOM();
    }
  });

  // Gift box interaction
  (function () {
    var box = document.getElementById('giftBox');
    if (!box) return;
    var opened = false;

    function openBox() {
      if (opened) return;
      opened = true;
      box.classList.add('open');
      var bgm = document.getElementById('bgm');
      if (bgm) {
        try { bgm.volume = 0.6; bgm.play().catch(function () { }); } catch (e) { }
      }
      setTimeout(function () {
        document.body.classList.add('hide-ui');
        var scene = document.getElementById('letterScene');
        if (scene) { scene.style.display = 'block'; }
        initLetterScene();
      }, 1000);
    }
    box.addEventListener('click', openBox, { passive: true });
    box.addEventListener('pointerdown', openBox, { passive: true });
    box.addEventListener('touchstart', openBox, { passive: true });
  })();

  // Mobile gesture zoom lock
  (function () {
    function isMobile() { return /Mobi|Android|iPad|iPhone|iPod/i.test(navigator.userAgent); }
    if (!isMobile()) return;
    document.addEventListener('gesturestart', function (e) { e.preventDefault(); }, { passive: false });
    document.addEventListener('gesturechange', function (e) { e.preventDefault(); }, { passive: false });
    document.addEventListener('gestureend', function (e) { e.preventDefault(); }, { passive: false });
    document.addEventListener('wheel', function (e) { if (e.ctrlKey) { e.preventDefault(); } }, { passive: false, capture: true });
    var lastTouchEnd = 0;
    document.addEventListener('touchend', function (e) {
      var now = Date.now();
      if (now - lastTouchEnd <= 300) { e.preventDefault(); }
      lastTouchEnd = now;
    }, { passive: false });
    document.addEventListener('touchmove', function (e) {
      if (e.touches && e.touches.length > 1) { e.preventDefault(); }
    }, { passive: false });
  })();

  // Floating Balloons & Sky
  var balloonsInitialized = false;
  function initFloatingBalloons() {
    if (balloonsInitialized) return;
    balloonsInitialized = true;

    var sky = document.getElementById('celebrationSky');
    if (!sky) return;

    var balloonColors = [
      'radial-gradient(circle at 35% 30%, #fff 0%, #ff8da1 40%, #ff477e 100%)',
      'radial-gradient(circle at 35% 30%, #fff 0%, #ffe066 40%, #f59f00 100%)',
      'radial-gradient(circle at 35% 30%, #fff 0%, #d0bfff 40%, #845ef7 100%)',
      'radial-gradient(circle at 35% 30%, #fff 0%, #ffa8a8 40%, #fa5252 100%)',
      'radial-gradient(circle at 35% 30%, #fff 0%, #ffc9c9 40%, #ff6b8b 100%)',
      'radial-gradient(circle at 35% 30%, #fff 0%, #b2f2bb 40%, #20c997 100%)'
    ];

    var balloonSectors = [
      { min: 2, max: 20 },
      { min: 21, max: 39 },
      { min: 40, max: 60 },
      { min: 61, max: 79 },
      { min: 80, max: 97 }
    ];
    var currentBalloonSectorIdx = 0;

    var isMobileDevice = /Mobi|Android|iPad|iPhone|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;
    var maxBalloons = isMobileDevice ? 8 : 16;
    var maxPetals = isMobileDevice ? 6 : 12;
    var activeBalloons = 0;
    var activePetals = 0;

    function spawnBalloon(preferredSector) {
      if (activeBalloons >= maxBalloons) return;
      activeBalloons++;

      var b = document.createElement('div');
      b.className = 'floating-balloon';
      var isHeart = Math.random() > 0.45;

      var sector = preferredSector !== undefined ? balloonSectors[preferredSector % balloonSectors.length] : balloonSectors[currentBalloonSectorIdx];
      if (preferredSector === undefined) {
        currentBalloonSectorIdx = (currentBalloonSectorIdx + 1) % balloonSectors.length;
      }

      var startX = Math.random() * (sector.max - sector.min) + sector.min;
      var duration = Math.random() * 4 + 6.5;
      var scale = Math.random() * 0.35 + 0.85;
      var swayDistance = (Math.random() * 25 + 15) * (Math.random() > 0.5 ? 1 : -1);

      b.style.left = startX + 'vw';
      b.style.transform = 'scale(' + scale + ')';

      if (isHeart) {
        b.innerHTML = '<div class="heart-balloon">💖<div class="balloon-string"></div></div>';
      } else {
        var bg = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        b.innerHTML = '<div class="balloon-body" style="background: ' + bg + ';"><div class="balloon-knot" style="background: ' + bg + ';"></div><div class="balloon-string"></div></div>';
      }

      sky.appendChild(b);

      var startTime = null;
      function animateBalloon(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = (timestamp - startTime) / (duration * 1000);
        if (progress >= 1) {
          if (b.parentNode) b.remove();
          activeBalloons--;
          return;
        }
        var currentY = progress * 135;
        var currentX = Math.sin(progress * Math.PI * 3) * swayDistance;
        b.style.bottom = (currentY - 15) + 'vh';
        b.style.transform = 'translateX(' + currentX + 'px) scale(' + scale + ')';
        requestAnimationFrame(animateBalloon);
      }
      requestAnimationFrame(animateBalloon);
    }

    var initialBalloonCount = isMobileDevice ? 4 : 8;
    for (var i = 0; i < initialBalloonCount; i++) {
      (function (idx) {
        setTimeout(function () {
          spawnBalloon(idx % 5);
        }, idx * 180);
      })(i);
    }

    setInterval(function () {
      spawnBalloon();
    }, isMobileDevice ? 1200 : 800);

    // Rose Petals
    var petalSectors = [
      { min: 0, max: 20 },
      { min: 20, max: 40 },
      { min: 40, max: 60 },
      { min: 60, max: 80 },
      { min: 80, max: 100 }
    ];
    var currentPetalSectorIdx = 0;

    function spawnPetal(preferredSector) {
      if (activePetals >= maxPetals) return;
      activePetals++;

      var p = document.createElement('div');
      p.className = 'floating-petal';

      var sector = preferredSector !== undefined ? petalSectors[preferredSector % petalSectors.length] : petalSectors[currentPetalSectorIdx];
      if (preferredSector === undefined) {
        currentPetalSectorIdx = (currentPetalSectorIdx + 1) % petalSectors.length;
      }

      var startX = Math.random() * (sector.max - sector.min) + sector.min;
      p.style.left = startX + 'vw';

      var dur = Math.random() * 4 + 6;
      var size = Math.random() * 8 + 12;
      p.style.width = size + 'px';
      p.style.height = (size * 1.3) + 'px';
      sky.appendChild(p);

      var startT = null;
      var startRot = Math.random() * 360;
      var petalSway = (Math.random() * 35 + 20) * (Math.random() > 0.5 ? 1 : -1);

      function animatePetal(ts) {
        if (!startT) startT = ts;
        var prog = (ts - startT) / (dur * 1000);
        if (prog >= 1) {
          if (p.parentNode) p.remove();
          activePetals--;
          return;
        }
        var y = prog * 115;
        var x = Math.sin(prog * Math.PI * 4) * petalSway;
        p.style.top = y + 'vh';
        p.style.transform = 'translateX(' + x + 'px) rotate(' + (startRot + prog * 360) + 'deg)';
        requestAnimationFrame(animatePetal);
      }
      requestAnimationFrame(animatePetal);
    }

    var initialPetalCount = isMobileDevice ? 3 : 6;
    for (var j = 0; j < initialPetalCount; j++) {
      (function (idx) {
        setTimeout(function () {
          spawnPetal(idx % 5);
        }, idx * 220);
      })(j);
    }
    setInterval(function () {
      spawnPetal();
    }, isMobileDevice ? 1400 : 1000);
  }

  // Confetti helper
  function launchConfetti(opts) {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: opts && opts.count ? opts.count : 50,
        spread: opts && opts.spread ? opts.spread : 70,
        origin: opts && opts.origin ? opts.origin : { y: 0.6 },
        colors: ['#ff477e', '#ff8da1', '#ffd1dc', '#ffea79', '#a0c4ff', '#caffbf', '#ffd700']
      });
    }
  }

  // Birthday Journey Stages
  function startBirthdayJourney() {
    var container = document.getElementById('birthdayJourneyContainer');
    if (!container) return;

    container.style.display = 'flex';
    container.style.opacity = '0';

    var cakeStage = document.getElementById('cakeStage');
    if (cakeStage) {
      cakeStage.style.display = 'block';
      cakeStage.classList.remove('stage-exit-active');
      cakeStage.classList.add('stage-enter-active');
    }

    requestAnimationFrame(function () {
      container.style.transition = 'opacity 0.4s ease';
      container.style.opacity = '1';
    });

    launchConfetti({ count: 45, spread: 65, origin: { y: 0.5 } });

    // Stage 1: Cake & Candle
    var candleBlown = false;
    var interactiveCake = document.getElementById('interactiveCake');
    var candleFlame = document.getElementById('candleFlame');
    var candleSmoke = document.getElementById('candleSmoke');
    var cakeTapHint = document.getElementById('cakeTapHint');
    var wishMadeText = document.getElementById('wishMadeText');
    var toMemoriesBtn = document.getElementById('toMemoriesBtn');

    function blowCandle() {
      if (candleBlown) return;
      candleBlown = true;
      if (candleFlame) candleFlame.classList.add('blown-out');
      if (candleSmoke) candleSmoke.classList.add('active');
      if (cakeTapHint) cakeTapHint.style.display = 'none';

      launchConfetti({ count: 120, spread: 100, origin: { y: 0.5 } });
      setTimeout(function () {
        launchConfetti({ count: 80, spread: 80, origin: { y: 0.4 } });
      }, 350);

      if (wishMadeText) wishMadeText.style.display = 'block';
      if (toMemoriesBtn) toMemoriesBtn.style.display = 'inline-flex';
    }

    if (interactiveCake) {
      interactiveCake.onclick = blowCandle;
    }

    // Stage switcher helper
    function switchStage(fromId, toId) {
      var fromStage = document.getElementById(fromId);
      var toStage = document.getElementById(toId);
      if (!fromStage || !toStage) return;

      fromStage.classList.remove('stage-enter-active');
      fromStage.classList.add('stage-exit-active');

      setTimeout(function () {
        fromStage.style.display = 'none';
        fromStage.classList.remove('stage-exit-active');
        toStage.style.display = 'block';
        toStage.classList.add('stage-enter-active');
        launchConfetti({ count: 35, spread: 60, origin: { y: 0.7 } });
      }, 320);
    }

    if (toMemoriesBtn) {
      toMemoriesBtn.onclick = function () {
        switchStage('cakeStage', 'polaroidStage');
      };
    }

    // Stage 2: Polaroids
    var currentPolaroid = 0;
    var cards = document.querySelectorAll('.polaroid-card');
    var dots = document.querySelectorAll('#polaroidDots .dot');
    var nextPolaroidBtn = document.getElementById('nextPolaroidBtn');
    var toScratchBtn = document.getElementById('toScratchBtn');
    var polaroidDeck = document.getElementById('polaroidDeck');

    function showPolaroid(idx, prevIdx) {
      if (prevIdx !== undefined && cards[prevIdx]) {
        cards[prevIdx].classList.add('swiped-out');
        cards[prevIdx].classList.remove('active');
      }

      cards.forEach(function (c, i) {
        if (i === idx) {
          c.classList.remove('swiped-out');
          c.classList.add('active');
        } else if (i > idx) {
          c.classList.remove('active', 'swiped-out');
        }
      });

      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === idx);
      });

      if (idx >= cards.length - 1) {
        if (nextPolaroidBtn) nextPolaroidBtn.style.display = 'none';
        if (toScratchBtn) {
          toScratchBtn.style.display = 'inline-flex';
          toScratchBtn.classList.add('stage-enter-active');
        }
      }
    }

    function advancePolaroid() {
      if (currentPolaroid < cards.length - 1) {
        var prev = currentPolaroid;
        currentPolaroid++;
        showPolaroid(currentPolaroid, prev);
        launchConfetti({ count: 25, spread: 45, origin: { y: 0.6 } });
      }
    }

    if (nextPolaroidBtn) nextPolaroidBtn.onclick = advancePolaroid;
    if (polaroidDeck) polaroidDeck.onclick = advancePolaroid;

    if (toScratchBtn) {
      toScratchBtn.onclick = function () {
        switchStage('polaroidStage', 'scratchStage');
      };
    }

    // Stage 3: Scratch Cards
    var scratchCards = document.querySelectorAll('.scratch-card');
    var toFinaleBtn = document.getElementById('toFinaleBtn');
    var revealedCount = 0;

    scratchCards.forEach(function (sc) {
      sc.onclick = function () {
        if (this.classList.contains('revealed')) return;
        this.classList.add('revealed');
        revealedCount++;
        launchConfetti({ count: 45, spread: 60, origin: { y: 0.6 } });

        if (revealedCount >= scratchCards.length) {
          if (toFinaleBtn) {
            toFinaleBtn.style.display = 'inline-flex';
            setTimeout(function () {
              launchConfetti({ count: 100, spread: 90, origin: { y: 0.5 } });
            }, 300);
          }
        }
      };
    });

    if (toFinaleBtn) {
      toFinaleBtn.onclick = function () {
        switchStage('scratchStage', 'finaleStage');
        var finaleCounter = 0;
        var finaleInterval = setInterval(function () {
          var finaleEl = document.getElementById('finaleStage');
          if (finaleEl && finaleEl.style.display === 'block' && finaleCounter < 15) {
            finaleCounter++;
            launchConfetti({
              count: 50,
              spread: 85,
              origin: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.5 + 0.2 }
            });
          } else {
            clearInterval(finaleInterval);
          }
        }, 1200);
      };
    }

    // Stage 4: Finale Controls & Sharing
    var replayBtn = document.getElementById('replayJourneyBtn');
    var toggleMusicBtn = document.getElementById('toggleMusicBtn');
    var shareWaBtn = document.getElementById('shareWhatsAppBtn');
    var copyLinkBtn = document.getElementById('copyLinkBtn');
    var bgm = document.getElementById('bgm');

    if (replayBtn) {
      replayBtn.onclick = function () {
        location.reload();
      };
    }

    if (toggleMusicBtn && bgm) {
      toggleMusicBtn.onclick = function () {
        if (bgm.paused) {
          bgm.play().catch(function () {});
          toggleMusicBtn.innerHTML = '<i class="fa-solid fa-music"></i> <span>Music: ON</span>';
        } else {
          bgm.pause();
          toggleMusicBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span>Music: OFF</span>';
        }
      };
    }

    // WhatsApp Direct Share
    if (shareWaBtn) {
      shareWaBtn.onclick = function () {
        var text = encodeURIComponent('🎂✨ Happy Birthday ' + templateData.recipient + '! Here is your special 3D Birthday Celebration Moment: ' + window.location.href);
        window.open('https://api.whatsapp.com/send?text=' + text, '_blank');
      };
    }

    // Copy Link
    if (copyLinkBtn) {
      copyLinkBtn.onclick = function () {
        navigator.clipboard.writeText(window.location.href).then(function() {
          var originalHtml = copyLinkBtn.innerHTML;
          copyLinkBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Copied!</span>';
          setTimeout(function() {
            copyLinkBtn.innerHTML = originalHtml;
          }, 2000);
        });
      };
    }
  }

  // Interactive Envelope & Letter Scene
  function initLetterScene() {
    try {
      initFloatingBalloons();

      var SVG_NS = 'http://www.w3.org/2000/svg';
      var shape = document.getElementById('shape');
      var partialPath = document.getElementById('partialPath');
      var theSvg = document.getElementById('theSvg');

      if (shape && partialPath && theSvg) {
        var rid = null;
        var pathlength = shape.getTotalLength();
        var t = 0;
        var lengthAtT = pathlength * t;
        var d = shape.getAttribute('d');
        var n = (d.match(/C/gi) || []).length;
        var pos = 0;

        class SubPath {
          constructor(sd) {
            this.d = sd;
            this.getPoints();
            this.previous = subpaths.length > 0 ? subpaths[subpaths.length - 1] : null;
            this.measurePath();
            this.getMovePoint();
            this.lastCubicBezier = undefined;
            this.getLastCubicBezier();
          }
          getPoints() {
            this.pointsRy = [];
            var temp = this.d.split(/[A-Z,a-zs,]/).filter(Boolean);
            temp.forEach(function (item) { this.pointsRy.push(parseFloat(item)); }, this);
          }
          measurePath() {
            var p = document.createElementNS(SVG_NS, 'path');
            p.setAttributeNS(null, 'd', this.d);
            this.pathLength = p.getTotalLength();
          }
          getMovePoint() {
            if (this.previous) {
              var p = this.previous.pointsRy; var l = p.length;
              this.M_point = [p[l - 2], p[l - 1]];
            } else {
              var p = this.pointsRy; this.M_point = [p[0], p[1]];
            }
          }
          getLastCubicBezier() {
            var lastIndexOfC = this.d.lastIndexOf('C');
            var temp = this.d.substring(lastIndexOfC + 1).split(/[s,]/).filter(Boolean);
            var nums = []; temp.forEach(function (item) { nums.push(parseFloat(item)); });
            this.lastCubicBezier = [this.M_point];
            for (var i = 0; i < nums.length; i += 2) { this.lastCubicBezier.push(nums.slice(i, i + 2)); }
          }
        }

        var subpaths = [];
        for (var i = 0; i < n; i++) {
          var newpos = d.indexOf('C', pos + 1);
          if (i > 0) { subpaths.push(new SubPath(d.substring(0, newpos))); }
          pos = newpos;
        }
        subpaths.push(new SubPath(d));

        var index = 0;
        for (index = 0; index < subpaths.length; index++) {
          if (subpaths[index].pathLength >= lengthAtT) { break; }
        }
        function get_T(tt, idx) {
          lengthAtT = pathlength * tt; var T;
          if (idx > 0) {
            T = (lengthAtT - subpaths[idx].previous.pathLength) / (subpaths[idx].pathLength - subpaths[idx].previous.pathLength);
          } else { T = lengthAtT / subpaths[idx].pathLength; }
          return T;
        }
        function lerp(A, B, tt) { return [(B[0] - A[0]) * tt + A[0], (B[1] - A[1]) * tt + A[1]]; }
        function getBezierPoints(tt, points) {
          var helper = [];
          for (var i = 1; i < 4; i++) { helper.push(lerp(points[i - 1], points[i], tt)); }
          helper.push(lerp(helper[0], helper[1], tt));
          helper.push(lerp(helper[1], helper[2], tt));
          helper.push(lerp(helper[3], helper[4], tt));
          return [points[0], helper[0], helper[3], helper[5]];
        }
        function drawCBezier(points) {
          var dd;
          if (index > 0) { dd = subpaths[index].previous.d; }
          else { dd = `M${points[0][0]},${points[0][1]} C`; }
          for (var i = 1; i < 4; i++) { dd += ` ${points[i][0]},${points[i][1]} `; }
          partialPath.setAttributeNS(null, 'd', dd);
        }
        theSvg.style.display = 'inherit';
        function Typing() {
          rid = window.requestAnimationFrame(Typing);
          if (t >= 1) { window.cancelAnimationFrame(rid); rid = null; }
          else { t += 0.0025; }
          lengthAtT = pathlength * t;
          for (index = 0; index < subpaths.length; index++) {
            if (subpaths[index].pathLength >= lengthAtT) { break; }
          }
          var T = get_T(t, index);
          var newPoints = getBezierPoints(T, subpaths[index].lastCubicBezier);
          drawCBezier(newPoints);
        }
        rid = window.requestAnimationFrame(Typing);
      }

      // Smooth typewriter
      var textLetter = document.querySelector('#letterScene .textLetter h2');
      var textLetterContent = document.querySelector('#letterScene .contentLetter');
      var typingTimer = null;

      function startSmoothTypewriter() {
        if (typingTimer) clearTimeout(typingTimer);
        var titleSrc = (window.textLetterH2 || 'Happy Birthday!');
        var contentSrc = (window.textLetterP || templateData.message);

        if (textLetter) textLetter.textContent = '';
        if (textLetterContent) textLetterContent.textContent = '';

        var tIdx = 0;
        function typeTitle() {
          if (tIdx < titleSrc.length) {
            if (textLetter) textLetter.textContent += titleSrc[tIdx];
            tIdx++;
            typingTimer = setTimeout(typeTitle, 80);
          } else {
            typingTimer = setTimeout(startContent, 300);
          }
        }

        var cIdx = 0;
        function startContent() {
          function typeContent() {
            if (cIdx < contentSrc.length) {
              if (textLetterContent) textLetterContent.textContent += contentSrc[cIdx];
              cIdx++;
              var char = contentSrc[cIdx - 1];
              var delay = (char === '.' || char === '!' || char === '?' || char === ',') ? 140 : 50;
              typingTimer = setTimeout(typeContent, delay);
            }
          }
          typeContent();
        }

        typeTitle();
      }

      function openLetterModal() {
        var card = document.querySelector('#letterScene .card');
        var wrapper = document.querySelector('#letterScene .wrapperLetterForm');
        var formLetter = document.querySelector('#letterScene .formLetter');
        var hint = document.querySelector('.envelope-hint');
        if (hint) hint.style.display = 'none';

        if (card && window.jQuery) {
          window.jQuery(card).stop().animate({ top: '-90px' }, 300);
        } else if (card) {
          card.style.top = '-90px';
        }

        setTimeout(function () {
          if (formLetter) {
            formLetter.style.transform = 'scale(1) translateY(0)';
            formLetter.style.opacity = '1';
          }
          if (wrapper) {
            wrapper.style.display = 'flex';
            if (window.jQuery) {
              window.jQuery(wrapper).fadeIn(350);
            }
          }
          startSmoothTypewriter();
        }, 180);
      }

      var clickableTargets = document.querySelectorAll('#letterScene .valentines, #letterScene .card, #letterScene .envelope, #letterScene .front, #letterScene .hearts, #castle');
      clickableTargets.forEach(function (el) {
        el.style.cursor = 'pointer';
        el.onclick = function (e) {
          e.stopPropagation();
          openLetterModal();
        };
      });

      if (window.jQuery) {
        window.jQuery('.valentines').off('mouseenter mouseleave').on('mouseenter', function () {
          window.jQuery('.card').stop().animate({ top: '-90px' }, 'slow');
        }).on('mouseleave', function () {
          window.jQuery('.card').stop().animate({ top: 0 }, 'slow');
        });
      }

      var nextBtns = document.querySelectorAll('.letterNextBtn');
      nextBtns.forEach(function (btn) {
        btn.onclick = function (e) {
          e.stopPropagation();
          var formLetter = document.querySelector('#letterScene .formLetter');
          var wrapper = document.querySelector('#letterScene .wrapperLetterForm');
          var letterScene = document.getElementById('letterScene');
          var theSvg = document.getElementById('theSvg');
          var castle = document.getElementById('castle');

          if (theSvg) theSvg.style.display = 'none';
          if (castle) castle.style.display = 'none';

          if (formLetter) {
            formLetter.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
            formLetter.style.transform = 'scale(0.92) translateY(-15px)';
            formLetter.style.opacity = '0';
          }
          if (wrapper) {
            wrapper.style.transition = 'opacity 0.3s ease';
            wrapper.style.opacity = '0';
          }

          setTimeout(function () {
            if (wrapper) wrapper.style.display = 'none';
            if (letterScene) {
              letterScene.style.display = 'none';
              document.body.classList.add('final-hide');
            }
            startBirthdayJourney();
          }, 300);
        };
      });

      var closeBtns = document.querySelectorAll('#letterScene .fa-xmark');
      closeBtns.forEach(function (cb) {
        cb.onclick = function () {
          var wrapper = document.querySelector('#letterScene .wrapperLetterForm');
          if (wrapper) wrapper.style.display = 'none';
        };
      });

      // Magic dust
      var head = document.getElementsByTagName('head')[0];
      var animationId = 1;
      function CreateMagicDust(x1, x2, y1, y2, sizeRatio, fallingTime, animationDelay, node = 'castle') {
        var dust = document.createElement('span');
        var animation = document.createElement('style');
        animation.innerHTML = `@keyframes blink${animationId}{0%{top:${y1}px;left:${x1}px;width:${2 * sizeRatio}px;height:${2 * sizeRatio}px;opacity:.4}20%{width:${4 * sizeRatio}px;height:${4 * sizeRatio}px;opacity:.8}35%{width:${2 * sizeRatio}px;height:${2 * sizeRatio}px;opacity:.5}55%{width:${3 * sizeRatio}px;height:${3 * sizeRatio}px;opacity:.7}80%{width:${sizeRatio}px;height:${sizeRatio}px;opacity:.3}100%{top:${y2}px;left:${x2}px;width:0px;height:0px;opacity:.1}}`;
        head.appendChild(animation);
        dust.classList.add('dustDef');
        dust.setAttribute('style', `animation: blink${animationId++} ${fallingTime}s cubic-bezier(.71,.11,.68,.83) infinite ${animationDelay}s`);
        var parent = document.getElementById(node) || document.getElementById('letterScene');
        parent && parent.appendChild(dust);
      }
      [[130, 132, 150, 152, .15, 2.5, .1, 'castle'],
      [65, 63, 300, 299, .5, 2, .2, 'castle'],
      [70, 70, 150, 150, .45, 2, .5],
      [75, 78, 160, 170, .6, 2, 1],
      [80, 82, 160, 180, .6, 1, .4],
      [85, 100, 160, 170, .5, 2, .5],
      [125, 110, 170, 180, .25, 3, 1.5],
      [90, 90, 115, 115, .4, 2, 2],
      [93, 95, 200, 200, .4, 3, 1.5],
      [100, 100, 145, 155, .45, 1, .5],
      [100, 90, 170, 230, .35, 2, .75],
      [100, 102, 115, 112, .35, 3, .25],
      [100, 95, 170, 200, .55, 1.5, .75],
      [100, 97, 150, 190, .7, 2, 1.5],
      [105, 100, 160, 180, .5, 1.5, .725],
      [125, 125, 180, 190, .25, 1, .725],
      [130, 130, 135, 135, .45, 3, 1.5],
      [135, 132, 170, 190, .25, 2.5, .75],
      [135, 132, 320, 315, .2, 5, .3, 'castle']
      ].forEach(function (o) { CreateMagicDust(...o); });
    } catch (err) {
      console.error('Letter scene error:', err);
    }
  }

  // Export for external API
  window.Vanvi3DCandleSurprise = {
    setData: function(newData) {
      if (newData.recipient) templateData.recipient = newData.recipient;
      if (newData.sender) templateData.sender = newData.sender;
      if (newData.message) {
        templateData.message = newData.message;
        window.textLetterP = newData.message;
      }
      applyCustomizationsToDOM();
    },
    getData: function() {
      return templateData;
    }
  };

})();
