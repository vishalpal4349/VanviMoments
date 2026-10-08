# VANVI MOMENTS — MASTER QUALITY & SECURITY RULE

This rule is active for ALL phases, changes, features, and refactors until production-ready.

## Operational Mandate
For every future phase or change, do NOT only implement the requested feature. First inspect the existing architecture and use engineering judgment to detect and fix related problems, regressions, crashes, broken flows, security risks, performance issues, mobile/desktop issues, and integration conflicts.

## Architecture Preservation
- **Supabase**: Primary database, authentication, schemas, and data persistence.
- **Cloudinary**: Dedicated cloud media storage for images, videos, and music.
- **Common Core**: Shared infrastructure for persistence, uploads, routing, and sharing/QR generation.
- **Template World**: Each template MUST have its own unique, independent Builder + Experience.
- **Flexibility**: Never introduce fixed pricing, fixed field limits, or fixed photo/media limits.

## Security Mandate
- **Never expose private credentials** (Supabase service-role keys, Cloudinary API secrets, Razorpay secrets) in client-side code.
- **Environment & Server-Only**: Secrets belong strictly in `.env` and server-side configurations.
- **Authorization**: Enforce Row Level Security (RLS) and verified user authorization.
- **Validation**: Sanitize and validate all user inputs on both client and server.
- **Upload Guards**: Restrict file MIME types and size limits to prevent unsafe file uploads.
- **Financial Integrity**: Never trust client-side prices, order totals, or payment confirmations. All checkout operations must be validated against database records.
- **Error Handling**: Graceful degradation, sanitized error messages without stack trace leaks.

## Reliability & Performance
- **Resilience**: Loading, empty, error, and retry states across all dynamic views.
- **Backward Compatibility**: Preserve existing moment slugs, user data, and template-adapter contracts.
- **No Degradation**: Do not remove working features or simplify away core UX requirements.
- **Mobile-First**: Smooth 60fps animations, responsive touch physics, zero horizontal viewport overflow.
- **Accessibility**: Respect `prefers-reduced-motion` and ensure semantic accessible markup.

## Quality Verification Checklist (Required on Every Phase)
1. Inspect the complete affected subsystem.
2. Implement the requested enhancements.
3. Automatically identify related bugs, regressions, security risks, or layout flaws.
4. Safely fix any discovered issues.
5. Execute test suites (`scratch/test_phase1` through `scratch/test_phase5`).
6. Check all 9 existing templates for regressions (`birthday-3d-candle`, `birthday-3d-candle-surprise`, `birthday-white-bloom`, `birthday-wish-01`, `birthday-wish-02`, `constellation-love`, `golden-anniversary`, `retro-polaroid-wall`, `sincere-letter`).
7. Verify full flow: Template World → Personal Builder → Checkout → Experience → Share/QR.
8. Verify Supabase and Cloudinary integrations remain intact.
9. Report clearly what was implemented, inspected, and verified.
