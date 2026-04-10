# Batch Potency Calculator — Example

## Scenario: Scale-Up From 50 kg to 500 kg with a Sub-Potent Active Ingredient

**Who:** Dr. Mia Johansson, Manufacturing Pharmacist, Luminos Pharmaceuticals (solid dose contract manufacturer, 21 CFR Part 211, EU GMP Annex 15)
**Where:** D365 F&O Batch Order management, pharmaceutical production batch record issuance
**The Problem:** Luminos is scaling a tablet formulation from a 50 kg development batch to a 500 kg commercial batch. The active pharmaceutical ingredient (API) is Compound LX-44 with a tested potency of 97.3% (label claim 100%). The formulation requires 50 g of API per kg of finished product at label strength. If the potency-adjusted quantity is calculated incorrectly and the batch record is issued with the raw formula quantity, every tablet in the batch will be underpotent — an immediate batch rejection and potential regulatory reportable event.

**Prerequisites:** D365 F&O MCP Server, batch order created in D365, potency attribute for Lot #API-2024-LX44-009 entered in D365 inventory quality attributes

---

### What You Say to the Agent

> "Calculate the potency-adjusted quantity of API Lot #API-2024-LX44-009 needed for the 500 kg commercial batch of LX-44 tablets. Potency is 97.3%. Show the calculation and confirm the D365 batch order quantity is updated."

### What the Agent Does

1. Retrieves the master formula for LX-44 tablets from D365: the formula requires 50.00 g of API per kg of finished product (at 100% potency), giving a nominal API requirement of 25,000 g (25 kg) for the 500 kg batch
2. Reads the potency attribute for Lot #API-2024-LX44-009 from the D365 quality attribute record: 97.3% purity against a 100% label claim
3. Applies the potency adjustment: adjusted quantity = nominal quantity divided by (potency fraction) = 25,000 g divided by 0.973 = 25,694.8 g; rounds to 25,695 g per standard rounding protocol in the Dataverse formulation policy table (round up to nearest gram for API)
4. Calculates the overage versus the nominal quantity: 695 g additional API required to achieve label strength; confirms this is within the batch order's API allocation tolerance of plus 3% (maximum allowed overage per the product's validated range: nominal 25,000 g plus 3% = maximum 25,750 g; 25,695 g is within tolerance)
5. Updates the D365 batch order ingredient quantity for Lot #API-2024-LX44-009 from 25,000 g to 25,695 g; flags the batch record as "potency-adjusted" for QA review and adds the lot potency value and adjustment calculation to the electronic batch record audit trail

### The Business Impact

- **Batch record issued with correct quantity** — zero risk of underpotent tablets reaching the QA release stage; calculation performed and documented in the batch record in under 3 minutes
- **Regulatory compliance maintained** — the potency adjustment, calculation methodology, and lot attribute source are all logged in the audit trail, satisfying FDA 21 CFR 211.188 batch production record requirements
- **$340,000 batch protected** — at commercial scale, a batch rejection for potency failure costs approximately $340,000 in API, excipients, manufacturing time, and investigation; the correct calculation prevented this before manufacturing began

### Try It Yourself

> "The incoming CoA for API Lot #API-2024-LX44-010 shows potency 96.1%. Calculate the adjusted quantity for the same 500 kg batch and tell me if it still falls within the validated potency adjustment range. If it's out of range, flag it for a deviation."
