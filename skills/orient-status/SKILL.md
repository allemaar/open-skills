---
name: orient-status
description: >
  Answers "How far along am I, and when will it be done?" on any subject (repo, folder, plan, task) — current position, what's left, and a banded ETA, computed fresh via a bounded read-only subagent. `--resume` rebuilds context after a gap (one next move + counter-case). Trigger phrases: "/orient-status", "where are we on this", "how far along", "what's the ETA". Not /orient-map (what changed since I last looked), /orient-gaps (what is stuck or missing), /orient-roadmap (what comes next and what gates it), /investigate (deep facts), /reflect (thinking), or a private arc-state status skill — orient-status SEES and reports NOW.
visibility: public
self-improvable: true
companions:
  - path: references/orient-spec
    optional: false
    why: "The required record, render contract, and worked fixtures; bundled inside this skill."
  - path: references/tools/orient-validate.mjs
    optional: false
    why: "The required value and fail-closed gate; bundled inside this skill."
  - path: ../../tools/orient-roundtrip.mjs
    optional: true
    why: "Repository-only release evidence; installed execution retains the emitter obligation."
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

> **How far along am I, and when will it be done?**
> **Answers with —** position · what is left · a banded ETA · (`--resume`) the one next move.
> **Does not answer —** what changed (`/orient-map`) · what is stuck (`/orient-gaps`) · what comes next (`/orient-roadmap`).
> **Owns for the family —** nothing topological; it consumes `/orient-map`'s topology fields.

Computes a fresh, honest read of **where the current work stands** — position, remaining work, and a banded ETA — and returns it as one ephemeral bundle (a structured YON record + a human markdown read + a small visual). `--resume` re-frames it for the "I just came back and lost the thread" case. Part of the `orient-` family; emits a slice of the shared record at [`references/orient-spec/orient-record.yon`](references/orient-spec/orient-record.yon).

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical steps, rules, and gates; this file is the human-readable, self-sufficient explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

The shared record, render contract, worked fixtures, and value validator travel
inside [`references/`](references/). The repository-only round-trip guard is
release evidence; its absence from an installed copy does not block execution.

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

6. **Emit the bundle to the consumer that asked — one record, three faces, never all three at one reader.** The **YON record is the AGENT face and goes to an agent consumer only**; a **human gets the plain-language read plus the visual (widget when available, ASCII twin otherwise) and never sees the record, a raw record field, a node-id, or a gate enum**. See *Record emission* below for the YON face (agent-only); the markdown read follows the structure in the worked examples; the **visual face is rendered per the [render-face contract](references/orient-spec/orient-contract.md) §2 (Claude Code only)**: for a human on Claude Code with the visualize tool present on an explicit invocation, build the **status widget** from the kit — call `mcp__visualize__read_me` once, then emit via `mcp__visualize__show_widget` an **identity nameplate + a position track (the phase spine, hand-SVG, fixed `viewBox="0 0 680 …"`) + a remaining load-bar + ledger (open-ended `▰▰▰▒╌╌?` when the denominator is unknown) + an ETA fading uncertainty band** (a point-marker is BANNED — the uncertainty *is* the datum), with the cursor/now the dominant element and `◆◐◌` tier glyphs as redundant **non-color** encoding; an **agent** consumer gets the YON record only; any **other runtime / no tool / indeterminate `handler_type`** gets the ASCII twin (fail-closed). The **information-complete ASCII status twin is always emitted** — it is the only render in a no-SVG channel and carries every datum the widget does. The widget is **sparse** — a learn-once legend + tier glyphs, **never per-node sentences**. Below a grounding threshold (mostly `◌`) draw a **`NO SUBSTRATE`** card instead of a structural visual. The footer is one evidence-derived line — and **only ever suggests a skill that is actually installed** (fall back to a plain prose hint or `/plan-create` otherwise). The footer's four faces, the **staleness short-circuit** (an unchanged last-look anchor → "no change" without a full sweep — most useful under `--resume`), the neutral re-look signal, and handoff-feeder routing follow the shared [`references/orient-spec/family-behaviors.md`](references/orient-spec/family-behaviors.md).

