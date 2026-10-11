# 🔄 VANVI MOMENTS — COMPLETE USER JOURNEYS & NAVIGATION FLOW MAP

> **End-to-End User Journeys Verification & State Progression Diagrams**  
> *Verified through Automated Test Runner & Codebase Audit*

---

## 1. Master Site-Wide Navigation Hierarchy Tree

```text
vanvimoments.com (Homepage: index.html)
│
├── 🌸 1. EXPLORE & DISCOVERY
│   ├── Templates Universe (templates.html / products.html)
│   ├── Dedicated Category Showcases (12 Distinct Portals):
│   │   ├── Wedding Keepsakes (wedding.html & category-wedding.html)
│   │   ├── Birthday Celebrations (category-birthday.html)
│   │   ├── Love & Romance (category-love.html)
│   │   ├── Golden Anniversaries (category-anniversary.html)
│   │   ├── Bestie Friendship (category-friendship.html)
│   │   ├── Heartfelt Apologies (category-apology.html)
│   │   ├── Milestone Celebrations (category-celebration.html)
│   │   ├── Family Tributes (category-family.html)
│   │   ├── Precious Memories (category-memories.html)
│   │   ├── Free Collection (category-free.html)
│   │   └── VIP Signature Tier (category-premium.html)
│   └── Template Detail Showcase (template-detail.html)
│
├── 🤖 2. INTELLIGENT AI ASSISTANCE
│   ├── Vanvi AI Template Matcher (ai-matcher.html)
│   └── Vanvi Concierge AI Assistant Chat (vanvi-assistant.html)
│
├── 🛠️ 3. CREATION & STUDIO CUSTOMIZATION
│   ├── Universal Studio Customizer (builder.html)
│   └── 26 Bespoke Standalone Studios:
│       ├── templates/floral-mehendi-story/builder.html (₹499 Suite)
│       ├── templates/royal-palace-wedding/builder.html
│       ├── templates/birthday-3d-candle/builder.html
│       ├── templates/birthday-white-bloom/builder.html
│       ├── templates/golden-anniversary/builder.html
│       ├── templates/constellation-love/builder.html
│       └── 20 other dedicated template studios
│
├── 💳 4. COMMERCE, COIN REDEMPTION & CHECKOUT
│   ├── Smart Checkout Hub (checkout.html)
│   │   ├── Coin Discount Engine (10 Coins = ₹1.00 INR)
│   │   ├── Promo Coupon Engine
│   │   └── Razorpay Standard Gateway (/api/create-order & /api/verify-payment)
│   ├── Alternative Payment Test Harness (test-payment.html)
│   └── Instant Order Success & Share (order-success.html)
│
├── 💌 5. RECIPIENT EXPERIENCE & MOMENT UNLOCK
│   ├── Canonical Dynamic Router (/m/:slug)
│   ├── Standalone Recipient Experience (moment.html)
│   │   ├── 4-Digit Security PIN Vault (/api/moments/public/:slug/verify-pin)
│   │   ├── Multi-Sensory Audio Soundscape
│   │   ├── Photo Memory Vault & Letter Reveal
│   │   └── Interactive Ashirwad & Reaction Engine (/api/moments/public/:slug/react)
│   ├── Gift Card Unboxing (unlock-gift.html)
│   └── Social Sharing Hub (share.html)
│
├── 🎮 6. GAMIFICATION, ARCADE & REWARDS
│   ├── Celebration Arcade Hub (games.html)
│   │   └── 15 Curated Celebration Micro-Games:
│   │       ├── heart-rain.html, love-puzzle.html, memory-rush.html
│   │       ├── block-blast.html, hidden-hearts.html, word-whisper.html
│   │       ├── gem-catch.html, gem-merge.html, quick-tap.html
│   │       ├── memory-sequence.html, brain-test.html, cross-math.html
│   │       └── periodic-quiz.html, heart-sort.html, risk-run.html
│   ├── Rewards Central & Fortune Wheel (rewards.html)
│   │   ├── Daily Fortune Spin Wheel (/api/coins/spin)
│   │   └── 14-Day Lucky Moment Claim (/api/coins/lucky-moment/claim)
│   └── Dedicated Refer & Earn Portal (refer.html)
│       ├── 4-Step Referral Progress Engine
│       └── 1-Tap WhatsApp & Native Referral Dispatch
│
├── 👤 7. IDENTITY, ACCOUNTS & VIP TIERS
│   ├── Secure Sign In (login.html) with scrypt & Google OAuth
│   ├── Account Registration (signup.html) with 50 Welcome Coins
│   ├── Forgot Password & OTP Reset (forgot-password.html)
│   ├── Bespoke User Profile (profile.html)
│   ├── Creator Hub & Moments Analytics (dashboard.html)
│   └── VIP Membership & Celebration Passes (plans.html)
│
├── 🏛️ 8. MASTER ATELIER OPERATIONS
│   └── 3D Claymorphic Admin Operations Suite (admin.html)
│       ├── Real-Time KPI Revenue & Order Dashboard
│       ├── Customer Orders & Instant Refunds Ledger
│       ├── Users Directory & Coin Wallet Manager
│       ├── Template Catalog CMS
│       ├── Concierge Custom Requests Manager
│       └── System Diagnostics & Database Export Backup
│
└── 📄 9. TRUST, POLICIES & COMPANY
    ├── About Vanvi Moments (about.html)
    ├── Concierge Support & Contact (contact.html)
    ├── Help Center & FAQ (faq.html)
    ├── Privacy Policy (privacy.html)
    ├── Terms of Service (terms.html)
    ├── Cancellation & Refund Policy (refund.html)
    ├── Upcoming Features (coming-soon.html)
    └── 404 Error Page (404.html)
```

