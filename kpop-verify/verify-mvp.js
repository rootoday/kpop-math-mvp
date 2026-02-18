const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://kpop-math-mvp.vercel.app";
const CREDENTIALS = {
  email: "root@rootlog.kr",
  password: "109067_Lee",
};

const results = [];
let passCount = 0;
let failCount = 0;
let skipCount = 0;

function log(msg) {
  console.log(msg);
}

function record(name, status, detail = "") {
  const icon = status === "PASS" ? "✅" : status === "FAIL" ? "❌" : "⏭️";
  const line = `${icon} ${name}${detail ? " — " + detail : ""}`;
  log(line);
  results.push({ name, status, detail });
  if (status === "PASS") passCount++;
  else if (status === "FAIL") failCount++;
  else skipCount++;
}

async function takeScreenshot(page, name) {
  const safeName = name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const dir = path.join(__dirname, "screenshots");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${safeName}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}

async function run() {
  log("=".repeat(60));
  log("K-POP MATH MVP — Playwright Verification");
  log(`Target: ${BASE_URL}`);
  log(`Date:   ${new Date().toISOString()}`);
  log("=".repeat(60));
  log("");

  // Detect proxy from environment
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || "";
  const launchOptions = {
    headless: true,
    executablePath:
      process.env.CHROME_PATH ||
      "/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome",
  };
  if (proxyUrl) {
    // Parse proxy URL: http://user:pass@host:port
    const parsed = new URL(proxyUrl);
    launchOptions.proxy = {
      server: `${parsed.protocol}//${parsed.hostname}:${parsed.port}`,
      username: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
    };
    log(`Using proxy: ${parsed.hostname}:${parsed.port}`);
  }

  launchOptions.args = [
    "--ignore-certificate-errors",
    "--disable-web-security",
    "--no-sandbox",
    "--disable-setuid-sandbox",
  ];

  const browser = await chromium.launch(launchOptions);
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  // Collect console errors
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  try {
    // ── 1. Landing Page ──────────────────────────────────────
    log("\n── 1. Landing Page ──");
    try {
      await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 30000 });
      const title = await page.title();
      record("Landing page loads", "PASS", `title="${title}"`);
      await takeScreenshot(page, "01_landing");
    } catch (e) {
      record("Landing page loads", "FAIL", e.message);
    }

    // Check for hero section / CTA
    try {
      const hasHero = await page
        .locator("h1, h2, [class*='hero'], [class*='Hero']")
        .first()
        .isVisible({ timeout: 5000 });
      record("Hero section visible", hasHero ? "PASS" : "FAIL");
    } catch (e) {
      record("Hero section visible", "FAIL", e.message);
    }

    // Check for login/signup links
    try {
      const loginLink = page.locator(
        'a[href*="login"], button:has-text("Log"), a:has-text("Log")'
      );
      const signupLink = page.locator(
        'a[href*="signup"], button:has-text("Sign"), a:has-text("Sign"), button:has-text("Get Started"), a:has-text("Get Started")'
      );
      const hasLogin = (await loginLink.count()) > 0;
      const hasSignup = (await signupLink.count()) > 0;
      record(
        "Login link present",
        hasLogin ? "PASS" : "FAIL",
        `found ${await loginLink.count()} element(s)`
      );
      record(
        "Signup / Get Started link present",
        hasSignup ? "PASS" : "FAIL",
        `found ${await signupLink.count()} element(s)`
      );
    } catch (e) {
      record("Nav links check", "FAIL", e.message);
    }

    // ── 2. Login Flow ────────────────────────────────────────
    log("\n── 2. Login Flow ──");
    try {
      await page.goto(`${BASE_URL}/login`, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      await takeScreenshot(page, "02_login_page");
      record("Login page loads", "PASS");
    } catch (e) {
      record("Login page loads", "FAIL", e.message);
    }

    // Fill credentials
    try {
      const emailInput = page.locator(
        'input[type="email"], input[name="email"], input[placeholder*="email" i]'
      );
      const passwordInput = page.locator(
        'input[type="password"], input[name="password"]'
      );
      await emailInput.first().fill(CREDENTIALS.email, { timeout: 5000 });
      await passwordInput.first().fill(CREDENTIALS.password, { timeout: 5000 });
      record("Credentials entered", "PASS");
      await takeScreenshot(page, "03_credentials_filled");
    } catch (e) {
      record("Credentials entered", "FAIL", e.message);
    }

    // Submit login
    try {
      const submitBtn = page.locator(
        'button[type="submit"], button:has-text("Log in"), button:has-text("Login"), button:has-text("Sign in")'
      );
      await submitBtn.first().click({ timeout: 5000 });

      // Wait for navigation to dashboard or any redirect
      await page.waitForURL("**/dashboard**", { timeout: 15000 }).catch(() => {
        // might redirect elsewhere
      });

      const currentUrl = page.url();
      const loginSuccess =
        currentUrl.includes("dashboard") ||
        currentUrl.includes("lessons") ||
        !currentUrl.includes("login");
      record(
        "Login succeeds",
        loginSuccess ? "PASS" : "FAIL",
        `redirected to ${currentUrl}`
      );
      await takeScreenshot(page, "04_after_login");
    } catch (e) {
      record("Login succeeds", "FAIL", e.message);
    }

    // ── 3. Dashboard ─────────────────────────────────────────
    log("\n── 3. Dashboard ──");
    try {
      await page.goto(`${BASE_URL}/dashboard`, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      const url = page.url();
      const onDashboard =
        url.includes("dashboard") || !url.includes("login");
      record(
        "Dashboard accessible",
        onDashboard ? "PASS" : "FAIL",
        `url=${url}`
      );
      await takeScreenshot(page, "05_dashboard");
    } catch (e) {
      record("Dashboard accessible", "FAIL", e.message);
    }

    // Check stat cards (XP, streak, etc.)
    try {
      const statElements = page.locator(
        '[class*="stat"], [class*="Stat"], [class*="card"], [class*="Card"]'
      );
      const statCount = await statElements.count();
      record(
        "Dashboard stat cards",
        statCount > 0 ? "PASS" : "FAIL",
        `found ${statCount} card element(s)`
      );
    } catch (e) {
      record("Dashboard stat cards", "FAIL", e.message);
    }

    // Check for XP display
    try {
      const xpText = await page
        .locator('text=/XP|xp|points/i')
        .first()
        .isVisible({ timeout: 5000 });
      record("XP display visible", xpText ? "PASS" : "FAIL");
    } catch (e) {
      record("XP display visible", "FAIL", e.message);
    }

    // ── 4. Lessons Page ──────────────────────────────────────
    log("\n── 4. Lessons Page ──");
    let lessonIds = [];
    try {
      await page.goto(`${BASE_URL}/lessons`, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      const url = page.url();
      record(
        "Lessons page loads",
        url.includes("lessons") ? "PASS" : "FAIL",
        `url=${url}`
      );
      await takeScreenshot(page, "06_lessons");
    } catch (e) {
      record("Lessons page loads", "FAIL", e.message);
    }

    // Check lesson cards
    try {
      const lessonCards = page.locator(
        'a[href*="/lessons/"], a[href*="/learn/"], [class*="lesson" i], [class*="Lesson"]'
      );
      const count = await lessonCards.count();
      record(
        "Lesson cards displayed",
        count > 0 ? "PASS" : "FAIL",
        `found ${count} lesson(s)`
      );

      // Collect lesson links for deeper testing
      for (let i = 0; i < Math.min(count, 5); i++) {
        const href = await lessonCards.nth(i).getAttribute("href");
        if (href) lessonIds.push(href);
      }
    } catch (e) {
      record("Lesson cards displayed", "FAIL", e.message);
    }

    // ── 5. Lesson Detail / Learning Flow ─────────────────────
    log("\n── 5. Lesson Learning Flow ──");
    if (lessonIds.length > 0) {
      // Navigate to first lesson
      const firstLesson = lessonIds[0];
      const lessonUrl = firstLesson.startsWith("http")
        ? firstLesson
        : `${BASE_URL}${firstLesson}`;

      try {
        await page.goto(lessonUrl, {
          waitUntil: "networkidle",
          timeout: 30000,
        });
        record("Lesson detail page loads", "PASS", `url=${page.url()}`);
        await takeScreenshot(page, "07_lesson_detail");
      } catch (e) {
        record("Lesson detail page loads", "FAIL", e.message);
      }

      // Try to start lesson (look for Start / Begin / Learn button)
      try {
        const startBtn = page.locator(
          'a:has-text("Start"), button:has-text("Start"), a:has-text("Begin"), a:has-text("Learn"), button:has-text("Learn"), a[href*="/learn/"]'
        );
        if ((await startBtn.count()) > 0) {
          await startBtn.first().click({ timeout: 5000 });
          await page.waitForLoadState("networkidle", { timeout: 15000 });
          record("Lesson player opens", "PASS", `url=${page.url()}`);
          await takeScreenshot(page, "08_lesson_player");

          // Check for tier content
          const hasTierContent = await page
            .locator(
              '[class*="tier" i], [class*="Tier"], [class*="progress" i], [class*="step" i]'
            )
            .first()
            .isVisible({ timeout: 5000 })
            .catch(() => false);
          record(
            "Tier/progress content visible",
            hasTierContent ? "PASS" : "FAIL"
          );

          // Try advancing through Tier 1 (Hook)
          try {
            const nextBtn = page.locator(
              'button:has-text("Next"), button:has-text("Continue"), button:has-text("Let\'s Learn"), button:has-text("Start Learning")'
            );
            if ((await nextBtn.count()) > 0) {
              await nextBtn.first().click({ timeout: 5000 });
              await page
                .waitForLoadState("networkidle", { timeout: 10000 })
                .catch(() => {});
              record("Tier 1 advance", "PASS", `navigated forward`);
              await takeScreenshot(page, "09_tier_advance");
            } else {
              record("Tier 1 advance", "SKIP", "no next button found");
            }
          } catch (e) {
            record("Tier 1 advance", "FAIL", e.message);
          }
        } else {
          record("Lesson player opens", "SKIP", "no start button found");
        }
      } catch (e) {
        record("Lesson start flow", "FAIL", e.message);
      }
    } else {
      record("Lesson flow", "SKIP", "no lessons found to test");
    }

    // ── 6. Analytics Page ────────────────────────────────────
    log("\n── 6. Analytics Page ──");
    try {
      await page.goto(`${BASE_URL}/analytics`, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      const url = page.url();
      const accessible =
        url.includes("analytics") || !url.includes("login");
      record(
        "Analytics page accessible",
        accessible ? "PASS" : "FAIL",
        `url=${url}`
      );
      await takeScreenshot(page, "10_analytics");
    } catch (e) {
      record("Analytics page accessible", "FAIL", e.message);
    }

    // Check for chart elements
    try {
      const charts = page.locator(
        'canvas, svg, [class*="chart" i], [class*="Chart"], [class*="recharts"]'
      );
      const chartCount = await charts.count();
      record(
        "Analytics charts present",
        chartCount > 0 ? "PASS" : "FAIL",
        `found ${chartCount} chart element(s)`
      );
    } catch (e) {
      record("Analytics charts present", "FAIL", e.message);
    }

    // ── 7. Admin Panel ───────────────────────────────────────
    log("\n── 7. Admin Panel ──");
    try {
      await page.goto(`${BASE_URL}/admin`, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      const url = page.url();
      const isAdmin = url.includes("admin") && !url.includes("login");
      record(
        "Admin dashboard accessible",
        isAdmin ? "PASS" : "FAIL",
        `url=${url}`
      );
      await takeScreenshot(page, "11_admin");
    } catch (e) {
      record("Admin dashboard accessible", "FAIL", e.message);
    }

    // Admin lessons management
    try {
      await page.goto(`${BASE_URL}/admin/lessons`, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      const url = page.url();
      record(
        "Admin lessons page",
        url.includes("admin/lessons") ? "PASS" : "FAIL",
        `url=${url}`
      );
      await takeScreenshot(page, "12_admin_lessons");
    } catch (e) {
      record("Admin lessons page", "FAIL", e.message);
    }

    // Admin users management
    try {
      await page.goto(`${BASE_URL}/admin/users`, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      const url = page.url();
      record(
        "Admin users page",
        url.includes("admin/users") ? "PASS" : "FAIL",
        `url=${url}`
      );
      await takeScreenshot(page, "13_admin_users");
    } catch (e) {
      record("Admin users page", "FAIL", e.message);
    }

    // ── 8. API Health Checks ─────────────────────────────────
    log("\n── 8. API Health Checks ──");
    try {
      const lessonsResp = await page.request.get(`${BASE_URL}/api/lessons`);
      record(
        "GET /api/lessons",
        lessonsResp.ok() ? "PASS" : "FAIL",
        `status=${lessonsResp.status()}`
      );
    } catch (e) {
      record("GET /api/lessons", "FAIL", e.message);
    }

    try {
      const meResp = await page.request.get(`${BASE_URL}/api/users/me`);
      record(
        "GET /api/users/me",
        meResp.ok() ? "PASS" : "FAIL",
        `status=${meResp.status()}`
      );
    } catch (e) {
      record("GET /api/users/me", "FAIL", e.message);
    }

    try {
      const progressResp = await page.request.get(
        `${BASE_URL}/api/progress`
      );
      // 200 or 404 (no progress yet) are both acceptable
      record(
        "GET /api/progress",
        progressResp.status() < 500 ? "PASS" : "FAIL",
        `status=${progressResp.status()}`
      );
    } catch (e) {
      record("GET /api/progress", "FAIL", e.message);
    }

    // ── 9. Responsive Design ─────────────────────────────────
    log("\n── 9. Responsive Design (Mobile Viewport) ──");
    try {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(`${BASE_URL}/dashboard`, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      await takeScreenshot(page, "14_mobile_dashboard");
      record("Mobile viewport renders", "PASS", "375x812");
    } catch (e) {
      record("Mobile viewport renders", "FAIL", e.message);
    }

    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 800 });

    // ── 10. Performance & Errors ─────────────────────────────
    log("\n── 10. Performance & Console Errors ──");
    record(
      "Console errors during session",
      consoleErrors.length === 0 ? "PASS" : "FAIL",
      consoleErrors.length > 0
        ? `${consoleErrors.length} error(s): ${consoleErrors.slice(0, 3).join(" | ")}`
        : "no errors"
    );
  } catch (fatalError) {
    record("FATAL ERROR", "FAIL", fatalError.message);
  } finally {
    await browser.close();
  }

  // ── Generate Report ──────────────────────────────────────
  log("\n" + "=".repeat(60));
  log("SUMMARY");
  log("=".repeat(60));
  log(`  PASS: ${passCount}`);
  log(`  FAIL: ${failCount}`);
  log(`  SKIP: ${skipCount}`);
  log(`  TOTAL: ${passCount + failCount + skipCount}`);
  log("=".repeat(60));

  const reportLines = [
    "# K-POP Math MVP — Verification Report",
    "",
    `**URL:** ${BASE_URL}`,
    `**Date:** ${new Date().toISOString()}`,
    `**Runner:** Playwright (headless Chromium)`,
    "",
    "## Summary",
    "",
    `| Metric | Count |`,
    `|--------|-------|`,
    `| ✅ Pass | ${passCount} |`,
    `| ❌ Fail | ${failCount} |`,
    `| ⏭️ Skip | ${skipCount} |`,
    `| **Total** | **${passCount + failCount + skipCount}** |`,
    "",
    "## Detailed Results",
    "",
  ];

  let currentSection = "";
  for (const r of results) {
    const sectionMatch = r.name.match(
      /^(Landing|Login|Dashboard|Lessons|Lesson|Analytics|Admin|API|Mobile|Console|Performance|Responsive|FATAL)/i
    );
    if (sectionMatch && sectionMatch[0] !== currentSection) {
      currentSection = sectionMatch[0];
    }
    const icon =
      r.status === "PASS" ? "✅" : r.status === "FAIL" ? "❌" : "⏭️";
    reportLines.push(
      `- ${icon} **${r.name}** — ${r.status}${r.detail ? ": " + r.detail : ""}`
    );
  }

  reportLines.push("");
  reportLines.push("## Screenshots");
  reportLines.push("");
  reportLines.push(
    "Screenshots saved in `kpop-verify/screenshots/` directory."
  );

  const screenshotDir = path.join(__dirname, "screenshots");
  if (fs.existsSync(screenshotDir)) {
    const files = fs.readdirSync(screenshotDir).sort();
    for (const f of files) {
      reportLines.push(`- \`${f}\``);
    }
  }

  reportLines.push("");
  reportLines.push("---");
  reportLines.push(
    `*Generated by kpop-math-mvp-verify on ${new Date().toISOString()}*`
  );

  const reportPath = path.join(__dirname, "verification-report.md");
  fs.writeFileSync(reportPath, reportLines.join("\n"));
  log(`\nReport written to: ${reportPath}`);
}

run().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
