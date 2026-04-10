---
name: niyam-worker-agent-template
description: Parent plus reusable Worker agent pattern for scalable Copilot Studio multi-agent architectures. Use when user says 'Niyam worker agent', 'reusable worker agent pattern', 'scalable multi-agent architecture', 'worker agent that handles tasks from a parent', 'build a worker agent for parallel task execution', 'Niyam worker template'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [advanced, niyam-pattern, worker-agent, orchestration]
requires: Copilot Studio VS Code Extension
mcp_tools:
  - "copilot-studio:manage-agent"
  - "copilot-studio:validate"
  - "copilot-studio:chat-directline"
---


# Niyam Worker Agent Template

Parent plus reusable Worker agent pattern. The Worker is a specialized Copilot Studio agent designed to receive structured tasks from a Parent orchestrator, execute them using D365 MCP and Dataverse policies, and return results. Workers are reusable across multiple parent agents and domains.

## Trigger Phrases

- "Niyam worker agent pattern"
- "reusable worker agent Copilot Studio"
- "scalable multi-agent architecture with workers"
- "worker agent receives tasks from parent"
- "build a worker agent for parallel task execution"
- "Niyam worker template setup"
- "how does the worker agent pattern work"
- "parent dispatches work to worker agents"

## What This Skill Does

Builds a Niyam Worker Agent: a Copilot Studio agent designed to be invoked by a parent orchestrator, execute a specific domain task using D365 MCP and Dataverse policies, and return a structured result. The worker pattern enables scalable architecture because one worker design can be reused across multiple parent agents.

## Pattern Architecture

```
Parent Orchestrator
  |
  +-- routes by intent (description-based routing)
  |
  +-- Worker Agent A (e.g., PO Validator)
  |     Reads: Dataverse procurement policies
  |     Acts: D365 MCP — query PO lines, check vendor status
  |     Returns: validation result + recommended action
  |
  +-- Worker Agent B (e.g., Vendor Compliance Checker)
  |     Reads: Dataverse vendor compliance policies
  |     Acts: D365 MCP — query vendor master, check certifications
  |     Returns: compliance status + issues list
  |
  +-- Worker Agent C (e.g., Invoice Matcher)
        Reads: Dataverse matching tolerance policies
        Acts: D365 MCP — query invoice and receipt lines
        Returns: match result + variance details
```

## Worker vs Standard Child Agent

| Characteristic | Standard Child Agent | Niyam Worker Agent |
|---|---|---|
| Invocation | User-facing, triggered by user input | Invoked by parent orchestrator with structured inputs |
| Input | Natural language from user | Structured task parameters from parent |
| Policy source | Hardcoded in instructions | Reads from Dataverse at runtime |
| Reusability | Tied to one parent | Designed to be reused across multiple parents |
| D365 access | Optional | Required (read or read+write) |

## Core Tasks

### 1. Design the Worker's Task Contract
```text
GIVEN a domain task that workers will execute
WHEN skill designs the worker
THEN define inputs: what the parent must pass to invoke the worker
  - Task type (string): what the worker should do
  - Entity reference (string): D365 record ID or number
  - User context (object): email, department, locale
  - Policy overrides (optional): any parent-level policy context
AND define outputs: what the worker returns to the parent
  - Result status: Success / PolicyBreach / Error / NeedsApproval
  - Result summary (string): human-readable outcome
  - Action taken (string): what the worker did
  - Next step recommendation (string): what parent should do next
AND document the contract before building
```

### 2. Write Worker System Instructions
```text
GIVEN the task contract definition
WHEN skill writes worker system instructions
THEN open with: "You are a Worker Agent. You are invoked by a parent orchestrator, not users directly."
AND declare the specific domain and task scope
AND declare D365 MCP connection and entity access
AND declare Dataverse policy table to read
AND define output structure: always return structured result to parent
AND keep instructions narrow — workers do one thing well
```

### 3. Build the Worker's Execution Topic
```text
GIVEN worker receives task inputs from parent
WHEN skill builds the execution topic
THEN read input variables set by parent (Global or mapped inputs)
AND query Dataverse policies for this task type
AND query D365 via MCP using the entity reference
AND apply policy rules to the D365 data
AND determine outcome: pass / fail / needs approval
AND if policy breached: do not proceed, set result status to PolicyBreach
AND if approval needed: trigger Power Automate approval flow
AND set output variables with result status and summary
AND return control to parent via End of Activity node
```

### 4. Wire Parent to Worker
```text
GIVEN parent agent and worker agent both exist
WHEN skill wires the connection
THEN add worker as child agent in parent (Settings → Connected agents)
AND write worker description as routing instructions:
  "Use this worker when the parent needs to [specific task]. Inputs required: [list]. Returns: [result structure]."
AND set up input variable mapping in parent topic before invoking worker
AND read output variables from worker after return
AND branch parent logic based on worker result status
```

## Worker Agent Description Template

```
Use this agent when the orchestrator needs to [specific task, e.g., "validate a purchase order against procurement policies"].

Required inputs:
- EntityReference: [D365 record identifier, e.g., PO number]
- UserEmail: authenticated user's email
- UserDepartment: user's business unit

This agent will:
1. Read [policy table] from Dataverse
2. Query [D365 entities] via MCP
3. Apply [business rules] and return a structured result

Returns: ResultStatus (Success/PolicyBreach/NeedsApproval/Error), ResultSummary, NextStepRecommendation

This agent does NOT handle user conversations directly.
```

## Worker System Instruction Template

```
You are the [Domain] Worker Agent for [Company]. You are invoked by a parent orchestrator — you do not interact with users directly.

Your task: [specific task description]

You have access to:
- D365 F&O via MCP: query [entity list]
- Dataverse policy table (cr023_[domain]_policy): read active policies

Execution behavior:
1. Read the task inputs provided by the parent
2. Query Dataverse for active policies relevant to this task
3. Query D365 for the entity data referenced in inputs
4. Apply policies to the data
5. Return a structured result: ResultStatus, ResultSummary, NextStepRecommendation

If a policy is breached: set ResultStatus = PolicyBreach. Do not proceed with any write operations.
If approval is required: trigger the approval Power Automate flow before any write.
Always confirm the action before writing to D365, even if the caller is a parent agent.
```

## Checklist: Niyam Worker Build

- [ ] Task contract defined (inputs and outputs documented)
- [ ] Dataverse policy table ready with relevant policies seeded
- [ ] D365 MCP connection available and authenticated
- [ ] Worker system instructions written and scoped to one task
- [ ] Worker description written as routing instructions for parent
- [ ] Execution topic built with policy query and D365 query steps
- [ ] Output variables set correctly for all outcome paths
- [ ] Power Automate flow built for any approval outcomes
- [ ] Worker tested independently before connecting to parent
- [ ] Parent input mapping configured for all required worker inputs
- [ ] Parent reads worker output and branches correctly on result status

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Parent never invokes the worker | Worker description too vague or overlapping with another child | Rewrite worker description with explicit task scope and required input list |
| Worker receives empty inputs | Parent topic not mapping variables before invoking worker | Add variable mapping step in parent topic before worker invocation node |
| Worker returns no output | Output variables not set in worker execution topic | Verify all result variables are set on every branch path before End of Activity node |
| Policy check skipped in worker | Dataverse query failing silently | Add error handling after Dataverse query; log and return Error status if query fails |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and full content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
