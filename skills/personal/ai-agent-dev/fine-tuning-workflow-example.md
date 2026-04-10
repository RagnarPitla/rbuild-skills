# Fine-Tuning Workflow — Example

## Scenario: Base Model Confusing Custom D365 Entities With Standard Objects

**Who:** Kai Nakamura, AI Developer at a 3PL logistics company (D365 F&O, custom modules for warehouse slot management)
**Where:** Python fine-tuning pipeline, OpenAI fine-tuning API, D365 F&O custom entities, Azure Blob Storage
**The Problem:** The company has a heavily customized D365 instance with non-standard entity names: `WMSSlotProfile` (not standard `WMSLocation`), `CarrierLanePriority` (not standard `CarrierRoute`), and `cr023_BillingCycleHeader` (custom Dataverse table). The base GPT-4o model keeps mapping these to their standard D365 equivalents and giving incorrect OData queries. Support tickets from the internal tools team are running at 8/week, all caused by the same entity confusion.

**Prerequisites:** OpenAI API key with fine-tuning access, 50+ labeled examples of correct entity usage, Python 3.11+, familiarity with JSONL format. Budget: fine-tuning a GPT-4o mini model costs roughly $0.008/1k tokens.

---

### What You Say to the Agent

> "I want to fine-tune a model to recognize our company's internal D365 configuration terminology. The base model keeps confusing our custom entities with standard D365 objects. Walk me through the full fine-tuning workflow from data prep to deployment."

### What the Agent Does

1. **Audits the failure mode:** Reviews 40 support tickets and finds that 91% of failures fall into 3 patterns: wrong OData entity name, wrong field name on a known entity, and hallucinated relationships between entities (e.g., assuming `WMSSlotProfile` has a `LocationId` field when it actually has `SlotZoneId`)

2. **Builds the training dataset:** Generates `training_data.jsonl` with 120 examples in OpenAI fine-tune format. Each example is a `{"messages": [...]}` object with a system prompt ("You are a D365 query assistant for [Company]. Use only these entities: [entity_list]"), a user question, and the correct assistant response with the exact OData query. Splits 100 training / 20 validation

3. **Applies data quality checks:** Runs a validation script that checks: all entity names appear in an approved list, all field names are verified against the D365 metadata export, no example is a duplicate (cosine similarity check using sentence-transformers). Rejects 8 examples that had typos in entity names

4. **Runs the fine-tune job:** `openai api fine_tuning.jobs.create --training-file training_data.jsonl --model gpt-4o-mini-2024-07-18 --hyperparameters '{"n_epochs": 4}'`. Training completes in 22 minutes. Total cost: $1.84 for 230k tokens

5. **Evaluates and deploys:** Runs the 20-validation-set examples against both base and fine-tuned models. Base model: 47% correct entity + field name accuracy. Fine-tuned: 94% accuracy. Deploys fine-tuned model ID as an environment variable, wires it into the query assistant FastAPI route with a fallback to base model if the fine-tuned endpoint returns an error

### The Business Impact

- **Entity confusion errors dropped from 8 tickets/week to 0.5 tickets/week** in the first two weeks post-deployment
- **Fine-tuning cost: $1.84** — a one-time investment. Compared to $340/month in developer time spent manually fixing incorrect queries
- **Iteration cycle established** — team now adds 10 new examples monthly and re-fine-tunes quarterly; the model improves as the D365 configuration evolves

### Try It Yourself

> "The fine-tuned model is great at entity names but still struggles with complex OData filter expressions for our custom fields. I want to add 30 more training examples focused on filter syntax. How do I do an incremental fine-tune that builds on the existing model instead of starting from scratch?"
