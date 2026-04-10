# Frontend Patterns — Example

## Scenario: 200-Skill Catalog Page Re-rendering on Every Filter Change

**Who:** Tomas Havel, Frontend Developer, RBuild.ai
**Where:** Next.js 14, React 18, TypeScript, 200+ skill cards in a catalog page
**The Problem:** The skills catalog page re-renders the entire 200-skill list every time a filter changes — category, search term, or sort order. On lower-end laptops (Intel Core i5 4-core, 8GB RAM, common in enterprise environments), the filter interaction has a 300ms+ lag. Profiling shows the entire skill list re-renders on every keystroke in the search box. Users are complaining the page feels slow.

**Prerequisites:** React 18+, Next.js 14+. React DevTools Profiler for before/after measurement. No additional libraries required — the fixes use built-in React patterns.

---

### What You Say to the Agent

> "The skills catalog re-renders 200 cards every time I type in the search box. On slower machines it lags noticeably. Profiling shows the full list re-renders on every keystroke. Help me fix the rendering performance without a full rewrite."

### What the Agent Does

1. **Profiles the component tree:** Reads the component structure and identifies three compounding issues: the filter state lives in the parent component that wraps all 200 cards, the `filterSkills()` function runs on every render without memoization, and each `SkillCard` accepts an `onDownload` callback that is re-created on every render (breaking `React.memo` equality checks).

2. **Memoizes the filtered list:** Wraps `filterSkills()` in `useMemo` with `[skills, searchTerm, selectedCategory, sortOrder]` as dependencies. The 200-item filter runs once per filter change, not once per child render:
```tsx
const filteredSkills = useMemo(
  () => filterSkills(skills, { searchTerm, selectedCategory, sortOrder }),
  [skills, searchTerm, selectedCategory, sortOrder]
);
```

3. **Stabilizes the callback reference:** Wraps `onDownload` in `useCallback` so `React.memo` on `SkillCard` can actually bail out on re-renders when the skill data has not changed.

4. **Adds debouncing to the search input:** The search box was triggering state updates on every keystroke. Adds a 150ms debounce so the filter runs after the user pauses typing, not on every character. Uses a `useDebounce` hook rather than setTimeout directly to avoid stale closure bugs.

5. **Catches a hidden list key bug:** `SkillCard` components were keyed by array index (`key={index}`). When the sort order changes, React reconciles by position rather than identity, causing cards to re-mount instead of update. Changing to `key={skill.id}` allows React to reuse existing DOM nodes during sort operations, reducing the sort re-render from 180ms to 12ms.

### The Business Impact

- **Typing lag eliminated** — debounce plus memoization dropped search keystroke response from 300ms to under 16ms (one frame)
- **Sort operation 15x faster** — the key fix alone was the biggest single improvement, measurable in the React DevTools flame graph
- **Lower-end laptops no longer excluded** — the experience on enterprise Core i5 machines is now identical to high-end developer machines

### Try It Yourself

> "The skills catalog also has an infinite scroll that loads more skills as the user scrolls. When the new skills load in, the existing cards re-render. Help me implement virtualization for the list so only visible cards are in the DOM at any time."
