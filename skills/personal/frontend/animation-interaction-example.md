# Animation and Interaction — Example

## Scenario: A Flat CSS Fade for the "Skill Unlocked" Download Moment on skills.rbuild.ai

**Who:** Maya Chen, Frontend Developer, RBuild.ai
**Where:** Next.js, Tailwind CSS, Framer Motion, skills.rbuild.ai
**The Problem:** When a user downloads a skill on skills.rbuild.ai, the only feedback is a plain CSS opacity fade on the button label. There is no sense of accomplishment, no confirmation that something meaningful happened. The team wants a "skill unlocked" animation that feels rewarding and reinforces the brand. The current implementation is one CSS class and feels flat.

**Prerequisites:** Framer Motion installed (`npm install framer-motion`). React component-based frontend. The skill works with CSS animations if Framer Motion is unavailable.

---

### What You Say to the Agent

> "The skill download on skills.rbuild.ai feels flat. I want a 'skill unlocked' animation that plays when the user clicks download. It should feel satisfying and on-brand — not a spinner. Think achievement unlocked, not loading."

### What the Agent Does

1. **Proposes a three-phase animation sequence:** A button state change (idle to downloading to unlocked), a particle burst that radiates from the button, and a subtle card elevation. Explains that three distinct phases create a sense of narrative, which is why game achievement animations feel more satisfying than a single fade.

2. **Implements the button state machine:**
```tsx
const [state, setState] = useState<'idle' | 'downloading' | 'unlocked'>('idle');

// Framer Motion variants
const buttonVariants = {
  idle: { scale: 1, backgroundColor: '#6366f1' },
  downloading: { scale: 0.97, backgroundColor: '#4f46e5' },
  unlocked: { scale: [1, 1.08, 1], backgroundColor: '#10b981', transition: { duration: 0.4 } }
};
```

3. **Adds a particle burst component:** Uses `useAnimate` from Framer Motion to fire 8 small dots radially from the button center on unlock. Each dot moves outward and fades in 600ms. This is the element that makes the animation feel like an "achievement" rather than a state change.

4. **Catches a performance issue with the original approach:** Maya's first attempt used a CSS keyframe on the card wrapper, which triggered a layout recalculation on every frame because it animated `height`. The agent rewrites it to animate `transform: scale()` only, which stays on the GPU compositor thread and does not cause layout thrashing.

5. **Adds a `prefers-reduced-motion` guard:** Wraps all animation variants with a check for `window.matchMedia('(prefers-reduced-motion: reduce)')`. Users with motion sensitivity get an instant state change with no movement. This was not in Maya's original plan.

### The Business Impact

- **Download conversion rate increased** — the more satisfying confirmation reduced immediate re-clicks from users unsure if the download started
- **Layout thrash eliminated** — the original CSS height animation was causing jank on the skills catalog page during download; the transform-only approach runs at 60fps
- **Brand consistency improved** — the particle burst and color scheme were defined as reusable Framer Motion variants, used in three other interaction points on the site

### Try It Yourself

> "Add a hover animation to the skill cards on skills.rbuild.ai. The card should lift slightly with a shadow transition, and the category badge should shift color on hover. Make sure it respects prefers-reduced-motion and stays on the compositor thread."
