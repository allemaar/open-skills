#!/usr/bin/env node
// YON semantic DAG linter.
//
// Structural / dataflow checks over each skill's protocol.yon that the public
// @younndai/yon-parser does NOT do: it validates syntax + profile; this tool
// validates the *graph*. It catches broken cross-references and dead nodes
// inside a protocol's dataflow (refs) and control flow (steps), plus undefined
// rule references and stale freshness stamps.
//
// Usage:
//   node tools/yon-dag.mjs           lint every skills/*/protocol.yon (gate)
//   node tools/yon-dag.mjs <path>    lint a single protocol.yon
//
// Checks (per file):
//   1. Dangling ref            [ERROR] ref:NAME consumed mid/late-flow but never produced
//      / entry-input           [WARN]  ref:NAME unproduced but consumed at the entry step
//                                       (caller-provided input — see ENTRY-INPUT HEURISTIC)
//   2. Undefined rule ref      [ERROR] rid:rule:NAME in rules=[...] with no @RULE rid=rule:NAME
//   3. Dangling step ref       [ERROR] a step:NAME target with no @STEP rid=step:NAME
//   4. Unreachable @STEP       [WARN]  a defined step reachable by neither path (see heuristic)
//   5. Stale @STAMP            [WARN]  newest @STAMP strictly behind a later content commit
//
// REF GRAMMAR. A ref token is `ref:NAME` (NAME kebab-case). It may carry a
// property accessor in prose (`ref:update-result.stderr`); the accessor is
// stripped so the base ref is what's checked. Producers are ONLY `out=[...]`.
// Consumers are everywhere a ref:NAME appears that is NOT inside an out=[...]
// list — in=[...], use=[...], when=, @CHECK assert=, @COND if/then=, @CATCH
// when/then=, and free-standing args=[...] prose. `cfg:NAME` tokens reference
// @MAP configs, not refs, and are ignored by the ref checks.
//
// UNREACHABLE-STEP HEURISTIC (documented, check #4):
//   A defined @STEP is REACHABLE if either
//     (a) it carries `n:int=K` OR `n:num=K` — it is part of the main ascending-n
//         sequence (the protocol's linear backbone, entered from the top). Both
//         int and num count: a float slot like `n:num=4.5` deliberately sequences
//         a step BETWEEN integer steps 4 and 5 and is just as reachable, OR
//     (b) it is a control-flow target: named by an @CATCH `do=rid:step:NAME`
//         or `target=rid:step:NAME`, or by prose `go to step:NAME` /
//         `jump to step:NAME` / `run step:NAME` inside any field.
//   Any defined @STEP reachable by NEITHER path is flagged [WARN] unreachable.
//   In these protocols nearly every @STEP carries n:int/n:num (trivially
//   reachable); the steps without an n (e.g. @CATCH handlers like
//   step:surface-drift, step:report-failure) are reached via (b). The check
//   still runs and reports per file — expect 0 in a healthy repo, but it guards
//   against a future no-n / never-targeted dead handler.
//
// ENTRY-INPUT HEURISTIC (documented, check #1 reclassification):
//   A consumed-but-unproduced ref is normally an ERROR (a dataflow hole or a
//   typo: something reads ref:X but nothing in the protocol writes it). But a
//   protocol legitimately has ENTRY INPUTS — refs the CALLER supplies before the
//   protocol's own steps produce anything (e.g. ask-gate's ref:candidate-question,
//   insight-adversarial's ref:used-personas). These are not bugs. To distinguish:
//     - Find the protocol's ENTRY input step: the step with the lowest n
//       (n:int or n:num) whose in=[...] list consumes at least one ref. That step
//       is where caller-provided dataflow first enters.
//     - An unproduced ref consumed in THAT entry step's in=[...] is reclassified
//       from ERROR to [WARN] "entry-input (unproduced; consider declaring/seeding)"
//       — a likely-legitimate external input, surfaced softly, not gated.
//     - An unproduced ref consumed only mid/late-flow (never in the entry step's
//       in=[...]) stays [ERROR] — a real dataflow hole or typo.
//   FUTURE: an explicit YON-native entry-input declaration (a tag/convention)
//   would replace this inference; that needs a yon-writer / tag-registry
//   consultation and is NOT invented here — this WARN is the interim signal.
//
// Exit code: non-zero if ANY error-class finding exists; zero if clean or
// warnings-only. (CI-gateable — but this tool does NOT touch any CI workflow.)
//
// Zero npm deps: a hand-written line tokenizer over the grammar above, which is
// more robust here than coupling to a parser API. Shares the zero-dep approach
// of tools/conformance.mjs.

