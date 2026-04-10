# Business Case Builder — Example

## Scenario: The IT Manager Who Needed $85K Approved Before Budget Freeze

**Who:** Tony Ramirez, IT Manager at a 200-person professional services firm, managing infrastructure for a team of 22 engineers and support staff.
**Where:** Claude Code, Monday morning. Budget approvals close in 3 weeks.
**The Problem:** Tony wants to replace the firm's manual server monitoring setup with a modern automated monitoring platform. He knows the current situation is painful: the ops team gets woken up by outages they could have prevented, and junior engineers spend 12 hours per week on manual monitoring tasks they hate. He has a vendor quote for $85,000 in year one. His VP has asked for a business case. Tony has never written one before, does not have all the numbers, and is not sure how to frame it in a way that a non-technical CFO will approve.

**Prerequisites:** A rough sense of current costs and a vendor quote. Tony has both.

---

### What You Say to the Agent

> "I need to build a business case to get $85,000 approved for a server monitoring platform. My VP wants a 1-2 page document for the CFO. The current situation: our ops team spends about 12 hours per week on manual monitoring at an average loaded cost of $75 per hour. We had 4 significant outages in the past 12 months that each cost us roughly $8,000-$15,000 in recovery time and lost productivity. The vendor quoted $85,000 for year one, $42,000 ongoing. I don't have all the exact numbers but I can estimate. Help me build the case."

The agent asks 5 follow-up questions: What is the team size affected? What alternatives were considered? What is the timeline for deployment? Who is the primary risk owner for outages? What would "doing nothing" cost over 3 years?

Tony answers, including with rough estimates where he does not have exact figures.

### What the Agent Does

1. Takes Tony's inputs and calculates the current state cost: 12 hours per week times $75 per hour times 52 weeks = $46,800 per year in manual monitoring labor. Plus average outage cost: 4 outages at $11,500 average = $46,000 per year in incident recovery.
2. Total current cost: $92,800 per year before the new platform.
3. Calculates ROI across 3 scenarios using conservative, expected, and optimistic benefit assumptions.
4. Adds a risks section with the most common CFO objections already addressed.
5. Produces the business case:

```
BUSINESS CASE: SERVER MONITORING PLATFORM
Prepared by: Tony Ramirez, IT Manager | April 2026
Audience: CFO | Format: 1-page decision document

THE DECISION
We are asking for $85,000 in Year 1 to replace manual server monitoring
with an automated platform. This investment pays back in 8.4 months
and saves an estimated $54,800 per year ongoing.

CURRENT STATE: WHAT THIS IS COSTING US TODAY
Manual monitoring labor:     $46,800/year (12 hrs/wk at $75/hr loaded)
Outage recovery (4 per year): $46,000/year (avg $11,500 per incident)
Total current cost:           $92,800/year

THE RISK OF DOING NOTHING
At current trajectory, we will spend $278,400 over 3 years on monitoring
labor and incident recovery. Outage frequency typically increases with
infrastructure scale — and we are growing.

PROPOSED SOLUTION
Automated monitoring platform (Vendor: [Name])
Year 1 cost: $85,000 (setup, licenses, training)
Year 2+ cost: $42,000/year (ongoing licenses and support)

FINANCIAL ANALYSIS — Three Scenarios

                  Conservative  Expected    Optimistic
Annual savings:   $62,000       $78,800     $95,000
Year 1 net:       -$23,000      -$6,200     +$10,000
Year 2 net:       +$20,000      +$36,800    +$53,000
Payback period:   16.5 months   8.4 months  5.3 months
3-year ROI:       26%           96%         158%

Expected scenario assumes: 80% reduction in manual monitoring hours,
2 outages avoided per year, 1 outage reduced in severity.

ALTERNATIVES CONSIDERED
- Hire a junior monitoring engineer: $65,000 salary + $18,000 benefits
  = $83,000/year ongoing, no reduction in outage frequency. Rejected.
- Do nothing: $92,800/year with increasing risk as infrastructure grows. Rejected.

RISKS
Deployment delay past Q2: Mitigation — vendor has committed to 6-week
implementation, contract includes penalty clause.
Team adoption: Mitigation — vendor training included in Year 1 cost.

RECOMMENDATION
Approve $85,000 for Year 1. Expected payback in 8.4 months.
We are currently spending $92,800/year to manage a problem
this platform solves for $42,000/year after Year 1.
```

### The Business Impact

- **VP approved same day, CFO approved 3 days later** — the payback period framing (8.4 months) was the deciding factor
- **Tony did not need to know every number in advance** — the agent flagged assumptions clearly and Tony was able to verify 3 of the 4 key estimates before the meeting
- **Do-nothing cost framed the urgency** — $278,400 over 3 years made the $85,000 ask look conservative, not expensive

### Try It Yourself

> "Take the risks section and expand it. I want 5 risks, each with a likelihood rating (Low, Medium, High), a financial impact estimate, and a mitigation plan. My CFO always asks about implementation risk and I want to be ready."
