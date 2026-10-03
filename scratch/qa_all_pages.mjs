// Visit every page at mobile + desktop widths; collect console errors, failed requests, overflow
export default async function run(page) {
  const pages = [
    "index.html",
    "templates.html",
    "template-detail.html?id=birthday-cinematic",
    "builder.html",
    "checkout.html",
    "dashboard.html",
    "ai.html",
    "ai-matcher.html",
    "vanvi-assistant.html",
    "plans.html",
    "rewards.html",
    "custom-experience.html",
    "login.html",
    "signup.html",
    "forgot-password.html",
    "admin.html",
    "moment.html",
    "share.html",
    "profile.html",
    "about.html",
    "contact.html",
    "faq.html",
    "privacy.html",
    "terms.html",
    "refund.html",
    "games.html",
    "order-success.html",
    "coming-soon.html",
    "404.html",
    "category-birthday.html",
    "category-love.html",
    "category-anniversary.html",
    "category-friendship.html",
    "category-family.html",
    "category-apology.html",
    "category-celebration.html",
    "category-memories.html",
    "category-premium.html",
    "category-free.html",
  ];
  const widths = [360, 1280];
  const report = {};
  for (const p of pages) {
    report[p] = {};
    for (const w of widths) {
      const errors = [];
      const failed = [];
      const onErr = (e) => errors.push(String(e.message || e).slice(0, 200));
      const onCon = (m) => {
        if (m.type() === "error") errors.push(m.text().slice(0, 200));
      };
      const onFail = (r) => {
        const u = r.url();
        if (!/google|gstatic|fonts/.test(u))
          failed.push(u.replace("http://localhost:3000", ""));
      };
      page.on("pageerror", onErr);
      page.on("console", onCon);
      page.on("requestfailed", onFail);
      await page.setViewportSize({ width: w, height: 800 });
      try {
        await page.goto("http://localhost:3000/" + p, {
          waitUntil: "load",
          timeout: 20000,
        });
        await page.waitForTimeout(600);
        const m = await page.evaluate(() => {
          const sw = document.documentElement.scrollWidth,
            cw = document.documentElement.clientWidth;
          const bg = getComputedStyle(document.body).backgroundColor;
          const bigBtns = [
            ...document.querySelectorAll("button,a.btn,.btn"),
          ].filter((b) => {
            const r = b.getBoundingClientRect();
            return r.width > window.innerWidth + 2;
          }).length;
          const links404 = [...document.querySelectorAll("a[href]")].filter(
            (a) => a.getAttribute("href") === "#",
          ).length;
          return {
            overflow: sw - cw,
            bodyBg: bg,
            oversizedBtns: bigBtns,
            hashLinks: links404,
            title: document.title,
          };
        });
        report[p][w] = {
          ...m,
          errors: [...new Set(errors)],
          failed: [...new Set(failed)],
        };
      } catch (e) {
        report[p][w] = { navError: String(e.message).slice(0, 120) };
      }
      page.off("pageerror", onErr);
      page.off("console", onCon);
      page.off("requestfailed", onFail);
    }
  }
  // compress: only show problems
  const out = {};
  for (const [p, r] of Object.entries(report)) {
    for (const [w, m] of Object.entries(r)) {
      const probs = {};
      if (m.navError) probs.navError = m.navError;
      if (m.overflow > 0) probs.overflow = m.overflow;
      if (m.errors && m.errors.length) probs.errors = m.errors;
      if (m.failed && m.failed.length) probs.failed = m.failed;
      if (m.oversizedBtns) probs.oversizedBtns = m.oversizedBtns;
      if (m.bodyBg && /rgb\((\d+), (\d+), (\d+)/.test(m.bodyBg)) {
        const [, r, g, b] = m.bodyBg
          .match(/rgb\((\d+), (\d+), (\d+)/)
          .map(Number);
        if (r + g + b < 300) probs.darkBody = m.bodyBg;
      }
      if (Object.keys(probs).length) (out[p] ||= {})[w] = probs;
    }
  }
  return out;
}
