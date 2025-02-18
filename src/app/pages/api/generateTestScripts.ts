export function generateCypressScript(prompt: string): string {
  return `describe("Generated Test", () => {
      it("${prompt}", () => {
        cy.visit("/"); 
        cy.get("input").type("example");
        cy.get("button").click();
        cy.contains("Success").should("be.visible");
      });
    });`;
}

export function generatePlaywrightScript(prompt: string): string {
  return `import { test, expect } from "@playwright/test";
    
    test("${prompt}", async ({ page }) => {
      await page.goto("https://example.com");
      await page.fill("input", "example");
      await page.click("button");
      await expect(page.locator("text=Success")).toBeVisible();
    });`;
}

export function generateSeleniumScript(prompt: string): string {
  return `from selenium import webdriver
    
    driver = webdriver.Chrome()
    driver.get("https://example.com")
    
    input_field = driver.find_element("name", "input")
    input_field.send_keys("example")
    
    button = driver.find_element("tag name", "button")
    button.click()
    
    success_message = driver.find_element("xpath", "//*[text()='Success']")
    assert success_message.is_displayed()
    
    driver.quit()`;
}

// Generate a simple test case (can be customized further)
export function generateTestCase(prompt: string, framework: string): string {
  switch (framework.toLowerCase()) {
    case "cypress":
      return `Test Case for Cypress: ${prompt} - Visit a page, fill an input, click a button, and check for success message.`;
    case "playwright":
      return `Test Case for Playwright: ${prompt} - Open page, interact with form, and validate success.`;
    case "selenium":
      return `Test Case for Selenium: ${prompt} - Automate form interaction and verify success message in a browser.`;
    default:
      return `Test Case: ${prompt} - Placeholder test case for ${framework}.`;
  }
}
