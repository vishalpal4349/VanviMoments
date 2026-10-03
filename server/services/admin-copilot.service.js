/**
 * VANVI MOMENTS — ADMIN GPT AUTONOMOUS COPILOT SERVICE
 * Dedicated OpenAI GPT-Powered Autonomous Executive Agent for Admin Panel.
 * Uses OpenAI API (ADMIN_OPENAI_API_KEY / OPENAI_API_KEY).
 * Capable of autonomous operations:
 * - Coin adjustments & Tier updates for users
 * - Promo coupon generation
 * - Order status management
 * - Maintenance mode & Storefront configuration
 * - Business analytics & Revenue metrics
 */

const crypto = require('crypto');
const { Users, Orders, Moments, CoinLedger, AuditLogs, getStore, saveStore } = require('../db/database');

const fs = require('fs');
const path = require('path');

function getOpenAIKey() {
  if (process.env.ADMIN_OPENAI_API_KEY) return process.env.ADMIN_OPENAI_API_KEY.trim();
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY.trim();
  try {
    const envPath = path.resolve(__dirname, '../../.env');
    if (fs.existsSync(envPath)) {
      const raw = fs.readFileSync(envPath, 'utf8');
      const match = raw.match(/ADMIN_OPENAI_API_KEY=([^\r\n]+)/) || raw.match(/OPENAI_API_KEY=([^\r\n]+)/);
      if (match && match[1]) {
        const val = match[1].trim();
        process.env.ADMIN_OPENAI_API_KEY = val;
        return val;
      }
    }
  } catch (e) {}
  return '';
}

/**
 * Get current platform snapshot for AI context
 */
function getPlatformContext() {
  const store = getStore();
  const totalUsers = store.users ? store.users.length : 0;
  const recentUsers = (store.users || []).slice(-10).map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    coins: u.coins,
    tier: u.tier,
    provider: u.provider || 'local'
  }));

  const totalOrders = store.orders ? store.orders.length : 0;
  const paidOrders = (store.orders || []).filter(o => o.status === 'paid');
  const totalRevenueINR = paidOrders.reduce((sum, o) => sum + (Number(o.finalAmountINR) || 0), 0);
  const recentOrders = (store.orders || []).slice(-5).map(o => ({
    id: o.id,
    templateName: o.templateName,
    amount: o.finalAmountINR,
    status: o.status,
    gatewayOrderId: o.gatewayOrderId
  }));

  if (!Array.isArray(store.coupons)) {
    store.coupons = [
      { code: 'WELCOME10', type: 'pct', value: 10, minOrder: 0, status: 'Active' },
      { code: 'VANVI15', type: 'pct', value: 15, minOrder: 149, status: 'Active' },
      { code: 'LOVE20', type: 'pct', value: 20, minOrder: 199, status: 'Active' },
      { code: 'CELEBRATE50', type: 'flat', value: 50, minOrder: 199, status: 'Active' }
    ];
  }

  if (!store.settings) {
    store.settings = {
      maintenanceMode: false,
      supportEmail: 'celebrate@vanvimoments.shop',
      whatsappNumber: '+91 76314 42934',
      conversionRate: 1,
      announcement: ''
    };
  }

  return {
    totalUsers,
    recentUsers,
    totalOrders,
    paidOrdersCount: paidOrders.length,
    totalRevenueINR,
    recentOrders,
    coupons: store.coupons,
    settings: store.settings
  };
}

/**
 * Execute an autonomous admin action directly in database
 */
