# VIN Configuration Validator — Example

## Scenario: Fleet Order With 8 Mismatched Tow Package Configurations

**Who:** Sandra Kowalczyk, Fleet Manager, Hartline Distribution (regional LTL carrier, 340-vehicle fleet)
**Where:** Procurement module in D365 F&O, order confirmation from the OEM dealer portal
**The Problem:** Hartline placed a 40-vehicle order for Class 3 cargo vans with the 8,600 lb tow package (option code 53A) for their new intermodal yard operation. The order confirmation came back from the dealer and Sandra's team accepted it without a line-by-line check. Three weeks later, at pre-delivery inspection, the yard team flags that 8 vehicles have the tow prep package (52A) instead of 53A. 52A maxes at 5,000 lbs. That's a mission-critical spec failure for yard trailer moves.

**Prerequisites:** OEM option code library loaded, purchase order lines synced from dealer portal

---

### What You Say to the Agent

> "Validate the VINs on PO-2024-FL-0041 against the spec sheet I submitted. Flag any configuration codes that don't match what we ordered, especially the tow package."

### What the Agent Does

1. Parses all 40 VINs from the order confirmation and decodes each against the OEM build data and the original spec sheet on file
2. Identifies 8 VINs where the tow package code is 52A (tow prep, 5,000 lb capacity) instead of the specified 53A (heavy-duty tow, 8,600 lb capacity)
3. Cross-references the 8 affected units against the planned assignment schedule and flags that 6 of them are earmarked for the Laredo yard, where trailer moves average 7,200 lbs
4. Checks the remaining 32 VINs and confirms 1 additional mismatch: 3 vehicles are missing the 7-pin trailer wiring harness (option 19C) that was included in the original spec but not coded at the plant
5. Generates a discrepancy report formatted for the dealer's fleet desk with VIN-level detail, the delta between ordered and built option codes, and a correction request for dealer reorder or dealer-install upfit

### The Business Impact

- **Safety incident prevented** — 6 vehicles towing 7,200 lb trailers at a rated 5,000 lb capacity is a DOT liability and an insurance policy breach
- **$48,000 reorder cost avoided** — catching the mismatch pre-delivery means the dealer corrects at their cost, not Hartline's
- **Delivery timeline protected** — the discrepancy report goes to the dealer's fleet desk same day, keeping 32 correctly built units on schedule for deployment

### Try It Yourself

> "I have a fleet order for 25 pickup trucks. Check all VINs against our upfit spec and flag any units missing the bed liner, tow mirrors, or fleet telematics pre-wire."