import { readdirSync, existsSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const SKILLS = 'skills';

// --- token extractors -------------------------------------------------------

// All ref:NAME tokens on a line, base name only (strip a trailing .accessor).
function refsIn(text) {
  const out = [];
  const re = /\bref:([a-z0-9]+(?:-[a-z0-9]+)*)/gi;
  let m;
  while ((m = re.exec(text)) !== null) out.push(m[1]);
  return out;
}

// All bracketed `key=[ ... ]` lists on a record, returned as { key, body }.
function bracketLists(line) {
  const out = [];
  const re = /(\w+)=\[([^\]]*)\]/g;
  let m;
  while ((m = re.exec(line)) !== null) out.push({ key: m[1], body: m[2] });
  return out;
}

// step:NAME tokens that are CONTROL-FLOW references (catch targets / prose jumps),
// not the `rid=step:NAME` definition itself.
function stepRefsIn(line) {
  const out = [];
  // @CATCH target=step:X / target=rid:step:X / do=...  (rid: prefix optional)
  let re = /\b(?:target|do)=(?:rid:)?step:([a-z0-9]+(?:-[a-z0-9]+)*)/gi;
  let m;
  while ((m = re.exec(line)) !== null) out.push(m[1]);
  // prose: "go to step:X", "jump to step:X", "run step:X"
  re = /\b(?:go to|jump to|run)\s+step:([a-z0-9]+(?:-[a-z0-9]+)*)/gi;
  while ((m = re.exec(line)) !== null) out.push(m[1]);
  return out;
}

// rid:rule:NAME tokens inside a rules=[...] list.
function ruleRefsIn(line) {
  const out = [];
  for (const { key, body } of bracketLists(line)) {
    if (key !== 'rules') continue;
    const re = /\brid:rule:([a-z0-9]+(?:-[a-z0-9]+)*)/gi;
    let m;
    while ((m = re.exec(body)) !== null) out.push(m[1]);
  }
  return out;
}

// --- per-file lint ----------------------------------------------------------

