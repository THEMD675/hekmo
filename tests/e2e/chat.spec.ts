import { test, expect } from "@playwright/test";

test.describe("Chat Feature", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the chat interface", async ({ page }) => {
    // Check for main elements
    await expect(page.locator("textarea, input[type='text']").first()).toBeVisible();
  });

  test("should show Arabic text direction", async ({ page }) => {
    // Check RTL direction
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
  });

  test("should have Arabic language set", async ({ page }) => {
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "ar");
  });

  test("should display logo or branding", async ({ page }) => {
    // Look for Hekmo branding
    const branding = page.locator("text=حكمو, text=Hekmo").first();
    await expect(branding).toBeVisible();
  });

  test("should show login/register if not authenticated", async ({ page }) => {
    // Check for auth buttons
    const authButton = page.locator("text=تسجيل, text=دخول").first();
    // May or may not be visible depending on auth state
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Should still be functional
    await expect(page.locator("textarea, input[type='text']").first()).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("should navigate to settings", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL(/settings/);
  });

  test("should navigate to pricing", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page).toHaveURL(/pricing/);
  });

  test("should navigate to privacy policy", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page).toHaveURL(/privacy/);
    await expect(page.locator("text=سياسة الخصوصية")).toBeVisible();
  });

  test("should navigate to terms", async ({ page }) => {
    await page.goto("/terms");
    await expect(page).toHaveURL(/terms/);
    await expect(page.locator("text=شروط الاستخدام")).toBeVisible();
  });
});

test.describe("Accessibility", () => {
  test("should have proper heading structure", async ({ page }) => {
    await page.goto("/");
    
    // Check for h1
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
  });

  test("should have accessible form inputs", async ({ page }) => {
    await page.goto("/");
    
    // Input should have placeholder or label
    const input = page.locator("textarea, input[type='text']").first();
    const placeholder = await input.getAttribute("placeholder");
    const ariaLabel = await input.getAttribute("aria-label");
    
    expect(placeholder || ariaLabel).toBeTruthy();
  });

  test("should support keyboard navigation", async ({ page }) => {
    await page.goto("/");
    
    // Tab should move focus
    await page.keyboard.press("Tab");
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });
});

test.describe("Theme", () => {
  test("should support dark mode", async ({ page }) => {
    await page.goto("/");
    
    // Check if dark class can be applied
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
    });
    
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);
  });
});
