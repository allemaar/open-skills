---
name: map-maintain
description: Run one bounded MYK stewardship cycle: map-check, Handler-selected repairs through map-this semantics, then targeted recheck. Trigger on "maintain this map", "tend this graph", or "/map-maintain". Not for autonomous monitoring.
visibility: public
self-improvable: true
requires-skills:
  - map-rules
  - map-check
  - map-this
triggers:
  - "/map-maintain"
  - "maintain this map"
  - "tend this graph"
  - "repair these map findings"
next-skills:
  - skill: map-check
    phrase: "/map-check"
    why: "Run a later read-only health check without entering another repair cycle."
---

# /map-maintain

Run one explicit, bounded stewardship cycle for an existing Map Your Knowledge (MYK) scope:

```text
map-check → findings → Handler selection → map-this apply semantics → targeted recheck
```

This skill is invoked work, never a daemon, schedule, watcher, background loop, or authority to repair future findings. It never reads, infers, records, or reports work-state. It does not replace `map-check` or `map-this`: it composes their accepted boundaries into one controlled maintenance pass.

> **Protocol provenance.** MYK v2.4 comes from [`map-rules/SKILL.md`](../map-rules/SKILL.md) and its routed references. Checking comes from [`map-check/SKILL.md`](../map-check/SKILL.md) and its required checker companion. Mutation semantics come from [`map-this/SKILL.md`](../map-this/SKILL.md).

**Base kernel:** load and obey [`map-rules`](../map-rules/SKILL.md). Use [`map-check`](../map-check/SKILL.md) as the single read-only conformance engine. Any selected mutation inherits the apply and environment rules in [`map-this`](../map-this/SKILL.md); this skill grants no broader write authority.

**Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## Preconditions and bounds

- Start only from an explicit invocation naming the target scope or path, from the Handler or from an agent whose current task plainly requires a maintenance cycle. Never auto-trigger from elapsed time, repository activity, a schedule, or a prior finding; the Handler selection gate before mutation remains unchanged.
- Resolve the exact governing scope and its contract before checking. Ambiguity, target drift, missing declaration, or a `map-check` operational/resolution error stops the run without mutation.
- Show the bounded run before execution: target, discovery mode, inventory source, file cap, finding cap, proposal page cap, elapsed-time cap, stop condition, and the Handler selection point. Defaults: 50 files, 30 findings, 10 proposals per page, 30 minutes, one repair-and-recheck round.
- Preserve every `map-check` qualification: checks run, not checked, exclusions honored, skipped boundaries, inventory completeness, mode, and discovery source. Never upgrade a partial or qualified result into an all-clear.

## One maintenance cycle

### 1. Check

Run `map-check` read-only against the exact target. If it reports zero findings, relay its qualified-clean verdict and stop. If it returns findings, preserve their stable fields and continue. If it returns an error envelope, stop and surface the remedy; absence of findings in an error is not evidence of health.

### 2. Prepare repair proposals

Translate confirmed findings AND the check's normalized resolution occurrence records/case files into simple `map-this`-shaped proposal rows — a missing or ambiguous link occurrence is a healing source even when it is not a conformance finding (an undeclared scope's broken links are occurrences, not C-findings). Every row stays case-bound to its exact finding or occurrence record; the no-creep rule is unchanged. Each row names the finding, exact files, exact mutation, why it repairs that finding, risk, uncertainty, and impact on maps, declarations, and links. Do not add cleanup, beautification, migration, lifecycle, archive, rename, or restructuring work merely because the scope is open.

Group coupled halves as one proposal: member ownership plus owner-map membership; archive metadata plus callout plus map relocation; rename/move plus every affected declaration and link. Preserve M3 exclusions and managed surfaces. A finding never authorizes its own repair.

Link-healing findings use the occurrence contract in [`link-resolution.md`](../map-rules/references/link-resolution.md) and the proposal classes owned by [`map-this` — Link healing and enrichment proposals](../map-this/SKILL.md#link-healing-and-enrichment-proposals): `create-alias-at-target`, evidence-laddered `retarget`, `disambiguate-ambiguous`, rewrite-versus-typed-forwarding by measured fan-in, `tag-and-defer`, fingerprint-bound `no-repair-needed`, and inbound-ranked creation queues. Enrichment follows selected healing, targeted re-resolution, and graph rebuild as a separate report; without a stable resolved component it abstains. `alias-chain-collapse` may execute only as the mechanical half of an already Handler-selected exact set.

### 3. Handler gate

Offer accept, reject, modify, defer, or leave unresolved for every row. No mutation occurs until the Handler selects an exact set. Restate that set before applying it. Selection does not authorize expansion to neighboring findings.

### 4. Apply through map-this semantics

For the selected set only:

1. Re-read every target preimage; stop and refresh if any changed.
2. Resolve each write target and `lstat`-check the leaf and parent chain; refuse symlinks, junctions, mount points, name-surrogate reparse points, and unknown reparse points.
3. Respect the resolved environment branch and all Lyt ownership boundaries. Never edit `.lyt/`, use raw vault Git, broaden visibility, publish, delete, or mutate topology.
4. Apply coupled changes atomically where possible and idempotently always. On interruption, resume only a missing approved half after re-verifying the existing effect and unchanged target.
5. A selected move/rename applies as ONE coupled change set with every selected referrer rewrite — preimage-checked, per-edit-annotated, resume-safe; healing writes inherit these rules unchanged and gain no new authority.
5. Stop on overlapping agent activity, preimage drift, new ambiguity, or any required mutation outside the selected set.

### 5. Targeted recheck and stop

Re-run only the checks and affected inventory needed to decide whether the selected findings were repaired. Do not restart a broad audit on unchanged inputs. Report repaired, remaining, deferred, and newly exposed findings separately; preserve the checker's qualifications and name checks not run.

The invocation ends after this one targeted recheck. It never chains into another repair round automatically. Remaining work needs a new explicit Handler invocation.

### 6. Enrichment suggestions (suggestion-only, separate report)

After the targeted recheck — and only when selected healing applied, re-resolution ran, fingerprints held, and the graph was rebuilt — generate link-enrichment SUGGESTIONS per map-this's owning section: bounded 2-hop candidates, filtered to the resolved connected component, evidence-laddered, ABSTAIN without a stable component. Suggestions express NEW intent, carry zero mutation authority, and are reported separately from repair; acting on any of them requires a new explicit Handler invocation. When this cycle's bounds are spent, hand enrichment off to a later bounded invocation by name rather than running it degraded.

## Completion report

Return:

- exact scope, mode, and inventory boundary;
- original findings and Handler dispositions;
- changed paths and index-handoff result, if any;
- targeted recheck command and verdict;
- remaining, deferred, unresolved, or newly exposed findings;
- checks and mutation classes not run.

Never say the graph is healthy without the original qualified `map-check` language.

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
