---
name: customs-trade-compliance
description: Customs documentation, tariff classification, duty calculation, restricted party screening, and export control compliance for cross-border shipments. Use when user says "HTS code", "customs compliance", "duty calculation", "restricted party screening", "incoterms", "export control", "import permit", "tariff classification".
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, supply-chain, customs, hts-codes]
requires: D365 F&O MCP Server
mcp_tools:
  - "d365-fno-mcp"
---

# Customs and Trade Compliance

Cross-border shipments fail for two reasons: wrong paperwork or wrong classification. This skill covers both — plus duty optimization, restricted party screening, and the export controls that can get a company in serious legal trouble if missed.

## Tariff Classification (HTS Codes)

Every product shipped internationally needs a Harmonized Tariff Schedule (HTS) code. The code determines duty rate, import requirements, and export license eligibility.

### HS Code Structure
```
HS Code: 8471.30.01.00

8471       = Chapter (Automatic data processing machines)
8471.30    = Heading (Portable ADP machines)
8471.30.01 = Subheading (country-specific breakdown)
8471.30.01.00 = Statistical suffix (US-specific)
```

**Classification rules (GRI - General Rules of Interpretation):**
1. Classification starts at Rule 1: read the heading text and notes
2. If heading text is ambiguous, apply Rules 2-6 in sequence
3. Rule 3: most specific description wins over general
4. Rule 6: classify by the component that gives the product its essential character

### Classification in D365
Products in D365 carry the HTS code on the **Released product** record:
- Path: Product information management > Products > Released products
- Field: Foreign trade > Harmonized system (HS) code
- Also: Commodity code (for EU/Intrastat reporting)

OData query to get HS codes for all released products:
```
GET /data/ReleasedProductsV2?$select=ItemNumber,ItemName,HarmonizedSystemCode,CommodityCode
```

## Duty Calculation

Duty = Customs Value x Duty Rate

**Customs Value** is typically transaction value (what you paid). Alternative methods apply when transaction value is not applicable (related party transactions, royalties, assists).

### Common Duty Components
| Component | Description | Typical Rate |
|-----------|-------------|--------------|
| Ad valorem duty | % of customs value | 0-35% depending on product/country |
| Specific duty | Fixed amount per unit/weight | Varies |
| Anti-dumping duty | Additional on specific origin/product | Set by investigation |
| Countervailing duty | Offset for foreign subsidies | Set by investigation |
| VAT/GST | Import tax (not customs duty) | 5-25% depending on country |

### Duty Optimization Strategies
- **First sale valuation**: Use the price at first sale in chain rather than last sale, reducing customs value
- **Tariff engineering**: Modify product at design stage to shift to a lower-duty HTS code (legal, not fraudulent)
- **Free Trade Agreements**: Qualify for preferential rates by meeting rules of origin (typically 35-50% regional value content)
- **Bonded warehouses**: Defer duty payment until goods released to commerce
- **Inward processing relief**: Import goods duty-free for manufacturing, export finished goods

## Document Requirements by Shipment Type

### Standard Import Shipment
| Document | Required By | Purpose |
|----------|-------------|---------|
| Commercial invoice | Customs | Establish customs value and description |
| Packing list | Customs / carrier | Physical verification |
| Bill of lading / AWB | Carrier | Title to goods |
| Import license | Customs (if controlled) | Authorization to import |
| Certificate of origin | Customs (if FTA claimed) | Prove origin for preferential duty |
| Phytosanitary certificate | Agriculture authority | For plants/plant products |
| SDS / dangerous goods | Carrier / customs | For hazardous materials |

### Country-Specific Requirements
- **US imports**: CBP Form 7501 (entry summary), ISF (Importer Security Filing) 24hrs before vessel loading
- **EU imports**: SAD (Single Administrative Document), EORI number required for importer
- **China imports**: CIQ inspection for food, animals, plants; customs declaration form
- **India imports**: Bill of entry via ICEGATE portal; BIS certification for electronics

## Restricted Party Screening

Before shipping to any party, screen against denied/restricted party lists.

