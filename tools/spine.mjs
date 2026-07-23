#!/usr/bin/env node
// The Spine Manifest generator — one deterministic join, human + machine surfaces.
//
// Reads every skill's SKILL.md front-matter contract (name, description,
// visibility, triggers, next-skills), joins the pack-level YON family taxonomy,
// extracts gate/rule facts LIVE from each protocol.yon, and emits in one pass:
//
//   catalog.yon   YON-primary machine catalog (one @META record per skill).
//                 The index is itself a YON document — validates against the
//                 public @younndai/yon-parser like every protocol here.
//   catalog.json  Derived courtesy view for non-YON consumers / registries.
//   llms.txt      Dense agent/LLM manifest grouped by family.
//   SKILLS.md     GitHub-readable human catalog grouped by the same families.
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
const TAXONOMY = join(SKILLS, 'skills-help', 'taxonomy.yon');
const PACK_VERSION = '1.6.4';
const LICENSE = 'Apache-2.0';
const SRC = 'github.com/allemaar/open-skills';
const ATTRIBUTION =
  'open-skills is a personal project by Alexandru Mares (allemaar.com), separate from the YounndAI™ product portfolio. Apache-2.0. YON (YounndAI Object Notation™), Lyt (Link Your Think™), and YounndAI™ are trademarks of MARLINK TRADING SRL.';
const RUNTIME_DIRS = ['~/.claude/skills', '~/.agents/skills', '~/.codex/skills'];
// Which runtime actually reads each dir. These are NOT interchangeable, and the failure
// is silent: copy into a dir the user's runtime doesn't read and there is no error — the
// skill simply never appears. A bare path list can't say that, which is why it must.
const RUNTIME_READS = {
  '~/.claude/skills': 'Claude Code, which reads this dir and no other — it does not read ~/.agents/skills',
  '~/.agents/skills': 'the shared cross-runtime dir — Codex (its current location), Cline, Zed, Warp',
  '~/.codex/skills': 'Codex — its older path, still read for backward compatibility',
};

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

// --- pack-level family taxonomy --------------------------------------------

function readTaxonomy(file) {
  if (!existsSync(file)) throw new Error(`taxonomy missing: ${file}`);
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  const families = [];
  const familyIds = new Set();
  const orders = new Set();
  const assignments = new Map();

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('@CFG id=family:')) {
      const m = line.match(/^@CFG id=family:([a-z0-9-]+) \| set=\[label="([^"]+)",order:int=(\d+),aliases="([^"]*)"\]$/);
      if (!m) throw new Error(`invalid family record: ${line}`);
      const [, id, label, orderText, aliasText] = m;
      const order = Number(orderText);
      if (familyIds.has(id)) throw new Error(`duplicate family id: ${id}`);
      if (orders.has(order)) throw new Error(`duplicate family order: ${order}`);
      familyIds.add(id);
      orders.add(order);
      families.push({ id, label, order, aliases: aliasText.split(',').map((s) => s.trim()).filter(Boolean) });
    } else if (line.startsWith('@MAP name=SkillFamilies')) {
      for (const m of line.matchAll(/"([a-z0-9-]+)"->"([a-z0-9-]+)"/g)) {
        const [, skill, family] = m;
        if (assignments.has(skill)) throw new Error(`duplicate taxonomy assignment: ${skill}`);
        assignments.set(skill, family);
      }
    }
  }

  if (families.length === 0) throw new Error('taxonomy defines no families');
  if (assignments.size === 0) throw new Error('taxonomy defines no skill assignments');
  for (const [skill, family] of assignments) {
    if (!familyIds.has(family)) throw new Error(`taxonomy assigns ${skill} to unknown family ${family}`);
  }
  families.sort((a, b) => a.order - b.order);
  return { families, assignments };
}

// --- collect every skill ----------------------------------------------------

