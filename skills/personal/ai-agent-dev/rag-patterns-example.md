# RAG Patterns — Example

## Scenario: Customer Support Bot That Stops Hallucinating

**Who:** Alex Kim, Full-Stack Developer at a SaaS company (Series B, 60 engineers)
**Where:** Python backend, pgvector on PostgreSQL, Claude API
**The Problem:** Alex built a customer support chatbot using just the Claude API. It answered questions fluently — but kept making up features that didn't exist and quoting policies that weren't accurate. After three customer complaints about the bot giving wrong refund instructions, the product team threatened to shut it down.

**Prerequisites:** Python 3.10+, PostgreSQL with pgvector extension, Anthropic API key. Familiarity with async Python helpful but not required.

---

### What You Say to the Agent

> "Help me implement RAG for our customer support bot. We have a Notion knowledge base with 200+ articles, a pricing page, and a refund policy doc. The bot keeps hallucinating. I need it to only answer from our actual content."

### What the Agent Does

1. **Chunking strategy:** Splits Notion documents at heading boundaries (semantic chunking), not every 500 tokens — this keeps policy sections intact instead of splitting them mid-rule
2. **Embedding pipeline:** Uses `voyage-3` embeddings (better for technical/business content than OpenAI's), stores in pgvector with metadata: source URL, section title, last updated date
3. **Hybrid search:** Implements BM25 keyword search alongside dense vector search, combines results (0.7 dense + 0.3 sparse weight) — catches exact term matches like "refund within 14 days" that semantic search sometimes misses
4. **Reranking step:** After retrieving top-20 results, passes them through Cohere Rerank to get top-5 most relevant — this dramatically reduces irrelevant context sent to Claude
5. **Citation grounding:** System prompt instructs Claude to cite `[source_id]` for every claim. Post-processing validates that every cited ID actually exists in the retrieved chunks — hallucinated citations are caught before reaching the user

### The Business Impact

- **Hallucination rate dropped from 23% to 1.4%** — measured over 500 test queries against known-correct answers
- **Product team reinstated the bot** — with monitoring dashboards showing citation coverage per response
- **New escalation pattern:** When retrieved context has low similarity (< 0.75) to the query, bot now says "I don't have confident information on that — let me connect you to our team" instead of guessing

### Try It Yourself

> "The hybrid search is working but I'm seeing some refund policy questions returning old chunks (we updated the policy last month). How do I implement staleness detection so outdated chunks get deprioritized or invalidated automatically?"
