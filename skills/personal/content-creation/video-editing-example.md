# Video Editing — Example

## Scenario: Cleaning Up a Raw Niyam Agent Tutorial Recording

**Who:** Ragnar Pitla, recording a YouTube tutorial for @RagnarPitla
**Where:** 28-minute raw screen recording, editing in DaVinci Resolve or CapCut (or delegating to an editor)
**The Problem:** Ragnar recorded a hands-on tutorial showing how to build a Niyam agent from scratch in Copilot Studio. The raw recording has four minutes of fumbled setup at the start (wrong browser tab, had to restart the Copilot Studio session), two long silences mid-video where he was reading documentation, and a jump cut needed at 19:30 where he accidentally showed a client's internal data on screen. Without a clear editing plan, an editor will either make bad cuts or spend 40 minutes asking clarifying questions.

**Prerequisites:** The raw recording timestamp log or a rough description of problem areas. The final target length and platform (YouTube standard tutorial format).

---

### What You Say to the Agent

> "I recorded a 28-minute Niyam agent tutorial. Problems: minutes 0:00-4:10 are unusable (setup fumbling, restart). Two silences at 11:20-12:45 and 17:05-18:30. A mandatory cut at 19:30 (client data visible for about 8 seconds). Target final length: 18-22 minutes. Platform: YouTube. Give me a precise editing plan an editor can execute without asking me anything."

### What the Agent Does

Produces a complete editing brief:

```
EDITING PLAN — Niyam Agent Tutorial
Target output: 18-22 min | Platform: YouTube

CUT LIST:
1. 0:00-4:10 — HARD CUT. Remove entirely. Start video at 4:11
   where Ragnar says "Alright, so here is our starting point."
   Add 0.5s fade-in from black.

2. 11:20-12:45 — SILENCE REMOVAL. Cut dead air. Use J-cut:
   let audio from 12:46 start 1 second before the cut point
   so the transition feels deliberate, not abrupt.

3. 17:05-18:30 — SILENCE REMOVAL. Same J-cut treatment.
   Consider adding a text overlay: "Checking the Dataverse schema..."
   to explain the pause for viewers, alternative to cutting.

4. 19:22-19:38 — MANDATORY PRIVACY CUT. Hard cut + blur/black
   frame. Replace with static screen: white background + text overlay
   "[ Internal data redacted ]" for 2 seconds, then resume at 19:39.

PACING NOTES:
- Ragnar's explanation at 6:15-8:40 runs long. Consider 1.15x
  speed on the screen-share portions (not the talking-head segments).
- Chapter markers: add YouTube chapter titles at 4:11, 8:41,
  13:00, 18:31, 22:00 (see chapter list below).

THUMBNAIL FRAME: Best candidate at 9:14 — clear screen showing
the completed Dataverse table structure, Ragnar visible in corner.
```

Also generates the chapter title list and a recommended end screen layout.

### The Business Impact

- **Editor executes in 45 minutes with zero back-and-forth** — every cut has a timestamp, a method, and a rationale
- **Privacy risk eliminated** — the mandatory cut at 19:30 is flagged explicitly so it cannot be missed
- **Final video hits 21 minutes** — tight enough to maintain watch time above 60%, long enough for YouTube's algorithm to treat it as a serious tutorial

### Try It Yourself

> "Now write the YouTube title, description (first 150 characters optimized for search, full description below the fold), and five tags for this Niyam agent tutorial video."
