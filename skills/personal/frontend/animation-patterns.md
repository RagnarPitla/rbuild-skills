---
name: animation-patterns
description: Production animation patterns for React including scroll animations, drag interactions, skeleton loaders, and micro-interactions. Use when user says 'scroll animation', 'skeleton loader', 'drag and drop animation', 'number counter animation', 'toast animation', 'loading state animation'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, frontend, animation, css]
mcp_tools:
  - "playwright-mcp"
  - "figma-mcp"
---


# Frontend Animation Patterns

Beyond basic fade-ins, these are the patterns that make interfaces feel alive and responsive.

## Scroll-Triggered Animations

```jsx
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

function AnimateOnScroll({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true,      // Animate once when it enters view
    margin: '-100px' // Trigger 100px before entering viewport
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

## Skeleton Loaders

Better than spinners — they set content expectations while loading.

```jsx
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-avatar" />
      <div className="skeleton-content">
        <div className="skeleton-line w-3/4" />
        <div className="skeleton-line w-1/2" />
      </div>
    </div>
  );
}
```

```css
.skeleton-line, .skeleton-avatar {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## Drag Interactions

```jsx
import { motion, useDragControls } from 'framer-motion';

function DraggableCard({ id, onDrop }) {
  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.05, zIndex: 10 }}
      onDragEnd={(event, info) => {
        if (info.offset.y < -100) {
          onDrop(id); // Dragged up fast = delete/complete
        }
      }}
    >
      Card Content
    </motion.div>
  );
}
```

## Number Counter Animation

```jsx
import { useMotionValue, useSpring, useEffect } from 'framer-motion';

function AnimatedNumber({ value }) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 100, damping: 30 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    motionValue.set(value);
  }, [value]);

  useEffect(() => {
    springValue.on('change', v => setDisplayValue(Math.round(v)));
  }, [springValue]);

  return <span>{displayValue.toLocaleString()}</span>;
}

// Usage: <AnimatedNumber value={1247} />
// Animates from 0 to 1,247 with spring physics
```

## Toast/Notification Animation

```jsx
function Toast({ message, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="toast"
      >
        {message}
        <button onClick={onClose}>✕</button>
      </motion.div>
    </AnimatePresence>
  );
}
```

## Progress Bar

```jsx
function ProgressBar({ progress }) {
  return (
    <div className="progress-track">
      <motion.div
        className="progress-fill"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}
```

## Micro-interaction: Success State

```jsx
function SubmitButton({ isLoading, isSuccess }) {
  return (
    <motion.button
      animate={isSuccess ? { backgroundColor: '#22c55e' } : {}}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Spinner />
          </motion.span>
        )}
        {isSuccess && (
          <motion.span key="success" initial={{ scale: 0 }} animate={{ scale: 1 }}>
            ✓
          </motion.span>
        )}
        {!isLoading && !isSuccess && (
          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Submit
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
```

## Trigger Phrases

- "scroll animation"
- "skeleton loader"
- "drag and drop animation"
- "number counter animation"
- "toast animation"
- "loading state animation"
- "animate on scroll"
- "progress bar animation"

## Quick Example

> See `animation-patterns-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Scroll animation fires immediately on mount | `once: true` not set or margin not configured | Add `once: true` to `useInView` options; use negative margin (`'-100px'`) to trigger before fully in view |
| Skeleton shimmer animation is CPU-heavy | Using box-shadow or outline animations | Use only `background-position` animation on a gradient; avoid properties that trigger paint or layout |
| Drag interaction feels sluggish | No `dragElastic` or spring physics tuned | Set `dragElastic={0.1}` for tight feel; use `dragMomentum={false}` to remove post-drag drift |
| AnimatePresence exit animation not playing | Element removed from DOM before exit completes | Ensure element stays in the React tree until exit animation finishes; `AnimatePresence` requires the child to remain mounted during exit |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
