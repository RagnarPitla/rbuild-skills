---
name: "autonomous-loops"
slug: "autonomous-loops"
description: "Patterns for continuous autonomous agent loops — sequential pipelines, event-driven, scheduled, multi-agent DAG, quality gates, and recovery. Use when user says 'autonomous agent loop', 'continuous agent pipeline', 'agent runs automatically', 'scheduled agent', 'multi-agent DAG', 'loop termination', 'quality gate in agent pipeline'."
tab: "personal"
domain: "ai-agent-dev"
industry_vertical: null
difficulty: "advanced"
source_type: "ragnar-custom"
tags: ["advanced", "ai-agent-dev", "autonomous", "pipelines"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "Claude API"
mcp_tools: []
---


# Autonomous Loops

An autonomous loop is an agent that runs without human intervention on every step. The architecture choices you make upfront determine whether it runs reliably in production or blows up on edge cases.

## Loop Pattern Taxonomy

| Pattern | When to Use | Risk Level |
|---|---|---|
| Sequential pipeline | Steps must happen in order, each depends on previous | Medium |
| Event-driven | Trigger on external event (webhook, file arrival, queue message) | Medium |
| Scheduled | Run at fixed intervals (nightly, hourly) | Low |
| Multi-agent DAG | Independent subtasks can run in parallel | High |
| Feedback loop | Agent evaluates its own output and retries until passing | High |

## Pattern 1: Sequential Pipeline

```python
import anthropic

client = anthropic.Anthropic()

def run_pipeline(input_data: dict) -> dict:
    """Sequential pipeline with quality gates at each step."""
    
    # Step 1: Parse and validate input
    parsed = step_parse(input_data)
    if not parsed["valid"]:
        return {"status": "failed", "step": "parse", "reason": parsed["error"]}
    
    # Step 2: Enrich with external data
    enriched = step_enrich(parsed["data"])
    
    # Step 3: LLM analysis
    analysis = step_analyze(enriched)
    
    # Quality gate: check confidence
    if analysis["confidence"] < 0.75:
        return {"status": "low_confidence", "analysis": analysis, "requires_review": True}
    
    # Step 4: Execute action
    result = step_execute(analysis)
    
    return {"status": "completed", "result": result}

def step_analyze(data: dict) -> dict:
    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1000,
        messages=[{
            "role": "user",
            "content": f"Analyze this data and return JSON with fields: analysis, confidence (0-1), recommended_action.\n\nData: {data}"
        }]
    )
    return parse_json_response(response.content[0].text)
```

## Pattern 2: Event-Driven Loop

```python
import asyncio
from dataclasses import dataclass

@dataclass
class Event:
    type: str
    payload: dict
    timestamp: float

async def event_loop(queue: asyncio.Queue, max_iterations: int = 1000):
    """Process events until queue empty or max iterations hit."""
    iterations = 0
    
    while iterations < max_iterations:
        try:
            event = await asyncio.wait_for(queue.get(), timeout=5.0)
        except asyncio.TimeoutError:
            # No events for 5 seconds — check if we should stop
            if should_terminate():
                break
            continue
        
        result = await process_event(event)
        
        # Events can generate new events (but cap depth to prevent infinite loops)
        if result.get("next_events") and iterations < max_iterations - 10:
            for next_event in result["next_events"]:
                await queue.put(next_event)
        
        iterations += 1
        queue.task_done()
    
    return {"iterations": iterations, "status": "completed"}
```

## Pattern 3: Scheduled Agent

```python
import schedule
import time
import logging

logger = logging.getLogger(__name__)

def nightly_reconciliation():
    """Runs nightly. Must be idempotent."""
    run_id = generate_run_id()
    
    try:
        logger.info(f"Starting nightly reconciliation run {run_id}")
        
        # Check if already ran today (idempotency)
        if already_ran_today(run_id):
            logger.info("Already ran today, skipping")
            return
        
        result = run_reconciliation_agent()
        record_run(run_id, status="success", result=result)
        
    except Exception as e:
        record_run(run_id, status="failed", error=str(e))
        alert_on_call(f"Nightly reconciliation failed: {e}")
        raise

schedule.every().day.at("02:00").do(nightly_reconciliation)

while True:
    schedule.run_pending()
    time.sleep(60)
```

## Pattern 4: Multi-Agent DAG

```python
import asyncio
from typing import Callable

async def run_dag(tasks: dict[str, dict]) -> dict:
    """
    tasks format:
    {
        "task_name": {
            "fn": async_function,
            "deps": ["dep1", "dep2"]  # task names this depends on
        }
    }
    """
    results = {}
    completed = set()
    
    async def execute_task(name: str, task: dict):
        # Wait for all dependencies
        while not all(dep in completed for dep in task.get("deps", [])):
            await asyncio.sleep(0.1)
        
        dep_results = {dep: results[dep] for dep in task.get("deps", [])}
        result = await task["fn"](dep_results)
        results[name] = result
        completed.add(name)
    
    # Launch all tasks (they self-manage dependency waiting)
    await asyncio.gather(*[
        execute_task(name, task) 
        for name, task in tasks.items()
    ])
    
    return results

# Usage
dag_tasks = {
    "fetch_data": {"fn": fetch_data_agent, "deps": []},
    "validate": {"fn": validate_agent, "deps": ["fetch_data"]},
    "analyze_a": {"fn": analysis_agent_a, "deps": ["validate"]},
    "analyze_b": {"fn": analysis_agent_b, "deps": ["validate"]},  # runs in parallel with analyze_a
    "merge": {"fn": merge_agent, "deps": ["analyze_a", "analyze_b"]}
}
```

## Quality Gates

Every loop needs explicit quality checks before proceeding:

```python
def quality_gate(result: dict, config: dict) -> tuple[bool, str]:
    """Returns (passes, reason). Block loop if False."""
    
    checks = [
        ("confidence", lambda r: r.get("confidence", 0) >= config["min_confidence"]),
        ("completeness", lambda r: all(k in r for k in config["required_fields"])),
        ("no_hallucination", lambda r: verify_citations(r) if r.get("citations") else True),
        ("cost_budget", lambda r: r.get("tokens_used", 0) <= config["max_tokens_per_task"]),
    ]
    
    for check_name, check_fn in checks:
        if not check_fn(result):
            return False, f"Failed: {check_name}"
    
    return True, "passed"
```

## Loop Termination Conditions

Always define explicit termination. Infinite loops in production are bad.

```python
class LoopController:
    def __init__(self, max_iterations=50, max_runtime_seconds=300, max_cost_usd=5.0):
        self.max_iterations = max_iterations
        self.max_runtime = max_runtime_seconds
        self.max_cost = max_cost_usd
        self.iterations = 0
        self.start_time = time.time()
        self.total_cost = 0.0
    
    def should_continue(self) -> tuple[bool, str]:
        if self.iterations >= self.max_iterations:
            return False, f"Max iterations ({self.max_iterations}) reached"
        if time.time() - self.start_time > self.max_runtime:
            return False, f"Max runtime ({self.max_runtime}s) exceeded"
        if self.total_cost > self.max_cost:
            return False, f"Cost budget (${self.max_cost}) exceeded"
        return True, "continue"
```

## Recovery Mechanisms

```python
async def resilient_step(fn, input_data, max_retries=3, backoff_base=2):
    """Retry with exponential backoff. Log all failures."""
    last_error = None
    
    for attempt in range(max_retries):
        try:
            return await fn(input_data)
        except RateLimitError:
            wait = backoff_base ** attempt
            logger.warning(f"Rate limited on attempt {attempt + 1}, waiting {wait}s")
            await asyncio.sleep(wait)
        except InvalidResponseError as e:
            logger.error(f"Invalid response on attempt {attempt + 1}: {e}")
            last_error = e
            # Don't retry invalid responses — fix the prompt instead
            break
        except Exception as e:
            logger.error(f"Unexpected error on attempt {attempt + 1}: {e}")
            last_error = e
            await asyncio.sleep(backoff_base ** attempt)
    
    raise RuntimeError(f"Step failed after {max_retries} attempts: {last_error}")
```

## Trigger Phrases

- "autonomous agent loop"
- "continuous agent pipeline"
- "agent runs automatically"
- "scheduled agent"
- "multi-agent DAG"
- "loop termination"
- "quality gate in agent pipeline"
- "agent recovery mechanism"

## Quick Example

> See `autonomous-loops-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Loop runs forever | No termination condition defined | Add LoopController with max_iterations, max_runtime, and max_cost |
| DAG tasks run in wrong order | Dependency graph has cycle or missing dep declaration | Draw the DAG on paper, verify no cycles, ensure all deps listed |
| Loop fails silently | Exceptions swallowed, no alerting | Add explicit try/except at loop level, alert on any unhandled exception |
| Scheduled agent runs twice | No idempotency check, duplicate scheduler instances | Add run_id + already_ran_today check, ensure only one scheduler instance |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
