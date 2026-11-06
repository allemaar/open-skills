// Human skill guides share the catalog inventory and reviewed source fingerprints.
// Editorial content lives in docs/skill-guides.json; tools/spine.mjs owns emission.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const DATA = 'docs/skill-guides.json';
const MODES = {
  'not-prescribed': 'No subagent step prescribed',
  conditional: 'Conditional',
  required: 'Part of the workflow',
};
const FIELDS = ['summary', 'when', 'avoid', 'example', 'steps', 'delegation', 'outputs', 'sources', 'overview', 'position', 'questions', 'working'];
const hashText = (text) => createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex');
const cell = (text) => text.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();

function fail(message) {
  throw new Error(`Skill guides: ${message}`);
}

function validateGuide(name, guide, sourceHashes) {
  if (!guide || FIELDS.some((key) => !Object.hasOwn(guide, key))) fail(`${name}: missing editorial field`);
  for (const key of ['summary', 'example', 'outputs', 'position']) {
    if (typeof guide[key] !== 'string' || !guide[key].trim()) fail(`${name}: empty ${key}`);
  }
  for (const key of ['when', 'avoid', 'steps', 'sources', 'overview', 'working']) {
    if (!Array.isArray(guide[key]) || !guide[key].length || guide[key].some((s) => typeof s !== 'string' || !s.trim())) {
      fail(`${name}: ${key} must contain nonempty strings`);
    }
  }
  if (!Array.isArray(guide.questions) || !guide.questions.length || guide.questions.some((q) => !q || typeof q.question !== 'string' || !q.question.trim() || typeof q.answer !== 'string' || !q.answer.trim())) {
    fail(`${name}: questions require a nonempty question and answer`);
  }
  if (!guide.example.startsWith(`/${name} `)) fail(`${name}: example must use its canonical command`);
  if (!Object.hasOwn(MODES, guide.delegation?.mode) || typeof guide.delegation.detail !== 'string' || !guide.delegation.detail.trim()) {
    fail(`${name}: delegation mode and explanation required`);
  }
  if (!guide.sources.includes(`skills/${name}/SKILL.md`)) fail(`${name}: entrypoint source required`);
  for (const path of guide.sources) {
    if (!/^skills\/[a-z0-9-]+\/[A-Za-z0-9_./-]+$/.test(path) || path.split('/').includes('..')) fail(`${name}: unsafe source path ${path}`);
    if (!existsSync(path)) fail(`${name}: missing source ${path}`);
    const expected = sourceHashes[path];
    if (!expected || expected !== hashText(readFileSync(path, 'utf8'))) {
      fail(`${name}: source changed: ${path}; reconcile the guide before updating its source fingerprint in ${DATA}`);
    }
  }
}

function emitGuide(skill, guide, families) {
  const family = families.find((f) => f.id === skill.family)?.label || skill.family;
  const lines = [
    `# ${skill.name}`,
    '',
    '[All skill guides](../README.md) · [Catalog](../../SKILLS.md)',
    '',
    ...guide.overview.flatMap((paragraph) => [paragraph, '']),
    '## Where it fits',
    '',
    guide.position,
    '',
    `**Family:** ${family}. **Subagents:** ${MODES[guide.delegation.mode]}.`,
    '',
    '## When to use it',
    '',
    ...guide.when.map((s) => `- ${s}`),
    '',
    '## When not to use it',
    '',
    ...guide.avoid.map((s) => `- ${s}`),
    '',
    '## How to use it',
    '',
    'Start with a concrete request. For example:',
    '',
    '```text', guide.example, '```',
    '',
  ];
  if (skill.requiresSkills.length) {
    lines.push(`**Required skills:** ${skill.requiresSkills.map((n) => `[${n}](${n}.md)`).join(', ')}. Install these first.`, '');
  }
  lines.push(
    '## Flow', '', ...guide.steps.map((s, i) => `${i + 1}. ${s}`), '',
    '## Common questions', '', ...guide.questions.flatMap((q) => [`**${q.question}**`, '', q.answer, '']),
    '## It is working when', '', ...guide.working.map((s) => `- ${s}`), '',
    '## Subagents', '', guide.delegation.detail, '',
    'This describes the skill\'s own workflow. Available tools and the runtime\'s permission rules still apply.', '',
    '## What you get', '', guide.outputs, '',
    '## Source and installation', '',
    'The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.', '',
    ...guide.sources.map((path) => `- [${path}](../../${path})`),
    '- [Installation and updates](../installation.md)',
    '', '[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)', '',
  );
  return lines.join('\n');
}

export function emitSkillDocs(skills, families) {
  const data = JSON.parse(readFileSync(DATA, 'utf8'));
  if (data.version !== 1 || !data.guides || !data.sourceHashes) fail(`unsupported or incomplete ${DATA}`);
  const names = skills.map((s) => s.name).sort();
  if (Object.keys(data.guides).sort().join('\n') !== names.join('\n')) fail('editorial inventory differs from the live skill catalog');
  const expectedFiles = new Set(names.map((name) => `${name}.md`));
  if (existsSync('docs/skills')) {
    const stale = readdirSync('docs/skills').filter((name) => name.endsWith('.md') && !expectedFiles.has(name));
    if (stale.length) fail(`retired guide files need an explicit disposition: ${stale.join(', ')}`);
  }
  const outputs = {};
  for (const skill of skills) {
    validateGuide(skill.name, data.guides[skill.name], data.sourceHashes);
    outputs[`docs/skills/${skill.name}.md`] = emitGuide(skill, data.guides[skill.name], families);
  }
  const lines = [
    '# Skill guides', '',
    `These guides cover all **${skills.length} skills**: what each does, where it fits, when to use it, a request to try, its flow, practical questions and signs of a useful result.`, '',
    'I keep these guides alongside the skills to help you choose what fits. Read a guide first, then its linked source for the complete procedure and safeguards. [Install or update a skill](installation.md) or browse the [compact catalog](../SKILLS.md).', '',
    'For shared terms and library boundaries, see the [glossary](../GLOSSARY.md) and [scope](../SCOPE.md).', '',
    'For a task that spans a few steps, start with the [workflow recipes](workflows/README.md). They cover questionnaires, workflow discovery, coauthoring, testing, review evidence, and creating a skill or library. Each names its prerequisites and stopping points.', '',
    'Subagent labels describe the skill\'s own workflow: **No subagent step prescribed** means no separate worker step is defined; **Conditional** depends on the task or selected route; **Part of the workflow** means separate workers or model calls are integral to that route. A label does not grant permission or promise runtime support.', '',
  ];
  for (const family of families) {
    lines.push(`## ${family.label}`, '', '| Skill | What it does | Subagents |', '|---|---|---|');
    for (const skill of skills.filter((s) => s.family === family.id)) {
      const guide = data.guides[skill.name];
      lines.push(`| [${skill.name}](skills/${skill.name}.md) | ${cell(guide.summary)} | ${MODES[guide.delegation.mode]} |`);
    }
    lines.push('');
  }
  lines.push('## Keeping the guides current', '',
    'Edit the relevant entry in `docs/skill-guides.json` after checking its cited sources, then regenerate with `node tools/spine.mjs`. The same command refreshes the catalog. `node tools/spine.mjs --check` checks the inventory, source fingerprints and emitted files. It does not prove that an explanation is accurate; source review remains necessary. See the [maintainer checklist](../CONTRIBUTING.md#maintainer-closeout).', '',
    '[License](../LICENSE) · [Trademark policy](../TRADEMARK.md)', '');
  outputs['docs/README.md'] = lines.join('\n');
  return outputs;
}
