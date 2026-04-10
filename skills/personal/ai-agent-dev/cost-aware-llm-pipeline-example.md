# Cost-Aware LLM Pipeline — Example

## Scenario: $4,200/Month Document Classification Pipeline Needs Model Routing

**Who:** Sofia Andersen, ML Engineer at an insurance company (document processing team, 50k documents/month)
**Where:** Python pipeline, Anthropic API, S3 document store, PostgreSQL metadata DB, FastAPI
**The Problem:** The team built a document classification pipeline using Claude claude-opus-4-5 for everything: policy renewals, claim forms, invoices, handwritten notes, and medical reports. It works well but costs $4,200/month. The CFO flagged it. An audit shows 80% of documents are straightforward claim forms and invoices that follow strict templates — they're being sent to Opus unnecessarily. Only the 20% of handwritten notes and edge cases actually need Opus-level reasoning.

**Prerequisites:** Python 3.11+, Anthropic Python SDK, familiarity with async processing. AWS account for S3 if replicating exactly, but the pattern works with any object store.

---

### What You Say to the Agent

> "We're spending $4,200/month on Claude API for document classification. 80% of docs are simple and don't need Opus. Help me implement model routing so we use a cheap model for easy documents and only escalate to Opus when needed."

### What the Agent Does

1. **Implements the complexity classifier:** Writes a lightweight pre-screening step using Claude claude-haiku-4-5 (cost: $0.00025/1k input tokens). Prompt: "Classify this document as SIMPLE or COMPLEX. SIMPLE = structured forms with clear fields. COMPLEX = handwritten, ambiguous, multi-language, or requiring inference." This call costs ~$0.0004 per document and routes 78% to the Haiku path

2. **Builds the routing layer:** Python class `ModelRouter` with method `route(document_features) -> Model`. Features: page count, has_handwriting (from metadata), language_count, template_match_score (cosine similarity against 12 known templates). If `template_match_score > 0.85` AND `has_handwriting == False`, use Haiku. Otherwise, use claude-sonnet-4-5. Escalate to Opus only if Sonnet returns confidence < 0.7

3. **Adds confidence-based escalation:** Sonnet classification response includes a `confidence` field (0-1) via JSON mode. If `confidence < 0.7`, the document is re-sent to Opus with the Sonnet reasoning chain included as context. This "warm escalation" means Opus starts with Sonnet's partial work, reducing its token usage by ~40%

4. **Implements budget tracking:** Redis counter keyed on `{month}:{model}` tracks tokens used per model per month. FastAPI endpoint `/api/spend/current` returns real-time spend. A hard cap at 110% of monthly budget triggers an alert and drops routing to Haiku-only mode until manual override

5. **Benchmarks accuracy parity:** Runs the new routing pipeline against 500 labeled documents used for the original Opus baseline. Haiku path: 94.1% accuracy (vs. 96.8% Opus baseline) on structured documents. Sonnet path: 96.1% accuracy. Only 4% of documents reach Opus.

### The Business Impact

- **Monthly spend dropped from $4,200 to $890** — a 79% cost reduction in the first month
- **Latency improved for 78% of documents** — Haiku processes in 340ms average vs. Opus at 2,100ms, unblocking a downstream dashboard that was lagging
- **Accuracy held at 96.2% overall** — within 0.6% of the all-Opus baseline, accepted by the product team as a valid tradeoff

### Try It Yourself

> "The routing is working well. Now I want to add prompt caching for the 12 document templates we use in the Haiku path, since the system prompt is 800 tokens and gets sent with every call. How do I implement Anthropic prompt caching to reduce that overhead?"
