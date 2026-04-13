#!/usr/bin/env node
/**
 * repair-slugs.js
 * Fixes skill files that were rewritten without slug/tab/domain fields.
 * Derives missing fields from file path and name field.
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');

// Featured skills by slug
const FEATURED_SLUGS = new Set([
  // Universal / top skills
  'code-review', 'tdd-workflow', 'debugging-detective', 'codebase-onboarding',
  'git-workflow-mastery', 'security-review', 'summarize-anything',
  'documentation-lookup', 'context-budget', 'api-design', 'deployment-patterns',
  'refactoring-patterns', 'rag-patterns', 'prompt-engineering',
  'youtube-script', 'email-writer', 'competitor-research',
  'weekly-review', 'personal-finance-report', 'data-report-generator',
  'voice-dna', 'linkedin-post-generator', 'business-case-builder',
  'skill-creator-guide', 'agent-builder-starter', 'ai-news-briefing',
  // Business
  'niyam-pattern-explained', 'your-first-copilot-studio-agent', 'mcp-fundamentals',
  'agent-first-thinking', 'agentic-erp-intro', 'multi-agent-orchestration',
  'd365-record-to-report', 'inventory-reorder-advisor',
]);

// Domain mapping by folder
const DOMAIN_MAP = {
  'copilot-studio': 'copilot-studio',
  'd365-fno': 'd365-fno',
  'enterprise-ai': 'enterprise-ai',
  'supply-chain': 'supply-chain',
  'mcp': 'mcp',
  'power-platform': 'power-platform',
  'content-business': 'content-business',
  'industry-verticals': 'industry-verticals',
  'automotive': 'industry-verticals',
  'manufacturing-discrete': 'industry-verticals',
  'manufacturing-process': 'industry-verticals',
  'healthcare': 'industry-verticals',
  'financial-services': 'industry-verticals',
  'distribution-logistics': 'industry-verticals',
  'energy-utilities': 'industry-verticals',
  'professional-services': 'industry-verticals',
  'public-sector': 'industry-verticals',
  'retail': 'industry-verticals',
  'software-engineering': 'software-engineering',
  'ai-agent-dev': 'ai-agent-dev',
  'frontend': 'frontend',
  'backend-data': 'backend-data',
  'content-creation': 'content-creation',
  'productivity': 'productivity',
  'language-specific': 'language-specific',
  'security': 'security',
  'devops': 'devops',
};

// Industry vertical from folder
const VERTICAL_MAP = {
  'automotive': 'automotive',
  'manufacturing-discrete': 'manufacturing-discrete',
  'manufacturing-process': 'manufacturing-process',
  'healthcare': 'healthcare',
  'financial-services': 'financial-services',
  'distribution-logistics': 'distribution-logistics',
  'energy-utilities': 'energy-utilities',
  'professional-services': 'professional-services',
  'public-sector': 'public-sector',
  'retail': 'retail',
};

// Difficulty from tags field
function inferDifficulty(content) {
  if (content.includes('beginner') || content.includes('starter')) return 'starter';
  if (content.includes('advanced')) return 'advanced';
  return 'intermediate';
}

// Minimal YAML parser for existing frontmatter fields
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const raw = match[1];
  const meta = {};
  raw.split('\n').forEach(line => {
    const kv = line.match(/^([\w_-]+)\s*:\s*(.*)/);
    if (kv) {
      const v = kv[2].trim().replace(/^["']|["']$/g, '');
      meta[kv[1]] = v;
    }
  });
  return { meta, body: content.slice(match[0].length), raw };
}

function slugFromFilename(filename) {
  return filename.replace('.md', '').toLowerCase().replace(/_/g, '-');
}

function getDomainFromPath(relPath) {
  const parts = relPath.split('/');
  // parts[0] = personal|business, parts[1] = category, parts[2]? = subcategory
  for (let i = parts.length - 2; i >= 0; i--) {
    const p = parts[i];
    if (DOMAIN_MAP[p]) return DOMAIN_MAP[p];
  }
  return parts[1] || 'productivity';
}

function getVerticalFromPath(relPath) {
  const parts = relPath.split('/');
  for (const p of parts) {
    if (VERTICAL_MAP[p]) return VERTICAL_MAP[p];
  }
  return null;
}

function walkMd(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) results.push(...walkMd(full));
    else if (e.name.endsWith('.md') && !e.name.includes('-example')) results.push(full);
  }
  return results;
}

const allFiles = walkMd(SKILLS_DIR);
let repaired = 0;
let skipped = 0;

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Skip files that already have slug
  if (content.includes('\nslug:')) {
    skipped++;
    continue;
  }

  // Skip files with no frontmatter
  if (!content.startsWith('---')) {
    skipped++;
    continue;
  }

  const parsed = parseFrontmatter(content);
  if (!parsed) { skipped++; continue; }

  const { meta, body } = parsed;

  const filename = path.basename(filePath);
  const relPath = path.relative(SKILLS_DIR, filePath).replace(/\\/g, '/');
  const parts = relPath.split('/');
  const tab = parts[0]; // 'personal' or 'business'
  const slug = slugFromFilename(filename);
  const domain = getDomainFromPath(relPath);
  const vertical = getVerticalFromPath(relPath);
  const difficulty = inferDifficulty(content);
  const isFeatured = FEATURED_SLUGS.has(slug);

  // Build new frontmatter preserving existing fields + adding missing ones
  const name = meta.name || slug;
  const description = meta.description || `${name} skill`;
  const version = meta.version || '1.1.0';
  const author = meta.author || 'ragnar';
  const requires = meta.requires || 'None';

  // Extract tags from existing tags field or infer
  let tags = [];
  if (meta.tags) {
    const tagStr = meta.tags.replace(/[\[\]]/g, '');
    tags = tagStr.split(',').map(t => t.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  }

  const newFrontmatter = [
    '---',
    `name: "${name}"`,
    `slug: "${slug}"`,
    `description: "${description.replace(/"/g, '\\"')}"`,
    `tab: "${tab}"`,
    `domain: "${domain}"`,
    `industry_vertical: ${vertical ? '"' + vertical + '"' : 'null'}`,
    `difficulty: "${difficulty}"`,
    `source_type: "ragnar-custom"`,
    tags.length > 0 ? `tags: [${tags.map(t => '"' + t + '"').join(', ')}]` : `tags: ["${domain}", "${difficulty}"]`,
    `version: "${version}"`,
    `icon_emoji: "⚡"`,
    `is_coming_soon: false`,
    `is_featured: ${isFeatured}`,
    `author: "${author}"`,
    `learning_path: null`,
    `learning_path_position: null`,
    `prerequisites: []`,
    `references: []`,
    `requires: "${requires}"`,
    `mcp_tools: []`,
    '---',
  ].join('\n');

  const newContent = newFrontmatter + '\n' + body;
  fs.writeFileSync(filePath, newContent);
  repaired++;
}

console.log(`✅ Repaired: ${repaired} skills`);
console.log(`⏭  Skipped (already had slug): ${skipped}`);
