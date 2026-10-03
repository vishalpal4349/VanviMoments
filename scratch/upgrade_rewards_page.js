const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'rewards.html');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
  <title>Rewards &amp; Offers — Spin, Games &amp; Discounts · Vanvi Moments</title>
  <meta name="description" content="Earn Vanvi Coins with daily fortune spins, micro-games, active discount coupons, and referral bonuses. Redeem coins for up to 40% off celebration moments.">
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="vanvi-inner-light.css">
  <link rel="stylesheet" href="vanvi-navigation.css">

  <style>
    :root {
      --bg-pearl: #fffbfd;
      --bg-blush: #fff1f6;
      --bg-card: rgba(255, 255, 255, 0.94);
      --color-rose: #ff2a7a;
      --color-rose-deep: #e11d68;
      --color-rose-gradient: linear-gradient(135deg, #ff2a7a 0%, #ff529a 50%, #d97706 100%);
      --color-gold: #d97706;
      --color-gold-bright: #f59e0b;
      --color-lilac: #7c3aed;
      --color-lilac-soft: #f5f3ff;
      --color-sky: #0284c7;
      --text-dark: #2c1224;
      --text-muted: #78526d;
      --border-pink: rgba(255, 120, 175, 0.28);
      --border-gold: rgba(217, 119, 6, 0.32);
      --shadow-card: 0 12px 36px rgba(255, 60, 130, 0.08);
      --shadow-hover: 0 18px 42px rgba(255, 42, 122, 0.16);
      --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      --font-serif: 'Playfair Display', Georgia, serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

    body {
      width: 100%;
      min-height: 100vh;
      background: radial-gradient(circle at 50% 0%, #ffeaf3 0%, #fff7fb 45%, #f4efff 100%);
      font-family: var(--font-sans);
      color: var(--text-dark);
      padding-bottom: 110px;
      overflow-x: hidden !important;
    }

    /* Top Sticky Header */
    .rewards-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-pink);
      padding: 10px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 20px rgba(232, 79, 147, 0.05);
      height: 60px;
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: var(--text-dark);
      font-weight: 900;
      font-size: clamp(13px, 3.6vw, 15px);
      cursor: pointer !important;
      white-space: nowrap !important;
    }
    .brand-tag {
      font-size: 9.5px;
      font-weight: 850;
      padding: 2.5px 8px;
      border-radius: 99px;
      background: linear-gradient(135deg, var(--color-rose), var(--color-gold));
      color: #fff;
      letter-spacing: 0.5px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-header-link {
      font-size: 11.5px;
      font-weight: 750;
      color: var(--text-dark);
      text-decoration: none;
      padding: 6px 12px;
      border-radius: 99px;
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid var(--border-pink);
      transition: all 0.2s;
    }
    .btn-header-link:hover { color: var(--color-rose); border-color: var(--color-rose); background: #ffffff; }
    .btn-header-primary {
      font-size: 11.5px;
      font-weight: 800;
      padding: 6.5px 14px;
      border-radius: 99px;
      background: linear-gradient(135deg, var(--color-rose), #9333ea);
      color: #fff;
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(255, 42, 122, 0.28);
      transition: transform 0.2s, filter 0.2s;
    }
    .btn-header-primary:hover { filter: brightness(1.08); transform: translateY(-1px); }

    .lang-toggle {
      font-size: 11.5px;
      font-weight: 800;
      padding: 6px 12px;
      border-radius: 99px;
      background: #ffffff;
      border: 1.5px solid var(--border-pink);
      color: var(--color-rose);
      cursor: pointer;
      transition: all 0.2s;
    }
    .lang-toggle:hover {
      background: var(--color-rose);
      color: #ffffff;
    }

    /* Container */
    .rewards-container {
      max-width: 720px;
      margin: 0 auto;
      padding: 16px 16px 40px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* 1. Hero Balance Card */
    .coin-hero-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 240, 248, 0.94) 50%, rgba(240, 249, 255, 0.98) 100%);
      border: 1.5px solid rgba(255, 120, 175, 0.35);
      border-radius: 28px;
      padding: 24px 20px;
      box-shadow: 0 14px 40px rgba(255, 56, 128, 0.1), 0 4px 16px rgba(14, 165, 233, 0.06);
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .coin-hero-card::before {
      content: "";
      position: absolute;
      top: -30px;
      right: -30px;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 56, 128, 0.18), transparent 70%);
      pointer-events: none;
    }

    .coin-kicker {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: var(--color-rose);
      margin-bottom: 6px;
    }

    .coin-value-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 6px;
    }
    .coin-big-amount {
      font-size: clamp(38px, 9vw, 54px);
      font-weight: 900;
      letter-spacing: -1.5px;
      line-height: 1;
      background: linear-gradient(135deg, #d97706 0%, #ff2a7a 50%, #7c3aed 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .coin-icon-orb {
      font-size: 34px;
      animation: coinPulse 2.4s ease-in-out infinite alternate;
    }
    @keyframes coinPulse {
      0% { transform: scale(1) rotate(0deg); }
      100% { transform: scale(1.1) rotate(6deg); }
    }

    .coin-tagline {
      font-size: 13.5px;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    .coin-rate-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 99px;
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(217, 119, 6, 0.35);
      color: #92400e;
      font-size: 12px;
      font-weight: 750;
      margin-bottom: 14px;
    }

    .hero-btn-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .hero-cta-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 22px;
      min-height: 44px;
      border-radius: 99px;
      background: var(--color-rose-gradient);
      color: #ffffff;
      font-size: 13.5px;
      font-weight: 800;
      text-decoration: none;
      box-shadow: 0 6px 20px rgba(255, 56, 128, 0.3);
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }
    .hero-cta-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 26px rgba(255, 56, 128, 0.38);
    }
    .hero-cta-btn.secondary {
      background: #ffffff;
      color: var(--text-dark);
      border: 1.2px solid var(--border-pink);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
    }

    /* 2. Quick Access Hub (4 Tactile Shortcut Cards) */
    .rewards-quick-hub {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }
    .quick-hub-pill {
      background: rgba(255, 255, 255, 0.95);
      border: 1.5px solid var(--border-pink);
      border-radius: 18px;
      padding: 12px 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 5px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 14px rgba(255, 42, 122, 0.06);
    }
    .quick-hub-pill:hover {
      transform: translateY(-2px);
      border-color: var(--color-rose);
      box-shadow: 0 8px 20px rgba(255, 42, 122, 0.16);
    }
    .quick-hub-pill.active {
      background: linear-gradient(135deg, #fff0f6 0%, #fff7ed 100%);
      border-color: var(--color-rose);
      box-shadow: 0 4px 16px rgba(255, 42, 122, 0.18);
    }
    .hub-pill-icon {
      font-size: 22px;
      line-height: 1;
    }
    .hub-pill-text strong {
      display: block;
      font-size: 12px;
      font-weight: 850;
      color: var(--text-dark);
      line-height: 1.15;
    }
    .hub-pill-text small {
      display: block;
      font-size: 9.5px;
      font-weight: 750;
      color: var(--color-rose);
      margin-top: 2px;
    }

    /* 3. Interactive Navigation Tabs (Horizontal Scrollable on Mobile) */
    .rewards-nav-tabs-wrapper {
      position: sticky;
      top: 60px;
      z-index: 95;
      background: rgba(255, 251, 253, 0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      padding: 4px 0;
    }
    .rewards-nav-tabs {
      display: flex;
      gap: 6px;
      background: rgba(255, 255, 255, 0.92);
      padding: 6px;
      border-radius: 99px;
      border: 1.5px solid var(--border-pink);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }
    .rewards-nav-tabs::-webkit-scrollbar { display: none; }

    .nav-tab-btn {
      flex: 1;
      white-space: nowrap;
      text-align: center;
      padding: 10px 14px;
      min-height: 42px;
      border-radius: 99px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      font-size: 12.5px;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .nav-tab-btn.active {
      background: #ffffff;
      color: var(--color-rose);
      box-shadow: 0 4px 14px rgba(255, 42, 122, 0.16);
      border: 1px solid var(--border-pink);
    }

    /* Tab Panes */
    .tab-content-pane {
      display: none;
      flex-direction: column;
      gap: 18px;
    }
    .tab-content-pane.active {
      display: flex;
    }

    /* TAB 1: DAILY WHEEL & LUCKY MOMENT */
    .wheel-card-section {
      background: rgba(255, 255, 255, 0.94);
      border: 1.5px solid var(--border-pink);
      border-radius: 28px;
      padding: 24px 18px;
      box-shadow: var(--shadow-card);
      text-align: center;
      position: relative;
    }
    .wheel-stage {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 12px 0 18px;
      position: relative;
    }
    .wheel-outer-ring {
      position: relative;
      width: 250px;
      height: 250px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .wheel-pointer {
      position: absolute;
      top: -12px;
      z-index: 30;
      filter: drop-shadow(0 3px 5px rgba(0,0,0,0.25));
      pointer-events: none;
    }
    .wheel-pointer svg {
      width: 24px;
      height: 30px;
      display: block;
    }
    .wheel-disc-frame {
      width: 230px;
      height: 230px;
      border-radius: 50%;
      padding: 6px;
      box-sizing: border-box;
      background: radial-gradient(circle, #ffe494 0%, #f59e0b 60%, #b45309 100%);
      box-shadow: 0 10px 28px rgba(217, 119, 6, 0.28), inset 0 2px 3px #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .wheel-disc {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      position: relative;
      overflow: hidden;
      background: conic-gradient(
        #ff3880 0deg 25.7deg,
        #f59e0b 25.7deg 51.4deg,
        #38bdf8 51.4deg 77.1deg,
        #8b5cf6 77.1deg 102.8deg,
        #ec4899 102.8deg 128.5deg,
        #10b981 128.5deg 154.2deg,
        #f97316 154.2deg 180.0deg,
        #06b6d4 180.0deg 205.7deg,
        #a855f7 205.7deg 231.4deg,
        #fb7185 231.4deg 257.1deg,
        #6366f1 257.1deg 282.8deg,
        #eab308 282.8deg 308.5deg,
        #14b8a6 308.5deg 334.2deg,
        #ff3880 334.2deg 360.0deg
      );
      transition: transform 4.5s cubic-bezier(0.12, 0.9, 0.28, 1);
      will-change: transform;
    }
    .wheel-slice {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      pointer-events: none;
    }
    .slice-label {
      margin-top: 10px;
      font-size: 10px;
      font-weight: 900;
      color: #ffffff;
      text-shadow: 0 1px 3px rgba(0,0,0,0.8);
    }
    .wheel-center-hub {
      position: absolute;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: radial-gradient(circle, #ffffff 10%, #ffd97d 60%, #c47c12 100%);
      border: 3.5px solid #ffffff;
      box-shadow: 0 4px 18px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 25;
      user-select: none;
      transition: transform 0.2s;
    }
    .wheel-center-hub:hover:not(.disabled) { transform: scale(1.08); }
    .wheel-center-hub.disabled { opacity: 0.7; cursor: not-allowed; }
    .hub-txt { font-size: 12px; font-weight: 900; color: #78350f; }

    .wheel-status-bar {
      margin-top: 12px;
      padding: 10px 14px;
      border-radius: 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 12px;
      color: var(--text-muted);
    }
    .status-countdown {
      font-weight: 800;
      color: var(--color-rose);
      font-family: monospace;
      font-size: 13px;
    }

    .lucky-moment-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(254, 243, 199, 0.65) 50%, rgba(255, 240, 248, 0.96) 100%);
      border: 1.5px solid rgba(217, 119, 6, 0.35);
      border-radius: 24px;
      padding: 20px;
      box-shadow: 0 8px 28px rgba(217, 119, 6, 0.1);
      position: relative;
    }
    .lucky-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
    .lucky-title {
      font-weight: 800;
      font-size: 15px;
      color: #78350f;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .lucky-cycle-badge {
      font-size: 11px;
      font-weight: 800;
      padding: 3px 10px;
      border-radius: 99px;
      background: #ffffff;
      border: 1px solid rgba(217, 119, 6, 0.3);
      color: #b45309;
    }
    .lucky-desc {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 14px;
    }
    .lucky-action-box {
      background: #ffffff;
      border-radius: 16px;
      padding: 14px 16px;
      border: 1px solid rgba(217, 119, 6, 0.25);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .btn-claim-lucky {
      padding: 10px 20px;
      min-height: 42px;
      border-radius: 99px;
      background: linear-gradient(135deg, #d97706, #ff2a7a);
      color: #ffffff;
      font-size: 13px;
      font-weight: 800;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(217, 119, 6, 0.25);
      transition: all 0.2s;
    }
    .btn-claim-lucky:hover:not(:disabled) { transform: translateY(-2px); }
    .btn-claim-lucky:disabled { opacity: 0.6; cursor: not-allowed; }

    /* TAB 2: PLAY & EARN GAMES HUB */
    .games-reward-section {
      background: rgba(255, 255, 255, 0.94);
      border: 1.5px solid var(--border-pink);
      border-radius: 28px;
      padding: 24px 20px;
      box-shadow: var(--shadow-card);
    }
    .games-reward-head {
      text-align: center;
      margin-bottom: 20px;
    }
    .games-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    @media (max-width: 480px) {
      .games-grid {
        grid-template-columns: 1fr;
      }
    }
    .game-card-reward {
      background: linear-gradient(135deg, #ffffff 0%, #fff6fa 100%);
      border: 1.2px solid rgba(255, 120, 175, 0.3);
      border-radius: 20px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 12px;
      transition: all 0.22s ease;
      box-shadow: 0 4px 14px rgba(255, 42, 122, 0.05);
      text-decoration: none;
      color: inherit;
    }
    .game-card-reward:hover {
      transform: translateY(-3px);
      border-color: var(--color-rose);
      box-shadow: 0 8px 24px rgba(255, 42, 122, 0.16);
    }
    .game-card-top {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .game-icon-box {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      background: linear-gradient(135deg, #ffeff5 0%, #ffe4ec 100%);
      border: 1px solid rgba(255, 120, 175, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
      box-shadow: 0 4px 10px rgba(255, 42, 122, 0.08);
    }
    .game-meta { flex: 1; min-width: 0; }
    .game-reward-title {
      font-size: 14px;
      font-weight: 850;
      color: var(--text-dark);
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .game-reward-desc {
      font-size: 11.5px;
      color: var(--text-muted);
      line-height: 1.35;
    }
    .game-card-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding-top: 8px;
      border-top: 1px dashed rgba(255, 120, 175, 0.25);
    }
    .game-coin-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 850;
      color: #92400e;
      background: #fef3c7;
      padding: 3px 8px;
      border-radius: 99px;
      border: 1px solid #fde68a;
    }
    .btn-play-game {
      font-size: 11.5px;
      font-weight: 800;
      padding: 6px 14px;
      border-radius: 99px;
      background: var(--color-rose-gradient);
      color: #ffffff;
      border: none;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .game-card-reward:hover .btn-play-game {
      transform: scale(1.05);
    }

    .arcade-full-banner {
      background: linear-gradient(135deg, #2b0b2e 0%, #4a154b 60%, #1f0822 100%);
      border-radius: 20px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      color: #ffffff;
      margin-top: 14px;
    }
    .arcade-banner-btn {
      padding: 8px 18px;
      border-radius: 99px;
      background: linear-gradient(135deg, #ff2a7a, #f59e0b);
      color: #ffffff;
      font-size: 12px;
      font-weight: 800;
      text-decoration: none;
      white-space: nowrap;
    }

    /* TAB 3: COUPONS & DISCOUNT CALCULATOR */
    .coupons-section {
      background: #ffffff;
      border: 1.5px solid var(--border-pink);
      border-radius: 28px;
      padding: 24px 20px;
      box-shadow: var(--shadow-card);
    }
    .coupon-card {
      background: #fff;
      border-radius: 18px;
      padding: 14px 16px;
      border: 1px solid var(--border-pink);
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
      position: relative;
    }
    .coupon-badge-box {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: #fff0f5;
      border: 1px dashed var(--color-rose);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--color-rose);
      flex-shrink: 0;
    }
    .coupon-pct { font-size: 16px; font-weight: 850; line-height: 1; }
    .coupon-off { font-size: 8.5px; font-weight: 800; }
    .coupon-info { flex: 1; min-width: 0; }
    .coupon-title { font-weight: 850; font-size: 13.5px; color: var(--text-dark); margin-bottom: 2px; }
    .coupon-desc { font-size: 11.5px; color: var(--text-muted); margin-bottom: 4px; }
    .code-tag {
      background: #fdf2f8;
      border: 1px solid #fbcfe8;
      color: var(--color-rose);
      font-weight: 850;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }
    .btn-use {
      padding: 8px 16px;
      min-height: 40px;
      border-radius: 10px;
      border: none;
      background: var(--color-rose-gradient);
      color: #fff;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      white-space: nowrap;
    }

    /* Coin Discount Calculator Box */
    .coin-calc-card {
      background: linear-gradient(135deg, #fffbeb 0%, #fff1f6 100%);
      border: 1.5px dashed rgba(217, 119, 6, 0.4);
      border-radius: 20px;
      padding: 16px 18px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .coin-calc-title {
      font-size: 13.5px;
      font-weight: 850;
      color: #78350f;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 3px;
    }
    .coin-calc-desc {
      font-size: 12px;
      color: #92400e;
    }
    .btn-redeem-coins {
      padding: 8px 16px;
      border-radius: 99px;
      background: linear-gradient(135deg, #d97706, #ff2a7a);
      color: #ffffff;
      font-size: 12px;
      font-weight: 800;
      text-decoration: none;
      white-space: nowrap;
    }

    /* Rules Card */
    .rules-card {
      background: #ffffff;
      border: 1px solid var(--border-pink);
      border-radius: 24px;
      padding: 20px;
    }
    .rules-card h3 {
      font-size: 14.5px;
      font-weight: 800;
      color: var(--text-dark);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .rules-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.5;
    }
    .rules-list li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .rules-list li::before {
      content: "•";
      color: var(--color-rose);
      font-weight: bold;
      font-size: 14px;
    }

    /* TAB 4: REFER & EARN */
    .referral-section {
      background: rgba(255, 255, 255, 0.94);
      border: 1.5px solid var(--border-pink);
      border-radius: 28px;
      padding: 24px 20px;
      box-shadow: var(--shadow-card);
    }
    .referral-head {
      text-align: center;
      margin-bottom: 22px;
    }
    .referral-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 42, 122, 0.1);
      border: 1px solid rgba(255, 42, 122, 0.25);
      color: var(--color-rose);
      padding: 5px 14px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .referral-head h2 {
      font-family: var(--font-serif);
      font-size: clamp(22px, 5vw, 28px);
      color: var(--text-dark);
      margin-bottom: 6px;
    }
    .referral-head p {
      font-size: 13.5px;
      color: var(--text-muted);
      line-height: 1.55;
      max-width: 520px;
      margin: 0 auto;
    }

    .steps-flow-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      margin-bottom: 22px;
    }
    @media (min-width: 540px) {
      .steps-flow-grid { grid-template-columns: 1fr 1fr; }
    }
    .step-card {
      background: linear-gradient(135deg, #fffbfd 0%, #fff4f8 100%);
      border: 1px solid rgba(255, 120, 175, 0.28);
      border-radius: 20px;
      padding: 16px 14px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      transition: transform 0.2s;
    }
    .step-card:hover {
      transform: translateY(-2px);
      border-color: var(--color-rose);
      box-shadow: 0 8px 20px rgba(255, 42, 122, 0.08);
    }
    .step-icon-box {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: #ffffff;
      border: 1px solid rgba(255, 120, 175, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
      box-shadow: 0 4px 10px rgba(255, 42, 122, 0.06);
    }
    .step-content h3 {
      font-size: 13.5px;
      font-weight: 800;
      color: var(--text-dark);
      margin-bottom: 3px;
    }
    .step-content p {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.45;
    }
    .step-bonus-pill {
      display: inline-block;
      font-size: 10px;
      font-weight: 800;
      color: #059669;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      padding: 2px 7px;
      border-radius: 6px;
      margin-top: 4px;
    }

    .referral-code-box {
      background: linear-gradient(135deg, #fffaf3 0%, #fff1f6 50%, #f9f5ff 100%);
      border: 2px dashed rgba(217, 119, 6, 0.4);
      border-radius: 24px;
      padding: 20px 18px;
      text-align: center;
      margin-bottom: 22px;
    }
    .code-box-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--color-gold);
      margin-bottom: 4px;
    }
    .code-box-sub {
      font-size: 12.5px;
      color: var(--text-muted);
      margin-bottom: 14px;
    }
    .code-display-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: #ffffff;
      border: 1.5px solid var(--border-pink);
      border-radius: 16px;
      padding: 12px 18px;
      max-width: 380px;
      margin: 0 auto 16px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
    }
    .code-text {
      font-family: monospace;
      font-size: clamp(18px, 5vw, 24px);
      font-weight: 900;
      letter-spacing: 2px;
      color: var(--color-rose-deep);
      user-select: all;
    }
    .btn-copy-code {
      padding: 8px 16px;
      min-height: 40px;
      border-radius: 10px;
      background: var(--color-rose-gradient);
      color: #ffffff;
      font-size: 12.5px;
      font-weight: 800;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .btn-copy-code:hover { transform: translateY(-1px); }

    .referral-share-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .btn-share-whatsapp {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 22px;
      min-height: 46px;
      border-radius: 99px;
      background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
      color: #ffffff;
      font-size: 13.5px;
      font-weight: 800;
      text-decoration: none;
      box-shadow: 0 6px 18px rgba(37, 211, 102, 0.35);
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-share-whatsapp:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(37, 211, 102, 0.45);
    }
    .btn-share-more {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px 20px;
      min-height: 46px;
      border-radius: 99px;
      background: #ffffff;
      border: 1.5px solid var(--border-pink);
      color: var(--text-dark);
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.2s;
    }

    .referral-stats-strip {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-top: 10px;
    }
    .stat-pill-card {
      background: #ffffff;
      border: 1px solid var(--border-pink);
      border-radius: 18px;
      padding: 14px 10px;
      text-align: center;
    }
    .stat-pill-num {
      font-size: clamp(18px, 4vw, 24px);
      font-weight: 900;
      color: var(--color-rose);
      line-height: 1;
      margin-bottom: 4px;
    }
    .stat-pill-lbl {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
    }

    /* History Activity Strip */
    .history-card {
      background: #ffffff;
      border: 1px solid var(--border-pink);
      border-radius: 24px;
      padding: 20px;
    }
    .history-head {
      font-size: 14px;
      font-weight: 800;
      color: var(--text-dark);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .history-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .history-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: #fffbfd;
      border-radius: 14px;
      border: 1px solid rgba(255, 120, 175, 0.2);
      font-size: 12px;
    }
    .history-title { font-weight: 700; color: var(--text-dark); }
    .history-coins { font-weight: 800; color: #059669; }
    .history-coins.zero { color: var(--color-rose); }

    /* Modal Result Overlay */
    .reward-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(44, 18, 36, 0.65);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 300;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .reward-modal-backdrop.active {
      opacity: 1;
      pointer-events: auto;
    }
    .reward-modal-box {
      background: #ffffff;
      border: 1.5px solid var(--border-pink);
      border-radius: 28px;
      padding: 30px 24px;
      max-width: 400px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0,0,0,0.2);
      transform: scale(0.92);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .reward-modal-backdrop.active .reward-modal-box { transform: scale(1); }
    .modal-emoji-badge {
      width: 64px;
      height: 64px;
      border-radius: 20px;
      margin: 0 auto 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      background: linear-gradient(135deg, #ff3880 0%, #a855f7 100%);
      color: #fff;
      box-shadow: 0 8px 24px rgba(255, 56, 128, 0.3);
    }
    .modal-amount {
      font-size: 32px;
      font-weight: 900;
      color: #d97706;
      margin-bottom: 8px;
    }
    .modal-msg {
      font-size: 13.5px;
      color: var(--text-muted);
      line-height: 1.55;
      margin-bottom: 20px;
    }

    /* Toast Notification */
    .toast-pill {
      position: fixed;
      top: 70px;
      left: 50%;
      transform: translateX(-50%) translateY(-20px);
      background: rgba(44, 18, 36, 0.92);
      backdrop-filter: blur(8px);
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      padding: 10px 20px;
      border-radius: 99px;
      pointer-events: none;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 400;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
    .toast-pill.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    /* ==========================================================================
       DARK THEME LUMINOUS POLISH (100% VISIBILITY & CONTRAST)
       ========================================================================== */
    html[data-vanvi-theme="dark"] body {
      background: radial-gradient(circle at 50% 0%, #200824 0%, #110318 45%, #08010d 100%) !important;
      color: #fce7f3 !important;
    }
    html[data-vanvi-theme="dark"] .rewards-header {
      background: rgba(18, 5, 24, 0.94) !important;
      border-bottom-color: rgba(255, 120, 175, 0.2) !important;
    }
    html[data-vanvi-theme="dark"] .brand-link { color: #ffffff !important; }
    html[data-vanvi-theme="dark"] .btn-header-link {
      background: rgba(255, 255, 255, 0.08) !important;
      border-color: rgba(255, 120, 175, 0.25) !important;
      color: #ffffff !important;
    }
    html[data-vanvi-theme="dark"] .lang-toggle {
      background: rgba(255, 255, 255, 0.08) !important;
      border-color: rgba(255, 120, 175, 0.3) !important;
      color: #ff78af !important;
    }
    html[data-vanvi-theme="dark"] .coin-hero-card,
    html[data-vanvi-theme="dark"] .referral-section,
    html[data-vanvi-theme="dark"] .wheel-card-section,
    html[data-vanvi-theme="dark"] .lucky-moment-card,
    html[data-vanvi-theme="dark"] .games-reward-section,
    html[data-vanvi-theme="dark"] .coupons-section,
    html[data-vanvi-theme="dark"] .rules-card,
    html[data-vanvi-theme="dark"] .history-card {
      background: rgba(26, 9, 34, 0.92) !important;
      border-color: rgba(255, 120, 175, 0.24) !important;
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.5) !important;
    }
    html[data-vanvi-theme="dark"] .quick-hub-pill {
      background: rgba(36, 14, 46, 0.9) !important;
      border-color: rgba(255, 120, 175, 0.22) !important;
    }
    html[data-vanvi-theme="dark"] .quick-hub-pill.active {
      background: linear-gradient(135deg, rgba(255, 42, 122, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%) !important;
      border-color: var(--color-rose) !important;
    }
    html[data-vanvi-theme="dark"] .rewards-nav-tabs-wrapper {
      background: rgba(12, 3, 16, 0.92) !important;
    }
    html[data-vanvi-theme="dark"] .rewards-nav-tabs {
      background: rgba(26, 9, 34, 0.92) !important;
      border-color: rgba(255, 120, 175, 0.24) !important;
    }
    html[data-vanvi-theme="dark"] .nav-tab-btn {
      color: #c084fc !important;
    }
    html[data-vanvi-theme="dark"] .nav-tab-btn.active {
      background: #3b1442 !important;
      color: #ffffff !important;
      border-color: var(--color-rose) !important;
    }
    html[data-vanvi-theme="dark"] h1,
    html[data-vanvi-theme="dark"] h2,
    html[data-vanvi-theme="dark"] h3,
    html[data-vanvi-theme="dark"] strong,
    html[data-vanvi-theme="dark"] .hub-pill-text strong,
    html[data-vanvi-theme="dark"] .game-reward-title,
    html[data-vanvi-theme="dark"] .coupon-title,
    html[data-vanvi-theme="dark"] .lucky-title,
    html[data-vanvi-theme="dark"] .history-title,
    html[data-vanvi-theme="dark"] .coin-calc-title {
      color: #ffffff !important;
    }
    html[data-vanvi-theme="dark"] p,
    html[data-vanvi-theme="dark"] .coin-tagline,
    html[data-vanvi-theme="dark"] .game-reward-desc,
    html[data-vanvi-theme="dark"] .coupon-desc,
    html[data-vanvi-theme="dark"] .rules-list,
    html[data-vanvi-theme="dark"] .lucky-desc,
    html[data-vanvi-theme="dark"] .stat-pill-lbl,
    html[data-vanvi-theme="dark"] .coin-calc-desc {
      color: #f1cfe8 !important;
    }
    html[data-vanvi-theme="dark"] .hero-cta-btn.secondary,
    html[data-vanvi-theme="dark"] .btn-share-more,
    html[data-vanvi-theme="dark"] .stat-pill-card,
    html[data-vanvi-theme="dark"] .code-display-row,
    html[data-vanvi-theme="dark"] .lucky-action-box,
    html[data-vanvi-theme="dark"] .history-item {
      background: rgba(38, 14, 48, 0.85) !important;
      border-color: rgba(255, 120, 175, 0.2) !important;
      color: #ffffff !important;
    }
    html[data-vanvi-theme="dark"] .game-card-reward {
      background: linear-gradient(135deg, rgba(38, 14, 48, 0.9) 0%, rgba(26, 9, 34, 0.95) 100%) !important;
      border-color: rgba(255, 120, 175, 0.22) !important;
    }
    html[data-vanvi-theme="dark"] .coupon-card {
      background: rgba(38, 14, 48, 0.9) !important;
      border-color: rgba(255, 120, 175, 0.22) !important;
    }
    html[data-vanvi-theme="dark"] .wheel-status-bar {
      background: rgba(38, 14, 48, 0.9) !important;
      border-color: rgba(255, 120, 175, 0.2) !important;
      color: #f1cfe8 !important;
    }
    html[data-vanvi-theme="dark"] .reward-modal-box {
      background: #1e0926 !important;
      border-color: var(--color-rose) !important;
    }
    html[data-vanvi-theme="dark"] .reward-modal-box h3 {
      color: #ffffff !important;
    }
    html[data-vanvi-theme="dark"] .coin-rate-pill {
      background: rgba(38, 14, 48, 0.9) !important;
      border-color: rgba(217, 119, 6, 0.4) !important;
      color: #fcd34d !important;
    }
    html[data-vanvi-theme="dark"] .coin-calc-card {
      background: linear-gradient(135deg, rgba(50, 24, 15, 0.6) 0%, rgba(38, 14, 48, 0.8) 100%) !important;
      border-color: rgba(245, 158, 11, 0.4) !important;
    }
  </style>
</head>
<body class="has-vanvi-dock" data-vanvi-active="rewards">

  <!-- Top Header -->
  <header class="rewards-header">
    <a href="index.html" class="brand-link" title="Vanvi Moments">
      <svg class="brand-spark" fill="none" viewBox="0 0 26 26" style="width:22px; height:22px; flex-shrink:0;">
        <defs>
          <linearGradient id="navSpark" x1="0%" x2="100%" y1="0%" x2="100%">
            <stop offset="0%" stop-color="#ff2a7a"/>
            <stop offset="50%" stop-color="#ff7ea5"/>
            <stop offset="100%" stop-color="#d97706"/>
          </linearGradient>
        </defs>
        <path d="M13 2 C13 7.8 15.2 10 21 13 C15.2 16 13 18.2 13 24 C13 18.2 10.8 16 5 13 C10.8 10 13 7.8 13 2 Z" fill="url(#navSpark)"/>
        <circle cx="13" cy="13" fill="#ffffff" r="2.8"/>
        <circle cx="13" cy="13" fill="#ff2a7a" r="1.5"/>
      </svg>
      <span>VANVI <span style="color:var(--color-rose);">♡</span> MOMENTS</span>
      <span class="brand-tag">REWARDS</span>
    </a>

    <div class="header-actions">
      <button type="button" class="lang-toggle" onclick="window.VanviI18n && window.VanviI18n.toggle()">🌐 EN / HI</button>
      <a href="templates.html" class="btn-header-link mobile-hide" title="Templates">Templates</a>
      <a href="games.html" class="btn-header-link mobile-hide" title="Mini Games">🎮 Games</a>
      <a href="plans.html" class="btn-header-primary" title="VIP Plans">💎 VIP Plans</a>
    </div>
  </header>

  <!-- Breadcrumbs Bar -->
  <div class="breadcrumb-bar" style="max-width: 720px; margin: 12px auto 0; padding: 0 16px; display: flex; align-items: center; justify-content: space-between;">
    <a class="vanvi-btn-back" href="javascript:void(0)" onclick="if (history.length > 1) { history.back(); } else { location.href='index.html'; }" title="Go Back">
      <span class="back-arrow">‹</span> <span>Back</span>
    </a>
    <div class="breadcrumb-trail" style="font-size:11.5px; font-weight:700; color:var(--text-muted);">
      <a href="index.html" style="color:var(--text-muted); text-decoration:none;">Home</a> / <span style="color:var(--color-rose);">Rewards, Games &amp; Offers</span>
    </div>
  </div>

  <!-- Main Container -->
  <main class="rewards-container">

    <!-- 1. Coin Balance Hero Card -->
    <div class="coin-hero-card">
      <div class="coin-kicker">Your Celebration Balance</div>
      <div class="coin-value-row">
        <span class="coin-big-amount" id="displayCoinBalance">150</span>
        <span class="coin-icon-orb">🪙</span>
      </div>
      <div class="coin-tagline">“Spin daily, play micro-games &amp; unlock real celebration discounts.”</div>
      <div>
        <span class="coin-rate-pill">Exchange Value: 10 Coins = ₹1.00 · Up to 40% Off Any Template</span>
      </div>
      <div class="hero-btn-row">
        <button type="button" class="hero-cta-btn" onclick="switchRewardTab('wheel')">🎡 Spin Wheel Now</button>
        <button type="button" class="hero-cta-btn secondary" onclick="switchRewardTab('games')">🎮 Play &amp; Earn Games</button>
      </div>
    </div>

    <!-- 2. Quick Access Hub (4 Tactile Action Badges) -->
    <div class="rewards-quick-hub" aria-label="Quick Reward Actions">
      <div class="quick-hub-pill active" onclick="switchRewardTab('wheel')">
        <span class="hub-pill-icon">🎡</span>
        <div class="hub-pill-text">
          <strong>Daily Spin</strong>
          <small>Up to 80 🪙</small>
        </div>
      </div>
      <div class="quick-hub-pill" onclick="switchRewardTab('games')">
        <span class="hub-pill-icon">🎮</span>
        <div class="hub-pill-text">
          <strong>Mini Games</strong>
          <small>Earn VCoins</small>
        </div>
      </div>
      <div class="quick-hub-pill" onclick="switchRewardTab('coupons')">
        <span class="hub-pill-icon">🏷️</span>
        <div class="hub-pill-text">
          <strong>Discounts</strong>
          <small>40% OFF</small>
        </div>
      </div>
      <div class="quick-hub-pill" onclick="switchRewardTab('referral')">
        <span class="hub-pill-icon">🎁</span>
        <div class="hub-pill-text">
          <strong>Refer &amp; Earn</strong>
          <small>+100 🪙 Bonus</small>
        </div>
      </div>
    </div>

    <!-- 3. Navigation Tabs -->
    <div class="rewards-nav-tabs-wrapper">
      <nav class="rewards-nav-tabs" aria-label="Rewards Sections">
        <button type="button" class="nav-tab-btn active" id="tabBtnWheel" onclick="switchRewardTab('wheel')">
          🎡 Daily Spin
        </button>
        <button type="button" class="nav-tab-btn" id="tabBtnGames" onclick="switchRewardTab('games')">
          🎮 Play &amp; Earn
        </button>
        <button type="button" class="nav-tab-btn" id="tabBtnCoupons" onclick="switchRewardTab('coupons')">
          🏷️ Offers &amp; Deals
        </button>
        <button type="button" class="nav-tab-btn" id="tabBtnReferral" onclick="switchRewardTab('referral')">
          🎁 Refer Friends
        </button>
      </nav>
    </div>

    <!-- TAB 1: DAILY WHEEL & LUCKY MOMENT -->
    <div class="tab-content-pane active" id="tabPaneWheel">
      <!-- Daily Fortune Wheel -->
      <div class="wheel-card-section">
        <div class="wheel-section-head">
          <div class="coin-kicker">Daily Little Surprise</div>
          <h2 style="font-family:var(--font-serif); font-size:24px; color:var(--text-dark); margin-bottom:4px;">Daily Reward Fortune Wheel</h2>
          <p style="font-size:13px; color:var(--text-muted); margin-bottom:14px;">Spin once every 24 hours to win up to 80 celebration coins or a warm blessing!</p>
        </div>

        <div class="wheel-stage">
          <div class="wheel-outer-ring">
            <div class="wheel-pointer">
              <svg viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 28 L2 8 C1 6 2.5 3 5 3 L19 3 C21.5 3 23 6 22 8 Z" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
                <circle cx="12" cy="10" r="3" fill="#ffffff"/>
              </svg>
            </div>

            <div class="wheel-disc-frame">
              <div class="wheel-disc" id="rewardWheelDisc">
                <div class="wheel-slice" style="transform: rotate(12.85deg);"><span class="slice-label">0</span></div>
                <div class="wheel-slice" style="transform: rotate(38.57deg);"><span class="slice-label">3</span></div>
                <div class="wheel-slice" style="transform: rotate(64.28deg);"><span class="slice-label">5</span></div>
                <div class="wheel-slice" style="transform: rotate(90.00deg);"><span class="slice-label">6</span></div>
                <div class="wheel-slice" style="transform: rotate(115.71deg);"><span class="slice-label">9</span></div>
                <div class="wheel-slice" style="transform: rotate(141.42deg);"><span class="slice-label">10</span></div>
                <div class="wheel-slice" style="transform: rotate(167.14deg);"><span class="slice-label">15</span></div>
                <div class="wheel-slice" style="transform: rotate(192.85deg);"><span class="slice-label">20</span></div>
                <div class="wheel-slice" style="transform: rotate(218.57deg);"><span class="slice-label">25</span></div>
                <div class="wheel-slice" style="transform: rotate(244.28deg);"><span class="slice-label">30</span></div>
                <div class="wheel-slice" style="transform: rotate(270.00deg);"><span class="slice-label">40</span></div>
                <div class="wheel-slice" style="transform: rotate(295.71deg);"><span class="slice-label">50</span></div>
                <div class="wheel-slice" style="transform: rotate(321.42deg);"><span class="slice-label">60</span></div>
                <div class="wheel-slice" style="transform: rotate(347.14deg);"><span class="slice-label" style="color:#fef08a;">👑 80</span></div>
              </div>

              <div class="wheel-center-hub" id="hubSpinBtn">
                <span class="hub-txt" id="hubLabel">SPIN</span>
              </div>
            </div>
          </div>
        </div>

        <div class="wheel-status-bar" id="wheelStatusBar">
          <span id="spinStatusText">✨ 1 Free Daily Spin Available</span>
          <span class="status-countdown" id="spinCountdown" style="display:none;">24:00:00</span>
        </div>
      </div>

      <!-- 14-Day Lucky Moment -->
      <div class="lucky-moment-card">
        <div class="lucky-head">
          <div class="lucky-title"><span>✨</span> Special 14-Day Lucky Moment</div>
          <span class="lucky-cycle-badge">Bi-Weekly Bonus</span>
        </div>
        <p class="lucky-desc">
          A special surprise for loyal creators! Unlock a guaranteed celebration bonus of 20 to 60 coins every 14 days.
        </p>
        <div class="lucky-action-box">
          <div>
            <div style="font-size:12px; font-weight:700; color:#92400e;" id="luckyStatusTitle">Next Lucky Moment:</div>
            <span style="font-size:13.5px; font-weight:800; color:var(--color-rose); display:block; margin-top:2px;" id="luckyCountdown">Calculating countdown…</span>
          </div>
          <button type="button" class="btn-claim-lucky" id="btnClaimLucky" disabled>Claim Lucky Moment ✨</button>
        </div>
      </div>
    </div>

    <!-- TAB 2: PLAY & EARN GAMES -->
    <div class="tab-content-pane" id="tabPaneGames">
      <div class="games-reward-section">
        <div class="games-reward-head">
          <div class="coin-kicker">Play &amp; Earn VCoins</div>
          <h2 style="font-family:var(--font-serif); font-size:24px; color:var(--text-dark); margin-bottom:4px;">Micro Arcade Challenges</h2>
          <p style="font-size:13px; color:var(--text-muted);">Play fast casual games, beat high scores, and claim instant coins added directly to your wallet!</p>
        </div>

        <div class="games-grid">
          <!-- Game 1: Risk Run -->
          <a href="risk-run.html" class="game-card-reward" title="Play Risk Run">
            <div class="game-card-top">
              <div class="game-icon-box">🏃‍♂️</div>
              <div class="game-meta">
                <div class="game-reward-title">Risk Run</div>
                <div class="game-reward-desc">Dodge hazards, speed sprint &amp; collect crystals!</div>
              </div>
            </div>
            <div class="game-card-bottom">
              <span class="game-coin-badge">🪙 Win +50 Coins</span>
              <button type="button" class="btn-play-game">Play 🎮</button>
            </div>
          </a>

          <!-- Game 2: Heart Sort -->
          <a href="heart-sort.html" class="game-card-reward" title="Play Heart Sort">
            <div class="game-card-top">
              <div class="game-icon-box">🧪</div>
              <div class="game-meta">
                <div class="game-reward-title">Heart Sort</div>
                <div class="game-reward-desc">Relaxing color tube sorting puzzle game.</div>
              </div>
            </div>
            <div class="game-card-bottom">
              <span class="game-coin-badge">🪙 Win +35 Coins</span>
              <button type="button" class="btn-play-game">Play 🎮</button>
            </div>
          </a>

          <!-- Game 3: Block Blast -->
          <a href="block-blast.html" class="game-card-reward" title="Play Block Blast">
            <div class="game-card-top">
              <div class="game-icon-box">🧩</div>
              <div class="game-meta">
                <div class="game-reward-title">Block Blast</div>
                <div class="game-reward-desc">Classic grid destruction &amp; combo blaster.</div>
              </div>
            </div>
            <div class="game-card-bottom">
              <span class="game-coin-badge">🪙 Win +40 Coins</span>
              <button type="button" class="btn-play-game">Play 🎮</button>
            </div>
          </a>

          <!-- Game 4: Heart Rain -->
          <a href="heart-rain.html" class="game-card-reward" title="Play Heart Rain">
            <div class="game-card-top">
              <div class="game-icon-box">💖</div>
              <div class="game-meta">
                <div class="game-reward-title">Heart Rain</div>
                <div class="game-reward-desc">Catch lovely celebration hearts from the sky!</div>
              </div>
            </div>
            <div class="game-card-bottom">
              <span class="game-coin-badge">🪙 Win +30 Coins</span>
              <button type="button" class="btn-play-game">Play 🎮</button>
            </div>
          </a>

          <!-- Game 5: Gem Catch -->
          <a href="gem-catch.html" class="game-card-reward" title="Play Gem Catch">
            <div class="game-card-top">
              <div class="game-icon-box">💎</div>
              <div class="game-meta">
                <div class="game-reward-title">Gem Catch</div>
                <div class="game-reward-desc">Fast-paced reaction test catching sparkly gems.</div>
              </div>
            </div>
            <div class="game-card-bottom">
              <span class="game-coin-badge">🪙 Win +25 Coins</span>
              <button type="button" class="btn-play-game">Play 🎮</button>
            </div>
          </a>

          <!-- Game 6: Love Puzzle -->
          <a href="love-puzzle.html" class="game-card-reward" title="Play Love Puzzle">
            <div class="game-card-top">
              <div class="game-icon-box">🖼️</div>
              <div class="game-meta">
                <div class="game-reward-title">Love Puzzle</div>
                <div class="game-reward-desc">Piece together romantic memory mosaics.</div>
              </div>
            </div>
            <div class="game-card-bottom">
              <span class="game-coin-badge">🪙 Win +45 Coins</span>
              <button type="button" class="btn-play-game">Play 🎮</button>
            </div>
          </a>
        </div>

        <!-- Full Arcade Gateway -->
        <div class="arcade-full-banner">
          <div>
            <div style="font-size:14px; font-weight:850;">🎪 Vanvi Gaming Arcade</div>
            <div style="font-size:11.5px; opacity:0.85; margin-top:2px;">Discover 12+ games including Word Whisper, Cross Math &amp; Memory Rush.</div>
          </div>
          <a href="games.html" class="arcade-banner-btn">View All Games →</a>
        </div>
      </div>
    </div>

    <!-- TAB 3: OFFERS, COUPONS & DISCOUNT REDEMPTION -->
    <div class="tab-content-pane" id="tabPaneCoupons">
      <div class="coupons-section">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
          <div>
            <div class="coin-kicker">Instant Perks &amp; Deals</div>
            <h2 style="font-family:var(--font-serif); font-size:22px; color:var(--text-dark);">Active Celebration Coupons</h2>
          </div>
          <span style="font-size:12px; font-weight:800; color:var(--color-rose);">4 Active</span>
        </div>

        <!-- Coin Discount Calculator Box -->
        <div class="coin-calc-card">
          <div>
            <div class="coin-calc-title"><span>🪙</span> Instant Coin Redemption Calculator</div>
            <div class="coin-calc-desc" id="coinCalcSummary">
              Your <strong>150 Coins</strong> = <strong>₹15.00 OFF</strong> instantly at checkout!
            </div>
          </div>
          <a href="templates.html" class="btn-redeem-coins">Redeem on Templates →</a>
        </div>

        <!-- Active Coupon Cards Grid -->
        <div id="couponListWrap">
          <!-- Populated by JS -->
        </div>
      </div>

      <!-- How Coins Work (Rules) -->
      <div class="rules-card">
        <h3><span>📜</span> How Vanvi Coins &amp; Rewards Work</h3>
        <ul class="rules-list">
          <li><strong>Loyalty Credits:</strong> Vanvi Coins are promotional loyalty rewards earned through daily spins, micro-games, and friend referrals.</li>
          <li><strong>Conversion Value:</strong> 10 Coins = ₹1.00 instant store credit at checkout. You can redeem coins for up to 40% discount on any template or VIP experience.</li>
          <li><strong>Instant 1-Click Coupons:</strong> Promo coupons can be combined with coin balance for maximum savings on anniversary, birthday, and celebration designs.</li>
          <li><strong>Fair Play &amp; Reset Times:</strong> Daily spins reset every 24 hours. The Lucky Moment unlocks every 14 days. Scripting or tampering will automatically reset unverified coins.</li>
        </ul>
      </div>
    </div>

    <!-- TAB 4: REFER & EARN -->
    <div class="tab-content-pane" id="tabPaneReferral">
      <section class="referral-section">
        <div class="referral-head">
          <span class="referral-badge">✦ SHARE HAPPINESS · EARN COINS</span>
          <h2>Refer Friends &amp; Earn Free Coins</h2>
          <p>Invite your friends to celebrate with Vanvi Moments. They receive a 50 coins welcome bonus, and you earn 100 coins for every friend who creates their first moment!</p>
        </div>

        <!-- 4-Step Visual Flow Cards -->
        <div class="steps-flow-grid">
          <div class="step-card">
            <div class="step-icon-box">💌</div>
            <div class="step-content">
              <h3>1. Invite Friends</h3>
              <p>Share your unique referral code or link via WhatsApp, Instagram, or SMS.</p>
            </div>
          </div>

          <div class="step-card">
            <div class="step-icon-box">🌟</div>
            <div class="step-content">
              <h3>2. Friend Joins (+50 Coins)</h3>
              <p>Your friend gets 50 bonus coins immediately upon creating their free account.</p>
              <span class="step-bonus-pill">Friend gets +50 🪙</span>
            </div>
          </div>

          <div class="step-card">
            <div class="step-icon-box">🎨</div>
            <div class="step-content">
              <h3>3. Creates First Moment</h3>
              <p>Your friend crafts their first digital greeting card or interactive moment.</p>
            </div>
          </div>

          <div class="step-card">
            <div class="step-icon-box">👑</div>
            <div class="step-content">
              <h3>4. Reward Unlocked (+100 Coins)</h3>
              <p>You receive 100 celebration coins directly into your wallet automatically!</p>
              <span class="step-bonus-pill">You get +100 🪙</span>
            </div>
          </div>
        </div>

        <!-- Referral Code Box -->
        <div class="referral-code-box">
          <div class="code-box-title">Your Personal Referral Code</div>
          <div class="code-box-sub">Tap to copy and share with friends, family, and loved ones:</div>

          <div class="code-display-row">
            <span class="code-text" id="userReferralCode">VANVI-LOVE-99</span>
            <button type="button" class="btn-copy-code" id="btnCopyReferralCode" onclick="copyReferralCode()">
              Copy Code
            </button>
          </div>

          <div class="referral-share-buttons">
            <a href="#" class="btn-share-whatsapp" id="btnShareWhatsApp" onclick="shareOnWhatsApp(event)">
              <span>💬</span> <span>Share on WhatsApp</span>
            </a>
            <button type="button" class="btn-share-more" onclick="shareNativeLink()">
              <span>🔗</span> <span>Share Link</span>
            </button>
          </div>
        </div>

        <!-- Referral Stats Counter -->
        <div class="referral-stats-strip">
          <div class="stat-pill-card">
            <div class="stat-pill-num" id="statFriendsInvited">3</div>
            <div class="stat-pill-lbl">Friends Invited</div>
          </div>
          <div class="stat-pill-card">
            <div class="stat-pill-num" id="statMomentsCreated">2</div>
            <div class="stat-pill-lbl">Moments Created</div>
          </div>
          <div class="stat-pill-card">
            <div class="stat-pill-num" id="statCoinsEarned">+200</div>
            <div class="stat-pill-lbl">Coins Earned</div>
          </div>
        </div>
      </section>
    </div>

    <!-- Reward & Claim History (Visible across all tabs) -->
    <div class="history-card">
      <div class="history-head">
        <span>🕒</span> Recent Reward &amp; Referral Activity
      </div>
      <div class="history-list" id="historyList">
        <!-- Populated by JS -->
      </div>
    </div>

  </main>

  <!-- Reward Result Modal -->
  <div class="reward-modal-backdrop" id="rewardModal">
    <div class="reward-modal-box">
      <div class="modal-emoji-badge" id="modalBadgeIcon">✨</div>
      <div class="coin-kicker" id="modalKicker">Your Little Surprise</div>
      <h3 style="font-family:var(--font-serif); font-size:22px; color:var(--text-dark); margin-bottom:6px;" id="modalTitle">Congratulations!</h3>
      <div class="modal-amount" id="modalCoinAmount">+10 Coins</div>
      <p class="modal-msg" id="modalMessage">Keep collecting little moments for your next celebration.</p>
      
      <div style="display:flex; flex-direction:column; gap:8px;">
        <button type="button" class="hero-cta-btn" onclick="closeRewardModal(); switchRewardTab('games');">🎮 Play More Games</button>
        <button type="button" class="hero-cta-btn secondary" onclick="closeRewardModal()">Close</button>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div class="toast-pill" id="toastNotification">Copied to clipboard!</div>

  <!-- Central Multi-Language Translation Script -->
  <script src="js/vanvi-i18n.js"></script>

  <script>
    (function() {
      'use strict';

      // Storage Keys
      const STORAGE_COINS = 'vanvi_user_coins';
      const STORAGE_LAST_SPIN = 'vanvi_last_spin_time';
      const STORAGE_LAST_LUCKY = 'vanvi_last_lucky_moment';
      const STORAGE_HISTORY = 'vanvi_reward_history';
      const STORAGE_REFERRAL_CODE = 'vanvi_referral_code';

      // Reward Economy Values & Weights
      const SPIN_DISTRIBUTION = [
        { value: 0, weight: 80 },
        { value: 3, weight: 180 },
        { value: 5, weight: 180 },
        { value: 6, weight: 130 },
        { value: 9, weight: 110 },
        { value: 10, weight: 100 },
        { value: 15, weight: 70 },
        { value: 20, weight: 55 },
        { value: 25, weight: 35 },
        { value: 30, weight: 22 },
        { value: 40, weight: 12 },
        { value: 50, weight: 4 },
        { value: 60, weight: 1.5 },
        { value: 80, weight: 0.5 }
      ];

      const LUCKY_DISTRIBUTION = [
        { value: 20, weight: 35 },
        { value: 30, weight: 30 },
        { value: 40, weight: 20 },
        { value: 50, weight: 10 },
        { value: 60, weight: 5 }
      ];

      const ZERO_MESSAGES = [
        "Not every moment needs coins. Some moments just need a smile. ✨",
        "Have a good day! Today came with a warm smile instead of coins 😊",
        "Keep smiling ✨ Your next little celebration surprise is waiting 💕",
        "Some of the sweetest things in life are free. Have a wonderful day! 🌸",
        "Sending you positive vibes and warm moments today ✨"
      ];

      const WHEEL_SLICES = [0, 3, 5, 6, 9, 10, 15, 20, 25, 30, 40, 50, 60, 80];
      const SLICE_ANGLE = 360 / WHEEL_SLICES.length;

      // DOM Elements
      const displayBalance = document.getElementById('displayCoinBalance');
      const coinCalcSummary = document.getElementById('coinCalcSummary');
      const wheelDisc = document.getElementById('rewardWheelDisc');
      const hubBtn = document.getElementById('hubSpinBtn');
      const hubLabel = document.getElementById('hubLabel');
      const spinStatusText = document.getElementById('spinStatusText');
      const spinCountdown = document.getElementById('spinCountdown');

      const luckyCountdown = document.getElementById('luckyCountdown');
      const luckyStatusTitle = document.getElementById('luckyStatusTitle');
      const btnClaimLucky = document.getElementById('btnClaimLucky');

      const historyContainer = document.getElementById('historyList');
      const couponContainer = document.getElementById('couponListWrap');

      const modalBackdrop = document.getElementById('rewardModal');
      const modalBadgeIcon = document.getElementById('modalBadgeIcon');
      const modalKicker = document.getElementById('modalKicker');
      const modalTitle = document.getElementById('modalTitle');
      const modalCoinAmount = document.getElementById('modalCoinAmount');
      const modalMessage = document.getElementById('modalMessage');

      let currentWheelAngle = 0;
      let isSpinning = false;

      // Web Audio Synth for Sounds
      function playWheelTickSound() {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(580, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
          osc.start();
          osc.stop(ctx.currentTime + 0.04);
        } catch(e) {}
      }

      function playWinFanfare() {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const now = ctx.currentTime;
          [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(freq, now + (i * 0.08));
            gain.gain.setValueAtTime(0.18, now + (i * 0.08));
            gain.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.08) + 0.3);
            osc.start(now + (i * 0.08));
            osc.stop(now + (i * 0.08) + 0.3);
          });
        } catch(e) {}
      }

      // Tabs Logic
      window.switchRewardTab = function(tabKey) {
        document.querySelectorAll('.nav-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content-pane').forEach(pane => pane.classList.remove('active'));
        document.querySelectorAll('.quick-hub-pill').forEach(pill => pill.classList.remove('active'));

        if (tabKey === 'wheel') {
          document.getElementById('tabBtnWheel')?.classList.add('active');
          document.getElementById('tabPaneWheel')?.classList.add('active');
          document.querySelectorAll('.quick-hub-pill')[0]?.classList.add('active');
        } else if (tabKey === 'games') {
          document.getElementById('tabBtnGames')?.classList.add('active');
          document.getElementById('tabPaneGames')?.classList.add('active');
          document.querySelectorAll('.quick-hub-pill')[1]?.classList.add('active');
        } else if (tabKey === 'coupons') {
          document.getElementById('tabBtnCoupons')?.classList.add('active');
          document.getElementById('tabPaneCoupons')?.classList.add('active');
          document.querySelectorAll('.quick-hub-pill')[2]?.classList.add('active');
        } else if (tabKey === 'referral') {
          document.getElementById('tabBtnReferral')?.classList.add('active');
          document.getElementById('tabPaneReferral')?.classList.add('active');
          document.querySelectorAll('.quick-hub-pill')[3]?.classList.add('active');
        }

        // Smooth scroll to tabs bar if below fold
        const tabsEl = document.querySelector('.rewards-nav-tabs-wrapper');
        if (tabsEl && window.scrollY > tabsEl.offsetTop) {
          tabsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      // Check hash on load
      if (window.location.hash) {
        const h = window.location.hash.replace('#', '').toLowerCase();
        if (['wheel', 'games', 'coupons', 'referral'].includes(h)) {
          switchRewardTab(h);
        } else if (h === 'spin') {
          switchRewardTab('wheel');
        } else if (h === 'offers' || h === 'discounts') {
          switchRewardTab('coupons');
        } else if (h === 'refer') {
          switchRewardTab('referral');
        }
      }

      // Coins Helpers
      function getCoins() {
        const val = localStorage.getItem(STORAGE_COINS);
        if (val !== null) return parseInt(val, 10) || 0;
        return 150;
      }

      function setCoins(amt) {
        localStorage.setItem(STORAGE_COINS, amt);
        if (displayBalance) displayBalance.textContent = amt.toLocaleString();
        if (coinCalcSummary) {
          const inRupees = (amt / 10).toFixed(2);
          coinCalcSummary.innerHTML = \`Your <strong>\${amt.toLocaleString()} Coins</strong> = <strong>₹\${inRupees} OFF</strong> instantly at checkout!\`;
        }
      }

      function getHistory() {
        try {
          const list = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || '[]');
          if (list.length === 0) {
            return [
              { title: 'Welcome Gift Bonus', coins: 100, isZero: false, date: 'Welcome day' },
              { title: 'Friend Referral Bonus', coins: 50, isZero: false, date: 'Recent' }
            ];
          }
          return list;
        } catch (e) {
          return [];
        }
      }

      function addHistory(title, coins, isZero = false) {
        const list = getHistory();
        list.unshift({
          title,
          coins,
          isZero,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
        });
        localStorage.setItem(STORAGE_HISTORY, JSON.stringify(list.slice(0, 15)));
        renderHistory();
      }

      function pickWeighted(dist) {
        const total = dist.reduce((sum, item) => sum + item.weight, 0);
        let rnd = Math.random() * total;
        for (const item of dist) {
          if (rnd < item.weight) return item.value;
          rnd -= item.weight;
        }
        return dist[0].value;
      }

      function canDailySpin() {
        const last = parseInt(localStorage.getItem(STORAGE_LAST_SPIN) || '0', 10);
        if (!last) return true;
        const cooldownMs = 24 * 60 * 60 * 1000;
        return (Date.now() - last) >= cooldownMs;
      }

      function getSpinRemainingMs() {
        const last = parseInt(localStorage.getItem(STORAGE_LAST_SPIN) || '0', 10);
        if (!last) return 0;
        const cooldownMs = 24 * 60 * 60 * 1000;
        return Math.max(0, cooldownMs - (Date.now() - last));
      }

      function canClaimLucky() {
        const last = parseInt(localStorage.getItem(STORAGE_LAST_LUCKY) || '0', 10);
        if (!last) return true;
        const cooldownMs = 14 * 24 * 60 * 60 * 1000;
        return (Date.now() - last) >= cooldownMs;
      }

      function getLuckyRemainingMs() {
        const last = parseInt(localStorage.getItem(STORAGE_LAST_LUCKY) || '0', 10);
        if (!last) return 0;
        const cooldownMs = 14 * 24 * 60 * 60 * 1000;
        return Math.max(0, cooldownMs - (Date.now() - last));
      }

      function formatMs(ms) {
        const totalSec = Math.floor(ms / 1000);
        const days = Math.floor(totalSec / 86400);
        const h = Math.floor((totalSec % 86400) / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        if (days > 0) return \`\${days}d \${h}h \${m}m\`;
        return \`\${String(h).padStart(2, '0')}:\${String(m).padStart(2, '0')}:\${String(s).padStart(2, '0')}\`;
      }

      function syncState() {
        setCoins(getCoins());

        if (canDailySpin()) {
          hubBtn.classList.remove('disabled');
          hubLabel.textContent = 'SPIN';
          spinStatusText.textContent = '✨ 1 Free Daily Spin Available';
          spinCountdown.style.display = 'none';
        } else {
          hubBtn.classList.add('disabled');
          hubLabel.textContent = 'WAIT';
          spinStatusText.textContent = 'Next Free Spin Unlocks In:';
          spinCountdown.style.display = 'inline';
          spinCountdown.textContent = formatMs(getSpinRemainingMs());
        }

        if (canClaimLucky()) {
          btnClaimLucky.disabled = false;
          luckyStatusTitle.textContent = 'Lucky Moment Ready!';
          luckyCountdown.textContent = 'Claim your 14-day reward ✨';
          luckyCountdown.style.color = '#059669';
        } else {
          btnClaimLucky.disabled = true;
          luckyStatusTitle.textContent = 'Next Lucky Moment in:';
          luckyCountdown.textContent = formatMs(getLuckyRemainingMs());
          luckyCountdown.style.color = '#d97706';
        }
      }

      // Referral Functions
      function getReferralCode() {
        let code = localStorage.getItem(STORAGE_REFERRAL_CODE);
        if (!code) {
          const rand = Math.floor(100 + Math.random() * 900);
          code = \`VANVI-LOVE-\${rand}\`;
          localStorage.setItem(STORAGE_REFERRAL_CODE, code);
        }
        return code;
      }

      function initReferral() {
        const code = getReferralCode();
        const codeEl = document.getElementById('userReferralCode');
        if (codeEl) codeEl.textContent = code;

        // Fetch server referral stats if logged in
        try {
          const token = localStorage.getItem('vanvi_token');
          if (token) {
            fetch('/api/coins/referral-stats', {
              headers: { 'Authorization': \`Bearer \${token}\` }
            }).then(r => r.json()).then(data => {
              if (data && data.success && data.stats) {
                document.getElementById('statFriendsInvited').textContent = data.stats.friendsInvited;
                document.getElementById('statMomentsCreated').textContent = data.stats.momentsCreated;
                document.getElementById('statCoinsEarned').textContent = \`+\${data.stats.coinsEarned}\`;
                if (data.referralCode) {
                  codeEl.textContent = data.referralCode;
                  localStorage.setItem(STORAGE_REFERRAL_CODE, data.referralCode);
                }
              }
            }).catch(() => {});
          }
        } catch (e) {}
      }

      window.copyReferralCode = function() {
        const code = document.getElementById('userReferralCode')?.textContent || getReferralCode();
        navigator.clipboard.writeText(code).then(() => {
          const btn = document.getElementById('btnCopyReferralCode');
          if (btn) {
            const orig = btn.textContent;
            btn.textContent = 'Copied! ✓';
            btn.style.background = '#059669';
            setTimeout(() => {
              btn.textContent = orig;
              btn.style.background = '';
            }, 2000);
          }
          showToast('Referral code copied to clipboard! 📋');
        }).catch(() => {
          showToast(\`Your referral code is: \${code}\`);
        });
      };

      window.shareOnWhatsApp = function(e) {
        if (e) e.preventDefault();
        const code = document.getElementById('userReferralCode')?.textContent || getReferralCode();
        const siteUrl = window.location.origin;
        const msg = \`Hey! I'm using Vanvi Moments to create beautiful celebration keepsakes and digital moments 💕 Use my invite code *\${code}* to get *50 FREE Coins* when you join: \${siteUrl}/signup.html?ref=\${encodeURIComponent(code)}\`;
        const waUrl = \`https://api.whatsapp.com/send?text=\${encodeURIComponent(msg)}\`;
        window.open(waUrl, '_blank');
      };

      window.shareNativeLink = function() {
        const code = document.getElementById('userReferralCode')?.textContent || getReferralCode();
        const siteUrl = window.location.origin;
        const shareData = {
          title: 'Join me on Vanvi Moments ✨',
          text: \`Use my invite code \${code} to get 50 bonus coins on Vanvi Moments:\`,
          url: \`\${siteUrl}/signup.html?ref=\${encodeURIComponent(code)}\`
        };

        if (navigator.share) {
          navigator.share(shareData).catch(() => {});
        } else {
          navigator.clipboard.writeText(\`\${shareData.text} \${shareData.url}\`);
          showToast('Invitation link copied to clipboard! ✨');
        }
      };

      // History & Coupons Render
      function renderHistory() {
        if (!historyContainer) return;
        const list = getHistory();
        historyContainer.innerHTML = list.map(item => \`
          <div class="history-item">
            <div>
              <div class="history-title">\${escapeHtml(item.title)}</div>
              <span style="font-size:10px; color:#94a3b8;">\${escapeHtml(item.date)}</span>
            </div>
            <span class="history-coins \${item.isZero ? 'zero' : ''}">\${item.isZero ? '+0 Coins' : \`+\${item.coins} Coins\`}</span>
          </div>
        \`).join('');
      }

      function renderCoupons() {
        if (!couponContainer) return;
        const coupons = [
          { code: 'MOMENT40', pct: '40%', title: 'Ultra Celebration Deal', desc: '40% OFF on bespoke celebrations & digital cards' },
          { code: 'VANVI100', pct: '₹100', title: 'Atelier Experience Voucher', desc: 'Flat ₹100 discount on 24K premium moments' },
          { code: 'LOVE25', pct: '25%', title: 'Romantic & Anniversary Special', desc: '25% discount on all love & romance templates' },
          { code: 'CELEBRATE', pct: '20%', title: 'Birthday Bash Moment', desc: '20% OFF on all party, cake & birthday cards' }
        ];

        couponContainer.innerHTML = coupons.map(c => \`
          <div class="coupon-card">
            <div class="coupon-badge-box">
              <div class="coupon-pct">\${c.pct}</div>
              <div class="coupon-off">OFF</div>
            </div>
            <div class="coupon-info">
              <div class="coupon-title">\${c.title}</div>
              <div class="coupon-desc">\${c.desc}</div>
              <span class="code-tag">\${c.code}</span>
            </div>
            <button type="button" class="btn-use" onclick="activateCoupon('\${c.code}')">Use Deal</button>
          </div>
        \`).join('');
      }

      window.activateCoupon = function(code) {
        try {
          sessionStorage.setItem('vanvi_applied_coupon', code);
          localStorage.setItem('vanvi_active_coupon', code);
          navigator.clipboard?.writeText(code).catch(() => {});
        } catch (e) {}
        showToast(\`Coupon \${code} copied & activated! 🎁\`);
        setTimeout(() => { window.location.href = 'templates.html'; }, 800);
      };

      function showToast(msg) {
        const t = document.getElementById('toastNotification');
        if (t) {
          t.textContent = msg;
          t.classList.add('show');
          setTimeout(() => t.classList.remove('show'), 2200);
        }
      }

      function escapeHtml(str) {
        return String(str || '').replace(/[&<>"']/g, s => ({
          '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[s]));
      }

      function showRewardModal(wonCoins, isLucky = false) {
        if (wonCoins === 0) {
          modalBadgeIcon.textContent = '😊';
          modalKicker.textContent = 'Have A Good Day';
          modalTitle.textContent = 'A Sweet Smile For You';
          modalCoinAmount.textContent = '+0 Coins';
          const randomMsg = ZERO_MESSAGES[Math.floor(Math.random() * ZERO_MESSAGES.length)];
          modalMessage.textContent = randomMsg;
        } else {
          modalBadgeIcon.textContent = isLucky ? '👑' : '✨';
          modalKicker.textContent = isLucky ? '14-Day Lucky Moment' : 'Your Little Surprise';
          modalTitle.textContent = isLucky ? 'Lucky Celebration Bonus!' : 'Congratulations!';
          modalCoinAmount.textContent = \`+\${wonCoins} Coins\`;
          modalMessage.textContent = 'Added to your Vanvi wallet! Redeemable for up to 40% discount on celebration moments.';
          playWinFanfare();
        }
        modalBackdrop.classList.add('active');
      }

      window.closeRewardModal = function() {
        modalBackdrop.classList.remove('active');
      };

      // Spin Execution
      async function executeSpin() {
        if (isSpinning) return;
        if (!canDailySpin()) {
          showToast('Already spun today! Next spin available in ' + formatMs(getSpinRemainingMs()));
          return;
        }

        isSpinning = true;
        hubLabel.textContent = '...';

        let wonCoins = pickWeighted(SPIN_DISTRIBUTION);

        try {
          const token = localStorage.getItem('vanvi_token');
          if (token) {
            const res = await fetch('/api/coins/spin', {
              method: 'POST',
              headers: { 'Authorization': \`Bearer \${token}\`, 'Content-Type': 'application/json' }
            });
            if (res.ok) {
              const data = await res.json();
              if (data && data.wonCoins !== undefined) wonCoins = data.wonCoins;
            }
          }
        } catch (e) {}

        const sliceIdx = WHEEL_SLICES.indexOf(wonCoins);
        const safeSliceIdx = sliceIdx !== -1 ? sliceIdx : 0;
        const sliceCenter = (safeSliceIdx * SLICE_ANGLE) + (SLICE_ANGLE / 2);
        const targetDeg = (360 - sliceCenter) % 360;
        const extraRotations = (5 + Math.floor(Math.random() * 2)) * 360;
        const currentMod = currentWheelAngle % 360;
        const delta = (targetDeg - currentMod + 360) % 360;

        currentWheelAngle += extraRotations + delta;
        wheelDisc.style.transform = \`rotate(\${currentWheelAngle}deg)\`;

        // Sound ticks interval during spin
        const tickTimer = setInterval(playWheelTickSound, 160);
        setTimeout(() => clearInterval(tickTimer), 4200);

        setTimeout(() => {
          isSpinning = false;
          localStorage.setItem(STORAGE_LAST_SPIN, Date.now());

          if (wonCoins > 0) {
            const newBal = getCoins() + wonCoins;
            setCoins(newBal);
            addHistory('Daily Fortune Wheel', wonCoins, false);
          } else {
            addHistory('Daily Fortune Wheel (Smile)', 0, true);
          }

          syncState();
          showRewardModal(wonCoins, false);
        }, 4600);
      }

      async function executeLuckyClaim() {
        if (!canClaimLucky()) {
          showToast('Your next Lucky Moment is still getting closer ✨');
          return;
        }

        btnClaimLucky.disabled = true;
        btnClaimLucky.textContent = 'Claiming…';

        let wonCoins = pickWeighted(LUCKY_DISTRIBUTION);

        try {
          const token = localStorage.getItem('vanvi_token');
          if (token) {
            const res = await fetch('/api/coins/lucky-moment/claim', {
              method: 'POST',
              headers: { 'Authorization': \`Bearer \${token}\`, 'Content-Type': 'application/json' }
            });
            if (res.ok) {
              const data = await res.json();
              if (data && data.wonCoins) wonCoins = data.wonCoins;
            }
          }
        } catch (e) {}

        localStorage.setItem(STORAGE_LAST_LUCKY, Date.now());
        const newBal = getCoins() + wonCoins;
        setCoins(newBal);
        addHistory('14-Day Lucky Moment ✨', wonCoins, false);

        btnClaimLucky.textContent = 'Claimed!';
        syncState();
        showRewardModal(wonCoins, true);
      }

      hubBtn?.addEventListener('click', executeSpin);
      btnClaimLucky?.addEventListener('click', executeLuckyClaim);

      setInterval(() => {
        if (!canDailySpin() && spinCountdown.style.display !== 'none') {
          spinCountdown.textContent = formatMs(getSpinRemainingMs());
        }
        if (!canClaimLucky()) {
          luckyCountdown.textContent = formatMs(getLuckyRemainingMs());
        }
      }, 1000);

      // Initialize
      syncState();
      initReferral();
      renderCoupons();
      renderHistory();

    })();
  </script>

  <!-- Global Bottom Navigation Dock -->
  <nav class="bottom vanvi-bottom-dock" aria-label="Vanvi Main Navigation">
    <a href="index.html" class="nav-btn" id="bottomNavHome" title="Home"><span class="dock-icon">🏠</span><span class="dock-label">Home</span></a>
    <a href="templates.html" class="nav-btn" id="bottomNavExplore" title="Explore"><span class="dock-icon">✨</span><span class="dock-label">Explore</span></a>
    <a href="templates.html" class="create nav-btn" id="bottomNavCreate" title="Templates"><span class="dock-icon create-plus">＋</span><span class="dock-label">Templates</span></a>
    <a href="rewards.html" class="nav-btn active" id="bottomNavRewards" title="Rewards"><span class="dock-icon">🎁</span><span class="dock-label">Rewards</span></a>
    <a href="profile.html" class="nav-btn" id="bottomNavMe" title="Profile"><span class="dock-icon">👤</span><span class="dock-label">Profile</span></a>
  </nav>
  <script src="js/vanvi-navigation.js"></script>
</body>
</html>
`;

fs.writeFileSync(targetFile, htmlContent, 'utf8');
console.log('Successfully upgraded rewards.html with Quick Hub, Play & Earn Games, Offers & Discounts, Daily Spinner and Dark Mode polish!');
