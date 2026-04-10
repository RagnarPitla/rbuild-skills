# Build Your First AI Agent: Example

## Scenario: HR Manager Stops Answering the Same 6 Questions Every Week

**Who:** Rachel Kim, HR Manager at a 200-person professional services firm. No technical background. Manages benefits, onboarding, and employee policy for the whole company.
**Where:** Microsoft Copilot Studio, deployed to Microsoft Teams
**The Problem:** Rachel gets the same questions over and over. "When do I start accruing vacation?" "Can I carry PTO over to next year?" "How do I add a dependent to my health plan?" She answers these 15-20 times a week, every week. It's not complicated work, but it eats 3-4 hours of her time. She has no idea how to build an agent and has never written code.

**Prerequisites:** Microsoft 365 Business Premium or E3/E5 license (includes Copilot Studio). The HR policy document already exists in SharePoint.

---

### What You Say to the Agent

> "I'm an HR manager and I want to build my first AI agent. I keep answering the same 6 vacation and benefits questions every week. I have no technical background. Walk me through building something in Copilot Studio that can answer these questions so I don't have to. I want it live in Teams by end of today."

### What the Agent Does

1. **Asks the four mapping questions first.** Before touching any tool, Claude walks Rachel through: what questions trigger this agent, where the answers live (her SharePoint HR policy page), what done looks like for the employee, and what the fallback is when the agent doesn't know. Rachel writes this down in 5 minutes.

2. **Guides her to Copilot Studio step by step.** Claude explains the interface: create agent, name it "HR Policy Assistant," write a 2-sentence description, then add the SharePoint knowledge source. Rachel pastes the SharePoint URL. Claude warns her that the document needs to be published and accessible, and tells her how to check.

3. **Helps her write 6 topic trigger phrases.** Claude generates 3-4 natural variations for each common question (people ask the same thing in different ways). "How many vacation days do I get?" and "What is my PTO balance?" and "Tell me about vacation" all need to trigger the same topic.

4. **Builds the fallback response together.** The agent can't answer everything, so Rachel needs a clean response for unknown questions. Claude drafts: "I can only answer questions covered in our HR policy. For anything else, please email hr@company.com or reach out to Rachel directly."

5. **Runs the test plan.** Claude gives Rachel a 10-question test list: 6 direct hits, 2 edge cases, 2 completely off-topic questions. She runs all 10 in the Copilot Studio test panel. Two questions come back wrong. Claude helps her identify why: the SharePoint document had contradictory information about PTO carryover from two policy updates. Rachel fixes the document, republishes, and re-tests. All 10 pass.

6. **Deploys to Teams.** Claude walks her through the publish flow. Agent is live in Teams in a dedicated HR channel within 45 minutes of starting.

### The Business Impact

- **40 queries answered in the first 3 days** without Rachel involved in any of them
- **3.5 hours per week recovered** that Rachel now uses for actual HR work (performance reviews, onboarding improvements)
- **Employee satisfaction signal:** Three employees messaged Rachel directly to say the bot was "actually helpful, not annoying." Rare praise for an internal chatbot.
- **Expansion path unlocked:** Rachel is now mapping a second agent for benefits enrollment. She did the four-question mapping exercise herself this time without prompting.

### Try It Yourself

> "My first agent is live and working. Now I want to add a second topic: guiding employees through the process of submitting a PTO request in our HRIS system. It's a 5-step process. How do I build a step-by-step guided topic in Copilot Studio without breaking the agent I already have?"
