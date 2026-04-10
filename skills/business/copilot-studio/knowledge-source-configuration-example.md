# Knowledge Source Configuration — Example

## Scenario: HR Agent Returning Generic SharePoint Results Instead of Specific Policy Documents

**Who:** Sanjay Mehta, Power Platform Architect at a 4,500-person financial services company
**Where:** Copilot Studio, SharePoint Online
**The Problem:** Sanjay's HR agent has a SharePoint knowledge source pointing to the company's HR portal. When employees ask "what is the maternity leave policy", the agent returns a summary of the HR portal homepage or a generic paragraph about employee benefits, not the actual Parental Leave Policy document. The correct document exists in SharePoint but the agent never surfaces it. The HR team is losing confidence in the agent after 3 weeks of the same complaint.

**Prerequisites:** Copilot Studio environment, VS Code extension, SharePoint Online with HR documents

---

### What You Say to the Agent

> "My HR agent's SharePoint knowledge source keeps returning the portal homepage or generic text instead of the specific policy documents. How do I fix the configuration so it actually returns the right documents?"

### What the Agent Does

1. Identifies the misconfiguration: the knowledge source is pointed at the SharePoint site root (https://company.sharepoint.com/sites/HR), which includes news posts, announcements, and navigation pages that drown out the policy documents in retrieval scoring
2. Reconfigures the source to point directly at the Policies document library URL, then enables the "Restrict to this path" option so only documents in that library are indexed
3. Checks the 8 most-queried policy documents and finds 3 have no document titles set in SharePoint metadata, meaning the retrieval layer cannot match them to query terms like "maternity" or "parental leave". Adds the correct metadata titles to fix discoverability
4. Adds a system instruction that tells the agent to prefer documents with "Policy" in the title over general content, and to always include the document title and last-modified date in its answer so employees can verify they are reading the current version

### The Business Impact

- **Correct document retrieval rate went from 22% to 88%** after scoping the library path and fixing 3 metadata titles
- **HR team restored confidence in the agent** after one-day turnaround on a 3-week complaint
- **Escalation rate dropped by 60%** for policy questions in the following 2 weeks

### Try It Yourself

> "My knowledge source is returning the right content but the answer doesn't tell users which document it came from. How do I add source citations to the agent's responses?"
