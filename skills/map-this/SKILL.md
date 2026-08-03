---
name: map-this
description: Plan and organize a bounded folder, project, or vault using map-rules; audit first, show simple proposals, and apply only selected changes. Trigger when the Handler says "organize this scope", "map this project", or "housekeep this vault".
visibility: public
self-improvable: true
triggers:
  - "/map-this"
  - "organize this scope"
  - "map this project"
  - "housekeep this vault"
next-skills:
  - skill: map-rules
    phrase: "/map-rules"
    why: "Reload the organization kernel these workflows apply."
  - skill: cold-review
    phrase: "/cold-review"
    why: "Get outside review of a completed organization pass before broad rollout."
---

# /map-this

Plan, audit, and organize one bounded folder, project, or vault into a navigable map graph — including structuring UNSTRUCTURED data: a pile of files with no organization is the native case (the SETTLE verdict), and ingestion flows end with data arriving mapped, never loose. Fires on the Handler's organize/housekeep phrases or explicit `/map-this` (Handler decision 2026-07-30: model invocation enabled — the safety boundary is inside the workflow, not at the door). The audit is read-only; no mutation occurs before a displayed plan and Handler selection. **The first value is always a ZERO-WRITE assessment** — the pre-flight verdict (ADOPT/OFFER/SETTLE/ASK per the map-rules elasticity section, Handler-confirmed) plus the findings and proposal table; changes happen only as selected rows.

Additional proposal classes this workflow owns: **README care** (OWNERSHIP FIRST: a generated, legal, templated, or M3-managed README is not casually editable — check before proposing anything; then assess the README; propose ADDITIVE improvements only — links-to-maps, hot points — preserving the author's prose, ordering, and voice; existing house convention statements are pre-flight evidence, and once Handler-confirmed they persist as rulings that suppress re-litigation permanently); **House Rules authoring** (create or revise the root map's House rules section; graduate it to `<scope>-rules.md` when earned); **shortcuts, asked once** (nominate hot-point candidates by labeled judgment, ask the Handler ONCE which nodes need fast access, persist selected answers in the scope contract); **born-mapped creation** (any new-file or ingestion flow proposes file + owning map + member section as ONE approved set).

**Base kernel:** load and obey [`map-rules`](../map-rules/SKILL.md) — every rule there governs every phase here. This file adds the workflow, environment branches, authority matrix, and pilot rubric.

## Environment branches

Resolve the branch in Phase 1 and state it in the plan. Decision procedure: the scope is a **registered Lyt vault** iff `lyt vault info --by-path <path>` resolves it (or `.lyt/vault.yon` exists at the vault root); Lyt operations are **callable** iff the `lyt` CLI answers on this machine; otherwise it is a non-Lyt vault (branch 3).

### Registered Lyt vault with callable documented operations

- Resolve the exact qualified vault; never guess from cwd.
- Read `localWritable`. If false, do not write in place; offer the governed redirect to an owned home vault.
- Create durable Figments through the Lyt-owned capture operation, then join the new note to the approved map in the same disclosed change set.
- Discover semantically through Lyt search/recall; open only exact returned paths.
- After an approved edit to an existing Figment, use `lyt capture --index-only <vault-relative-path> --vault <qualified-vault>` when callable. If it defers or is unavailable, report indexing deferred; do not run broad reindexing automatically.

### Registered Lyt vault without callable Lyt operations

- Do not bypass capture, discovery, localWritable, or indexing rules.
- Perform only reads of exact Handler-supplied paths that policy permits.
- Return a plan or proposal and identify the unavailable Lyt capability; do not mutate.

### Non-Lyt Markdown or Obsidian vault

- Follow the vault's local write and discovery policy.
- Use the same eight-field contract only when the Handler chooses Lyt-compatible notes for that scope; otherwise the host vault's own frontmatter contract governs (kernel frontmatter rules are scoped accordingly — only `meta.map`/`meta.archived` are required in every organized scope).
- Maintain `modified` on approved material edits when the vault has no owning write workflow.
- Never claim Lyt indexing, visibility, synchronization, or provenance.

## Workflow

### Phase 1 — establish scope

Accept the Handler's scope, detail, exclusions, priorities, exact root or owner map, and any supplied file manifest. Resolve the environment branch.

