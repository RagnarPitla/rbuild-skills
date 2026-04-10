# Personal Finance Report — Example

## Scenario: The Manager Who Did Not Know Where His Money Was Going

**Who:** James Okafor, mid-level Operations Manager at a logistics company, 34 years old, earns $7,200 per month after tax. Considering asking for a raise and wants to understand his actual financial position first.
**Where:** Claude.ai on his phone, Sunday evening.
**The Problem:** James feels like he should be saving more. He makes decent money, has no major debts other than his car, but his account balance never seems to grow. He has never done a proper spending review. He roughly knows he spends on rent, food, and "stuff," but has no idea what "stuff" actually adds up to. He wants to know the real numbers before walking into a salary conversation.

**Prerequisites:** None. James exports 3 months of transactions from his bank app as a CSV.

---

### What You Say to the Agent

> "Analyze my spending for the last 3 months. I'll paste my bank transactions as a CSV. My monthly take-home is $7,200. I want to know: where is my money actually going, what subscriptions am I paying for, and what's my real saving rate? Flag anything unusual."

James pastes 3 months of transactions: 247 rows covering January through March.

### What the Agent Does

1. Parses all 247 transactions, cleans up vendor names (maps "AMZN*" to Shopping, "SQ*Coffee" to Food and Dining), and categorizes each one.
2. Calculates spending by category across all 3 months and averages by month.
3. Scans for recurring charges and builds a subscription list.
4. Compares month-over-month to find trends and spikes.
5. Calculates saving rate against the $7,200 income baseline.
6. Produces the report:

```
SPENDING REPORT: January to March 2026
James Okafor

MONTHLY AVERAGE SUMMARY
Income:             $7,200
Total spending:     $6,913
Net saved:            $287 (4.0% saving rate)

SPENDING BY CATEGORY (Monthly Average)
Housing             $2,100  (30.4%)
Food and Dining     $1,247  (18.0%)
Transport             $580   (8.4%)
Shopping              $891  (12.9%)
Subscriptions         $340   (4.9%)
Entertainment         $218   (3.2%)
Healthcare             $89   (1.3%)
Other                $1,448  (20.9%)

SUBSCRIPTION AUDIT — 9 services found, $340/month
Netflix:         $18
Spotify:         $11
Adobe Creative:  $55
LinkedIn Premium:$40
Hulu:            $18
Amazon Prime:    $15
NordVPN:         $13
Audible:         $17
Duolingo Plus:   $13
MasterClass:     $50
FutureLab Gym:   $90

ANOMALIES
- Food delivery spend: $490 in March vs $280 in January (75% increase)
- "GADG*" — $340 single charge in February (unrecognized, flag for review)
- 2 subscriptions last charged 6+ months ago before resuming (Audible, MasterClass)

RECOMMENDATIONS
1. Subscription audit: You have 9 active subscriptions at $340/month.
   You likely use 3-4 of them regularly. Cutting the unused 5 saves
   $140/month, or $1,680/year.

2. Food delivery trend: Your delivery spend is rising sharply.
   At current trajectory, you're on pace for $700/month in Q2.
   Cooking 3 nights per week instead of ordering could save $200/month.

3. Saving rate: At 4%, you're saving $287/month. The 20% benchmark
   would be $1,440/month. The gap is $1,153. Your subscription audit
   and food delivery changes alone close $340 of that gap.
```

### The Business Impact

- **Found $340/month in forgotten subscriptions** — 6 services he barely used, including a $90 gym membership for a gym he stopped attending in November
- **Identified the food delivery spike** — a habit that crept up over 3 months without James noticing
- **Real saving rate revealed: 4%** — James now has a concrete number to work with, and a specific shortfall to close before his salary conversation

### Try It Yourself

> "Build me a 3-month savings plan to get my saving rate from 4% to 20%, based on the categories in my report. What do I cut, what do I keep, and what's the realistic new monthly budget for each category?"
