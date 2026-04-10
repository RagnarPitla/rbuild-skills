---
name: logistics-exception-management
description: Handling freight exceptions including carrier delays, shipment damages, losses, and missed deliveries — with escalation workflows and D365 Transportation Management integration. Use when user says "carrier delay", "shipment damaged", "logistics exception", "freight claim", "missing delivery", "shipment at risk", "carrier performance".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, supply-chain, logistics, freight]
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---

# Logistics Exception Management

Freight exceptions are inevitable. The difference between a good logistics operation and a bad one is not whether exceptions happen — it is how fast they are detected, assessed, and resolved. AI agents excel here because exception management is high-volume, time-sensitive, and follows decision trees that can be codified.

## Exception Types

| Exception Type | Detection Signal | Typical Cause |
|----------------|-----------------|---------------|
| Carrier delay | Tracking status not updated / ETA pushed | Weather, port congestion, driver shortage |
| Missed delivery | No POD within delivery window | Consignee not available, address issue |
| Shipment damaged | POD with exceptions / claim filed | Improper packaging, rough handling |
| Lost shipment | No tracking updates > X hours, carrier confirms loss | Theft, misrouted, system error |
| Incorrect quantity | POD quantity mismatch | Picking error, short ship by supplier |
| Documentation error | Customs hold, carrier refuses | Missing/incorrect commercial invoice, incorrect HS code |
| Temperature excursion | IoT sensor alert | Reefer failure, breach in cold chain |

## Exception Detection: Automated Monitoring

An agent should proactively monitor shipments rather than waiting for problems to be reported.

### Monitoring Logic
```
For each open shipment:

1. Expected delivery date - Today > 0 (shipment is overdue)
   OR last tracking update > 24 hours ago (communication gap)
   THEN flag as: Delayed / Communication Risk

2. Customer order is time-critical (e.g., linked to a production order)
   AND shipment delayed > 1 day
   THEN flag as: Critical Exception

3. Carrier tracking shows "Exception" or "Delivery Attempted" status
   THEN flag as: Action Required

4. Tracking event "Damaged" or "Short"
   THEN flag as: Damage Claim Required
```

### D365 Data for Monitoring
```
GET /data/WHSShipmentTable?$filter=ShipmentStatus ne 'Shipped' 
  AND ExpectedDeliveryDate lt [today]
  &$select=ShipmentId,LoadId,CarrierCode,TrackingNumber,ExpectedDeliveryDate

GET /data/SalesOrderHeadersV2?$filter=RequestedShipDate lt [today]
  AND SalesOrderStatus eq 'Confirmed'
  &$select=SalesOrderNumber,CustomerAccount,RequestedShipDate,DeliveryAddressName
```

## Escalation Workflow

When an exception is detected, the response follows four stages.

### Stage 1: Detect and Classify
- Pull tracking data from carrier API (or 3PL portal)
- Determine exception type and severity
- Identify impacted orders and customers
- Calculate business impact: delayed revenue, production stoppage risk, customer SLA breach

### Stage 2: Assess Impact
- For each impacted sales order: check customer SLA and penalty clauses
- For production-linked orders: check if production order will be delayed
- Assess: Can the delay be absorbed? Is expediting worth the cost?
- Decision: Expedite / Reroute / Accept delay and notify / File claim

### Stage 3: Notify Stakeholders
Notification matrix:
| Delay Severity | Action | Who Notified |
|----------------|--------|--------------|
| < 1 day | Monitor only | Logistics team |
| 1-3 days | Customer notification, assess expedite | Customer service + logistics |
| 3-7 days | Expedite or reroute evaluation | Customer + procurement + ops |
| > 7 days or critical customer | Escalate to management | All levels + customer exec |

Notification template:
```
Subject: Shipment [TrackingNumber] - [X day] delay on Order [SalesOrderNumber]

Current status: [Carrier status]
Original ETA: [Date]
Updated ETA: [New estimate or "TBD pending carrier investigation"]
Impact: [What customer or production order is affected]
Action being taken: [Expedite / Reroute / Carrier investigation opened]
Next update by: [Time]
```

