# Bank Reconciliation Assistant — Example

## Scenario: 847 Unreconciled Items, Month-End in 48 Hours

**Who:** Priya Nair, Staff Accountant, Meridian Group (multi-entity professional services, 6 legal entities)
**Where:** D365 F&O Bank Management module, Contoso Bank account ending 4471
**The Problem:** March's bank reconciliation has 847 unmatched items. The bank statement shows $2.1M in unmatched credits and debits. Month-end close is in 2 days. Priya's previous reconciliation approach — manual line-by-line matching in Excel — took 3 days for half this volume last quarter. The controller has flagged this account for audit committee review.

**Prerequisites:** D365 F&O MCP Server, bank statement imported (MT940 or CSV format), prior-period reconciliation complete

---

### What You Say to the Agent

> "I have 847 unreconciled items on account 4471 for March. Match what you can automatically and group the rest by category so I know where to focus first."

### What the Agent Does

1. Pulls all 847 open statement lines and D365 ledger entries for account 4471, March 1-31
2. Runs exact-match pass on amount plus date (tolerance: 0 days): clears 612 items totaling $1.84M
3. Runs fuzzy-match pass on amount with a 3-day float window: clears an additional 156 items, including 48 ACH receipts where the bank settlement date lagged the posting date by 1-2 business days
4. Groups the remaining 79 unmatched items into four categories: 31 outstanding checks (total $87,400, all issued in March), 22 deposits in transit ($134,200), 14 bank fees and wire charges not yet recorded in D365 ($6,340), and 12 items requiring manual investigation ($29,880 — includes 3 duplicate-amount transactions and 1 reversed wire with mismatched reference numbers)
5. Drafts journal entry lines for the 14 bank fee items ready for Priya's review and posting

### The Business Impact

- **768 of 847 items cleared in under 8 minutes** — 90.7% auto-matched, reducing manual work from 3 days to less than 4 hours
- **Month-end close protected** — reconciliation completed within the 48-hour window; audit committee review proceeded with a clean rec
- **$29,880 exception pool identified** — the 12 flagged items revealed a $14,200 wire reversal that had not been reposted, which would have caused a cash overstatement on the balance sheet

### Try It Yourself

> "Show me all outstanding checks older than 60 days across all 6 entities and flag any that exceed $10,000 for potential escheatment review."
