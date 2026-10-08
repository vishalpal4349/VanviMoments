/**
 * VANVI MOMENTS — UNIFIED GAME CENTER & VIRTUAL COIN ENGINE
 * Standardized 30-Coin Daily Limit, Anti-Duplicate Claim Protection,
 * Modal Rules & Result Presentation, Mobile/Desktop Responsive.
 */

(function(window) {
  'use strict';

  const DAILY_CAP = 30; // Max 30 virtual coins per day across all free games
  const STORAGE_COINS = 'vanvi_coins';
  const STORAGE_TODAY_EARNED = 'vanvi_games_today_earned';
  const STORAGE_TODAY_DATE = 'vanvi_games_today_date';

  function getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function getEarnedToday() {
    try {
      const today = getTodayKey();
      const savedDate = localStorage.getItem(STORAGE_TODAY_DATE);
      if (savedDate !== today) {
        localStorage.setItem(STORAGE_TODAY_DATE, today);
        localStorage.setItem(STORAGE_TODAY_EARNED, '0');
        return 0;
      }
      return parseInt(localStorage.getItem(STORAGE_TODAY_EARNED) || '0', 10);
    } catch (e) {
      return 0;
    }
  }

  function getRemainingToday() {
    return Math.max(0, DAILY_CAP - getEarnedToday());
  }

  function injectStyles() {
    if (document.getElementById('vanvi-games-engine-styles')) return;
    const style = document.createElement('style');
    style.id = 'vanvi-games-engine-styles';
    style.textContent = `
      @keyframes vanviModalIn {
        0% { transform: scale(0.92); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      .vanvi-game-hud-actions {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .vanvi-game-btn-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(255, 120, 175, 0.35);
        color: #2c1224;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        font-size: 11.5px;
        font-weight: 800;
        padding: 5px 12px;
        border-radius: 99px;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
      }
      .vanvi-game-btn-pill:hover {
        background: #fff0f5;
        border-color: #ff2a7a;
        color: #ff2a7a;
        transform: translateY(-1px);
      }
    `;
    document.head.appendChild(style);
  }

  function getTotalCoins() {
    try {
      const authUser = JSON.parse(localStorage.getItem('vanvi_auth_user') || '{}');
      if (authUser && typeof authUser.coins === 'number') {
        return authUser.coins;
      }
      const c1 = parseInt(localStorage.getItem(STORAGE_COINS) || '', 10);
      if (!isNaN(c1)) return c1;
      const c2 = parseInt(localStorage.getItem('vanvi_user_coins') || '', 10);
      if (!isNaN(c2)) return c2;
      return 50; // default initial bonus
    } catch (e) {
      return 50;
    }
  }

  function awardCoins(amount, gameName) {
    const earnedToday = getEarnedToday();
    const remaining = Math.max(0, DAILY_CAP - earnedToday);
    const toAward = Math.min(amount, remaining);

    let currentTotal = getTotalCoins();
    let newTotal = currentTotal;

    if (toAward > 0) {
      try {
        const newEarnedToday = earnedToday + toAward;
        newTotal = currentTotal + toAward;
        localStorage.setItem(STORAGE_TODAY_DATE, getTodayKey());
        localStorage.setItem(STORAGE_TODAY_EARNED, String(newEarnedToday));
        localStorage.setItem(STORAGE_COINS, String(newTotal));
        localStorage.setItem('vanvi_user_coins', String(newTotal));

        // Sync auth user if logged in
        try {
          const authUser = JSON.parse(localStorage.getItem('vanvi_auth_user') || '{}');
          if (authUser && typeof authUser === 'object') {
            authUser.coins = newTotal;
            localStorage.setItem('vanvi_auth_user', JSON.stringify(authUser));
          }
        } catch(e) {}

        // Backend sync if available
        if (window.VanviAPI && window.VanviAPI.coins) {
          try {
            window.VanviAPI.coins.add({ amount: toAward, reason: `${gameName || 'Game'} Reward` });
          } catch(e) {}
        }
        
        // Dispatch event for any active header counters
        window.dispatchEvent(new CustomEvent('vanvi_coins_updated', {
          detail: { coins: newTotal, awarded: toAward, todayEarned: newEarnedToday, dailyCap: DAILY_CAP, game: gameName }
        }));
      } catch (e) {
        console.warn('LocalStorage error while awarding coins', e);
      }
    }

    return {
      awarded: toAward,
      earnedToday: Math.min(DAILY_CAP, earnedToday + toAward),
      dailyCap: DAILY_CAP,
      capReached: (earnedToday + toAward) >= DAILY_CAP,
      totalCoins: newTotal
    };
  }

  // Render Daily Limit Meter Widget
  function renderDailyMeter(targetElementOrSelector) {
    const el = typeof targetElementOrSelector === 'string'
      ? document.querySelector(targetElementOrSelector)
      : targetElementOrSelector;
    if (!el) return;

    const earned = getEarnedToday();
    const pct = Math.min(100, Math.round((earned / DAILY_CAP) * 100));

    el.innerHTML = `
      <div class="vanvi-game-daily-meter" style="
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 120, 175, 0.35);
        padding: 5px 14px;
        border-radius: 999px;
        box-shadow: 0 2px 8px rgba(44, 18, 36, 0.05);
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      ">
        <span style="font-size: 13px;">🪙</span>
        <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 2px;">
          <div style="font-size: 10.5px; font-weight: 800; color: #2c1224;">
            Daily Rewards: <span style="color: #ff2a7a;">${earned}</span> / ${DAILY_CAP}
          </div>
          <div style="width: 80px; height: 4px; background: rgba(255, 120, 175, 0.2); border-radius: 99px; overflow: hidden;">
            <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, #ff2a7a, #d97706); border-radius: 99px; transition: width 0.3s ease;"></div>
          </div>
        </div>
      </div>
    `;
  }

  // Universal In-Game Rules Modal
  function showRulesModal(gameTitle, rulesArray) {
    let modal = document.getElementById('vanviGameRulesModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'vanviGameRulesModal';
      modal.style.cssText = `
        position: fixed; inset: 0; z-index: 100000;
        background: rgba(44, 18, 36, 0.65);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        display: flex; align-items: center; justify-content: center;
        padding: 16px;
      `;
      document.body.appendChild(modal);
    }

    const rulesHtml = (rulesArray || [])
      .map(r => `<li style="margin-bottom: 8px; line-height: 1.45; font-size: 13px; color: #4a2840;">${r}</li>`)
      .join('');

    modal.innerHTML = `
      <div style="
        background: #ffffff;
        border: 1.5px solid rgba(255, 120, 175, 0.35);
        border-radius: 24px;
        padding: 24px 22px;
        max-width: 380px;
        width: 100%;
        box-shadow: 0 20px 50px rgba(44, 18, 36, 0.2);
        text-align: left;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        animation: vanviModalIn 0.22s ease-out;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 style="margin: 0; font-size: 18px; font-weight: 850; color: #2c1224;">📖 How to Play</h3>
          <button type="button" onclick="VanviGames.closeRulesModal()" style="
            background: #fff0f5; border: 1px solid rgba(255, 120, 175, 0.3); border-radius: 50%;
            width: 30px; height: 30px; font-size: 14px; color: #ff2a7a; cursor: pointer;
          ">&times;</button>
        </div>
        <p style="font-size: 12px; font-weight: 750; color: #ff2a7a; margin-bottom: 10px; text-transform: uppercase;">${gameTitle}</p>
        <ul style="padding-left: 20px; margin: 0 0 18px;">
          ${rulesHtml}
        </ul>
        <div style="background: #fff9fb; border: 1px solid rgba(255, 120, 175, 0.25); border-radius: 12px; padding: 8px 12px; margin-bottom: 16px; font-size: 11px; color: #724c65;">
          🪙 <strong>Reward:</strong> Win virtual Vanvi Coins (Daily Limit: max 30 coins). Non-cashable website reward points.
        </div>
        <button type="button" onclick="VanviGames.closeRulesModal()" style="
          width: 100%; padding: 11px; border-radius: 99px; border: none;
          background: linear-gradient(135deg, #ff2a7a, #e11d48); color: #fff;
          font-weight: 800; font-size: 13px; cursor: pointer;
          box-shadow: 0 4px 14px rgba(255, 42, 122, 0.35);
        ">Got It! Let's Play →</button>
      </div>
    `;
    modal.style.display = 'flex';
  }

  function closeRulesModal() {
    const modal = document.getElementById('vanviGameRulesModal');
    if (modal) modal.style.display = 'none';
  }

  // Universal End Result Modal
  function showResultModal(options) {
    const { title, score, scoreLabel, coinsAwarded, isSuccess, onRestart, restartText } = options || {};
    let modal = document.getElementById('vanviGameResultModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'vanviGameResultModal';
      modal.style.cssText = `
        position: fixed; inset: 0; z-index: 100000;
        background: rgba(44, 18, 36, 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        display: flex; align-items: center; justify-content: center;
        padding: 16px;
      `;
      document.body.appendChild(modal);
    }

    const earnedToday = getEarnedToday();
    const capReached = earnedToday >= DAILY_CAP;

    modal.innerHTML = `
      <div style="
        background: #ffffff;
        border: 1.5px solid rgba(255, 120, 175, 0.4);
        border-radius: 26px;
        padding: 26px 20px;
        max-width: 380px;
        width: 100%;
        box-shadow: 0 24px 60px rgba(44, 18, 36, 0.25);
        text-align: center;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        animation: vanviModalIn 0.25s ease-out;
      ">
        <div style="font-size: 42px; margin-bottom: 6px;">${isSuccess ? '🎉' : '✨'}</div>
        <h3 style="margin: 0 0 6px; font-size: 21px; font-weight: 850; color: #2c1224;">${title || 'Challenge Complete!'}</h3>
        
        <div style="margin: 12px 0 16px; background: #fff5f8; border: 1px solid rgba(255, 120, 175, 0.25); border-radius: 16px; padding: 12px;">
          <div style="font-size: 11.5px; font-weight: 750; color: #724c65; text-transform: uppercase;">${scoreLabel || 'Final Score'}</div>
          <div style="font-size: 28px; font-weight: 900; color: #ff2a7a; line-height: 1.2;">${score !== undefined ? score : 'Done!'}</div>
        </div>

        ${coinsAwarded > 0 ? `
          <div style="
            display: inline-flex; align-items: center; gap: 6px;
            background: linear-gradient(135deg, #fffbeb, #fef3c7);
            border: 1px solid #fde68a; color: #b45309;
            font-size: 14px; font-weight: 900; padding: 6px 16px;
            border-radius: 99px; margin-bottom: 12px;
          ">
            <span>🪙</span> +${coinsAwarded} Vanvi Coins Earned!
          </div>
        ` : (capReached ? `
          <div style="font-size: 11.5px; font-weight: 750; color: #724c65; margin-bottom: 12px;">
            Daily Free Cap Reached (30/30 🪙). Play on for fun & skill!
          </div>
        ` : `
          <div style="font-size: 12px; font-weight: 750; color: #724c65; margin-bottom: 12px;">
            Keep practicing to earn more Vanvi Coins!
          </div>
        `)}

        <div style="font-size: 11px; color: #88627b; margin-bottom: 18px;">
          Today's Total: <strong>${earnedToday}</strong> / ${DAILY_CAP} 🪙 · Wallet: <strong>${getTotalCoins()}</strong> 🪙
        </div>

        <div style="display: flex; gap: 8px;">
          <a href="games.html" style="
            flex: 1; padding: 10px; border-radius: 12px;
            background: #fff; border: 1.5px solid rgba(255, 120, 175, 0.35);
            color: #2c1224; font-size: 12px; font-weight: 800;
            text-decoration: none; display: inline-flex; align-items: center; justify-content: center;
          ">🎮 Hub</a>
          <button type="button" id="vanviResultRestartBtn" style="
            flex: 1.5; padding: 10px 14px; border-radius: 12px; border: none;
            background: linear-gradient(135deg, #ff2a7a, #e11d48);
            color: #fff; font-size: 12.5px; font-weight: 850;
            cursor: pointer; box-shadow: 0 4px 14px rgba(255, 42, 122, 0.35);
          ">${restartText || 'Play Again 🔄'}</button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    const restartBtn = document.getElementById('vanviResultRestartBtn');
    if (restartBtn) {
      restartBtn.onclick = function() {
        modal.style.display = 'none';
        if (typeof onRestart === 'function') onRestart();
      };
    }
  }

  function closeResultModal() {
    const modal = document.getElementById('vanviGameResultModal');
    if (modal) modal.style.display = 'none';
  }

  // Export to global scope
  window.VanviGames = {
    DAILY_CAP,
    getTodayKey,
    getEarnedToday,
    getRemainingToday,
    getTotalCoins,
    awardCoins,
    renderDailyMeter,
    showRulesModal,
    closeRulesModal,
    showResultModal,
    closeResultModal
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyles);
  } else {
    injectStyles();
  }

})(window);
