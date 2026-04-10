# Debugging Detective — Example

## Scenario: The Bug That Only Happens on Thursdays

**Who:** Tomás Rivera, Backend Engineer, SaaS platform (payments domain)
**Where:** Node.js API, PostgreSQL, AWS
**The Problem:** Users started reporting failed payment reconciliations — but only some of them, and seemingly at random. No errors in the logs. No pattern Tomás could see. His manager is asking for an ETA on the fix.

**Prerequisites:** Access to application logs, database, and the ability to reproduce issues locally. The 4-step methodology applies regardless of language or stack.

---

### What You Say to the Agent

> "Walk me through debugging a payment reconciliation failure. It's intermittent — happens maybe 20% of the time, no error messages. Users say payments show as pending even after the bank confirms success. I've looked at the logs and can't see anything obvious."

### What the Agent Does

**Step 1: Reproduce reliably**
"20% failure rate is actually useful — it means you CAN reproduce it. What's different about the successful vs failing payments? Start there. Check: payment amount, payment method, bank, time of day, user account age."

When Tomás checks, the failing payments all happen between 3pm-5pm EST.

**Step 2: Isolate**
"3-5pm EST — what changes in your system at that time? Check: scheduled jobs, batch processes, external API rate limit resets, traffic patterns. Also check your database connection pool — peak traffic hours often reveal connection pool exhaustion that doesn't generate explicit errors."

Tomás checks: there's a daily reconciliation job that runs at 3pm and holds database connections for ~90 minutes.

**Step 3: Form and test hypothesis**
"Hypothesis: Your reconciliation job is consuming database connections, causing payment status updates to time out silently. The timeout is swallowed instead of raising an error, so payments stay in 'pending'. Test: Add explicit connection timeout logging, then trigger the reconciliation job manually while running a payment."

Test confirms: payment status update times out when connections are exhausted. The catch block logs `error.code = 'ETIMEOUT'` — which wasn't being surfaced upstream.

**Step 4: Fix and verify**
- Increase connection pool size
- Add proper error propagation for timeout errors
- Add retry logic for status updates
- Add monitoring alert for connection pool saturation

### The Business Impact

- **Root cause found in 4 hours** using the structured methodology — Tomás had been guessing for 2 days
- **No more silent failures** — timeout errors now surface properly with a user-facing "please try again" message
- **Connection pool monitoring added** — prevents recurrence by alerting before pool exhaustion

### Try It Yourself

> "I've fixed the timeout issue but I'm still seeing ~2% of payments stuck in pending. The pattern is different this time — it seems to correlate with a specific bank (Chase). Walk me through isolating whether this is an API response parsing issue or a timing/retry issue."
