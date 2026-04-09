---
name: "Core Web Vitals"
slug: "core-web-vitals"
description: "Diagnose and fix LCP, INP, and CLS — the three Core Web Vitals that Google uses for search ranking and UX measurement."
tab: "personal"
domain: "frontend"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-curated"
tags: ["performance", "cwv", "lcp", "inp", "cls", "lighthouse", "seo"]
version: "1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "Google Web Vitals"
    url: "https://web.dev/vitals/"
  - title: "PageSpeed Insights"
    url: "https://pagespeed.web.dev/"
  - title: "Chrome UX Report"
    url: "https://developer.chrome.com/docs/crux/"
---

# Core Web Vitals

Google uses CWV for search ranking. More importantly, they directly measure user experience. Here's how to diagnose and fix each one.

## The Three Vitals

| Metric | Measures | Good | Needs Work | Poor |
|---|---|---|---|---|
| **LCP** | Loading performance | ≤2.5s | 2.5-4s | >4s |
| **INP** | Interactivity | ≤200ms | 200-500ms | >500ms |
| **CLS** | Visual stability | ≤0.1 | 0.1-0.25 | >0.25 |

## LCP (Largest Contentful Paint)

LCP measures when the largest visible element (hero image, heading, video) loads.

**Common causes of poor LCP:**
- Render-blocking JavaScript or CSS
- Slow server response time (TTFB > 600ms)
- Unoptimized hero image (no WebP, no compression)
- No CDN — assets served from origin server
- LCP element loaded by JavaScript (not in HTML)

**Fixes:**
1. Preload the LCP image: `<link rel="preload" as="image" href="/hero.webp">`
2. Serve images via CDN (Cloudflare, Fastly, CloudFront)
3. Convert images to WebP/AVIF
4. Add `fetchpriority="high"` to the LCP image element
5. Eliminate render-blocking resources: `<script defer>`, `<link rel="preload">` for CSS

**Biggest win:** Preloading the LCP image typically improves LCP by 0.5-2 seconds.

## INP (Interaction to Next Paint)

INP replaced FID in 2024. It measures the worst interaction delay across the page session.

**Common causes:**
- Long JavaScript tasks (>50ms) blocking the main thread
- Synchronous operations in event handlers
- Heavy third-party scripts (chat widgets, analytics)
- Excessive re-renders in React

**Fixes:**
1. Break long tasks with `scheduler.yield()` or `setTimeout(0)`
2. Move heavy computation to Web Workers
3. Debounce frequent event handlers (scroll, resize, input)
4. Audit third-party scripts — remove what you don't need
5. In React: use `useTransition` for non-urgent state updates

**Profiling tool:** Chrome DevTools → Performance tab → record interaction → look for long tasks (red bars)

## CLS (Cumulative Layout Shift)

CLS measures unexpected layout shifts. When content jumps around as the page loads, that's CLS.

**Common causes:**
- Images without explicit width/height dimensions
- Ads or embeds that inject content above existing content
- Web fonts loading and causing text reflow (FOUT)
- Dynamic content injected above the fold

**Fixes:**
1. Always set explicit `width` and `height` on images: `<img width="800" height="400">`  
   Or use aspect-ratio CSS: `img { aspect-ratio: 2/1; }`
2. Reserve space for ads/embeds: set fixed container dimensions before content loads
3. Add `font-display: swap` and preload key fonts
4. Avoid inserting content above existing content (except in response to user interaction)

**Biggest win:** Adding `width`/`height` to images eliminates the most common CLS cause.

## The Audit Workflow

1. Run **PageSpeed Insights** on your key pages (not just homepage)
2. Check **Chrome UX Report** for real-user field data (not just lab data)
3. Open **Chrome DevTools → Lighthouse** for detailed diagnostics
4. Use the **Performance tab** to profile specific interactions for INP
5. Fix highest-impact issues first (sort by opportunity in Lighthouse)

## Field Data vs Lab Data

Lab data (Lighthouse, PageSpeed) measures a simulated load. Field data (CrUX, web-vitals.js) measures real users.

Discrepancies are common — your real users may have slower devices or connections than your test environment. Always look at field data (P75) for business decisions.

Add the `web-vitals` library to measure real CWV in production:
```javascript
import { onLCP, onINP, onCLS } from 'web-vitals';
onLCP(metric => sendToAnalytics(metric));
```
