---
name: "RAG Patterns"
slug: "rag-patterns"
description: "Retrieval-Augmented Generation from end to end — chunking, embeddings, vector search, reranking, and citation grounding."
tab: "personal"
domain: "ai-agent-dev"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["rag", "retrieval", "embeddings", "vector-search", "llm", "grounding"]
version: "1.0"
icon_emoji: "🧩"
is_coming_soon: false
is_featured: true
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "Anthropic Contextual Retrieval"
    url: "https://www.anthropic.com/research/contextual-retrieval"
  - title: "LangChain RAG Documentation"
    url: "https://python.langchain.com/docs/use_cases/question_answering/"
  - title: "Pinecone RAG Guide"
    url: "https://www.pinecone.io/learn/retrieval-augmented-generation/"
---

# RAG Patterns

RAG is how you give an LLM access to your specific data without fine-tuning. Done right, it's powerful. Done wrong, you get irrelevant retrievals and hallucinated citations.

## The Full Pipeline

```
Document → Chunk → Embed → Store in Vector DB
                                    ↓
Query → Embed → Similarity Search → Top-K Chunks → LLM → Answer
```

Each step has decisions that dramatically affect quality.

## Chunking Strategies

**Fixed-size chunking** (simplest): Split every N tokens with M token overlap.  
Good for: Homogeneous documents (all PDFs, all emails)  
Problem: Splits mid-sentence, mid-concept

**Semantic chunking** (better): Split at natural boundaries (paragraphs, sections, topics).  
Good for: Mixed document types  
Tool: LangChain's SemanticChunker

**Document-structure chunking** (best for structured docs): Respect headings, tables, lists.  
Good for: Technical documentation, policies, manuals

**Chunk size recommendation:** 256-512 tokens for most use cases. Larger chunks = more context but slower retrieval and higher cost. Smaller = more precise but may miss context.

**Always include overlap:** 10-20% overlap between chunks prevents losing information at boundaries.

## Embedding Models

| Model | When to Use |
|---|---|
| `text-embedding-3-small` (OpenAI) | General purpose, fast, cheap |
| `text-embedding-3-large` (OpenAI) | Higher accuracy when it matters |
| `voyage-3` (Anthropic/Voyage) | Best for Claude pipelines |
| Local (nomic-embed-text) | Air-gapped, no API cost |

Use the same model for indexing and querying. Never mix.

## Hybrid Search (BM25 + Dense)

Pure vector search misses exact keyword matches. Pure BM25 misses semantic similarity. Hybrid search combines both:

```python
results = hybrid_search(
    query=query,
    dense_weight=0.7,   # semantic similarity
    sparse_weight=0.3,  # keyword matching
    top_k=20
)
```

Use hybrid search in production. It consistently outperforms either approach alone.

## Reranking

After retrieval, rerank the top-K results with a cross-encoder for higher precision:

```python
# Retrieve more than you need
candidates = vector_search(query, top_k=20)

# Rerank to get the most relevant
results = reranker.rerank(query, candidates, top_n=5)
```

Cross-encoders (Cohere Rerank, BGE-Reranker) score query-document pairs directly rather than comparing embeddings. Slower but dramatically more accurate.

## Citation Grounding

Always tell the LLM to cite sources. Use this pattern:

```python
prompt = f"""Answer the question using ONLY the provided context.
For each claim, cite the source document and section.
If the context doesn't contain the answer, say "I don't have information on that."

Context:
{formatted_chunks_with_source_ids}

Question: {question}

Answer with citations [source_id]:"""
```

Post-process the response to verify every cited source_id actually exists in your retrieved chunks. This catches hallucinated citations.

## Common Failure Modes

| Problem | Cause | Fix |
|---|---|---|
| Wrong document retrieved | Poor chunking splits context | Increase chunk size, add overlap |
| Hallucinated answer | Retrieval misses, LLM fills in | Hybrid search + reranking |
| Hallucinated citations | No citation grounding | Explicit citation instructions + verification |
| Slow queries | Large vector DB without index | Add HNSW index, filter before search |
| Stale answers | No re-indexing pipeline | Schedule daily re-indexing |

## Evaluating RAG Quality

Measure these three things:
- **Retrieval recall**: Are the right documents in top-K?
- **Answer faithfulness**: Is the answer grounded in the retrieved context?
- **Answer relevance**: Does the answer address the question?

Use tools like RAGAS or build a small evaluation set of 50 question-answer pairs to track quality over time.
