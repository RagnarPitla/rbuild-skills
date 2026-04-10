---
name: architecture-decision-records
description: ADR template and workflow for capturing architectural decisions with context, rationale, and alternatives. Use when user says 'ADR template', 'architecture decision', 'document this decision', 'why did we choose', 'record architectural choice', 'decision log'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, software-engineering, adr, architecture]
---


# Architecture Decision Records

An ADR is a short document capturing a significant architectural decision. The goal is to record not just what was decided, but why — so the next engineer (including future you) understands the reasoning without having to reconstruct it from code and commits.

## When to Write an ADR

Write an ADR for decisions that are:
- **Hard to reverse** — choosing a database engine, an auth provider, a message broker
- **Affect multiple teams** — API contract changes, shared infrastructure
- **Non-obvious** — if someone might question the choice later, document it now
- **Architectural** — affects how the system is structured, not just how a function works

Do NOT write an ADR for:
- Tactical implementation choices (which loop to use)
- Library patch upgrades
- Bug fixes

## The ADR Template

```markdown
# ADR-[number]: [Short title — imperative mood, e.g., "Use PostgreSQL for primary storage"]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-XXX]

## Date
[YYYY-MM-DD when the decision was made]

## Context

What is the issue that motivates this decision? 
What is the current situation? What forces are at play?

Write 2-4 paragraphs. Be specific about the constraints and 
requirements that make this decision necessary.

## Decision

What is the change we're proposing or have agreed to implement?

State the decision clearly and directly. "We will use X" not 
"We considered X". One paragraph.

## Alternatives Considered

### Option A: [Name]
What it is. Why it was attractive. Why it was rejected.

### Option B: [Name]
What it is. Why it was attractive. Why it was rejected.

## Consequences

### Positive
- [What becomes easier or better]
- [What problems this solves]

### Negative
- [What becomes harder]
- [What new risks or constraints this introduces]

### Neutral
- [Side effects that are neither good nor bad]

## References
- [Links to relevant docs, GitHub issues, RFCs, or previous ADRs]
```

## Worked Example

```markdown
# ADR-012: Use cursor-based pagination for the Activity Feed API

## Status
Accepted

## Date
2026-03-15

## Context

The Activity Feed endpoint returns a list of events sorted by timestamp descending.
In load testing, we observed that offset-based pagination returned duplicate items
when new events were inserted between page requests. At 10k+ events per minute
on active accounts, this happens on virtually every paginated request.

Additionally, COUNT(*) queries for total page calculation are taking 800ms on tables
with 50M+ rows, causing P99 latency to exceed our 1s SLA.

## Decision

We will switch the Activity Feed API from offset-based pagination to cursor-based
pagination. The cursor will be a base64-encoded composite of (timestamp, event_id)
to handle events with identical timestamps.

## Alternatives Considered

### Option A: Keep offset pagination, add eventual-consistency warning
Rejected. The UX impact of missing events in a feed is unacceptable for our audit
log use case. Users rely on the feed being complete.

### Option B: Keyset pagination with timestamp only
Rejected. Events can have identical timestamps at high write rates, causing some
events to be skipped permanently.

## Consequences

### Positive
- Eliminates duplicate/missing events in paginated responses
- Removes expensive COUNT(*) query (from 800ms to 2ms for pagination metadata)
- Supports real-time streaming patterns in the future

### Negative
- Clients cannot jump to an arbitrary page (page 47 of results)
- Migration required for existing API consumers (3 known integrations)
- Cursors are opaque — harder to debug than offset numbers

### Neutral
- Response format changes (next_cursor replaces total and page fields)
- Sunset date for v1 pagination format: 2026-09-01
```

## File Structure

Store ADRs in your repository, close to the code:

```
docs/
  decisions/
    ADR-001-use-postgresql.md
    ADR-002-adopt-typescript-strict-mode.md
    ADR-012-cursor-pagination-feed-api.md
  README.md   # Links to ADR index
```

## Numbering and Referencing

Use sequential numbers: ADR-001, ADR-002, etc. Never reuse numbers — if a decision is overturned, mark the old ADR as "Superseded by ADR-XXX" and write a new one.

Reference ADRs in code for non-obvious choices:

```typescript
// See ADR-012: cursor-based pagination for activity feed
// Composite cursor encodes (timestamp, event_id) to handle ties
const cursor = Buffer.from(`${event.timestamp}:${event.id}`).toString('base64');
```

## ADR Lifecycle

```
Proposed -> Accepted -> [Deprecated | Superseded]
```

- **Proposed:** Under discussion, not yet agreed
- **Accepted:** Agreed and implemented (or in progress)
- **Deprecated:** No longer applies (system removed, use case gone)
- **Superseded:** A newer ADR overrides this one — update both

## Trigger Phrases

- "ADR template"
- "architecture decision"
- "document this decision"
- "why did we choose"
- "record architectural choice"
- "decision log"
- "write an ADR"
- "when to write an ADR"

## Quick Example

> See `architecture-decision-records-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| ADRs never get written | No clear trigger for when to write one | Add "does this need an ADR?" to PR template checklist; use the hard-to-reverse / affects-multiple-teams criteria |
| ADRs go stale and mislead | Status not updated when decisions change | Review ADR status in quarterly architecture reviews; add Superseded notes immediately when a decision changes |
| Too much time spent writing ADRs | Treating every decision as architectural | Reserve ADRs for decisions that are hard to reverse or affect multiple teams; use inline comments for tactical choices |
| Team ignores ADRs | Not discoverable | Add ADR index to README, reference specific ADRs in code comments at the decision point |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
