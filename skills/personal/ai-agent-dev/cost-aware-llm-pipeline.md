---
name: cost-aware-llm-pipeline
description: "LLM cost optimization — model routing by task complexity, caching, prompt compression, batch processing, and per-session budget tracking. Use when user says 'LLM cost optimization', 'reduce API costs', 'model routing', 'token budget', 'LLM spending too much', 'cheapest model for this task', 'prompt caching', 'batch API calls'."
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, ai-agent-dev, cost-optimization, model-routing]
requires: Claude API
mcp_tools:
  - "claude-api"
---

# Cost-Aware LLM Pipeline

LLM API costs scale with usage. A pipeline that ignores cost will become unaffordable the moment it works. Cost optimization is an architectural concern, not an afterthought.

## Model Routing by Task Complexity

Not every task needs your most powerful (and expensive) model. Route intelligently:

| Task Type | Recommended Model | Why |
|---|---|---|
| Simple classification, routing, extraction | claude-haiku-4-5 | Fast, cheap, good enough |
| Summarization, drafting, analysis | claude-sonnet-4-5 | Best quality/cost ratio |
| Complex reasoning, architecture decisions | claude-opus-4-5 | When you need the best |
| Embeddings | text-embedding-3-small | Fast, cheap, sufficient for most RAG |

```python
import anthropic

client = anthropic.Anthropic()

def route_to_model(task: str, context_length: int) -> str:
    """Route task to appropriate model tier based on complexity."""
    
    SIMPLE_TASKS = ["classify", "extract", "route", "validate_format", "yes_no"]
    COMPLEX_TASKS = ["architecture", "compliance_review", "financial_calculation", "code_review"]
    
    task_lower = task.lower()
    
    # Force Haiku for simple tasks
    if any(t in task_lower for t in SIMPLE_TASKS):
        return "claude-haiku-4-5"
    
    # Force Opus for complex/critical tasks
    if any(t in task_lower for t in COMPLEX_TASKS):
        return "claude-opus-4-5"
    
    # Large context = use Sonnet (better at staying coherent in long context)
    if context_length > 50000:
        return "claude-sonnet-4-5"
    
    # Default: Sonnet
    return "claude-sonnet-4-5"

def call_with_routing(task_type: str, prompt: str) -> str:
    model = route_to_model(task_type, len(prompt))
    
    response = client.messages.create(
        model=model,
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )
    
    # Track cost
    track_usage(model, response.usage.input_tokens, response.usage.output_tokens)
    
    return response.content[0].text
```

## Prompt Caching (Anthropic Extended Cache)

For repeated long system prompts, use Anthropic's prompt caching to pay only once:

```python
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1000,
    system=[
        {
            "type": "text",
            "text": very_long_policy_document,  # 10,000 tokens
            "cache_control": {"type": "ephemeral"}  # Cache this block
        }
    ],
    messages=[{"role": "user", "content": user_question}]
)
# First call: full cost. Subsequent calls in 5-min window: ~10% of input cost.
```

Cache is useful when:
- System prompt is long (>1,000 tokens) and repeated across calls
- You have a large knowledge base injected into every call
- Many users share the same base context

## Token Budget Management

Set explicit max_tokens. Don't let models ramble:

```python
TASK_TOKEN_BUDGETS = {
    "classification": 50,       # Yes/No/Category
    "extraction": 200,          # Structured fields
    "summarization": 500,       # Summary paragraphs
    "analysis": 1000,           # Analytical response
    "generation": 2000,         # Full document generation
}

def call_with_budget(task_type: str, prompt: str) -> str:
    max_tokens = TASK_TOKEN_BUDGETS.get(task_type, 500)
    
    response = client.messages.create(
        model=route_to_model(task_type, len(prompt)),
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text
```

## Prompt Compression

Reduce input tokens without losing meaning:

