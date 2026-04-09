#!/usr/bin/env node
/**
 * build-index.js
 * Walks all .md files under skills/, parses YAML frontmatter,
 * and writes skills-index.json to the repo root.
 *
 * Run: node scripts/build-index.js
 */

const fs = require('fs');
const path = require('path');

const REPO = 'RagnarPitla/rbuild-skills';
const BRANCH = 'main';
const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const OUTPUT_FILE = path.join(__dirname, '..', 'skills-index.json');

// Minimal YAML frontmatter parser (no dependencies needed)
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const yaml = match[1];
  const result = {};

  // Parse line by line
  const lines = yaml.split('\n');
  let currentKey = null;
  let inList = false;
  let listBuffer = [];

  for (const line of lines) {
    // List item
    if (line.match(/^\s+-\s+/)) {
      const val = line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, '');
      if (currentKey === 'references') {
        // references items are objects with title/url — handle below
        listBuffer.push(line);
      } else {
        listBuffer.push(val);
      }
      inList = true;
      continue;
    }

    // New key-value
    const kvMatch = line.match(/^(\w[\w_-]*)\s*:\s*(.*)/);
    if (kvMatch) {
      // Save previous list
      if (inList && currentKey) {
        if (currentKey === 'references') {
          result[currentKey] = parseReferencesList(listBuffer);
        } else {
          result[currentKey] = listBuffer;
        }
        listBuffer = [];
        inList = false;
      }

      currentKey = kvMatch[1];
      const rawVal = kvMatch[2].trim();

      if (rawVal === '' || rawVal === null) {
        // Will be filled by list items below
        result[currentKey] = null;
        inList = false;
      } else if (rawVal === 'true') {
        result[currentKey] = true;
      } else if (rawVal === 'false') {
        result[currentKey] = false;
      } else if (rawVal === 'null' || rawVal === '~') {
        result[currentKey] = null;
      } else if (!isNaN(rawVal)) {
        result[currentKey] = Number(rawVal);
      } else {
        result[currentKey] = rawVal.replace(/^["']|["']$/g, '');
        inList = false;
      }
    }
  }

  // Flush final list
  if (inList && currentKey) {
    if (currentKey === 'references') {
      result[currentKey] = parseReferencesList(listBuffer);
    } else {
      result[currentKey] = listBuffer;
    }
  }

  return result;
}

function parseReferencesList(lines) {
  const refs = [];
  let current = {};
  for (const line of lines) {
    const titleMatch = line.match(/title:\s*["']?(.+?)["']?\s*$/);
    const urlMatch = line.match(/url:\s*["']?(.+?)["']?\s*$/);
    if (titleMatch) {
      if (current.title) refs.push(current);
      current = { title: titleMatch[1], url: '' };
    }
    if (urlMatch) {
      current.url = urlMatch[1];
    }
  }
  if (current.title) refs.push(current);
  return refs;
}

// Walk directory recursively, return all .md file paths
function walkMd(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMd(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

// Main
const allFiles = walkMd(SKILLS_DIR);
const skills = [];

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const meta = parseFrontmatter(content);

  if (!meta) {
    console.warn(`⚠️  No frontmatter: ${filePath}`);
    continue;
  }

  // Validate required fields
  const required = ['name', 'slug', 'description', 'tab', 'domain', 'difficulty', 'source_type'];
  const missing = required.filter(f => !meta[f]);
  if (missing.length > 0) {
    console.warn(`⚠️  Missing fields [${missing.join(', ')}]: ${filePath}`);
    continue;
  }

  // Compute relative path and URLs
  const relPath = path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/');
  const rawUrl = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${relPath}`;
  const githubUrl = `https://github.com/${REPO}/blob/${BRANCH}/${relPath}`;

  skills.push({
    slug: meta.slug,
    name: meta.name,
    description: meta.description,
    tab: meta.tab,
    domain: meta.domain,
    industry_vertical: meta.industry_vertical || null,
    difficulty: meta.difficulty,
    source_type: meta.source_type,
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    version: meta.version || '1.0',
    icon_emoji: meta.icon_emoji || '⚡',
    is_coming_soon: meta.is_coming_soon === true,
    is_featured: meta.is_featured === true,
    author: meta.author || 'ragnar',
    learning_path: meta.learning_path || null,
    learning_path_position: meta.learning_path_position || null,
    prerequisites: Array.isArray(meta.prerequisites) ? meta.prerequisites : [],
    references: Array.isArray(meta.references) ? meta.references.filter(r => r.title) : [],
    file_path: relPath,
    raw_url: rawUrl,
    github_url: githubUrl,
  });
}

const index = {
  generated_at: new Date().toISOString(),
  total: skills.length,
  skills,
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
console.log(`✅ Built skills-index.json — ${skills.length} skills`);
