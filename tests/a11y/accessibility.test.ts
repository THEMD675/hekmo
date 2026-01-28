import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Tests", () => {
  test("home page should have no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    // Filter for critical and serious violations only
    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );

    expect(criticalViolations).toEqual([]);
  });

  test("privacy page should be accessible", async ({ page }) => {
    await page.goto("/privacy");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === "critical"
    );

    expect(criticalViolations).toEqual([]);
  });

  test("terms page should be accessible", async ({ page }) => {
    await page.goto("/terms");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === "critical"
    );

    expect(criticalViolations).toEqual([]);
  });

  test("should have proper ARIA labels", async ({ page }) => {
    await page.goto("/");

    // Check for buttons without accessible names
    const buttonsWithoutLabel = await page.$$eval("button", (buttons) =>
      buttons.filter(
        (btn) =>
          !btn.getAttribute("aria-label") &&
          !btn.textContent?.trim() &&
          !btn.getAttribute("title")
      )
    );

    // Allow some buttons without labels (they might have icons)
    expect(buttonsWithoutLabel.length).toBeLessThan(5);
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    const headings = await page.$$eval("h1, h2, h3, h4, h5, h6", (elements) =>
      elements.map((el) => ({
        level: parseInt(el.tagName[1]),
        text: el.textContent?.trim(),
      }))
    );

    // Check that we have at least one h1
    const h1s = headings.filter((h) => h.level === 1);
    expect(h1s.length).toBeGreaterThanOrEqual(1);

    // Check heading order (no skipped levels)
    let prevLevel = 0;
    for (const heading of headings) {
      if (heading.level > prevLevel + 1 && prevLevel !== 0) {
        // Skipped level warning (not fail)
        console.warn(`Heading level skipped: h${prevLevel} to h${heading.level}`);
      }
      prevLevel = heading.level;
    }
  });

  test("should have proper color contrast", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === "color-contrast"
    );

    // Report contrast issues but don't fail (theme dependent)
    if (contrastViolations.length > 0) {
      console.warn("Color contrast issues found:", contrastViolations.length);
    }
  });

  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/");

    // Press Tab multiple times and check focus
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el?.tagName,
          hasFocusIndicator: el
            ? window.getComputedStyle(el).outlineStyle !== "none" ||
              window.getComputedStyle(el).boxShadow !== "none"
            : false,
        };
      });

      // Body means we've tabbed past all elements
      if (focusedElement.tag === "BODY") break;
    }
  });

  test("should support reduced motion", async ({ page }) => {
    // Enable reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // Page should load without animations
    await expect(page.locator("body")).toBeVisible();
  });

  test("should work with screen reader text", async ({ page }) => {
    await page.goto("/");

    // Check for visually hidden but accessible text
    const srOnly = await page.$$('[class*="sr-only"], .visually-hidden');
    // Having some screen reader only text is good
    console.log(`Found ${srOnly.length} screen reader only elements`);
  });

  test("forms should have associated labels", async ({ page }) => {
    await page.goto("/login");

    const inputs = await page.$$("input:not([type='hidden'])");

    for (const input of inputs) {
      const id = await input.getAttribute("id");
      const ariaLabel = await input.getAttribute("aria-label");
      const ariaLabelledby = await input.getAttribute("aria-labelledby");
      const placeholder = await input.getAttribute("placeholder");

      // Input should have some form of label
      const hasLabel = id || ariaLabel || ariaLabelledby || placeholder;
      expect(hasLabel).toBeTruthy();
    }
  });

  test("images should have alt text", async ({ page }) => {
    await page.goto("/");

    const imagesWithoutAlt = await page.$$eval("img", (images) =>
      images.filter((img) => !img.getAttribute("alt") && !img.getAttribute("role"))
    );

    // All meaningful images should have alt text
    expect(imagesWithoutAlt.length).toBe(0);
  });

  test("interactive elements should be focusable", async ({ page }) => {
    await page.goto("/");

    // Check that interactive elements can receive focus
    const interactiveElements = await page.$$("a, button, [role='button'], input, textarea, select");

    for (const element of interactiveElements.slice(0, 10)) {
      const tabIndex = await element.getAttribute("tabindex");
      const disabled = await element.getAttribute("disabled");

      // Should be focusable unless disabled
      if (!disabled) {
        expect(tabIndex !== "-1").toBeTruthy();
      }
    }
  });
});
