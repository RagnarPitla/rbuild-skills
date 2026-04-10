# APA Review — Example

## Scenario: Quote Submitted With 22% Discount Exceeding Policy Threshold

**Who:** Lars Koenig, Sales Engineer, Mercedes-Benz MBTI (IT subsidiary), submitting a D365 F&O implementation quotation for a German automotive parts distributor
**Where:** Angebots-Prufungs Agent (APA) review workflow, integrated with the D365 project quotation module
**The Problem:** Lars submitted a project quotation (APA-2024-0318) for a D365 F&O Phase 1 implementation covering Finance, Supply Chain, and Warehouse Management for a mid-size client. The total professional services value is 1.24M EUR. To win the deal against a SAP competitor, Lars applied a 22% discount on the consulting day rates, bringing the effective rate to 1,170 EUR/day for senior consultants. The APA policy threshold for professional services discounts is 15%. The quote has gone into the review queue without Lars flagging the exception.

**Prerequisites:** APA policy tables loaded in Dataverse, quote lines synced from D365 project quotation

---

### What You Say to the Agent

> "Review APA-2024-0318 for policy compliance before it goes to the approval committee."

### What the Agent Does

1. Retrieves all line items from APA-2024-0318 and calculates effective discount percentage per service category: professional services at 22.1%, travel at 0%, software licensing at 0%
2. Flags the professional services discount as a policy breach — the 22.1% rate exceeds the 15% threshold defined in the APA discount policy (policy rule PS-DISC-003, approved April 2023)
3. Checks the client segment classification: the client is classified as a Tier 2 mid-market account, which does not qualify for the strategic account exception that permits up to 20% discounts for Tier 1 accounts
4. Calculates the financial impact: at 22.1% versus the allowed 15%, the excess discount reduces gross margin by 87,400 EUR on this contract, dropping the projected project margin from 31% to 24.4%, which falls below the 25% floor defined in the profitability policy (rule PM-FLOOR-001)
5. Generates an exception request summary with the deal context, competitive pressure note, and the dual policy breach clearly documented, and routes it to Lars and the regional sales director for a formal exception approval before the quote proceeds

### The Business Impact

- **Policy breach caught before committee review** — the approval committee receives a fully documented exception request, not a surprise during the meeting
- **87,400 EUR margin impact quantified** — finance and management have exact numbers, not an estimate
- **Dual policy violation surfaced** — the agent identifies both the discount threshold breach and the margin floor breach, which would have been missed if only one policy was checked

### Try It Yourself

> "What is the maximum professional services discount Lars can apply to a Tier 2 account on a deal over 1M EUR without triggering a margin floor violation?"
