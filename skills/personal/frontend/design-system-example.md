# Design System — Example

## Scenario: Three Developers, Three Button Components, One D365 Agent Dashboard

**Who:** Sam Torres, Frontend Lead, startup building a D365 agent management dashboard (3 developers)
**Where:** React, TypeScript, Tailwind CSS, no design system, Figma designs exist
**The Problem:** After two months, the dashboard has three different button components: `Button.tsx`, `ActionButton.tsx`, and `PrimaryButton.tsx`. Each has slightly different padding, different hover colors, and different disabled state handling. Every PR has style conflicts. The Figma designs show one button system but the codebase has three implementations. Users notice inconsistency in the UI.

**Prerequisites:** React project, TypeScript, Tailwind CSS (or any CSS system). Figma designs optional but referenced in examples.

---

### What You Say to the Agent

> "We have three different button components that have drifted apart. Figma has one button design system. Help me audit the three implementations, identify the gaps, and consolidate them into one component that covers all the variants we need."

### What the Agent Does

1. **Audits all three components:** Reads `Button.tsx`, `ActionButton.tsx`, and `PrimaryButton.tsx`. Finds: `Button.tsx` handles disabled states correctly but has wrong padding (12px instead of Figma's 10px 16px). `ActionButton.tsx` has no keyboard focus ring. `PrimaryButton.tsx` has the right focus ring but its `onClick` handler does not prevent double-submission.

2. **Extracts a consolidated variant map from Figma specs:** Identifies 4 variants (primary, secondary, ghost, destructive) times 3 sizes (sm, md, lg) times 3 states (default, hover, disabled). Generates the variant matrix before writing a line of code, so every case is accounted for.

3. **Catches a double-submission bug that all three components shared:** None of the three components set `disabled={true}` during async onClick operations. A user clicking a "Submit to D365" button twice would fire two purchase order creation requests. The consolidated component adds `isLoading` state that disables the button and shows a spinner during async operations.

4. **Builds the single component using class variance authority (CVA):**
```tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: { primary: 'bg-primary text-primary-foreground hover:bg-primary/90', ... },
      size: { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4', lg: 'h-12 px-6 text-lg' }
    },
    defaultVariants: { variant: 'primary', size: 'md' }
  }
);
```

5. **Produces a migration guide:** Lists every usage of the old components across the codebase with the one-line replacement for each. Finds 47 usages across 12 files.

### The Business Impact

- **Double-submission bug fixed** — no more duplicate D365 purchase orders from impatient users double-clicking
- **PR style conflicts eliminated** — one source of truth for button styles means no more style attribute debates in reviews
- **Design-to-code fidelity restored** — the Figma spec is now implemented exactly once, and deviations are immediately visible as code review violations

### Try It Yourself

> "We also have three different card components that have drifted. Run the same audit on SkillCard, AgentCard, and PolicyCard. Tell me the shared structure, the differences that should be variants, and any bugs hiding in the differences."
