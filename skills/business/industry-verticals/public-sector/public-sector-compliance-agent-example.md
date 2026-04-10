# Public Sector Compliance Agent — Example

## Scenario: $180,000 IT Equipment Purchase With a Sole-Source Justification Claim

**Who:** Derek Fontaine, Procurement Officer, State of Montana Department of Transportation
**Where:** D365 F&O Public Sector Procurement module, vendor qualification records
**The Problem:** The IT division submitted a purchase request for $180,000 of network switching equipment (Cisco Catalyst 9300 series) from a single vendor, citing sole-source justification. The justification memo states that only the incumbent vendor, TechSource Direct, is able to provide the equipment and post-installation support under the required timeline. Montana state procurement regulations require competitive bidding for purchases above $50,000 unless a valid sole-source exception applies. Derek is not convinced the justification is solid, and an audit last year flagged 2 sole-source awards that were later overturned by the State Procurement Bureau.

**Prerequisites:** State procurement policy rules loaded in Dataverse, vendor master current, spend history accessible

---

### What You Say to the Agent

> "IT submitted a $180,000 sole-source request for Cisco network equipment citing TechSource Direct as the only qualified vendor. Does this hold up against our sole-source policy before I approve it?"

### What the Agent Does

1. Retrieves the sole-source justification memo and checks it against the 4 valid exception categories in Montana procurement policy: proprietary technology, emergency purchase, compatible upgrade to existing system, and unique expertise unavailable elsewhere
2. Identifies that the IT memo invokes the "compatible upgrade" exception but fails to include the required technical compatibility documentation showing that the Catalyst 9300 cannot be substituted with an alternate vendor's equivalent — the exception is asserted but not substantiated
3. Checks the vendor master and finds that 3 other vendors (CDW Government, Presidio, and Sirius Computer Solutions) are active on the state's NASPO ValuePoint IT Hardware contract and are authorized resellers of Cisco Catalyst 9300 equipment, which directly contradicts the "only available vendor" claim
4. Pulls TechSource Direct's spend history and finds the department awarded them $214,000 in the prior fiscal year across 4 purchases, 3 of which were also sole-sourced — a pattern that triggers the agency's vendor concentration review threshold of 3 or more sole-source awards to the same vendor within 12 months
5. Generates a compliance review memo documenting the 3 available contract vendors, the failed substantiation of the compatibility exception, and the vendor concentration flag — with a recommendation to issue a Request for Quote under the NASPO contract before proceeding

### The Business Impact

- **Regulatory overreach prevented** — approving an unsupported sole-source on a $180,000 purchase is a material finding in a state audit; the compliance memo creates a defensible record
- **Competitive pricing secured** — routing through NASPO ValuePoint with 3 qualified vendors typically yields 7-12% savings on commodity hardware; potential $12,600-$21,600 savings identified
- **Vendor concentration pattern flagged** — TechSource Direct's 4th consecutive award would have triggered the review threshold; catching it now allows procurement to address the pattern proactively

### Try It Yourself

> "Show me all sole-source purchases approved in the last 12 months above $25,000 and flag any vendors who appear more than twice."
