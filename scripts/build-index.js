#!/usr/bin/env node
/**
 * build-index.js
 * Walks all .md files under skills/, parses YAML frontmatter,
 * and writes skills-index.json to the repo root.
 *
 * Supports two frontmatter formats:
 *   NEW (minimal): name + description + tags: [difficulty, source_type, ...keywords]
 *   OLD (explicit): name + slug + description + tab + domain + difficulty + source_type + tags
 *
 * Tab and domain are always inferred from file path when not explicit.
 *
 * Run: node scripts/build-index.js
 */

const fs = require('fs');
const path = require('path');

const REPO = 'RagnarPitla/rbuild-skills';
const BRANCH = 'main';
const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const OUTPUT_FILE = path.join(__dirname, '..', 'skills-index.json');

// Known tag values that map to structured fields
const DIFFICULTIES  = new Set(['starter', 'intermediate', 'advanced']);
const SOURCE_TYPES  = new Set(['ragnar-custom', 'ragnar-curated', 'ragnar-modified', 'community']);

// Path segment → domain slug
const PATH_TO_DOMAIN = {
  'software-engineering':    'software-engineering',
  'ai-agent-dev':            'ai-agent-dev',
  'frontend':                'frontend',
  'language-specific':       'language-specific',
  'backend-data':            'backend-data',
  'content-creation':        'content-creation',
  'productivity':            'productivity',
  'security':                'security',
  'devops':                  'devops',
  'copilot-studio':          'copilot-studio',
  'd365-fno':                'd365-fno',
  'mcp':                     'mcp',
  'power-platform':          'power-platform',
  'enterprise-ai':           'enterprise-ai',
  'supply-chain':            'supply-chain',
  'content-business':        'content-business',
  'industry-verticals':      'industry-verticals',
};

