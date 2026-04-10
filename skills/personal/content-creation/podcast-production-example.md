# Podcast Production — Example

## Scenario: "In Our AI Era" Episode on Multi-Agent Orchestration Patterns

**Who:** Two co-hosts of a technical AI podcast ("In Our AI Era" format)
**Where:** Post-recording production workflow, episode ready for publishing on Spotify, YouTube, and LinkedIn
**The Problem:** The hosts just finished a 32-minute recorded conversation on multi-agent orchestration patterns in Copilot Studio. The raw transcript is accurate but messy — false starts, filler words, a three-minute tangent about a customer project that is interesting but does not belong in show notes. They need clean show notes, timestamped chapter markers, a LinkedIn post to announce the episode, and a short audiogram description. Doing this manually takes 90 minutes they do not have.

**Prerequisites:** Raw transcript or detailed notes from the episode. Episode title and the two or three key takeaways from the conversation.

---

### What You Say to the Agent

> "We just recorded episode 12 of 'In Our AI Era' — 32 minutes on multi-agent orchestration patterns in Copilot Studio. Key takeaways: (1) connected agents vs child agents is not a technical decision, it is an ownership decision, (2) description-based routing is the hidden superpower most builders do not use, (3) the parent agent should be thin — just an orchestrator, no domain logic. Here is the raw transcript. Generate: show notes (300 words), chapter markers with timestamps, and a LinkedIn post announcing the episode in our voice — fun, opinionated, from-the-trenches."

### What the Agent Does

Produces three ready-to-publish assets:

**Show notes:**
```
Episode 12: Multi-Agent Orchestration — The Patterns That Actually Work

The hosts unpack the architectural decisions behind building
multi-agent systems in Copilot Studio that scale past the demo stage.

What we cover:
- Why "connected vs child agents" is really a question of who owns
  the conversation — and why getting it wrong breaks your handoffs
- Description-based routing: how Copilot Studio decides which agent
  handles a request, and how to write descriptions that actually work
- The thin orchestrator principle: why your parent agent should do
  almost nothing — and why that makes the whole system more reliable
...
```

**Chapter markers** with seven timestamps, each labeled by segment topic.

**LinkedIn post** opening with a provocation: "Most multi-agent Copilot Studio builds fail for the same reason. Not the AI. The architecture." Follows with three punchy bullets from the episode, ends with the Spotify link and a question to drive comments.

### The Business Impact

- **90 minutes of production work done in 12 minutes** — transcript in, four assets out
- **SEO-optimized show notes** — structured with searchable terms (Copilot Studio, multi-agent, orchestration patterns) without keyword stuffing
- **LinkedIn post drives episode listens** — the provocation hook format consistently outperforms generic "new episode" announcements

### Try It Yourself

> "Take the chapter markers and create a YouTube description for the video version of this episode. Include a pinned comment template with the key links (Spotify, newsletter signup, the Niyam pattern article Ragnar referenced at 18:42)."
