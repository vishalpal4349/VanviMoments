const fs = require('fs');
const path = require('path');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const issues = [];
const allAuditedLinks = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // 1. Audit all <a href="...">
  const aRegex = /<a\s+([^>]*?)href=["']([^"']*)["']([^>]*?)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = aRegex.exec(content)) !== null) {
    const rawAttrs = match[1] + ' ' + match[3];
    const target = match[2].trim();
    const text = match[4].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

    allAuditedLinks.push({ file, target, text });

    // Check empty or dummy href with no onclick
    if (target === '#' || target === '' || target === 'javascript:void(0)' || target === 'javascript:;') {
      if (!rawAttrs.includes('onclick') && !rawAttrs.includes('role="button"')) {
        issues.push({
          file,
          type: 'DEAD_EMPTY_HREF',
          text,
          target,
          reason: 'Link has empty/dummy href without onclick handler'
        });
      }
    }

    // Check internal file targets
    if (target && !target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('mailto:') && !target.startsWith('tel:') && !target.startsWith('javascript:')) {
      const cleanTarget = target.split('#')[0].split('?')[0];
      const anchor = target.includes('#') ? target.split('#')[1] : null;

      if (cleanTarget !== '') {
        if (!fs.existsSync(cleanTarget)) {
          issues.push({
            file,
            type: 'FILE_NOT_FOUND_404',
            text,
            target,
            reason: `Target file "${cleanTarget}" does not exist on disk!`
          });
        }
      }

      // Check anchor on the same page
      if (cleanTarget === '' || cleanTarget === file) {
        if (anchor && !content.includes(`id="${anchor}"`) && !content.includes(`name="${anchor}"`)) {
          issues.push({
            file,
            type: 'BROKEN_LOCAL_ANCHOR',
            text,
            target,
            reason: `Anchor target "#${anchor}" not found on page ${file}`
          });
        }
      }

      // Contextual semantic checks:
      // Wheel / Spin button pointing to wrong place
      if (/wheel|spin|fortune/i.test(text) && !/terms|policy|faq/i.test(file)) {
        if (!target.includes('rewards.html') && !target.includes('vanviSpinModal') && !target.includes('dashFortuneWheelModal') && !rawAttrs.includes('openDashboardWheelModal') && !rawAttrs.includes('switchRewardTab') && !rawAttrs.includes('openVanviSpinModal') && !rawAttrs.includes('execute')) {
          issues.push({
            file,
            type: 'MISLINKED_WHEEL_BUTTON',
            text,
            target,
            reason: `Fortune Wheel/Spin button points to "${target}" instead of direct wheel/spinner!`
          });
        }
      }

      // Rewards button pointing to games.html
      if (/^rewards$/i.test(text) || /my rewards/i.test(text) || /view rewards/i.test(text)) {
        if (target === 'games.html') {
          issues.push({
            file,
            type: 'MISLINKED_REWARDS_BUTTON',
            text,
            target,
            reason: `Rewards button points to "games.html" instead of "rewards.html"`
          });
        }
      }

      // Arcade / Games button pointing to rewards.html or index.html
      if (/arcade|play games|all games/i.test(text) && !target.includes('games.html') && !target.includes('game-') && !target.includes('#') && !rawAttrs.includes('onclick')) {
        if (target === 'rewards.html') {
          // Note: rewards.html has a games tab, so rewards.html#games is ok, but direct rewards.html is slightly off
        }
      }
    }
  }

  // 2. Audit <button onclick="...">
  const btnRegex = /<button\s+([^>]*?)onclick=["']([^"']*)["']([^>]*?)>([\s\S]*?)<\/button>/gi;
  while ((match = btnRegex.exec(content)) !== null) {
    const rawAttrs = match[1] + ' ' + match[3];
    const onclickVal = match[2].trim();
    const text = match[4].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

    // Check if function name called in onclick is defined in page or known globals
    const fnMatch = onclickVal.match(/^([a-zA-Z0-9_$]+)\s*\(/);
    if (fnMatch) {
      const fnName = fnMatch[1];
      const isKnownGlobal = [
        'alert', 'confirm', 'prompt', 'history', 'window', 'location', 'console',
        'switchHubTab', 'scrollToTarget', 'switchConverterTab', 'swapConverterDirection',
        'updateLiveConverter', 'setConverterPreset', 'autoDeductAllCoins', 'toggleAutoDeductSetting',
        'executeCoinCreditConversion', 'selectSmartPlanMatch', 'jumpToMatchedPlan', 'runCalculator',
        'toggleAccordion', 'handlePassSelection', 'handleCoinPackSelection', 'handlePlanSelection',
        'closeSubModal', 'showToast', 'openCurrencyModal', 'closeCurrencyModal', 'safeGoBack',
        'switchRewardTab', 'closeRewardModal', 'activateCoupon', 'openDashboardWheelModal',
        'closeDashboardWheelModal', 'executeDashboardWheelSpin', 'switchAdminTab', 'openDossierModal',
        'closeDossierModal', 'applyUserFilter', 'adjustCoinsModal', 'toggleUserStatus', 'editUserModal',
        'deleteUserConfirm', 'logoutAdmin', 'refreshAdminData'
      ].includes(fnName);

      if (!isKnownGlobal && !content.includes(`function ${fnName}`) && !content.includes(`${fnName} =`) && !content.includes(`${fnName}:`)) {
        // Potential missing function
      }
    }
  }
});

console.log('Total links audited:', allAuditedLinks.length);
console.log('Total issues found:', issues.length);
console.log(JSON.stringify(issues, null, 2));