function lintFile(file) {
  const findings = []; // { sev: 'ERROR'|'WARN', line, token, msg }
  const raw = readFileSync(file, 'utf8');
  const lines = raw.split(/\r?\n/);

  const producedRefs = new Set();          // ref names produced via out=[...]
  const consumed = [];                     // { name, line, inStepN } (inStepN: n of the @STEP whose in=[...] consumes it, else null)
  const definedRules = new Set();          // rule names from @RULE rid=rule:NAME
  const ruleRefs = [];                     // { name, line }
  const definedSteps = new Map();          // stepName -> { line, hasN, n }
  const stepRefs = [];                     // { name, line }
  const stamps = [];                       // ISO date strings
  const inStepNs = [];                     // n of every @STEP whose in=[...] consumes >=1 ref

  lines.forEach((line, i) => {
    const ln = i + 1;
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    // @STAMP ts:ts=<ISO>
    if (trimmed.startsWith('@STAMP')) {
      const m = trimmed.match(/ts:ts=([0-9T:\-+.Z]+)/);
      if (m) stamps.push(m[1]);
    }

    // @RULE rid=rule:NAME  (definition)
    const ruleDef = trimmed.match(/^@RULE\b[^|]*\brid=rule:([a-z0-9]+(?:-[a-z0-9]+)*)/i);
    if (ruleDef) definedRules.add(ruleDef[1]);

    // @STEP rid=step:NAME  (definition) + backbone-sequence n presence.
    // Both n:int=K and n:num=K (e.g. n:num=4.5, a float slot between integer
    // steps) mark a step as part of the reachable ascending-n backbone.
    const stepDef = trimmed.match(/^@STEP\b[^|]*\brid=step:([a-z0-9]+(?:-[a-z0-9]+)*)/i);
    if (stepDef) {
      const nMatch = trimmed.match(/\bn:(?:int|num)=(\d+(?:\.\d+)?)/);
      const hasN = nMatch !== null;
      const n = hasN ? Number(nMatch[1]) : null;
      definedSteps.set(stepDef[1], { line: ln, hasN, n });
    }

    // Producers: every ref inside an out=[...] list.
    const lists = bracketLists(line);
    for (const { key, body } of lists) {
      if (key === 'out') for (const r of refsIn(body)) producedRefs.add(r);
    }

    // Determine this record's backbone n (if it is an @STEP with n:int/n:num),
    // and which refs it consumes specifically via its in=[...] list. Entry-input
    // reclassification (check #1) keys off the in=[...] of the lowest-n step.
    const recNMatch = trimmed.startsWith('@STEP') ? trimmed.match(/\bn:(?:int|num)=(\d+(?:\.\d+)?)/) : null;
    const recN = recNMatch ? Number(recNMatch[1]) : null;
    const inRefsHere = new Set();
    for (const { key, body } of lists) {
      if (key === 'in') for (const r of refsIn(body)) inRefsHere.add(r);
    }
    if (recN !== null && inRefsHere.size > 0) inStepNs.push(recN);

    // Consumers: any ref:NAME on the line that is NOT inside an out=[...] list.
    // Compute by blanking out=[...] segments, then scanning the remainder. Tag
    // each with inStepN = this step's n IF the ref is consumed via in=[...] here.
    let consumerScan = line.replace(/\bout=\[[^\]]*\]/g, ' ');
    for (const name of refsIn(consumerScan)) {
      const inStepN = (recN !== null && inRefsHere.has(name)) ? recN : null;
      consumed.push({ name, line: ln, inStepN });
    }

    // Rule references inside rules=[...]
    for (const name of ruleRefsIn(line)) ruleRefs.push({ name, line: ln });

    // Step control-flow references
    for (const name of stepRefsIn(line)) stepRefs.push({ name, line: ln });
  });

  // Check 1: dangling refs, with entry-input reclassification.
  // The protocol's ENTRY input step is the lowest-n @STEP whose in=[...] consumes
  // a ref — caller-provided dataflow first enters there. Classification is
  // per ref NAME, not per occurrence: an unproduced ref that is consumed in the
  // ENTRY step's in=[...] (even once) is an entry-input — a likely-legitimate
  // external input that downstream steps may read repeatedly — so it gets a
  // single [WARN]. An unproduced ref NEVER consumed as an entry-step input is a
  // real dataflow hole — a single [ERROR]. One finding per ref name, reported at
  // its first consumption line.
  const entryStepN = inStepNs.length > 0 ? Math.min(...inStepNs) : null;
  const unproduced = new Map(); // name -> { firstLine, isEntryInput }
  for (const { name, line, inStepN } of consumed) {
    if (producedRefs.has(name)) continue;
    const consumedAtEntry = entryStepN !== null && inStepN !== null && inStepN === entryStepN;
    const prev = unproduced.get(name);
    if (!prev) {
      unproduced.set(name, { firstLine: line, isEntryInput: consumedAtEntry });
    } else {
      prev.firstLine = Math.min(prev.firstLine, line);
      prev.isEntryInput = prev.isEntryInput || consumedAtEntry;
    }
  }
  for (const [name, { firstLine, isEntryInput }] of unproduced) {
    if (isEntryInput) {
      findings.push({ sev: 'WARN', line: firstLine, token: `ref:${name}`, msg: 'entry-input (unproduced; consider declaring/seeding)' });
    } else {
      findings.push({ sev: 'ERROR', line: firstLine, token: `ref:${name}`, msg: 'consumed mid/late-flow but never produced by any out=[...]' });
    }
  }

  // Check 2: undefined rule references
  for (const { name, line } of ruleRefs) {
    if (!definedRules.has(name)) {
      findings.push({ sev: 'ERROR', line, token: `rid:rule:${name}`, msg: 'referenced in rules=[...] but no @RULE rid=rule:' + name + ' defined' });
    }
  }

  // Check 3: dangling step references
  for (const { name, line } of stepRefs) {
    if (!definedSteps.has(name)) {
      findings.push({ sev: 'ERROR', line, token: `step:${name}`, msg: 'control-flow target but no @STEP rid=step:' + name + ' defined' });
    }
  }

  // Check 4: unreachable steps
  const reachable = new Set();
  for (const [name, info] of definedSteps) if (info.hasN) reachable.add(name);
  for (const { name } of stepRefs) if (definedSteps.has(name)) reachable.add(name);
  for (const [name, info] of definedSteps) {
    if (!reachable.has(name)) {
      findings.push({ sev: 'WARN', line: info.line, token: `step:${name}`, msg: 'defined @STEP is unreachable (no n:int sequence slot and no @COND/@CATCH/prose target)' });
    }
  }

  // Check 5: stale stamp
  const stampInfo = stampVsSource(file, stamps);
  if (stampInfo && stampInfo.stale) {
    findings.push({
      sev: 'WARN',
      line: stampInfo.line,
      token: `@STAMP ${stampInfo.stamp}`,
      msg: `stamp day (${stampInfo.stamp.slice(0, 10)}) behind later ${stampInfo.srcKind} day (${stampInfo.src.slice(0, 10)})`,
    });
  }

  return { findings };
}