### Stage 4: Resolution Path

**Option A: Expedite**
- Request carrier expedited service (additional cost)
- If LTL, consider air freight conversion for critical cargo
- Document cost vs customer SLA penalty for approval

**Option B: Reroute**
- Transfer to alternate carrier at nearest hub
- Cross-dock to different vehicle
- Use alternate origin warehouse if available

**Option C: Accept and compensate**
- Negotiate customer accommodation (credit, priority on next order)
- Document for carrier claims
- Update customer ETA proactively

**Option D: File freight claim (for damages/losses)**

## Freight Claim Process

### When to File
- Visible damage noted at delivery (note on POD immediately)
- Concealed damage discovered within 5-9 days of delivery
- Shortage (fewer pieces than on BOL)
- Complete loss (shipment never arrived)

### Claim Requirements
| Document | Purpose |
|----------|---------|
| Original BOL | Proof of shipment and declared value |
| Delivery receipt with exceptions | Evidence of damage/shortage at delivery |
| Photos of damage | Visual evidence |
| Commercial invoice | Proof of value |
| Packing list | Contents verification |
| Repair estimate or replacement invoice | Claim amount substantiation |

### Claim Deadlines (US Carmack Amendment)
- Property damage/shortage: 9 months from delivery (or date of loss)
- File suit: 2 years from claim denial date
- **Never miss the deadline.** Set a calendar trigger in your system when filing.

### Filing Process
1. Notify carrier in writing within 5 business days for concealed damage
2. Complete carrier claim form (each carrier has their own)
3. Attach all supporting documents
4. Track claim status weekly
5. If denied: review denial reason, appeal with additional evidence or escalate to freight broker/legal

## Integration with D365 Transportation Management

D365 TM tracks loads, shipments, and freight bills. Key tables for exception management:

| D365 Entity | Purpose | Key Fields |
|-------------|---------|------------|
| WHSShipmentTable | Shipment status tracking | ShipmentStatus, TrackingNumber, ExpectedDeliveryDate |
| TMSLoadTable | Load and carrier assignment | LoadId, CarrierId, ShipDate |
| TMSFreightBillHeader | Freight invoicing | FreightBillId, ActualFreightCost |
| TMSTransitTime | Transit time standards | Origin, Destination, StandardTransitDays |

## Carrier Performance Tracking

Track exceptions by carrier to identify systemic issues:

| Metric | Calculation | Target |
|--------|-------------|--------|
| On-time delivery % | Shipments delivered by ETA / Total shipments | > 95% |
| Damage rate | Damage claims / Total shipments | < 0.5% |
| Exception rate | Exceptions / Total shipments | < 2% |
| Claim recovery rate | Claims paid / Claims filed | > 85% |

Store carrier scorecards in Dataverse (`cr023_carrier_performance`) and surface in agent responses when selecting carriers for new shipments.

## Trigger Phrases

- "carrier delay"
- "shipment damaged"
- "logistics exception"
- "freight claim"
- "missing delivery"
- "shipment at risk"
- "carrier performance"
- "expedite shipment"

## Quick Example

> See `logistics-exception-management-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Agent not detecting delays because carrier tracking is not integrated | Tracking data only in carrier portal, not in D365 or Dataverse | Implement carrier API integration (most major carriers have tracking APIs) or use a 3PL visibility platform that aggregates tracking data |
| Freight claims being denied due to missing documentation | POD not captured with exception notes at delivery | Train receiving teams to note exceptions on the delivery receipt before signing; implement mobile receiving app that prompts for photo capture |
| Escalation notifications going to wrong people | Notification rules not matching current org structure | Review notification matrix in policy table (`cr023_logistics_escalation`); update roles and email addresses |
| High volume of exceptions overwhelming the team | Exception detection too sensitive, flagging non-critical delays | Add severity scoring: weight by customer SLA tier, order value, and days delayed before triggering notifications |

## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
