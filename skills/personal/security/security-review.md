---
name: "security-review"
slug: "security-review"
description: "Pre-deployment security checklist covering input validation, XSS prevention, SQL injection, authentication, authorization, and dependency vulnerabilities. Use when user says 'security review', 'vulnerability check', 'OWASP', 'prevent XSS', 'SQL injection', 'authentication security'."
tab: "personal"
domain: "security"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "security", "owasp", "code-review"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: true
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "None"
mcp_tools: []
---



# Security Review

Security is not a feature you add at the end. It's a set of disciplines you apply throughout development. This checklist covers the OWASP Top 10 and the issues that appear in most pre-deployment security reviews.

## 1. Input Validation

Never trust data from external sources: HTTP bodies, query params, headers, file uploads.

```typescript
// Bad: using raw user input
const query = req.query.search;
const results = db.query(`SELECT * FROM products WHERE name LIKE '%${query}%'`);

// Good: validate and sanitize
import { z } from 'zod';

const searchSchema = z.object({
  search: z.string().min(1).max(100).regex(/^[a-zA-Z0-9 ]+$/),
  page: z.coerce.number().int().min(1).max(1000).default(1),
});

const { search, page } = searchSchema.parse(req.query);
// Use validated values only
```

**Validation checklist:**
- [ ] All HTTP inputs validated with schema (Zod, Joi, Pydantic, etc.)
- [ ] File uploads: type, size, and content validated (not just extension)
- [ ] URL parameters validated before use
- [ ] Numeric inputs have range checks
- [ ] String inputs have length limits

## 2. SQL Injection Prevention

Use parameterized queries. Always. No exceptions.

```typescript
// Bad: string concatenation into SQL
const userId = req.params.id;
db.query(`SELECT * FROM users WHERE id = '${userId}'`);
// userId = "' OR '1'='1" -> returns all users

// Good: parameterized query
db.query('SELECT * FROM users WHERE id = $1', [userId]);

// With ORM (Prisma example)
const user = await prisma.user.findUnique({
  where: { id: userId }, // Prisma always parameterizes
});
```

## 3. XSS (Cross-Site Scripting) Prevention

```typescript
// Bad: rendering user content directly as HTML
element.innerHTML = userContent;

// Good: use textContent for user data
element.textContent = userContent;

// In React: JSX automatically escapes — never use dangerouslySetInnerHTML
// with user content
<div>{userContent}</div>  // Safe
<div dangerouslySetInnerHTML={{ __html: userContent }} />  // DANGEROUS

// If you must render HTML, sanitize first
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
```

**Response headers (set in every API response):**
```
Content-Security-Policy: default-src 'self'; script-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

## 4. Authentication

```typescript
// Password hashing: use bcrypt or Argon2 (never MD5/SHA1/plain)
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;
const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
const isValid = await bcrypt.compare(plainPassword, hashedPassword);

// JWT: verify signature and expiry on every request
import jwt from 'jsonwebtoken';

function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
      issuer: 'myapp',
    }) as JWTPayload;
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired token');
  }
}
```

**Authentication checklist:**
- [ ] Passwords hashed with bcrypt/Argon2 (cost factor 12+)
- [ ] JWT verified on every request (signature + expiry)
- [ ] Session tokens are cryptographically random (not sequential IDs)
- [ ] Account lockout after N failed attempts
- [ ] Sensitive endpoints require re-authentication

## 5. Authorization (IDOR Prevention)

Authentication checks "who are you." Authorization checks "can you do THIS specific thing."

```typescript
// Bad: only checks if user is logged in
router.get('/orders/:id', authenticate, async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order); // Any authenticated user can access any order!
});

// Good: checks ownership
router.get('/orders/:id', authenticate, async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) return res.status(404).json({ error: 'Not found' });
  
  // Verify this user owns this order
  if (order.userId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  res.json(order);
});
```

**Authorization checklist:**
- [ ] Every resource access checks ownership or role
- [ ] Admin-only endpoints check admin role explicitly
- [ ] Horizontal privilege escalation tested (user A cannot access user B's data)
- [ ] Vertical privilege escalation tested (regular user cannot access admin endpoints)

## 6. Secrets Management

```typescript
// Bad: hardcoded secrets
const apiKey = 'sk_live_abc123def456';
const dbPassword = 'supersecret';

// Bad: committed .env file
// .gitignore must include .env, .env.local, .env.production

// Good: environment variables, never committed
const apiKey = process.env.STRIPE_API_KEY;
if (!apiKey) throw new Error('STRIPE_API_KEY environment variable is required');

// Good: secrets management in production
// AWS Secrets Manager, Azure Key Vault, HashiCorp Vault
```

**Secrets checklist:**
- [ ] `git log -S 'password'` or `gitleaks` scan shows no secrets in history
- [ ] `.env*` files are in `.gitignore`
- [ ] Production secrets are in a secrets manager, not environment variables in code
- [ ] API keys have minimum required permissions (principle of least privilege)
- [ ] Secrets are rotated regularly

## 7. Dependency Vulnerabilities

```bash
# Scan for known vulnerabilities
npm audit          # Node.js
pip-audit          # Python
cargo audit        # Rust
bundle audit       # Ruby

# Update to fix
npm audit fix
```

**Dependency checklist:**
- [ ] `npm audit` (or equivalent) run with no critical/high findings
- [ ] Dependencies locked (package-lock.json, requirements.txt with pinned versions)
- [ ] Automated dependency scanning in CI (Dependabot, Snyk)
- [ ] Unused dependencies removed

## Pre-Deployment Security Checklist

- [ ] Input validation on all endpoints
- [ ] Parameterized queries everywhere (no string concatenation into SQL)
- [ ] XSS prevention (output encoding, CSP headers)
- [ ] Authentication on all protected endpoints
- [ ] Authorization checks for resource ownership
- [ ] No secrets in code or git history
- [ ] Dependency audit passes with no critical/high findings
- [ ] Error messages don't leak internal details to clients
- [ ] Rate limiting on auth endpoints and public APIs
- [ ] HTTPS enforced (no HTTP downgrade)

## Trigger Phrases

- "security review"
- "vulnerability check"
- "OWASP"
- "prevent XSS"
- "SQL injection"
- "authentication security"
- "authorization IDOR"
- "secrets in code"

## Quick Example

> See `security-review-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| IDOR vulnerability (user can access other users' data) | Resource authorization not checking ownership | Add `WHERE user_id = :current_user_id` to every data fetch; never trust the ID in the URL alone |
| SQL injection despite using ORM | Raw query method used for complex queries | Replace `db.raw()` or `db.query(string)` calls with parameterized ORM methods; if raw is needed, use named placeholders |
| Secrets found in git history | Developer committed .env or hardcoded a key | Rotate the exposed secret immediately; use BFG Repo Cleaner to remove from history; add pre-commit hook to scan for secrets |
| XSS despite React's escaping | Using `dangerouslySetInnerHTML` with unfiltered user content | Run content through DOMPurify before passing to `dangerouslySetInnerHTML`; audit all uses of this prop |


## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
