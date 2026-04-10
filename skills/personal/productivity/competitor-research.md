---
name: "Competitor Research"
slug: "competitor-research"
description: "Builds a full competitor brief from a name or URL. Covers what they do, who they target, their positioning, pricing signals, strengths and weaknesses, and what differentiates you. Use when someone says 'competitor research', 'research a competitor', 'tell me about [company]', 'competitor brief', 'competitive analysis', 'what do I need to know about [company] before a call'."
tab: "personal"
domain: "productivity"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "universal", "research", "competitive-intelligence", "business", "strategy"]
version: "1.0.0"
icon_emoji: "🔭"
is_coming_soon: false
is_featured: true
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references:
  - title: "Exa Neural Search"
    url: "https://exa.ai"
requires: "Exa MCP (optional, for live web research)"
mcp_tools: ["exa-mcp"]
---

# Competitor Research

## What This Skill Does

Produces a one-page competitor brief ready for a meeting, pitch, or product decision. Covers how the competitor positions themselves, who they sell to, what customers say about them, their pricing signals, where they're strong, where they're weak, and where you can win. Takes 10 minutes to produce instead of an hour of tab-switching.

## Triggers

- "competitor research"
- "research a competitor"
- "tell me about [company]"
- "competitor brief"
- "competitive analysis"
- "what do I need to know about [company] before a call"

## How It Works

### Step 1: Tell It What You Need

Give it the company name, URL, or a meeting context:

```
Option A: Simple research request
"Research [Company Name]. I'm meeting with a prospect who is 
also evaluating them. I need their positioning, what customers 
complain about, and where I can differentiate."

Option B: Pre-meeting brief
"I have a demo with a prospect tomorrow. They're also looking at 
[Competitor]. Give me a quick brief so I know what I'm up against."

Option C: Full competitive analysis
"Compare [Company A] vs [Company B] vs my company. I'm trying 
to understand the competitive landscape for [market category]."
```

### Step 2: Know What the Brief Covers

**Company overview** (1 short paragraph): Who they are, what they sell, who they target, and how long they've been around.

**Positioning** (how they describe themselves): Their tagline, their claimed differentiator, their ideal customer profile. What story do they tell?

**Pricing signals**: Free tier, paid plans, enterprise pricing if known. Even rough ranges are useful. If pricing is hidden, that's a signal in itself.

**Key strengths** (3 items with evidence): What they genuinely do well. G2 reviews, customer quotes, product reputation. Being honest about their strengths helps you prepare for real objections.

**Known weaknesses** (3 items with evidence): What customers complain about, what's missing from their product, where they fall short. Reviews on G2, Capterra, Reddit, and Trustpilot are the best sources.

**Where you can win**: Based on their weaknesses and your strengths, where is the clearest differentiation? What should you lead with?

**Battle card summary**: If a prospect brings them up, what do you say? If they ask for a direct comparison, what are your two strongest differentiators?

### Step 3: Use Job Postings as Intelligence

Job postings are one of the best signals of what a company is building next. They reveal strategic priorities before any press release does.

- Hiring 8 ML engineers: they're building AI features (probably 6-12 months out)
- Hiring 3 compliance officers: they're making an enterprise push
- Hiring a VP of Partnerships: they're shifting go-to-market strategy
- No engineering hires: they may be in cost-cutting mode

Always check their open roles on LinkedIn or their careers page when you need forward-looking intelligence.

### Step 4: With Exa MCP (Live Research)

When Exa MCP is configured, the brief pulls from:
- Current website and product pages
- Recent G2, Capterra, and Trustpilot reviews
- LinkedIn company profile (headcount, growth)
- Press releases and funding announcements from the last 6 months
- Job postings (strategic signal)
- Reddit and community discussions

Without Exa, the brief works from training knowledge, which is most accurate for well-established companies with substantial public information.

## Output

A one-page competitor brief with:
- Company overview
- Positioning statement
- Pricing summary
- 3 strengths, 3 weaknesses (with evidence)
- Where you can win (2-3 differentiation angles)
- Battle card summary (what to say if they come up in a sales call)

## Checklist

- [ ] Company name or URL provided
- [ ] Your competitive angle given (what you do, who you serve)
- [ ] Weaknesses are backed by customer evidence, not guesses
- [ ] Battle card written for your specific situation, not generic
- [ ] Job postings checked for forward-looking signals (for important competitors)

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Brief is too surface level | No context about your angle | Add "I'm competing for [customer type] on [criteria]" |
| Pricing missing | Competitor hides pricing | Ask "What do customers say about pricing on G2 or review sites?" |
| No differentiation ideas | Your context not included | Add "We do [X] differently by [Y]. What angle should I lead with?" |
| Info feels outdated | Training data limitations | Enable Exa MCP for live web research, or check their site manually |

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-10 | Initial skill |
