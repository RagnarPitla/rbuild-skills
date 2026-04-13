# GitHub CLI Repo -- Example

## Scenario: Bootstrap a New Agent Project From a Template in One Command

**Who:** Alex, AI Engineer, starting a new Copilot Studio agent project at a client site
**Where:** macOS terminal, home directory
**The Problem:** Alex needs to start a new agent project quickly. The team has a standard template repo with folder structure, CLAUDE.md, agent YAML stubs, and CI config already set up. Currently Alex opens GitHub in a browser, navigates to the template, clicks "Use this template", fills in the form, then clones the new repo. It takes 5-7 minutes and requires a browser. Alex wants to do it from the terminal with a single command.

**Prerequisites:** gh CLI installed, authenticated, template repo exists at `myorg/agent-starter-template`

---

### What You Say to the Agent

> "Create a new private repo called 'neom-procurement-agent' from the agent-starter-template and clone it locally"

### What the Agent Does

1. Runs a single `gh repo create` command:
   ```bash
   gh repo create neom-procurement-agent \
     --template myorg/agent-starter-template \
     --private \
     --clone \
     --description "Procurement approval agent for Neom using Copilot Studio"
   ```
   This creates the repo in the authenticated user's account (or org if specified), copies the template content, and clones it into `./neom-procurement-agent` in one step.

2. Verifies the structure with `ls neom-procurement-agent/` to confirm template files landed correctly.

3. Opens the project in VS Code with `code neom-procurement-agent`.

### The Business Impact

- **Speed:** 5-7 minutes of browser interaction collapses to a single 10-second command.
- **Repeatability:** Alex can spin up standardized agent projects in a consistent structure every time with no variation.
- **Immediate productivity:** The project is cloned and ready to open. No separate clone step needed.

### Try It Yourself

> "Create a release for v1.0.0 with auto-generated notes from my commits"

```bash
gh release create v1.0.0 --generate-notes --title "v1.0.0 - Initial Release"
```
