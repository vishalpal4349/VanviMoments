# VANVI MOMENTS — COMPLETE USER FLOW & NAVIGATION MAP
## 3. COMPLETE WEBSITE NAVIGATION MAP

```
VANVI MOMENTS PLATFORM ARCHITECTURE
│
├── 🌐 HOME (index.html)
│   │
│   ├── 📂 TEMPLATES MARKETPLACE (templates.html)
│   │   ├── 🏷️ Category Showcases
│   │   │   ├── category-birthday.html
│   │   │   ├── category-anniversary.html
│   │   │   ├── category-love.html
│   │   │   ├── category-apology.html
│   │   │   ├── category-friendship.html
│   │   │   ├── category-celebration.html
│   │   │   ├── category-family.html
│   │   │   ├── category-memories.html
│   │   │   ├── category-premium.html
│   │   │   └── category-free.html
│   │   │
│   │   ├── 👁️ Live Preview (preview.html?template=...)
│   │   │   └── Direct Launch → builder.html
│   │   │
│   │   └── 🛠️ Studio Customizer (builder.html?template=...)
│   │       ├── 💾 Local Draft Persistence
│   │       ├── 🎵 Music Selector & Audio Upload
│   │       ├── 📸 Photo Dropper & Memory Gallery
│   │       └── 💳 Publish / Checkout Router
│   │           ├── [If Free Template] ───> 🎉 Instant Publish (/m/:slug)
│   │           └── [If Premium/VIP]  ───> 💳 checkout.html
│   │                                       │
│   │                                       ├── 🎟️ Apply Coupon (/api/coupons/apply)
│   │                                       ├── 🪙 Redeem Coins (up to 40% off)
│   │                                       └── 🔒 Razorpay Payment Gateway
│   │                                           │
│   │                                           └── 🎊 order-success.html
│   │                                               └── 🚀 Publish Trigger
│   │
│   ├── 💌 RECIPIENT MOMENT EXPERIENCE (moment.html & /m/:slug)
│   │   ├── 🔒 Passcode Unlock Gate
│   │   ├── 🎂 Interactive Animation Reveal
│   │   ├── 🎶 Background Music Player
│   │   └── 📤 Share Hub (share.html)
│   │       ├── 📱 Dynamic QR Code Generator
│   │       ├── 💬 Direct WhatsApp One-Tap Share
│   │       └── 📋 Copy Shareable URL
│   │
│   ├── 🤖 AI CREATIVE SUITE
│   │   ├── ✍️ AI Studio & Wishes (ai.html)
│   │   │   └── Send text to builder.html
│   │   ├── 🐼 Panda AI Matcher (ai-matcher.html)
│   │   │   └── 4-Step Quiz ──> Curated Recommendations ──> preview.html / builder.html
│   │   └── 💬 Vanvi Concierge Assistant (vanvi-assistant.html)
│   │
│   ├── 🎮 GAMIFIED REWARDS & VIRAL GROWTH
│   │   ├── 🕹️ Game Center Hub (games.html)
│   │   │   ├── 1. heart-rain.html (Falling Reflex Catcher)
│   │   │   ├── 2. heart-sort.html (Color Sorting)
│   │   │   ├── 3. block-blast.html (8x8 Tile Matching)
│   │   │   ├── 4. gem-merge.html (2048 Physics Drop)
│   │   │   ├── 5. memory-rush.html (Card Match Timer)
│   │   │   ├── 6. memory-sequence.html (Simon Audio Pattern)
│   │   │   ├── 7. quick-tap.html (Reflex Speed Tap)
│   │   │   ├── 8. gem-catch.html (Horizontal Paddle)
│   │   │   ├── 9. word-whisper.html (Emotional Word Puzzle)
│   │   │   ├── 10. unlock-gift.html (3-Digit Logic Safe)
│   │   │   ├── 11. cross-math.html (Mental Arithmetic)
│   │   │   └── 12. love-puzzle.html (Sliding Jigsaw)
│   │   │
│   │   ├── 🎡 Rewards Hub (rewards.html)
│   │   │   ├── 🎰 Daily Lucky Spin Wheel
│   │   │   └── 🪙 Coin Ledger & Perks
│   │   │
│   │   └── 🎁 Refer & Earn Engine (refer.html)
│   │       ├── 📋 Copy Unique Referral Code / Link
│   │       ├── 💬 Direct WhatsApp Invitation Trigger
│   │       └── 📊 50/100 Coin Reward Tracker
│   │
│   ├── 👤 USER ACCOUNT SYSTEM
│   │   ├── 🔑 login.html (Email, Magic Link, Google Auth)
│   │   ├── 📝 signup.html (Registration with Referral Code Input)
│   │   ├── ❓ forgot-password.html (Password Recovery)
│   │   ├── 📊 dashboard.html (Quick Stats & Draft Overview)
│   │   └── ⚙️ profile.html
│   │       ├── 👤 Personal Information & Avatar Picker
│   │       ├── 🗂️ My Moments (Edit, View, Delete, Share)
│   │       ├── 🧾 Order History & Invoices
│   │       ├── 🪙 Rewards & Coin Balance
│   │       └── 🚪 Secure Logout
│   │
│   ├── 💼 COMMERCIAL PACKAGES & BESPOKE REQUESTS
│   │   ├── 🏷️ plans.html (Free vs Premium vs VIP Comparison)
│   │   ├── 🛍️ products.html (Digital & Keepsake Physical Add-ons)
│   │   └── 🎨 custom-experience.html (Bespoke 3D Atelier Request Form)
│   │
│   ├── 🛡️ ADMINISTRATION & OPS
│   │   └── 👑 admin.html (Master Atelier Admin Control Suite)
│   │       ├── 📈 Metrics Dashboard
│   │       ├── 🛡️ Moment Moderation
│   │       ├── 💰 Orders & Refunds
│   │       ├── 🎟️ Coupon Management
│   │       └── 🔧 AI Diagnostics & Maintenance Toggle
│   │
│   └── 📜 LEGAL, TRUST & COMPLIANCE
│       ├── ℹ️ about.html
│       ├── 📞 contact.html
│       ├── ❓ faq.html
│       ├── 🔒 privacy.html
│       ├── ⚖️ terms.html
│       ├── 💸 refund.html
│       ├── 🚀 coming-soon.html
│       └── 🛑 404.html
```

