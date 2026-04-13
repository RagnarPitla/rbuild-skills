---
name: "fine-tuning-workflow"
slug: "fine-tuning-workflow"
description: "End-to-end fine-tuning pipeline — dataset curation, format conversion, training configuration, evaluation, and when NOT to fine-tune. Use when user says 'fine-tune a model', 'custom training', 'domain-specific LLM', 'train on my data', 'fine-tuning dataset', 'JSONL training format', 'overfitting in fine-tune'."
tab: "personal"
domain: "ai-agent-dev"
industry_vertical: null
difficulty: "advanced"
source_type: "ragnar-custom"
tags: ["advanced", "ai-agent-dev", "fine-tuning", "training"]
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


# Fine-Tuning Workflow

Fine-tuning trains a model on your specific data to improve performance on your specific task. It's powerful — and frequently misapplied. Most problems are better solved with better prompting or RAG.

## When to Fine-Tune (vs Prompt Engineering vs RAG)

| Approach | Best For | When to Use |
|---|---|---|
| Prompt engineering | Style, format, behavior | Try this first — always |
| RAG | Knowledge, facts, documents | When you need current/specific information |
| Fine-tuning | Specialized style, format, patterns at scale | When prompt engineering hits a ceiling |

**Fine-tuning is NOT for:**
- Giving the model new knowledge (use RAG)
- Fixing factual errors (use RAG or retrieval)
- One-off tasks (use a good prompt)
- Small datasets (<100 examples usually)

**Fine-tuning IS for:**
- Specific output format that's hard to prompt for
- Domain-specific tone/style at inference scale
- Reducing token cost (smaller model + fine-tune vs large model + long prompt)
- Tasks where prompt engineering consistently fails despite many tries

## Step 1: Dataset Curation

Quality beats quantity. 100 excellent examples outperforms 1,000 mediocre ones.

**Dataset structure (JSONL format):**
```json
{"messages": [
  {"role": "system", "content": "You are a technical document reviewer."},
  {"role": "user", "content": "Review this code for security issues: [code]"},
  {"role": "assistant", "content": "Security issues found:\n1. Line 12: SQL injection..."}
]}
```

**Curation checklist:**
- [ ] Examples are representative of real production inputs
- [ ] Outputs are the ideal response (what you actually want)
- [ ] No inconsistencies (same input doesn't get different outputs)
- [ ] Deduplication (near-duplicate examples hurt training)
- [ ] Balance (if you have classes, represent them proportionally)
- [ ] Minimum 50 examples, ideally 200+

## Step 2: Data Cleaning

Remove:
- Examples where the ideal output is unclear
- Offensive, sensitive, or biased content
- Duplicate or near-duplicate pairs (>90% similarity)
- Inputs the model should refuse (unless you're training refusals)

## Step 3: Train/Validation Split

80% training, 20% validation. Never include validation examples in training.

The validation set tells you whether the model is actually learning or just memorizing.

## Step 4: Training Configuration

Key hyperparameters (OpenAI example):
```python
client.fine_tuning.jobs.create(
  training_file="file-abc123",
  model="gpt-4o-mini-2024-07-18",
  hyperparameters={
    "n_epochs": 3,          # Start with 3, increase if underfitting
    "batch_size": "auto",   # Let platform decide
    "learning_rate_multiplier": 1.0,  # Reduce if overfitting
  }
)
```

Start with defaults. Adjust based on evaluation results.

## Step 5: Evaluation

Compare fine-tuned model vs base model on your validation set:

**Automated metrics:**
- For classification: accuracy, F1
- For generation: ROUGE, BLEU (limited value, use with caution)
- For your specific task: build a custom eval rubric

**Human evaluation:**
- Blind A/B comparison (evaluator doesn't know which is fine-tuned)
- Rate on: correctness, format adherence, quality
- Need at least 50 comparisons for statistical significance

**Overfitting signals:**
- Training loss low, validation loss high
- Model regurgitates training examples verbatim
- Fails on inputs slightly different from training set

## Step 6: Production Considerations

- **Cost:** Fine-tuned model inference costs same as base model. Training cost is one-time.
- **Version management:** Keep training data versioned. If model degrades, you can retrain.
- **Monitoring:** Track quality metrics in production. Fine-tuned models can drift.
- **Fallback:** Always have the base model (with good prompt) as fallback if fine-tuned model fails.

## Trigger Phrases

- "fine-tune a model"
- "custom training"
- "domain-specific LLM"
- "train on my data"
- "fine-tuning dataset"
- "JSONL training format"
- "overfitting in fine-tune"
- "when to fine-tune vs RAG"

## Quick Example

> See `fine-tuning-workflow-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Model regurgitates training examples | Overfitting from too many epochs or duplicate examples | Reduce n_epochs to 2, deduplicate training data, check validation loss |
| Fine-tuned model worse than base on new inputs | Training data not representative, or underfitting | Audit training examples for diversity; try 4-5 epochs if underfitting |
| High training cost | Dataset too large with low-quality examples | Quality filter: remove ambiguous/inconsistent examples, reduce to 200-500 high-quality pairs |
| Format compliance regressed | Model learned content but forgot format constraints | Add more format-heavy examples to training set and include format in system prompt |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
