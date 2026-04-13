---
name: "design-system"
slug: "design-system"
description: "Component library design covering tokens, component API design, Storybook documentation, versioning, and consumer migration guides. Use when user says 'design system', 'component library', 'design tokens', 'Storybook setup', 'component API design', 'token-based theming'."
tab: "personal"
domain: "frontend"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "frontend", "design-system", "tokens"]
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



# Design System

A design system is not a component library. A component library is the implementation. A design system is the contract between designers and engineers — the shared language that makes consistent UI possible at scale.

## Design Tokens: The Foundation

Tokens are named values that represent design decisions. They are the single source of truth for visual properties.

```typescript
// tokens.ts — the complete design language
export const tokens = {
  color: {
    // Primitives (raw values)
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      900: '#111827',
    },
    blue: {
      500: '#3b82f6',
      600: '#2563eb',
    },
    // Semantic (role-based, reference primitives)
    text: {
      primary: 'gray.900',
      secondary: 'gray.600',
      disabled: 'gray.400',
    },
    background: {
      default: 'gray.50',
      surface: 'white',
      overlay: 'gray.900', // for modals
    },
    action: {
      primary: 'blue.600',
      primaryHover: 'blue.700',
    },
  },
  spacing: {
    // Base unit: 4px
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    6: '24px',
    8: '32px',
    12: '48px',
    16: '64px',
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.07)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
  },
};
```

**Two layers:** Primitives (all possible values) and Semantic tokens (role-based names that reference primitives). Never hardcode `#3b82f6` in a component — use `tokens.color.action.primary`.

## Component API Design

The component API is a contract. Bad component APIs create tech debt that outlasts the original component.

### Props naming conventions
```typescript
// Bad: inconsistent, unclear
<Button disabled={true} isLoading={true} btnSize="lg" variant_type="primary" />

// Good: consistent, predictable
<Button disabled isLoading size="lg" variant="primary" />
```

### The polymorphic `as` prop
```typescript
// Allows semantic HTML without duplicating components
<Button as="a" href="/dashboard">Go to Dashboard</Button>
<Button as="button" onClick={handleSubmit}>Submit</Button>
```

### Full Button component example
```typescript
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={clsx(
        buttonBase,
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
});

Button.displayName = 'Button';
```

Key decisions:
- `forwardRef` for library components so consumers can attach refs
- `disabled || isLoading` so loading state is automatically disabled
- `aria-busy` for accessibility
- Spread `...props` so all native button attributes work
- `displayName` for better DevTools debugging

## Storybook Documentation

Every component needs a story for each significant state:

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Primary action button. Use for the most important action on a page. Only one primary button per view.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Create order' },
};

export const Loading: Story = {
  args: { variant: 'primary', isLoading: true, children: 'Creating...' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete account' },
};

// Showcase all variants together
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};
```

## Versioning and Breaking Changes

Use semantic versioning. Any prop rename, removal, or behavioral change is a breaking change (major version bump).

**Managing breaking changes:**
1. Add the new API alongside the old one
2. Mark the old API as deprecated with a console warning
3. Communicate the sunset date in changelogs
4. Remove the old API in the next major version

```typescript
// Deprecation warning pattern
if (props.btnSize) {
  console.warn(
    '[Button] The `btnSize` prop is deprecated. Use `size` instead. ' +
    '`btnSize` will be removed in v3.0.0.'
  );
}
const size = props.size ?? props.btnSize ?? 'md';
```

**Consumer migration guide (in CHANGELOG.md):**
```markdown
## Breaking Changes in v3.0.0

### Button
- Removed: `btnSize` prop (deprecated since v2.4.0)
- Migration: Replace `btnSize="lg"` with `size="lg"`

### Colors
- Changed: `tokens.color.blue` renamed to `tokens.color.brand`
- Migration: Run `npx @myds/codemods color-rename`
```

## Trigger Phrases

- "design system"
- "component library"
- "design tokens"
- "Storybook setup"
- "component API design"
- "token-based theming"
- "how to build a component library"
- "breaking changes in a design system"

## Quick Example

> See `design-system-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Components look inconsistent across the app | Tokens not used consistently | Enforce token usage via ESLint rule (no-hardcoded-colors); audit with CSS variable search |
| Component API is difficult to use | Props not ergonomic | Apply the "how would I want to call this" test before publishing; expose smart defaults |
| Storybook is outdated and misleading | Stories not maintained with component changes | Add a Storybook build step to CI; fail the build if stories have type errors |
| Breaking changes surprise consumers | No deprecation warnings | Follow the add-deprecate-remove cycle; always document migration path before removing anything |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
