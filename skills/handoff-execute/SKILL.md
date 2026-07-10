---
name: handoff-execute
description: Execute a handoff brief with enforced source-read discipline — load the brief's @SOURCES.required tier fully before planning, cite sources per plan step, run @OUTCOME.verify after, emit the retro per @GROUND_TRUTH_REQUIRED. Trigger when the user runs /handoff-execute <brief-path>, or pastes the activation phrase emitted by /handoff. Not auto-triggered — the receiving session invokes explicitly. Use /plan-execute for PLAN.md files (different schema); use /handoff to *create* a brief; use /cold-review for outside-agent review, not for executing the work itself.
disable-model-invocation: true
visibility: public
self-improvable: true
next-skills:
  - skill: cold-review
    phrase: "/cold-review"
    why: "For diagnosis-mode briefs especially — fresh reviewers catch coupled-invariant misses (missed call sites, stale SEE ALSO trails, mis-categorized failures) that the executing agent's context bias hides. High-leverage immediately after the first commit lands."
  - skill: insight-critique
    phrase: "/insight-critique"
    why: "Second-assess the cold agent's retro and verdict"
  - skill: github-sync
    phrase: "/github-sync"
    why: "Commit and push the work the cold agent produced"
triggers:
  - "/handoff-execute"
  - "/handoff-execute <brief-path>"
---

# /handoff-execute

Receive a handoff brief in a fresh agent session and execute it end-to-end with a source-ingestion gate before planning, source-cited plan steps, acceptance-verified output, and a ground-truth retro. This is the receiving-side counterpart to `/handoff` — `/handoff` writes the brief, `/handoff-execute` enforces the discipline that turns the brief into ground-truth work.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## Boundary

Use `handoff-execute` to consume a handoff brief produced by `/handoff` (YAML frontmatter `type: handoff` + YON body blocks). Do not use it for:

