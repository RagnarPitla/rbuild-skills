---
name: "personal-finance-report"
slug: "personal-finance-report"
description: "Takes raw bank or credit card transaction data and produces a structured spending breakdown with categories, trends, anomalies, and actionable insights. Use when user says 'analyze my spending', 'personal finance report', 'where does my money go', 'spending breakdown', 'budget analysis', 'categorize my transactions'."
tab: "personal"
domain: "productivity"
industry_vertical: null
difficulty: "starter"
source_type: "ragnar-custom"
tags: ["beginner", "universal", "finance", "budgeting", "personal"]
version: "1.0.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: true
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "None"
mcp_tools: []
---


# Personal Finance Report

## What This Skill Does

You paste your bank or credit card transactions and the agent produces a clear, categorized spending report. It automatically groups transactions into categories, identifies recurring charges, flags unusual spikes, surfaces forgotten subscriptions, and gives you 3 specific recommendations. Everything happens inside the conversation. Nothing is stored.

## Triggers

- "analyze my spending"
- "personal finance report"
- "where does my money go"
- "spending breakdown"
- "budget analysis"
- "categorize my transactions"

## How It Works

### Step 1: Export or Copy Your Transactions

You have three options:

**Option A: CSV export from your bank**
Most banks have an "Export" or "Download" button in the transactions view. Download as CSV and paste the contents directly.

**Option B: Copy and paste from your banking app**
Select all transactions on screen and paste them. Messy formatting is fine, the agent handles it.

**Option C: Type a rough list**
If you don't want to export, just type what you know:
```
Rent: 1800
Groceries: 340
Uber Eats: 210
Netflix, Spotify, Hulu: 48
Coffee: 95
```

For the best results, provide at least 2-3 months of transactions. One month shows you what happened. Multiple months show you what's trending.

### Step 2: Add Context

Tell the agent:
- What time period the data covers
- Your approximate monthly take-home income (even a rough number helps)
- Anything you want to focus on ("flag all subscriptions" or "I'm trying to cut food delivery")

### Step 3: Get Your Report

The agent will:

1. Auto-categorize all transactions into: Housing, Food and Dining, Transport, Subscriptions, Entertainment, Healthcare, Shopping, and Other.

2. Calculate your spending by category with percentages.

3. Identify your top 5 spending categories.

4. Find recurring charges and list all subscriptions with their monthly cost.

5. Flag anomalies: duplicate charges, unusual spikes vs your average, or one-off expenses.

6. Calculate your saving rate if income is provided.

7. Write 3 specific, actionable recommendations based on what it finds.

## Output

**Executive summary** with total income, total spending, and net saved.

**Category breakdown** showing each category, dollar amount, and percentage of total spending.

**Subscription audit** listing every recurring charge found.

**Anomaly report** calling out anything unusual.

**3 recommendations** specific to your spending data, not generic advice.

## Checklist
- [ ] Transaction data covers at least 1 full month
- [ ] Income figure included (even approximate)
- [ ] Time period stated ("January transactions" or "last 90 days")
- [ ] No full account numbers or card numbers in the data (descriptions and amounts only)

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Categories seem wrong | Unusual or abbreviated vendor names | Tell the agent: "Wegmans is groceries, SQ* means coffee shop" |
| Missing transactions | Data export was incomplete | Check that you included all rows from the download |
| Saving rate looks wrong | Income was not included | Add: "My monthly take-home is approximately $X" |
| Subscriptions not found | Irregular billing cycles | Ask: "List every charge under $30 that repeats" |

## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-10 | Initial skill |
