---
name: "Accessibility Audit"
slug: "accessibility-audit"
description: "Web accessibility audit checklist — WCAG 2.2 AA, ARIA patterns, keyboard navigation, and the fixes that solve 80% of issues."
tab: "personal"
domain: "frontend"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-curated"
tags: ["accessibility", "wcag", "aria", "a11y", "screen-reader", "keyboard"]
version: "1.0"
icon_emoji: "♿"
is_coming_soon: false
is_featured: false
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "WCAG 2.2 Guidelines"
    url: "https://www.w3.org/TR/WCAG22/"
  - title: "WebAIM — Web Accessibility In Mind"
    url: "https://webaim.org"
  - title: "MDN Accessibility Guide"
    url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility"
---

# Accessibility Audit

Accessibility isn't a checklist you run at the end — it's a set of habits you build in from the start. But if you're auditing an existing codebase, here's how to find and fix what matters most.

## The Four WCAG Principles (POUR)

**Perceivable** — information must be presentable in ways users can perceive  
**Operable** — UI components must be operable (keyboard, assistive tech)  
**Understandable** — content must be understandable  
**Robust** — content must be parseable by current and future assistive tech

WCAG 2.2 AA is the legal standard in most jurisdictions. That's your target.

## The 20% of Fixes That Solve 80% of Issues

1. **Alt text on images** — every `<img>` needs `alt=""` (empty for decorative) or descriptive text
2. **Form labels** — every `<input>` needs a `<label>` associated via `htmlFor`/`for`
3. **Color contrast** — 4.5:1 for normal text, 3:1 for large text (check with browser devtools)
4. **Keyboard focus visible** — never use `outline: none` without providing an alternative focus style
5. **Heading hierarchy** — don't skip heading levels (h1 → h3 skipping h2 is wrong)

Run an automated scan first (axe DevTools, Lighthouse) to catch these. Then do manual testing.

## ARIA Patterns

Use ARIA only when native HTML elements can't do the job. Native is always better.

```html
<!-- Bad: div button -->
<div onclick="handleClick()">Submit</div>

<!-- Good: actual button -->
<button onclick="handleClick()">Submit</button>

<!-- When you must use ARIA -->
<div 
  role="button" 
  tabindex="0"
  aria-label="Close dialog"
  onkeydown="handleKeyDown(e)"
  onclick="handleClick()"
>
  ×
</div>
```

**aria-label vs aria-labelledby vs aria-describedby:**
- `aria-label`: Provide a label in code (no visible text)
- `aria-labelledby`: Point to an existing visible element as the label
- `aria-describedby`: Point to additional descriptive text (not the main label)

**Landmark roles** — use semantic HTML instead of ARIA roles where possible:
```html
<header> instead of <div role="banner">
<nav> instead of <div role="navigation">
<main> instead of <div role="main">
<aside> instead of <div role="complementary">
<footer> instead of <div role="contentinfo">
```

## Keyboard Navigation Testing Checklist

Tab through your entire page with the mouse unplugged:
- [ ] Can you reach every interactive element with Tab?
- [ ] Is the tab order logical (matches visual order)?
- [ ] Can you activate every button/link with Enter or Space?
- [ ] Can you close modals with Escape?
- [ ] Is focus visible at all times? (the blue outline)
- [ ] Does focus not get trapped in non-modal components?

## Common React Accessibility Mistakes

**onClick on non-interactive elements:**
```jsx
// Bad
<div onClick={handleSelect}>Item</div>

// Good
<button onClick={handleSelect}>Item</button>
// or if you need div:
<div role="button" tabIndex={0} onClick={handleSelect} onKeyDown={handleKeyDown}>Item</div>
```

**Missing form labels:**
```jsx
// Bad
<input type="text" placeholder="Email" />

// Good
<label htmlFor="email">Email address</label>
<input id="email" type="text" />
```

**Dynamic content not announced:**
```jsx
// For live regions (chat messages, status updates, errors):
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

## Quick Audit Tools

- **axe DevTools** (Chrome extension) — free, catches ~57% of WCAG issues automatically
- **Lighthouse** (Chrome DevTools) — accessibility score with specific failures listed
- **WAVE** (webaim.org/wave) — visual overlay showing issues in context
- **Colour Contrast Analyzer** — desktop app for checking any two colors