async function executeAdminAction(tool, params = {}, actorUserId = 'usr_admin_ai') {
  const store = getStore();
  let result = null;

  switch (tool) {
    case 'adjust_coins': {
      const { emailOrId, amount, reason, type } = params;
      const numericAmount = parseInt(amount, 10);
      if (!emailOrId || isNaN(numericAmount)) {
        throw new Error('Valid user identifier (email or ID) and numeric amount required.');
      }

      let user = null;
      if (emailOrId.includes('@')) {
        user = await Users.findByEmail(emailOrId);
      } else {
        user = await Users.findById(emailOrId);
      }

      // Fallback: search by name
      if (!user) {
        user = store.users.find(u => u.name && u.name.toLowerCase().includes(emailOrId.toLowerCase()));
      }

      if (!user) {
        throw new Error(`User "${emailOrId}" not found in database.`);
      }

      const isDebit = type === 'debit' || numericAmount < 0;
      const absAmount = Math.abs(numericAmount);
      const prevCoins = user.coins || 0;

      await CoinLedger.create({
        userId: user.id,
        type: isDebit ? 'debit' : 'credit',
        amount: absAmount,
        reason: reason || 'Autonomous adjustment by Vanvi GPT Copilot',
        refId: 'ai_copilot_auto'
      });

      const updatedUser = await Users.findById(user.id);
      const newBalance = updatedUser ? updatedUser.coins : (isDebit ? Math.max(0, prevCoins - absAmount) : prevCoins + absAmount);

      await AuditLogs.create({
        actorUserId,
        action: 'AI_COINS_ADJUST',
        targetEntity: 'user',
        targetId: user.id,
        metadata: { prev: prevCoins, new: newBalance, amount: absAmount }
      });

      result = {
        action: 'ADJUST_COINS',
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        change: (isDebit ? '-' : '+') + absAmount,
        previousCoins: prevCoins,
        currentCoins: newBalance
      };
      break;
    }

    case 'set_user_tier': {
      const { emailOrId, tier } = params;
      const validTiers = ['free', 'member', 'vip'];
      const targetTier = String(tier || 'vip').toLowerCase();
      if (!validTiers.includes(targetTier)) {
        throw new Error(`Invalid tier "${tier}". Must be free, member, or vip.`);
      }

      let user = await Users.findByIdentifier(emailOrId);
      if (!user) {
        user = store.users.find(u => u.name && u.name.toLowerCase().includes(emailOrId.toLowerCase()));
      }
      if (!user) throw new Error(`User "${emailOrId}" not found.`);

      await Users.update(user.id, { tier: targetTier });
      await AuditLogs.create({
        actorUserId,
        action: 'AI_TIER_UPDATE',
        targetEntity: 'user',
        targetId: user.id,
        metadata: { newTier: targetTier }
      });

      result = {
        action: 'SET_TIER',
        userName: user.name,
        userEmail: user.email,
        tier: targetTier
      };
      break;
    }

    case 'create_coupon': {
      const { code, discountType = 'pct', value = 20, minOrder = 199 } = params;
      const cleanCode = String(code || 'PROMO' + Math.floor(100 + Math.random() * 900)).toUpperCase().replace(/[^A-Z0-9]/g, '');

      if (!Array.isArray(store.coupons)) store.coupons = [];
      const exists = store.coupons.find(c => c.code === cleanCode);
      if (exists) {
        exists.value = Number(value);
        exists.type = discountType;
        exists.minOrder = Number(minOrder);
        exists.status = 'Active';
      } else {
        store.coupons.unshift({
          code: cleanCode,
          type: discountType,
          value: Number(value),
          minOrder: Number(minOrder),
          status: 'Active',
          createdAt: Date.now()
        });
      }
      saveStore();

      await AuditLogs.create({
        actorUserId,
        action: 'AI_COUPON_CREATED',
        targetEntity: 'coupon',
        targetId: cleanCode,
        metadata: { value, discountType, minOrder }
      });

      result = {
        action: 'CREATE_COUPON',
        code: cleanCode,
        discount: discountType === 'pct' ? `${value}% OFF` : `₹${value} FLAT OFF`,
        minOrder: `₹${minOrder}`
      };
      break;
    }

    case 'toggle_maintenance': {
      const { enabled } = params;
      if (!store.settings) store.settings = {};
      store.settings.maintenanceMode = Boolean(enabled);
      saveStore();

      await AuditLogs.create({
        actorUserId,
        action: 'AI_SETTINGS_UPDATE',
        targetEntity: 'settings',
        targetId: 'maintenanceMode',
        metadata: { maintenanceMode: store.settings.maintenanceMode }
      });

      result = {
        action: 'TOGGLE_MAINTENANCE',
        maintenanceMode: store.settings.maintenanceMode
      };
      break;
    }

    case 'update_settings': {
      const { supportEmail, whatsappNumber, announcement } = params;
      if (!store.settings) store.settings = {};
      if (supportEmail) store.settings.supportEmail = supportEmail.trim();
      if (whatsappNumber) store.settings.whatsappNumber = whatsappNumber.trim();
      if (announcement !== undefined) store.settings.announcement = announcement.trim();
      saveStore();

      result = {
        action: 'UPDATE_SETTINGS',
        settings: store.settings
      };
      break;
    }

    case 'update_order_status': {
      const { orderId, status } = params;
      const order = await Orders.findById(orderId) || store.orders.find(o => o.gatewayOrderId === orderId);
      if (!order) throw new Error(`Order "${orderId}" not found.`);

      order.status = status;
      if (status === 'paid' && !order.paidAt) order.paidAt = Date.now();
      saveStore();

      result = {
        action: 'UPDATE_ORDER',
        orderId: order.id,
        status
      };
      break;
    }

    case 'query_metrics': {
      const paidOrders = (store.orders || []).filter(o => o.status === 'paid');
      const rev = paidOrders.reduce((sum, o) => sum + (Number(o.finalAmountINR) || 0), 0);
      result = {
        action: 'QUERY_METRICS',
        totalUsers: (store.users || []).length,
        totalOrders: (store.orders || []).length,
        paidOrders: paidOrders.length,
        revenueINR: rev,
        totalMoments: (store.moments || []).length
      };
      break;
    }

    default:
      throw new Error(`Unknown autonomous tool: "${tool}"`);
  }

  return result;
}