---

## 4. TEMPLATE SYSTEM — FULL FLOW

### 4.1 Step-by-Step Architecture:
1. **Browse & Discovery:** User accesses `templates.html` or any of the 10 `category-*.html` pages. Templates can be filtered by tags (`birthday`, `anniversary`, `love`, `apology`, `friendship`) and tier (`free`, `premium`, `vip`).
2. **Interactive Preview:** Clicking "Preview" loads `preview.html?template={id}`. This renders a live, full-screen sandbox containing sample names, photos, and music so the user can experience the animation before customizing.
3. **Studio Customization:** Clicking "Customize" or "Create Moment" opens `builder.html?template={id}`. The builder mounts the dedicated template schema:
   - Recipient & Sender Names
   - Special Date (e.g. Birthday, Anniversary milestone)
   - Photo Upload (1 to 10 photos depending on template layout)
   - Background Music selection (Preset audio library or custom MP3 upload)
   - Personal Message / Emotional Letter
   - Secret Unlock PIN (Optional 4-digit code)
4. **Draft Persistence:** Automatically auto-saves to `localStorage` key `vanvi_builder_draft_{id}`. Logged-in users can also sync drafts to the server via `/api/moments/draft`.
5. **Checkout & Publishing Router:**
   - **Free Templates:** Clicking "Publish Moment" skips checkout and immediately calls `/api/moments/create`. Generates a unique URL slug (e.g. `rohit-birthday-8921`) and redirects to `order-success.html` or directly to `share.html`.
   - **Premium (₹199) & VIP (₹499) Templates:** Redirects to `checkout.html`.
     - Validates order with backend `/api/create-order`.
     - Allows user to redeem up to 40% discount with Vanvi Coins.
     - Allows applying promo coupons.
     - Launches Razorpay payment modal.
     - On successful signature verification via `/api/verify-payment`, moment state updates to `published = true`.
6. **Canonical Recipient URL:**
   - Server route in `server/server.js`: `app.get('/m/:slug', ...)`.
   - If the template corresponds to a bespoke folder in `templates/:id/index.html`, the server renders it directly with the customized JSON payload injected into the DOM.
   - If using the universal engine, renders `moment.html` with the moment ID.
7. **Viral Sharing Hub (`share.html` & Share Modal):**
   - Renders a dynamic, high-resolution QR code generated on canvas via `qrcode.min.js`.
   - One-tap WhatsApp button opening `wa.me/?text=...` with pre-crafted celebratory copy.
   - One-tap clipboard copy button with success feedback.
   - Native Web Share API trigger on mobile devices.

