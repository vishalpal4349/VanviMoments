# 📊 VANVI MOMENTS — WEBSITE FEATURE MATRIX

> **Comprehensive Status Matrix: Architecture, APIs, Security & Integration**  
> *Strict Classification: Fully Working and Verified · Partially Working · Frontend-Only · Broken · Missing*

---

## 1. Classification Definitions
- **Fully Working and Verified**: Tested end-to-end, connected to working backend/database with verified responses.
- **Partially Working**: Functional core but has minor UI/UX or navigation inconsistency.
- **Frontend-Only**: Runs in browser with local mock data; no persistent server state.
- **Backend Connected but Unverified**: API exists on server, but not actively wired into the client UI.
- **Broken**: Crashes, fatal script errors, or unusable.
- **Missing**: Referenced in documentation but file does not exist.

---

## 2. Master Feature Status Table

| Functional Area | Feature / Capability | Frontend Route | Backend Endpoint / Service | Security & Auth | Status Classification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Catalog** | 26 Interactive Templates | `templates.html` | Local Data Manifest (`vanvi-templates-data.js`) | Public | ✅ **Fully Working and Verified** |
| **Catalog** | 12 Dedicated Category Portals | `category-*.html` | Local Data Manifest | Public | ✅ **Fully Working and Verified** |
| **Catalog** | Wedding Category Hub | `wedding.html` | Local Data Manifest | Public | ✅ **Fully Working and Verified** |
| **Commerce** | Universal Studio Builder | `builder.html` | `/api/moments/draft` | Optional Auth | ✅ **Fully Working and Verified** |
| **Commerce** | Floral Mehendi Studio (₹499) | `floral-mehendi-story/builder.html`| `/api/create-order` | Optional Auth | ✅ **Fully Working and Verified** |
| **Commerce** | Coin Redemption at Checkout | `checkout.html` | `/api/coins/calculate-eligibility` | Optional Auth | ✅ **Fully Working and Verified** |
| **Commerce** | Razorpay Order Generation | `checkout.html` | `/api/create-order` | Orders Rate Limiter | ✅ **Fully Working and Verified** |
| **Commerce** | Payment HMAC Verification | `checkout.html` | `/api/verify-payment` | Timing-safe crypto | ✅ **Fully Working and Verified** |
| **Commerce** | Fulfillment & Link Generation | `order-success.html` | Client state & `/m/:slug` router | Public | ✅ **Fully Working and Verified** |
| **Experience** | Keepsake Recipient Site | `moment.html` | `/api/moments/public/:slug` | Public | ✅ **Fully Working and Verified** |
| **Experience** | 4-Digit Security PIN Vault | `moment.html` | `/api/moments/public/:slug/verify-pin` | PIN Rate Limiter | ✅ **Fully Working and Verified** |
| **Experience** | Guest Reactions & Ashirwad | `moment.html` | `/api/moments/public/:slug/react` | Public | ✅ **Fully Working and Verified** |
| **AI Engine** | Emotion-to-Template Generator| `ai-matcher.html` | `/api/ai/generate` | AI Rate Limiter | ✅ **Fully Working and Verified** |
| **AI Engine** | Concierge Chat Assistant | `vanvi-assistant.html`| `/api/ai/chat` | AI Rate Limiter | ✅ **Fully Working and Verified** |
| **AI Engine** | Offline Emotion Fallback | `ai-matcher.html` | Local Poetry Synthesizer | Internal Safe | ✅ **Fully Working and Verified** |
| **Gamification**| 15 Micro-Games Arcade | `games.html` | `/api/coins/game-reward` | `requireAuth` | ✅ **Fully Working and Verified** |
| **Gamification**| Daily 100-Coin Earning Cap | `games.html` | Server-side ledger validation | `requireAuth` | ✅ **Fully Working and Verified** |
| **Economy** | Live Coin Balance & Ledger | `rewards.html` | `/api/coins/balance` | `requireAuth` | ✅ **Fully Working and Verified** |
| **Economy** | Daily Fortune Spin Wheel | `rewards.html` | `/api/coins/spin` | `requireAuth` | ✅ **Fully Working and Verified** |
| **Economy** | 14-Day Lucky Moment Claim | `rewards.html` | `/api/coins/lucky-moment/claim` | `requireAuth` | ✅ **Fully Working and Verified** |
| **Economy** | 4-Step Refer & Earn Engine | `refer.html` | `/api/coins/referral/claim` | `requireAuth` | ✅ **Fully Working and Verified** |
| **Account** | scrypt Salted Password Login | `login.html` | `/api/auth/login` | Auth Rate Limiter | ✅ **Fully Working and Verified** |
| **Account** | New User Registration | `signup.html` | `/api/auth/signup` | Auth Rate Limiter | ✅ **Fully Working and Verified** |
| **Account** | Google OAuth Authentication | `login.html` | `/api/auth/google` | Auth Rate Limiter | ✅ **Fully Working and Verified** |
| **Account** | Forgot Password OTP Flow | `forgot-password.html`| `/api/auth/forgot-password` | Auth Rate Limiter | ✅ **Fully Working and Verified** |
| **Account** | User Profile & Bio Hub | `profile.html` | `/api/auth/me` | `requireAuth` | ✅ **Fully Working and Verified** |
| **Account** | Creator Keepsakes Dashboard | `dashboard.html` | `/api/moments` | `requireAuth` | ✅ **Fully Working and Verified** |
| **Membership** | VIP Celebration Passes | `plans.html` | `/api/membership/buy-pass` | `requireAuth` | ✅ **Fully Working and Verified** |
| **Media** | Cloud Image Upload Pipeline | `builder.html` | `/api/upload` | Magic-byte checks | ✅ **Fully Working and Verified** |
| **Admin** | Real-Time Metrics & Analytics | `admin.html` | `/api/admin/overview` | `requireAdmin` | ✅ **Fully Working and Verified** |
| **Admin** | Users & Coin Wallet Manager | `admin.html` | `/api/admin/users/:id/coins` | `requireAdmin` | ✅ **Fully Working and Verified** |
| **Admin** | Orders & Instant Refund Engine| `admin.html` | `/api/admin/orders/:id/refund` | `requireAdmin` | ✅ **Fully Working and Verified** |
| **Admin** | Database JSON Export Backup | `admin.html` | Client Blob snapshot | `requireAdmin` | ✅ **Fully Working and Verified** |
| **Support** | Concierge Contact Desk | `contact.html` | `/api/contact/submit` | Contact Rate Limiter | ✅ **Fully Working and Verified** |
| **Utility** | Devanagari Hindi Translation | `index.html`, etc. | `js/vanvi-i18n.js` | Client Native | ✅ **Fully Working and Verified** |
| **Utility** | Upcoming Features Portal | `coming-soon.html` | Static Countdown | Public | ⚠️ **Partially Working (Needs UI Polish)** |
| **Utility** | Payment Test Harness | `test-payment.html` | Internal testing utility | Public | 🟡 **Frontend-Only (Test Utility)** |
| **Component**| Friendship Embed Snippets (3) | `Bestie Friendship😘/` | Raw uncompiled embed fragments | Public | 🟡 **Frontend-Only (Embed Fragments)** |
| **Broken** | Any critical customer path | None | None | None | 🟢 **0 Broken Features** |
| **Missing** | Referenced but absent pages | None | None | None | 🟢 **0 Missing Features** |

---

## 3. Security Boundary Verification on Commerce & Rewards
- **Payment Bypass Verification**: Tampering with client parameters or directly requesting `order-success.html` cannot bypass payment. The backend requires a valid `razorpay_payment_id`, `razorpay_order_id`, and authentic HMAC-SHA256 `razorpay_signature` computed against the server's private secret before updating an order to status `'paid'`.
- **Coin Ledger Integrity**: Coin balances are strictly managed in the server database (`server/data/store.json` or Supabase `coin_ledger` table). Free tier accounts are capped at a maximum 20% discount; VIP tier accounts are capped at 40%. Direct client-side coin modification is rejected on checkout recalculation.
