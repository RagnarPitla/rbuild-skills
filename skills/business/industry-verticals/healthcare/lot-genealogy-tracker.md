---
name: Lot Genealogy Tracker
slug: lot-genealogy-tracker
description: Trace complete forward and backward lot genealogy for regulated products — critical for recalls, deviations, and regulatory audits.
tab: business
domain: industry-verticals
industry_vertical: healthcare
difficulty: advanced
source_type: ragnar-custom
tags: "[\"healthcare\", \"lot-genealogy\", \"traceability\", \"d365\", \"recall\", \"pharma\"]"
version: 1.0.1
icon_emoji: 🔬
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references:
  - "title: "FDA Drug Traceability Requirements"
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---


# Lot Genealogy Tracker

Pharmaceutical manufacturers must be able to answer two questions instantly when a quality problem arises:
1. **Forward trace:** Where did this lot go? (Who received it, is it still in distribution?)
2. **Backward trace:** What went into this lot? (Which raw materials, which intermediates?)

Manual genealogy tracing for a recall can take days. This agent does it in minutes.

## Forward Trace (Where Did It Go?)

Starting from a finished goods lot number:

```
Lot FG-2026-03-4521 traced forward:

Distribution:
├── Shipped to Cardinal Health (DC: Cincinnati) — 500 units
│   └── Cardinal → Walgreens (Chicago, IL) — 250 units [in stock]
│   └── Cardinal → CVS (Indianapolis, IN) — 250 units [dispensed to patients]
├── Shipped to McKesson (DC: Atlanta) — 300 units
│   └── McKesson → hospital systems — 300 units [dispensed]
└── Retained as retention sample — 50 units [in QC storage]

RECALL IMPACT:
  Total lots at risk: 1
  Units distributed: 800
  Units potentially at patients: 550
  Units recoverable from distribution: 250
  Regulatory notification required: FDA 15-day safety report
```

## Backward Trace (What Went Into It?)

Starting from the same lot, tracing backward:

```
Lot FG-2026-03-4521 traced backward:

Finished product: Amoxicillin 500mg Capsules
  ↑
Intermediate: Granulation batch GB-2026-03-112
  ↑
├── Active Pharmaceutical Ingredient (API)
│   Lot API-2026-01-8834 | Supplier: ABC Pharma, India
│   CoA Date: 2026-01-15 | Potency: 99.7%
├── Microcrystalline Cellulose
│   Lot EX-2025-12-7721 | Supplier: FMC Corp
└── Magnesium Stearate
    Lot LU-2026-02-3341 | Supplier: Mallinckrodt

Equipment used: Granulator G-04, Tablet Press TP-02, Coater CT-01
Personnel: [linked to training records at time of manufacture]
Environmental record: Room 204, 2026-03-10 through 2026-03-14
```

## D365 Integration

D365 SCM provides the data through inventory transactions and batch tracking:
- `InventBatchEntity` — batch master data and attributes
- `InventTransEntity` — all inventory movements for a batch
- `ProdTableEntity` — production orders that consumed/produced the batch
- Custom Dataverse tables — supplier CoAs, equipment records, environmental monitoring

## Recall Readiness Metrics

The agent continuously monitors genealogy data quality:
- % of lots with complete forward trace to end customer
- % of lots with complete backward trace to raw materials
- Average time to generate a complete genealogy report (target: <5 minutes)

FDA expectations: complete genealogy in 24 hours for a recall. This agent gets there in minutes.

## Trigger Phrases

- "Help me with lot genealogy tracker"
- "Lot Genealogy Tracker"
- "How do I lot genealogy tracker"

## Quick Example

> See `lot-genealogy-tracker-example.md` in this folder for a full worked scenario with business impact.

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
