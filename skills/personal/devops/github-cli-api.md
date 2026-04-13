---
name: github-cli-api
description: "Call GitHub REST and GraphQL APIs directly from the terminal. Use when user says 'call the GitHub API', 'bulk close issues', 'get PR reviewers', 'update repo settings', 'paginate all results', 'automate GitHub with scripts'."
tab: github-cli
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [advanced, github-cli, api, automation]
---

# GitHub CLI: Direct API Access

Call GitHub's REST and GraphQL APIs directly using `gh api`, with built-in authentication, pagination, and JSON filtering. The fastest way to automate anything GitHub does not expose through standard commands.

## Triggers

- "Call the GitHub REST API to get repo info"
- "Use GraphQL to fetch all PR reviewers"
- "Bulk close all stale issues"
- "Get all pages of results from the API"
- "Update repo settings programmatically"
- "Automate something the gh commands don't cover"

## How It Works

### REST API Basics

**GET request (default method):**
```bash
gh api repos/{owner}/{repo}
```

The `{owner}` and `{repo}` placeholders are automatically substituted from the current git remote.

**GET with path substitution:**
```bash
gh api repos/microsoft/vscode/releases/latest
```

**Extract specific fields with --jq:**
```bash
gh api repos/{owner}/{repo} --jq '.stargazers_count'
gh api repos/{owner}/{repo} --jq '{name: .name, stars: .stargazers_count, private: .private}'
```

### HTTP Methods

**POST (create):**
```bash
gh api repos/{owner}/{repo}/issues \
  --method POST \
  -f title="Automated issue from CLI" \
  -f body="Created by script" \
  -f "labels[]=bug"
```

**PATCH (update):**
```bash
gh api repos/{owner}/{repo} \
  --method PATCH \
  -f description="Updated description" \
  -F has_wiki=false \
  -F has_projects=false
```

**PUT (replace/upsert):**
```bash
gh api repos/{owner}/{repo}/topics \
  --method PUT \
  -f "names[]=typescript" \
  -f "names[]=ai" \
  -f "names[]=agents"
```

**DELETE:**
```bash
gh api repos/{owner}/{repo}/issues/comments/987654321 --method DELETE
```

### Field Types: -f vs -F

`-f` sends raw string values. `-F` sends typed values (numbers, booleans, null).

```bash
# -f: string values
gh api /repos/{owner}/{repo} --method PATCH -f default_branch="main"

# -F: typed values (boolean, integer)
gh api /repos/{owner}/{repo} --method PATCH -F has_issues=true -F visibility=private
```

Use `-F` when the API expects a non-string type. Sending `"true"` (string) when the API wants `true` (boolean) causes validation errors.

### JSON Body with --input

For complex request bodies, pass JSON via stdin:

```bash
cat <<'EOF' | gh api repos/{owner}/{repo}/labels --method POST --input -
{
  "name": "high-priority",
  "color": "ff0000",
  "description": "Needs immediate attention"
}
EOF
```

### Pagination

**Get all pages of results and combine them:**
```bash
gh api repos/{owner}/{repo}/issues --paginate
```

**Combine paginated arrays into one array with --slurp:**
```bash
gh api repos/{owner}/{repo}/issues --paginate --slurp
```

Without `--slurp`, each page is output as a separate JSON array. With `--slurp`, all pages are merged into one array before output.

**Extract fields across all pages:**
```bash
gh api repos/{owner}/{repo}/issues \
  --paginate \
  --jq '.[] | {number: .number, title: .title, state: .state}'
```

### GraphQL API

**Basic GraphQL query:**
```bash
gh api graphql -f query='
  query {
    viewer {
      login
      name
    }
  }
'
```

**Query with variables:**
```bash
gh api graphql \
  -f query='
    query($owner: String!, $repo: String!, $number: Int!) {
      repository(owner: $owner, name: $repo) {
        pullRequest(number: $number) {
          title
          reviews(last: 10) {
            nodes {
              author { login }
              state
              submittedAt
            }
          }
        }
      }
    }
  ' \
  -f owner="myorg" \
  -f repo="myrepo" \
  -F number=42
```

