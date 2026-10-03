/**
 * VANVI MOMENTS — CENTRAL MULTI-LANGUAGE TRANSLATION SYSTEM (i18n)
 * Authentic Devanagari Hindi & English localization dictionary and dynamic DOM translator.
 * Preserves user language preference across sessions via localStorage ('vanvi_lang').
 */

(function(window, document) {
  'use strict';

  const STORAGE_KEY = 'vanvi_lang';
  const DEFAULT_LANG = 'en';

  // Authentic Devanagari Hindi Dictionary (Culturally resonant, respectful, pure Hindi)
  const TRANSLATIONS = {
    en: {
      // Global Navigation
      'nav.home': 'Home',
      'nav.templates': 'Templates',
      'nav.create': 'Create Moment',
      'nav.studio': 'Studio',
      'nav.gifts': '🎁 Gifts',
      'nav.plans': '💎 VIP Plans',
      'nav.rewards': '🪙 Rewards',
      'nav.ai': '✨ Vanvi AI',
      'nav.login': 'Login',
      'nav.signup': 'Sign Up',
      'nav.my_moments': 'My Moments',
      'nav.profile': 'Profile',
      'nav.back': '← Back',
      'nav.back_home': '← Back to Home',
      'nav.explore': 'Explore',
      'nav.search_placeholder': 'Search templates, moments, gifts...',

      // Common Actions
      'btn.create_moment': 'Create Moment',
      'btn.copy_code': 'Copy Code',
      'btn.copied': 'Copied! ✓',
      'btn.share_whatsapp': 'Share on WhatsApp',
      'btn.share_more': 'Share Link',
      'btn.claim': 'Claim Reward',
      'btn.use_coupon': 'Use Coupon',
      'btn.spin_now': 'SPIN',
      'btn.play_now': 'Play',
      'btn.claimed': 'Claimed ✓',
      'btn.explore_templates': 'Explore Templates →',
      'btn.close': 'Close',

      // Rewards & Referral Hub
      'rewards.title': 'Rewards & Referrals',
      'rewards.hero_kicker': 'Your Vanvi Coins',
      'rewards.tagline': '“Little rewards. Beautiful moments.”',
      'rewards.exchange_rate': 'Exchange: 10 Coins = ₹1.00 · Up to 40% Discount',
      'rewards.tab_referral': '🎁 Refer & Earn',
      'rewards.tab_wheel': '🎡 Daily Fortune Wheel',
      'rewards.tab_coupons': '🎟️ Promo Coupons',

      // Refer & Earn 4-Step Flow
      'referral.badge': '✦ SHARE HAPPINESS · EARN COINS',
      'referral.title': 'Refer Friends & Earn Free Coins',
      'referral.subtitle': 'Invite your friends to celebrate with Vanvi Moments. They receive a ₹50 welcome bonus, and you earn ₹100 coins for every friend who joins and celebrates!',
      'referral.step1_title': '1. Invite Friends',
      'referral.step1_desc': 'Share your unique referral code or link via WhatsApp, Instagram, or SMS.',
      'referral.step2_title': '2. Friend Joins (+50 Coins)',
      'referral.step2_desc': 'Your friend gets 50 bonus coins immediately upon creating their free account.',
      'referral.step3_title': '3. Creates First Moment',
      'referral.step3_desc': 'Your friend crafts their first digital card, keepsake, or celebration.',
      'referral.step4_title': '4. Reward Unlocked (+100 Coins)',
      'referral.step4_desc': 'You receive 100 celebration coins directly into your wallet automatically!',

      // Referral Card
      'referral.code_card_title': 'Your Personal Referral Code',
      'referral.code_card_sub': 'Tap to copy and share with friends, family, and loved ones:',
      'referral.stats_invited': 'Friends Invited',
      'referral.stats_completed': 'Moments Created',
      'referral.stats_earned': 'Coins Earned',

      // Daily Fortune Wheel & Lucky Moment
      'wheel.kicker': 'Daily Little Surprise',
      'wheel.title': 'Daily Reward Fortune Wheel',
      'wheel.subtitle': 'Spin once every 24 hours to earn celebration coins or an uplifting blessing!',
      'wheel.available': '✨ 1 Free Daily Spin Available',
      'wheel.next_in': 'Next Free Spin Unlocks In:',
      'lucky.title': '✨ Special 14-Day Lucky Moment',
      'lucky.badge': 'Once Every 14 Days',
      'lucky.desc': 'A special bi-weekly surprise for dedicated creators! Earn a random bonus of 20 to 60 coins.',
      'lucky.btn': 'Claim Lucky Moment ✨',

      // Games Page
      'games.title': 'Celebration Games & Unlocks',
      'games.kicker': '✦ PLAY. DISCOVER. UNLOCK.',
      'games.subtitle': 'Skill challenges & joyful micro-games. Win 2–10 coins per game!',
      'games.daily_cap_title': 'Daily Games Coin Limit',
      'games.daily_cap_sub': 'Daily cap: 25 Coins Max · Non-gambling skill challenges',
      'games.completed_label': 'Games Completed Today',

      // Physical Gifts Store
      'gifts.title': 'Curated Gift Showcase',
      'gifts.subtitle': 'Handpicked physical gifts for every occasion. Discover and view on official stores.',
      'gifts.view_amazon': 'View on Amazon →',
      'gifts.view_flipkart': 'View on Flipkart →',
      'gifts.view_meesho': 'View on Meesho →',
      'gifts.disclaimer': 'Product links redirect to official stores. VanviMoments does not sell or ship physical products directly.',

      // Auth & Forms
      'auth.btn_whatsapp': 'WhatsApp',
      'auth.lbl_identifier': 'Email or Mobile Number'
    },

    hi: {
      // Global Navigation (Authentic Devanagari Hindi)
      'nav.home': 'होम',
      'nav.templates': 'टेम्प्लेट्स',
      'nav.create': 'पल बनाएं',
      'nav.studio': 'स्टूडियो',
      'nav.gifts': '🎁 उपहार स्टोर',
      'nav.plans': '💎 वीआईपी प्लान्स',
      'nav.rewards': '🪙 रिवॉर्ड्स',
      'nav.ai': '✨ वान्वी एआई',
      'nav.login': 'लॉग इन',
      'nav.signup': 'साइन अप',
      'nav.my_moments': 'मेरे पल',
      'nav.profile': 'प्रोफ़ाइल',
      'nav.back': '← पीछे जाएं',
      'nav.back_home': '← मुख्य पृष्ठ पर जाएं',
      'nav.explore': 'एक्सप्लोर करें',
      'nav.search_placeholder': 'टेम्प्लेट्स, उपहार या पल खोजें...',

      // Common Actions
      'btn.create_moment': 'नया पल बनाएं',
      'btn.copy_code': 'कोड कॉपी करें',
      'btn.copied': 'कॉपी हो गया! ✓',
      'btn.share_whatsapp': 'व्हाट्सएप पर शेयर करें',
      'btn.share_more': 'लिंक साझा करें',
      'btn.claim': 'रिवॉर्ड प्राप्त करें',
      'btn.use_coupon': 'कूपन उपयोग करें',
      'btn.spin_now': 'घुमाएं',
      'btn.play_now': 'खेलें',
      'btn.claimed': 'प्राप्त किया ✓',
      'btn.explore_templates': 'टेम्प्लेट्स देखें →',
      'btn.close': 'बंद करें',

      // Rewards & Referral Hub
      'rewards.title': 'रिवॉर्ड्स और रेफरल हब',
      'rewards.hero_kicker': 'आपके वान्वी कॉइन्स',
      'rewards.tagline': '“छोटे-छोटे उपहार, अनमोल खुशियां।”',
      'rewards.exchange_rate': 'दर: 10 कॉइन्स = ₹1.00 · 40% तक छूट का लाभ',
      'rewards.tab_referral': '🎁 रेफर करें और कमाएं',
      'rewards.tab_wheel': '🎡 दैनिक लकी व्हील',
      'rewards.tab_coupons': '🎟️ प्रोमो कूपन्स',

      // Refer & Earn 4-Step Flow
      'referral.badge': '✦ खुशियां बांटें · कॉइन्स कमाएं',
      'referral.title': 'मित्रों को आमंत्रित करें और कॉइन्स पाएं',
      'referral.subtitle': 'अपने दोस्तों और प्रियजनों को वान्वी मोमेंट्स से जोड़ें। उन्हें मिलेगा 50 कॉइन्स का वेलकम बोनस, और आपको मिलेंगे 100 कॉइन्स जब वे जुड़कर अपना पहला खूबसूरत पल बनाएंगे!',
      'referral.step1_title': '1. मित्रों को आमंत्रित करें',
      'referral.step1_desc': 'अपना विशेष रेफरल कोड या लिंक व्हाट्सएप, इंस्टाग्राम या एसएमएस द्वारा साझा करें।',
      'referral.step2_title': '2. मित्र का जुड़ना (+50 कॉइन्स)',
      'referral.step2_desc': 'निशुल्क खाता बनाते ही आपके मित्र को तुरंत 50 कॉइन्स का स्वागत उपहार मिलेगा।',
      'referral.step3_title': '3. पहला पल बनाना',
      'referral.step3_desc': 'आपके मित्र अपना पहला डिजिटल ग्रीटिंग, सरप्राइज या उत्सव कार्ड तैयार करते हैं।',
      'referral.step4_title': '4. रिवॉर्ड अनलॉक (+100 कॉइन्स)',
      'referral.step4_desc': 'सीधे आपके वॉलेट में 100 कॉइन्स अपने आप जुड़ जाते हैं!',

      // Referral Card
      'referral.code_card_title': 'आपका व्यक्तिगत रेफरल कोड',
      'referral.code_card_sub': 'एक टैप में कॉपी करें और अपने प्रियजनों को भेजें:',
      'referral.stats_invited': 'आमंत्रित मित्र',
      'referral.stats_completed': 'बनाए गए पल',
      'referral.stats_earned': 'अर्जित कॉइन्स',

      // Daily Fortune Wheel & Lucky Moment
      'wheel.kicker': 'दैनिक सरप्राइज',
      'wheel.title': 'दैनिक फॉर्च्यून व्हील',
      'wheel.subtitle': 'हर 24 घंटे में एक बार घुमाएं और पाएं उत्सव कॉइन्स या सकारात्मक शुभकामनाएं!',
      'wheel.available': '✨ 1 निशुल्क दैनिक स्पिन उपलब्ध है',
      'wheel.next_in': 'अगला निशुल्क स्पिन उपलब्ध होगा:',
      'lucky.title': '✨ विशेष 14-दिवसीय लकी मोमेंट',
      'lucky.badge': 'प्रत्येक 14 दिन में एक बार',
      'lucky.desc': 'समर्पित क्रिएटर्स के लिए पाक्षिक सरप्राइज! 20 से 60 कॉइन्स का विशेष बोनस प्राप्त करें।',
      'lucky.btn': 'लकी मोमेंट क्लेम करें ✨',

      // Games Page
      'games.title': 'उत्सव गेम्स और अनलॉक',
      'games.kicker': '✦ खेलें. खोजें. अनलॉक करें.',
      'games.subtitle': 'कुशलता आधारित प्यारे खेल। प्रति गेम 2 से 10 कॉइन्स जीतें!',
      'games.daily_cap_title': 'दैनिक गेम्स कॉइन सीमा',
      'games.daily_cap_sub': 'दैनिक अधिकतम सीमा: 25 कॉइन्स · पूर्णतः कौशल आधारित',
      'games.completed_label': 'आज पूरे किए गए खेल',

      // Physical Gifts Store
      'gifts.title': 'चुनिंदा उपहार संग्रह',
      'gifts.subtitle': 'हर खास मौके के लिए चुने हुए उपहार। आधिकारिक स्टोर्स पर आसानी से देखें।',
      'gifts.view_amazon': 'अमेज़न पर देखें →',
      'gifts.view_flipkart': 'फ्लिपकार्ट पर देखें →',
      'gifts.view_meesho': 'मीशो पर देखें →',
      'gifts.disclaimer': 'उपहार लिंक आधिकारिक स्टोर पर ले जाते हैं। वान्वी मोमेंट्स सीधे भौतिक उत्पाद नहीं बेचता।',

      // Auth & Forms
      'auth.btn_whatsapp': 'व्हाट्सएप',
      'auth.lbl_identifier': 'ईमेल या मोबाइल नंबर'
    }
  };

  // Common quick-mapping table for standard site-wide button text if data-i18n is not explicitly set
  const TEXT_MATCHERS = {
    en: {
      'Create Moment': 'Create Moment',
      'Explore': 'Explore',
      'Templates': 'Templates',
      'Gifts': 'Gifts',
      'My Moments': 'My Moments',
      'VIP Plans': 'VIP Plans',
      'Rewards': 'Rewards',
      'Login': 'Login',
      'Sign In': 'Sign In',
      'Sign Up': 'Sign Up',
      'Go Back': 'Go Back',
      'Home': 'Home'
    },
    hi: {
      'Create Moment': 'नया पल बनाएं',
      'Explore': 'एक्सप्लोर करें',
      'Templates': 'टेम्प्लेट्स',
      'Gifts': 'उपहार',
      'My Moments': 'मेरे पल',
      'VIP Plans': 'वीआईपी प्लान्स',
      'Rewards': 'रिवॉर्ड्स',
      'Login': 'लॉग इन',
      'Sign In': 'लॉग इन',
      'Sign Up': 'साइन अप',
      'Go Back': 'पीछे जाएं',
      'Home': 'होम'
    }
  };

  class I18nManager {
    constructor() {
      this.currentLang = this.getStoredLanguage();
    }

    getStoredLanguage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'hi' || stored === 'en') return stored;
      } catch (e) {}
      return DEFAULT_LANG;
    }

    setLanguage(lang) {
      if (lang !== 'hi' && lang !== 'en') lang = 'en';
      this.currentLang = lang;
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {}

      document.documentElement.lang = lang;
      this.applyTranslations();
      this.updateToggles();

      // Dispatch event for components that need custom rerendering
      window.dispatchEvent(new CustomEvent('vanvi:langchange', { detail: { lang } }));
    }

    toggle() {
      const nextLang = this.currentLang === 'hi' ? 'en' : 'hi';
      this.setLanguage(nextLang);
    }

    t(key, fallback = '') {
      const langDict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
      if (langDict && langDict[key]) return langDict[key];
      const enDict = TRANSLATIONS.en;
      if (enDict && enDict[key]) return enDict[key];
      return fallback || key;
    }

    applyTranslations() {
      const isHindi = this.currentLang === 'hi';
      const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;

      // 1. Elements with [data-i18n]
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
          el.innerHTML = dict[key];
        }
      });

      // 2. Placeholders with [data-i18n-placeholder]
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) {
          el.setAttribute('placeholder', dict[key]);
        }
      });

      // 3. Titles / Aria labels with [data-i18n-title]
      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (dict[key]) {
          el.setAttribute('title', dict[key]);
          el.setAttribute('aria-label', dict[key]);
        }
      });
    }

    updateToggles() {
      const isHindi = this.currentLang === 'hi';
      const label = isHindi ? 'हिंदी / EN' : 'EN / हिंदी';

      document.querySelectorAll('.lang-toggle').forEach(btn => {
        btn.textContent = label;
        btn.setAttribute('title', isHindi ? 'Switch to English' : 'हिंदी में बदलें');
        if (isHindi) {
          btn.classList.add('active-hindi');
        } else {
          btn.classList.remove('active-hindi');
        }
      });

      // Update floating toggle if present
      const floatToggle = document.getElementById('vanviFloatingLangToggle');
      if (floatToggle) {
        floatToggle.innerHTML = isHindi ? '🌐 हिंदी (HI)' : '🌐 English (EN)';
      }
    }

    attachListeners() {
      // Connect to profile language selector if on profile page
      const profileSelect = document.getElementById('profileLanguageSelect');
      if (profileSelect) {
        profileSelect.value = this.currentLang;
        profileSelect.onchange = (e) => {
          this.setLanguage(e.target.value);
        };
      }
    }

    init() {
      // Only apply translation if user explicitly selected Hindi in profile settings
      if (this.currentLang === 'hi') {
        this.applyTranslations();
      }
      this.attachListeners();
    }
  }

  // Create global instance
  const i18n = new I18nManager();
  window.VanviI18n = i18n;

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
  } else {
    i18n.init();
  }

})(window, document);

