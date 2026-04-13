#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const mustFeature = [
  'code-review', 'tdd-workflow', 'debugging-detective', 'codebase-onboarding',
  'git-workflow-mastery', 'security-review', 'summarize-anything',
  'documentation-lookup', 'context-budget', 'api-design', 'deployment-patterns',
  'refactoring-patterns', 'rag-patterns', 'prompt-engineering',
  'youtube-script', 'email-writer', 'competitor-research',
  'weekly-review', 'personal-finance-report', 'data-report-generator'
];

function walkMd(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkMd(full));
    else if (entry.name.endsWith('.md') && !entry.name.includes('-example')) results.push(full);
  }
  return results;
}

let updated = 0;
walkMd('./skills').forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const slugMatch = content.match(/^slug:\s*["']?([^"'\n]+)/m);
  if (!slugMatch) return;
  const slug = slugMatch[1].trim();
  if (mustFeature.includes(slug) && content.includes('is_featured: false')) {
    const newContent = content.replace('is_featured: false', 'is_featured: true');
    fs.writeFileSync(filePath, newContent);
    console.log('Starred:', slug);
    updated++;
  }
});
console.log('Updated', updated, 'skills to featured');
