#!/usr/bin/env node
// The Spine Manifest generator — ONE source, three machine-discovery surfaces.
//
// Reads every skill's SKILL.md front-matter contract (name, description,
// visibility, triggers, next-skills) + extracts gate/rule facts LIVE from each
// protocol.yon, and emits, in one pass:
//
//   catalog.yon   YON-primary machine catalog (one @META record per skill).
//                 The index is itself a YON document — validates against the
//                 public @younndai/yon-parser like every protocol here.
//   catalog.json  Derived courtesy view for non-YON consumers / registries.
//   llms.txt      Dense agent/LLM manifest: about-the-pack + about-YON + an
//                 explicit "For agents — how to install" recipe + one line/skill.
//
// Provenance (license + attribution + trademark) is WELDED into every record so
// attribution survives a strip-and-fork. Generated from the front-matter contract
// enforced by tools/lint.mjs (checks 7+8) — so the catalog cannot silently lie.
//
// Usage:
//   node tools/spine.mjs            (re)generate catalog.yon + catalog.json + llms.txt
//   node tools/spine.mjs --check    generate in memory, diff vs on-disk, exit 1 on drift (CI gate)
//
// The drift check normalizes the volatile @STAMP/generated date out before
// comparing, so a day change alone never trips the gate.
//
// Zero npm deps — a hand-written front-matter + YON-record reader, matching the
// zero-dep approach of tools/conformance.mjs and tools/yon-dag.mjs.

