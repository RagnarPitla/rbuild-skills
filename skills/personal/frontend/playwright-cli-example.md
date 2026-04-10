# Playwright CLI — Example

## Scenario: Testing a Skills Catalog Page Without Writing Test Code

**Who:** Alex Torres, Full-Stack Developer, building skills.rbuild.ai
**Where:** Local dev environment, Next.js app running on localhost:3000
**The Problem:** The skill download flow keeps breaking in edge cases but Alex can't reproduce it reliably. The flow has 4 steps: browse catalog, click a skill, preview it, click download. He needs to verify each step works, check that the right API calls fire, and screenshot the broken state when it fails. Writing a full Playwright test script would take an hour he doesn't have right now.

**Prerequisites:** `npm install -g @playwright/cli@latest`, dev server running on localhost:3000

---

### What You Say to the Agent

> "Use playwright-cli to test the skill download flow on localhost:3000. Go to the skills catalog, find the 'RAG Patterns' skill, open it, and click download. Screenshot each step and check the network request fires correctly."

### What the Agent Does

1. Opens the browser and navigates to the catalog, takes a snapshot to identify element refs for the skill cards
2. Clicks the RAG Patterns card (ref `e24`), takes a snapshot of the skill detail page, confirms the title and description rendered correctly
3. Starts network monitoring, clicks the download button (ref `e7`), captures the API call to `/api/skills/rag-patterns/download` and confirms a 200 response with the correct content-type header
4. Takes a final screenshot showing the download confirmation state, saves it as `download-confirmed.png` — catching that the "Downloaded" badge never appeared due to a missing state update in the React component

### The Business Impact

- **Bug found in 4 minutes** — the download API call fired correctly but the UI never updated to show the confirmation badge, a React state bug that would have shipped to production
- **No test file written** — exploratory testing done interactively, faster than authoring a `.spec.ts` file for a one-off investigation
- **Screenshot evidence** — captured the exact broken state with a timestamped screenshot for the bug report

### Try It Yourself

> "Open skills.rbuild.ai, go to the business skills tab, filter by 'copilot-studio', take a screenshot of the results, then check the browser console for any errors."