/**
 * Intelligent Rule-Based Local NLP Fallback when OpenAI key is absent
 */
function localAutonomousAgentFallback(message, context) {
  const q = String(message || '').toLowerCase().trim();

  // 1. Give Coins: handles any phrasing like "priya ko 500 coins gift do", "add 100 coins to user@domain.com", etc.
  const hasCoinWord = q.includes('coin') || q.includes('sikke') || q.includes('coins');
  const numMatch = q.match(/\b(\d+)\b/);
  if (hasCoinWord && numMatch) {
    const amount = parseInt(numMatch[1], 10);
    // Find target email or name in message
    const emailMatch = q.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
    let target = emailMatch ? emailMatch[1] : '';
    if (!target) {
      // Check if any recent user's name or email appears in message
      const matchedUser = (context.recentUsers || []).find(u =>
        (u.name && q.includes(u.name.toLowerCase())) ||
        (u.email && q.includes(u.email.toLowerCase()))
      );
      if (matchedUser) {
        target = matchedUser.email || matchedUser.id;
      }
    }
    if (!target) {
      const words = q.split(/\s+/);
      const koIdx = words.findIndex(w => w === 'ko' || w === 'to');
      if (koIdx > 0) target = words[koIdx - 1];
    }
    target = target || (context.recentUsers[0] ? context.recentUsers[0].email : 'usr_admin');

    return {
      reply: `Samajh gaya! Maine **${target}** ko **+${amount} Vanvi Coins** credit karne ka autonomous command execute kar diya hai.`,
      action: {
        tool: 'adjust_coins',
        params: {
          emailOrId: target,
          amount: amount,
          reason: 'Credited by Admin GPT Copilot',
          type: 'credit'
        }
      },
      suggestions: ['Recent users balance check karo', 'Naya promo coupon banao', 'Today revenue kitna hai?']
    };
  }

  // 2. Create Coupon: "coupon FESTIVE25 25%" / "create coupon DIWALI30"
  if (q.includes('coupon') || q.includes('code') || q.includes('promo')) {
    const words = q.toUpperCase().match(/[A-Z0-9]{4,15}/g) || [];
    const percentMatch = q.match(/(\d+)\s*%/);
    const numMatch = q.match(/\b(\d+)\b/);
    const code = words.find(w => !['COUPON', 'PROMO', 'CREATE', 'CODE', 'NAYA', 'DISCOUNT', 'WALA', 'BANAO', 'BANA'].includes(w)) || 'VANVI25';
    const pct = percentMatch ? parseInt(percentMatch[1], 10) : (numMatch ? parseInt(numMatch[1], 10) : 25);

    return {
      reply: `Maine naya promotional coupon code **"${code}"** (${pct}% discount) create aur activate kar diya hai! Customers ab checkout par ise use kar sakte hain.`,
      action: {
        tool: 'create_coupon',
        params: {
          code: code,
          discountType: 'pct',
          value: pct,
          minOrder: 149
        }
      },
      suggestions: ['Sabhi active coupons dikhao', 'Maintenance mode status', 'Ek aur coupon banao']
    };
  }

  // 3. Maintenance Mode: "turn maintenance on" / "maintenance band karo"
  if (q.includes('maintenance')) {
    const isEnable = q.includes('on') || q.includes('enable') || q.includes('chalu') || q.includes('lagao');
    return {
      reply: isEnable
        ? `Website maintenance mode **ENABLE** kar diya gaya hai. Storefront par maintenance banner show hoga.`
        : `Website maintenance mode **DISABLE** kar diya gaya hai. Sabhi customers normal purchase kar sakte hain.`,
      action: {
        tool: 'toggle_maintenance',
        params: { enabled: isEnable }
      },
      suggestions: ['Platform settings check karo', 'Users list dikhao', 'Today metrics']
    };
  }

  // 4. Metrics & Revenue: "today revenue" / "orders kitne huye" / "kamai batao"
  if (q.includes('revenue') || q.includes('order') || q.includes('kamai') || q.includes('stats') || q.includes('metric') || q.includes('analytics')) {
    return {
      reply: `📊 **Platform Live Overview:**\n• Total Registered Users: **${context.totalUsers}**\n• Total Orders Placed: **${context.totalOrders}** (${context.paidOrdersCount} Paid)\n• Total Revenue Generated: **₹${context.totalRevenueINR.toFixed(2)}**\n• Active Coupons: **${context.coupons.length}**`,
      action: {
        tool: 'query_metrics',
        params: {}
      },
      suggestions: ['Recent 5 orders dikhao', 'Koi user search karo', 'Naya coupon generate karo']
    };
  }

  // 5. Default Friendly Executive Response
  return {
    reply: `Namaste Admin! Main aapka **Autonomous GPT Executive Copilot** hoon. Aap mujhe seedhe bol sakte hain jaise:\n• *"Priya ko 500 coins do"*\n• *"Coupon DIWALI30 (30% discount) banao"*\n• *"Maintenance mode on/off karo"*\n• *"Aaj ka revenue aur orders kitne huye?"*\n\nMain aapke orders, users, coupons aur system settings ko khud manage aur execute kar deta hoon. Bataiye abhi kya karna hai?`,
    action: null,
    suggestions: [
      'Priya ko 200 coins credit karo 💰',
      'Diwali 30% Promo Coupon banao 🏷️',
      'Platform Revenue & Stats dikhao 📊'
    ]
  };
}

