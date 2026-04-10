---
name: cs-agent-creator
description: Rapid Copilot Studio agent creation workflow covering problem diagnosis, agent design, topic creation, testing, and deployment. Use when user says 'build a Copilot Studio agent', 'create an agent from scratch', 'design a Copilot Studio solution', 'set up agent topics', 'deploy agent to Teams', 'agent not working as expected'.
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, copilot-studio, agent-builder, rapid-creation]
requires: Copilot Studio VS Code Extension
mcp_tools:
  - "copilot-studio:manage-agent"
  - "copilot-studio:validate"
  - "copilot-studio:chat-directline"
---


# CS Agent Creator

Rapid Copilot Studio agent creation workflow. Takes a customer problem, diagnoses what kind of agent is needed, and builds it properly — system instructions, topics, connectors, testing, and deployment.

## Trigger Phrases

- "build a Copilot Studio agent"
- "create an agent from scratch"
- "design a Copilot Studio solution"
- "set up agent topics and connectors"
- "my agent keeps going to fallback"
- "deploy agent to Microsoft Teams"
- "how do I structure my agent"
- "agent not handling requests correctly"

## What This Skill Does

Takes a customer requirement (business problem or use case description) and walks through the full agent creation lifecycle: problem framing, agent design, topic creation, knowledge source setup, connector actions, testing, and channel deployment. Input is a description of what the agent should do. Output is a working, published Copilot Studio agent.

## Key Concepts

| Concept | What It Is | When You Need It |
|---|---|---|
| System Instructions | The agent's core prompt defining scope and behavior | Every agent — skip this and behavior is unpredictable |
| Topics | Structured conversation flows for specific intents | Form-like flows, data collection, action triggers |
| Generative Answers | Free-form answers from knowledge sources | Q&A over documents, policies, FAQs |
| Connector Actions | Calls to external systems via Power Automate | Look up data, submit records, trigger workflows |
| Knowledge Sources | SharePoint, websites, Dataverse content | Grounding answers in real business content |
| System Topics | Built-in topics: Greeting, Fallback, Escalation | Customise these before going live |

## Core Tasks

### 1. Diagnose the Problem
```text
GIVEN user describes a business problem or use case
WHEN skill analyzes the request
THEN identify which category applies:
  - Information retrieval (Q&A) → generative answers
  - Structured data collection → topic with question nodes
  - System action (submit, approve, update) → connector action
  - Process guidance (step-by-step) → topic with message nodes
AND determine if single agent or multi-agent is needed
AND recommend complexity level: starter / intermediate / advanced
```

### 2. Design the Agent
```text
GIVEN diagnosed use case
WHEN skill designs the agent
THEN define system instruction scope (what agent does AND does not do)
AND list required topics by name and trigger
AND identify required connector actions and data sources
AND flag any authentication requirements
AND produce design summary before building
```

### 3. Write System Instructions
```text
GIVEN agent scope definition
WHEN skill writes system instructions
THEN use this structure:
  Line 1: Who you are and who you serve
  Next: Bullet list of capabilities (3-5 max)
  Then: Tone and behavior rules
  Then: Escalation or fallback rule
AND keep under 500 words
AND avoid passive voice and filler phrases
```

### 4. Create Topics
```text
GIVEN list of required topics
WHEN skill creates each topic
THEN write 5-8 trigger phrases in natural language
AND define question nodes with correct entity types
AND add condition branches including catch-all
AND map variables: Topic.Var for local, Global.Var for session-wide
AND add confirmation step before any write action
AND add end-of-conversation node on every path
```

### 5. Test Before Publishing
```text
GIVEN completed agent configuration
WHEN skill validates before publish
THEN run happy path test for every topic
AND test unexpected input at each question node
AND verify fallback fires on unrecognized input
AND confirm greeting and system topics are customized
AND check that generative answers use correct knowledge source
THEN publish only when all paths verified
```

## System Instruction Template

```
You are [Agent Name] for [Company]. You help [audience] with:
- [Capability 1]
- [Capability 2]
- [Capability 3]

Tone: [professional/friendly/concise]

If you cannot answer a question, say so and direct the user to [contact/resource].
Do not make up information. Do not handle requests outside your defined scope.

[Optional: You have access to [knowledge sources]. Use them to answer questions.]
```

## Topic Structure Checklist

- [ ] 5-8 trigger phrases per topic in natural language
- [ ] All question nodes have entity type set
- [ ] All question nodes save to a named variable
- [ ] Every condition branch has a response node
- [ ] Catch-all condition branch exists
- [ ] Confirmation message before any write/submit action
- [ ] Error handling for failed connector actions
- [ ] End Conversation or redirect node on every path

## Deployment Checklist

- [ ] System instructions written and reviewed
- [ ] Greeting topic customized
- [ ] Fallback topic updated with helpful message
- [ ] All required topics built and tested
- [ ] Knowledge sources added and validated
- [ ] Connector actions authenticated and tested
- [ ] Agent tested in Test Canvas
- [ ] Published to target channel (Teams, website, etc.)

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Agent always goes to Fallback | Trigger phrases not matching user input | Add more varied trigger phrase alternatives, check for NLU overlap with other topics |
| Wrong topic fires | Overlapping trigger phrases across topics | Audit all trigger phrases for uniqueness, use more specific phrases |
| Action fails silently | Connector action not authenticated or flow erroring | Check Power Automate run history, validate connection credentials |
| Generative answers hallucinate | Knowledge source content is poor quality or too broad | Improve source document quality, add plain-language summaries, tighten agent scope instruction |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