**Get all PR reviewers and their states:**
```bash
gh api graphql \
  -f query='
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        pullRequests(states: OPEN, first: 50) {
          nodes {
            number
            title
            reviewRequests(first: 10) {
              nodes {
                requestedReviewer {
                  ... on User { login }
                  ... on Team { name }
                }
              }
            }
          }
        }
      }
    }
  ' \
  -f owner="{owner}" \
  -f repo="{repo}" \
  --jq '.data.repository.pullRequests.nodes[] | "\(.number): \(.title)"'
```

## Quick Reference

| Task | Command |
|------|---------|
| GET endpoint | `gh api repos/{owner}/{repo}/endpoint` |
| POST with fields | `gh api <endpoint> --method POST -f key=val` |
| PATCH (update) | `gh api <endpoint> --method PATCH -F bool_field=true` |
| DELETE | `gh api <endpoint> --method DELETE` |
| Extract field | `gh api <endpoint> --jq '.field'` |
| All pages | `gh api <endpoint> --paginate --slurp` |
| GraphQL | `gh api graphql -f query='...'` |
| JSON body | `echo '{}' \| gh api <endpoint> --input -` |

## Common Patterns

### Pattern 1: Bulk Close Stale Issues

```bash
# Get all issues with label "stale" opened more than 60 days ago
STALE_ISSUES=$(gh api repos/{owner}/{repo}/issues \
  --paginate \
  --jq '.[] | select(.labels[].name == "stale") | .number')

# Close each one with a comment
for NUM in $STALE_ISSUES; do
  gh api repos/{owner}/{repo}/issues/$NUM/comments \
    --method POST \
    -f body="Closing as stale. Reopen if still relevant."

  gh api repos/{owner}/{repo}/issues/$NUM \
    --method PATCH \
    -f state=closed \
    -f state_reason=not_planned

  echo "Closed issue #$NUM"
done
```

### Pattern 2: Get All PR Reviewers Across a Repo

```bash
gh api repos/{owner}/{repo}/pulls \
  --paginate \
  --jq '.[] | {
    number: .number,
    title: .title,
    reviewers: [.requested_reviewers[].login],
    review_teams: [.requested_teams[].name]
  }'
```

### Pattern 3: Update Repo Settings Programmatically

```bash
# Enforce squash-only merges and auto-delete branches
gh api repos/{owner}/{repo} \
  --method PATCH \
  -F allow_squash_merge=true \
  -F allow_merge_commit=false \
  -F allow_rebase_merge=false \
  -F delete_branch_on_merge=true \
  -F squash_merge_commit_title="PR_TITLE" \
  -F squash_merge_commit_message="PR_BODY"
```

### Pattern 4: Find All Repos in an Org Matching a Topic

```bash
gh api orgs/myorg/repos \
  --paginate \
  --jq '.[] | select(.topics[] | contains("agent")) | .full_name'
```

## Troubleshooting

**Problem: `{owner}` and `{repo}` placeholders not substituted**
Cause: You are not inside a git repo directory, or the remote is not a GitHub URL.
Fix: Run from inside the repo directory, or replace placeholders with literal values like `repos/myorg/myrepo`.

**Problem: PATCH/POST fails with 422 Unprocessable Entity**
Cause: Wrong field types (sending string `"true"` instead of boolean `true`), or required fields missing.
Fix: Switch from `-f` to `-F` for numeric and boolean fields. Check the API docs for required fields.

**Problem: `--paginate` returns duplicate or malformed data**
Cause: Some endpoints return object responses (not arrays) with embedded lists. `--paginate` expects array responses.
Fix: Add `--slurp` to combine all pages, or use GraphQL with cursor-based pagination for complex endpoints.

**Problem: GraphQL query returns null data with no error**
Cause: The variable types or field names are wrong (GraphQL is case-sensitive).
Fix: Test the query in GitHub's GraphQL Explorer at https://docs.github.com/en/graphql/overview/explorer first.

**Problem: `--method DELETE` returns 401 on repo endpoints**
Cause: Your token lacks admin scope.
Fix: Run `gh auth refresh -s delete_repo` or `gh auth refresh -s admin:repo` for admin-level operations.

## Version History

- **1.0.0** (2026-04-13): Initial release covering REST, GraphQL, pagination, bulk operations, and repo settings
