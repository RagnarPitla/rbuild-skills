---
name: agent-requirements-planner
description: Interactive discovery workflow that asks the right questions and generates a complete structured agent requirements document. Use when user says "help me plan an agent", "agent requirements gathering", "what do I need to know before building an agent", "scope an AI agent project", "agent design document", "what questions should I ask before building a Copilot Studio agent".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, requirements, discovery, agent-design]
requires: Copilot Studio, Dataverse MCP
mcp_tools:
  - "copilot-studio-mcp"
  - "dataverse-mcp"
  - "d365-fno-mcp"
---


# Agent Requirements Planner

## What This Skill Does

Before writing a single line of agent YAML or Copilot Studio configuration, you need a clear picture of what the agent actually does, what systems it touches, and how it handles failure. This skill runs an interactive discovery session asking the right questions across six dimensions, then produces a structured requirements document you can use to build or brief a developer.

This is the same discovery process I run before every Copilot Studio agent deployment at Microsoft.

## Triggers

- "help me plan an agent"
- "agent requirements gathering"
- "what do I need to know before building an agent"
- "scope an AI agent project"
- "agent design document"
- "what questions should I ask before building a Copilot Studio agent"
- "agent requirements planner"
- "build a requirements doc for my AI agent"

## The Discovery Process

When this skill is invoked, run through the six discovery dimensions below. Ask each set of questions. Capture answers. Then produce the requirements document using the template at the end.

### Dimension 1: Users and Context

```
1. Who are the primary users of this agent?
   (Role, department, technical level)

2. How will they access the agent?
   (Teams, web chat, email, embedded in app)

3. What does a typical interaction look like?
   (User says X, they expect Y back)

4. How many users? How often do they use it?
   (Daily active users, transactions per day)

5. Are there multiple user types with different permissions?
   (Manager vs clerk, read vs write access)
```

### Dimension 2: Current Process

```
1. What process is the agent replacing or augmenting?
   (Describe the current manual steps)

2. How long does the current process take?
   (Minutes per transaction, transactions per day)

3. How many people are involved today?
   (FTE count, role types)

4. Where do errors happen most often in the current process?
   (Root causes, frequency, cost)

5. What does "done well" look like today?
   (What does a skilled human do that makes the outcome good?)
```

### Dimension 3: Systems and Data

```
1. What systems does the agent need to read from?
   (D365 F&O modules, Dataverse tables, SharePoint, external APIs)

2. What systems does the agent need to write to or trigger?
   (Create records, approve, send notifications, run flows)

3. What authentication model is in place?
   (Azure AD, service principals, user delegation)

4. Is the data already in D365/Dataverse, or does it need integration?
   (Data availability assessment)

5. What are the data quality issues in the source systems?
   (Missing fields, inconsistent formats, stale data)
```

### Dimension 4: Business Rules and Policies

```
1. What are the approval thresholds and routing rules?
   (Dollar amounts, categories, roles)

2. How often do these rules change?
   (Monthly, quarterly, annually. This determines if Niyam pattern is needed.)

3. Who owns the rules: business or IT?
   (Determines governance model)

4. Are there regulatory or compliance constraints?
   (Audit trail requirements, data residency, approval chain)

5. What are the exceptions to the rules?
   (Edge cases, override scenarios, special handling)
```

### Dimension 5: Escalation and Failure

```
1. When should the agent stop and involve a human?
   (Specific conditions, not "when it's not sure")

2. Who does the agent escalate to?
   (Role, name, Teams channel, email)

3. What happens if the agent can't complete a task?
   (User message, fallback action, logging)

4. What's the SLA for human escalations?
   (How fast must a human respond?)

5. What's the recovery path if the agent makes an error?
   (Correction workflow, audit trail, rollback)
```

### Dimension 6: Success Metrics

```
1. What does success look like in 90 days?
   (Specific measurable outcome)

2. What's the containment rate target?
   (% of interactions handled without human intervention)

3. What metrics will you track weekly?
   (Volume, containment, CSAT, error rate)

4. What's the minimum acceptable performance to stay in production?
   (Kill switch criteria)

5. Who reviews agent performance and how often?
   (Governance cadence)
```

## Core Tasks

### 1. Run Discovery Session

