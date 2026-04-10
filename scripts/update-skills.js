#!/usr/bin/env node
/**
 * update-skills.js
 * Updates all skill files to version 1.0.1, adds `requires` and `mcp_tools` fields,
 * and adds structured sections (Triggers, Examples, Troubleshooting) if missing.
 *
 * Run: node scripts/update-skills.js
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');

// MCP requirements by domain
const REQUIRES_MAP = {
  'copilot-studio':       'Copilot Studio VS Code Extension',
  'd365-fno':             'D365 F&O MCP Server',
  'mcp':                  'Node.js TypeScript SDK',
  'power-platform':       'Dataverse MCP, Power Automate',
  'enterprise-ai':        'Copilot Studio, Dataverse MCP',
  'supply-chain':         'D365 F&O MCP Server',
  'industry-verticals':   'D365 F&O MCP Server',
  'software-engineering': 'None',
  'ai-agent-dev':         'Claude API',
  'frontend':             'None (Figma MCP optional)',
  'backend-data':         'None',
  'content-creation':     'fal.ai MCP or OpenRouter',
  'productivity':         'Exa MCP, Firecrawl MCP',
  'language-specific':    'None',
  'security':             'None',
  'devops':               'Azure CLI, Docker',
  'content-business':     'None',
};

const MCP_TOOLS_MAP = {
  'copilot-studio':       ['copilot-studio:manage-agent', 'copilot-studio:validate', 'copilot-studio:chat-directline'],
  'd365-fno':             ['d365-fno-mcp', 'dataverse-mcp'],
  'mcp':                  ['mcp-server-sdk'],
  'power-platform':       ['dataverse-mcp', 'power-automate'],
  'enterprise-ai':        ['copilot-studio-mcp', 'dataverse-mcp', 'd365-fno-mcp'],
  'supply-chain':         ['d365-fno-mcp'],
  'industry-verticals':   ['d365-fno-mcp'],
  'software-engineering': [],
  'ai-agent-dev':         ['claude-api'],
  'frontend':             ['playwright-mcp', 'figma-mcp'],
  'backend-data':         [],
  'content-creation':     ['fal-ai-mcp', 'openrouter'],
  'productivity':         ['exa-mcp', 'firecrawl-mcp'],
  'language-specific':    [],
  'security':             [],
  'devops':               ['azure-cli'],
  'content-business':     [],
};

// Minimal YAML frontmatter parser
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { meta: {}, body: content, raw: '' };
  const raw = match[1];
  const body = content.slice(match[0].length);
  const meta = {};
  const lines = raw.split('\n');
  let currentKey = null;
  let listBuffer = [];
  let inList = false;

  for (const line of lines) {
    if (line.match(/^\s+-\s+/)) {
      listBuffer.push(line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, ''));
      inList = true;
      continue;
    }
    const kv = line.match(/^([\w_-]+)\s*:\s*(.*)/);
    if (kv) {
      if (inList && currentKey) { meta[currentKey] = listBuffer; listBuffer = []; inList = false; }
      currentKey = kv[1];
      const v = kv[2].trim();
      if (v === '' || v === null) { meta[currentKey] = null; inList = false; }
      else if (v === 'true') meta[currentKey] = true;
      else if (v === 'false') meta[currentKey] = false;
      else if (v === 'null' || v === '~') meta[currentKey] = null;
      else if (!isNaN(v) && v !== '') meta[currentKey] = Number(v);
      else { meta[currentKey] = v.replace(/^["']|["']$/g, ''); inList = false; }
    }
  }
  if (inList && currentKey) meta[currentKey] = listBuffer;
  return { meta, body, raw };
}

function serializeFrontmatter(meta) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(meta)) {
    if (v === null || v === undefined) {
      lines.push(`${k}: null`);
    } else if (typeof v === 'boolean') {
      lines.push(`${k}: ${v}`);
    } else if (typeof v === 'number') {
      lines.push(`${k}: ${v}`);
    } else if (Array.isArray(v)) {
      if (v.length === 0) {
        lines.push(`${k}: []`);
      } else {
        lines.push(`${k}:`);
        v.forEach(item => {
          if (typeof item === 'object') {
            lines.push(`  - title: "${item.title || ''}"`);
            lines.push(`    url: "${item.url || ''}"`);
          } else {
            lines.push(`  - "${item}"`);
          }
        });
      }
    } else {
      // String — quote if contains special chars
      const str = String(v);
      if (str.includes(':') || str.includes('#') || str.startsWith('{') || str.startsWith('[')) {
        lines.push(`${k}: "${str.replace(/"/g, '\\"')}"`);
      } else {
        lines.push(`${k}: ${str}`);
      }
    }
  }
  lines.push('---');
  return lines.join('\n');
}

function buildTriggersSection(meta) {
  const name = meta.name || 'this skill';
  const domain = meta.domain || '';
  const tab = meta.tab || 'personal';

  if (tab === 'business' && domain === 'd365-fno') {
    return `\n## Trigger Phrases\n\n- "How do I ${name.toLowerCase()}"\n- "Help me with ${name.toLowerCase()} in D365"\n- "Check ${name.toLowerCase()}"\n- "Analyze ${name.toLowerCase()}"\n- "Show me ${name.toLowerCase()} status"\n`;
  }
  return `\n## Trigger Phrases\n\n- "Help me with ${name.toLowerCase()}"\n- "${name}"\n- "How do I ${name.toLowerCase()}"\n`;
}

function buildExampleSection(meta) {
  return `\n## Quick Example\n\n> See \`${meta.slug}-example.md\` in this folder for a full worked scenario with business impact.\n`;
}

function buildTroubleshootingSection() {
  return `\n## Troubleshooting\n\n| Issue | Cause | Fix |\n|---|---|---|\n| Unexpected output | Unclear input | Add more specific context to your prompt |\n| Skill not triggering | Wrong trigger phrase | Use the exact trigger phrases listed above |\n\n`;
}

function buildVersionHistory(currentVersion) {
  const today = new Date().toISOString().split('T')[0];
  return `\n## Version History\n| Version | Date | Changes |\n|---|---|---|\n| ${currentVersion} | ${today} | Updated format, added triggers, examples, troubleshooting |\n| 1.0.0 | 2026-04-09 | Initial skill definition |\n`;
}

// Walk all skill .md files (exclude example files)
function walkMd(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMd(full));
    } else if (entry.name.endsWith('.md') && !entry.name.includes('-example')) {
      results.push(full);
    }
  }
  return results;
}

const allFiles = walkMd(SKILLS_DIR);
let updated = 0;
let skipped = 0;

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { meta, body } = parseFrontmatter(content);

  if (!meta.slug) { skipped++; continue; }

  const domain = meta.domain || '';
  const newVersion = '1.0.1';

  // Update fields
  meta.version = newVersion;
  if (!meta.requires) meta.requires = REQUIRES_MAP[domain] || 'None';
  if (!meta.mcp_tools) {
    const tools = MCP_TOOLS_MAP[domain] || [];
    meta.mcp_tools = tools;
  }
  // is_coming_soon should always be false now
  meta.is_coming_soon = false;

  // Add sections to body if missing
  let newBody = body;
  if (!newBody.includes('## Trigger') && !newBody.includes('## When to Use')) {
    newBody += buildTriggersSection(meta);
  }
  if (!newBody.includes('## Quick Example') && !newBody.includes('## Example')) {
    newBody += buildExampleSection(meta);
  }
  if (!newBody.includes('## Troubleshooting')) {
    newBody += buildTroubleshootingSection();
  }
  if (!newBody.includes('## Version History')) {
    newBody += buildVersionHistory(newVersion);
  }

  const newContent = serializeFrontmatter(meta) + '\n' + newBody;
  fs.writeFileSync(filePath, newContent);
  updated++;
}

console.log(`✅ Updated ${updated} skills to v1.0.1`);
console.log(`⚠️  Skipped ${skipped} files (no slug)`);