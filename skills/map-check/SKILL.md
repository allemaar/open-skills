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

The read-only conformance front door for **Map Your Knowledge (MYK)**. It validates a scope against the named MYK sources and never invents rules of its own.

> **Protocol provenance.** MYK v2.4 comes from [`map-rules/SKILL.md`](../map-rules/SKILL.md) and its routed references. Each finding carries its owning file and heading.

## The two iron rules

1. **Read-only forever.** map-check never writes, renames, or proposes-and-applies. Findings go to the Handler, and repairs run through `map-this` (one-off) or `map-maintain` (the tending loop).
2. **Unqualified CLEAN is banned.** The only positive verdict is: *"clean for checks {list} over inventory {source}, mode {mode}; not checked: {list}."* A crash can never read as a pass: the JSON envelope separates operational errors from findings by shape.

## Required checker companion

The bundled deterministic companion [`references/tools/map-check.mjs`](references/tools/map-check.mjs) does the mechanical work with Node.js and no model in the validation path:

```bash
node <this-skill>/references/tools/map-check.mjs <target-path> [--json]
```

- **Target classes:** an explicit path inside a scope, or a scope root (a directory containing `.myk/README.md` or a declared root map). Ambiguous or contested scopes fail closed (`scope-conflict`).
- **Modes:** FULL when [`scope.md` — Organized-scope evidence](../map-rules/references/scope.md#organized-scope-evidence) resolves `.myk/README.md`; DEGRADED when the caller supplies another exact declared root-map source. Absence of a declaration is never a finding; undeclared trees are outside jurisdiction.
- **Inventory honesty:** the script walks the scope itself (never following links/junctions out of it; skipped boundaries are counted against completeness) and reports `inventory: {source, complete, scanned}`.
- **Exit codes:** `0` ran, zero findings (qualified-clean) · `1` ran, findings present · `2` operational error · `3` target/scope resolution error.

## Checks

| Check | Named source | Finding classes |
|---|---|---|
| `owner-declaration` | [`ownership.md` — Eligibility and ownership](../map-rules/references/ownership.md#eligibility-and-ownership) | missing-owner · multiple-owners · root-declares-owner |
| `reciprocal-spine` | [`ownership.md` — Eligibility and ownership](../map-rules/references/ownership.md#eligibility-and-ownership) | spine-drift-mapside · dangling-owner |
| `address-form` | [`naming.md` — Address rules](../map-rules/references/naming.md#address-rules) and [`lyt.md` — Cross-vault references](../map-rules/references/lyt.md#cross-vault-references) | bare-duplicate-basename · ambiguous-target · raw-cross-vault-wikilink |
| `meta-container` | [`frontmatter.md` — Additional constraints](../map-rules/references/frontmatter.md#additional-constraints) and [`ownership.md` — Shared meta](../map-rules/references/ownership.md#shared-meta) | parse-error · duplicate-key · malformed-map-value · legacy-owner-key |
| `archive-consistency` | [`lifecycle.md` — Currentness and archive evidence](../map-rules/references/lifecycle.md#currentness-and-archive-evidence) | missing-callout · signal-disagreement · unsignalled-archive |
| `case-fold-collisions` | [`naming.md` — Sibling case-fold collisions](../map-rules/references/naming.md#sibling-case-fold-collisions) | case-fold-collision |
| `exclusion-integrity` | [`ownership.md` — Managed artifacts](../map-rules/references/ownership.md#managed-artifacts) and [`ownership.md` — Excluded subtrees](../map-rules/references/ownership.md#excluded-subtrees) | malformed-exclusion · mapside-coverage-missing |
| `link-contract-grammar` | [`link-resolution.md` — Scope-contract grammar](../map-rules/references/link-resolution.md#scope-contract-grammar) | malformed-contract |
| `link-occurrence-closure` | [`link-resolution.md` — Terminal classes and closure](../map-rules/references/link-resolution.md#terminal-classes-and-closure) | occurrence-closure-broken |

**Not checked, reported every run:** prose quality; semantic roles in free-form maps; earned-scope judgment; whether an undeclared tree should be organized; tag semantics beyond syntax; positive cross-vault validity; frontmatter-contained links; optional lifecycle-value legality; snapshot exemptions; the eight-field frontmatter ceremony; qualified Lyt-vault target resolution; and work state.

## Bundled checker boundary

The companion implements the named checks above, with address-form limited to owner resolution, duplicate-basename ambiguity, and raw cross-vault prohibition. It independently parses link declarations and resolves the eleven terminal occurrence classes from [`link-resolution.md`](../map-rules/references/link-resolution.md). A cap before inventory closure returns typed `check-incomplete` exit `2`, never clean. `map-scan` and `map-check` share named semantics but no implementation; normalized-record disagreement is evidence.

Not implemented: optional lifecycle values, eight-field ceremony, snapshot pairs, automatic discovery of scope-local instructions, Unicode/Obsidian heading-slug normalization, embed-specific semantics, and qualified-Lyt-vault resolution. Narrowing the declared boundary requires explicit review.

## Suppression sources — exactly two

M3 declarations in the scope contract, and Handler-confirmed rulings persisted in the style record. **Raw prose suppresses nothing.** Every suppression is listed in the output with its provenance.

## Agent duties around the script

Run it and relay its verdict intact. Never upgrade "clean for these checks" into "all clear". Lead with DEGRADED mode or incomplete inventory. Route findings to the Handler through `map-this` or `map-maintain`.

If Node.js or the exact checker companion is unavailable, no deterministic map-check verdict exists. A separate review may follow the selected `map-rules` references, but label it `MANUAL REVIEW — not a map-check verdict`, state its exact inventory and omissions, and never issue qualified-clean language.

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
