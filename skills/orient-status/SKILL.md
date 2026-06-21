---
name: orient-status
description: >
  Quick "where are we" read on any subject (repo, folder, plan, task) — current position, what's left, and a banded ETA, computed fresh via a bounded read-only subagent. `--resume` rebuilds context after a gap (one next move + counter-case). Not /investigate (deep facts), /reflect (thinking), or /yas-status (YAS agent/arc state) — orient-status SEES and reports NOW on any subject.
visibility: public
self-improvable: true
next-skills:
  - skill: plan-create
    phrase: "/plan-create"
    why: "Turn the bearings into a phased plan for the next move"
triggers:
  - "/orient-status"
  - "where are we on this"
  - "status quo and eta"
  - "how far along"
  - "what's the ETA"
  - "status of this repo or folder or plan"
---

# /orient-status

Computes a fresh, honest read of **where the current work stands** — position, remaining work, and a banded ETA — and returns it as one ephemeral bundle (a structured YON record + a human markdown read + a small visual). `--resume` re-frames it for the "I just came back and lost the thread" case. Part of the `orient-` family; emits a slice of the shared record at [`orient-spec/orient-record.yon`](../../orient-spec/orient-record.yon).

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical steps, rules, and gates; this file is the human-readable, self-sufficient explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## When to use

- "Where are we / what's the status / how far along / what's the ETA" on a project, repo, plan, or task.
- After a context fill or at the start of a session, before deciding the next move.
- **`--resume`**: you've been away (a gap, a context-switch) and lost the thread — you need *what changed + exactly where to put your hands next*.

## How it works (self-sufficient — works without `protocol.yon`)

