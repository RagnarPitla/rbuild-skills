# VS Code Customization — Example

## Scenario: Setting Up a Shared Developer Environment for a New Team Project

**Who:** Sonia Park, Lead Developer, starting a new Python FastAPI project with a 4-person team. Mixed experience levels, mixed operating systems (2 Mac, 1 Windows, 1 Linux).
**Where:** VS Code, new Python project repository, GitHub.
**The Problem:** Every time someone new joins the team or sets up on a new machine, they spend an hour figuring out which extensions to install, why their formatter is different from everyone else's, and why their editor uses 4-space tabs in one file and 2-space in another. Code reviews are cluttered with whitespace-only diffs because formatter settings differ across machines.

**Prerequisites:** VS Code 1.85+, Python extension from Microsoft, a project repository.

---

### What You Say to the Agent

> "I'm starting a new Python project with a 4-person team. I want everyone to have the same formatter, tab settings, and extensions without each person having to manually configure their VS Code. How do I set this up?"

### What the Agent Does

1. Creates `.vscode/settings.json` in the project root with shared settings: `"editor.tabSize": 4`, `"[python]": { "editor.formatOnSave": true, "editor.defaultFormatter": "ms-python.black-formatter" }`, and `"files.trimTrailingWhitespace": true`.
2. Creates `.vscode/extensions.json` with recommended extensions: `ms-python.python`, `ms-python.black-formatter`, `ms-python.pylint`, `eamodio.gitlens`, and `ms-python.vscode-pylance`.
3. Explains that when teammates open the repository, VS Code shows a notification prompting them to install the recommended extensions with one click.
4. Adds workspace-level snippets in `.vscode/python.code-snippets` with a FastAPI route boilerplate: prefix `route`, body containing the `@router.get` decorator, response model parameter, and async function scaffold with tabstops.
5. Shows Sonia how to verify settings are applied correctly by opening a Python file and confirming the formatter name in the status bar and the tab indicator.
6. Explains the settings hierarchy: the `.vscode/settings.json` committed to the repo overrides each developer's personal user settings for this project only, so no one needs to change their global config.

### The Business Impact

- **Onboarding time:** New developers go from 0 to correct environment in under 2 minutes (clone, open, install recommended extensions, done).
- **Whitespace diffs eliminated:** All developers use Black formatter with the same settings. PRs contain only meaningful code changes.
- **Consistent tab width:** No more mixed 2-space and 4-space files appearing in the same project.

### Try It Yourself

> "Create a VS Code Profile called 'Python Data Science' with dark theme, large font, word wrap on, and a different set of extensions from my default web development profile."