// Newest stamp vs the file's last CONTENT-EDITING commit, compared by CALENDAR
// DAY. A stamp records the calendar day a protocol's content was last authored;
// clock-time precision is noise, and the day a repo was bulk-imported is NOT a
// content edit. We therefore key off the last commit that actually MODIFIED the
// file's content:
//   git log -1 --diff-filter=M --format=%cI -- <file>   (last MODIFY of the path)
// A commit that merely ADDED the file (a bulk import / initial checkout) is
// excluded — being imported is not being edited, so it cannot make a stamp
// stale. If the file has only ever been added (no later modify), there is no
// post-stamp content edit and the stamp is FRESH; we then confirm against
// filesystem mtime (same-day = fresh). STALE (warn) ONLY when a content-modify
// commit lands on a STRICTLY LATER calendar day than the newest stamp.
function dayOf(iso) {
  // Calendar-day key (YYYY-MM-DD) from an ISO timestamp, in UTC, time ignored.
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return new Date(t).toISOString().slice(0, 10);
}

function stampVsSource(file, stamps) {
  if (stamps.length === 0) return null;
  const parsed = stamps.map((s) => ({ s, t: Date.parse(s) })).filter((x) => !Number.isNaN(x.t));
  if (parsed.length === 0) return null;
  const newest = parsed.reduce((a, b) => (b.t > a.t ? b : a));

  let src = null;
  let srcKind = 'git modify-commit';
  let gitRan = false;
  try {
    // Last commit that MODIFIED (not merely added) this path's content. Empty
    // output = the path was only ever added (bulk import), never content-edited.
    // execFileSync (argv array, no shell) — the path is passed as a literal
    // argument, so a filename with shell metacharacters cannot inject.
    const out = execFileSync('git', ['log', '-1', '--diff-filter=M', '--format=%cI', '--', file], { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    gitRan = true;
    if (out) src = out;
  } catch { /* git unavailable */ }

  // Git available but NO content-modify commit -> file unchanged since it was
  // added, so it cannot be behind a later edit -> FRESH, no warning.
  if (gitRan && !src) {
    return { stale: false, stamp: newest.s, src: '(added, never modified)', srcKind: 'git modify-commit', line: 0 };
  }

  if (!src) {
    // Git entirely unavailable: fall back to fs mtime.
    try {
      src = statSync(file).mtime.toISOString();
      srcKind = 'fs mtime';
    } catch { return null; }
  }

  const stampDay = dayOf(newest.s);
  const srcDay = dayOf(src);
  if (stampDay === null || srcDay === null) return null;
  // Stale ONLY when the content-modify source is on a strictly later calendar day.
  const stale = srcDay > stampDay;
  // find the line of the newest stamp for reporting
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  let stampLine = 0;
  lines.forEach((l, i) => { if (l.includes(newest.s)) stampLine = i + 1; });

  return { stale, stamp: newest.s, src, srcKind, line: stampLine };
}

// --- driver -----------------------------------------------------------------

function resolveTargets(arg) {
  if (arg !== undefined) {
    if (!arg || !existsSync(arg)) {
      console.error(`YON-DAG: file not found: ${arg}`);
      process.exit(1);
    }
    return [arg];
  }
  return readdirSync(SKILLS)
    .map((n) => join(SKILLS, n, 'protocol.yon'))
    .filter((p) => existsSync(p))
    .sort();
}

function main() {
  const arg = process.argv[2];
  const targets = resolveTargets(arg);
  if (targets.length === 0) {
    console.error('YON-DAG: no protocol.yon files found.');
    process.exit(1);
  }

  const summary = [];
  let totalErr = 0;
  let totalWarn = 0;

  for (const file of targets) {
    const { findings } = lintFile(file);
    const errs = findings.filter((f) => f.sev === 'ERROR');
    const warns = findings.filter((f) => f.sev === 'WARN');
    totalErr += errs.length;
    totalWarn += warns.length;
    summary.push({ file, e: errs.length, w: warns.length });

    if (findings.length === 0) {
      console.log(`\n${file}\n  clean`);
      continue;
    }
    console.log(`\n${file}`);
    for (const f of findings.sort((a, b) => a.line - b.line)) {
      const tag = f.sev === 'ERROR' ? 'ERROR' : 'WARN ';
      console.log(`  [${tag}] L${f.line}  ${f.token}  — ${f.msg}`);
    }
  }

  // summary table
  console.log('\n' + '='.repeat(68));
  console.log('SUMMARY');
  console.log('-'.repeat(68));
  const nameW = Math.max(...summary.map((r) => r.file.length), 'file'.length);
  console.log(`${'file'.padEnd(nameW)}  errors  warnings`);
  for (const r of summary) {
    console.log(`${r.file.padEnd(nameW)}  ${String(r.e).padStart(6)}  ${String(r.w).padStart(8)}`);
  }
  console.log('='.repeat(68));
  console.log(`YON-DAG: ${totalErr} errors, ${totalWarn} warnings across ${targets.length} protocols`);

  process.exit(totalErr > 0 ? 1 : 0);
}

main();
