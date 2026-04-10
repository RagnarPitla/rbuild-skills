---
name: tamagotchi-worker-agent-template
description: Self-healing Copilot Studio agents with step-based control plane and autonomous recovery. Use when user says 'self-healing agent', 'agent stuck in a loop', 'Tamagotchi pattern', 'agent that monitors itself', 'checkpoint-based agent recovery', 'autonomous agent recovery Copilot Studio', 'agent step control plane'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [advanced, self-healing, checkpoints, autonomous]
requires: Copilot Studio VS Code Extension
mcp_tools:
  - "copilot-studio:manage-agent"
  - "copilot-studio:validate"
  - "copilot-studio:chat-directline"
---


# Tamagotchi Worker Agent Template

Self-healing Copilot Studio agents with a step-based control plane. The Tamagotchi pattern extends the Niyam Worker pattern with autonomous health monitoring: the agent tracks its own progress in Dataverse, detects stuck states and failures, and recovers without human intervention.

## Trigger Phrases

- "self-healing Copilot Studio agent"
- "Tamagotchi agent pattern"
- "agent stuck in a loop — how do I fix it"
- "agent that monitors its own health"
- "checkpoint-based agent recovery"
- "autonomous agent recovery in Copilot Studio"
- "step control plane for Copilot Studio agent"
- "agent that resumes from where it failed"

## What This Skill Does

Builds a Tamagotchi-pattern agent: a Copilot Studio Worker agent that executes multi-step tasks, writes a checkpoint to Dataverse after each step, monitors its own health, and recovers from failures autonomously. Input is a multi-step task definition. Output is a Copilot Studio agent with Dataverse checkpoint table, step execution topics, health monitor topic, and recovery logic.

## Why "Tamagotchi"

A Tamagotchi needs to be kept alive — it signals when it needs attention. This pattern works the same way: the agent signals its own health state, detects when it's stuck, and either self-heals or escalates for human help. Unlike a standard worker that fails silently, a Tamagotchi agent never goes dark.

## Pattern Architecture

```
Tamagotchi Worker Agent
  |
  +-- Step Control Plane (Dataverse)
  |     cr023_task_execution table
  |     - step_number (current step)
  |     - step_status (Pending / InProgress / Complete / Failed)
  |     - last_heartbeat (datetime)
  |     - retry_count (number)
  |     - error_details (text)
  |
  +-- Execution Topics (one per step)
  |     Step 1: [action] → write checkpoint
  |     Step 2: [action] → write checkpoint
  |     Step N: [action] → write checkpoint
  |
  +-- Health Monitor Topic
  |     Runs on schedule or invoked by parent
  |     Reads checkpoint table
  |     Detects: last_heartbeat > threshold → agent stuck
  |     Action: retry, escalate, or recover from last checkpoint
  |
  +-- Recovery Topic
        Reads last successful checkpoint
        Resumes from that step
        Increments retry_count
        Escalates if retry_count > max_retries
```

## Core Tasks

### 1. Design the Checkpoint Table
```text
GIVEN a multi-step task the agent executes
WHEN skill designs the Dataverse checkpoint schema
THEN create table: cr023_task_execution
AND add columns:
  - cr023_task_id (text, required) — unique ID per task instance
  - cr023_task_type (text) — what kind of task
  - cr023_step_number (integer) — current step (0 = not started)
  - cr023_step_name (text) — human-readable step label
  - cr023_step_status (choice) — Pending / InProgress / Complete / Failed / Recovered
  - cr023_last_heartbeat (datetime) — last time agent wrote a checkpoint
  - cr023_retry_count (integer) — how many times this step was retried
  - cr023_max_retries (integer) — max retries before escalation
  - cr023_error_details (text, multiline) — last error message
  - cr023_escalation_sent (boolean) — has escalation already been triggered
AND add index on task_id and step_status for efficient queries
```

### 2. Write Step Execution Topics
```text
GIVEN multi-step task where each step must be tracked
WHEN skill builds each step's topic
THEN at topic start: update checkpoint to InProgress, write heartbeat timestamp
AND execute the step action (D365 MCP call, Power Automate flow, etc.)
AND handle error: if action fails → write Failed status and error_details → do not proceed
AND on success: update checkpoint to Complete, increment step_number, write heartbeat
AND invoke next step topic OR return to parent if final step
AND never skip the checkpoint write — this is what enables recovery
```

### 3. Build the Health Monitor Topic
```text
GIVEN agent needs to detect stuck states
WHEN skill builds the health monitor topic
THEN query Dataverse for tasks where:
  - step_status = InProgress
  - last_heartbeat < (now minus heartbeat_threshold_minutes)
AND for each stuck task: check retry_count vs max_retries
AND if retry_count < max_retries: trigger recovery topic for this task
AND if retry_count >= max_retries: send escalation notification, set escalation_sent = true
AND log health check result
```

### 4. Build the Recovery Topic
```text
GIVEN a stuck or failed task identified by health monitor
WHEN skill builds the recovery topic
THEN read the last checkpoint (last completed step)
AND determine resume point: last complete step + 1
AND increment retry_count
AND reset step_status to Pending for the failed step
AND re-invoke the execution topic for the resume step
AND write a new heartbeat to signal recovery is in progress
AND return recovery outcome to health monitor
```

## Step Execution Topic Template

```
[Topic trigger: invoked by previous step or parent]

Step entry:
1. Read Global.TaskId from session variables
2. Update cr023_task_execution: step_status = InProgress, last_heartbeat = now()

Execute step action:
3. [MCP call / Power Automate / Dataverse query]
4. Condition: action succeeded?
   Yes → continue to step 5
   No  → update checkpoint: step_status = Failed, error_details = [error message]
         End topic (health monitor will detect and retry)

Step complete:
5. Update cr023_task_execution:
   step_status = Complete
   step_number = [next step number]
   last_heartbeat = now()
6. Invoke next step topic (or End of Activity if final step)
```

## Heartbeat Thresholds (Reference)

| Task Duration | Recommended Heartbeat Threshold | Max Retries |
|---|---|---|
| Short tasks (under 2 min) | 5 minutes | 3 |
| Medium tasks (2-10 min) | 15 minutes | 2 |
| Long tasks (10+ min) | 30 minutes | 1 (then escalate) |

## Checklist: Tamagotchi Agent Build

- [ ] Multi-step task mapped out (step names, order, dependencies)
- [ ] Checkpoint table schema designed and created in Dataverse
- [ ] Max retries and heartbeat thresholds defined per task type
- [ ] Escalation contact identified for each task type
- [ ] One execution topic built per step with checkpoint writes
- [ ] Error handling on every step action (not just happy path)
- [ ] Health monitor topic built and tested with simulated stuck task
- [ ] Recovery topic built and tested from various step failure points
- [ ] Escalation notification flow built in Power Automate
- [ ] End-to-end test: normal execution, mid-step failure, recovery

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Agent not recovering from stuck state | Health monitor topic not running, or heartbeat threshold too long | Verify health monitor is scheduled or triggered; reduce heartbeat threshold to detect stuck states faster |
| Recovery loops infinitely | retry_count not incrementing correctly, or max_retries check missing | Add explicit increment of retry_count before retry, add hard stop when retry_count >= max_retries |
| Checkpoint not written after step | Topic completes but Dataverse update action failed silently | Add error handling after every Dataverse write; log failure and halt if checkpoint write fails |
| Escalation sent multiple times | escalation_sent flag not checked before sending | Check cr023_escalation_sent = false before triggering escalation, then set it to true immediately |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and full content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