import { readdirSync, existsSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SKILLS = 'skills';
const LICENSE = 'Apache-2.0';
const SRC = 'github.com/allemaar/open-skills';
const ATTRIBUTION =
  'open-skills by Alexandru Mares (allemaar.com). Apache-2.0. Not a YounndAI product; YON and YounndAI are trademarks of MARLINK TRADING SRL.';
const RUNTIME_DIRS = ['~/.claude/skills', '~/.codex/skills', '~/.agents/skills'];

// --- front-matter reader (zero-dep, no YAML lib) ----------------------------

function frontMatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}
// Lines of the block that follows `key:` — every line more-indented than the key,
// up to the next top-level `word:` key or end of front-matter.
function blockAfter(fm, key) {
  const lines = fm.split(/\r?\n/);
  const i = lines.findIndex((l) => new RegExp(`^${key.replace(/-/g, '\\-')}:`).test(l));
  if (i < 0) return null;
  const out = [];
  for (let j = i + 1; j < lines.length; j++) {
    if (/^\S/.test(lines[j])) break; // next top-level key
    out.push(lines[j]);
  }
  return { headRest: lines[i].slice(lines[i].indexOf(':') + 1).trim(), body: out };
}
function unquote(s) {
  const t = (s || '').trim();
  return t.replace(/^["'](.*)["']$/s, '$1');
}
// A scalar that may be plain, quoted, or a folded/literal block (`>` / `|`).
function scalar(fm, key) {
  const b = blockAfter(fm, key);
  if (!b) return null;
  if (b.headRest && b.headRest !== '>' && b.headRest !== '|') return unquote(b.headRest);
  const joined = b.body.map((l) => l.trim()).filter(Boolean).join(' ').trim();
  return joined || null;
}
function hasKey(fm, key) {
  return new RegExp(`^${key.replace(/-/g, '\\-')}:`, 'm').test(fm);
}
// A simple list: `key:` then `  - item` lines (items may be quoted). The inline
// `key: [a, b]` form is intentionally NOT parsed — a naive comma-split corrupts a
// quoted value containing a comma; every skill uses the block form, so require it.
function simpleList(fm, key) {
  const b = blockAfter(fm, key);
  if (!b) return [];
  return b.body
    .map((l) => l.match(/^\s*-\s+(.*)$/))
    .filter(Boolean)
    .map((m) => unquote(m[1]));
}
// next-skills: list of { skill, phrase, why } objects.
function nextSkills(fm) {
  const b = blockAfter(fm, 'next-skills');
  if (!b) return [];
  const text = b.body.join('\n');
  const items = [];
  for (const chunk of text.split(/^\s*-\s+skill:/m).slice(1)) {
    const skill = (chunk.match(/^\s*([^\n]+)/) || [, ''])[1].trim().replace(/^["']|["']$/g, '');
    const phrase = (chunk.match(/phrase:\s*(.+)/) || [, ''])[1].trim().replace(/^["']|["']$/g, '');
    const why = (chunk.match(/why:\s*(.+)/) || [, ''])[1].trim().replace(/^["']|["']$/g, '');
    if (skill) items.push({ skill, phrase, why });
  }
  return items;
}

// --- protocol.yon reader (facts extracted LIVE, not from front-matter) ------

function yonField(line, key) {
  const m = line.match(new RegExp(`\\b${key}=("([^"]*)"|[^|\\s]+)`));
  return m ? (m[2] !== undefined ? m[2] : m[1]) : null;
}
function readProtocol(file) {
  if (!existsSync(file)) return null;
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  const out = { profile: 'exec', kind: 'skill', gates: [], rules: [], steps: 0, goal: null };
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('@DOC')) {
      out.profile = yonField(t, 'profile') || out.profile;
      out.kind = yonField(t, 'kind') || out.kind;
    } else if (t.startsWith('@INTENT')) {
      out.goal = yonField(t, 'goal');
    } else if (t.startsWith('@CHECK')) {
      const rid = (yonField(t, 'rid') || '').replace(/^(check|chk):/, '');
      const fail = yonField(t, 'fail');
      if (rid && fail) out.gates.push(`${rid}=${fail}`);
    } else if (t.startsWith('@RULE')) {
      const rid = (yonField(t, 'rid') || '').replace(/^rule:/, '');
      const lvl = yonField(t, 'lvl');
      if (rid && lvl) out.rules.push(`${rid}=${lvl}`);
    } else if (t.startsWith('@STEP')) {
      out.steps++;
    }
  }
  return out;
}

// --- collect every skill ----------------------------------------------------

function collect() {
  const names = readdirSync(SKILLS)
    .filter((n) => existsSync(join(SKILLS, n, 'SKILL.md')))
    .sort();
  return names.map((name) => {
    const fm = frontMatter(readFileSync(join(SKILLS, name, 'SKILL.md'), 'utf8'));
    const proto = readProtocol(join(SKILLS, name, 'protocol.yon'));
    return {
      name,
      description: scalar(fm, 'description') || '',
      visibility: scalar(fm, 'visibility') || 'public',
      triggers: simpleList(fm, 'triggers'),
      nextSkills: nextSkills(fm),
      hasProtocol: !!proto,
      profile: proto ? proto.profile : null,
      gates: proto ? proto.gates : [],
      rules: proto ? proto.rules : [],
      steps: proto ? proto.steps : 0,
      install: {
        copy: `cp -r ${SKILLS}/${name} <runtime>/skills/${name}`,
        validate: proto
          ? `npx @younndai/yon-parser validate <runtime>/skills/${name}/protocol.yon --profile ${proto.profile}`
          : null,
      },
      license: LICENSE,
      attribution: ATTRIBUTION,
    };
  });
}

// --- emit catalog.yon -------------------------------------------------------

// Sanitize a value for a YON double-quoted string: no quote (ends string), no
// pipe (field separator), single line. Full fidelity lives in catalog.json.
function yq(s) {
  return String(s || '').replace(/"/g, "'").replace(/\|/g, '/').replace(/\s+/g, ' ').trim();
}
function firstSentence(s) {
  const m = String(s || '').match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : String(s || '')).trim();
}

function emitYon(skills, stampDay) {
  const L = [];
  L.push(
    `@DOC ver=2.0 | id=open-skills-catalog | title="open-skills — machine catalog" | kind=catalog | profile=full | fmt=min | license="${LICENSE}" | guide="https://yon.younndai.com/yon-guide.txt"`
  );
  L.push(
    `@INTENT goal="Machine-readable catalog of the open-skills pack — one record per skill — for agent and registry discovery and install. Generated by tools/spine.mjs from each skill's SKILL.md front-matter contract plus live protocol.yon facts."`
  );
  L.push(`@STAMP ts:ts=${stampDay} | src=tool | method=generated | scope="tools/spine.mjs"`);
  L.push(`@NOTE text="${yq(ATTRIBUTION)} Generated — do not edit by hand; run tools/spine.mjs."`);
  L.push(`@SEC name="skills"`);
  for (const s of skills) {
    const fields = [
      `@META id=${s.name}`,
      `visibility=${s.visibility}`,
      `protocol=${s.hasProtocol ? 'yes' : 'no'}`,
      `profile=${s.profile || 'none'}`,
      `description="${yq(s.description)}"`,
      `triggers="${yq(s.triggers.join('; '))}"`,
      `gates="${yq(s.gates.join('; '))}"`,
      `rules="${yq(s.rules.join('; '))}"`,
      `next="${yq(s.nextSkills.map((n) => n.skill).join('; '))}"`,
      `install="${yq(s.install.copy)}"`,
      `license="${LICENSE}"`,
      `src="${SRC}"`, // per-record provenance: a lifted line is still self-attributing (strip-fork defense)
    ];
    L.push(fields.join(' | '));
  }
  return L.join('\n') + '\n';
}

// --- emit catalog.json ------------------------------------------------------

function emitJson(skills, stampDay) {
  return (
    JSON.stringify(
      {
        $schema: 'https://yon.younndai.com/open-skills-catalog.schema.json',
        name: 'open-skills',
        homepage: 'https://allemaar.com',
        repository: 'https://github.com/allemaar/open-skills',
        generated: stampDay,
        generator: 'tools/spine.mjs',
        license: LICENSE,
        attribution: ATTRIBUTION,
        runtimeDirs: RUNTIME_DIRS,
        count: skills.length,
        dualDoc: skills.filter((s) => s.hasProtocol).length,
        install:
          'Copy a skill folder into your runtime skills dir (copy-default, not symlink), then validate its protocol.yon with @younndai/yon-parser. See llms.txt for the agent recipe.',
        skills,
      },
      null,
      2
    ) + '\n'
  );
}

// --- emit llms.txt ----------------------------------------------------------

function emitLlms(skills) {
  const dual = skills.filter((s) => s.hasProtocol).length;
  const L = [];
  L.push('# open-skills');
  L.push('');
  L.push(
    `> Reusable, inspectable skills for AI coding agents (Claude Code, Codex, any runtime that reads the open Agent Skills format). Each skill is a folder under skills/ with a SKILL.md (plain-language what/when) and, for ${dual} of ${skills.length}, a protocol.yon — a declarative, machine-validatable contract of its steps, rules, and gates. Apache-2.0. Read before you trust: nothing executes that you cannot read first.`
  );
  L.push('');
  L.push('## About YON');
  L.push(
    'The protocol.yon files are written in YON (https://github.com/YounndAI/yon), a stream-first data format for AI-agent workflows with a public spec (https://github.com/YounndAI/yon-spec) and an Apache-2.0 reference parser (@younndai/yon-parser). YON is what makes each skill auditable: its rules (MUST / MUST_NOT) and gates (ABORT / WARN) are named, typed objects, not prose.'
  );
  L.push('');
  L.push('## For agents — how to install');
  L.push('No build step, no opaque installer. To install a skill on the user\'s machine:');
  L.push('1. Enumerate skills from catalog.json (repo root) — each record carries name, description, triggers, gates, and install commands.');
  L.push(`2. Detect the user's runtime skills dir — use whichever exists: ${RUNTIME_DIRS.join(' | ')}.`);
  L.push('3. COPY the skill folder (copy-default, never symlink): `cp -r skills/<name> <runtime>/skills/<name>` (Windows PowerShell: `Copy-Item -Recurse skills/<name> <runtime>/skills/<name>`).');
  L.push('4. If it ships a protocol.yon, validate it: `npx @younndai/yon-parser validate <runtime>/skills/<name>/protocol.yon --profile <profile>` (profile is in catalog.json).');
  L.push('That is the whole install: copy a readable folder, validate its declarative contract. No code runs on faith.');
  L.push('');
  L.push('## Skills');
  for (const s of skills) {
    const trg = s.triggers.length ? ` — triggers: ${s.triggers.slice(0, 4).join(', ')}` : '';
    const tag = s.hasProtocol ? ' [protocol.yon]' : ' [md-only]';
    L.push(`- ${s.name}${tag} — ${firstSentence(s.description)}${trg}`);
  }
  L.push('');
  L.push('---');
  L.push(ATTRIBUTION);
  return L.join('\n') + '\n';
}

// --- emit skills.graph.yon --------------------------------------------------
// The next-skills field rendered as a directed recommendation graph — the
// in-agent recommender (install one skill, it routes you to its successors).

function emitGraph(skills, stampDay) {
  const L = [];
  let edges = 0;
  L.push(
    `@DOC ver=2.0 | id=open-skills-graph | title="open-skills — next-skills recommendation graph" | kind=graph | profile=full | fmt=min | license="${LICENSE}" | guide="https://yon.younndai.com/yon-guide.txt"`
  );
  L.push(
    `@INTENT goal="Directed recommendation graph — each edge is skill -> a successor a caller would naturally run next; the in-agent recommender that compounds installs. Generated by tools/spine.mjs from each SKILL.md next-skills field."`
  );
  L.push(`@STAMP ts:ts=${stampDay} | src=tool | method=generated | scope="tools/spine.mjs"`);
  L.push(`@NOTE text="${yq(ATTRIBUTION)} Generated — do not edit by hand; run tools/spine.mjs."`);
  L.push(`@SEC name="nodes"`);
  for (const s of skills) {
    const outs = s.nextSkills.map((n) => n.skill);
    edges += outs.length;
    L.push(`@META id=${s.name} | out="${yq(outs.join('; '))}" | degree=${outs.length} | license="${LICENSE}" | src="${SRC}"`);
  }
  const terminal = skills.filter((s) => s.nextSkills.length === 0).length;
  L.push(`@SEC name="stats"`);
  L.push(`@NOTE text="nodes=${skills.length} edges=${edges} coverage=${skills.length - terminal}/${skills.length} terminal=${terminal}"`);
  return L.join('\n') + '\n';
}

// --- driver -----------------------------------------------------------------

// Normalize before --check compares: make it EOL-agnostic (a CRLF checkout must
// not read as drift) and strip the volatile date. Both date regexes are ANCHORED
// to line start so they can never rewrite a field value that merely contains the
// literal token.
function normalize(s) {
  return s
    .replace(/\r\n/g, '\n')
    .replace(/^@STAMP ts:ts=[0-9T:.\-+Z]+/gm, '@STAMP ts:ts=<DATE>')
    .replace(/^(\s*)"generated":\s*"[^"]*"/gm, '$1"generated": "<DATE>"');
}

function main() {
  const check = process.argv.includes('--check');
  const skills = collect();
  const stampDay = new Date().toISOString().slice(0, 10);

  const outputs = {
    'catalog.yon': emitYon(skills, stampDay),
    'catalog.json': emitJson(skills, stampDay),
    'llms.txt': emitLlms(skills),
    'skills.graph.yon': emitGraph(skills, stampDay),
  };

  if (check) {
    let drift = 0;
    for (const [file, content] of Object.entries(outputs)) {
      const cur = existsSync(file) ? readFileSync(file, 'utf8') : '';
      if (normalize(cur) !== normalize(content)) {
        console.log(`DRIFT  ${file} — out of sync; run: node tools/spine.mjs`);
        drift++;
      } else {
        console.log(`ok     ${file}`);
      }
    }
    console.log('='.repeat(56));
    console.log(`spine --check: ${drift === 0 ? 'in sync' : drift + ' file(s) drifted'} across ${skills.length} skills`);
    process.exit(drift === 0 ? 0 : 1);
  }

  for (const [file, content] of Object.entries(outputs)) writeFileSync(file, content);
  console.log(
    `spine: wrote catalog.yon + catalog.json + llms.txt — ${skills.length} skills, ${skills.filter((s) => s.hasProtocol).length} with protocol.yon`
  );
}

main();
