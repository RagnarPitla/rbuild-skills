# CS Knowledge Sources — Example

## Scenario: HR Policy Agent Not Returning Relevant Answers from SharePoint

**Who:** Fatima Al-Rashidi, Copilot Studio Developer at a 1,200-person retail company
**Where:** Copilot Studio, SharePoint Online (HR policy library)
**The Problem:** Fatima built an HR agent that should answer questions about parental leave, expense reimbursement, and remote work policies. The SharePoint library has 34 policy documents. When employees ask questions, the agent either returns a generic summary from the wrong document or says it cannot find information. HR is getting the same questions by email that the agent was supposed to answer. The knowledge source is connected but something is wrong with how it searches.

**Prerequisites:** Copilot Studio environment, VS Code extension, SharePoint site with HR documents

---

### What You Say to the Agent

> "My HR agent has a SharePoint knowledge source with 34 policy documents but it's returning generic answers or saying it can't find anything. Questions like 'what is our parental leave policy' aren't getting answered correctly."

### What the Agent Does

1. Diagnoses the root cause: the SharePoint library is connected at the root site level rather than scoped to the specific document library, meaning the agent is searching across thousands of pages instead of 34 focused policy documents
2. Reconfigures the knowledge source URL to point directly to the HR Policies library path, reducing the search scope by 98%
3. Detects that 11 of the 34 documents are PDFs scanned from print, not text-selectable, and flags these as invisible to the retrieval layer. Recommends re-uploading text-based versions for 6 of the most-queried policies
4. Adds a system instruction that tells the agent to always cite the policy document name and section when answering, so HR can verify the source and employees trust the answer

### The Business Impact

- **Relevant answer rate improved from 30% to 91%** — scoped library path and text-based documents fixed the retrieval
- **6 high-traffic policies re-uploaded in 20 minutes** — identified the exact documents causing failures instead of re-uploading all 34
- **HR email volume dropped by 55% in the first week** — parental leave, expense, and remote work questions now handled by the agent

### Try It Yourself

> "My agent's knowledge source is connected to our company intranet but it keeps pulling outdated pages. How do I make sure it only searches current policy documents?"