**Run the bundled scanner FIRST — the moment the path is known:** `node references/tools/map-scan.mjs <path> [--json]` (read-only, deterministic, bounded; PARTIAL is labeled, never silent). Its inventory fingerprint and totals are the run's denominators: every later verdict, proposal page, and completion report carries them, and judgment is spent on what things MEAN, never on discovering what is there. The scan emits observations and CANDIDATES only (heavy nodes, machine trees, inbox/thread runs, filename families, orphan case files, upward-chain defects) — each with its deterministic rule; no scan signal classifies, excludes, or authorizes anything by itself. A scope whose scan is PARTIAL caps every downstream claim to the scanned subset by name.

**Link resolution rides the scan (the v2.4 link-resolution rider):** every observed link occurrence lands in exactly ONE of eleven terminal classes (`resolved-file/-heading/-block/-nonmarkdown`, `missing-file/-heading/-block`, `ambiguous`, `accepted-external`, `accepted-unresolved`, `residual-at-cap`) whose sum equals the observed occurrences, plus two separate LEDGERS — `creation_queue` (missing names ranked by inbound count) and `inventory_boundaries` (excluded/unreadable/boundary paths). Resolution obeys the scope contract's declared link dialects (grammar-strict, fail-closed — any contract error voids all declarations and caps the scan status) and is pinned to the inventory, contract, and governed-boundary-target fingerprints. `map-check` recomputes the same contract with independent code; the two tools' normalized records disagreeing is evidence to surface, never to suppress. **The completion bar is record-level convergence:** the two tools agree only when their normalized occurrence records converge under identical inventory/contract/governed-target fingerprints — paired exit 0, equal record counts, or matching class tallies are explicitly insufficient evidence of agreement. **Detect the contract entrypoint:** when `.myk/README.md` exists at the scope root, read its `m1` (scope identity, the declared root map — the scope's navigation entrypoint) and `m3` (exclusions and managed artifacts) as the governing declarations; when absent, discovery is DEGRADED (kernel markers 1–3 plus audit-scoped Handler-established exclusions) and the plan states so. Ask only questions that change placement, naming, lifecycle, authority, or audit completeness. **Establishing a new organized scope = the declared root map + its initial curated membership + any selected M3 entries as ONE approved set.**

### Phase 2 — preflight plan

Before mutation, show:

- exact scope and environment branch;
- organized-scope marker;
- discovery source: documented Lyt inventory (verify `lyt vault backfill --dry-run --json` enumerates ALL scanned paths — aggregate counts are insufficient; if it lists only deficient files, the run is SAMPLED), exact Handler manifest, or sampled search — sampled runs label every metric sampled and claim no denominators (note: `vault info` fileCount includes non-figments and is NOT the denominator);
- the scanner inventory fingerprint, canonical leaf-path total, and the four terminal coverage buckets the completion report will carry: ASSESSED, EXCLUDED, RESIDUAL, and UNREADABLE;
- a warning when the scope contains `SKILL.md` or other managed artifacts (backfill hazard, kernel rule 2b);
- read-only audit operations;
- proposed mutation classes;
- file cap, finding cap, semantic-proposal cap, output cap, elapsed-time cap, and stop condition (defaults unless the Handler sets otherwise: 50 files, 30 findings, 10 semantic proposals per page, 30 minutes);
- non-goals and Handler selection point.

If the source is search-derived, label the audit sampled and prohibit exhaustive orphan, reachability, or denominator claims.

### Phase 3 — read-only audit

**Single-engine boundary:** when the `map-check` validator exists, Phase-3 conformance auditing DELEGATES to it and this workflow consumes its qualified findings. Until then, the interim audit below aligns to the accepted map-check catalog (C1–C10 semantics) and its report states BOTH the checks actually run AND the not-checked list — never an implied full sweep.

Audit only the inventory actually established: frontmatter, filename class, title independence, map ownership, reciprocal membership, placement ambiguity, map usefulness, tag drift, shortcuts, rollup need/staleness, archive signal/leakage, and broken or ambiguous links. Also: managed-artifact detection (backfill dry-run nominates; Handler confirms — kernel rule 2b); exclusion coverage (declared vs undeclared machine-owned subtrees, rule 2c); `meta`-writer collision risk (rule on shared `meta`); successor-side `meta.supersedes`/`meta.merges` scan (findings only, rule 11); snapshot-pair candidates (rule 11b); case-fold sibling-folder collisions (Windows-invisible, breaks case-sensitive peers over lyt-git — blocks related rename/move proposals pending Handler resolution, never authorizes repair); root-map-missing-frontmatter ↔ downstream-forced-pipes as one paired finding.

For exhaustive metrics, require a documented Lyt inventory or an exact Handler-supplied manifest. Filesystem enumeration is not a fallback inside a registered Lyt vault.

### Coverage ledger and verdict contract

The scanner's canonical leaf-path inventory is the one finite denominator for the run. Preserve its fingerprint, algorithm/version, path count, and scan status. Every in-scope leaf path receives **exactly one** terminal ledger outcome; the buckets are disjoint and exhaustive:

- **ASSESSED** — the run inspected the path for every check claimed to cover it;
- **EXCLUDED** — an exact Handler-established or M3-governed leave-alone rule covers the path, and the report shows the exclusion source plus its exact expanded path manifest;
- **RESIDUAL** — the path is readable and in scope but was not assessed because a declared cap, time bound, deferral, or other bounded stop was reached;
- **UNREADABLE** — the path could not be safely read or parsed enough to assess, with the exact failure recorded.

Directories, rollups, subtree declarations, candidate groups, and summary rows never count as additional members. They may summarize leaf rows only. The accounting invariant is:

```text
ASSESSED + EXCLUDED + RESIDUAL + UNREADABLE = INVENTORY
```

No ignored, skipped, sampled, or “leave alone” path may disappear outside those four buckets. A subtree declaration may compress display, but its exact scanner-expanded members remain a shown manifest and contribute individually to EXCLUDED. Scanner observations and candidates never assign a semantic terminal outcome by themselves.

Verdicts are mechanical consequences of the ledger:

- **COMPLETE** only when the equation closes against an unchanged inventory fingerprint, the scanner itself is complete, and both RESIDUAL and UNREADABLE are zero;
- **PARTIAL** when the equation closes but RESIDUAL is nonzero because a disclosed bounded stop prevented assessment;
- **BLOCKED** when the inventory or fingerprint cannot be established, drift invalidates the snapshot, any path is UNREADABLE, or the equation does not close.

Every finding, metric, proposal, and “no issue” claim names the exact ASSESSED subset that supports it. EXCLUDED proves governed non-assessment, not conformance. RESIDUAL and UNREADABLE support no cleanliness claim.

### Phase 4 — simple proposals

One proposed change per row, grouped by risk, presented in a fenced block. Low mechanical proposal:

```text
LOW — Normalize exact duplicate tag spelling
  Why: The established scope form already exists.
  Impact: Two exact files; no semantic or placement change.
```

Medium/high semantic proposal:

```text
HIGH — Archive the superseded launch plan
  Why: Two plans currently compete in ordinary navigation.
  Evidence: ...
  Counterevidence: ...
  Alternatives: Keep both current | archive candidate A | leave unresolved
  Uncertainty: ...
  Impact: exact files, maps, declarations, and links
```

A dedicated proposal class — **declare exclusion** (usually LOW): one `.myk/README.md` M3 entry covering N machine-owned files is the anti-churn move; the honest answer for an append-only comms/queue tree is one declaration, never N archive writes. Where the scope has no `.myk/` yet, the contract entrypoint is created as PART of the one approved establishment set (contract + declared root map + initial curated membership + selected M3 entries — never piecemeal), or the exclusion is recorded audit-scoped per kernel rule 2c.

#### Link healing and enrichment proposals

Repair rows own defective addresses; **enrichment** rows express NEW semantic intent and are reported separately, generated only AFTER selected healing, targeted re-resolution, fingerprint check, graph rebuild, and cluster analysis — never from the raw graph. All rows are Handler-selected; no evidence grade or threshold ever authorizes mutation. **Accepted-row reasons stand alone:** every `accepted-external` / `accepted-unresolved` contract row states the full decisive fact in its own reason string — the condition that makes the acceptance correct (existence, permanence, externality, or illustrative nature) — never inheriting truth from sibling wording or from session context. A reason that is only true if you were present when it was written is a defect, not a style choice.

Repair classes (each cites its occurrence case file and evidence):

- **`create-alias-at-target`** — K broken links to one dead name heal with ONE alias write on the surviving target, after exact alias-collision, case-fold, concept-note, and containment checks. Links resolving through a working alias get **`no-repair-needed`** — a fingerprint-bound cached verdict (invalidated by inventory/target/alias/contract drift), never re-flagged.
- **`retarget`** — evidence-laddered: `STRONG` (unique contained candidate + exact declared transformation or exact alias, no collision, matching fingerprints) · `MEDIUM` (unique candidate + ≥2 independent evidence families among locator/alias, resolved-neighborhood, content/fragment) · `WEAK` (one heuristic family — displayable, never preselected) · `ABSTAIN` (ambiguity, collision, root escape, unstable cluster, conflicting interpretations, stale fingerprints). **Deduplicate the proposal queue by raw missing target — many occurrences and many old names may converge on one target; never force one-to-one assignment.**
- **`disambiguate-ambiguous`** — a ranked candidate menu per ambiguous target, always including the hub/disambiguation-note alternative.
- **rewrite vs typed forwarding** — decided per case by MEASURED raw-target fan-in shown to the Handler; rewrite is the closed-world default; a tombstone/forwarder is typed, dated, names its successor, and never chains.
- **`tag-and-defer`** — disposition metadata on `accepted-unresolved` (dated, attempt-marked, queryable), never a resolver truth class.
- **creation queue** — missing names ranked by inbound count (demand nominates creation; low-count red links are kept, not defects); check alias/variant titles before proposing a new note.
- **coupled change sets** — a move/rename plus EVERY selected referrer rewrite is ONE preimage-checked, per-edit-annotated, resume-safe proposal set, never independent rows. **`alias-chain-collapse`** may auto-execute ONLY as the mechanical half of an already Handler-selected exact set, under the existing preimage and resume rules.

Enrichment (separate report): bounded 2-hop candidate generation → resolved-component boundary filter (v1 cluster = the deterministic connected component of the rebuilt resolved Markdown graph) → evidence ladder → ranked suggestion or ABSTAIN. No stable component means ABSTAIN, never graph-wide widening. Every numeric threshold prints as a calibration HYPOTHESIS pending a hand-graded set. `verify-drifted-target` remains a deferred content-integrity track — no field, class, or network behavior here.

Every proposal supports accept, reject, modify, defer, and leave unresolved. Paginate when the proposal cap is reached.

### Phase 5 — apply selected set

1. Restate the exact selected files and mutations.
2. Re-read target preimages and abort to refresh if any changed since audit.
3. Resolve every write target and `lstat`-check the leaf plus parent chain. Refuse symlinks, junctions, mount points, name-surrogate reparse points, and unknown reparse points. Do not delete content. Creating or modifying `.myk/README.md` is always a semantic change requiring explicit Handler selection, applied preimage-checked and resume-safe like any owner-declaration set.
4. For a new member pair, create/capture the member first, then perform the approved bounded insertion into the designated owner-map section.
5. Make each step idempotent. If interrupted after one approved half, resume only the missing half under the original approval after verifying the existing effect and unchanged target; do not request a duplicate semantic decision.
6. If overlapping agent activity or target drift is detected, stop and refresh the proposal rather than merging semantic intent.
7. Use only the environment branch's documented index handoff.
8. Re-run or revalidate the inventory fingerprint after the selected changes. Drift changes the completion verdict to BLOCKED until the inventory is refreshed and the ledger is reconciled; never carry a pre-change denominator forward silently.
9. Return changed paths, deferred items, unresolved ambiguity, indexing result, checks performed and not performed, inventory fingerprint, all four ledger counts, the exact equation, terminal verdict, and the shown manifests for EXCLUDED, RESIDUAL, and UNREADABLE. A COMPLETE report with hidden paths or an unclosed equation is invalid.

## Authority matrix

| Automatic | Handler-selected |
|---|---|
| Read-only bounded audit | Every edit to an existing file unless already inside an exact approved set |
| Findings and proposals | Rename, move, owner, map structure, purpose, topic, semantic tag change |
| Refusal on ambiguity, drift, unavailable capability, or unsafe path | Shortcut, rollup, archive, lifecycle, successor, visibility, publication |
| Completion of a missing mechanical half of an already approved pair after evidence recheck | Any expansion beyond the selected file and mutation set |
| Exact Lyt-owned index-on-write handoff after an approved write | Deletion, raw Git, Lyt topology, or visibility broadening |

Visibility broadening, publication, destructive deletion, and Lyt topology remain governed by their own stronger protocols even when proposed here.

## Bounded pilot rubric

Pilot one exact project or folder manifest. Select the five orientation sample files before mutation. Record before and after:

- owner-map coverage within the manifest;
- link-hop reachability within the manifest;
- fresh-agent ability to state filename locator, display title, scope, owner, useful neighbors, and root route;
- near-duplicate tags;
- accepted, rejected, deferred, and unresolved proposals;
- renames versus aliases;
- one short repeated Handler navigation-friction rating.

`~0` unowned files and `>=90%` within three hops remain hypotheses, not requirements. Report any scope not covered by the manifest and never generalize the sample to the vault.

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
