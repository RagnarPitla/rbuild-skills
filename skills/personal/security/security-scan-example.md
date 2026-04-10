# Security Scan — Example

## Scenario: Hardcoded API Key Found in a Test File Before the First Open-Source Release

**Who:** Ben Achebe, Developer, open-source MCP tools team
**Where:** TypeScript, Node.js MCP server, GitHub, preparing for first public release
**The Problem:** Ben's team is releasing their first open-source MCP server to GitHub. Before pushing the public repo, they run a security scan. The scan finds a hardcoded Azure AD client secret in `tests/integration/d365-setup.test.ts` committed 3 weeks ago. The file was never in `.gitignore`. The secret is live, active, and grants access to their D365 test environment. It has been in the private repo for 3 weeks, visible to all team members.

**Prerequisites:** `git` installed, `gitleaks` or `trufflehog` for secret scanning. The skill also covers what to do after a secret is found, not just detection.

---

### What You Say to the Agent

> "We're about to release our MCP server to GitHub as open source. Run a security scan on the repo before we push it public. I want to catch any secrets, credentials, or sensitive configuration that shouldn't be in the codebase."

### What the Agent Does

1. **Runs gitleaks against the full Git history:** Executes `gitleaks detect --source . --report-format json --report-path gitleaks-report.json`. The scan checks every commit in history, not just the current working tree. Finds 2 issues: the Azure AD client secret in the test file, and an OData endpoint URL with a query parameter that includes a base64-encoded bearer token from a `curl` test command pasted into a code comment.

2. **Reports the exact exposure scope:** The `git log` for the secret shows it was committed in commit `a3f8c21` 22 days ago and is still present in the current HEAD. The secret was accessible to 4 team members via the private repo during that period. This information is needed to assess whether rotation is required even before the public release.

3. **Issues a rotation-first directive:** Before any code changes, the Azure AD client secret must be rotated. Rotating after the public push is too late if anyone scrapes the history. The agent provides the exact steps: Azure Portal > App Registrations > [app] > Certificates & Secrets > delete the current secret > generate new. This must happen before the repo goes public.

4. **Removes the secret from Git history:** Guides the team through `git filter-repo --path tests/integration/d365-setup.test.ts --invert-paths` to rewrite history. Notes that this is destructive to history and requires a force push, which is appropriate here given the security priority over history preservation.

5. **Finds a .gitignore gap the team missed:** After removing the hard-coded secret, the test file still needs to work. The agent checks `.gitignore` and finds `.env.test` is not ignored. Creates a `.env.test.example` with placeholder values, updates the test to load from `process.env`, and adds `.env.test` to `.gitignore`.

6. **Adds a pre-commit hook via gitleaks:** Installs `gitleaks protect --staged` as a pre-commit hook so future secrets are caught at commit time, not at release time.

### The Business Impact

- **Public credential exposure prevented** — rotation completed and history rewritten before the repo went public; no external exposure occurred
- **Base64 token in code comment found** — this secondary finding was invisible to human review; the base64 encoding made it look like a random string, not a credential
- **Detection moved earlier in the pipeline** — the gitleaks pre-commit hook means secrets are caught in 2 seconds at commit time, not during a manual scan weeks later

### Try It Yourself

> "Run a security scan focused only on the `.claude/` directory and any skill files. I want to know if any skills contain hardcoded API keys, tenant IDs, or URLs that look like they belong to a specific customer. Those should never be in a shared skills library."
