# Carrier Relationship Management — Example

## Scenario: Rate Renegotiation With Data-Backed Leverage Before Contracts Expire

**Who:** Theresa Blanchard, Logistics Manager, Midstates Wholesale (industrial supply distributor, $380M revenue, ships 2,200 orders per week)
**Where:** D365 F&O Transportation Management module, carrier rate tables and shipment history
**The Problem:** Theresa's top 5 carrier contracts all expire within a 60-day window starting next month. Carriers are already signaling rate increases of 8-12% citing fuel and driver cost pressures. Theresa needs a data-backed negotiation position before the first call. She knows her shipment volume is leverage, but she doesn't have the lane-level performance data or spend concentration numbers at her fingertips.

**Prerequisites:** 12 months of shipment history in TMS, carrier scorecards active, contracted rates loaded

---

### What You Say to the Agent

> "My top 5 carrier contracts expire in 60 days. Pull their performance and spend data for the last 12 months so I have a real negotiation position before I get on the phone with them."

### What the Agent Does

1. Pulls 12 months of shipment records and segments by carrier, lane, weight break, and service type (LTL, FTL, regional parcel)
2. Produces a carrier-by-carrier scorecard showing on-time delivery rate, claims frequency, claims as a percentage of freight spend, average transit days versus contracted, and tender acceptance rate during peak weeks
3. Identifies that Carrier 3 (Redline Freight) has a 91.2% on-time rate on Midwest lanes but a 94.8% claims rate per 1,000 shipments, which is 2.3x the average of Carriers 1 and 2 on the same lanes
4. Calculates that Midstates awarded Carrier 4 (Summit Truckload) $1.4M in spot volume last year at an average 34% premium over contracted rates because Carrier 4's tender acceptance during peak dropped to 61% — giving Theresa a clear failure-to-perform argument
5. Flags that Carriers 1 and 2 together handle 67% of Midstates' total freight spend and both have on-time rates above 96%, which is negotiating leverage to push for a 2% rate hold rather than accepting an increase

### The Business Impact

- **Negotiation position built in one query** — Theresa walks into five calls with lane-level data, not gut feel
- **$94,000 spot premium exposure documented** — Summit's peak acceptance failure is quantified and ready to use as a contract penalty clause or disqualification argument
- **Rate hold target validated** — Carriers 1 and 2 performance data supports a firm counter to the proposed 8-12% increase on the lanes that matter most

### Try It Yourself

> "Which of my carriers have had the highest claims rate in the last 6 months and what were the top 3 freight categories driving those claims?"
