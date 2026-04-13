---
name: "debugging-detective"
slug: "debugging-detective"
description: "Systematic debugging with reproduce, isolate, hypothesize, verify steps plus root-cause templates and common failure patterns. Use when user says 'debug this bug', 'debugging help', 'how to debug', 'find this bug', 'fix this error', 'something is broken'."
tab: "personal"
domain: "software-engineering"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "software-engineering", "debugging", "root-cause"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: true
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "None"
mcp_tools: []
---



# Debugging Detective

Debugging is a skill, not a talent. The engineers who debug fastest aren't smarter — they have a system. Here's the system.

## The Four Steps (Always In This Order)

### Step 1: Reproduce Reliably

You cannot fix a bug you cannot reliably reproduce. Before anything else:

- Can you make it happen on demand?
- Does it happen every time, or intermittently?
- What exact steps trigger it?
- Does it happen in a fresh environment?

**Intermittent bugs** are harder. Common causes: race conditions, state from a previous test, environment-specific config, timing dependencies. Add logging and reproduce 10 times before concluding it's intermittent.

Write the reproduction steps down. This forces clarity and is essential if you need help.

### Step 2: Isolate the Smallest Failing Case

The smaller the failing case, the faster you find the bug.

**Binary search the code:**
- Comment out half the code. Still fails? The bug is in the remaining half.
- Repeat until you've isolated the smallest possible failing unit.

**Simplify the data:**
- Replace complex test data with the minimum that triggers the bug
- Remove all fields except those that matter

**Isolate the environment:**
- Does it fail in a fresh database?
- Does it fail without the third-party service?
- Does it fail on a different machine?

If you can't simplify to a 10-line reproduction, you don't understand the bug yet.

### Step 3: Form and Test a Hypothesis

Never randomly change things hoping the bug disappears. That's not debugging — it's lottery.

Form a specific hypothesis: **"I think the bug occurs because X causes Y, which means Z."**

Then design a test that would prove or disprove it:
- Add logging to confirm your assumption about state
- Write a unit test that isolates the suspected component
- Check the value of a variable at the point you think it goes wrong

**One change at a time.** If you change three things and the bug disappears, you don't know what fixed it — and it may come back.

### Step 4: Verify the Fix

After applying a fix:
- [ ] Does the original reproduction case pass?
- [ ] Do existing tests still pass?
- [ ] Have you tested the edge cases adjacent to the bug?
- [ ] Do you understand WHY the fix works?

If you don't understand why the fix works, you haven't fixed the bug — you've changed the symptoms.

## Common Failure Patterns

**Off-by-one errors:**
```javascript
// Bug: misses last element
for (let i = 0; i < arr.length - 1; i++)
// Fix:
for (let i = 0; i < arr.length; i++)
```

**Mutation of shared state:**
```javascript
// Bug: modifies the original array
function addItem(items, newItem) {
  items.push(newItem); // mutates input
  return items;
}
// Fix:
function addItem(items, newItem) {
  return [...items, newItem]; // returns new array
}
```

**Async timing issues:**
```javascript
// Bug: reads state before async operation completes
fetchData();
console.log(this.data); // undefined — fetch not done yet
// Fix: await or use callback
await fetchData();
console.log(this.data); // has data
```

**Null/undefined not handled:**
```javascript
// Bug: crashes when user.address is null
const city = user.address.city;
// Fix:
const city = user.address?.city ?? 'Unknown';
```

**Wrong equality check:**
```javascript
// Bug: '0' == 0 is true in JS (loose equality)
if (value == 0) // catches both 0 and '0' and false and null
// Fix:
if (value === 0) // strict equality
```

**Cache not invalidated:**
Something was fixed in the code but the old behavior persists. Clear cache (browser, CDN, server-side) and test again.

## Debugging Checklist

Before spending more than 30 minutes on a bug, check:

- [ ] Did you read the actual error message? (Don't skim — read it)
- [ ] Is the error in your code or in a dependency?
- [ ] Have you checked the logs around the time of failure?
- [ ] Is the version of the library/framework what you expect?
- [ ] Did it ever work? What changed since then? (`git log` is your friend)
- [ ] Is it a known bug? (Search the error message + library name)
- [ ] Are you debugging the right environment? (prod vs dev vs staging)

## The Rubber Duck Technique

Explain the bug out loud to someone (or to a rubber duck). The act of articulating the problem forces you to think through it systematically. You'll often find the bug mid-explanation.

With Claude Code: describe the bug clearly in the chat. The process of writing it out often reveals the answer before Claude responds.

## When to Ask for Help

Ask for help when:
- You've had the same hypothesis for 2+ hours without progress
- You can't form a new hypothesis
- You suspect a framework/library bug (search GitHub issues first)

When asking: provide the reproduction case, what you've already tried, and your current hypothesis. "It doesn't work" is not enough information.

## Trigger Phrases

- "debug this bug"
- "debugging help"
- "how to debug"
- "find this bug"
- "fix this error"
- "something is broken"
- "intermittent bug"
- "race condition debugging"

## Quick Example

> See `debugging-detective-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Cannot reproduce the bug | Environment or state dependency | Document exact setup (OS, versions, data state); try reproducing in a Docker container for isolation |
| Intermittent bug that disappears under observation | Timing or Heisenbug (observer effect) | Add persistent logging instead of interactive debuggers; let the system run and collect log traces |
| Fixed the bug but don't know why | Changed multiple things at once | Revert all changes, then apply one at a time with a test between each to find the actual fix |
| Bug is in a dependency, not your code | Third-party library issue | Pin the version, search GitHub issues for the error message, consider workaround or fork |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
