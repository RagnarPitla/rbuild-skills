---
name: Bank Reconciliation Assistant
slug: bank-reconciliation-assistant
description: AI agent for bank statement reconciliation in D365 Finance — auto-match transactions, surface exceptions, and accelerate month-end close.
tab: business
domain: industry-verticals
industry_vertical: financial-services
difficulty: intermediate
source_type: ragnar-custom
tags: "[\"financial-services\", \"bank-reconciliation\", \"d365\", \"finance\", \"month-end\"]"
version: 1.0.1
icon_emoji: 🏦
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references:
  - "title: "Bank reconciliation in D365 Finance"
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---


# Bank Reconciliation Assistant

Bank reconciliation is one of the most routine but time-consuming financial close activities. This agent automates the matching and surfaces only true exceptions for human review.

## What the Agent Does

**Auto-matching (handles 80-90% of transactions):**
- Matches bank statement lines to D365 GL transactions by amount + date
- Applies fuzzy matching for minor date differences (transactions posted day before/after)
- Matches cleared checks to outstanding check register
- Handles EFT batches that appear as single bank line with multiple GL transactions

**Exception identification:**
- Transactions on bank statement not in GL (bank charges, wire fees, NSF checks)
- Transactions in GL not on bank statement (outstanding checks, deposits in transit)
- Amount mismatches (partial payments, rounding differences)

**Exception resolution suggestions:**
- For bank charges: suggest posting to correct expense account
- For NSF checks: suggest reversing the original cash receipt
- For stale outstanding checks: flag for escheatment review if over 90 days

**Reconciliation report generation:**
- Produces reconciliation worksheet showing matched, unmatched, and exceptions
- Calculates adjusted bank balance and adjusted book balance
- Confirms they agree (or explains the difference)

## Integration with D365

D365 Finance has built-in bank reconciliation (Cash and bank management → Bank accounts → Reconcile). The agent enhances this by:
- Pre-matching before the accountant opens the reconciliation form
- Providing natural language explanations for exceptions
- Suggesting journal entries for bank-initiated items

## Month-End Impact

A typical $1B company processes 500-2,000 bank transactions per month per account. Manual reconciliation: 4-8 hours per account. With agent-assisted reconciliation: 30-60 minutes per account (review only exceptions).

## Trigger Phrases

- "Help me with bank reconciliation assistant"
- "Bank Reconciliation Assistant"
- "How do I bank reconciliation assistant"

## Quick Example

> See `bank-reconciliation-assistant-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Unexpected output | Unclear input | Add more specific context to your prompt |
| Skill not triggering | Wrong trigger phrase | Use the exact trigger phrases listed above |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
