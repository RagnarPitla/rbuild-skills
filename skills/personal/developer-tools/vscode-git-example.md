# VS Code Git — Example

## Scenario: Resolving a Complex Merge Conflict After a Long Feature Branch

**Who:** Tom Lindqvist, Senior Backend Developer, working on a microservices platform team.
**Where:** VS Code on Ubuntu, TypeScript Node.js service, GitLens installed.
**The Problem:** Tom has been working on a 2-week feature branch. Main has moved on significantly. When he attempts to merge, 8 files have conflicts. Two of the conflicts are in the core routing module where both branches added new route handlers in different ways. Tom is not comfortable with raw conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) and wants to resolve the conflicts visually without leaving VS Code.

**Prerequisites:** VS Code 1.85+, GitLens extension, a repository with merge conflicts.

---

### What You Say to the Agent

> "I have 8 files with merge conflicts after merging main into my feature branch. Two of the conflicts are in the same routing file where both branches added new routes differently. How do I resolve all of this in VS Code without using the command line?"

### What the Agent Does

1. Opens the Source Control panel (`Cmd+Shift+G`) and identifies the 8 conflicted files listed under "Merge Changes".
2. Explains that clicking "Resolve in Merge Editor" on the routing file opens the 3-way merge editor with Current (Tom's changes, left), Incoming (main's changes, right), and Result (bottom).
3. Walks through the routing conflict: Tom's branch added a `/payments` route, main added a `/notifications` route. Both need to be kept. Uses "Accept Both" for each hunk to include all new routes.
4. For a simpler conflict where main's version is definitively correct (a security fix), uses "Accept Incoming" on that chunk.
5. Clicks "Complete Merge" once all conflicts in the file are resolved. VS Code moves the file from "Merge Changes" to "Staged Changes" automatically.
6. After all 8 files are resolved and staged, writes the merge commit message in the Source Control panel commit box and commits with `Cmd+Enter`.
7. Shows how to use GitLens "Show Commit Graph" to verify the merge commit looks correct in the branch history.

### The Business Impact

- **Zero accidental deletions:** The 3-way editor makes it visually clear which changes come from where. Tom does not accidentally overwrite the security fix from main.
- **Merge completed in one session:** 8 conflicted files resolved in 25 minutes versus a typical 2+ hours of text editing with raw conflict markers.
- **Audit trail:** GitLens commit graph shows the merge commit with both parent branches clearly, useful for the post-merge code review.

### Try It Yourself

> "Show me how to view the history of a single file in VS Code to find out when a specific function was last changed and by whom."
