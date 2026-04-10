---
name: bank-reconciliation-assistant
description: Automates bank statement reconciliation in D365 Finance by matching transactions, surfacing exceptions, and accelerating month-end close. Use when user says "bank reconciliation", "reconcile bank statement", "outstanding checks", "deposits in transit", "bank statement exceptions", "month-end bank close", or "unmatched bank transactions".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, financial-services, bank-reconciliation, finance]
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

- "bank reconciliation"
- "reconcile bank statement"
- "outstanding checks"
- "deposits in transit"
- "unmatched bank transactions"
- "bank statement exceptions"
- "month-end bank close"
- "NSF check reversal"

## Quick Example

> See `bank-reconciliation-assistant-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Transactions not matching despite same amount | Bank statement date and GL posting date differ by more than the fuzzy window | Extend the date tolerance window in matching configuration from 2 days to 5 days; review your posting calendar |
| EFT batch shows as unmatched | Bank posts EFT as single line; D365 has multiple individual GL entries | Enable batch aggregation matching mode to group GL transactions by EFT batch reference before comparing to bank line |
| Outstanding checks not clearing after payment | Vendor check cashed but GL cleared in different period | Verify the period is open in D365; check that the bank clearing account is not locked by period-end controls |
| Reconciliation report shows difference that doesn't match any exception | Rounding differences from multi-currency accounts | Identify the functional currency rounding account; post a rounding adjustment journal entry and rerun the reconciliation |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
