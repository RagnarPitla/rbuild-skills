---
name: e2e-testing
description: Playwright E2E testing patterns with Page Object Model, test isolation, data setup, CI integration, and network mocking. Use when user says 'E2E test', 'Playwright test', 'end-to-end testing', 'Page Object Model', 'browser testing', 'integration test with Playwright'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, frontend, e2e, playwright]
mcp_tools:
  - "playwright-mcp"
  - "figma-mcp"
---


# E2E Testing

E2E tests are the most expensive tests to write and maintain. Write them for the flows that matter most: checkout, authentication, core user journeys. Not for every button click.

## Page Object Model

The Page Object Model is the foundation of maintainable E2E tests. Each page gets a class that encapsulates its selectors and actions. Tests use the page objects, not raw selectors.

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email address');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}
```

```typescript
// pages/DashboardPage.ts
export class DashboardPage {
  constructor(readonly page: Page) {}

  async expectLoaded() {
    await expect(this.page).toHaveURL('/dashboard');
    await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  }
}
```

```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test('successful login redirects to dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');
  await dashboardPage.expectLoaded();
});

test('wrong password shows error message', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'wrongpassword');
  await loginPage.expectError('Invalid credentials');
});
```

## Test Isolation

Each test must be independent. Tests that depend on execution order create flaky test suites.

```typescript
// playwright.config.ts
export default defineConfig({
  // Each test gets a fresh browser context (isolated cookies, localStorage)
  use: {
    baseURL: 'http://localhost:3000',
  },
  // Run tests in parallel
  fullyParallel: true,
  // Retry failed tests twice in CI
  retries: process.env.CI ? 2 : 0,
});
```

## Data Setup and Teardown

Set up test data through the API, not through the UI. UI setup is slow and fragile.

```typescript
import { test as base } from '@playwright/test';

// Custom fixture: creates a test user via API before the test
const test = base.extend<{ testUser: { email: string; password: string } }>({
  testUser: async ({ request }, use) => {
    // Create via API
    const response = await request.post('/api/test/users', {
      data: { email: `test-${Date.now()}@example.com`, password: 'TestPass123!' }
    });
    const user = await response.json();

    await use(user); // Pass to the test

    // Cleanup after test
    await request.delete(`/api/test/users/${user.id}`);
  },
});

test('user can update profile', async ({ page, testUser }) => {
  // User already exists — log in and test
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(testUser.email, testUser.password);
  // ... rest of test
});
```

## Authentication Shortcut

Skip the login flow for tests that don't test auth:

```typescript
// auth.setup.ts — runs once before all tests
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Save auth state to file
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
```

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    // Setup project runs first
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    
    // Other projects use saved auth state
    {
      name: 'authenticated',
      use: { storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
  ],
});
```

## Network Mocking

Mock external APIs and slow endpoints in tests:

```typescript
test('shows error when payment API is down', async ({ page }) => {
  // Intercept and mock the response
  await page.route('**/api/payments/**', route => {
    route.fulfill({
      status: 503,
      body: JSON.stringify({ error: 'Service unavailable' }),
    });
  });

  await page.goto('/checkout');
  // ... proceed through checkout
  await expect(page.getByText('Payment service is temporarily unavailable')).toBeVisible();
});

test('shows loading state during slow API', async ({ page }) => {
  await page.route('**/api/orders', async route => {
    await new Promise(r => setTimeout(r, 2000)); // Simulate 2s delay
    route.continue();
  });

  await page.goto('/orders');
  await expect(page.getByTestId('orders-skeleton')).toBeVisible();
});
```

## CI Integration

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npx playwright test
        env:
          CI: true
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

## Playwright Best Practices

```typescript
// Use role-based selectors (accessible, resilient to UI changes)
page.getByRole('button', { name: 'Submit order' })
page.getByLabel('Email address')
page.getByPlaceholder('Search...')

// Use test IDs only for elements without accessible names
page.getByTestId('order-summary-total')

// Avoid — fragile and couples tests to CSS
page.locator('.btn-primary')
page.locator('#submit-btn')

// Wait for network requests to complete
await page.waitForResponse('**/api/orders');

// Assert on visible state, not DOM state
await expect(page.getByText('Order confirmed')).toBeVisible();

// Use soft assertions to collect multiple failures
await expect.soft(page.getByTestId('order-id')).toBeVisible();
await expect.soft(page.getByTestId('total-amount')).toContainText('$99.00');
```

## Trigger Phrases

- "E2E test"
- "Playwright test"
- "end-to-end testing"
- "Page Object Model"
- "browser testing"
- "integration test with Playwright"
- "test authentication flow"
- "mock API in tests"

## Quick Example

> See `e2e-testing-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Tests are flaky and fail intermittently | Race conditions from missing await or no proper wait | Replace hard-coded sleeps with `waitForResponse`, `waitForSelector`, or `expect().toBeVisible()` |
| Tests are slow (5+ minutes for 20 tests) | Login flow repeated in every test | Use `storageState` to save auth once and reuse across all authenticated tests |
| Tests break when UI changes | Using CSS selectors instead of role/label selectors | Switch to `getByRole`, `getByLabel`, `getByText` — these survive UI refactors |
| Tests interfere with each other | Shared database state | Use API fixtures to create and teardown test data per test; never share test data between tests |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
