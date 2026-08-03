---
name: map-check
description: The honest inspector for Map Your Knowledge — read-only conformance checks of an organized scope via a small bundled script, always reporting what was checked AND what was not; it can never claim an unqualified "all clear". Trigger when the user says "check this map", "check the graph", "is this vault still healthy", "run map-check", or "/map-check". Read-only forever; repairs belong to map-this and map-maintain.
visibility: public
self-improvable: true
triggers:
  - "/map-check"
  - "check this map"
  - "check the graph"
  - "is this vault healthy"
next-skills:
  - skill: map-maintain
    phrase: "/map-maintain"
    why: "Run one Handler-gated repair-and-recheck cycle for confirmed findings."
  - skill: map-this
    phrase: "/map-this"
    why: "Re-organize or extend the scope the check just measured."
---

# /map-check

The read-only conformance front door for **Map Your Knowledge (MYK)** — the single checking engine. It validates a scope against the frozen contract's deterministic catalog and never invents rules of its own.

> kernel-version: MYK v2.3 `f2f96f2de49b4863bca55ee8f6004d24e00574a7db5e7e5ef0e3cb28c42510cf`

## The two iron rules

1. **Read-only forever.** map-check never writes, renames, or proposes-and-applies. Findings go to the Handler, and repairs run through `map-this` (one-off) or `map-maintain` (the tending loop).
2. **Unqualified CLEAN is banned.** The only positive verdict is: *"clean for checks {list} over inventory {source}, mode {mode}; not checked: {list}."* A crash can never read as a pass: the JSON envelope separates operational errors from findings by shape.

## Running it

The bundled deterministic script does the mechanical work (no LLM in the validation path):

```bash
node <this-skill>/references/tools/map-check.mjs <target-path> [--json]
```

- **Target classes:** an explicit path inside a scope, or a scope root (a directory containing `.myk/README.md` or a declared root map). Ambiguous or contested scopes fail closed (`scope-conflict`).
- **Modes:** FULL (a `.myk/README.md` contract is present — its `m1.root-map` and `m3` declarations govern) or DEGRADED (no contract — the agent supplies the declared root map from kernel markers; absence of any declaration is NEVER a finding: undeclared trees are outside jurisdiction, and the script says so and stops).
- **Inventory honesty:** the script walks the scope itself (never following links/junctions out of it; skipped boundaries are counted against completeness) and reports `inventory: {source, complete, scanned}`.
- **Exit codes:** `0` ran, zero findings (qualified-clean) · `1` ran, findings present · `2` operational error · `3` target/scope resolution error.

## The checks (each pinned to its kernel rule; the script prints this table per run)

| Id | Checks | Finding classes |
|---|---|---|
| C1 owner-declaration | every eligible Markdown member declares exactly one `meta.map`; the declared root map declares none | missing-owner · multiple-owners · root-declares-owner |
| C2 reciprocal spine | roster derived from member-side `meta.map` (authoritative): each declared owner map exists AND links the member; untyped map links are never membership claims | spine-drift-mapside · dangling-owner |
| C3 address form | duplicate-basename targets (incl. any `README` owner) use path form, never bare | bare-duplicate-basename |
| C4 meta container | frontmatter parses; single well-formed `meta`; one `meta.map` value; the exact legacy key `meta.parent` | parse-error · malformed-map-value · legacy-owner-key |
| C5 archive consistency | `meta.archived` implies the archive callout; `archive/` folders reported as likely-unsignalled | missing-callout · unsignalled-archive |
| C7 case-fold collisions | sibling names colliding case-insensitively | case-fold-collision |
| C8 exclusion integrity | M3 entries well-formed; excluded trees generate zero other findings; managed artifacts reachable per their declared graph-entry | malformed-exclusion · managed-artifact-unreachable |

**Not checked, permanently, reported every run:** prose quality; semantic-role presence in free-form maps; earned-scope judgment; whether an undeclared tree should be organized; tag semantics beyond syntax; positive cross-vault reference validity; frontmatter-contained links (resolution reads note BODIES only — links inside YAML frontmatter are invisible to R2 and to `map-scan` alike); lifecycle VALUE legality where no lifecycle layer is declared (C6 runs only when the root map declares the layer — v1 script reports it not-checked); snapshot exemptions (C10 — needs Handler-declared pairs; v1 reports not-checked); the 8-field frontmatter ceremony (C9 — vault-policy-dependent; v1 reports not-checked); anything that is a state of the work.

## The v1 script boundary — declared, not implied

The accepted design (map-check design v3) is the FULL contract; the bundled v1 script implements a **declared subset** and says so in every run's `not_checked` list. Implemented: C1, C2, C4, C5, C7, C8 in full deterministic form; C3 limited to owner-declaration resolution, duplicate-basename/ambiguity, and the raw-cross-vault-wikilink prohibition; and — per the v2.4 link-resolution rider and its two amendments — **R1 (declaration grammar, independently parsed: dialect + acceptance lists, fail-closed) and R2 (occurrence-level link resolution and closure, independently implemented: 11 terminal classes, fragments at exact heading/`^block` granularity, governed boundary targets, normalized comparison records pinned to the inventory/contract/governed-target fingerprints)**. The walk is bounded (`--max-files` / `--max-ms`); a cap that prevents canonical-inventory closure is a typed `check-incomplete` operational envelope (exit 2), never a clean verdict. The R implementation shares the rider's declared semantics with `map-scan` but no code — disagreement between the two tools' normalized records is evidence, never suppressed. Staged for the next script revision, by name: C6 (lifecycle values, where declared), C9 (frontmatter ceremony, vault-policy), C10 (snapshot pairs), scope-local-instruction discovery (marker 2 automation — today the caller supplies `--root-map`), Unicode/Obsidian heading-slug normalization and embed semantics (exact-match only today), and qualified-Lyt-vault targets with the typed `resolver-unavailable` error. **This boundary is itself a reviewable claim** — it stands only while the peer reviewer and the Handler accept it; narrowing it further requires the same acceptance.

## Suppression sources — exactly two

M3 declarations in the scope contract, and Handler-confirmed rulings persisted in the style record. **Raw prose suppresses nothing.** Every suppression is listed in the output with its provenance.

## Agent duties around the script

Run it; relay its output faithfully (verdict form intact — never upgrade "clean for these checks" into "all clear"); where the script reports DEGRADED or incomplete inventory, say so in the first sentence; route findings to the Handler with `map-this`/`map-maintain` as the repair paths. If the script cannot run (no Node), fall back to the behavioral checks in `map-rules` and label the result AGENT-CHECKED, SAMPLED — never script-equivalent.

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
