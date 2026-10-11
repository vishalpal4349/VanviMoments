# ⚡ VANVI MOMENTS — WEBSITE QUICK SUMMARY

> **Master System Audit & Architecture Overview**  
> *Generated on: October 11, 2026 | Vanvi Moments Production Platform*

---

## 1. Executive Summary

**Vanvi Moments** (`vanvimoments.com`) is an ultra-luxury digital celebration keepsakes platform and bespoke invitation builder. The platform allows users to craft, customize, purchase, and share interactive digital invitation websites for Weddings, Anniversaries, Birthdays, Friendship Days, and Apologies.

The application combines a high-performance **Express.js backend** with a **vanilla HTML5/CSS/JavaScript client**, backed by a transactional data repository and **Supabase / PostgreSQL database**, **Razorpay** payment gateway, **Cloudinary** media storage, **Google Gemini AI** emotion co-pilot, and a **Coin/Reward gamification economy**.

---

## 2. Platform Scale & Inventory Metrics

| Category | Metric Count | Verified Status |
| :--- | :--- | :--- |
| **Total HTML Pages Discovered** | **155 Pages** | 100% accounted for |
| **Dedicated Category Showcases** | **12 Portals** | Polished & Verified |
| **Interactive Template Experiences** | **26 Unique Suites** | 26 Index, 26 Builders, 26 Previews |
| **Micro-Games & Arcade Challenges** | **15 Games** | Fully functional DOM/Canvas |
| **Backend REST API Endpoints** | **45+ Endpoints** | Express Router + Rate Limited |
| **Database Tables & Schemas** | **8 Schemas** | PostgreSQL / Supabase + JSON Store |
| **Automated Test Suites** | **15 Suites** | 14 Passed 100%, 1 at 92% (35/38 checks) |

---

## 3. Technology Stack & Integrations

- **Frontend Core**: Vanilla HTML5, CSS3 Custom Properties (Design System), Modular ES6 JavaScript. No heavyweight framework bloat.
- **Backend Core**: Node.js v24, Express 5.2.1, CORS, Reverse-proxy aware (`trust proxy: 1`).
- **Database Architecture**: Hybrid dual-engine — Dual-layer transactional storage (`server/data/store.json`) with seamless auto-migration to **Supabase PostgreSQL** (`server/services/supabase.service.js`).
- **Payments**: Razorpay (Webhooks, HMAC-SHA256 signature verification, Order creation API `/api/create-order`, direct `/api/verify-payment`). Cashfree fallback structure.
- **AI Engine**: Google Gemini API (`gemini-pro` / emotional poetry engine) with robust local offline fallback for 7 distinct celebration occasions.
- **Media & Asset Management**: Cloudinary signed uploads with Magic-Byte file inspection and local disk upload fallback.
- **Gamification & Coins**: 10 Coins = ₹1.00 INR discount (up to 20-40% order discount cap). Daily Fortune Wheel, 14-day Lucky Moment, 4-step Referral system.
- **Administration**: Master Atelier 3D Claymorphic Admin Portal (`admin.html`) featuring 20 operations modules, real-time metrics, user directory, refund issuing, and CMS manager.

---

## 4. Key Strengths

1. **High Visual Aesthetics**: Hand-crafted micro-animations, glassmorphism, 3D parallax, Devanagari Hindi support, and responsive typography across all templates.
2. **Offline-Resilient Architecture**: Every cloud integration (Supabase, Razorpay, Cloudinary, Gemini, SMTP) has a verified, graceful local fallback that prevents application crashes.
3. **Comprehensive Test Coverage**: 15 custom test suites covering cryptography, payment webhooks, database DDLs, legal compliance, and mobile responsive layouts.
4. **Security Hardening**: Strict Content-Security-Policy, HSTS, timing-safe equality checks for hashes, IP-based sliding rate limiters, and scrypt password hashing.

---

## 5. Primary Bottlenecks & Attention Areas

1. **Hardcoded Admin Key Default**: In `server/middleware/auth.js`, `process.env.ADMIN_SECRET_KEY` falls back to a development string if not configured in `.env`.
2. **Duplicate Template Directories**: Some templates exist both in root (e.g., `floral-mehendi-story/`) and inside `templates/floral-mehendi-story/`.
3. **Smart Back Button Consistency**: `products.html` and `games.html` lacked the exact `history.back()` inline check required by test suite 15.
4. **Emoji in Directory Names**: Directory `Bestie Friendship😘/` contains Unicode emoji characters which can create encoding nuances on certain non-UTF8 file systems.

---

*For detailed button-by-button matrix, complete page maps, and security reports, refer to [WEBSITE_A_TO_Z_MAP.md](file:///c:/Users/RISHU%20KUMARI/VanviMoments/WEBSITE_A_TO_Z_MAP.md) and [SECURITY_AUDIT_REPORT.md](file:///c:/Users/RISHU%20KUMARI/VanviMoments/SECURITY_AUDIT_REPORT.md).*