### Key Lists
| List | Authority | Consequence if violated |
|------|-----------|------------------------|
| SDN (Specially Designated Nationals) | US OFAC | Criminal/civil penalties |
| Denied Persons List | US BIS | Export privileges revoked |
| Entity List | US BIS | License required for exports |
| EU Consolidated List | EU | Criminal penalties |
| UN Sanctions Lists | UN Security Council | Global, all countries must comply |

### Screening Process
1. Collect: full legal name, address, country, tax ID of shipper, consignee, end user, freight forwarder
2. Screen all parties against all applicable lists
3. Fuzzy match on names (alias lists included)
4. Document the screening and result
5. If match found: escalate to compliance team before proceeding
6. Cleared: document clearance with date and list version screened

**Never rely on manual screening for volume shipments.** Use a compliance screening service (Descartes, Kpler, Oracle GTM, or SAP GTS) integrated with your ERP.

## Incoterms Interpretation

Incoterms define who (seller or buyer) is responsible for freight costs, insurance, and customs at each point in the journey.

### Key Incoterms for Import/Export Decisions
| Incoterm | Risk Transfer | Who Handles Import Customs | Who Pays Duty |
|----------|--------------|---------------------------|---------------|
| EXW | At seller's door | Buyer | Buyer |
| FOB | When goods on vessel | Buyer | Buyer |
| CIF | At destination port | Buyer | Buyer |
| DDP | At named destination | Seller | Seller |
| DAP | At named destination | Buyer | Buyer |

**Common mistake:** Quoting DDP when you are not set up as an importer of record in the destination country. DDP requires the seller to handle customs clearance and duty payment in the destination country.

## Export Control

Export controls restrict what products and technology can be sent to which destinations and end users.

### US Export Control Framework
- **EAR (Export Administration Regulations)**: Controls dual-use items (BIS)
- **ITAR (International Traffic in Arms Regulations)**: Controls defense articles (State Dept)
- **OFAC Sanctions**: Controls transactions with sanctioned countries/persons

### Export Classification
Every exported item needs an Export Control Classification Number (ECCN):
- EAR99: No specific export controls (most commercial goods)
- 5A002: Information security products (needs license for some destinations)
- ITAR items: Never without State Dept license

### License Determination
```
GIVEN product ECCN and destination country
IF ECCN = EAR99 AND no OFAC sanctions on destination
THEN no license required (NLR)

IF ECCN has controls AND destination on Country Chart
THEN check license exceptions first (LVS, GBS, TMP...)
IF no exception applies
THEN BIS export license required
```

## Compliance Checklist for Shipments

- [ ] HTS code confirmed and current (codes can change annually)
- [ ] Duty rate verified for origin/destination pair
- [ ] FTA eligibility checked, certificate of origin obtained if applicable
- [ ] All parties screened against denied party lists
- [ ] Export classification (ECCN) determined
- [ ] Export license obtained if required
- [ ] All required import documents prepared
- [ ] Customs value correctly calculated
- [ ] Incoterms agreed and aligned with customs responsibilities
- [ ] Country-specific requirements met (labeling, certifications)

## Integration with D365

D365 F&O has a Foreign Trade module that supports:
- HS code on released products
- Intrastat reporting (EU internal trade statistics)
- Country of origin tracking
- Trade agreement pricing

For full import/export compliance management, most enterprises integrate D365 with a dedicated Global Trade Management (GTM) solution.

## Trigger Phrases

- "HTS code lookup"
- "customs compliance checklist"
- "duty calculation"
- "restricted party screening"
- "incoterms"
- "export control"
- "import permit requirements"
- "tariff classification"

## Quick Example

> See `customs-trade-compliance-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Duty rate mismatch between estimate and actual | HTS code misclassified or anti-dumping/CVD duties not included | Verify full HTS code including statistical suffix; check for active AD/CVD orders on the product/origin |
| Shipment held at customs | Missing or incorrect documentation | Get the customs hold notice, identify the specific deficiency, provide corrected documents within the hold period |
| FTA preferential rate rejected | Certificate of origin not meeting rules of origin | Review the specific FTA rules of origin for the HTS code; verify regional value content calculation |
| Restricted party screening false positives creating delays | Screening too broad or alias lists not maintained | Tune screening parameters, use a commercial screening service with fuzzy match scoring and alias libraries |

## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
