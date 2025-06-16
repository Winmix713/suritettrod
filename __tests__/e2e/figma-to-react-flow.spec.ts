import { test, expect } from "@playwright/test"
import { E2ETestUtils } from "../../scripts/e2e-setup"

test.describe("Figma to React Conversion Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Setup API mocks
    await E2ETestUtils.mockFigmaAPI(page)
    await E2ETestUtils.mockOpenAIAPI(page)

    // Navigate to the app
    await page.goto("/")
  })

  test("should complete full conversion flow", async ({ page }) => {
    // Step 1: Enter Figma URL
    await test.step("Enter Figma URL", async () => {
      await page.fill('[data-testid="figma-url-input"]', "https://www.figma.com/file/test123/Test-Design")
      await page.click('[data-testid="next-step-button"]')
    })

    // Step 2: Wait for Figma preview to load
    await test.step("Load Figma Preview", async () => {
      await E2ETestUtils.waitForFigmaLoad(page)
      await expect(page.locator('[data-testid="figma-preview"]')).toBeVisible()
    })

    // Step 3: Select components for conversion
    await test.step("Select Components", async () => {
      await page.click('[data-testid="component-selector"]')
      await page.click('[data-testid="select-all-components"]')
      await page.click('[data-testid="next-step-button"]')
    })

    // Step 4: Configure AI generation
    await test.step("Configure AI Generation", async () => {
      await page.selectOption('[data-testid="framework-select"]', "react")
      await page.selectOption('[data-testid="styling-select"]', "tailwind")
      await page.check('[data-testid="typescript-checkbox"]')
      await page.click('[data-testid="generate-button"]')
    })

    // Step 5: Wait for AI generation
    await test.step("Wait for AI Generation", async () => {
      await E2ETestUtils.waitForAIGeneration(page)
      await expect(page.locator('[data-testid="generated-code"]')).toBeVisible()
    })

    // Step 6: Preview generated code
    await test.step("Preview Generated Code", async () => {
      const codePreview = page.locator('[data-testid="code-preview"]')
      await expect(codePreview).toContainText("GeneratedComponent")
      await expect(codePreview).toContainText("export function")
    })

    // Step 7: Download code
    await test.step("Download Generated Code", async () => {
      const download = await E2ETestUtils.downloadGeneratedCode(page)
      expect(download.suggestedFilename()).toMatch(/.*\.zip$/)
    })
  })

  test("should handle Figma API errors gracefully", async ({ page }) => {
    // Mock API error
    await page.route("**/api.figma.com/**", (route) => {
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "Unauthorized" }),
      })
    })

    await page.fill('[data-testid="figma-url-input"]', "https://www.figma.com/file/test123/Test-Design")
    await page.click('[data-testid="next-step-button"]')

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-message"]')).toContainText("Unauthorized")
  })

  test("should validate Figma URL format", async ({ page }) => {
    // Test invalid URL
    await page.fill('[data-testid="figma-url-input"]', "invalid-url")
    await page.click('[data-testid="next-step-button"]')

    await expect(page.locator('[data-testid="url-validation-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="url-validation-error"]')).toContainText("Invalid Figma URL")
  })

  test("should support component library browsing", async ({ page }) => {
    // Navigate to component library
    await page.click('[data-testid="component-library-tab"]')

    // Should load component library
    await expect(page.locator('[data-testid="component-library"]')).toBeVisible()

    // Test search functionality
    await page.fill('[data-testid="component-search"]', "button")
    await expect(page.locator('[data-testid="component-card"]')).toHaveCount(1)

    // Test category filtering
    await page.click('[data-testid="category-buttons"]')
    await expect(page.locator('[data-testid="component-card"]')).toHaveCount(1)
  })

  test("should handle AI generation timeout", async ({ page }) => {
    // Mock slow AI response
    await page.route("**/api.openai.com/**", (route) => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ choices: [{ message: { content: "Generated code" } }] }),
        })
      }, 35000) // Longer than timeout
    })

    await E2ETestUtils.fillFigmaUrl(page, "https://www.figma.com/file/test123/Test-Design")
    await page.click('[data-testid="generate-button"]')

    // Should show timeout error
    await expect(page.locator('[data-testid="generation-timeout"]')).toBeVisible({ timeout: 40000 })
  })
})

test.describe("Accessibility Tests", () => {
  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/")

    // Test tab navigation
    await page.keyboard.press("Tab")
    await expect(page.locator('[data-testid="figma-url-input"]')).toBeFocused()

    await page.keyboard.press("Tab")
    await expect(page.locator('[data-testid="next-step-button"]')).toBeFocused()

    // Test Enter key activation
    await page.keyboard.press("Enter")
    // Should trigger the same action as clicking
  })

  test("should have proper ARIA labels", async ({ page }) => {
    await page.goto("/")

    // Check for ARIA labels
    await expect(page.locator('[aria-label="Figma URL input"]')).toBeVisible()
    await expect(page.locator('[aria-label="Next step"]')).toBeVisible()
  })

  test("should announce loading states to screen readers", async ({ page }) => {
    await page.goto("/")

    await E2ETestUtils.fillFigmaUrl(page, "https://www.figma.com/file/test123/Test-Design")

    // Should have aria-live region for status updates
    await expect(page.locator('[aria-live="polite"]')).toBeVisible()
  })
})

test.describe("Performance Tests", () => {
  test("should load within performance budget", async ({ page }) => {
    const startTime = Date.now()
    await page.goto("/")
    const loadTime = Date.now() - startTime

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test("should handle large Figma files efficiently", async ({ page }) => {
    // Mock large Figma file
    const largeFigmaFile = {
      document: {
        id: "0:0",
        name: "Large Document",
        type: "DOCUMENT",
        children: Array.from({ length: 100 }, (_, i) => ({
          id: `${i}:${i}`,
          name: `Component ${i}`,
          type: "FRAME",
          children: [],
        })),
      },
    }

    await page.route("**/api.figma.com/**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(largeFigmaFile),
      })
    })

    await page.goto("/")
    await E2ETestUtils.fillFigmaUrl(page, "https://www.figma.com/file/large123/Large-Design")

    // Should handle large file without crashing
    await expect(page.locator('[data-testid="figma-preview"]')).toBeVisible({ timeout: 15000 })
  })
})