- `PLAN.md` or `implementation_plan.md` — use `/plan-execute` (different schema, no `@SOURCES` block, no retro requirement).
- A formal post-execution self-gate — use `/verify` (requires intent/plan/execution artifacts; checks for drift).
- Independent outside-agent review of completed work — use `/cold-review` (reviews, doesn't execute).
- Re-verifying one specific claim — use `/double-check`.

`handoff-execute` is the only skill that consumes a handoff brief and produces the canonical retro file.

## Invocation

```
/handoff-execute "<absolute-path-to-brief>"
```

The brief path is required. Always quote the path — Windows vault paths may contain spaces.

**Force flag** — `/handoff-execute --force "<path>"` downgrades the Phase 2 gate from ABORT to WARN, allowing execution to proceed even when one or more `@SOURCES.required` entries fail to read. Intended for async cases where the brief author isn't reachable to amend the brief; surfaced explicitly so it can't be invoked accidentally. The blocked retro is still written for audit.

**Vault path dependency** — Phase 5 writes the retro to `$VAULT/Handoffs/{project}/retros/...` (set `$VAULT` to your vault root). This path is inherited from `/handoff`. If `$VAULT` is unset or the host has no Obsidian vault, the cold agent must override the retro write target via the brief's `output_location` field, or the write will fail and the skill will fall back to chat-only retro emission with a `@WRITE_FAILURE` block (see Phase 5).

## Execution

Five ordered phases, two hard ABORT gates (Phase 2 source-ingestion and Phase 2 premise pre-flight, both in gated mode without `--force`) and three WARN gates (advisory-mode banner, Phase 3 source citation, Phase 3 acceptance coverage).

### Phase 1 — Brief ingest

Read the brief file in full. Parse YAML frontmatter; validate `type: handoff`. Locate the YON blocks in the body:

- `@TASK` — task description + scope paths + evidence pointer
- `@OUTCOME` — acceptance sentence + verify commands
- `@SCOPE` (if present) — forbidden actions + time budget
- `@SOURCES` (if present) — `required` and `optional` source tiers
- `@GROUND_TRUTH_REQUIRED` — retro discipline declaration
- Profile-specific blocks: `@SUBTASKS` (orchestrator), `@CONTINUATION` (new-session)

Emit a one-line confirmation: `Brief loaded: <slug> · profile=<p> · required-sources=<N>`.

### Phase 2 — Source ingestion (two modes)

Mode is determined by what the brief declares:

- **Gated mode** — brief has `@SOURCES.required`, OR legacy `@SCOPE.must_read`, OR an explicit markdown heading matching `Read-first` / `Read these first` / `locked inputs` (a real heading line — not the phrase inside a fenced example). For the markdown case, the required tier = the numbered/bulleted lines under that heading bearing a path or `[[wikilink]]` (lines tagged `(optional)` go to the optional tier). Enumerate the required tier, read each entry fully via the runtime's read tool, gate planning on completion. **Hybrid severity for the markdown case:** ≥1 cleanly-enumerable entry → gated (ABORT-on-fail); a prose-only section with no enumerable entries → downgrade to WARN (can't gate on nothing). *(Many briefs — e.g. Watson's LYT briefs — declare locked inputs this way rather than as a YON block; the gate still fires. The durable producer-side fix is for the brief author to emit `@SOURCES.required` / author via `/handoff`, which already does so — this markdown path is the consumer-side safety net for hand-authored + legacy briefs.)*
- **Advisory mode** — brief has *none* of the above. Scan the brief body for explicit references (`[[wikilinks]]`, absolute paths), read them best-effort, emit a prominent warning, proceed to planning regardless:

  > ⚠ ADVISORY MODE: brief did not declare @SOURCES; no source-read gate enforced. Recommend amending the brief to add @SOURCES.required.

In both modes, emit a checklist:

```
Source ingestion:
  [✓] /c/Projects/x/y.ts                              (read, 142 lines)
  [✓] [[Skills/frontmatter-schema]] → c:/...md        (read, 89 lines)
  [✗] /c/Projects/x/missing.ts                        (NOT FOUND)
```

**Gate (gated mode, no `--force`):** if any `required` source fails to read, halt and write a `verdict: blocked` retro with a `@SOURCE_FAILURES` block listing what couldn't be loaded plus a `@RESUME_HINT` block telling the originating session exactly what brief amendment is needed. Do not proceed to planning. Surface a one-line recovery prompt to the cold agent's runtime user:

> Source ingestion failed in gated mode. Either amend the brief and re-invoke, or re-invoke with `--force` to proceed in degraded mode: `/handoff-execute --force "<path>"`.

**Gate (gated mode, `--force` in effect):** same failure list emitted, but the skill proceeds to Phase 3 with a `degraded mode (--force)` banner. The retro records `@SOURCE_FAILURES` even though execution continued.

**Gate (advisory mode):** the same failure downgrades to WARN — emit the failure list but continue.

**Did-you-mean hint:** on a `[✗]` failure, run a basename search across the parent project and the vault, and surface the top candidate as a non-actionable suggestion: `Source not found: foo.ts. Did you mean: /c/Projects/x/foo.ts?` Do not auto-resolve.

**Drift warning:** for each successfully-read `@SOURCES.required` entry, compare its mtime to the brief's `created:` frontmatter date. The frontmatter has day-granularity; the mtime has second-granularity. Apply a **24-hour tolerance**: only warn if the source mtime is more than 24 hours after midnight of `brief.created`. Format: `Source drifted since brief was written: <path> (modified <duration> after brief.created)`.

**Premise pre-flight (all profiles, gated as a hard ABORT).** A stale brief can describe a world that no longer exists — the work may already be shipped, the named structure may have changed, or the test baseline may have moved since the brief was written. Path *existence* is already checked above; this gate checks the brief's *premises*. Before emitting any plan, reconcile each against the live repo:

- **Git state — "is this already done?"** Run `git log` / `git status` over the brief's scope paths. If commits matching the brief's task (by message, by the set of touched files, or by an explicit SHA the brief names) have already landed, the work may be done or partially done. This is the **strongest** drift signal — halt rather than re-doing landed work.
- **Cited baselines.** If the brief states a concrete number (`463 tests`, `schema v15`, `90 plugin ops`), check it against the current tree. A mismatch means the brief's baseline drifted — surface the stated-vs-actual delta.
- **Structural claims.** Verify the brief's structural assumptions still hold beyond per-source existence — a package it says to *create* doesn't already exist; a file it says is *missing* is actually missing.

Emit a premise checklist (`stated → actual` per premise). If any premise is stale, **halt and write a `verdict: blocked` retro with a `@PREMISE_DRIFT` block** (each drifted premise: stated vs. actual) plus a `@RESUME_HINT` telling the originating session what to amend. Distinguish **already-shipped** (brief is obsolete — stop) from **baseline-drift** (surface and let the runtime user decide). `--force` downgrades premise drift to WARN, identical to the source-ingestion gate.

> This is the general-profile counterpart to the diagnosis-mode **reproduction-first rule** (Phase 4): a diagnosis brief verifies its *failure* still reproduces; every brief verifies its *premises* still hold.

**Verify-command resolvability (WARN, side-effect-free).** A brief can name a *verify* or spot-check command that no longer resolves — most commonly the wrong binary/CLI path. Before emitting any plan, statically reconcile each command in the brief's `verify:` frontmatter (and any "regenerate-and-grep" / spot-check command in the body) against the live repo: confirm the named binary/dist path exists, and that a CLI subcommand resolves (a side-effect-free `--help` probe is allowed; **never run the full verify command here** — it may mutate). On an `unknown command` / `no such file` / `command not found` resolution failure, emit a **WARN with a "did you mean?" hint** (basename/sibling search) and surface the corrected command so Phase 5 runs the right one — **do not abort**: the brief's *task* is still executable; only its verify command is mis-pathed. *(Added after V-DOC-1: the brief's spot-check named `packages/lyt-vault/dist/cli.js agent-manual`, but that verb is registered only in the meta CLI `packages/lyt/dist/cli.js` — the standalone lyt-vault CLI errors `unknown command 'agent-manual'`. The mismatch only surfaced at execution, and a cold reviewer independently re-derived it — two signals for the same Phase-2 gap.)*

`@SOURCES.optional` entries are surfaced in the checklist (so the cold agent knows they exist) but not read in this phase. They are read on-demand in Phase 4 if a plan step calls for them.

### Phase 3 — Plan

Produce a numbered plan that maps each step to (a) the acceptance sub-criterion it addresses and (b) the source(s) supporting it (file:line where possible):

```
1. <action>  →  acceptance: <fragment>  ·  source: /c/Projects/x/y.ts:42
2. <action>  →  acceptance: <fragment>  ·  source: [[Skills/...]]:section
```

**Gate (WARN):** every plan step SHOULD cite at least one source. Uncited steps are flagged for the cold agent's review but don't abort — some steps are pure tooling/setup.

**Gate (WARN — coverage):** `@OUTCOME.acceptance` is a single sentence; the cold agent reasons over its clauses and flags any clause not addressed by at least one plan step. The flag is surfaced for caller review but does not abort — the cold agent's clause parsing is fallible, and a false gap shouldn't block useful work. If a real gap exists, the cold agent must say so explicitly in the plan emission ("clause X not addressed because Y") rather than emit a silent gap. For more rigorous coverage checking, brief authors can rewrite `acceptance` as semicolon-delimited clauses so the cold agent has explicit segmentation to reason against.

### Phase 4 — Execute

Run each plan step in order. **On-demand `@SOURCES.optional` reads are citation-driven, not agent-judgment** — a step triggers a load only if it names a `@SOURCES.optional` entry in its `· source:` citation from Phase 3. The cold agent does not decide ad-hoc to read optional sources outside the plan; if mid-execution it discovers, on its own judgment, that it needs a source not named anywhere in the brief, it halts and surfaces the gap rather than silently expanding scope. This does not cover two narrower cases: a target file the brief's own body prose already names with a file:line citation (open it when the citing plan step executes; note the read in `@DELTA_FROM_BRIEF`), or the brief's prose referencing a fact/decision by name without citing where it lives (read the minimal file needed to resolve the literal reference; flag as a citation gap in `@DELTA_FROM_BRIEF`). Read the specific cited section (not the whole file). Capture for each step: artifacts modified, command outputs, hashes of changed files.

**Diagnosis-mode briefs (`mode: diagnosis` in frontmatter) — reproduction-first rule.** If the brief names specific files as "affected" by a flake/bug, treat the list as a *hypothesis*, not ground truth. Before applying fixes, reproduce the named failure mode and verify each listed file is actually involved. Briefs carry forward stale bisects from prior phases; the actually-affected file set may differ (new file flake-prone, listed file unrelated). Surface any divergence in `@DELTA_FROM_BRIEF` before declaring the fix complete.

**Coupled-constant edits.** If the plan involves touching a constant whose value is duplicated across multiple files (retry budgets, timeouts, page sizes, magic numbers, feature flags), invoke `/audit-coupled-constant` as part of this phase — author-maintained `SEE ALSO` comments are documentation, not enforcement, and one missed site means the trail silently lies.

If a step fails, do not silently retry — emit a partial retro (`verdict: partial`) listing what was completed, what failed, and why.

### Phase 5 — Verify + retro

Run every command in `@OUTCOME.verify` (the brief's frontmatter `verify:` field). Compare results to the acceptance sentence.

**Gate-suite + per-clause mapping.** If the work produced committable code, also run the project's defined gate suite (lint / test / typecheck — whatever the project declares; e.g. `turbo run lint test typecheck` where present) before declaring done — this is the deliberate pre-commit gate, not a speculative auto-run. Then **map each acceptance clause to the specific verification that exercised it**, and report the result **explicitly in the retro** as a `@GATE_STATUS` block: per clause → `verified | unverified | failed`, plus the gate-suite outcome (`pass | fail | skipped — <why>`). An `unverified` clause or a skipped gate is allowed but must be named, not silently omitted — a clean-looking retro with an unstated coverage hole is the failure this prevents.

Write the retro to:
```
$VAULT/Handoffs/{project}/retros/{date}-{slug}-retro.md
```
(Or the brief's `output_location` override if present. See Invocation → Vault path dependency.)

The retro frontmatter and body schema is canonical in [`handoff/SKILL.md` "Retro schema"](../handoff/SKILL.md). Mandatory YON blocks: `@OUTCOME_DELIVERED`, `@GROUND_TRUTH` (with `artifacts_modified` paths+hashes and `git_diff_summary`), `@GATE_STATUS` (per-clause `verified|unverified|failed` + gate-suite outcome), `@DELTA_FROM_BRIEF`, `@RECOMMENDATIONS`, `@VERDICT`. Narrative-only retros are rejected at write time.

Also emit the retro as a chat block — full content if <500 lines, otherwise a summary + path — so the originating session can paste it back for second-assessment.

**Write-failure handling.** If the vault write fails (path missing, permission denied, broken wikilink rendering, disk full): emit the retro to chat regardless, append a `@WRITE_FAILURE block=true | reason="..." | attempted_path="..."` block to the chat-rendered retro, and set the final `@VERDICT` to `partial` (even if execution itself was clean). Do NOT silently exit and do NOT retry — the cold agent's runtime user can paste the chat-emitted retro into the originating session for manual filing.

**Plan-artifact housekeeping.** If a plan artifact was written in Phase 3 (per project Work Management protocol — typical for `<vault>/Projects/<project>/work/{date}-plan-{slug}.md`), update its frontmatter at session close: set `status:` to `done` (or `partial` / `blocked` matching the retro's `@VERDICT`), and add a `commits:` list naming the SHA(s) that closed the plan. This honors the project's cross-reference rule (vault `work/` files reference commit SHAs; code commits reference the work slug in the body). Trivial edit, but easily forgotten if the cold agent skips it — the originating session ends up with a stale `in-progress` plan artifact that misrepresents project state.

## Rules

- MUST read all `@SOURCES.required` entries fully before emitting any plan text (gated mode).
- MUST run the premise pre-flight (git state for already-shipped work, cited test/schema baselines, structural claims) before emitting any plan, and halt with a `@PREMISE_DRIFT` `verdict: blocked` retro if the work is already shipped or a baseline premise is stale. Downgraded to WARN under `--force`.
- SHOULD statically reconcile the brief's stated `verify:` / spot-check commands against the repo before planning (named path exists; CLI subcommand resolves via a side-effect-free `--help` probe — never run the full verify here). WARN + surface a corrected command on an `unknown command` / `no such file` mismatch; do not abort (the task is still executable; only the verify command is mis-pathed).
- MUST write the retro with `@GROUND_TRUTH` (paths + hashes + git diff). Narrative-only retros are rejected.
- MUST halt and write a `verdict: blocked` retro if a `@SOURCES.required` entry fails to read in gated mode **and `--force` is not set**. With `--force`, proceed in degraded mode and record the failure list in the retro instead.
- MUST emit retro to chat with a `@WRITE_FAILURE` block and set `@VERDICT` to `partial` if the vault write fails. Do not silently exit; do not retry.
- SHOULD cite at least one source per plan step.
- SHOULD reason over `@OUTCOME.acceptance` clauses and flag any clause not addressed by ≥1 plan step (WARN — single-sentence acceptance has fallible clause segmentation; flag explicitly rather than abort).
- SHOULD run the project's defined gate suite before declaring done when the work is committable code, and record `@GATE_STATUS` in the retro: each acceptance clause → `verified | unverified | failed`, plus the gate-suite outcome. Skipped gates and unverified clauses are allowed but must be named, never silently omitted.
- SHOULD read the specific cited section of a `@SOURCES.optional` entry on-demand only when a plan step's `· source:` citation names it. Loads are citation-driven, not agent-judgment.
- MUST NOT silently retry failed steps. Emit a partial retro instead.
- MUST NOT silently expand scope if mid-execution the agent, on its own judgment, decides it needs a source not named anywhere in the brief. Halt and surface the gap; the brief must be amended. (Does not cover: a brief-cited file:line edit target absent from `@SOURCES`, or resolving an unlinked named reference in the brief's prose — both are read on-demand and noted in `@DELTA_FROM_BRIEF`, not halted on.)
- MUST NOT invent sources not present in the brief. If a needed source is missing, halt and request brief amendment.
- MUST NOT auto-resolve a missing `@SOURCES.required` entry by picking the closest filename match. Surface the suggestion only.

## Anti-patterns

- Starting to plan before Phase 2 completes — defeats the entire purpose of the skill.
- Planning straight from the brief without reconciling its premises — you risk re-doing already-shipped work or building against a baseline that drifted since the brief was written.
- Reading `@SOURCES.required` skim-only — count of files read ≠ comprehension. If a source is too long to read fully, push back: brief author should split it into a smaller required tier + larger optional tier.
- Treating advisory-mode warnings as cosmetic — they signal that the brief is under-specified. Ask the originating session to add `@SOURCES`.
- Writing the retro to chat only, skipping the canonical vault file — the file is the ground-truth artifact.
- Auto-resolving a missing source by picking the closest filename match — surface the suggestion, do not act on it.

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
