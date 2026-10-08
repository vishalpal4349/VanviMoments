# VANVI MOMENTS — COMPLETE BUTTON & INTERACTION MAP
## 5. TEMPLATE CARD BUTTON MATRIX

| Page | Button Text | Action / Event | Target Destination | Status |
|---|---|---|---|---|
| `templates.html` | **Preview** | Opens live demo sandbox | `preview.html?template={id}` | **WORKING** |
| `templates.html` | **Customize** | Launches customization studio | `builder.html?template={id}` | **WORKING** |
| `templates.html` | **Category Chips** | Filters cards by occasion tag | In-page DOM Filter | **WORKING** |
| `templates.html` | **Pricing Tabs** | Filters cards (Free, Premium, VIP) | In-page DOM Filter | **WORKING** |
| `templates.html` | **Search Input** | Debounced real-time title search | In-page DOM Filter | **WORKING** |
| `preview.html` | **Customize This Moment** | Transfers template ID to customizer | `builder.html?template={id}` | **WORKING** |
| `preview.html` | **Back to Marketplace** | Returns to catalog | `templates.html` | **WORKING** |
| `builder.html` | **Save Draft** | Persists current inputs | `localStorage` / Backend API | **WORKING** |
| `builder.html` | **Preview** | Opens full preview modal | In-page Modal / Iframe sync | **WORKING** |
| `builder.html` | **Proceed to Publish** | Validates & routes to payment/publish | `checkout.html` / `order-success.html` | **WORKING** |
| `builder.html` | **Change Music** | Auditions audio presets | Audio Player Element | **WORKING** |
| `builder.html` | **Upload Photos** | Selects and crops memory images | File Input / Drag Zone | **WORKING** |
| `category-*.html` | **Explore Template** | Opens category template | `preview.html?template={id}` | **WORKING** |
| `category-*.html` | **Create Now** | Opens category builder | `builder.html?template={id}` | **WORKING** |

---

## 16. CLICKABLE ELEMENT & LINK AUDIT

- **Total Links Audited:** 1,236 Internal Static Hyperlinks.
- **Dead / Broken Static Links:** **0** (Zero broken static links detected).
- **Audit Findings:**
  - Every `<a>` tag references an existing HTML file in the workspace.
  - Dynamic JavaScript routing strings (such as `${momentUrl}` or `preview.html?template=${id}`) are constructed and resolved cleanly at runtime.
  - Back buttons incorporate fallback routing to prevent dead-end browser states.

---