// ── Minimal YAML frontmatter parser ──────────────────────────────────────────
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const yaml = match[1];
  const result = {};
  const lines = yaml.split('\n');
  let currentKey = null;
  let inList = false;
  let listBuffer = [];

  for (const line of lines) {
    if (line.match(/^\s+-\s+/)) {
      const val = line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, '');
      if (currentKey === 'references') {
        listBuffer.push(line);
      } else {
        listBuffer.push(val);
      }
      inList = true;
      continue;
    }

    const kvMatch = line.match(/^(\w[\w_-]*)\s*:\s*(.*)/);
    if (kvMatch) {
      if (inList && currentKey) {
        result[currentKey] = currentKey === 'references'
          ? parseReferencesList(listBuffer)
          : listBuffer;
        listBuffer = [];
        inList = false;
      }

      currentKey = kvMatch[1];
      const rawVal = kvMatch[2].trim();

      // Inline array: tags: [a, b, c]
      if (rawVal.startsWith('[') && rawVal.endsWith(']')) {
        result[currentKey] = rawVal
          .slice(1, -1)
          .split(',')
          .map(v => v.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
        inList = false;
      } else if (rawVal === '' || rawVal === null) {
        result[currentKey] = null;
        inList = false;
      } else if (rawVal === 'true')  { result[currentKey] = true;  inList = false; }
      else if (rawVal === 'false') { result[currentKey] = false; inList = false; }
      else if (rawVal === 'null' || rawVal === '~') { result[currentKey] = null; inList = false; }
      else if (!isNaN(rawVal))     { result[currentKey] = Number(rawVal); inList = false; }
      else { result[currentKey] = rawVal.replace(/^["']|["']$/g, ''); inList = false; }
    }
  }

  if (inList && currentKey) {
    result[currentKey] = currentKey === 'references'
      ? parseReferencesList(listBuffer)
      : listBuffer;
  }

  return result;
}

function parseReferencesList(lines) {
  const refs = [];
  let current = {};
  for (const line of lines) {
    const titleMatch = line.match(/title:\s*["']?(.+?)["']?\s*$/);
    const urlMatch   = line.match(/url:\s*["']?(.+?)["']?\s*$/);
    if (titleMatch) { if (current.title) refs.push(current); current = { title: titleMatch[1], url: '' }; }
    if (urlMatch)   { current.url = urlMatch[1]; }
  }
  if (current.title) refs.push(current);
  return refs;
}

// ── Infer tab + domain from file path ────────────────────────────────────────
function inferFromPath(filePath) {
  const rel = path.relative(SKILLS_DIR, filePath).replace(/\\/g, '/');
  const parts = rel.split('/');

  // parts[0] = personal | business
  // parts[1] = domain slug
  // parts[2+] = possible vertical subfolder or file
  const tab    = parts[0] || 'personal';
  const domain = PATH_TO_DOMAIN[parts[1]] || parts[1] || 'software-engineering';

  // Industry vertical: if parts[1] === 'industry-verticals', parts[2] is the vertical
  const vertical = domain === 'industry-verticals' && parts.length > 3
    ? parts[2]
    : null;

  return { tab, domain, vertical };
}

// ── Parse tags array into structured fields ───────────────────────────────────
function parseTags(rawTags) {
  const tags = Array.isArray(rawTags) ? rawTags : [];
  let difficulty  = null;
  let sourceType  = null;
  let isFeatured  = false;
  let isComingSoon = false;
  const displayTags = [];

  for (const tag of tags) {
    const t = String(tag).toLowerCase().trim();
    if (DIFFICULTIES.has(t))  { difficulty = t; continue; }
    if (SOURCE_TYPES.has(t))  { sourceType = t; continue; }
    if (t === 'featured')     { isFeatured = true; continue; }
    if (t === 'coming-soon')  { isComingSoon = true; continue; }
    displayTags.push(t);
  }

  return { difficulty, sourceType, isFeatured, isComingSoon, displayTags };
}

// ── Walk directory ────────────────────────────────────────────────────────────
function walkMd(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMd(fullPath));
    } else if (entry.name.endsWith('.md') && !entry.name.endsWith('-example.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const allFiles = walkMd(SKILLS_DIR);
const skills = [];
let skipped = 0;

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const meta = parseFrontmatter(content);

  if (!meta) {
    console.warn(`⚠️  No frontmatter: ${filePath}`);
    skipped++;
    continue;
  }

  if (!meta.name || !meta.description) {
    console.warn(`⚠️  Missing name/description: ${filePath}`);
    skipped++;
    continue;
  }

  // Infer from path (always authoritative for tab + domain)
  const { tab, domain, vertical } = inferFromPath(filePath);

  // Parse tags for difficulty, source_type, flags, display tags
  const { difficulty, sourceType, isFeatured, isComingSoon, displayTags } = parseTags(meta.tags);

  // Slug: prefer explicit meta.slug, fall back to meta.name, fall back to filename
  const slug = meta.slug
    || (typeof meta.name === 'string' ? meta.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : null)
    || path.basename(filePath, '.md');

  // Explicit fields override inferred (for old-format skills)
  const finalDifficulty  = meta.difficulty  || difficulty  || 'intermediate';
  const finalSourceType  = meta.source_type || sourceType  || 'ragnar-custom';
  const finalFeatured    = meta.is_featured   === true ? true  : isFeatured;
  const finalComingSoon  = meta.is_coming_soon === true ? true : isComingSoon;

  const relPath    = path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/');
  const rawUrl     = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${relPath}`;
  const githubUrl  = `https://github.com/${REPO}/blob/${BRANCH}/${relPath}`;
  const hasExample = fs.existsSync(filePath.replace('.md', '-example.md'));

  skills.push({
    slug,
    name:              meta.name,
    description:       meta.description,
    tab:               meta.tab    || tab,
    domain:            meta.domain || domain,
    industry_vertical: meta.industry_vertical || vertical || null,
    difficulty:        finalDifficulty,
    source_type:       finalSourceType,
    tags:              displayTags,
    version:           meta.version    || '1.0',
    icon_emoji:        meta.icon_emoji || '⚡',
    is_coming_soon:    finalComingSoon,
    is_featured:       finalFeatured,
    author:            meta.author || 'Ragnar Pitla | skill.rbuild.ai',
    has_example:       hasExample,
    file_path:         relPath,
    raw_url:           rawUrl,
    github_url:        githubUrl,
  });
}

const index = {
  generated_at: new Date().toISOString(),
  total: skills.length,
  skills,
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
console.log(`✅ Built skills-index.json — ${skills.length} skills (${skipped} skipped)`);
