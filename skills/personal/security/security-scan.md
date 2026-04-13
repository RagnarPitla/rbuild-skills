---
name: "security-scan"
slug: "security-scan"
description: "Automated security scanning workflow covering SAST tools, dependency scanning, secrets detection, and container scanning with result prioritization. Use when user says 'security scan', 'SAST scan', 'dependency vulnerabilities', 'secrets detection', 'Semgrep CodeQL', 'npm audit snyk'."
tab: "personal"
domain: "security"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "security", "sast", "semgrep"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "None"
mcp_tools: []
---



# Security Scan

Automated security scanning catches the issues that code review misses: vulnerable dependencies, accidentally committed secrets, and common code vulnerabilities. Run these in CI so nothing ships without being checked.

## Scanning Categories

| Category | What It Finds | Tools |
|---|---|---|
| SAST | Vulnerable code patterns (SQL injection, XSS, hardcoded secrets) | Semgrep, CodeQL, ESLint security rules |
| Dependency scanning | Known CVEs in third-party packages | npm audit, Snyk, OWASP Dependency-Check |
| Secrets detection | API keys, passwords, tokens in code/git history | git-secrets, TruffleHog, Gitleaks |
| Container scanning | Vulnerable base images, misconfigured Docker | Trivy, Grype, Docker Scout |

## SAST: Static Application Security Testing

### Semgrep (recommended for most teams)

```bash
# Install
pip install semgrep

# Run against your codebase
semgrep --config=auto .

# Run specific rule set for your language
semgrep --config=p/typescript .
semgrep --config=p/python .
semgrep --config=p/golang .

# Run OWASP rules specifically
semgrep --config=p/owasp-top-ten .
```

Sample Semgrep output:
```
severity: ERROR
rule: javascript.express.security.audit.xss.raw-html-join.raw-html-join
file: src/api/userController.ts:45
    response.send('<h1>Hello ' + req.query.name + '</h1>');
                              ^^^^^^^^^^^^^^^^^^^^
Message: User-controlled data flows into HTML response without sanitization
```

### CodeQL (GitHub Actions)

```yaml
# .github/workflows/codeql.yml
name: CodeQL Security Scan

on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with:
          languages: javascript, typescript  # or python, go, java
      - uses: github/codeql-action/autobuild@v3
      - uses: github/codeql-action/analyze@v3
```

Results appear in GitHub Security tab as SARIF findings.

## Dependency Scanning

```bash
# Node.js
npm audit
npm audit --json | jq '.vulnerabilities | to_entries[] | select(.value.severity == "critical" or .value.severity == "high")'

# Fix automatically (safe fixes only)
npm audit fix

# Python
pip install pip-audit
pip-audit

# Rust
cargo install cargo-audit
cargo audit

# Go
go install golang.org/x/vuln/cmd/govulncheck@latest
govulncheck ./...
```

### Snyk (cross-language, deeper analysis)

```bash
npm install -g snyk
snyk auth
snyk test           # Test current project
snyk monitor        # Continuous monitoring in Snyk dashboard
snyk test --all-projects  # Monorepo support
```

**Interpreting severity:**
| CVSS Score | Severity | Action |
|---|---|---|
| 9.0-10.0 | Critical | Fix before merge — blocks deploy |
| 7.0-8.9 | High | Fix within 48 hours |
| 4.0-6.9 | Medium | Fix within 2 weeks |
| 0.1-3.9 | Low | Fix in next sprint |

## Secrets Detection

```bash
# Gitleaks — scan git history for secrets
brew install gitleaks
gitleaks detect --source .  # Scan working directory
gitleaks detect --source . --log-opts "--all"  # Scan entire git history

# TruffleHog — deep git history scan
pip install trufflehog
trufflehog git file://. --only-verified

# Pre-commit hook to prevent committing secrets
pip install pre-commit
```

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks
```

**Common secret patterns to watch for:**
- AWS: `AKIA[A-Z0-9]{16}`
- GitHub token: `ghp_[a-zA-Z0-9]{36}`
- Stripe: `sk_live_[a-zA-Z0-9]{24}`
- Generic API key: high-entropy strings next to words like "key", "token", "secret", "password"

## Container Scanning

```bash
# Trivy — scan Docker images
brew install aquasecurity/trivy/trivy
trivy image myapp:latest
trivy image --severity HIGH,CRITICAL myapp:latest

# Scan Dockerfile for misconfigurations
trivy config .

# In CI
trivy image --exit-code 1 --severity CRITICAL myapp:latest
# Exits non-zero if critical vulnerabilities found
```

## CI Pipeline Integration

```yaml
# .github/workflows/security.yml
name: Security Scans

on:
  push:
    branches: [main]
  pull_request:

jobs:
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high
        # Fails if high or critical vulnerabilities found

  secrets-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }  # Full history for secrets scan
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: returntocorp/semgrep-action@v1
        with:
          config: p/owasp-top-ten
```

## Prioritizing Findings

Not all findings need immediate action:

1. **True positives with critical/high severity:** Fix before merge
2. **True positives with medium severity:** Fix in current sprint
3. **False positives:** Add to allowlist with justification comment
4. **Known acceptable risks:** Document in security exceptions log with owner and review date

```bash
# Semgrep: mark a finding as a known false positive
# nosemgrep: rule-id  — suppresses specific rule for this line
const query = buildSafeQuery(input); // nosemgrep: javascript.lang.security.audit.sqli.tainted-sql-string
```

## Trigger Phrases

- "security scan"
- "SAST scan"
- "dependency vulnerabilities"
- "secrets detection"
- "Semgrep CodeQL"
- "npm audit snyk"
- "container scanning"
- "scan for vulnerabilities"

## Quick Example

> See `security-scan-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Too many false positives making SAST noise | Default rules too broad for your codebase | Create a `.semgrepignore` or tune rules; start with `p/owasp-top-ten` which has lower false positive rate than `--config=auto` |
| npm audit blocks CI but no fix available | Vulnerability in a transitive dependency with no patch yet | Use `npm audit --audit-level=critical` to only block on critical; open an issue with the upstream package; track in your security exceptions log |
| Gitleaks finds secrets in test fixtures | Test files contain example/fake credentials | Move test fixtures to a separate file and add it to `.gitleaksignore`; or replace with obviously-fake values like `EXAMPLE_KEY_NOT_REAL` |
| Container scan reports base image vulnerabilities | Using outdated base image like `node:18` | Pin to a minimal, regularly-updated base like `node:22-alpine`; run `trivy image` after each base image update in CI |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