### 4.2 Template Verification Status:
| Step | Functionality | Verified Status | Evidence |
|---|---|---|---|
| 1. Marketplace Filter | Search, category chips, tier filter | **WORKING** | `templates.html` DOM event listeners |
| 2. Live Preview | High-fidelity iframe render | **WORKING** | `preview.html` query param loader |
| 3. Photo Upload | Multi-photo preview, base64 / Supabase storage | **WORKING** | `builder.html` drag-drop file handler |
| 4. Audio Selection | Presets + Custom MP3 playback | **WORKING** | HTML5 Audio API & track selector |
| 5. Draft Auto-Save | LocalStorage auto-save | **WORKING** | `vanvi_builder_draft` key in localStorage |
| 6. Razorpay Payment | Order creation & HMAC signature check | **WORKING** | `/api/create-order` & `/api/verify-payment` |
| 7. Canonical Route | `/m/:slug` Express route handler | **WORKING** | `server/server.js` lines 64-105 |
| 8. Share & QR Code | Canvas QR + WhatsApp deep link | **WORKING** | `share.html` & `qrcode.min.js` |

---

## 19. COMPLETE USER JOURNEYS

### Journey 1: Standard Creation & Commercial Publishing
```
Home (index.html) [✅ Working]
  ──> Templates Marketplace (templates.html) [✅ Working]
  ──> Live Template Preview (preview.html) [✅ Working]
  ──> Studio Customizer (builder.html) [✅ Working]
  ──> Photo Upload & Audio Selection [✅ Working]
  ──> Commercial Checkout (checkout.html) [✅ Working]
  ──> Coin Discount & Coupon Applied [✅ Working]
  ──> Razorpay Payment Success (/api/verify-payment) [✅ Working]
  ──> Order Confirmation (order-success.html) [✅ Working]
  ──> Canonical Moment Render (/m/:slug) [✅ Working]
  ──> Share via WhatsApp & QR (share.html) [✅ Working]
```

### Journey 2: AI-Assisted Recommendation & Generation
```
Home (index.html) [✅ Working]
  ──> Panda AI Matcher (ai-matcher.html) [✅ Working]
  ──> 4-Step Quiz Completed [✅ Working]
  ──> Curated Recommendation Generated [✅ Working]
  ──> Vanvi AI Studio (ai.html) drafts personalized poem [✅ Working]
  ──> Text Injected into Customizer (builder.html) [✅ Working]
```

### Journey 3: Account Management & Moment Administration
```
Sign In (login.html) [✅ Working]
  ──> User Profile Dashboard (profile.html) [✅ Working]
  ──> View 'My Moments' Collection [✅ Working]
  ──> Inspect Analytics & Recipient Views [✅ Working]
  ──> Trigger Direct Moment Re-Share [✅ Working]
```

### Journey 4: Viral Growth & Reward Monetization
```
User visits Refer & Earn (refer.html) [✅ Working]
  ──> Copies Unique Code / Taps WhatsApp Share [✅ Working]
  ──> Friend signs up via link and gets 50 coins [✅ Working]
  ──> User earns 100 coins on friend's first publish [✅ Working]
  ──> User redeems coins for 40% discount at Checkout [✅ Working]
```

### Journey 5: Free Moment Rapid Publishing
```
Category Free Showcase (category-free.html) [✅ Working]
  ──> Select Free Template [✅ Working]
  ──> Personalize in Builder Studio (builder.html) [✅ Working]
  ──> Instant Publish (Skips Razorpay Checkout) [✅ Working]
  ──> Instant Moment URL Generated (/m/:slug) [✅ Working]
```

### Journey 6: Casual Gaming & Daily Reward Loop
```
Games Hub (games.html) [✅ Working]
  ──> Launch Curated Game (e.g. Heart Rain / Block Blast) [✅ Working]
  ──> Complete Level / Win High Score [✅ Working]
  ──> 2–5 Coins Awarded (Subject to 30-coin daily cap) [✅ Working]
  ──> Balance reflected in Global Navigation Header [✅ Working]
```

### Journey 7: System Administration & Moderation
```
Admin Portal (admin.html) [✅ Working]
  ──> Passcode Authenticated [✅ Working]
  ──> Real-time Revenue & Server Health Inspected [✅ Working]
  ──> User Moment Moderation & Coupon Generation [✅ Working]
```

---