```python
def compress_prompt(text: str, target_tokens: int) -> str:
    """Use a cheap model to compress a long context before sending to expensive model."""
    
    current_tokens = estimate_tokens(text)
    if current_tokens <= target_tokens:
        return text
    
    compression_ratio = target_tokens / current_tokens
    
    compress_response = client.messages.create(
        model="claude-haiku-4-5",  # Cheap model for compression
        max_tokens=target_tokens,
        messages=[{
            "role": "user",
            "content": f"Compress the following text to {int(compression_ratio * 100)}% of its length while preserving all key information and facts:\n\n{text}"
        }]
    )
    return compress_response.content[0].text
```

## Batch Processing

For offline tasks, use the Batch API (50% discount on Anthropic):

```python
import json

def submit_batch(items: list[dict]) -> str:
    """Submit batch request. Returns batch_id for polling."""
    
    requests = [
        {
            "custom_id": f"item-{i}",
            "params": {
                "model": "claude-haiku-4-5",
                "max_tokens": 200,
                "messages": [{"role": "user", "content": item["prompt"]}]
            }
        }
        for i, item in enumerate(items)
    ]
    
    batch = client.beta.messages.batches.create(requests=requests)
    return batch.id

def poll_batch(batch_id: str) -> list[dict]:
    """Poll until batch completes, return results."""
    import time
    
    while True:
        batch = client.beta.messages.batches.retrieve(batch_id)
        if batch.processing_status == "ended":
            break
        time.sleep(60)  # Check every minute
    
    results = []
    for result in client.beta.messages.batches.results(batch_id):
        if result.result.type == "succeeded":
            results.append({
                "id": result.custom_id,
                "text": result.result.message.content[0].text
            })
    return results
```

## Per-Session Budget Tracking

Track costs in real time. Alert before hitting limits:

```python
from dataclasses import dataclass, field

# Approximate costs per 1M tokens (check current pricing)
MODEL_COSTS = {
    "claude-haiku-4-5":  {"input": 0.80,  "output": 4.00},
    "claude-sonnet-4-5": {"input": 3.00,  "output": 15.00},
    "claude-opus-4-5":   {"input": 15.00, "output": 75.00},
}

@dataclass
class BudgetTracker:
    session_id: str
    budget_usd: float
    spent_usd: float = 0.0
    call_count: int = 0
    
    def record(self, model: str, input_tokens: int, output_tokens: int):
        costs = MODEL_COSTS.get(model, MODEL_COSTS["claude-sonnet-4-5"])
        cost = (input_tokens * costs["input"] + output_tokens * costs["output"]) / 1_000_000
        self.spent_usd += cost
        self.call_count += 1
        
        if self.spent_usd > self.budget_usd * 0.8:
            print(f"WARNING: {self.session_id} at {self.spent_usd:.4f}/{self.budget_usd:.2f} budget")
        
        if self.spent_usd > self.budget_usd:
            raise BudgetExceededError(f"Session {self.session_id} exceeded ${self.budget_usd} budget")
    
    @property
    def remaining(self) -> float:
        return self.budget_usd - self.spent_usd
```

## Cost Optimization Checklist

- [ ] Model routing implemented (Haiku for simple tasks)
- [ ] max_tokens set explicitly on every API call
- [ ] Prompt caching enabled for repeated long system prompts
- [ ] Batch API used for offline/async workloads
- [ ] Per-session budget tracking in place
- [ ] Cost dashboards monitoring daily spend
- [ ] Alert configured at 80% of monthly budget

## Trigger Phrases

- "LLM cost optimization"
- "reduce API costs"
- "model routing"
- "token budget"
- "LLM spending too much"
- "cheapest model for this task"
- "prompt caching"
- "batch API calls"

## Quick Example

> See `cost-aware-llm-pipeline-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Costs spiking unexpectedly | No max_tokens set, model generating long responses | Add explicit max_tokens to every call; audit which calls are generating longest outputs |
| Prompt cache not hitting | Cache key changes between calls (dynamic content in cached block) | Move dynamic content AFTER the cached block — only static content should be in cached sections |
| Batch jobs timing out | Items with errors blocking batch completion | Add error handling per item; batches with >5% errors may need investigation |
| Model routing to wrong tier | Task keyword matching too broad | Build a small classifier or use explicit task_type parameter instead of keyword heuristics |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
