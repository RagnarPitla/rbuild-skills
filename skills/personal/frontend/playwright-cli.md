---
name: playwright-cli
description: Automate browser interactions, test web pages, scrape content, and run Playwright tests using the playwright-cli tool. Use when user says 'automate browser', 'playwright', 'browser automation', 'test a webpage', 'scrape a page', 'click a button on a website', 'fill a form', 'take a screenshot', 'playwright-cli'.
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, frontend, playwright, browser-automation, testing]
requires: playwright-cli (npm install -g @playwright/cli@latest)
mcp_tools:
  - "playwright-mcp"
---

# Browser Automation with playwright-cli

Automate any browser interaction from the command line. Navigate, click, fill forms, take screenshots, mock network requests, and run Playwright tests.

## Installation

```bash
# Check if available
npx --no-install playwright-cli --version

# Install globally if not available
npm install -g @playwright/cli@latest
```

## Quick Start

```bash
playwright-cli open https://example.com   # open browser and navigate
playwright-cli snapshot                    # see page elements with refs
playwright-cli click e15                   # click element by ref
playwright-cli type "search query"
playwright-cli press Enter
playwright-cli screenshot
playwright-cli close
```

## Core Commands

### Navigation
```bash
playwright-cli open                        # open new browser
playwright-cli open https://example.com    # open and navigate
playwright-cli goto https://playwright.dev # navigate in open session
playwright-cli go-back
playwright-cli go-forward
playwright-cli reload
```

### Interacting with Elements
```bash
playwright-cli click e3                    # click by ref from snapshot
playwright-cli dblclick e7
playwright-cli fill e5 "user@example.com"  # fill input
playwright-cli fill e5 "text" --submit     # fill + press Enter
playwright-cli type "text"                 # type into focused element
playwright-cli hover e4
playwright-cli check e12
playwright-cli uncheck e12
playwright-cli select e9 "option-value"    # select dropdown option
playwright-cli drag e2 e8
playwright-cli upload ./document.pdf
```

### Targeting Elements
```bash
# Use refs from snapshot (preferred)
playwright-cli snapshot
playwright-cli click e15

# CSS selector
playwright-cli click "#main > button.submit"

# Role locator
playwright-cli click "getByRole('button', { name: 'Submit' })"

# Test ID
playwright-cli click "getByTestId('submit-button')"
```

### Snapshots
```bash
playwright-cli snapshot                    # full page snapshot with refs
playwright-cli snapshot "#main"            # snapshot a specific element
playwright-cli snapshot --depth=4          # limit depth for efficiency
playwright-cli snapshot --filename=state.yaml
```

### Screenshots and PDFs
```bash
playwright-cli screenshot
playwright-cli screenshot e5               # screenshot of specific element
playwright-cli screenshot --filename=page.png
playwright-cli pdf --filename=page.pdf
```

### Keyboard and Mouse
```bash
playwright-cli press Enter
playwright-cli press ArrowDown
playwright-cli keydown Shift
playwright-cli keyup Shift
playwright-cli mousemove 150 300
playwright-cli mousedown
playwright-cli mousewheel 0 100
```

### Tabs
```bash
playwright-cli tab-list
playwright-cli tab-new https://example.com
playwright-cli tab-select 0
playwright-cli tab-close
```

### Storage (Cookies, LocalStorage, Sessions)
```bash
playwright-cli state-save auth.json        # save auth state
playwright-cli state-load auth.json        # restore auth state

playwright-cli cookie-list
playwright-cli cookie-get session_id
playwright-cli cookie-set session_id abc123
playwright-cli cookie-clear

playwright-cli localstorage-list
playwright-cli localstorage-get theme
playwright-cli localstorage-set theme dark
playwright-cli localstorage-clear
```

### Network Mocking
```bash
playwright-cli route "**/*.jpg" --status=404
playwright-cli route "https://api.example.com/**" --body='{"mock": true}'
playwright-cli route-list
playwright-cli unroute "**/*.jpg"
playwright-cli unroute                     # clear all routes
```

### DevTools and Debugging
```bash
playwright-cli console                     # view console messages
playwright-cli console warning             # filter by level
playwright-cli network                     # view network requests
playwright-cli eval "document.title"
playwright-cli eval "el => el.textContent" e5
playwright-cli eval "el => el.getAttribute('data-testid')" e5
```

### Tracing and Video
```bash
playwright-cli tracing-start
playwright-cli click e4
playwright-cli tracing-stop

playwright-cli video-start video.webm
playwright-cli video-chapter "Chapter Title" --duration=2000
playwright-cli video-stop
```

### Named Sessions
```bash
playwright-cli -s=mysession open example.com --persistent
playwright-cli -s=mysession click e6
playwright-cli -s=mysession close
playwright-cli list
playwright-cli close-all
playwright-cli kill-all
```

## Raw Output Mode

Strip status/snapshot sections — useful for piping output:

```bash
playwright-cli --raw eval "JSON.stringify([...document.querySelectorAll('a')].map(a => a.href))" > links.json
playwright-cli --raw cookie-get session_id
playwright-cli --raw snapshot > before.yml
playwright-cli click e5
playwright-cli --raw snapshot > after.yml
diff before.yml after.yml
```

## Common Patterns

### Form Submission
```bash
playwright-cli open https://example.com/form
playwright-cli snapshot
playwright-cli fill e1 "user@example.com"
playwright-cli fill e2 "password123"
playwright-cli click e3
playwright-cli snapshot
playwright-cli close
```

### Authenticated Session
```bash
# Log in once and save state
playwright-cli open https://app.example.com/login
playwright-cli fill e1 "user@example.com"
playwright-cli fill e2 "password"
playwright-cli click e3
playwright-cli state-save auth.json

# Reuse auth in future sessions
playwright-cli open https://app.example.com/dashboard
playwright-cli state-load auth.json
playwright-cli snapshot
```

### Scraping Data
```bash
playwright-cli open https://example.com/table
playwright-cli --raw eval "JSON.stringify([...document.querySelectorAll('tr')].map(r => r.innerText))" > data.json
playwright-cli close
```

### Multi-Tab Workflow
```bash
playwright-cli open https://example.com
playwright-cli tab-new https://example.com/other
playwright-cli tab-list
playwright-cli tab-select 0
playwright-cli snapshot
playwright-cli close
```

## Browser Options
```bash
playwright-cli open --browser=chrome
playwright-cli open --browser=firefox
playwright-cli open --browser=webkit
playwright-cli open --browser=msedge
playwright-cli open --persistent           # keep profile between sessions
playwright-cli open --profile=/path/to/profile
```

## Running Playwright Tests

See `references/playwright-tests.md` for running `.spec.ts` test files, debugging failures, and CI integration.

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `playwright-cli: command not found` | Not installed globally | Run `npm install -g @playwright/cli@latest` or prefix with `npx playwright-cli` |
| Element ref `e15` not found | Snapshot is stale after page change | Run `playwright-cli snapshot` again to get fresh refs |
| Click has no effect | Element is outside viewport or obscured | Use `playwright-cli scroll` to bring into view, or try `playwright-cli eval "el => el.scrollIntoView()" e15` |
| Auth state not persisting | Session is in-memory by default | Use `--persistent` flag or `state-save`/`state-load` |
| Network route not matching | URL pattern too specific | Use `**` wildcards, verify with `playwright-cli route-list` |

## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-10 | Initial skill — adapted from microsoft/playwright-cli |