function collect() {
  const names = readdirSync(SKILLS)
    .filter((n) => existsSync(join(SKILLS, n, 'SKILL.md')))
    .sort();
  const taxonomy = readTaxonomy(TAXONOMY);
  const shipped = new Set(names);
  for (const name of names) {
    if (!taxonomy.assignments.has(name)) throw new Error(`taxonomy missing shipped skill: ${name}`);
  }
  for (const name of taxonomy.assignments.keys()) {
    if (!shipped.has(name)) throw new Error(`taxonomy names unshipped skill: ${name}`);
  }
  const skills = names.map((name) => {
    const fm = frontMatter(readFileSync(join(SKILLS, name, 'SKILL.md'), 'utf8'));
    const proto = readProtocol(join(SKILLS, name, 'protocol.yon'));
    const family = taxonomy.assignments.get(name);
    const declaredName = scalar(fm, 'name');
    const description = scalar(fm, 'description');
    const visibility = scalar(fm, 'visibility');
    if (!declaredName) throw new Error(`skill ${name} has missing or empty front-matter name`);
    if (declaredName !== name) throw new Error(`skill ${name} declares front-matter name ${declaredName}`);
    if (!description) throw new Error(`skill ${name} has missing or empty front-matter description`);
    if (visibility !== 'public') throw new Error(`skill ${name} must declare visibility=public`);
    return {
      name: declaredName,
      family,
      familyLabel: taxonomy.families.find((f) => f.id === family).label,
      description,
      visibility,
      triggers: simpleList(fm, 'triggers'),
      nextSkills: nextSkills(fm),
      hasProtocol: !!proto,
      profile: proto ? proto.profile : null,
      gates: proto ? proto.gates : [],
      rules: proto ? proto.rules : [],
      steps: proto ? proto.steps : 0,
      install: {
        copy: `cp -r ${SKILLS}/${name} <skills-dir>/${name}`,
        validate: proto
          ? `npx @younndai/yon-parser validate <skills-dir>/${name}/protocol.yon --profile ${proto.profile}`
          : null,
      },
      license: LICENSE,
      attribution: ATTRIBUTION,
    };
  });
  return { skills, families: taxonomy.families };
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

function emitYon(skills, families, stampDay) {
  const L = [];
  L.push(
    `@DOC ver=2.0 | id=open-skills-catalog | title="open-skills — machine catalog" | kind=catalog | profile=full | fmt=min | pack_version=${PACK_VERSION} | license="${LICENSE}" | guide="https://yon.younndai.com/yon-guide.txt"`
  );
  L.push(
    `@INTENT goal="Machine-readable catalog of the open-skills pack — one record per skill — for agent and registry discovery and install. Generated by tools/spine.mjs from each skill's SKILL.md front-matter, the pack-level YON taxonomy, and live protocol.yon facts."`
  );
  L.push(`@STAMP ts:ts=${stampDay} | src=tool | method=generated | scope="tools/spine.mjs"`);
  L.push(`@NOTE text="${yq(ATTRIBUTION)} Generated — do not edit by hand; run tools/spine.mjs."`);
  L.push(`@SEC name="skills"`);
  for (const s of skills) {
    const fields = [
      `@META id=${s.name}`,
      `family=${s.family}`,
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

function emitJson(skills, families, stampDay) {
  return (
    JSON.stringify(
      {
        $schema: 'https://yon.younndai.com/open-skills-catalog.schema.json',
        name: 'open-skills',
        version: PACK_VERSION,
        homepage: 'https://allemaar.com',
        repository: 'https://github.com/allemaar/open-skills',
        generated: stampDay,
        generator: 'tools/spine.mjs',
        license: LICENSE,
        attribution: ATTRIBUTION,
        runtimeDirs: RUNTIME_DIRS,
        families,
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

function emitLlms(skills, families) {
  const dual = skills.filter((s) => s.hasProtocol).length;
  const L = [];
  L.push('# open-skills');
  L.push('');
  L.push(`Version: ${PACK_VERSION}`);
  L.push('');
  L.push(
    `> Reusable, inspectable skills for AI coding agents (Claude Code, Codex, any runtime that reads the open Agent Skills format). Every skill has a readable SKILL.md; ${dual} of ${skills.length} also carry a protocol.yon — a declarative, mechanically validatable account of steps, rules, and gates. Validation proves the declared structure, not runtime obedience. Apache-2.0. Read before you trust.`
  );
  L.push('');
  L.push('## About YON (YounndAI Object Notation™)');
  L.push(
    'The protocol.yon files are written in YON (https://github.com/YounndAI/yon), a stream-first data format for AI-agent workflows with a public spec (https://github.com/YounndAI/yon-spec) and an Apache-2.0 reference parser (@younndai/yon-parser). YON makes a skill\'s declared rules (MUST / MUST_NOT) and gates (ABORT / WARN) inspectable as named, typed objects; it does not enforce runtime obedience.'
  );
  L.push('');
  L.push('## For agents — how to install');
  L.push('No build step, no opaque installer. Follow these in order; the checks in step 3 are the ones that matter, because every failure mode here is SILENT.');
  L.push('0. Clone this repo and work from its root: `git clone https://github.com/allemaar/open-skills && cd open-skills`. Every relative path below is from that root.');
  L.push('1. Enumerate skills from catalog.json (repo root) — each record carries name, description, triggers, gates, and install commands.');
  L.push("2. Choose SKILLS_DIR — the ONE directory the user's runtime actually reads. These are not interchangeable, and choosing wrong fails silently: no error, the skill simply never appears.");
  for (const d of RUNTIME_DIRS) L.push(`   - ${d} — ${RUNTIME_READS[d]}`);
  L.push('   Other tools use a dir of their own (Cursor ~/.cursor/skills, Copilot ~/.copilot/skills). If you cannot establish which runtime you are running in, ASK the user — do not guess. NOTE: SKILLS_DIR already ends in `/skills`. Every step below uses `$SKILLS_DIR/<name>` and never appends `/skills` a second time.');
  L.push('3. CHECK before you write. Both of these, in order — neither condition raises an error on its own, so if you skip the check you will not find out:');
  L.push('   a. `test -e "$SKILLS_DIR/<name>"` — if it exists, the user already has this skill. ASK before replacing it. Do NOT just copy: `cp -r` onto an existing directory does not fail, it nests a second copy INSIDE it and leaves the old SKILL.md exactly where the runtime will keep reading it.');
  L.push('   b. `test -L "$SKILLS_DIR/<name>"` (PowerShell: `(Get-Item -Force "$SKILLS_DIR/<name>").LinkType`) — if it is a symlink or junction, STOP and ask. Copying through it writes into whatever it points at, outside the skills dir, and exits 0 while doing so. Remove the link itself (`rmdir` on Windows, `unlink` on POSIX) — never delete or copy through it.');
  L.push('4. COPY the folder (copy-default, never symlink): `cp -r skills/<name> "$SKILLS_DIR/<name>"` (Windows PowerShell: `Copy-Item -Recurse skills/<name> "$SKILLS_DIR/<name>"`). If it fails because SKILLS_DIR itself does not exist, create exactly that directory and retry — do not invent a different path to make the command succeed.');
  L.push('5. If it ships a protocol.yon, validate it: `npx @younndai/yon-parser validate "$SKILLS_DIR/<name>/protocol.yon" --profile <profile>` (profile is in catalog.json).');
  L.push('   EXPECT exit 0 and `✓ <the path you passed>: Valid` — the parser echoes the full path, so match on `: Valid` and the exit code, not on a fixed string. Anything else — a parse error, a non-zero exit — means STOP: report the output to the user and do not claim the skill installed cleanly.');
  L.push('6. VERIFY, then report the path: `$SKILLS_DIR/<name>/SKILL.md` exists and its first line is `---`. Tell the user the exact directory you installed into — that is what decides which runtime can see it. (This confirms the copy landed; it cannot tell you SKILLS_DIR was the right dir. Step 2 is what gets that right.)');
  L.push('That is the basic install: copy a readable folder, then optionally validate its declarative protocol. The npx validation command may download and execute the separately published parser package; inspect that boundary before using it.');
  L.push('Updating later: these are frozen copies — they do not change until you re-copy. `git pull` in the clone, then diff before you accept: `git diff --no-index "$SKILLS_DIR/<name>" skills/<name>` — silence means identical; read anything it prints before re-copying. Do NOT filter that diff. A `cp -r` install carries no `metadata:` provenance block, so filtering those lines buys nothing and would hide one APPEARING — which is a change you want to see, since that block is an unsigned claim other tooling will act on.');
  L.push('');
  L.push('## Skills by family');
  for (const family of families) {
    L.push('');
    L.push(`### ${family.label}`);
    for (const s of skills.filter((item) => item.family === family.id)) {
      const trg = s.triggers.length ? ` — triggers: ${s.triggers.slice(0, 4).join(', ')}` : '';
      const tag = s.hasProtocol ? ' [protocol.yon]' : ' [md-only]';
      L.push(`- ${s.name}${tag} — ${firstSentence(s.description)}${trg}`);
    }
  }
  L.push('');
  L.push('---');
  L.push(ATTRIBUTION);
  return L.join('\n') + '\n';
}

// --- emit SKILLS.md ---------------------------------------------------------

function mdCell(s) {
  return String(s || '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
}

function emitSkillsMd(skills, families) {
  const L = [
    '# Skills',
    '',
    '> Generated by `tools/spine.mjs` from live `SKILL.md` metadata and `skills/skills-help/taxonomy.yon`. Do not edit this catalog by hand.',
    '',
    `This pack contains **${skills.length} skills**. Install only what earns its place; every skill is readable Markdown, and ${skills.filter((s) => s.hasProtocol).length} also carry a declarative YON (YounndAI Object Notation™) protocol you can inspect and validate.`,
  ];
  for (const family of families) {
    L.push('', `## ${family.label}`, '', '| Skill | Use when | Example triggers | Format |', '|---|---|---|---|');
    for (const s of skills.filter((item) => item.family === family.id)) {
      const triggers = s.triggers.slice(0, 3).map((t) => `\`${mdCell(t)}\``).join(', ') || '—';
      const format = s.hasProtocol ? 'Markdown + YON' : 'Markdown';
      L.push(`| [\`${s.name}\`](skills/${s.name}/) | ${mdCell(firstSentence(s.description))} | ${triggers} | ${format} |`);
    }
  }
  L.push('', '---', '', ATTRIBUTION, '');
  return L.join('\n');
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
  const { skills, families } = collect();
  const stampDay = new Date().toISOString().slice(0, 10);

  const outputs = {
    'catalog.yon': emitYon(skills, families, stampDay),
    'catalog.json': emitJson(skills, families, stampDay),
    'llms.txt': emitLlms(skills, families),
    'skills.graph.yon': emitGraph(skills, stampDay),
    'SKILLS.md': emitSkillsMd(skills, families),
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
    `spine: wrote catalog.yon + catalog.json + llms.txt + skills.graph.yon + SKILLS.md — ${skills.length} skills in ${families.length} families, ${skills.filter((s) => s.hasProtocol).length} with protocol.yon`
  );
}

main();
