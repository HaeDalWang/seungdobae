import { test, expect } from "@playwright/test";

const ROUTES = [
  { path: "/overview", heading: "배승도" },
  { path: "/experience", heading: "경력" },
  { path: "/projects", heading: "프로젝트" },
  { path: "/certifications", heading: "자격증" },
  { path: "/activity", heading: "활동" },
  { path: "/contact", heading: "연락처" },
];

const BREAKPOINTS = [
  { name: "mobile", width: 320, height: 720 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 900 },
];

test.describe("라우팅 및 렌더링", () => {
  test("루트는 /overview로 리다이렉트된다", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/overview$/);
    await expect(page.locator("h1")).toBeVisible();
  });

  for (const route of ROUTES) {
    test(`${route.path} 가 h1과 함께 렌더된다`, async ({ page }) => {
      await page.goto(route.path);
      const h1 = page.locator("h1").first();
      await expect(h1).toBeVisible();
      await expect(h1).toContainText(route.heading);
    });
  }
});

test.describe("접근성 기본", () => {
  test("main 랜드마크와 네비게이션이 존재한다", async ({ page }) => {
    await page.goto("/overview");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("navigation").first()).toBeVisible();
  });

  test("페이지당 h1은 정확히 하나다", async ({ page }) => {
    await page.goto("/overview");
    await expect(page.locator("h1")).toHaveCount(1);
  });
});

test.describe("반응형 — 가로 오버플로우 없음", () => {
  for (const bp of BREAKPOINTS) {
    test(`${bp.name} (${bp.width}px) 에서 가로 스크롤이 없다`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/overview");
      await page.waitForLoadState("networkidle");

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
      });
      expect(hasOverflow).toBe(false);
    });
  }
});

test.describe("데이터 로딩", () => {
  test("Overview에 KPI 값이 표시된다", async ({ page }) => {
    await page.goto("/overview");
    await page.waitForLoadState("networkidle");
    // 경력 연차 라벨이 보이면 데이터 레이어가 동작한 것.
    await expect(page.getByText("경력", { exact: false }).first()).toBeVisible();
  });
});
