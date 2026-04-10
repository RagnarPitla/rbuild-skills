---
name: Meeting Notes Processor
slug: meeting-notes-processor
description: Transform raw meeting notes or transcripts into structured action items, decisions log, and follow-up assignments with deadlines.
tab: personal
domain: productivity
industry_vertical: null
difficulty: starter
source_type: ragnar-custom
tags: "[\"productivity\", \"meetings\", \"action-items\", \"notes\", \"workflow\"]"
version: 1.0.1
icon_emoji: 📝
is_coming_soon: false
is_featured: false
author: ragnar
learning_path: null
learning_path_position: null
prerequisites: "[]"
references: "[]"
requires: Exa MCP, Firecrawl MCP
mcp_tools:
  - "exa-mcp"
  - "firecrawl-mcp"
---


# Meeting Notes Processor

Raw meeting notes are nearly useless 48 hours after the meeting. Structured output — decisions, actions, owners, deadlines — is what drives follow-through.

## Input Formats

This skill works with:
- Raw notes typed during the meeting
- AI-generated transcripts (Otter, Fireflies, Teams transcription, Riverside)
- Voice memos converted to text
- Email threads or chat logs from async meetings

## Output Structure

For every meeting, produce:

```markdown
# Meeting: [Title]
Date: [Date] | Duration: [Time] | Attendees: [Names]

## Decisions Made
- [Decision 1] — decided by [person/group], effective [date]
- [Decision 2] — ...

## Action Items
| # | Task | Owner | Due Date | Status |
|---|---|---|---|---|
| 1 | [Specific task] | [Name] | [Date] | Open |
| 2 | ... | ... | ... | ... |

## Key Discussion Points
- [Important context that isn't captured in decisions or actions]
- [Outstanding questions that need follow-up]

## Next Meeting
- Date: [if scheduled]
- Agenda items: [what's being deferred to next time]
```

## Processing Guidelines

**Action items must be:**
- Specific and actionable (verb + noun + outcome)
- Assigned to exactly one person (not "the team")
- Have a due date (even if approximate)

**Bad:** "Discuss pricing strategy further"
**Good:** "Ragnar to draft pricing proposal for enterprise tier by Friday April 15"

**Decisions must be:**
- Clearly stated (what was decided, not what was discussed)
- Distinguished from "we'll think about it" (that's an action item to make a decision)

**What to ignore:**
- Small talk and social conversation
- Tangential discussions that didn't lead anywhere
- Repeated or contradicted statements (take the final position)

## Prompt Template

```
Here are the notes/transcript from [meeting name] on [date] with [attendees].

Please process them into:
1. A list of decisions made (be precise about what was actually decided)
2. Action items with owner and due date (infer deadline from context if not explicit)
3. Key discussion points that provide context
4. Any outstanding questions or items deferred to next meeting

Notes:
[paste notes or transcript here]
```

## For Recurring Meetings

Build a template for each recurring meeting type:

**Weekly team standup:**
- What did each person complete last week?
- What are they working on this week?
- Any blockers?

**Project review:**
- Status by workstream (RAG: Red/Amber/Green)
- Risks and issues
- Decisions needed from leadership
- Next milestone and confidence

**Customer call:**
- Customer pain points mentioned
- Feature requests or feedback
- Next steps and commitments made
- Relationship status

## Distribution

After processing, send the structured notes to:
- Meeting attendees (confirmation of what was decided)
- People assigned action items (their specific tasks)
- Stakeholders who weren't there but need to know (decisions only)

Send within 24 hours while the meeting is still fresh in people's memories.

## Trigger Phrases

- "Help me with meeting notes processor"
- "Meeting Notes Processor"
- "How do I meeting notes processor"

## Quick Example

> See `meeting-notes-processor-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Unexpected output | Unclear input | Add more specific context to your prompt |
| Skill not triggering | Wrong trigger phrase | Use the exact trigger phrases listed above |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
