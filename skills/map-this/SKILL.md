---
name: map-this
description: Plan and organize a bounded folder, project, or vault using map-rules; audit first, show simple proposals, and apply only selected changes. Trigger when the Handler says "organize this scope", "map this project", or "housekeep this vault".
visibility: public
self-improvable: true
requires-skills:
  - map-rules
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

Plan, audit, and organize one bounded folder, project, or vault into a navigable map graph, including unstructured data. A pile of files with no organization is the native `SETTLE` case, and ingestion ends with data mapped rather than loose. The audit is read-only; no mutation occurs before a displayed plan and Handler selection. **The first value is always a zero-write assessment**: the verdict from [`scope.md` — Elasticity pre-flight](../map-rules/references/scope.md#elasticity-pre-flight), findings, and proposal table. Changes happen only as selected rows.

Additional proposal classes this workflow owns: **README care** (OWNERSHIP FIRST: a generated, legal, templated, or M3-managed README is not casually editable — check before proposing anything; then assess the README; propose ADDITIVE improvements only — links-to-maps, hot points — preserving the author's prose, ordering, and voice; existing house convention statements are pre-flight evidence, and once Handler-confirmed they persist as rulings that suppress re-litigation permanently); **House Rules authoring** (create or revise the root map's House rules section; graduate it to `<scope>-rules.md` when earned); **shortcuts, asked once** (nominate hot-point candidates by labeled judgment, ask the Handler ONCE which nodes need fast access, persist selected answers in the scope contract); **born-mapped creation** (any new-file or ingestion flow proposes file + owning map + member section as ONE approved set).

**Base kernel:** load and obey [`map-rules`](../map-rules/SKILL.md) — every rule there governs every phase here. This file adds the workflow, environment branches, authority matrix, and pilot rubric.

**Optional companion:** use [`map-check`](../map-check/SKILL.md) when its bundled checker is available. Its absence does not weaken the required `map-rules` dependency and never turns manual review into a deterministic verdict.

## Environment branches

Resolve registration, the branch, and permitted discovery in Phase 1 before dispatching either scanner or checker; state the evidence and branch in the plan. The scope is a **registered Lyt vault** if `lyt vault info --by-path <path>` resolves it or `.lyt/vault.yon` exists at the vault root. Lyt operations are **callable** if the `lyt` CLI answers on this machine. Treat registration as non-Lyt only when established; an unavailable or inconclusive registration check is **unknown**, not non-Lyt. For unknown registration, or when permitted enumeration is unavailable, use only exact authorized evidence or a disclosed sampled/manual incomplete review; never fall back to recursive filesystem discovery.

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

Before any scanner or checker dispatch, establish that the environment and local discovery policy permit its recursive filesystem walk. Registered Lyt vaults, unknown registration, and unavailable permitted enumeration never fall back to that walk. Use documented allowed Lyt discovery or exact authorized paths; a Handler manifest is evidence, not input to the current path-walking scanner. When permitted filesystem enumeration is established and Node is available, resolve this skill's directory and run `node "<map-this-skill-dir>/references/tools/map-scan.mjs" "<path>" --json`. Retain the JSON envelope for the ledger; text output is a summary and insufficient for leaf accounting. Inventory status, fingerprints, caps, and exact leaf identities qualify all subsequent claims. PARTIAL or BOUNDED never supports complete coverage. The scan emits observations and CANDIDATES only, not semantic classifications, exclusions, or authority. The elapsed cap is not a proven end-to-end deadline; bound and monitor execution independently. When the permitted scanner cannot run, use only authorized evidence; distinguish an exact named inventory from a sample and disclose any unknown or omitted scope.

**Link resolution:** load and apply [`link-resolution.md`](../map-rules/references/link-resolution.md). When permitted and run, `map-scan` emits observed occurrence records and comparison fingerprints; the optional `map-check` companion recomputes them independently. A closed observed class count alone does not establish complete resolution. Accept convergence only at the record level under identical resolution-inventory, contract, and governed-boundary-target fingerprints. Surface disagreement. **Detect the contract entrypoint** through [`scope.md` — Organized-scope evidence](../map-rules/references/scope.md#organized-scope-evidence): when `.myk/README.md` exists, its `m1` and `m3` declarations govern; when another valid marker resolves an exact root map, record its scope-relative locator for Phase 3 and discovery is `DEGRADED`; otherwise no organized-scope marker exists. Ask only questions that change placement, naming, lifecycle, authority, or audit completeness. Establish a scope as one selected set: declared root map, initial curated membership, and selected `m3` entries.

### Phase 2 — preflight plan

Before mutation, show:

- exact scope and environment branch;
- organized-scope marker;
- discovery source and permission: permitted filesystem scan JSON, documented Lyt inventory (verify `lyt vault backfill --dry-run --json` enumerates ALL scanned paths; aggregate counts are insufficient, and a deficient-files-only list is SAMPLED), exact Handler manifest, or sampled search; `vault info` fileCount includes non-figments and is not the denominator;
- where available, the scanner inventory fingerprint, exact leaf paths and total, separate M3 and system-boundary evidence, and the four terminal coverage buckets: ASSESSED, EXCLUDED, RESIDUAL, and UNREADABLE; otherwise disclose the missing ledger evidence;
- a warning when the scope contains `SKILL.md` or another artifact governed by [`ownership.md` — Managed artifacts](../map-rules/references/ownership.md#managed-artifacts);
- read-only audit operations;
- proposed mutation classes;
- file cap, finding cap, semantic-proposal cap, output cap, elapsed-time cap, and stop condition (defaults unless the Handler sets otherwise: 50 files, 30 findings, 10 semantic proposals per page, 30 minutes);
- non-goals and Handler selection point.

If the source is search-derived, label the audit sampled and prohibit exhaustive orphan, reachability, or denominator claims.

### Phase 3 — read-only audit

**Single-engine boundary:** only after Phase 1 establishes permission for the checker's recursive filesystem discovery, when the `map-check` checker companion exists and Node can run it, Phase-3 conformance auditing delegates to it and this workflow consumes its qualified findings. For a valid non-contract organized-scope marker, pass the Phase-1 scope-relative root locator as `--root-map <scope-relative-root-map>` so the checker runs in `DEGRADED` mode. A manual review over the scanner inventory is permitted only when Phase 1 found no organized-scope marker and the checker returns the exact `no-declared-scope` error; label it `MANUAL REVIEW — not a map-check verdict` and never present it as a `map-check` result. Any other checker error envelope blocks deterministic conformance: surface it intact and make no manual cleanliness claim. When permitted discovery, the checker, or Node is unavailable, use permitted evidence for the separately labeled manual-review fallback; disclose unknown or omitted scope. Report both the checks actually reviewed and the not-reviewed list. Never imply deterministic conformance or full scope coverage without the required proof.

Audit only the inventory actually established: frontmatter, filename class, title independence, map ownership, reciprocal membership, placement ambiguity, map usefulness, tag drift, shortcuts, rollup need/staleness, archive signal/leakage, and broken or ambiguous links. Also review [`ownership.md` — Managed artifacts](../map-rules/references/ownership.md#managed-artifacts), [`ownership.md` — Excluded subtrees](../map-rules/references/ownership.md#excluded-subtrees), [`ownership.md` — Shared meta](../map-rules/references/ownership.md#shared-meta), successor and snapshot evidence under [`lifecycle.md` — Currentness and archive evidence](../map-rules/references/lifecycle.md#currentness-and-archive-evidence), and [`naming.md` — Sibling case-fold collisions](../map-rules/references/naming.md#sibling-case-fold-collisions). Case-fold collisions block the related rename or move proposal and authorize no repair. Treat a root map missing useful title frontmatter plus forced downstream pipes as one coupled finding.

A documented Lyt inventory or exact Handler-supplied manifest can define authorized evidence, but neither is an input mode for this scanner. Manual review may report supported counts and metrics over an exact named authorized manifest or documented allowed inventory, with provenance, assessed subset, and omissions. A sample or unknown wider inventory remains incomplete; do not extrapolate to the wider scope or claim scanner COMPLETE or deterministic conformance without their required proof. Filesystem enumeration is not a fallback inside a registered Lyt vault or when registration is unknown.

### Coverage ledger and verdict contract

For a permitted filesystem scan, use the JSON `inventory.leaf_paths` as the main inventory denominator and preserve its membership fingerprint, algorithm/version, numeric `inventory.files` count, and scan status. Confirm the identities and count agree. M3 exclusions are already within those main leaves; reconcile the complete `resolution.ledgers.inventory_boundaries.m3_excluded` list against them. `inventory.system_excluded` is separate boundary accounting, not additional main-inventory leaves: retain its exact members, boundaries, unreadables and truncation status without double counting. A summary, omitted leaf identity, or incomplete boundary evidence cannot support COMPLETE. Without this scanner ledger evidence, disclose that the scanner denominator and COMPLETE verdict are unavailable; an exact authorized manifest or documented allowed inventory may support a named evidence-bound denominator and measured metrics as described above. Every main-inventory leaf receives **exactly one** terminal ledger outcome; the buckets are disjoint and exhaustive:

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

- **COMPLETE** only when all exact main leaf and applicable exclusion identities are present, system boundaries are fully accounted for, the equation closes against an unchanged inventory fingerprint, the scanner itself is complete, and both RESIDUAL and UNREADABLE are zero;
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

A dedicated proposal class — **declare exclusion** (usually LOW): one `.myk/README.md` `m3` entry may cover an exact machine-owned subtree under [`ownership.md` — Excluded subtrees](../map-rules/references/ownership.md#excluded-subtrees). For an append-only communications or queue tree, propose one declaration rather than per-file archive writes. Where no scope contract exists, create it only within the approved establishment set, or keep the exclusion audit-scoped.

#### Link healing and enrichment proposals

Repair rows own defective addresses; **enrichment** rows express NEW semantic intent and are reported separately, generated only AFTER selected healing, targeted re-resolution, fingerprint check, graph rebuild, and cluster analysis — never from the raw graph. All rows are Handler-selected; no evidence grade or threshold ever authorizes mutation. **Accepted-row reasons stand alone:** every `accepted-external` / `accepted-unresolved` contract row states the full decisive fact in its own reason string — the condition that makes the acceptance correct (existence, permanence, externality, or illustrative nature) — never inheriting truth from sibling wording or from session context. A reason that is only true if you were present when it was written is a defect, not a style choice.

Repair classes (each cites its occurrence case file and evidence):

- **`create-alias-at-target`** — An alias write may serve K links to one dead name after exact alias-collision, case-fold, concept-note and containment checks, but both deterministic engines omit all alias resolution. Verify it in the named consumer and report that observation with its scope and limits, or propose supported retargeting. A confirmed no-repair ruling is a separate manual disposition naming its source and affected occurrences, invalidated by inventory/target/alias/contract drift. Keep raw missing/ambiguous deterministic records visible; never report alias healing as deterministic resolution.
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
8. Re-run or revalidate the inventory fingerprint after the selected changes. Drift changes the completion verdict to BLOCKED until the inventory is refreshed through the permitted discovery route and the ledger is reconciled; never carry a pre-change denominator forward silently.
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

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): apply its signal taxonomy and threshold to this run; surface any surviving proposal for handler approval. Conservative — silent otherwise. Never auto-apply.