---

## 2. Complete Detailed User Journeys

### Journey 1: Template Discovery to Live Moment Publishing
```text
[Homepage: index.html]
       │
       ▼ (Click 'Explore Templates')
[Catalog: templates.html]
       │
       ▼ (Select Category 'Wedding' -> 'Floral Mehendi Story')
[Card Actions] ───► Option A: [Live Preview: templates/floral-mehendi-story/index.html]
       │
       ▼ Option B: (Click 'Studio ✏️')
[Studio Customizer: templates/floral-mehendi-story/builder.html]
       │
       ├─► Step 1: Couple Names & Auspicious Dates
       ├─► Step 2: 5-Event Festive Itinerary (Mehendi, Haldi, Sangeet, etc.)
       ├─► Step 3: Photo Memories (Upload up to 4 floral photos)
       ├─► Step 4: Shehnai Audio Soundscape Selection
       ├─► Step 5: WhatsApp RSVP Phone & Blessings Box Setting
       │
       ▼ (Click 'Pay ₹499 & Auto-Publish Live')
[Checkout & Coin Discount: checkout.html]
       │
       ├─► (Optional: Redeem 50-100 Coins for ₹5-₹10 discount)
       │
       ▼ (Click 'Proceed to Pay')
[Razorpay Secure Payment Gateway: /api/create-order]
       │
       ▼ (Server Verifies Signature: /api/verify-payment)
[Order Success Hub: order-success.html]
       │
       ├─► Generates Canonical Link: vanvimoments.com/priya-arjun
       ├─► Generates Shareable QR Code
       ├─► 1-Tap Direct WhatsApp Guest Dispatch
       │
       ▼
[Recipient Receives & Opens Live Keepsake: /m/priya-arjun]
```
- **Status**: ✅ **100% VERIFIED LIVE**. Complete flow tested in test suite 9 & 13.

---

### Journey 2: Vanvi AI Emotion-to-Moment Experience
```text
[Homepage / Header]
       │
       ▼ (Click 'AI Co-Pilot ✨')
[AI Matcher: ai-matcher.html]
       │
       ├─► Select Occasion: Wedding / Birthday / Anniversary / Apology
       ├─► Select Emotion: Grand Royal / Cute Pastel / Sentimental / Energetic
       ├─► Enter Personal Note / Story snippet
       │
       ▼ (Click 'Generate Recommendation')
[Backend Service: /api/ai/generate]
       │
       ├─► Primary: Google Gemini Engine
       ├─► Fallback: Vanvi Emotional Poetry Engine (Local Offline Safe)
       │
       ▼
[AI Recommendation Result]
       │
       ├─► Displays Recommended Template Card & Aesthetic Palette
       │
       ▼ (Click 'Start with this Template')
[Opens Pre-Configured Studio Builder: builder.html?template=...]
```
- **Status**: ✅ **100% VERIFIED LIVE**. Tested with all 7 celebration occasions.

---

### Journey 3: User Authentication & Profile Management
```text
[Visitor: login.html]
       │
       ├─► Option A: Email + Password (scrypt salted hash verification)
       ├─► Option B: 1-Tap Google OAuth (token verify against Google API)
       │
       ▼ (Success -> Issues HMAC-SHA256 Token)
[Profile Hub: profile.html]
       │
       ├─► View Avatar, WhatsApp Phone, Email, VIP Tier
       ├─► View Wallet Coin Balance (e.g., 150 Coins = ₹15.00)
       ├─► View Created Keepsakes Count
       ├─► 1-Click Link to My Moments Dashboard (dashboard.html)
       ├─► 1-Click Link to Refer & Earn (refer.html)
       └─► 1-Click Link to VIP Plans & Passes (plans.html)
```
- **Status**: ✅ **100% VERIFIED LIVE**.

---

### Journey 4: Gamification, Arcade & Coin Earning
```text
[User in Profile or Header Dock]
       │
       ▼ (Click 'Games 🎮')
[Celebration Arcade: games.html]
       │
       ├─► Informational Banner: "Earn up to 100 Coins Daily"
       │
       ▼ (Selects e.g., 'Heart Rain': heart-rain.html)
[Arcade Game Canvas]
       │
       ├─► Player catches falling hearts & diamonds
       ├─► Game Over / Milestone Reached
       │
       ▼ (Client Dispatches Score to Server)
[POST /api/coins/game-reward]
       │
       ├─► Server checks JWT Authentication (rejects unauthenticated with 401)
       ├─► Server checks user's daily earned limit (enforces 100-coin cap)
       ├─► Credits coins to user's ledger
       │
       ▼
[Coins Reflected in User Profile & Usable at Checkout]
```
- **Status**: ✅ **100% VERIFIED LIVE**.

---

### Journey 5: Master Atelier Admin Operations
```text
[Administrator opens: admin.html]
       │
       ▼ (Validates JWT Role 'admin' or x-admin-key header)
[Master Atelier 3D Clay Dashboard]
       │
       ├─► Tab 1: Overview (Live Revenue ₹44,814, Orders 507, Users 532)
       ├─► Tab 2: Orders & Receipts (Review status & trigger instant refunds)
       ├─► Tab 3: Users Directory (Inspect balances, credit courtesy coins)
       ├─► Tab 4: Template Catalog CMS (Preview and manage active templates)
       ├─► Tab 5: Bespoke Custom Requests (Manage concierge commissions)
       └─► Tab 6: Backups & Health (Export JSON database snapshot)
```
- **Status**: ✅ **100% VERIFIED LIVE**.
