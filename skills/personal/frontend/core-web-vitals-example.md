# Core Web Vitals — Example

## Scenario: LCP at 4.2 Seconds After Adding Skill Card Images to skills.rbuild.ai

**Who:** Jordan Kim, Frontend Developer, RBuild.ai
**Where:** Next.js 14, Vercel, skills.rbuild.ai, 200 skill cards with PNG thumbnail images
**The Problem:** After adding skill card thumbnail images, PageSpeed Insights dropped from 87 to 52. LCP (Largest Contentful Paint) is at 4.2 seconds. The launch is in 3 days. The team added the images as standard `<img>` tags without optimization. Nobody looked at the network waterfall before shipping the images.

**Prerequisites:** Access to the Next.js source and the image assets. Vercel deployment optional. PageSpeed Insights or Lighthouse CLI for before/after measurement.

---

### What You Say to the Agent

> "Our PageSpeed score dropped from 87 to 52 after adding skill card images. LCP is 4.2s. Launch is in 3 days. Help me diagnose the waterfall and fix it fast."

### What the Agent Does

1. **Runs a Lighthouse audit programmatically:** Executes `lighthouse https://skills.rbuild.ai --output json --quiet` and parses the LCP element report. Confirms the LCP element is the first visible skill card image (above the fold, row 1, column 1). This is the highest-impact fix target.

2. **Identifies four compounding issues in the waterfall:**
   - Images are served as unoptimized 800x600 PNGs (avg 180KB each)
   - No `loading="lazy"` on below-the-fold images, so all 200 images start downloading at page load
   - The LCP image has no `fetchpriority="high"` hint, so the browser discovers it late in the waterfall
   - `<img>` tags instead of Next.js `<Image>` component, missing automatic WebP conversion and responsive `srcset`

3. **Applies the fixes in priority order:** First adds `fetchpriority="high"` to the first 4 visible cards (above the fold). This alone should drop LCP to under 2.5s by telling the browser to prioritize those images before the JS bundle. Then replaces all `<img>` with Next.js `<Image width={} height={} loading="lazy">` for below-fold cards.

4. **Catches a CLS issue hidden by the LCP problem:** The skill card images have no explicit `width` and `height` attributes. When images load, they shift the layout (Cumulative Layout Shift). The agent adds explicit dimensions and an `aspect-ratio` CSS fallback, reducing CLS from 0.18 to 0.02.

5. **Adds an `<image>` preload to the document head** for the first row of cards, ensuring the browser starts fetching them during HTML parsing rather than waiting for React to hydrate.

### The Business Impact

- **LCP dropped from 4.2s to 1.8s** — the `fetchpriority` hint and lazy loading were the two highest-leverage changes, implemented in under an hour
- **PageSpeed score recovered to 91** — above the pre-image baseline because the audit also caught the CLS issue that was already lurking before the images were added
- **Launch deadline met** — all fixes deployed in one day, two days before the public launch

### Try It Yourself

> "The skills catalog page has a filter sidebar that loads a list of 50 skill categories from an API. On slower connections, the sidebar blocks the skill grid from rendering. How do I defer the sidebar load without hurting the overall page LCP?"
