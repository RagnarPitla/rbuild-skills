# Logistics Exception Management — Example

## Scenario: Medical Device Shipment Missed Chicago Connection, Hospital Deadline Tomorrow

**Who:** Dana Okonkwo, Logistics Coordinator, 3PL company managing healthcare accounts
**Where:** TMS integrated with D365, carrier tracking APIs, customer SLA database
**The Problem:** A pallet of 48 infusion pumps (customer: Midwest Regional Health, PO 77-2241) missed its connecting flight in Chicago O'Hare due to a 3-hour weather delay. The shipment is now sitting at ORD. Midwest Regional has a hospital delivery deadline of 8:00 AM tomorrow for a scheduled OR installation. The original carrier (AirFreight Direct) has no available capacity until 11 AM tomorrow. Missing this delivery means the hospital delays a scheduled procedure suite upgrade and Dana's company faces a $15,000 SLA penalty.

**Prerequisites:** Carrier rate APIs connected. Customer SLA table accessible. logistics-exception-management skill loaded.

---

### What You Say to the Agent

> "Shipment SH-77-2241 is stranded at ORD. It's medical devices, 48 units, 312 lbs, 4 pallets. Customer needs delivery to Midwest Regional Health in Minneapolis by 8 AM tomorrow. The original carrier can't do it. Find me alternatives right now and tell me the SLA penalty exposure if I miss the deadline."

### What the Agent Does

1. Reads shipment record SH-77-2241: confirms commodity (medical devices, Class II), weight (312 lbs), dimensions (4 pallets, 48" x 40" x 36" each), current location (ORD Terminal 5 cargo), destination (MSP, Midwest Regional Health dock)
2. Queries SLA database for customer PO 77-2241: confirms 8:00 AM delivery commitment, $15,000 penalty clause, escalation contact: Sarah Chen (VP Operations, Midwest Regional)
3. Queries alternative carrier options from ORD to MSP with next-flight-out capability:

```
OPTION 1: Charter Air Solutions — next available 6:00 PM tonight
  Delivers: 11:30 PM tonight (ahead of 8 AM deadline)
  Cost: $4,200 (vs $890 original)
  Additional cost: $3,310
  Status: CONFIRMED AVAILABLE

OPTION 2: FedEx Custom Critical — pickup 4:30 PM, ground expedite
  Delivers: 6:30 AM tomorrow (within deadline)
  Cost: $2,800
  Additional cost: $1,910
  Status: CONFIRMED AVAILABLE

OPTION 3: Original carrier next flight — 11:00 AM tomorrow
  Delivers: 2:30 PM tomorrow (MISSES 8 AM deadline)
  SLA penalty triggered: $15,000
```

4. Recommends Option 2 (FedEx Custom Critical) as the cost-optimal choice: $1,910 additional freight cost vs $15,000 SLA penalty avoided
5. Drafts a proactive customer notification to Sarah Chen with revised delivery ETA

### The Business Impact

- **SLA penalty of $15,000 avoided** — Option 2 delivered at 6:15 AM, 1 hour 45 minutes before deadline
- **Net savings of $13,090** — additional freight cost of $1,910 vs penalty exposure
- **Customer relationship preserved** — Midwest Regional received a proactive notification before they had to call
- **Resolution time: 22 minutes** — from exception identified to rebooked carrier, compared to 2-3 hours using manual carrier calls

### Try It Yourself

> "Show me all open shipments in the next 72 hours for Midwest Regional Health and flag any that have less than 4 hours of delivery buffer based on current carrier ETAs."
