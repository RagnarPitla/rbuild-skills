# Market Research — Example

## Scenario: Evaluating the D365 MCP Server Product Opportunity

**Who:** Ragnar Pitla, founder of RBuild.ai, running a build-vs-partner decision for a new product
**Where:** Strategic product evaluation, output feeds a go/no-go decision and an investor/partner one-pager
**The Problem:** Ragnar wants to know if there is a real commercial opportunity in building a production-grade MCP server for Dynamics 365 Finance and Operations. The MCP pattern is proven (he uses it daily), the D365 ecosystem is large, but he needs to know: how big is the actual addressable market, who else is building in this space, and is the gap real or is Microsoft about to ship this natively and make the product irrelevant in six months?

**Prerequisites:** A product hypothesis and the three market questions you need answered. Exa or Firecrawl MCP recommended for live market data.

---

### What You Say to the Agent

> "Market research for a potential product: a production-ready MCP server for D365 Finance and Operations. Three questions: (1) What is the TAM for D365 F&O customers who could benefit from agent connectivity? (2) Who else is building MCP servers for D365 or ERP broadly — any direct competitors, adjacent players, or Microsoft's own roadmap signals? (3) Is there a viable commercial gap here, or is Microsoft going to ship this natively and kill the opportunity? I need a go/no-go recommendation at the end."

### What the Agent Does

1. **Market sizing** — pulls D365 F&O customer counts from Microsoft annual reports and partner ecosystem data, cross-references with Copilot Studio adoption signals to estimate the overlap of customers who have both
2. **Competitor scan** — searches GitHub, Product Hunt, Azure Marketplace, and ISV directories for MCP + ERP + D365 combinations
3. **Microsoft roadmap analysis** — scans Build 2025 announcements, Microsoft Learn preview docs, and Copilot Studio release notes for native MCP connector signals
4. **Produces a structured memo:**

```
MARKET RESEARCH MEMO: D365 MCP Server Product Opportunity
Date: April 2026

TAM ESTIMATE
D365 F&O active customer base: ~45,000 organizations (Microsoft FY25)
Copilot Studio licenses in D365 ecosystem: ~30% penetration and growing
Agents needing ERP connectivity: estimated 60% of Copilot Studio deployments
Serviceable Addressable Market: ~8,100 organizations
At $3,000-$15,000 ARR per customer: $24M-$121M SAM

COMPETITIVE LANDSCAPE
Direct: None found. No production MCP server for D365 F&O exists on
        Azure Marketplace or GitHub as of April 2026.
Adjacent: Two early-stage GitHub projects (last commit 4+ months ago,
          no documentation, not production-grade).
Microsoft native: No signals of a first-party MCP server in D365 on
                  the next 12-month roadmap. Copilot connectors exist
                  but are not MCP-compatible.

RISK: Microsoft ships natively in 18-24 months. Window is real but finite.

RECOMMENDATION: GO — with urgency.
Build the production-grade version before the window closes. Position as
the expert implementation, not a connector. Monetize on support, templates,
and the Niyam pattern integration layer, not just the server itself.
```

### The Business Impact

- **Go/no-go decision backed by data in one session** — not gut feel, not a spreadsheet built over a week
- **Competitor scan reveals genuine white space** — no production-grade option exists, validating the gap
- **Investor memo section** — the TAM estimate and risk analysis are ready to paste into a one-pager

### Try It Yourself

> "Now draft a one-page product brief for the D365 MCP server product. Target audience: a potential co-founder or early customer. Cover the problem, the solution, the market, and the why-now. No jargon. One page."
