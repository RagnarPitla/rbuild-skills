---
name: "Agent Memory Patterns"
slug: "agent-memory-patterns"
description: "Memory architecture for AI agents — the four memory types, implementation patterns, and when to use each for cross-session persistence."
tab: "personal"
domain: "ai-agent-dev"
industry_vertical: null
difficulty: "advanced"
source_type: "ragnar-custom"
tags: ["agent-memory", "vector-search", "long-term-memory", "persistence", "knowledge-graph"]
version: "1.0"
icon_emoji: "🧠"
is_coming_soon: false
is_featured: false
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: ["rag-patterns"]
references:
  - title: "LangGraph Memory Concepts"
    url: "https://langchain-ai.github.io/langgraph/concepts/memory/"
  - title: "Building AI Agents with Memory — Anthropic"
    url: "https://www.anthropic.com/research"
---

# Agent Memory Patterns

Without memory, every agent conversation starts from zero. The user re-explains context, the agent re-learns preferences, decisions aren't retained. Memory is what turns an agent from a one-shot tool into a persistent collaborator.

## The Four Memory Types

**1. Working Memory (In-Context)**  
The current conversation history. Lives in the context window. Automatically available to the LLM.  
*Limit:* Context window size. Must be managed for long sessions.

**2. Episodic Memory (Session)**  
Summaries of past conversations. "Last week, you asked about vendor X and we decided to put them on the approved list."  
*Storage:* Database (PostgreSQL, Redis)  
*Retrieval:* By user ID, recency, or topic

**3. Semantic Memory (Long-term Knowledge)**  
Facts, entities, relationships the agent has learned. "User prefers formal language. Department = Finance. Budget authority = $50K."  
*Storage:* Vector database + structured DB  
*Retrieval:* Semantic similarity search

**4. Procedural Memory (Skills)**  
How to perform tasks. Encoded as: agent instructions, few-shot examples, tool descriptions.  
*Storage:* In the agent's prompt/system instructions  
*Update:* Requires prompt engineering

## Working Memory Management

For long conversations, trim the context window strategically:

```python
def trim_conversation(messages, max_tokens=8000):
    # Always keep: system prompt + last N messages
    system = messages[0]
    recent = messages[-10:]  # Last 10 turns always
    
    # Summarize the middle portion
    if len(messages) > 12:
        middle = messages[1:-10]
        summary = llm.summarize(middle)
        return [system, {"role": "system", "content": f"Earlier context: {summary}"}] + recent
    
    return messages
```

Keep the system prompt + last N turns always. Summarize everything else.

## Episodic Memory: Session Storage

After each session, save a structured summary:

```python
session_memory = {
    "user_id": "user_123",
    "session_id": "sess_456",
    "date": "2026-04-09",
    "summary": "User was researching procurement agent patterns. Decided to use Niyam pattern with $25K approval threshold.",
    "decisions": ["Use Niyam pattern", "Set threshold to 25K USD"],
    "entities": ["Niyam pattern", "Procurement agent", "Contoso Inc."],
    "next_steps": ["Build the Dataverse policy table", "Test with finance team"],
    "embedding": embed(summary)  # For semantic retrieval
}
```

**Retrieval:** At the start of a new session, load recent relevant episodes:

```python
def load_relevant_context(user_id: str, current_query: str):
    # Get last 3 sessions
    recent = db.get_recent_sessions(user_id, limit=3)
    
    # Get semantically similar past sessions
    query_embedding = embed(current_query)
    similar = vector_db.search(query_embedding, filter={"user_id": user_id}, top_k=2)
    
    return deduplicate(recent + similar)
```

## Semantic Memory: What to Store

For user-specific semantic memory, store:
- User preferences ("prefers concise answers", "formal tone")
- Domain knowledge the agent learned ("in this company, PO = Purchase Order")
- Entity attributes ("Vendor ABC has 30-day payment terms")
- Decisions made ("approved $50K+ POs require CFO sign-off")

**Schema:**
```python
{
  "user_id": "user_123",
  "entity": "approval_threshold",
  "value": "50000",
  "confidence": 0.95,
  "source": "conversation_session_789",
  "created_at": "2026-04-09",
  "embedding": [...],  # Embed "approval threshold"
}
```

## Memory Retrieval Strategy

Don't load all memory on every turn — that wastes tokens. Retrieve selectively:

```python
def get_relevant_memories(query: str, user_id: str, max_tokens: int = 500):
    memories = []
    
    # 1. Always include: user preferences (small, high-value)
    prefs = db.get_user_preferences(user_id)
    memories.extend(prefs)
    
    # 2. Semantically similar memories
    similar = vector_db.search(embed(query), filter={"user_id": user_id}, top_k=5)
    memories.extend(similar)
    
    # 3. Trim to token budget
    return trim_to_tokens(memories, max_tokens)
```

## Forgetting: When and How

Memory without pruning grows stale. Add forgetting:

- **TTL-based:** Delete memories older than 90 days
- **Confidence decay:** Reduce confidence of old memories, remove below threshold
- **Explicit override:** When user says "actually, the threshold is now $75K", update the memory

```python
# Confidence decay
def decay_memories(user_id: str):
    memories = db.get_user_memories(user_id)
    for memory in memories:
        age_days = (now - memory.created_at).days
        memory.confidence *= (0.99 ** age_days)  # 1% decay per day
        if memory.confidence < 0.1:
            db.delete(memory.id)
```

## The Decision Framework

| Scenario | Memory Type |
|---|---|
| Current conversation | Working memory (context window) |
| "Last time you mentioned..." | Episodic memory |
| "Remember, I prefer..." | Semantic memory (user preferences) |
| "The Niyam pattern means..." | Semantic memory (domain knowledge) |
| "How to submit a PO" | Procedural (agent instructions) |