`orient-status` **delegates the gathering to a bounded, read-only subagent** so the calling session (a human's, or an agent orienting itself) never sees the search/inference noise — only the result bundle comes back. Nothing is stored; every call recomputes from current reality.

1. **Take intent as input, never prompt for it.** Intent (the goal / what "done" means) is the denominator every read leans on, and it is the *least* recoverable thing from evidence. Accept an `intent` argument if given. If intent can't be grounded (no stated goal, no plan, no README), **gate every intent-dependent field** — render it `— (needs goal)` and cap its confidence to `guessed`. **Never fabricate a goal** and hang a confident read off it. On an evidence-poor surface the highest-value output is the nudge: *"name the goal in one line and I get sharper."*

2. **Spawn one bounded subagent** (read-only, depth-1, single wave; budget ≤ ~8–12 tool calls, hard timeout ~60–90s, stop at the first evidence tier that gives a confident answer). It runs the cheap-first evidence ladder and **returns this signal** (not raw logs):
   - **git tier** → `branch`, `dirty` count, `ahead`/`behind`, recent commit subjects (phase signal), `merge-base` (branch detection).
   - **plan/doc tier** → from a `PLAN.md`/`TODO.md`/checklist: `open_count`, the `open_set` items, `done_count`, the current phase/`frontier`, the `next_open` unchecked item.
   - **conversation/folder tier** → recent turns, the folder name, file mtimes for the live frontier.
   Every attested field comes back with a re-runnable `source:line`/git-ref **proof**.

3. **Compute three things:**
   - **Position** — the one-line headline state (phase / `frontier` / `on_branch`).
   - **Remaining + distance** — the `open_count` against its denominator (flag when the real remainder may be larger than the visible one — `denominator_trust`).
   - **ETA** — the one *non-observed* output. A **band, never a point estimate** (`~1–3 days`), tagged `estimate, not observed`. With no plan → `ETA: unknown`. A fabricated percentage or confident phase is **banned**.

4. **Tag every field with a provenance tier** — `◆ git-attested` · `◐ inferred` · `◌ guessed` — and **fail closed**: set **`gate_status`** (enum: `ready | blocked | stalled | degraded | indeterminate`) to `degraded` or `indeterminate` with a **sentinel** value — *never* a plausible `ready`/`blocked` and never a bare `0`/`false` — on barren evidence. The empty-folder read is a success state, not a failure.

5. **`--resume` mode**: lead with the **resume-pointer** — the exact spot you stopped + the half-finished thought — then **exactly one next move + its counter-case + the single dropped alternative** (never a menu). Suppress the full snapshot.

6. **Emit the triple bundle + the family footer.** See *Record emission* below for the YON face; the markdown read follows the structure in the worked examples; the **visual face is optional (SVG/diagram) but its ASCII twin is mandatory and always emitted** — it is the only render in a no-SVG channel and must carry every datum the visual would. ETA renders as a **fading band, never a point-marker**; below a grounding threshold (mostly `◌`) draw a **`NO SUBSTRATE`** card instead of a structural visual. The footer is one evidence-derived line — and **only ever suggests a skill that is actually installed** (fall back to a plain prose hint or `/plan-create` otherwise). The footer's four faces, the **staleness short-circuit** (an unchanged last-look anchor → "no change" without a full sweep — most useful under `--resume`), the neutral re-look signal, and handoff-feeder routing follow the shared [`orient-spec/family-behaviors.md`](../../orient-spec/family-behaviors.md).

## Record emission (the YON face — reserved tags only)

The structured face is a slice of [`orient-spec/orient-record.yon`](../../orient-spec/orient-record.yon) (`schema_version = orient-record/1`). **Reserved tags only** — custom tags like `@SNAPSHOT` are parser-rejected. **List fields go in a sidecar `@MAP`, never an in-set bracket-list** (an in-set bracket-list corrupts the record *silently and still validates*). **Never run `yon format` on an emitted instance** — `CANON` mode is destructive on set-internal lists and the corruption still validates clean; hand-emit the `@MAP` sidecars and leave them. Validate with `--profile exec`. Minimal skeleton:

```
@CFG id=orient | set=[schema_version=orient-record/1,computed_at:ts=…,ephemeral:bool=true,tool=orient-status,tier=orient,evidence_mode=git-only,gate_status=degraded,gate_confidence_floor=inferred,family_used=orient-status,family_suggested_next=plan-create,overall_trust=med,degraded:bool=false]
@CFG id=subject | set=[name=…,kind=monorepo,purpose=…,purpose_source=readme,intent_status=stated]
@CFG id=snapshot | set=[status=in-progress,stage=…,stage_idx:int=1,frontier=…,on_branch:bool=true,branch=…,dirty:int=0,ahead:int=0,behind:int=0]
@CFG id=remaining | set=[open_count:int=4,done_count:int=1,fraction_done:flt=0.2,denominator_trust=inferred,next_open=…]
@MAP name=open_set | pairs=["o1"->"…","o2"->"…"]
@CFG id=forecast | set=[kind=prediction,provenance=extrapolated,eta_low=1d,eta_high=3d,eta_unit=calendar-days,confidence=low,unschedulable:bool=false]
@CFG id=resume | set=[next_action=…,counter_case=…,dropped_alt=…,resume_confidence=high]   # --resume mode only
@MAP name=provenance | pairs=["snapshot.on_branch"->"git-attested:high:git-rev-parse"]
```

A full worked instance ships at [`orient-spec/examples/orient-record.example.yon`](../../orient-spec/examples/orient-record.example.yon).

## Output — worked examples (markdown face)

**Rich tier (a git repo with a plan):**
```
🧭 open-skills — public skills repo.                      [identity: ◆ git]
**Now:** P1 — building orient-status on `feat/orient`.    ◆ git `rev-parse`
**Left:** 4 open · ~20% done (visible-only).              ◐ inferred (checkboxes)
**ETA:** ~1–3 days *(estimate, not observed)*.            ◌ 2 data points
**→ Next:** finish protocol.yon, then count-wiring.
Trust: ◆◐◌ · ⚠️ lean here: the ~1–3 day ETA (2 points, not observed) · next → /plan-create
```

**Git-rich but intent-absent (the case `intent`-gating exists for — confident position, gated distance):**
```
🧭 some-repo — a git repo on `wip`.                       [identity: ◆ git]
**Now:** on `wip`, 3 dirty, 12 commits.                   ◆ git `rev-parse`
**Left:** — (needs goal)  ·  **ETA:** — (needs goal)      ◌ no goal on record
**→ Next:** name the goal in one line and I get sharper.  ← position is real; distance can't be
Trust: ◆◌◌ · ⚠️ lean here: there is no goal — every distance/ETA field is gated, not guessed.  [gate: degraded]
```

**Barren tier (a non-git folder, no plan — honest degradation is the success case):**
```
🧭 ToDo — a folder (no manifest, no git, no README).      [identity: ◌ guessed]
**Now:** can't tell — barely-started / mid / near-done.   [◌ no durable state]
**ETA:** unknown — nothing to measure against.
**→ Next:** name the goal in one line and I get sharper.  ← the cheapest win
Trust: ◌◌◌ · ⚠️ lean here: every line — no durable state exists.  [gate: indeterminate]
```

The ASCII trust trailer with the `⚠️ lean your scrutiny here` line (naming the single load-bearing guess) is **mandatory** on every output.

## Boundaries

- **Not `/investigate`** — that gathers arbitrary deep facts read-only; orient-status computes a fixed *position + distance + forecast* about ongoing work.
- **Not `/plan-deep-dive`** — that walks an existing plan phase-by-phase for quality; orient-status reads the *current position* against whatever evidence exists (often no plan) and forecasts.
- **Not `/yas-status`** — that pulls **YAS agent + arc** state for the private YAS system; orient-status orients on *any* subject (repo, folder, plan, task) from universal evidence.
- **Not `/reflect`, not `insight-*`** — those THINK / DECIDE; orient-status only SEES and reports NOW. After it, reach for `/plan-create` to act, or a sibling lens (`orient-map` for the shape, `orient-gaps` for what's stuck) **once they ship** — until then the footer routes only to installed skills.
- **Read-only.** It never mutates state; the one sanctioned reference point (an intent line / last-look anchor) is caller-supplied or harness-held, never written to disk by default.

## Rules

- MUST take `intent` as input and **gate intent-dependent fields** when it's absent — never fabricate a goal.
- MUST express ETA as a **band**, never a point estimate; MUST NOT emit a fabricated percentage or confident phase on an unknown denominator.
- MUST tag every field with a provenance tier and **fail closed** — `gate_status` = `degraded`/`indeterminate` with a sentinel, never a plausible `ready` — on zero evidence.
- MUST emit a record conformant to `orient-spec/orient-record.yon` (reserved tags; list fields as sidecar `@MAP`; never `yon format` an instance).
- MUST emit the ASCII trust trailer with the `⚠️ lean here` load-bearing-guess line; the visual's ASCII twin is mandatory.
- MUST delegate gathering to a bounded, read-only, depth-1 subagent and return **only** the bundle (no raw search noise), with a re-runnable proof on every attested field.
- The family footer MUST only suggest an **installed** skill.
- `--resume` MUST end in exactly ONE next move + counter-case + the single dropped alternative (no menu).

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
