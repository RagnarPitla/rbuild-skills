---
name: frontend-patterns
description: React architecture patterns covering component composition, custom hooks, context vs state management, performance optimization, and data fetching. Use when user says 'React patterns', 'Next.js patterns', 'component composition', 'custom hooks', 'state management', 'React performance'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, frontend, react, nextjs]
mcp_tools:
  - "playwright-mcp"
  - "figma-mcp"
---


# Frontend Patterns

React patterns that separate maintainable code from the kind of code nobody wants to touch.

## Component Composition Over Configuration

Avoid the "mega-component" that tries to handle every case via props. Use composition instead.

```tsx
// Bad: one component trying to do everything
<Card
  title="Order #123"
  showAvatar={true}
  avatarUrl="/user.jpg"
  footerActions={[{ label: 'View', onClick: ... }]}
  badge="New"
  badgeColor="green"
  collapsible={true}
/>

// Good: composable parts, flexible structure
<Card>
  <Card.Header>
    <Avatar src="/user.jpg" />
    <Card.Title>Order #123</Card.Title>
    <Badge variant="success">New</Badge>
  </Card.Header>
  <Card.Body>
    {/* anything goes here */}
  </Card.Body>
  <Card.Footer>
    <Button variant="ghost">View</Button>
  </Card.Footer>
</Card>
```

The composable version is more verbose but infinitely more flexible. Adding a new variation doesn't require touching the Card component.

## Custom Hooks: Separate Logic From Rendering

Custom hooks extract stateful logic so components stay focused on rendering.

```tsx
// Bad: business logic mixed with rendering
function OrderList() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/orders?page=${page}`)
      .then(r => r.json())
      .then(data => { setOrders(data); setIsLoading(false); })
      .catch(err => { setError(err); setIsLoading(false); });
  }, [page]);

  // ... rendering
}

// Good: logic extracted to a hook
function useOrders(initialPage = 1) {
  const [page, setPage] = useState(initialPage);
  const { data: orders, isLoading, error } = useSWR(
    `/api/orders?page=${page}`,
    fetcher
  );

  return { orders, isLoading, error, page, setPage };
}

function OrderList() {
  const { orders, isLoading, error, page, setPage } = useOrders();
  // Component is now just rendering
}
```

Custom hook naming rule: must start with `use`. If it uses React hooks internally, extract it to a custom hook.

## Context vs State Management

Not every state needs a global store. Use the right tool:

| State Type | Solution |
|---|---|
| Server data (fetched from API) | SWR, React Query, TanStack Query |
| UI state, local form state | `useState`, `useReducer` |
| Shared UI state (theme, modals) | Context API |
| Complex client state with many mutations | Zustand, Jotai |
| Rarely: complex shared state | Redux Toolkit |

```tsx
// Context for theme (right use case — stable, rarely changes)
const ThemeContext = createContext<Theme>(defaultTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Zustand for client-side cart (right use case — mutable, accessed from many places)
const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  clearCart: () => set({ items: [] }),
}));
```

## Data Fetching with SWR / React Query

Prefer a data fetching library over raw `useEffect` + `fetch`.

```tsx
// With SWR
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error, mutate } = useSWR(
    `/api/users/${userId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 60s
    }
  );

  if (isLoading) return <UserSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={() => mutate()}>Refresh</button>
    </div>
  );
}
```

Benefits over raw useEffect: automatic caching, deduplication, background revalidation, loading/error states, optimistic updates.

## Performance: When to Use memo, useMemo, useCallback

**Default: don't optimize.** Measure first. Premature optimization adds complexity without benefit.

**`React.memo`** — prevents re-render when parent re-renders but props haven't changed:
```tsx
// Only useful if: renders are expensive AND props rarely change
const ExpensiveList = React.memo(({ items }: { items: Item[] }) => {
  return <ul>{items.map(item => <ExpensiveItem key={item.id} {...item} />)}</ul>;
});
```

**`useMemo`** — memoize an expensive computation:
```tsx
// Only useful for genuinely expensive operations (filtering 10k+ items, complex calculations)
const filteredProducts = useMemo(
  () => products.filter(p => p.category === selectedCategory && p.price <= maxPrice),
  [products, selectedCategory, maxPrice]
);
```

**`useCallback`** — stable function reference (mostly needed when passing to memo'd children):
```tsx
// Without useCallback: new function reference on every render = memo'd child always re-renders
const handleDelete = useCallback(
  (id: string) => deleteItem(id),
  [deleteItem]
);
```

**Rule of thumb:** Profile first with React DevTools Profiler. Add memoization only for components that render >16ms or re-render >10 times per user interaction.

## Form Patterns

Use a form library. Don't build form state management from scratch.

```tsx
// React Hook Form (recommended: minimal re-renders, good performance)
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await login(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} aria-invalid={!!errors.email} />
      {errors.email && <p role="alert">{errors.email.message}</p>}

      <input type="password" {...register('password')} />
      {errors.password && <p role="alert">{errors.password.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
```

## Trigger Phrases

- "React patterns"
- "Next.js patterns"
- "component composition"
- "custom hooks"
- "state management"
- "React performance"
- "data fetching patterns"
- "useMemo useCallback when"

## Quick Example

> See `frontend-patterns-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Components re-render too often | State too high in the tree | Move state down to the component that needs it; split context into smaller pieces |
| useEffect runs in infinite loop | Missing or incorrect dependency array | Add the missing dep; if it causes loops, it usually means you need to memoize the dependency first |
| Form state difficult to manage | Raw useState for each field | Switch to React Hook Form with Zod validation; one hook replaces dozens of useState calls |
| Data fetching loading states inconsistent | Each component manages its own fetch | Use SWR or React Query with consistent loading/error handling; same API surface everywhere |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
