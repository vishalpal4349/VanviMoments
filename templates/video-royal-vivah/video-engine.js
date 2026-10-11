/**
 * VANVI MOMENTS — ROYAL VIVAH HD VIDEO RENDERING ENGINE
 * End-to-end HTML5 Canvas 2D + WebAudio + MediaRecorder Compositor
 * Inspired by InviteMaker IM254 Workflow
 */

(function(root) {
  'use strict';

  class WeddingVideoEngine {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: false });
      this.duration = options.duration || 45; // 45 seconds cinematic video
      this.width = options.width || 720;
      this.height = options.height || 1280; // 9:16 vertical ratio
      this.canvas.width = this.width;
      this.canvas.height = this.height;

      this.currentTime = 0;
      this.isPlaying = false;
      this.isMuted = false;
      this.playbackRate = 1.0;
      this.watermark = options.watermark !== undefined ? options.watermark : true;

      // Particle system for golden dust & petals
      this.particles = [];
      this.initParticles(60);

      // Default wedding details
      this.data = {
        brideName: 'Pooja',
        groomName: 'Aryan',
        brideParents: 'Smt. Sunita & Shri Rajesh Sharma',
        groomParents: 'Smt. Rekha & Shri Mahendra Verma',
        weddingDate: 'Friday, 12th December 2026',
        muhuratTime: 'Shubh Godhuli Bela — 07:15 PM',
        city: 'Udaipur, Rajasthan',
        events: [
          { name: 'Haldi Ceremony', date: '10 Dec', time: '10:00 AM' },
          { name: 'Mehendi & Sangeet', date: '11 Dec', time: '06:00 PM' },
          { name: 'Shubh Vivah (Pheras)', date: '12 Dec', time: '07:00 PM' },
          { name: 'Grand Royal Reception', date: '13 Dec', time: '08:00 PM' }
        ],
        venueName: 'The Grand Palace Resort & Royal Lawns',
        venueAddress: 'Fateh Sagar Lake Road, Udaipur, Rajasthan',
        rsvpName: 'Sharma & Verma Families',
        rsvpPhone: '+91 98765 43210',
        couplePhoto: null, // Image object or data url
        bgVideo: null,     // HTMLVideoElement if custom video is supplied
        musicType: 'santoor' // santoor, shehnai, custom
      };

      if (options.data) {
        this.updateData(options.data);
      }

      // Audio setup
      this.audioCtx = null;
      this.audioNode = null;
      this.customAudio = null;
      this.isAudioStarted = false;

      // Animation loop handle
      this.rafId = null;
      this.lastFrameTime = 0;

      // Render callback
      this.onTimeUpdate = options.onTimeUpdate || null;
      this.onEnded = options.onEnded || null;

      // Preload default couple photo if not provided
      this.defaultCoupleImg = new Image();
      this.defaultCoupleImg.crossOrigin = 'anonymous';
      this.defaultCoupleImg.src = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600&auto=format&fit=crop';
    }

    initParticles(count) {
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.random() * 2.5 + 1,
          speedY: Math.random() * 0.8 + 0.3,
          speedX: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.7 + 0.3,
          type: Math.random() > 0.4 ? 'gold' : 'petal',
          angle: Math.random() * Math.PI * 2,
          angularSpeed: (Math.random() - 0.5) * 0.04
        });
      }
    }

    updateData(newData) {
      this.data = { ...this.data, ...newData };
      if (typeof newData.couplePhoto === 'string') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = newData.couplePhoto;
        img.onload = () => {
          this.data.couplePhotoImg = img;
          this.drawFrame(this.currentTime);
        };
      }
      this.drawFrame(this.currentTime);
    }

    setWatermark(enabled) {
      this.watermark = enabled;
      this.drawFrame(this.currentTime);
    }

    // -------------------------------------------------------------
    // AUDIO ENGINE (Web Audio API Synthesizer + Custom MP3)
    // -------------------------------------------------------------
    initAudio() {
      if (this.audioCtx) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      } catch (e) {
        console.warn('[VideoEngine] WebAudio not available:', e);
      }
    }

    startAudio() {
      this.initAudio();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (this.customAudio) {
        this.customAudio.currentTime = this.currentTime % (this.customAudio.duration || this.duration);
        if (!this.isMuted) this.customAudio.play().catch(() => {});
        return;
      }
      this.playSynthNoteSequence();
    }

    stopAudio() {
      if (this.customAudio) {
        this.customAudio.pause();
      }
      if (this.audioCtx && this.audioCtx.state === 'running') {
        // suspend gently
      }
    }

    playSynthNoteSequence() {
      if (!this.audioCtx || this.isMuted) return;
      // Gentle harmonious Raag Bhupali / Yaman pentatonic drone & santoor notes
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C D E G A C
      const time = this.currentTime;
      const noteIndex = Math.floor(time * 2) % notes.length;
      const freq = notes[noteIndex];

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.06, this.audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.65);
    }

    // -------------------------------------------------------------
    // PLAYBACK CONTROLS
    // -------------------------------------------------------------
    play() {
      if (this.isPlaying) return;
      this.isPlaying = true;
      this.startAudio();
      this.lastFrameTime = performance.now();
      this.loop(this.lastFrameTime);
    }

    pause() {
      this.isPlaying = false;
      this.stopAudio();
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    togglePlay() {
      if (this.isPlaying) this.pause();
      else this.play();
    }

    seek(seconds) {
      this.currentTime = Math.max(0, Math.min(this.duration, seconds));
      if (this.customAudio) {
        this.customAudio.currentTime = this.currentTime;
      }
      this.drawFrame(this.currentTime);
      if (this.onTimeUpdate) this.onTimeUpdate(this.currentTime, this.duration);
    }

    setMute(mute) {
      this.isMuted = mute;
      if (this.customAudio) {
        this.customAudio.muted = mute;
      }
    }

    loop(now) {
      if (!this.isPlaying) return;
      const delta = (now - this.lastFrameTime) / 1000;
      this.lastFrameTime = now;

      this.currentTime += delta * this.playbackRate;

      // Periodic gentle musical pluck
      if (Math.floor(this.currentTime * 2) !== Math.floor((this.currentTime - delta) * 2)) {
        this.playSynthNoteSequence();
      }

      if (this.currentTime >= this.duration) {
        this.currentTime = 0; // loop
        if (this.onEnded) this.onEnded();
      }

      this.drawFrame(this.currentTime);

      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.currentTime, this.duration);
      }

      this.rafId = requestAnimationFrame((t) => this.loop(t));
    }

    // -------------------------------------------------------------
    // DRAW FRAME DISPATCHER
    // -------------------------------------------------------------
    drawFrame(t) {
      const { ctx, width, height } = this;

      // 1. Clear & Background
      this.drawBackground(t);

      // 2. Animated floating particles
      this.drawParticles(t);

      // 3. Ornate Royal Borders & Corner Motifs
      this.drawRoyalBorders(t);

      // 4. Act Sequencer:
      // Act 1: 0s - 8s    (Ganesh Shloka & Auspicious Invocation)
      // Act 2: 8s - 18s   (The Royal Couple & Parents Dedication)
      // Act 3: 18s - 26s  (Save Our Date & Auspicious Muhurat)
      // Act 4: 26s - 36s  (Sacred Ceremonies Itinerary)
      // Act 5: 36s - 45s  (Royal Venue & RSVP Blessings)
      if (t >= 0 && t < 8) {
        this.drawAct1_Ganesh(t);
      } else if (t >= 8 && t < 18) {
        this.drawAct2_Couple(t - 8);
      } else if (t >= 18 && t < 26) {
        this.drawAct3_Date(t - 18);
      } else if (t >= 26 && t < 36) {
        this.drawAct4_Events(t - 26);
      } else {
        this.drawAct5_Venue(t - 36);
      }

      // 5. Watermark (if in unpaid preview mode)
      if (this.watermark) {
        this.drawWatermark();
      }
    }

    // -------------------------------------------------------------
    // VISUAL ASSETS RENDERING
    // -------------------------------------------------------------
    drawBackground(t) {
      const { ctx, width, height } = this;

      if (this.data.bgVideo && this.data.bgVideo.readyState >= 2) {
        ctx.drawImage(this.data.bgVideo, 0, 0, width, height);
        // Add subtle dark ruby overlay for high readability of text
        ctx.fillStyle = 'rgba(26, 7, 14, 0.45)';
        ctx.fillRect(0, 0, width, height);
        return;
      }

      // Deep Ruby & Imperial Crimson Gradient
      const grad = ctx.createRadialGradient(
        width / 2, height * 0.4, 80,
        width / 2, height * 0.5, height * 0.8
      );
      grad.addColorStop(0, '#530f21'); // Ruby warm core
      grad.addColorStop(0.5, '#2b0610'); // Deep burgundy
      grad.addColorStop(1, '#0e0206'); // Midnight velvet black
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Rotating ambient sacred mandala in background
      ctx.save();
      ctx.translate(width / 2, height * 0.38);
      ctx.rotate(t * 0.05);
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.07)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 16; i++) {
        ctx.rotate(Math.PI / 8);
        ctx.strokeRect(-180, -180, 360, 360);
        ctx.beginPath();
        ctx.arc(0, 0, 220, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawParticles(t) {
      const { ctx } = this;
      this.particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += Math.sin(t + p.y * 0.01) * 0.4;
        p.angle += p.angularSpeed;

        if (p.y < -20) {
          p.y = this.height + 20;
          p.x = Math.random() * this.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        if (p.type === 'gold') {
          ctx.fillStyle = `rgba(243, 229, 171, ${p.opacity * 0.8})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Rose petal
          ctx.fillStyle = `rgba(225, 29, 72, ${p.opacity * 0.5})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius * 2, p.radius * 1.2, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
    }

    drawRoyalBorders(t) {
      const { ctx, width, height } = this;
      const margin = 32;

      ctx.save();
      // Outer Gold Frame
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
      ctx.lineWidth = 2;
      ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

      // Inner Fine Golden Line
      ctx.strokeStyle = 'rgba(243, 229, 171, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(margin + 8, margin + 8, width - (margin + 8) * 2, height - (margin + 8) * 2);

      // 4 Ornate Corner Accents
      const drawCorner = (x, y, rot) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 24);
        ctx.lineTo(0, 0);
        ctx.lineTo(24, 0);
        ctx.stroke();

        ctx.fillStyle = '#D4AF37';
        ctx.beginPath();
        ctx.arc(6, 6, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      drawCorner(margin + 12, margin + 12, 0);
      drawCorner(width - margin - 12, margin + 12, Math.PI / 2);
      drawCorner(width - margin - 12, height - margin - 12, Math.PI);
      drawCorner(margin + 12, height - margin - 12, -Math.PI / 2);

      ctx.restore();
    }

    // -------------------------------------------------------------
    // ACT 1: AUSPICIOUS SHREE GANESHAY NAMAH (0s - 8s)
    // -------------------------------------------------------------
    drawAct1_Ganesh(t) {
      const { ctx, width, height } = this;
      const alpha = this.getSceneAlpha(t, 8);

      ctx.save();
      ctx.globalAlpha = alpha;

      // Divine Golden Radiance behind Ganesha
      const radGrad = ctx.createRadialGradient(width / 2, 400, 20, width / 2, 400, 260);
      radGrad.addColorStop(0, 'rgba(212, 175, 55, 0.35)');
      radGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(width / 2, 400, 260, 0, Math.PI * 2);
      ctx.fill();

      // Golden Lord Ganesha Silhouette Motif
      this.drawGaneshaMotif(width / 2, 380, 1.2 + Math.sin(t * 1.5) * 0.03);

      // Title: || श्री गणेशाय नमः ||
      ctx.textAlign = 'center';
      ctx.font = '700 38px "Cinzel", "Playfair Display", serif';
      ctx.fillStyle = '#F3E5AB';
      ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
      ctx.shadowBlur = 18;
      ctx.fillText('|| श्री गणेशाय नमः ||', width / 2, 600);

      // Auspicious Sanskrit Shloka
      ctx.shadowBlur = 4;
      ctx.font = '500 21px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#D1B3BA';
      ctx.fillText('वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।', width / 2, 660);
      ctx.fillText('निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥', width / 2, 700);

      // Ribbon Tag
      ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#D4AF37';
      ctx.fillText('✦ WITH THE DIVINE BLESSINGS OF THE ALMIGHTY ✦', width / 2, 800);

      ctx.restore();
    }

    drawGaneshaMotif(cx, cy, scale) {
      const { ctx } = this;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      ctx.strokeStyle = '#D4AF37';
      ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
      ctx.lineWidth = 3;

      // Head & Crown (Mukut)
      ctx.beginPath();
      ctx.moveTo(0, -70);
      ctx.lineTo(24, -40);
      ctx.lineTo(16, -20);
      ctx.lineTo(-16, -20);
      ctx.lineTo(-24, -40);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tilak
      ctx.fillStyle = '#E11D48';
      ctx.beginPath();
      ctx.ellipse(0, -32, 4, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ears & Trunk (Symbolic Graceful Curves)
      ctx.strokeStyle = '#F3E5AB';
      ctx.beginPath();
      // Right Ear
      ctx.arc(28, -15, 18, -Math.PI / 2, Math.PI / 2, false);
      // Left Ear
      ctx.arc(-28, -15, 18, Math.PI / 2, -Math.PI / 2, false);
      ctx.stroke();

      // Trunk
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.bezierCurveTo(4, 20, -10, 40, -4, 55);
      ctx.bezierCurveTo(4, 65, 20, 50, 14, 40);
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Modak
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.arc(22, 38, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // -------------------------------------------------------------
    // ACT 2: ROYAL COUPLE INTRODUCTION (8s - 18s)
    // -------------------------------------------------------------
    drawAct2_Couple(t) {
      const { ctx, width, height, data } = this;
      const alpha = this.getSceneAlpha(t, 10);

      ctx.save();
      ctx.globalAlpha = alpha;

      ctx.textAlign = 'center';

      // Top Tag
      ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#D4AF37';
      ctx.letterSpacing = '3px';
      ctx.fillText('TOGETHER WITH OUR FAMILIES', width / 2, 170);

      ctx.font = '400 18px "Playfair Display", serif';
      ctx.fillStyle = '#D1B3BA';
      ctx.fillText('We cordially invite you to celebrate the wedding union of', width / 2, 210);

      // Couple Portrait Frame
      const frameY = 410;
      const radius = 125;

      // Glow behind circle
      const rad = ctx.createRadialGradient(width / 2, frameY, radius * 0.7, width / 2, frameY, radius * 1.3);
      rad.addColorStop(0, 'rgba(212, 175, 55, 0.4)');
      rad.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.fillStyle = rad;
      ctx.beginPath();
      ctx.arc(width / 2, frameY, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Portrait Image
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, frameY, radius, 0, Math.PI * 2);
      ctx.clip();

      const imgToDraw = data.couplePhotoImg || this.defaultCoupleImg;
      if (imgToDraw && imgToDraw.complete) {
        ctx.drawImage(imgToDraw, width / 2 - radius, frameY - radius, radius * 2, radius * 2);
      } else {
        ctx.fillStyle = '#3a0c18';
        ctx.fillRect(width / 2 - radius, frameY - radius, radius * 2, radius * 2);
      }
      ctx.restore();

      // Golden Circular Border & Dots
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(width / 2, frameY, radius + 2, 0, Math.PI * 2);
      ctx.stroke();

      // Couple Names
      ctx.shadowColor = 'rgba(212, 175, 55, 0.85)';
      ctx.shadowBlur = 16;
      ctx.font = '700 52px "Cinzel", "Playfair Display", serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(data.groomName, width / 2, 630);

      ctx.font = 'italic 34px "Playfair Display", serif';
      ctx.fillStyle = '#D4AF37';
      ctx.shadowBlur = 8;
      ctx.fillText('&', width / 2, 685);

      ctx.font = '700 52px "Cinzel", "Playfair Display", serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowBlur = 16;
      ctx.fillText(data.brideName, width / 2, 750);

      ctx.shadowBlur = 0;

      // Parents Dedication
      ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#F3E5AB';
      ctx.fillText(`Son of ${data.groomParents}`, width / 2, 825);

      ctx.fillStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.fillText('—  ✦  —', width / 2, 860);

      ctx.fillStyle = '#F3E5AB';
      ctx.fillText(`Daughter of ${data.brideParents}`, width / 2, 895);

      ctx.restore();
    }

    // -------------------------------------------------------------
    // ACT 3: SAVE THE DATE & AUSPICIOUS MUHURAT (18s - 26s)
    // -------------------------------------------------------------
    drawAct3_Date(t) {
      const { ctx, width, height, data } = this;
      const alpha = this.getSceneAlpha(t, 8);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';

      // Header Tag
      ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#D4AF37';
      ctx.fillText('✦ SAVE THE AUSPICIOUS DATE ✦', width / 2, 280);

      // Large Golden Mandap Arch Frame
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
      ctx.lineWidth = 2;
      ctx.strokeRect(width / 2 - 270, 330, 540, 500);

      ctx.fillStyle = 'rgba(40, 10, 20, 0.65)';
      ctx.fillRect(width / 2 - 265, 335, 530, 490);

      // Wedding Date Big Title
      ctx.shadowColor = 'rgba(212, 175, 55, 0.9)';
      ctx.shadowBlur = 20;
      ctx.font = '700 42px "Cinzel", "Playfair Display", serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('SHUBH VIVAH', width / 2, 430);

      ctx.shadowBlur = 0;
      ctx.font = '600 26px "Playfair Display", serif';
      ctx.fillStyle = '#F3E5AB';
      ctx.fillText(data.weddingDate, width / 2, 510);

      // Golden Line Separator
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 120, 555);
      ctx.lineTo(width / 2 + 120, 555);
      ctx.stroke();

      // Muhurat Time
      ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(data.muhuratTime, width / 2, 610);

      // Destination City
      ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#D1B3BA';
      ctx.fillText(`📍 ${data.city}`, width / 2, 665);

      // Auspicious Shloka Reminder
      ctx.font = 'italic 16px "Playfair Display", serif';
      ctx.fillStyle = '#D4AF37';
      ctx.fillText('“A journey of sacred vows, eternal love and divine union”', width / 2, 740);

      ctx.restore();
    }

    // -------------------------------------------------------------
    // ACT 4: SACRED CEREMONIES TIMELINE (26s - 36s)
    // -------------------------------------------------------------
    drawAct4_Events(t) {
      const { ctx, width, height, data } = this;
      const alpha = this.getSceneAlpha(t, 10);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';

      // Header
      ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#D4AF37';
      ctx.fillText('✦ SACRED CEREMONIES & FESTIVITIES ✦', width / 2, 190);

      ctx.font = '700 36px "Cinzel", "Playfair Display", serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(212, 175, 55, 0.7)';
      ctx.shadowBlur = 14;
      ctx.fillText('Wedding Itinerary', width / 2, 245);
      ctx.shadowBlur = 0;

      // 4 Event Cards with stagger animation
      const events = data.events || [];
      const startY = 320;
      const cardHeight = 115;
      const cardGap = 20;

      events.slice(0, 4).forEach((ev, idx) => {
        const y = startY + idx * (cardHeight + cardGap);
        const cardAlpha = Math.min(1, Math.max(0, (t - idx * 0.4) * 2));

        ctx.save();
        ctx.globalAlpha = alpha * cardAlpha;

        // Card Box
        ctx.fillStyle = 'rgba(45, 12, 24, 0.85)';
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
        ctx.lineWidth = 1.5;
        this.roundRect(ctx, width / 2 - 270, y, 540, cardHeight, 14);
        ctx.fill();
        ctx.stroke();

        // Left Event Emblem
        ctx.fillStyle = '#D4AF37';
        ctx.beginPath();
        ctx.arc(width / 2 - 215, y + cardHeight / 2, 24, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#220710';
        ctx.font = '700 16px "Cinzel", serif';
        ctx.textAlign = 'center';
        ctx.fillText(`0${idx + 1}`, width / 2 - 215, y + cardHeight / 2 + 5);

        // Event Name
        ctx.textAlign = 'left';
        ctx.font = '700 22px "Cinzel", "Playfair Display", serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(ev.name, width / 2 - 165, y + 48);

        // Date & Timing
        ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#F3E5AB';
        ctx.fillText(`📅 ${ev.date}  •  ⏰ ${ev.time}`, width / 2 - 165, y + 82);

        ctx.restore();
      });

      ctx.restore();
    }

    // -------------------------------------------------------------
    // ACT 5: GRAND VENUE & RSVP BLESSINGS (36s - 45s)
    // -------------------------------------------------------------
    drawAct5_Venue(t) {
      const { ctx, width, height, data } = this;
      const alpha = this.getSceneAlpha(t, 9);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';

      // Header Tag
      ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#D4AF37';
      ctx.fillText('✦ CELEBRATION DESTINATION ✦', width / 2, 220);

      // Venue Icon (Palace Arch)
      ctx.font = '48px sans-serif';
      ctx.fillText('🏛️', width / 2, 290);

      // Venue Title
      ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
      ctx.shadowBlur = 14;
      ctx.font = '700 36px "Cinzel", "Playfair Display", serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(data.venueName, width / 2, 370);
      ctx.shadowBlur = 0;

      // Address
      ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#D1B3BA';
      ctx.fillText(data.venueAddress, width / 2, 420);

      // Golden Divider
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 140, 480);
      ctx.lineTo(width / 2 + 140, 480);
      ctx.stroke();

      // Warm Blessing Callout
      ctx.font = 'italic 20px "Playfair Display", serif';
      ctx.fillStyle = '#F3E5AB';
      ctx.fillText('“Awaiting your gracious presence and heartfelt blessings”', width / 2, 550);

      // RSVP Box
      const rsvpY = 640;
      ctx.fillStyle = 'rgba(45, 12, 24, 0.9)';
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
      ctx.lineWidth = 1.5;
      this.roundRect(ctx, width / 2 - 250, rsvpY, 500, 160, 16);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#D4AF37';
      ctx.fillText('RSVP & CORDIAL INVITATION', width / 2, rsvpY + 45);

      ctx.font = '600 22px "Cinzel", serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(data.rsvpName, width / 2, rsvpY + 90);

      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#F3E5AB';
      ctx.fillText(`📞 ${data.rsvpPhone}`, width / 2, rsvpY + 130);

      ctx.restore();
    }

    // -------------------------------------------------------------
    // WATERMARK (Diagonal Vanvi Moments pattern during preview)
    // -------------------------------------------------------------
    drawWatermark() {
      const { ctx, width, height } = this;
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(-Math.PI / 4);

      ctx.font = '800 48px "Cinzel", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '6px';
      ctx.fillText('VANVI MOMENTS PREVIEW', 0, -80);
      ctx.fillText('VANVI MOMENTS PREVIEW', 0, 80);

      ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(212, 175, 55, 0.28)';
      ctx.fillText('UNLOCK HD TO REMOVE WATERMARK', 0, 140);

      ctx.restore();
    }

    // -------------------------------------------------------------
    // UTILITIES
    // -------------------------------------------------------------
    getSceneAlpha(t, duration) {
      const fadeTime = 0.8;
      if (t < fadeTime) return t / fadeTime;
      if (t > duration - fadeTime) return Math.max(0, (duration - t) / fadeTime);
      return 1.0;
    }

    roundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    // -------------------------------------------------------------
    // REAL HD VIDEO RENDERING PIPELINE (Client-Side MP4/WebM Export)
    // -------------------------------------------------------------
    async renderVideo(options = {}, onProgress = null) {
      const originalWatermark = this.watermark;
      this.watermark = false; // Clean export without watermark

      const renderFps = 30;
      const totalFrames = Math.floor(this.duration * renderFps);
      const stream = this.canvas.captureStream(renderFps);

      // Connect audio destination if web audio is running
      if (this.audioCtx) {
        try {
          const dest = this.audioCtx.createMediaStreamDestination();
          // Mix stream tracks
          dest.stream.getAudioTracks().forEach(track => stream.addTrack(track));
        } catch (e) {
          console.warn('[VideoEngine] Audio stream attach error:', e);
        }
      }

      // Check supported mime types
      let mimeType = 'video/webm;codecs=vp9';
      if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
        mimeType = 'video/mp4;codecs=avc1';
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        mimeType = 'video/webm;codecs=vp8';
      }

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 6000000 // 6 Mbps crisp HD quality
      });

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      return new Promise((resolve, reject) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          this.watermark = originalWatermark;
          resolve({ blob, mimeType, extension: mimeType.includes('mp4') ? 'mp4' : 'webm' });
        };

        recorder.onerror = (err) => {
          this.watermark = originalWatermark;
          reject(err);
        };

        recorder.start();

        let frame = 0;
        const renderInterval = setInterval(() => {
          const time = frame / renderFps;
          this.drawFrame(time);
          frame++;

          if (onProgress) {
            onProgress({
              frame,
              totalFrames,
              percent: Math.min(100, Math.round((frame / totalFrames) * 100))
            });
          }

          if (frame >= totalFrames) {
            clearInterval(renderInterval);
            setTimeout(() => {
              recorder.stop();
            }, 300);
          }
        }, 1000 / renderFps);
      });
    }
  }

  root.WeddingVideoEngine = WeddingVideoEngine;

})(typeof window !== 'undefined' ? window : this);
