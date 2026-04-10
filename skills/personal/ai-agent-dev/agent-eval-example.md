# Agent Eval — Example

## Scenario: D365 Procurement Agent With Vague Quality Complaints

**Who:** Priya Sharma, AI Engineer at a manufacturing company (5,000 employees, SAP-to-D365 migration in progress)
**Where:** Copilot Studio agent, Azure OpenAI GPT-4o, D365 F&O OData backend, Python eval harness
**The Problem:** Priya's vendor Q&A agent has been live for two weeks. Procurement staff say answers feel "off" but can't pinpoint why. The agent correctly retrieves vendor data but sometimes quotes payment terms from the wrong vendor, mixes up currency codes, and occasionally says "I don't know" when the data is clearly available. Nobody can reproduce the failures on demand.

**Prerequisites:** Python 3.11+, `pytest`, `anthropic` SDK, access to the agent's system prompt and tool definitions. A baseline of 40-50 logged conversations from production is ideal.

---

### What You Say to the Agent

> "I need to build a proper eval harness for our D365 procurement agent. Users are complaining answers feel off but I can't reproduce failures. I have 2 weeks of production logs. Help me build an eval suite that catches the specific failure modes."

### What the Agent Does

1. **Log mining for failure taxonomy:** Parses the 2 weeks of conversation logs to cluster failure types. Finds 3 dominant patterns: wrong-vendor data leakage (18% of bad responses), incorrect "I don't know" refusals when vendor_id was present in context (31%), and currency/date formatting drift (51%)

2. **Eval dataset construction:** Builds `evals/procurement_agent.jsonl` with 60 test cases — 20 per failure type. Each record has `input` (user question + injected context), `expected_output` (structured answer), and `tags` (`["currency", "vendor_lookup", "refusal"]`)

3. **LLM-as-judge scorer:** Writes a Python scorer using Claude claude-sonnet-4-5 as judge. Prompt asks the judge to score on three axes (factual accuracy 0-1, refusal appropriateness 0-1, format compliance 0-1) and return JSON. Each axis has explicit rubric criteria to prevent judge drift

4. **Determinism check:** Runs each test case 3 times, flags any case where scores vary by more than 0.15 across runs — these become high-priority human-review items

5. **Baseline + regression gate:** First run establishes baseline scores (factual: 0.71, refusal: 0.63, format: 0.84). Sets up a GitHub Actions step that fails the PR if any dimension drops more than 0.05 from baseline

### The Business Impact

- **Root cause identified in 48 hours** — refusal failures traced to a context injection bug where vendor_id was being truncated past 8 characters; fixed with a one-line change
- **Currency formatting errors eliminated** — eval revealed the system prompt lacked explicit ISO 4217 instructions; adding "always use ISO 4217 currency codes (USD, EUR, GBP)" dropped format errors from 51% to 2%
- **Regression gate in place** — next agent update blocked a prompt change that would have introduced a new 12% failure rate, caught before reaching production

### Try It Yourself

> "The eval harness is running but the LLM judge is inconsistent. Sometimes it scores the same answer 0.6, sometimes 0.9. How do I add calibration examples to the judge prompt to reduce variance below 0.1?"
