# Data to Report — Example

## Scenario: The Operations Manager With a Board Presentation in 48 Hours

**Who:** Lisa Park, Operations Manager at a mid-size e-commerce fulfillment company, 8 years in operations. Responsible for quarterly KPI reporting to the leadership team.
**Where:** Claude.ai, Tuesday afternoon before a Thursday board meeting.
**The Problem:** Lisa has a spreadsheet with 6 months of operational KPIs across 8 metrics: on-time delivery rate, order accuracy, cost per shipment, customer satisfaction score, returns rate, warehouse throughput, average processing time, and headcount. The data is all there but it is a raw table. She has 48 hours to turn it into a presentation-ready narrative that tells a story. The leadership team will ask hard questions about the February dip in customer satisfaction and she needs to be ready with a clear explanation, not just numbers.

**Prerequisites:** None. The spreadsheet is in Excel. Lisa copies and pastes the data table directly.

---

### What You Say to the Agent

> "Turn this operational KPI data into an executive report for our leadership team. Audience: VP of Operations and CFO. Focus on: overall performance trend, the February customer satisfaction dip, and our fulfillment time improvement. Our targets were 98% on-time delivery and 95% order accuracy. We launched new warehouse software in January. Format: executive summary plus a recommendations section, under 400 words total. Here's the data: [paste]"

### What the Agent Does

1. Reads all 8 metrics across 6 months and identifies the key patterns: fulfillment time improved 23% from October to March, customer satisfaction dropped 12 points in February then recovered in March, on-time delivery held steady above target except in February.
2. Cross-references the February anomaly with the context provided: new warehouse software launched in January. Flags the likely correlation.
3. Structures the report by leading with the headline (overall positive trend) before addressing the anomaly, which is the professional framing for a board audience.
4. Produces the report:

```
Q4 2025 to Q1 2026 OPERATIONS EXECUTIVE SUMMARY

OVERALL PERFORMANCE: IMPROVING
Fulfillment operations improved significantly over the 6-month period.
On-time delivery averaged 98.4% against a 98% target. Order accuracy
held at 96.1%, above the 95% target. Average processing time fell
from 4.2 hours to 3.2 hours, a 23% improvement.

THE FEBRUARY ANOMALY
Customer satisfaction dropped from 87 to 75 in February, the lowest
point of the period. This aligns with the January warehouse software
rollout — a known transition risk. By March, satisfaction had
recovered to 84 and is trending toward pre-rollout levels.

WHAT DROVE THE IMPROVEMENT
The processing time gains are directly linked to the new software's
batch processing capability. The short-term satisfaction cost in
February appears to have been a transition disruption, not a
structural problem.

RECOMMENDATIONS
1. Investigate whether the February dip affected specific customer
   segments or order types, which would help target recovery outreach.

2. Lock in the processing time gains with a formal new baseline of
   3.2 hours, and reset the team's improvement target accordingly.

3. Build a rollout buffer into the next software change — a 2-week
   parallel-run period would have likely prevented the February dip.
```

### The Business Impact

- **Board narrative ready in 35 minutes** — Lisa spent her remaining prep time on the Q&A rather than writing the document
- **February dip framed correctly** — the correlation with the software launch gave leadership a cause, not just a number, which changed the tone of the conversation
- **23% fulfillment improvement highlighted** — buried in a spreadsheet, a number that strong needs to be in the first paragraph of any board document

### Try It Yourself

> "Take the recommendation about investigating the February dip by customer segment. Write me 5 specific questions I should bring to the data team to understand which customers were affected most and whether they churned."