## Record emission (the YON face — AGENT consumers only; never printed to a human)

The structured face is a slice of [`references/orient-spec/orient-record.yon`](references/orient-spec/orient-record.yon) (`schema_version = orient-record/1`). **Reserved tags only** — custom tags like `@SNAPSHOT` are parser-rejected. **List fields go in a sidecar `@MAP`, never an in-set bracket-list** (an in-set bracket-list corrupts the record *silently and still validates*). **Never run `yon format` on an emitted instance** — `CANON` mode is destructive on set-internal lists and the corruption still validates clean; hand-emit the `@MAP` sidecars and leave them. Validate with `--profile exec`. Minimal skeleton:

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

A full worked instance ships at [`references/orient-spec/examples/orient-record.example.yon`](references/orient-spec/examples/orient-record.example.yon).

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
- **Not a private arc-state status skill** — that kind pulls declared agent and arc state from a private system; orient-status orients on *any* subject (repo, folder, plan, task) from universal evidence.
- **Not `/reflect`, not `insight-*`** — those THINK / DECIDE; orient-status only SEES and reports NOW. After it, reach for `/plan-create` to act, or a sibling lens (`orient-map` for the shape, `orient-gaps` for what's stuck) **once they ship** — until then the footer routes only to installed skills.
- **Read-only.** It never mutates state; the one sanctioned reference point (an intent line / last-look anchor) is caller-supplied or harness-held, never written to disk by default.

## Rules

- MUST take `intent` as input and **gate intent-dependent fields** when it's absent — never fabricate a goal.
- MUST express ETA as a **band**, never a point estimate; MUST NOT emit a fabricated percentage or confident phase on an unknown denominator.
- MUST tag every field with a provenance tier and **fail closed** — `gate_status` = `degraded`/`indeterminate` with a sentinel, never a plausible `ready` — on zero evidence.
- MUST, **when the consumer is an agent (`handler_type = agent`)**, emit a record conformant to `references/orient-spec/orient-record.yon` (reserved tags; list fields as sidecar `@MAP`; never `yon format` an instance). **A human consumer gets the plain-language read plus the visual instead — never the record, a raw record field, a node-id, or a gate enum.**
- MUST emit the ASCII trust trailer with the `⚠️ lean here` load-bearing-guess line; **the ASCII status twin is mandatory and always emitted** — it is the only render in a no-SVG channel.
- MUST NOT print the YON record — or any raw record field, node-id, gate enum, `@CFG` line, or `@MAP` line — into a human-facing reply. The record is the **agent** face (`handler_type = agent`); the human face is the plain-language read plus the visual (widget when available, ASCII twin otherwise). Per `references/orient-spec/orient-contract.md` §1 (token discipline) and `family-behaviors.md` §6.
- MUST render the visual face per the render-face contract (Claude Code only, via `mcp__visualize__show_widget`): **agent → YON record only**; **human + Claude + tool + explicit invocation → status widget + ASCII twin**; **other runtime / no tool / indeterminate `handler_type` → ASCII twin (fail-closed)**. The status widget is an **identity nameplate + position track + remaining load-bar + ETA fading-band**, the cursor/now the dominant element; **ETA renders as a band, never a point-marker**.
- MUST keep the widget and ASCII twin projections of **one node-structure** (same labels + `◆◐◌` tier glyphs as redundant **non-color** encoding), chrome-compliant (colors only via CSS vars / `c-*` classes — no hardcoded hex; no `position:fixed`; `role="img"` + non-empty `<title>`/`<desc>`; fixed `viewBox="0 0 680 …"`), **checked by the repository-only `tools/orient-roundtrip.mjs` release guard when running from a clone; installed copies retain this as an emitter obligation**. The widget MUST be **sparse — a learn-once legend + tier glyphs only, NEVER per-node sentences or interpretive prose glued to elements** (its whole purpose is to *lower* cognitive load).
- MUST delegate gathering to a bounded, read-only, depth-1 subagent and return **only** the bundle (no raw search noise), with a re-runnable proof on every attested field.
- The family footer MUST only suggest an **installed** skill.
- `--resume` MUST end in exactly ONE next move + counter-case + the single dropped alternative (no menu).

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
