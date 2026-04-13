---
name: "santa-method"
slug: "santa-method"
description: "Multi-agent adversarial verification pattern — two independent review agents analyze a solution from different angles, must both agree before proceeding. Use when user says 'Santa method', 'adversarial review', 'multi-agent verification', 'two agent review', 'convergence loop', 'verify critical output', 'agent checks agent work'."
tab: "personal"
domain: "ai-agent-dev"
industry_vertical: null
difficulty: "advanced"
source_type: "ragnar-custom"
tags: ["advanced", "ai-agent-dev", "multi-agent", "adversarial"]
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


# Santa Method

The Santa Method is a multi-agent adversarial verification pattern. Two independent review agents analyze a solution from different angles. Both must agree before the output is accepted. When they disagree, a convergence loop resolves the conflict.

Named after Santa's "naughty or nice" dual-check system — two independent lists, reconciled before a final decision.

## When to Use It

The Santa Method is overkill for simple tasks. Use it when the cost of a wrong answer is high:

- Financial calculations (accruals, cost estimates, pricing)
- Compliance decisions (policy violations, approval thresholds)
- Architecture decisions (irreversible design choices)
- Security reviews (auth logic, permission grants)
- Legal/contract interpretation

## Core Architecture

```
              Input
                |
         [Generator Agent]
          Produces solution
                |
        --------+--------
        |                |
  [Reviewer A]      [Reviewer B]
  "Devil's Advocate"  "Standards Checker"
  Find flaws          Verify against rules
        |                |
        +----[Agree?]----+
              |
          YES: Accept
          NO:  Convergence Loop
                |
         [Arbiter Agent]
         Reconciles disagreement
                |
            Final output
```

## Implementation

```python
import anthropic
import json

client = anthropic.Anthropic()

def generator_agent(problem: str) -> str:
    """Produces initial solution."""
    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1500,
        messages=[{
            "role": "user",
            "content": f"Solve this problem and provide a complete solution:\n\n{problem}"
        }]
    )
    return response.content[0].text

def reviewer_a(solution: str, problem: str) -> dict:
    """Devil's Advocate: actively looks for flaws, risks, and edge cases."""
    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1000,
        messages=[{
            "role": "user",
            "content": f"""You are a Devil's Advocate reviewer. Your job is to find every possible flaw, risk, edge case, or incorrect assumption in the proposed solution.

Problem: {problem}

Proposed solution: {solution}

Review the solution aggressively. Look for:
- Logical errors or incorrect reasoning
- Missing edge cases
- Incorrect assumptions
- Risks not accounted for
- Better alternatives that were ignored

Return JSON: {{"verdict": "ACCEPT" or "REJECT", "issues": ["issue 1", "issue 2", ...], "confidence": 0.0-1.0}}"""
        }]
    )
    return json.loads(response.content[0].text)

def reviewer_b(solution: str, problem: str, standards: str = "") -> dict:
    """Standards Checker: verifies solution against rules and best practices."""
    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1000,
        messages=[{
            "role": "user",
            "content": f"""You are a Standards Checker reviewer. Your job is to verify the solution follows correct procedures, standards, and best practices.

Problem: {problem}
Standards/Rules: {standards if standards else "General best practices for this domain"}

Proposed solution: {solution}

Check for:
- Compliance with stated requirements
- Adherence to standards and best practices
- Completeness (does it address the full problem?)
- Correctness of approach

Return JSON: {{"verdict": "ACCEPT" or "REJECT", "issues": ["issue 1", ...], "confidence": 0.0-1.0}}"""
        }]
    )
    return json.loads(response.content[0].text)

def arbiter_agent(problem: str, solution: str, review_a: dict, review_b: dict) -> dict:
    """Reconciles disagreement between reviewers."""
    response = client.messages.create(
        model="claude-opus-4-5",  # Use best model for arbitration
        max_tokens=2000,
        messages=[{
            "role": "user",
            "content": f"""Two reviewers have disagreed on this solution. Reconcile their views and produce a final verdict.

Problem: {problem}

Solution: {solution}

Reviewer A (Devil's Advocate) verdict: {review_a['verdict']}
Issues raised: {review_a['issues']}

Reviewer B (Standards Checker) verdict: {review_b['verdict']}
Issues raised: {review_b['issues']}

Analyze both reviews. Determine which issues are valid and which are not. Produce a final verdict.

Return JSON: {{"verdict": "ACCEPT" or "REJECT", "valid_issues": [...], "dismissed_issues": [...], "final_reasoning": "..."}}"""
        }]
    )
    return json.loads(response.content[0].text)

def santa_method(problem: str, standards: str = "", max_loops: int = 3) -> dict:
    """
    Full Santa Method flow with convergence loop.
    Returns accepted solution or escalation signal.
    """
    
    # Generate initial solution
    solution = generator_agent(problem)
    
    for loop in range(max_loops):
        # Run both reviewers independently
        review_a = reviewer_a(solution, problem)
        review_b = reviewer_b(solution, problem, standards)
        
        both_accept = review_a["verdict"] == "ACCEPT" and review_b["verdict"] == "ACCEPT"
        
        if both_accept:
            return {
                "status": "accepted",
                "solution": solution,
                "loops": loop + 1,
                "confidence": min(review_a["confidence"], review_b["confidence"])
            }
        
        # Disagreement or both reject — run arbiter
        arbiter_result = arbiter_agent(problem, solution, review_a, review_b)
        
        if arbiter_result["verdict"] == "ACCEPT":
            return {
                "status": "accepted_via_arbitration",
                "solution": solution,
                "loops": loop + 1,
                "valid_issues": arbiter_result["valid_issues"]
            }
        
        # Arbiter also rejected — regenerate with issues as guidance
        issues_summary = "\n".join(arbiter_result["valid_issues"])
        solution = generator_agent(f"{problem}\n\nPrevious attempt failed due to:\n{issues_summary}\n\nFix these issues in your solution.")
    
    # Exhausted loops without agreement
    return {
        "status": "escalate",
        "solution": solution,
        "reason": "Could not reach consensus after max loops",
        "loops": max_loops
    }
```

