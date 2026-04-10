---
name: "Summarize Anything"
slug: "summarize-anything"
description: "Takes any content (article, document, transcript, email thread, report) and produces a structured summary calibrated to your need: quick scan, detailed briefing, or executive format. Use when someone says 'summarize this', 'summarize anything', 'give me the key points', 'too long didn't read', 'TLDR', 'summarize this article', 'what does this document say', 'key takeaways from'."
tab: "personal"
domain: "productivity"
industry_vertical: null
difficulty: "starter"
source_type: "ragnar-custom"
tags: ["beginner", "universal", "summarization", "reading", "research", "tldr"]
version: "1.0.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: true
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "None"
mcp_tools: []
---

# Summarize Anything

## What This Skill Does

Takes long content and turns it into exactly what you need: a 30-second scan, a structured briefing, or a decision-ready executive summary. The key difference from basic summarization is that it calibrates to your role, your decision, and your time constraint. A summary that doesn't know what you're trying to decide is just a shorter version of the same problem.

## Triggers

- "summarize this"
- "summarize anything"
- "give me the key points"
- "too long didn't read"
- "TLDR"
- "summarize this article"
- "what does this document say"
- "key takeaways from"

## How It Works

### Step 1: Paste the Content and Add Context

**Basic (works for any content):**
```
Summarize this: [paste content]
```

**Directed (much better results):**
```
Summarize this for me. I'm a [your role].
I care most about: [what matters to you]
I'm trying to decide: [the decision you're making]
Format: [see options below]

[paste content]
```

The directed format changes everything. A 47-page logistics report summarized for a VP of Operations making a vendor decision is completely different from the same report summarized for a journalist writing about industry trends.

### Step 2: Choose Your Output Format

**Quick Scan (30 seconds to read):**
5 bullets, each containing one complete thought. No sub-bullets. Lead each with the most important word or phrase.

**Detailed Briefing:**
Structured summary with sections matching the document's themes. Each section has 2-3 sentences. Good for reports and research papers you'll reference later.

**Executive Format:**
Four sections only: the problem, the solution or finding, the recommendation, and the next step. Strips everything else. Good for decision-makers with limited time.

**Action Items Only:**
Pulls out only the things that require someone to do something. Includes owner if specified in the content, deadline if mentioned. Good for meeting transcripts.

**Decision Brief:**
States the decision being asked, the options on the table, the recommended choice, and the reasoning. Good for proposals, RFPs, and strategic documents.

### Step 3: For Specific Content Types

**Meeting transcripts and call recordings:**
```
"Summarize this meeting transcript. I missed the call. 
Extract: decisions made, action items with owners, 
open questions, and anything that requires my input."
```

**Research papers:**
```
"Explain this paper in plain language. I understand [your field] 
but not academic [adjacent field] jargon. What's new here vs 
what already existed? What's the practical application?"
```

**Long reports:**
```
"I'm a [role] and I need to decide [decision].
Summarize this report with that lens. What's directly 
relevant to my decision? What can I skip?"
```

**Email threads:**
```
"Summarize this email thread. Who said what, what was agreed, 
what's still unresolved, and what do I need to respond to?"
```

### Step 4: Always Ends With "What Does This Mean for You?"

The most useful summaries connect the content to your situation. If you give context, the summary will end with a direct answer to: given what you told me, what does this mean for you specifically, and what (if anything) should you do next?

## Output

A structured summary in your chosen format, ending with a direct "so what" tied to your role and decision if you provided that context. Length varies by format: Quick Scan is under 100 words, Executive Format is under 200, Detailed Briefing is proportional to the source.

## Checklist

- [ ] Content pasted or clearly described
- [ ] Role and decision context provided (for best results)
- [ ] Output format specified
- [ ] For long documents: stated what you're trying to decide, not just "summarize"
- [ ] For transcripts: asked for decisions, actions, and open questions separately

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Summary is too generic | No role or decision context given | Add "I'm a [role] deciding whether to [action]" |
| Missing what matters | Claude doesn't know your priorities | Add "Focus specifically on [topic/section]" |
| Too long | No length constraint | Add "under 100 words" or "5 bullets maximum" |
| Transcript summary misses actions | Transcript was unstructured | Ask separately: "Now pull only the action items with owners" |

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-10 | Initial skill |
