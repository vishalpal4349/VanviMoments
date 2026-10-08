# VANVI MOMENTS — MASTER FEATURE MATRIX
## 17. MASTER FEATURE MATRIX

| Feature Name | Primary Page | Backend / API Endpoint | Auth Req? | Payment Req? | Mobile | Desktop | Status |
|---|---|---|---|---|---|---|---|
| **Template Marketplace** | `templates.html` | `/api/templates` | No | No | PASS | PASS | **🟢 Polished** |
| **Category Showcases** | `category-*.html` | Static / Client | No | No | PASS | PASS | **🟢 Polished** |
| **Interactive Preview** | `preview.html` | `/templates/:id` | No | No | PASS | PASS | **🟢 Polished** |
| **Moment Builder Studio**| `builder.html` | `/api/moments/draft` | No | No | PASS | PASS | **🟢 Polished** |
| **Photo Upload Engine** | `builder.html` | `/api/upload` / Supabase | No | No | PASS | PASS | **🟢 Polished** |
| **Music Player & Selector**| `builder.html` | Static Audio Presets | No | No | PASS | PASS | **🟢 Polished** |
| **Moment Render Engine** | `moment.html` | `/m/:slug` / Express | No | No | PASS | PASS | **🟢 Polished** |
| **Dynamic QR Generator** | `share.html` | Client `qrcode.min.js`| No | No | PASS | PASS | **🟢 Polished** |
| **WhatsApp Direct Share** | `share.html` | WhatsApp Web / App API| No | No | PASS | PASS | **🟢 Polished** |
| **AI Wish & Poetry Generator**| `ai.html` | `/api/ai/generate` | No | No | PASS | PASS | **🟢 Polished** |
| **Panda AI Matcher Quiz**| `ai-matcher.html` | Client Logic + API | No | No | PASS | PASS | **🟢 Polished** |
| **Vanvi Concierge Assistant**| `vanvi-assistant.html`| `/api/ai/chat` | No | No | PASS | PASS | **🟢 Polished** |
| **User Sign In / Sign Up**| `login.html` | `/api/auth` / Supabase | N/A | No | PASS | PASS | **🟢 Polished** |
| **User Profile Management**| `profile.html` | `/api/auth/me` | Yes | No | PASS | PASS | **🟢 Polished** |
| **My Moments Collection**| `profile.html` | `/api/moments/user` | Yes | No | PASS | PASS | **🟢 Polished** |
| **Refer & Earn System** | `refer.html` | `/api/coins/referral-stats`| Optional | No | PASS | PASS | **🟢 Polished** |
| **Daily Spin Wheel** | `rewards.html` | `/api/coins/spin` | Optional | No | PASS | PASS | **🟢 Polished** |
| **Game Center Hub** | `games.html` | `/api/coins/earn` | Optional | No | PASS | PASS | **🟢 Polished** |
| **12 Curated Mini-Games**| Dedicated HTMLs | Client Logic + Coin API | No | No | PASS | PASS | **🟢 Polished** |
| **Razorpay Checkout** | `checkout.html` | `/api/create-order` | Optional | Yes | PASS | PASS | **🟢 Polished** |
| **Payment Verification** | `checkout.html` | `/api/verify-payment` | Optional | Yes | PASS | PASS | **🟢 Polished** |
| **Coin Discount Engine** | `checkout.html` | `/api/coins/redeem` | Yes/Local | No | PASS | PASS | **🟢 Polished** |
| **Promo Coupon System** | `checkout.html` | `/api/coupons/apply` | No | No | PASS | PASS | **🟢 Polished** |
| **Order Receipt & Confirm**| `order-success.html`| `/api/orders/:id` | No | No | PASS | PASS | **🟢 Polished** |
| **Pricing Comparison Matrix**| `plans.html` | Static Content | No | No | PASS | PASS | **🟡 Needs Polish** |
| **Products & Keepsakes** | `products.html` | Static / Inquiry Form | No | No | PASS | PASS | **🟡 Needs Polish** |
| **Custom 3D Experience Form**| `custom-experience.html`| `/api/custom-requests`| No | No | PASS | PASS | **🟡 Needs Polish** |
| **Master Atelier Admin** | `admin.html` | `/api/admin/*` | Yes (Passcode)| No | PASS | PASS | **🟠 Needs UX Work**|

---
