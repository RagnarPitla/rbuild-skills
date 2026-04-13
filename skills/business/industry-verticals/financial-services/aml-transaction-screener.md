---
name: "aml-transaction-screener"
slug: "aml-transaction-screener"
description: "Screens financial transactions against AML rules, sanctions lists, and behavioral baselines to detect suspicious patterns and generate SAR-ready documentation. Use when user says \"screen transactions for AML\", \"suspicious transaction\", \"OFAC check\", \"structuring detection\", \"file a SAR\", \"AML alert\", or \"sanctions screening\"."
tab: "business"
domain: "industry-verticals"
industry_vertical: "financial-services"
difficulty: "advanced"
source_type: "ragnar-custom"
tags: ["advanced", "financial-services", "aml", "compliance"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "D365 F&O MCP Server"
mcp_tools: []
---



# AML Transaction Screener

Anti-Money Laundering (AML) compliance is mandatory for financial institutions. Manual transaction review at scale is impossible — this agent automates first-pass screening and surfaces only genuine risks for human review.

## Screening Checks

### Sanctions Screening
Every transaction is checked against:
- OFAC SDN (Specially Designated Nationals) list
- EU Consolidated Sanctions List
- UN Security Council Consolidated List
- Domestic law enforcement watchlists

**Matching logic:** Fuzzy matching handles name variations, transliterations, aliases. The agent uses a configurable match threshold (e.g., 85% similarity) from Dataverse policy table. Below threshold = pass. Above threshold = flag for human review.

### Rule-Based Pattern Detection

**Structuring detection:** Multiple transactions just below reporting thresholds (e.g., three $9,800 deposits in one week when the CTR threshold is $10,000).

**Velocity anomalies:** Transaction frequency significantly above customer's historical baseline. New customer with 50 transactions in week 1 = flag.

**Round-amount transactions:** Unusually high proportion of round-dollar amounts (common in layering).

**Geographic risk:** Transactions involving high-risk jurisdictions (FATF grey/black list countries).

**Cash-intensive business patterns:** Business type doesn't match transaction patterns (nail salon with $500K in wire transfers).

### Behavioral Analytics
Compares current behavior to the customer's own historical baseline:
- Amount anomaly: Transaction 5x larger than customer's typical transaction
- Counterparty anomaly: First transaction with this counterparty + high amount
- Time anomaly: Transaction at unusual hour for this customer

## Alert Prioritization

Not all alerts are equal. Score each alert 1-10:

| Factor | Points |
|---|---|
| Sanctions match | 8-10 |
| Structuring pattern | 7-9 |
| High-risk jurisdiction | 5-7 |
| Velocity anomaly | 4-6 |
| New relationship + large amount | 4-6 |
| Behavioral anomaly only | 2-4 |

Alerts scoring >7: immediate review queue
Alerts scoring 5-7: 24-hour review queue
Alerts scoring <5: weekly batch review

## SAR Documentation Support

When an investigator decides to file a Suspicious Activity Report:

The agent pre-populates the SAR form with:
- Transaction details (dates, amounts, accounts)
- Pattern description (what triggered the alert)
- Related transactions (other activity in the same cluster)
- Counterparty information (known data on the suspect)
- Narrative draft (what happened, why it's suspicious)

Investigator reviews, edits, and finalizes — reducing SAR preparation time from hours to minutes.

## Trigger Phrases

- "screen transactions for AML"
- "suspicious transaction alert"
- "OFAC sanctions check"
- "structuring detection"
- "file a SAR"
- "AML transaction screening"
- "sanctions screening"
- "unusual transaction pattern"

## Quick Example

> See `aml-transaction-screener-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| High false positive rate on sanctions matching | Match threshold set too low (below 85%) | Raise similarity threshold in Dataverse policy table; review and tune fuzzy match configuration |
| Structuring alerts firing on legitimate payroll runs | Payroll processor splits batches below reporting threshold | Add payroll counterparty to whitelist rule in Dataverse; exclude batch type from structuring detection |
| SAR narrative generation is too generic | Transaction cluster context not passed to agent | Ensure the full transaction history window (90 days) is included in the screening context, not just the flagged transaction |
| Alert score inconsistent across identical transactions | Currency conversion not normalized before scoring | Confirm all transaction amounts are converted to base currency before behavioral comparison logic runs |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
