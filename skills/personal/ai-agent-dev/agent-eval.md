---
name: agent-eval
description: "Evaluation framework for AI agents — pass/fail test cases, regression harnesses, RAGAS for RAG pipelines, and using Claude as judge. Use when user says 'evaluate my agent', 'agent evaluation', 'how do I measure agent quality', 'build an eval harness', 'LLM as judge', 'task completion rate', 'agent regression testing'."
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [advanced, ai-agent-dev, evaluation, llm-judge]
requires: Claude API
mcp_tools:
  - "claude-api"
---

# Agent Eval

Evaluation framework for AI agents — pass/fail test cases, regression harnesses, metrics, and using Claude as judge.

## Why Eval First

Without evals, you have no idea if a prompt change improved or broke your agent. Eval-driven development means: write failing test cases first, fix the agent, confirm tests pass. Ship with confidence.

## Core Metrics

| Metric | Definition | Target |
|---|---|---|
| Task completion rate | % of tasks the agent completes end-to-end | >90% for production |
| Accuracy | % of completed tasks with correct output | >95% for critical tasks |
| Hallucination rate | % of responses with fabricated facts | <2% |
| Tool call accuracy | % of tool calls with correct params | >98% |
| Latency P95 | 95th percentile response time | <5s for interactive |
| Cost per task | Average token spend per completed task | Track and trend |

## Test Case Design

A good eval test case has three things: input, expected output (or rubric), and a pass/fail criterion.

```python
# eval_cases.py
eval_cases = [
    {
        "id": "TC001",
        "description": "Vendor lookup by name",
        "input": "Find vendor Contoso in the system",
        "expected_contains": ["Contoso", "vendor"],
        "expected_tool_calls": ["search_vendor"],
        "pass_criteria": "response_contains_vendor_name and tool_called"
    },
    {
        "id": "TC002",
        "description": "Refuse out-of-scope request",
        "input": "Delete all purchase orders from last year",
        "expected_behavior": "refusal",
        "expected_not_contains": ["deleted", "removed", "completed"],
        "pass_criteria": "agent_declines_without_executing"
    },
    {
        "id": "TC003",
        "description": "Multi-step workflow",
        "input": "Create a PO for 50 units of item A from vendor B with standard payment terms",
        "expected_steps": ["lookup_vendor", "lookup_item", "create_po"],
        "pass_criteria": "all_steps_executed_in_order"
    }
]
```

## Simple Eval Harness

```python
import anthropic
import json
from typing import TypedDict

client = anthropic.Anthropic()

def run_eval(agent_fn, test_cases: list) -> dict:
    results = []
    
    for case in test_cases:
        response = agent_fn(case["input"])
        
        passed = evaluate_case(response, case)
        results.append({
            "id": case["id"],
            "description": case["description"],
            "passed": passed,
            "response": response,
            "input": case["input"]
        })
    
    total = len(results)
    passed = sum(1 for r in results if r["passed"])
    
    return {
        "pass_rate": passed / total,
        "total": total,
        "passed": passed,
        "failed": total - passed,
        "failures": [r for r in results if not r["passed"]]
    }

def evaluate_case(response: str, case: dict) -> bool:
    # Check expected contains
    if "expected_contains" in case:
        if not all(term.lower() in response.lower() for term in case["expected_contains"]):
            return False
    
    # Check not contains (refusals)
    if "expected_not_contains" in case:
        if any(term.lower() in response.lower() for term in case["expected_not_contains"]):
            return False
    
    return True
```

## Claude as Judge

For qualitative evals, use Claude to score responses:

```python
def llm_judge(question: str, response: str, rubric: str) -> dict:
    judge_prompt = f"""You are an evaluator scoring an AI agent's response.

Question asked: {question}

Agent response: {response}

Evaluation rubric:
{rubric}

Score the response on these dimensions (1-5 each):
1. Correctness: Is the information accurate?
2. Completeness: Does it fully address the question?
3. Groundedness: Is every claim supported by evidence (no hallucinations)?
4. Format: Is the response format appropriate?

Return JSON: {{"correctness": X, "completeness": X, "groundedness": X, "format": X, "overall": X, "reasoning": "..."}}"""

    result = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=500,
        messages=[{"role": "user", "content": judge_prompt}]
    )
    
    return json.loads(result.content[0].text)
```

Use `claude-haiku-4-5` for judge calls to keep eval costs low. Reserve Sonnet/Opus for the actual agent being evaluated.

## RAGAS for RAG Pipeline Evaluation

RAGAS measures three things about RAG systems:

```python
from ragas import evaluate
from ragas.metrics import (
    faithfulness,           # Is the answer grounded in retrieved context?
    answer_relevancy,       # Does the answer address the question?
    context_recall,         # Were the right docs retrieved?
    context_precision       # Were retrieved docs actually useful?
)
from datasets import Dataset

# Build eval dataset
eval_data = {
    "question": ["What is the approval threshold for POs?"],
    "answer": ["POs over $50,000 require CFO approval."],
    "contexts": [["...policy doc chunk 1...", "...policy doc chunk 2..."]],
    "ground_truth": ["The approval threshold for purchase orders over $50,000 is CFO sign-off."]
}

dataset = Dataset.from_dict(eval_data)
results = evaluate(dataset, metrics=[faithfulness, answer_relevancy, context_recall])
print(results)
# {'faithfulness': 0.94, 'answer_relevancy': 0.87, 'context_recall': 0.91}
```

Target: faithfulness > 0.90, answer_relevancy > 0.85, context_recall > 0.80.

## Regression Testing Pattern

Run evals in CI on every agent prompt change:

```python
# ci_eval.py
import sys

results = run_eval(my_agent, regression_suite)

MIN_PASS_RATE = 0.90  # 90% pass rate required

if results["pass_rate"] < MIN_PASS_RATE:
    print(f"EVAL FAILED: {results['pass_rate']:.0%} pass rate (required: {MIN_PASS_RATE:.0%})")
    print("Failed cases:")
    for failure in results["failures"]:
        print(f"  - {failure['id']}: {failure['description']}")
    sys.exit(1)  # Fail the CI build

print(f"EVAL PASSED: {results['pass_rate']:.0%} ({results['passed']}/{results['total']})")
```

## Eval Checklist

- [ ] Baseline eval suite established before making any changes
- [ ] Test cases cover main use cases, edge cases, and refusal cases
- [ ] LLM-as-judge rubric defined for qualitative dimensions
- [ ] Regression suite runs in CI on every prompt change
- [ ] RAGAS metrics tracked for RAG components (if applicable)
- [ ] Cost per task tracked alongside quality metrics
- [ ] Failure analysis process defined (who reviews, how fast)

## Quick Example

> See `agent-eval-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| High false positive rate in evals | Pass criteria too loose (substring match on short words) | Use stricter matching or LLM judge for semantic evaluation |
| Eval suite passes but agent regresses in prod | Eval cases don't reflect real user inputs | Add cases from actual production logs every sprint |
| RAGAS faithfulness score is low | Agent generating content beyond retrieved context | Strengthen system prompt: "Answer only from provided context. Do not add information." |
| Eval costs too high | Running Opus-level judge on every case | Route judge calls to Haiku; use Sonnet only for complex rubrics |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
