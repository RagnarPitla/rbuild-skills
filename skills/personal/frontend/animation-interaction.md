---
name: "animation-interaction"
slug: "animation-interaction"
description: "Build performant UI animations with Framer Motion, CSS transitions, and the View Transitions API at 60fps. Use when user says 'animate this component', 'CSS animation', 'Framer Motion', 'UI transitions', 'page transitions', 'smooth animation', 'reduced motion'."
tab: "personal"
domain: "frontend"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "frontend", "animation", "interaction"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "None"
mcp_tools: []
---



# Animation & Interaction Patterns

Good animation communicates — it tells users what happened and what to do next. Bad animation just looks busy. The difference is intent and performance.

## Performance Rules First

**Target:** 60fps (16ms per frame). Anything slower feels janky.

**Animate ONLY these CSS properties** (GPU-accelerated, no layout recalculation):
- `transform` (translate, scale, rotate)
- `opacity`
- `filter` (blur, brightness)

**Never animate** (causes layout reflow = janky):
- `width`, `height`, `margin`, `padding`, `top`, `left`
- `border-width`, `font-size`

Use `transform: translateX()` instead of `left:`, `transform: scale()` instead of `width:`.

## Framer Motion Patterns

### Basic Entrance Animation
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
  Content
</motion.div>
```

### Stagger Children (List Animations)
```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(item => (
    <motion.li key={item.id} variants={item}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

### Layout Animations (Shared Element)
```jsx
// Framer Motion tracks elements with the same layoutId
// and animates between their positions automatically

// Card in list
<motion.div layoutId={`card-${id}`} />

// Card expanded to modal
<motion.div layoutId={`card-${id}`} />
```

### Gesture Interactions
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>
```

## CSS Animation Patterns

### Keyframe Animation
```css
@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeSlideIn 0.4s ease-out forwards;
}
```

### CSS Transition (Hover States)
```css
.button {
  transform: translateY(0);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
```

## View Transitions API (Page Transitions)

```javascript
// Trigger a view transition
document.startViewTransition(() => {
  // Update the DOM here
  navigateTo(newPage);
});
```

```css
/* Customize the transition */
::view-transition-old(root) {
  animation: slide-out 0.3s ease;
}

::view-transition-new(root) {
  animation: slide-in 0.3s ease;
}

@keyframes slide-out {
  to { opacity: 0; transform: translateX(-30px); }
}
@keyframes slide-in {
  from { opacity: 0; transform: translateX(30px); }
}
```

## Animation Timing Guide

| Duration | Use For |
|---|---|
| 100-150ms | Micro-interactions (button press, checkbox) |
| 200-300ms | Small UI elements (tooltip, badge) |
| 300-500ms | Medium elements (card, modal) |
| 500-700ms | Large elements (page sections, drawers) |
| >700ms | Usually too slow — feels sluggish |

**Easing:** Use `ease-out` for entrances (fast start, slow end = feels natural). Use `ease-in` for exits. Use `spring` physics for interactive elements.

## Respecting User Preferences

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

```jsx
import { useReducedMotion } from 'framer-motion';

const prefersReducedMotion = useReducedMotion();
const animation = prefersReducedMotion ? {} : { y: 20, opacity: 0 };
```

Always respect `prefers-reduced-motion`. Some users have vestibular disorders where motion causes real physical discomfort.

## Trigger Phrases

- "animate this component"
- "CSS animation"
- "Framer Motion"
- "UI transitions"
- "page transitions"
- "smooth animation"
- "reduced motion"
- "layout animation"

## Quick Example

> See `animation-interaction-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Animation is janky (dropping frames) | Animating layout-triggering properties (width, height, top, left) | Switch to `transform: translate/scale` and `opacity` only; check with Chrome DevTools Performance tab |
| Framer Motion layout animation flickers | Multiple layout-animating elements without LayoutGroup | Wrap related elements in `<LayoutGroup>` so Framer Motion can coordinate layout measurements |
| Animation works in dev but not in production | Reduced motion media query stripping animations | Test with `prefers-reduced-motion: reduce` in DevTools; ensure you handle it with `useReducedMotion` |
| Page transition causes scroll jump | New page renders at scroll position of previous page | Add `window.scrollTo(0, 0)` at start of view transition, or use `scroll-behavior: auto` during transition |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
