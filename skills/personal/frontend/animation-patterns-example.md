# Animation Patterns — Example

## Scenario: Polished Agent Status Dashboard With Skeletons, Data Transitions, and Micro-interactions

**Who:** Alex Rivera, Frontend Developer, enterprise AI team
**Where:** React, TypeScript, Framer Motion, Tailwind CSS, real-time Copilot Studio agent status data
**The Problem:** Alex is building a Copilot Studio agent status dashboard. Data loads in chunks over a WebSocket. The current state: a blank white screen during load, then a jarring flash when data arrives, then static content. The PM wants loading skeletons, smooth data transitions when agent status changes (idle to running to error), and micro-interactions on the status indicators. Alex has never built production-quality animations before and is worried about performance.

**Prerequisites:** React project with Framer Motion (`npm install framer-motion`). WebSocket or polling data source. Tailwind CSS optional but referenced in examples.

---

### What You Say to the Agent

> "I'm building a Copilot Studio agent status dashboard. I need three things: loading skeletons while data loads over WebSocket, smooth transitions when agent status changes from idle to running to error, and micro-interactions on the status dots. How do I do this without killing performance?"

### What the Agent Does

1. **Implements content-matched skeletons:** Builds skeleton components that match the exact shape of the loaded content — same height, same column widths, same grid structure. Explains that a skeleton that does not match the final layout causes a second layout shift on data arrival, which is often worse than no skeleton. The shimmer effect is a CSS `background-position` animation that stays entirely on the compositor thread.

2. **Creates a status state machine with AnimatePresence:**
```tsx
const statusColors = { idle: '#94a3b8', running: '#6366f1', error: '#ef4444', done: '#10b981' };

<AnimatePresence mode="wait">
  <motion.div
    key={agent.status}
    initial={{ opacity: 0, y: -4 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 4 }}
    transition={{ duration: 0.2 }}
  >
    {agent.status}
  </motion.div>
</AnimatePresence>
```
The `key={agent.status}` forces AnimatePresence to treat each status as a new element, so transitions play correctly.

3. **Adds a pulsing micro-interaction for the "running" state:** A CSS `ping` animation (Tailwind's `animate-ping`) on an absolutely-positioned copy of the status dot creates a radar-ping effect during active agent execution. It is CSS-only and runs off the main thread.

4. **Catches a stale-data flash bug:** Alex was unmounting the skeleton and mounting data simultaneously. When WebSocket data arrives out of order (agent B before agent A), the grid reorders and causes a visible jump. The agent introduces `layoutId` on each agent card so Framer Motion animates positional changes smoothly rather than jump-cutting.

5. **Adds performance guardrails:** Sets `willChange: 'transform, opacity'` only on actively animating elements, not all cards. Explains that setting `willChange` on every card promotes each to its own compositor layer, which can exceed GPU memory on dashboards with 50+ agents.

### The Business Impact

- **Perceived load time reduced** — content-matched skeletons eliminated the blank-screen complaint from the product team
- **Agent reorder flash fixed** — the `layoutId` pattern caught a real data-ordering bug that was invisible in development but appeared with production WebSocket latency
- **Performance kept clean** — `willChange` scoping prevented GPU memory pressure that would have degraded the dashboard on lower-end enterprise laptops

### Try It Yourself

> "The agent dashboard now shows status correctly but when an agent transitions from 'running' to 'error', I want the card border to flash red and then settle to a persistent red outline. Show me how to sequence that with Framer Motion without blocking the data update."
