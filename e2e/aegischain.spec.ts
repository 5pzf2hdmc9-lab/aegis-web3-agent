import { expect, test, type Page, type Route } from "@playwright/test";
import type { AuditReport, VerdictKind } from "../lib/types";

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

function baseReport(over: Partial<AuditReport> & { verdict: VerdictKind }): AuditReport {
  return {
    address: USDC,
    chain: "ETHEREUM",
    completeness: "PARTIAL",
    checked: ["rpc:eth_getCode"],
    notChecked: ["honeypot sell simulation"],
    riskScore: 20,
    threatLevel: "Low Risk",
    verdictReason: "Fixture reason for E2E",
    nextAction: "Keep size caps.",
    flags: [
      {
        id: "fixture",
        title: "Fixture flag",
        severity: "info",
        confidence: "H",
        evidence: "Playwright mock",
        source: "rpc:eth_getCode",
      },
    ],
    aiSummary: null,
    cleanIsNotSafeNote: "CLEAN ≠ SAFE",
    methodologyPath: "/methodology",
    ...over,
  };
}

async function mockAudit(page: Page, report: AuditReport) {
  await page.route("**/api/rag", async (route: Route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        report,
        answer: `Verdict: ${report.verdict}`,
      }),
    });
  });
}

async function collectPageFaults(page: Page) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(err.message));
  return { consoleErrors, pageErrors };
}

async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth > doc.clientWidth + 1;
  });
  expect(overflow).toBe(false);
}

async function assertLegalFooter(page: Page) {
  await expect(page.getByText(/Non-Financial \/ Non-Audit Advice/i)).toBeVisible();
  await expect(page.getByText(/EU AI Act/i)).toBeVisible();
  await expect(page.getByText(/MiCA/i)).toBeVisible();
  await expect(page.getByText(/2024\/1689/)).toBeVisible();
  await expect(page.getByText(/2023\/1114/)).toBeVisible();
}

test.describe("AegisWeb3 adversarial E2E", () => {
  test("home: zero console/page errors, no overflow, legal footer, methodology nav", async ({
    page,
  }) => {
    const faults = await collectPageFaults(page);
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /AegisWeb3/i })).toBeVisible();
    await assertLegalFooter(page);
    await assertNoHorizontalOverflow(page);

    await page.getByRole("link", { name: /Methodology/i }).first().click();
    await expect(page).toHaveURL(/\/methodology/);
    await expect(page.getByText(/Methodology/i).first()).toBeVisible();
    await assertNoHorizontalOverflow(page);

    expect(faults.consoleErrors, faults.consoleErrors.join("\n")).toEqual([]);
    expect(faults.pageErrors, faults.pageErrors.join("\n")).toEqual([]);
  });

  test("UI verdict Safe to Proceed", async ({ page }) => {
    const faults = await collectPageFaults(page);
    await mockAudit(
      page,
      baseReport({
        verdict: "SAFE_TO_PROCEED_WITH_SIZE_CAP",
        threatLevel: "Low Risk",
        riskScore: 12,
        completeness: "PARTIAL",
      })
    );
    await page.goto("/");
    await page.getByRole("button", { name: /^ethereum$/i }).click();
    await page.getByPlaceholder(/wallet or contract address/i).fill(USDC);
    await page.getByRole("button", { name: /Run Autonomous Audit/i }).click();
    await expect(page.getByTestId("verdict-banner")).toContainText(/Safe to Proceed/i);
    await expect(page.getByTestId("completeness-badge")).toContainText(/PARTIAL/);
    expect(faults.consoleErrors).toEqual([]);
    expect(faults.pageErrors).toEqual([]);
  });

  test("UI verdict Caution", async ({ page }) => {
    await mockAudit(
      page,
      baseReport({
        verdict: "CAUTION_REVOKE_FIRST",
        threatLevel: "Moderate Risk",
        riskScore: 42,
        completeness: "PARTIAL",
      })
    );
    await page.goto("/");
    await page.getByRole("button", { name: /^ethereum$/i }).click();
    await page.getByPlaceholder(/wallet or contract address/i).fill(USDC);
    await page.getByRole("button", { name: /Run Autonomous Audit/i }).click();
    await expect(page.getByTestId("verdict-banner")).toContainText(/Caution/i);
  });

  test("UI verdict Do Not Sign + UNAVAILABLE", async ({ page }) => {
    await mockAudit(
      page,
      baseReport({
        verdict: "DO_NOT_SIGN",
        threatLevel: "Critical / High Risk",
        riskScore: 88,
        completeness: "UNAVAILABLE",
      })
    );
    await page.goto("/");
    await page.getByRole("button", { name: /^ethereum$/i }).click();
    await page.getByPlaceholder(/wallet or contract address/i).fill(USDC);
    await page.getByRole("button", { name: /Run Autonomous Audit/i }).click();
    await expect(page.getByTestId("verdict-banner")).toContainText(/Do Not Sign/i);
    await expect(page.getByTestId("completeness-badge")).toContainText(/UNAVAILABLE/);
  });
});

test.describe("Adversarial API & security headers", () => {
  test("security headers present on GET /", async ({ request }) => {
    const res = await request.get("/");
    expect(res.ok()).toBeTruthy();
    const csp = res.headers()["content-security-policy"];
    expect(csp).toBeTruthy();
    expect(csp).toMatch(/default-src/);
    expect(res.headers()["x-content-type-options"]).toBe("nosniff");
    expect(res.headers()["x-frame-options"]).toBe("DENY");
  });

  test("POST /api/rag malformed JSON → 400", async ({ baseURL }) => {
    const res = await fetch(new URL("/api/rag", baseURL), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{not-json",
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error?: string };
    expect(String(body.error)).toMatch(/malformed/i);
  });

  test("POST /api/rag oversized body → 400", async ({ request }) => {
    const big = "x".repeat(5000);
    const res = await request.post("/api/rag", {
      headers: { "Content-Type": "application/json" },
      data: { query: big, chain: "ethereum" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(String(body.error)).toMatch(/too large/i);
  });

  test("POST /api/rag invalid wallet → 400", async ({ request }) => {
    const res = await request.post("/api/rag", {
      data: { query: "not-a-wallet", chain: "ethereum" },
    });
    expect(res.status()).toBe(400);
  });

  test("POST /api/rag rate limit → 429 after 10", async ({ request }) => {
    test.setTimeout(180_000);
    const payload = { query: USDC, chain: "ethereum" as const };
    let saw429 = false;
    for (let i = 0; i < 12; i++) {
      const res = await request.post("/api/rag", { data: payload });
      if (res.status() === 429) {
        saw429 = true;
        break;
      }
      expect([200, 500]).toContain(res.status());
    }
    expect(saw429).toBe(true);
  });

  test("security headers present on POST /api/rag", async ({ request }) => {
    const res = await request.post("/api/rag", {
      data: { query: "0xdead", chain: "ethereum" },
    });
    expect(res.status()).toBe(400);
    expect(res.headers()["content-security-policy"]).toBeTruthy();
    expect(res.headers()["x-content-type-options"]).toBe("nosniff");
    expect(res.headers()["x-frame-options"]).toBe("DENY");
  });
});
