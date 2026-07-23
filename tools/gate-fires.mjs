#!/usr/bin/env node
// gate-fires.mjs — proof that the pack's guards actually FIRE on bad input.
//
// The repo's pitch is "inspectable AND enforced." Enforcement is only believable if
// you can watch the gates reject something. This runs the SAME public tools a user
// runs (the @younndai/yon-parser and tools/yon-dag.mjs) against deliberately-broken
// fixtures in tools/gate-fixtures/, and asserts each one is rejected. A positive
// control validates a real shipped skill so the gates demonstrably tell good from
// bad — they are not just "always red".
//
// It writes GATE-FIRES.md (the readable proof) and exits non-zero if any gate fails
// to behave as expected. Wired into CI, that makes the proof un-stageable: it is
// regenerated from the real tools on every push, never hand-authored.
//
// Usage:  node tools/gate-fires.mjs
//
// Apache-2.0. "YON" and "YounndAI" are trademarks of MARLINK TRADING SRL.

import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PARSER = "npx -y @younndai/yon-parser@2";
const FIX = "tools/gate-fixtures";

// Each scenario injects ONE defect, runs the REAL gate, and states the expectation.
const scenarios = [
  { gate: "public YON parser", expect: "reject",
    defect: "`@DOC` missing its required `ver` field — malformed YON",
    cmd: `${PARSER} validate ${FIX}/bad-syntax.yon --profile exec`,
    mustSay: /missing required field/ },
  { gate: "yon-dag (semantic graph)", expect: "reject",
    defect: "a mid-flow step consumes `ref:ghost` that no step ever produces (dataflow hole)",
    cmd: `node tools/yon-dag.mjs ${FIX}/dangling-ref.yon`,
    mustSay: /never produced/ },
  { gate: "yon-dag (semantic graph)", expect: "reject",
    defect: "a step cites `rid:rule:ghost` with no matching `@RULE` (undefined rule reference)",
    cmd: `node tools/yon-dag.mjs ${FIX}/undefined-rule.yon`,
    mustSay: /no @RULE/ },
  { gate: "public YON parser", expect: "accept",
    defect: "POSITIVE CONTROL — a real, shipped skill protocol (`skills/verify/protocol.yon`)",
    cmd: `${PARSER} validate skills/verify/protocol.yon --profile exec` },
  // The orient value gate closes a gap the parser CANNOT see: a record can be structurally valid YON
  // (parser accepts) yet carry an out-of-enum or fail-open VALUE. The first pair below IS that gap.
  { gate: "public YON parser", expect: "accept",
    defect: "THE GAP — `orient-spec/examples/bad/enum-banana.yon` is structurally valid YON, so the parser passes it; it cannot see the bad value",
    cmd: `${PARSER} validate orient-spec/examples/bad/enum-banana.yon --profile exec` },
  { gate: "orient value gate", expect: "reject",
    defect: "the SAME file: `gate_status=banana` is not a member of the gate_status enum — the value the parser waved through",
    cmd: `node tools/orient-validate.mjs orient-spec/examples/bad/enum-banana.yon`,
    mustSay: /not a valid gate_status/ },
  { gate: "orient value gate", expect: "reject",
    defect: "`evidence_mode=barren` paired with `gate_status=ready` — a fail-open verdict (structurally valid, value-illegal)",
    cmd: `node tools/orient-validate.mjs orient-spec/examples/bad/fail-open.yon`,
    mustSay: /fail-closed violated/ },
  { gate: "orient value gate", expect: "accept",
    defect: "POSITIVE CONTROL — the conformant `orient-spec/examples/orient-record.example.yon`",
    cmd: `node tools/orient-validate.mjs orient-spec/examples/orient-record.example.yon` },
  // The diff-recap value gate closes the same class of gap for diff-recap records: a record can be
  // structurally valid YON yet state totals that DON'T equal the sum of its rows (defeating the
  // "true by construction" claim), or claim a clean recap from a non-git source.
  { gate: "public YON parser", expect: "accept",
    defect: "THE GAP — `skills/diff-recap/examples/bad/fabricated-counts.yon` is structurally valid YON, so the parser passes it; it cannot see total_added=999 while the rows sum to 155",
    cmd: `${PARSER} validate skills/diff-recap/examples/bad/fabricated-counts.yon --profile exec` },
  { gate: "diff-recap value gate", expect: "reject",
    defect: "the SAME file: the headline total drifted from the sum of the rows — the true-by-construction defeat",
    cmd: `node tools/diff-recap-check.mjs skills/diff-recap/examples/bad/fabricated-counts.yon`,
    mustSay: /sum mismatch/ },
  { gate: "diff-recap value gate", expect: "reject",
    defect: "`gate_status=clean` with `attested=false` — a clean recap claimed from no git source (fail-open)",
    cmd: `node tools/diff-recap-check.mjs skills/diff-recap/examples/bad/fail-open.yon`,
    mustSay: /attested gate violated/ },
  { gate: "diff-recap value gate (--numstat)", expect: "reject",
    defect: "`skills/diff-recap/examples/bad/numstat-mismatch.yon` is internally consistent (sums match) but a row names a file absent from the git numstat — only the per-file attestation catches it",
    cmd: `node tools/diff-recap-check.mjs skills/diff-recap/examples/bad/numstat-mismatch.yon --numstat skills/diff-recap/examples/diff-recap.numstat`,
    mustSay: /absent from the git numstat/ },
  { gate: "diff-recap value gate", expect: "accept",
    defect: "POSITIVE CONTROL — the conformant `skills/diff-recap/examples/diff-recap.example.yon` (rows match the git numstat)",
    cmd: `node tools/diff-recap-check.mjs skills/diff-recap/examples/diff-recap.example.yon --numstat skills/diff-recap/examples/diff-recap.numstat` },
  // The DCO guard enforces a rule CONTRIBUTING.md already states. It drifted for exactly the reason
  // this file exists: the rule was written down, nothing ran it, and the other gates stayed green
  // while 7 commits went unsigned. These two grade a commit message rather than a YON record.
  { gate: "DCO sign-off guard", expect: "reject",
    defect: "a commit message with no `Signed-off-by` trailer. Grades the PREDICATE only — the floor, the commit range, and forward-only are not exercised here",
    cmd: `node tools/dco-guard.mjs --message-file ${FIX}/unsigned-commit.txt`,
    mustSay: /has no valid "Signed-off-by/ },
  { gate: "DCO sign-off guard", expect: "reject",
    defect: "a message that QUOTES a sign-off in its body but carries no trailer. A message-wide regex passes this; git reads only the last paragraph, so it does not. (The documented limit is the inverse layout — a fenced sign-off that IS the last paragraph — which git counts as a real trailer. See `signoffValues()` in tools/dco-guard.mjs)",
    cmd: `node tools/dco-guard.mjs --message-file ${FIX}/quoted-signoff-commit.txt`,
    mustSay: /has no valid "Signed-off-by/ },
  { gate: "DCO sign-off guard", expect: "reject",
    defect: "a REAL trailer in the real trailer block, with no name before the email (`Signed-off-by: <nobody@example.com>`) — certifying nobody",
    cmd: `node tools/dco-guard.mjs --message-file ${FIX}/nameless-signoff-commit.txt`,
    mustSay: /has no valid "Signed-off-by/ },
  { gate: "DCO sign-off guard", expect: "accept",
    defect: "POSITIVE CONTROL — a message carrying a real sign-off trailer, so the gate is not trivially red",
    cmd: `node tools/dco-guard.mjs --message-file ${FIX}/signed-commit.txt` },
  // The structural lint's reference check. Its companion-file coverage and its docs/-shaped
  // path resolution were BOTH blind until 2026-07-17 — a broken ref in a references/ file, or
  // any path outside the tools//skills/ whitelist, passed silently. These prove the widened
  // check fires on exactly that class and stays quiet on a clean one.
  { gate: "structural lint (ref check)", expect: "reject",
    defect: "a companion doc citing `docs/nsp-cop-audit.md` — a path that does not exist in the public pack (a private-repo leftover). Invisible before the 2026-07-17 widening: companion files were unscanned AND docs/-shaped paths were outside the base whitelist",
    cmd: `node tools/lint.mjs ${FIX}/broken-ref.md`,
    mustSay: /broken reference/ },
  { gate: "structural lint (ref check)", expect: "accept",
    defect: "POSITIVE CONTROL — a companion doc whose references (`tools/lint.mjs`) all resolve, so a green run means checked-and-clean, not check-never-looked",
    cmd: `node tools/lint.mjs ${FIX}/clean-ref.md` },
  // The human-output check grades the MECHANICAL half of the human-output contract — the
  // half a reader can measure. Its sharpest rule is figure arithmetic: prose can claim
  // anything, but a bar drawn out of proportion to its own printed label is a picture that
  // contradicts its caption, and no amount of reading the text catches it.
  { gate: "human-output check (figure arithmetic)", expect: "reject",
    defect: "a figure whose bars contradict their printed labels — `logs` is drawn nearly as long as `archive` while claiming a third of the value, so a reader who measures the bar gets a different number than the one written beside it",
    cmd: `node tools/human-output-check.mjs ${FIX}/bad-figure.md`,
    mustSay: /not proportional to their labels/ },
  { gate: "human-output check (figure arithmetic)", expect: "accept",
    defect: "POSITIVE CONTROL — the same figure drawn honestly (one cell per hundred units, printable ASCII, inside the column budget), so a green run means checked-and-clean rather than the checker never looking",
    cmd: `node tools/human-output-check.mjs ${FIX}/clean-figure.md` },
  // The human-spec roster guard. human-spec/ holds the family's roster and routing table and
  // every member defers to it — but until 2026-07-19 NO tool read it, so it was documentation
  // that could go stale silently. Gated BOTH ways: the phantom direction (names what does not
  // ship) and the missing direction, which is how `human-merge` shipped while three siblings
  // and the routing table still said "not yet shipped".
  { gate: "human-spec roster guard", expect: "reject",
    defect: "a contract routing table naming `human-ghost`, which has no skills/human-ghost/ directory — the spec promises a member the pack cannot deliver",
    cmd: `node tools/consistency-guard.mjs --human-contract ${FIX}/phantom-roster.md`,
    mustSay: /names `human-ghost` but skills\/human-ghost\/ does not exist/ },
  { gate: "human-spec roster guard", expect: "reject",
    defect: "the inverse and the one that actually happened: a routing table that never names `human-merge` while skills/human-merge/ ships — a silently unlisted member, invisible to a phantom-only check",
    cmd: `node tools/consistency-guard.mjs --human-contract ${FIX}/unlisted-roster.md`,
    mustSay: /skills\/human-merge\/ ships but the human-contract\.md routing table never names it/ },
  { gate: "human-spec roster guard", expect: "accept",
    defect: "POSITIVE CONTROL — the real `human-spec/human-contract.md`, whose routing table and the shipped skills/human-*/ dirs agree in both directions",
    cmd: `node tools/consistency-guard.mjs --human-contract human-spec/human-contract.md` },
  // The human-output footer guard. A skill that cites the contract has opted into it, so it
  // must carry the contract's footer VERBATIM — a paraphrase is drift, and drift is what a
  // growing family produces. Coverage when wired: 36 of 55 skills cite it, all 36 carry it.
  { gate: "human-output footer guard", expect: "reject",
    defect: "a skill body citing `human-output/SKILL.md` whose closing blockquote is a PARAPHRASE of the footer, not the verbatim two lines — a substring-anywhere check passes this; a verbatim check does not",
    cmd: `node tools/consistency-guard.mjs --footer-file ${FIX}/missing-footer-skill.md`,
    mustSay: /does not carry the verbatim human-output footer blockquote/ },
  { gate: "human-output footer guard", expect: "accept",
    defect: "POSITIVE CONTROL — the same body with the footer verbatim, so a green run means the check read the file and found it rather than never looking",
    cmd: `node tools/consistency-guard.mjs --footer-file ${FIX}/clean-footer-skill.md` },
];

function run(cmd) {
  try {
    const out = execSync(cmd, { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
    return { code: 0, out: out.toString() };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout?.toString() || "") + (e.stderr?.toString() || "") };
  }
}

function firstSignal(out) {
  const line = out.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    .find((l) => /\b(E\d{3}|error|invalid|valid|✓)\b/i.test(l)) || "";
  return line.replace(/\s+/g, " ").slice(0, 140);
}

const rows = [];
let broken = false;
for (const s of scenarios) {
  const r = run(s.cmd);
  const rejected = r.code !== 0;
  // A non-zero exit alone is weak evidence: a crash (a missing fixture, a broken
  // import) exits non-zero too, and would score as "the gate fired" while grading
  // nothing. Where a scenario pins `mustSay`, the gate must also SAY why it rejected.
  const saidIt = !s.mustSay || s.mustSay.test(r.out);
  const ok = s.expect === "reject" ? rejected && saidIt : !rejected;
  if (!ok) broken = true;
  rows.push({ ...s, code: r.code, rejected, ok, signal: firstSignal(r.out) });
  console.log(`${ok ? "✓" : "✗"} ${s.gate} — expected ${s.expect}, ` +
    `${rejected ? "rejected" : "accepted"} (exit ${r.code})`);
}

const verdict = broken
  ? "⚠️ a gate did NOT behave as expected — see the rows marked ✗."
  : "The listed deliberately broken fixtures were rejected in this diagnostic run.";

const md = `# Gate-fires maintainer diagnostic snapshot

> This is a retained maintainer diagnostic snapshot, not product or release evidence. It is not
> run by product CI and may be regenerated only under a separate current Handler decision.
> Current release checks validate shipped artifacts rather than testing checkers against fixtures.

The table below records one diagnostic run against deliberately broken fixtures. It shows only
what those commands reported in that run. It does not prove runtime obedience, current product
correctness, or that every guard will behave identically later.

**Snapshot result:** ${verdict}

| Gate | Defect injected | Expected | Exit | Outcome | First signal |
|---|---|---|---|---|---|
${rows.map((r) =>
  `| ${r.gate} | ${r.defect} | ${r.expect} | \`${r.code}\` | ${r.ok ? (r.rejected ? "✅ rejected" : "✅ accepted") : "❌ unexpected"} | \`${r.signal.replace(/\|/g, "\\|")}\` |`
).join("\n")}

## What this diagnostic observed

- The **public YON parser** (\`${PARSER}\`) rejects malformed YON. Trust routes through a
  public, Apache-2.0 spec + parser — not through this author.
- **\`yon-dag.mjs\`** catches defects the parser cannot: a protocol can be *syntactically valid*
  yet have a dataflow hole (a consumed ref nothing produces) or an undefined rule reference.
  Those are exactly the inconsistencies prose can hide.
- The **orient value gate** (\`tools/orient-validate.mjs\`) catches what the parser structurally
  cannot: the first pair above shows the *same file* passing \`yon validate\` yet rejected by the
  value gate for an out-of-enum / fail-open *value*. Structurally valid is not the same as honest.
- The positive controls passed in this run; that is a historical observation, not release proof.

## Reproduce it

\`\`\`bash
node tools/gate-fires.mjs        # regenerates this file and exits non-zero if a gate misfires
\`\`\`
`;

writeFileSync(path.join(ROOT, "GATE-FIRES.md"), md);
console.log(`\nWrote GATE-FIRES.md. ${broken ? "DIAGNOSTIC FAILED." : "Diagnostic completed."}`);
process.exit(broken ? 1 : 0);