/**
 * Main Admin Copilot Chat & Execution Function
 */
async function chatAdminCopilot({ message, history = [], apiKey = '' }) {
  const cleanMsg = String(message || '').trim();
  const effectiveKey = apiKey || getOpenAIKey();
  const context = getPlatformContext();

  let replyText = '';
  let actionToExecute = null;
  let suggestions = [];

  // 1. Try OpenAI GPT if API key is provided
  if (effectiveKey && effectiveKey.startsWith('sk-')) {
    try {
      const systemPrompt = `You are the Autonomous GPT Executive Director for Vanvi Moments (vanvimoments.shop) Admin Panel.
You have FULL AUTONOMOUS AUTHORITY to perform database and store administration tasks.
Analyze the admin's command (which may be in Hindi, Hinglish, or English).

CURRENT PLATFORM SNAPSHOT:
- Total Users: ${context.totalUsers}
- Recent Users: ${JSON.stringify(context.recentUsers.map(u => ({ email: u.email, name: u.name, coins: u.coins, tier: u.tier })))}
- Total Orders: ${context.totalOrders} (Revenue: ₹${context.totalRevenueINR})
- Active Coupons: ${JSON.stringify(context.coupons.map(c => c.code))}
- Maintenance Mode: ${context.settings.maintenanceMode}

AVAILABLE TOOLS (execute if admin asks to perform an action):
1. "adjust_coins": { emailOrId: string, amount: number, reason: string, type: "credit"|"debit" }
2. "set_user_tier": { emailOrId: string, tier: "free"|"member"|"vip" }
3. "create_coupon": { code: string, discountType: "pct"|"flat", value: number, minOrder: number }
4. "toggle_maintenance": { enabled: boolean }
5. "update_settings": { supportEmail?: string, whatsappNumber?: string, announcement?: string }
6. "update_order_status": { orderId: string, status: "paid"|"refunded"|"cancelled" }
7. "query_metrics": {}

OUTPUT FORMAT: Return STRICT JSON ONLY:
{
  "reply": "Clear, friendly, conversational reply in natural Hindi or Hinglish explaining what you found or executed.",
  "action": null or { "tool": "tool_name", "params": { ... } },
  "suggestions": ["3 short relevant follow-up actions"]
}`;

      const messages = [
        { role: 'system', content: systemPrompt }
      ];

      if (Array.isArray(history)) {
        history.slice(-6).forEach(h => {
          if (h.role === 'user' || h.role === 'assistant') {
            messages.push({ role: h.role, content: h.content || h.text || '' });
          }
        });
      }
      // 1. Primary: OpenAI Responses API with GPT-6 Luna
      let rawText = '';
      try {
        let inputPrompt = cleanMsg;
        if (Array.isArray(history) && history.length > 0) {
          const recentHistory = history.slice(-4).map(h => `${h.role === 'user' ? 'Admin' : 'Copilot'}: ${h.content || h.text || ''}`).join('\n');
          inputPrompt = `Previous Conversation:\n${recentHistory}\n\nAdmin Command:\n${cleanMsg}`;
        }

        const resp = await fetch('https://api.openai.com/v1/responses', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${effectiveKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-6-luna',
            instructions: systemPrompt,
            input: inputPrompt,
            store: true
          })
        });

        if (resp.ok) {
          const data = await resp.json();
          const msgItem = data.output?.find(item => item.type === 'message' || item.role === 'assistant');
          const textObj = msgItem?.content?.find(c => c.type === 'output_text' || typeof c.text === 'string');
          rawText = textObj?.text || (typeof msgItem?.content === 'string' ? msgItem.content : '');
        } else {
          const errJson = await resp.json().catch(() => ({}));
          console.warn('OpenAI Responses API returned error status, checking fallback:', errJson);
        }
      } catch (err) {
        console.warn('OpenAI Responses API call failed, checking fallback:', err.message);
      }

      // Secondary: Try legacy v1/chat/completions if Responses API didn't return text
      if (!rawText) {
        try {
          const chatResp = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${effectiveKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: cleanMsg }
              ],
              response_format: { type: 'json_object' },
              temperature: 0.3
            })
          });
          if (chatResp.ok) {
            const chatData = await chatResp.json();
            rawText = chatData.choices?.[0]?.message?.content || '';
          }
        } catch (e) {}
      }

      // Parse JSON from returned text
      if (rawText) {
        let parsed = null;
        try {
          parsed = JSON.parse(rawText.trim());
        } catch (e) {
          const match = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || rawText.match(/(\{[\s\S]*\})/);
          if (match && match[1]) {
            try { parsed = JSON.parse(match[1]); } catch (e2) {}
          }
        }
        if (parsed) {
          replyText = parsed.reply || '';
          actionToExecute = parsed.action || null;
          suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
        }
      }
    } catch (err) {
      console.warn('OpenAI Copilot call failed, falling back:', err.message);
    }
  }

  // 2. Fallback to Local Autonomous NLP Engine if OpenAI was not called or failed
  if (!replyText) {
    const fallback = localAutonomousAgentFallback(cleanMsg, context);
    replyText = fallback.reply;
    actionToExecute = fallback.action;
    suggestions = fallback.suggestions;
  }

  // 3. If an action is identified, execute it in the real database!
  let actionResult = null;
  if (actionToExecute && actionToExecute.tool) {
    try {
      actionResult = await executeAdminAction(actionToExecute.tool, actionToExecute.params || {});
    } catch (execErr) {
      console.error('Failed to execute autonomous admin action:', execErr);
      replyText += `\n\n⚠️ Action note: ${execErr.message}`;
    }
  }

  return {
    success: true,
    provider: (effectiveKey && effectiveKey.startsWith('sk-')) ? 'openai-gpt' : 'autonomous-executive-engine',
    reply: replyText,
    actionExecuted: actionResult,
    suggestions: suggestions.length > 0 ? suggestions : [
      'Give 100 coins to recent user',
      'Create 20% discount coupon',
      'Show live revenue metrics'
    ]
  };
}

module.exports = {
  chatAdminCopilot,
  executeAdminAction,
  getPlatformContext
};