```
GIVEN user wants to plan an agent build
WHEN skill runs discovery
THEN ask all six dimension question sets
AND capture answers in structured format
AND identify gaps or ambiguities
AND flag Niyam pattern need if rules change frequently
```

### 2. Generate Requirements Document

```
GIVEN discovery answers are complete
WHEN skill generates requirements document
THEN produce structured doc using template below
AND include tool catalog with data entity names
AND include escalation policy table
AND include success metrics with baseline targets
```

### 3. Identify Architecture Pattern

```
GIVEN requirements document is complete
WHEN skill analyzes scope
THEN recommend: single agent vs parent/child architecture
AND recommend: MCP server vs Power Automate flows vs both
AND recommend: Niyam pattern if rule change frequency is high
AND flag missing data or integration dependencies
```

## Requirements Document Template

```markdown
# Agent Requirements: [Agent Name]

## Overview
- **Agent Name:** [name]
- **Business Domain:** [AP / Procurement / Finance / etc.]
- **Primary User:** [Role, department]
- **Access Channel:** [Teams / Web / Embedded]
- **Complexity:** [Starter / Intermediate / Advanced]

## Problem Statement
[2-3 sentences: current process, pain point, impact]

## Scope
### In Scope
- [Specific capability 1]
- [Specific capability 2]

### Out of Scope
- [Explicitly excluded capability 1]
- [Explicitly excluded capability 2]

## User Stories
| As a... | I want to... | So that... |
|---|---|---|
| [role] | [action] | [outcome] |

## Tool Catalog
| Tool Name | System | Data Entity / API | Operation |
|---|---|---|---|
| get_vendor_info | D365 F&O | VendorsV2 | Read |
| get_po_status | D365 F&O | PurchaseOrderHeadersV2 | Read |
| approve_invoice | Power Automate | D365 Invoice Approval Flow | Write |

## Business Rules
| Rule ID | Rule Description | Source | Change Frequency |
|---|---|---|---|
| BR-001 | Auto-approve threshold: $10,000 | Finance policy | Quarterly |
| BR-002 | Preferred vendor list by category | Procurement policy | Monthly |

## Escalation Policy
| Condition | Escalate To | Channel | SLA |
|---|---|---|---|
| Amount > $50,000 | CFO | Teams | 4 hours |
| Vendor not in approved list | Procurement Manager | Email | 24 hours |
| Agent confidence < 80% | Any available reviewer | Teams | 2 hours |

## Success Metrics
| Metric | Baseline (Today) | Target (90 days) | Measurement Method |
|---|---|---|---|
| Containment rate | 0% | 80% | Copilot Studio analytics |
| Time per transaction | [X min] | [Y min] | Time-and-motion study |
| Error rate | [X%] | < 2% | Exception log review |

## Architecture Recommendation
- **Pattern:** [Single agent / Parent + child agents]
- **Policy layer:** [Niyam / Hardcoded / None]
- **Data access:** [MCP server / Power Automate / Both]
- **Estimated build time:** [X weeks]

## Open Questions
1. [Unresolved question from discovery]
2. [Missing data or access to clarify]

## Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| [Risk description] | High/Med/Low | High/Med/Low | [Mitigation action] |
```

## Checklist: Ready to Build?

- [ ] All six discovery dimensions answered
- [ ] Tool catalog complete with D365 entity names
- [ ] Escalation policy defined with specific conditions
- [ ] Success metrics agreed with business stakeholder
- [ ] Architecture pattern selected
- [ ] IT access and authentication confirmed
- [ ] Named business champion identified
- [ ] Governance model and review cadence set

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Discovery stalls, stakeholders give vague answers | They haven't mapped their own process | Run a process walkthrough: ask them to screen-share and show you what they do today, step by step |
| Tool catalog incomplete, D365 entities unknown | No D365 technical resource in the room | Schedule a 1-hour session with a D365 functional consultant to map entities to business concepts |
| Escalation policy undefined | Business owners haven't agreed on edge cases | Present specific scenarios: "The agent sees an invoice for $47K from a vendor not on the approved list. What happens?" Force concrete answers. |
| Success metrics missing baseline | No historical data captured | Before go-live, spend 1 week having users manually log transaction times and error counts to establish baseline |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Complete skill content: discovery framework, requirements template, checklist, troubleshooting |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