## Reviewer Specializations

Choose reviewer roles that create useful tension for your domain:

| Domain | Reviewer A | Reviewer B |
|---|---|---|
| Financial | "Find calculation errors" | "Check compliance with policy" |
| Code review | "Security auditor" | "Performance/architecture reviewer" |
| Architecture | "Risk/failure mode finder" | "Standards and patterns checker" |
| Contract | "Risk-seeking lawyer" | "Risk-averse compliance officer" |
| Agent design | "Edge case hunter" | "Best practices enforcer" |

## Quality Gates

Add confidence thresholds to prevent low-quality acceptance:

```python
MIN_CONFIDENCE = 0.80  # Both reviewers must be at least 80% confident

if both_accept:
    if review_a["confidence"] < MIN_CONFIDENCE or review_b["confidence"] < MIN_CONFIDENCE:
        # Accept but flag for human review
        return {"status": "accepted_low_confidence", "flag_for_review": True, ...}
```

## Trigger Phrases

- "Santa method"
- "adversarial review"
- "multi-agent verification"
- "two agent review"
- "convergence loop"
- "verify critical output"
- "agent checks agent work"
- "devil's advocate agent"

## Quick Example

> See `santa-method-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Both reviewers always agree | Reviewers have same system prompt perspective | Ensure Reviewer A is explicitly adversarial; give it a directive to find problems |
| Convergence loop never terminates | Arbiter keeps rejecting without actionable feedback | Cap at max_loops=3 and escalate to human; add "provide specific fixes" to arbiter prompt |
| Arbiter biased toward one reviewer | Prompt framing favors one perspective | Balance arbiter prompt: "weigh both reviews equally; dismissed issues need justification" |
| High cost per task | All three agents use Opus | Route generator and reviewers to Sonnet; reserve Opus only for arbiter (final arbitration) |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
