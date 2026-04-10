---
name: "Personal Finance Report"
slug: "personal-finance-report"
description: "Turn your bank statements, credit card exports, or spreadsheet data into a clear monthly finance report with trends, categories, and recommendations."
tab: "personal"
domain: "productivity"
industry_vertical: null
difficulty: "starter"
source_type: "ragnar-custom"
tags: ["finance", "personal-finance", "budgeting", "report", "money", "analysis"]
version: "1.0.1"
icon_emoji: "💰"
is_coming_soon: false
is_featured: true
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "YNAB — You Need A Budget (methodology)"
    url: "https://www.ynab.com/the-four-rules"
requires: "None"
mcp_tools: []
---

# Personal Finance Report

Paste your data, get a clear picture of where your money went — and what to do about it.

No spreadsheet skills needed. No financial software. Just paste your transactions (CSV, copy-paste from your bank, or a simple list) and the skill does the rest.

## What You Give It

**Option A: CSV export** (most banks have this)
```
Date,Description,Amount
2026-03-01,Spotify,-9.99
2026-03-01,Salary,5000.00
2026-03-03,Whole Foods,-87.43
```

**Option B: Copy-paste from your bank app**
Just copy the transaction list directly from your banking app. Claude handles messy formatting.

**Option C: Manual list**
```
Rent: -2200
Groceries: -340
Coffee shops: -89
Netflix, Spotify, Disney+: -47
```

## What It Produces

### 1. Category Breakdown
```
MARCH 2026 — SPENDING SUMMARY

Income:          $5,000.00
Total Spending:  $3,847.22
Net:             $1,152.78 saved (23.1%)

SPENDING BY CATEGORY:
Housing          $2,200   (57.2%) ████████████████░░░░
Food & Dining      $427   (11.1%) ████░░░░░░░░░░░░░░░░
Transport          $312    (8.1%) ███░░░░░░░░░░░░░░░░░
Subscriptions      $147    (3.8%) █░░░░░░░░░░░░░░░░░░░
Entertainment       $89    (2.3%) █░░░░░░░░░░░░░░░░░░░
Other              $672   (17.5%) ████░░░░░░░░░░░░░░░░
```

### 2. Trends (if you provide multiple months)
- "Coffee spending up 34% vs February"
- "Subscriptions: you're paying for 11 services"
- "Groceries down 12% — good trend"

### 3. Flags and Observations
- Duplicate charges detected
- Subscriptions you might have forgotten about
- Unusual spikes vs your baseline

### 4. Recommendations
- "You spent $312 on Uber this month. At that rate, a monthly transit pass ($127) saves $185/month"
- "Your 11 subscriptions total $147. Audit: which 3 do you use most?"
- "Your savings rate (23%) is above the 20% benchmark"

## Trigger Phrases

- "Analyze my spending this month"
- "Create a personal finance report from this data"
- "Where is my money going?"
- "Review my transactions"
- "Personal finance breakdown"
- "Budget analysis"

## Privacy Note

Don't paste real account numbers or full card numbers. Transaction descriptions and amounts are fine. If concerned, find-and-replace vendor names with categories before pasting.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Categories seem wrong | Unusual vendor names | Tell Claude: "Wegmans is groceries, SQ* is coffee" |
| Missing transactions | Data not copied fully | Check that you included all rows from the export |
| Savings rate looks wrong | Income not included | Add your income line explicitly |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.0.1 | 2026-04-10 | Initial skill with full report format |
