# E2E Testing — Example

## Scenario: Skill Download Tests Failing in CI Because of Real API and Expired Auth Tokens

**Who:** Nadia Okonkwo, Frontend Developer, RBuild.ai
**Where:** Next.js, Playwright, GitHub Actions, skills.rbuild.ai skill download flow
**The Problem:** Nadia wrote E2E tests for the skill download flow on skills.rbuild.ai. Tests pass locally but fail in CI with `401 Unauthorized` because the auth token hardcoded in the test config expires every 24 hours. The tests also depend on the live skills API returning specific skill data that changes when new skills are added. The test suite is unreliable and the team has started ignoring failures.

**Prerequisites:** Playwright installed, `playwright.config.ts` in place, GitHub Actions CI. The skill covers both API mocking and auth handling strategies.

---

### What You Say to the Agent

> "My Playwright E2E tests for the skill download flow keep failing in CI. They depend on real API calls and an auth token that expires. The tests pass locally but break in CI daily. Help me make them reliable without mocking everything to the point they test nothing."

### What the Agent Does

1. **Diagnoses the two distinct failure modes:** The `401` failure is a credentials problem. The flaky skill data problem is a fixture dependency problem. These need different solutions — conflating them into "mock everything" would produce tests that never catch real regressions.

2. **Fixes auth with environment-based token injection:** Creates `playwright/.auth/user.json` as a storage state file. Adds a `globalSetup.ts` that programmatically logs in via the auth endpoint, saves the cookie/token state to the file, and sets up a GitHub Actions secret `E2E_TEST_PASSWORD`. Now auth is refreshed once per CI run, not hardcoded.

3. **Mocks only the external API dependency, not the UI:** Uses Playwright's `page.route()` to intercept calls to `api.skills.rbuild.ai/skills` and return a fixture file. The UI, navigation, download button click, and file download confirmation are all real. Only the API response is fixed. Explains the distinction: testing the download flow does not require testing that the API returns real data.

```typescript
await page.route('**/api/skills*', route => {
  route.fulfill({ path: 'tests/fixtures/skills-list.json' });
});
```

4. **Catches a test that was passing for the wrong reason:** One test was asserting `expect(page.url()).toContain('/download')` after clicking download. The URL changed because of a redirect, not because the download succeeded. The agent rewrites the assertion to wait for the download event: `const [download] = await Promise.all([page.waitForEvent('download'), page.click('#download-btn')])`.

5. **Adds a retry policy only for network-dependent steps:** Sets `retries: 2` in `playwright.config.ts` for CI only. Explains that retrying everything masks real bugs; retry config should be scoped to network operations, not UI interactions.

### The Business Impact

- **CI reliability went from 40% to 98%** — auth refresh + API mocking eliminated all environment-dependent failures
- **False-passing test caught** — the URL assertion was hiding that the download button was triggering a redirect, not a file download; a real regression would have been missed
- **Test suite trusted again** — the team re-enabled required CI checks after two months of bypassing them

### Try It Yourself

> "I need to test the skill filter flow on skills.rbuild.ai. Users can filter by category, search by name, and sort. The filter state is in the URL as query params. Help me write a Playwright test that verifies the filter, search, and sort all work together and that the URL reflects the state correctly."
