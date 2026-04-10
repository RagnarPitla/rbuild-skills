# Accessibility Audit — Example

## Scenario: Skill Cards on skills.rbuild.ai Are Not Keyboard Navigable

**Who:** Priya Nair, Frontend Developer, RBuild.ai
**Where:** Next.js, Tailwind CSS, React, skills.rbuild.ai
**The Problem:** A user reported that they cannot navigate the skill cards using a keyboard. Tab focus skips the cards entirely, there are no visible focus rings, and the download button inside each card is unreachable without a mouse. The team has never done an accessibility audit. They do not know how many other issues exist alongside the keyboard navigation problem.

**Prerequisites:** Access to the component source. Axe DevTools browser extension or `@axe-core/react` for automated scanning. The skill covers both automated and manual audit steps.

---

### What You Say to the Agent

> "A user reported they can't navigate our skill cards with a keyboard. We've never done an accessibility audit. Run an audit on the SkillCard component and the skills catalog page, and give me a prioritized list of issues to fix."

### What the Agent Does

1. **Identifies the root cause of keyboard skip:** Reads `SkillCard.tsx` and finds the card is rendered as a `<div>` with an `onClick` handler. Divs are not focusable by default. The fix is either `<button>` or adding `tabIndex={0}` plus `onKeyDown` for Enter/Space. Notes that `<button>` is the correct semantic element here, not a patched div.

2. **Finds missing focus styles:** The global CSS has `*:focus { outline: none }` — a common antipattern that removes the browser's default focus ring without replacing it. All interactive elements are invisible to keyboard users. This single CSS rule is responsible for the user's entire complaint.

3. **Flags a color contrast failure:** The skill category badge uses `text-gray-400` on a white background, which is a contrast ratio of 2.85:1. WCAG AA requires 4.5:1 for normal text. This would fail an automated axe scan with a `color-contrast` violation.

4. **Catches a missing ARIA label:** The download button inside each card renders as `<button><DownloadIcon /></button>` with no text and no `aria-label`. Screen readers announce it as "button" with no context. Suggests `aria-label="Download {skillName}"`.

5. **Produces a prioritized fix list:** Groups issues by WCAG impact level. The `outline: none` rule and the missing `aria-label` are WCAG A (critical). The color contrast is WCAG AA. Provides exact code changes for each.

### The Business Impact

- **Three issues fixed in one session** — keyboard navigation, focus visibility, and download button labeling resolved before more users were affected
- **CSS antipattern removed globally** — `*:focus { outline: none }` was affecting every page, not just skill cards
- **WCAG AA compliance path visible** — the audit gave the team a concrete checklist rather than a vague directive to "be more accessible"

### Try It Yourself

> "Audit the skill search input and filter dropdowns for accessibility. I want to know if they work with a screen reader, whether focus management is correct when the filter panel opens and closes, and whether the results count is announced to assistive technology."
