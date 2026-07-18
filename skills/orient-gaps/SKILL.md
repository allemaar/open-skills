---
name: orient-gaps
description: >
  Answers "What is stuck or missing?" on any subject — blockers (on you vs on others), open forks, loose ends, and inferred silent gaps, computed fresh via a bounded read-only subagent. `--audit` raises claim-vs-evidence + gamed-signal disclosure. Trigger phrases: "/orient-gaps", "what's stuck", "what are the blockers", "can I trust this". Not /orient-status (how far along am I and when will it be done), /orient-map (what changed since I last looked), /orient-roadmap (what comes next and what gates it), or /investigate (deep facts) — orient-gaps shows the STALL surface.
visibility: public
self-improvable: true
next-skills:
  - skill: plan-create
    phrase: "/plan-create"
    why: "Turn the surfaced blockers and loose ends into a phased plan to clear them"
triggers:
  - "/orient-gaps"
  - "what's stuck"
  - "what's not done"
  - "what's missing here"
  - "can I trust this"
  - "what are the blockers"
  - "audit this orientation"
---

# /orient-gaps

> **What is stuck or missing?**
> **Answers with —** blockers (on you vs on others) · open forks · loose ends · inferred silent gaps · (`--audit`) unbacked claims.
> **Does not answer —** how far along (`/orient-status`) · what changed (`/orient-map`) · what comes next (`/orient-roadmap`).
> **Owns for the family —** the stall surface and the anti-Goodhart audit tier.

Computes a fresh, honest read of **what is stuck and what is missing** — blockers, open forks, loose ends, and the inferred *silent gaps* — and returns it as one ephemeral bundle (a structured YON record + a human markdown read + a small visual). `--audit` adds a second tier: claim-vs-evidence mismatches and gamed-signal disclosure ("don't trust the orientation"). Part of the `orient-` family; emits the `gaps` slice of the shared record at [`orient-spec/orient-record.yon`](../../orient-spec/orient-record.yon).

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical steps, rules, and gates; this file is the human-readable, self-sufficient explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## When to use

- "What's stuck / what's blocking / what's not done / what's missing" on a project, repo, plan, or task.
- Before trusting a status read — to see whether the bearings rest on anything solid.
- **`--audit`**: "don't trust the orientation" — raise claims that lack evidence and metrics that look inflated.

## How it works (self-sufficient — works without `protocol.yon`)

`orient-gaps` **delegates the gathering to a bounded, read-only subagent** so the calling session (a human's, or an agent orienting itself) never sees the search/inference noise — only the result bundle comes back. Nothing is stored; every call recomputes from current reality. The stall surface and the silent gaps are **two tiers of one sweep**; `--audit` raises a third.

1. **Take intent as input, never prompt for it.** Intent (the goal / what "done" means) is what makes a gap *legible* — a loose end is only loose against a goal. Accept an `intent` argument if given. If intent can't be grounded, **gate the goal-relative gaps** (render `— (needs goal)`, cap to `guessed`) and surface only the evidence-attested stalls (uncommitted files, unmerged branches). **Never fabricate a goal** and hang invented gaps off it.

2. **Spawn one bounded subagent** (read-only, depth-1, single wave; budget ≤ ~8–12 tool calls, hard timeout ~60–90s, stop at the first evidence tier that gives a confident answer). It runs the cheap-first evidence ladder and **returns this signal** (not raw logs):
   - **git tier** → uncommitted/untracked files (`loose_ends`), unmerged branches and unresolved conflicts (`open_forks`), stale branches.
   - **plan/doc tier** → unchecked blocking items, TODO/FIXME/`@blocked` markers, an item that names a dependency on someone/something else (`blocked_on_other`) vs one you own (`blocked_on_me`).
   - **conversation/folder tier** → a decision raised but never recorded (an `open_fork`), a thread dropped mid-way.
   Every attested gap comes back with a re-runnable `source:line`/git-ref **proof**.

3. **Compute two tiers (always):**
   - **Stall surface** — `blocked_on_me` vs `blocked_on_other` (attribute from evidence, never assume), `open_forks` (unresolved decisions), `loose_ends` (uncommitted/untracked). Set `stall_status = stalled` when something blocks; otherwise `ready`.
   - **Silent gaps** — the honest-negative: what is *plausibly missing but unproven* (no tests next to new code, a doc that wasn't updated). **Always emitted explicitly** — silently omitting it implies false completeness. Mark each `◐ inferred` or `◌ guessed`; never present a silent gap as a confirmed fact.

4. **`--audit` mode — the third tier ("don't trust the orientation"):**
   - `audit_mismatches` — a **claim with no corroborating evidence** (a "done" with no commit, a "tested" with no test file).
   - `gamed_signals` — a metric **inflated past its evidence weight** (a commit count padded by whitespace-only commits; "activity" with no substantive diff). Tier-tag the hollow signal `◌` so it reads as hollow — the anti-Goodhart disclosure (see [`orient-spec/family-behaviors.md`](../../orient-spec/family-behaviors.md) §4).

5. **Tag every field with a provenance tier** — `◆ git-attested` · `◐ inferred` · `◌ guessed` — and **fail closed**: set **`gate_status`** (enum: `ready | blocked | stalled | degraded | indeterminate`) to `degraded`/`indeterminate` with a **sentinel** — never a plausible `ready` — on barren evidence. **An empty stall surface is a success state** (collapse to one line: *"nothing stuck — clean"*), NOT a failure.

6. **Emit the bundle to the consumer that asked — one record, three faces, never all three at one reader.** The **YON record is the AGENT face and goes to an agent consumer only**; a **human gets the plain-language read plus the visual (widget when available, ASCII twin otherwise) and never sees the record, a raw record field, a node-id, or a gate enum**. See *Record emission* below for the YON face (agent-only); the markdown read follows the worked examples; the **visual face is rendered per the [render-face contract](../../orient-spec/family-behaviors.md) §6 (Claude Code only)**: for a human on Claude Code with the visualize tool present on an explicit invocation, build the **gaps widget** from the kit — call `mcp__visualize__read_me` once, then emit via `mcp__visualize__show_widget` an **HTML stall board** (per [`orient-contract.md`](../../orient-spec/orient-contract.md) §2 "gaps = a stall board / sieve — the hole is the deliverable"): a **4-lane grid** (blocked · open-forks · loose-ends · silent-gaps), each item carrying a muted **effort `S`/`M`/`L`** tag, **empty lanes shown as `— clear`** (the honest-negative, never omitted), the **"you are here" breadcrumb on top** (`↳ in: {parent_subject}`, omitted when absent), `◆◐◌` tier glyphs as redundant **non-color** encoding, and the legend `◆ attested · ◐ inferred · ◌ guessed · effort S·M·L · — honest-negative`. HTML chrome: colors only via CSS vars (no hardcoded hex), no `position:fixed`, and a visually-hidden `<h2 class="sr-only">` one-sentence summary for a11y. An **agent** consumer gets the YON record only; any **other runtime / no tool / indeterminate `handler_type`** gets the ASCII twin (fail-closed). The **information-complete ASCII stall-board twin is always emitted** — it is the only render in a no-SVG channel and carries every lane item the widget does. Token discipline: a clean result collapses to one line. The footer is one evidence-derived line — and **only ever suggests a skill that is actually installed** (a `blockers_present` reason_code routes to `/plan-create`; an `unwritten_decision` routes OUT to `/lyt-handoff`/`/lyt-decision` per the family handoff-feeder, when installed).

## Record emission (the YON face — AGENT consumers only; never printed to a human)

The structured face is the `gaps` slice of [`orient-spec/orient-record.yon`](../../orient-spec/orient-record.yon) (`schema_version = orient-record/1`). **Reserved tags only** — custom tags are parser-rejected. **List fields (`blocked_on_me`, `blocked_on_other`, `open_forks`, `loose_ends`, `silent_gaps`, `audit_mismatches`, `gamed_signals`) go in a sidecar `@MAP`, never an in-set bracket-list** (an in-set bracket-list corrupts the record *silently and still validates*). **Never run `yon format` on an emitted instance** — `CANON` mode is destructive on set-internal lists. Validate with `--profile exec`. Minimal skeleton:

```
@CFG id=orient | set=[schema_version=orient-record/1,computed_at:ts=…,ephemeral:bool=true,tool=orient-gaps,tier=orient,scope=…,evidence_mode=git-only,gate_status=stalled,gate_blocking_field=loose_ends,gate_confidence_floor=git-attested,family_used=orient-gaps,family_suggested_next=plan-create,family_reason_code=blockers_present,overall_trust=med,degraded:bool=false]
@CFG id=subject | set=[name=…,kind=monorepo,purpose=…,purpose_source=readme,intent_status=stated,parent_subject=…]   # parent_subject drives the ↳ in: breadcrumb; omit the field (and the breadcrumb) when absent
@CFG id=gaps | set=[stall_status=stalled]
@MAP name=blocked_on_me | pairs=["b1"->"…"]
@MAP name=open_forks | pairs=["f1"->"…"]
@MAP name=loose_ends | pairs=["l1"->"…"]
@MAP name=silent_gaps | pairs=["s1"->"… (inferred)"]
@MAP name=audit_mismatches | pairs=["a1"->"…"]   # --audit mode only
@MAP name=gamed_signals | pairs=["g1"->"… ◌"]      # --audit mode only
@MAP name=provenance | pairs=["gaps.loose_ends"->"git-attested:high:git-status"]
```

A full worked instance ships at [`orient-spec/examples/orient-record.example.yon`](../../orient-spec/examples/orient-record.example.yon).

## Output — worked examples (markdown face)

**Rich tier (a repo with real stalls — the ASCII stall-board twin):**
```
🧭 open-skills — public skills repo.   ↳ in: open-source push   [identity: ◆ git]
## Stuck — 1 blocker · 1 open fork · 2 loose ends         ◆ git + plan
┌─ blocked ──────────────┬─ open-forks ───────────────┐
│ ◐ P4 awaiting cold-vet [M] │ ◐ schema_version bump  [S] │
├─ loose-ends ───────────┼─ silent-gaps ──────────────┤
│ ◆ 3 uncommitted, 1 untracked [L] │ ◐ no honesty fixture yet [M] │
└────────────────────────┴────────────────────────────┘
**→ Next:** clear the blocker, then commit the loose ends.
Trust: ◆◐ · ⚠️ lean here: the blocker + fork are inferred (plan TODO / no record); only the loose ends are git-attested · next → /plan-create
legend: ◆ attested · ◐ inferred · ◌ guessed · effort S·M·L · — clear (honest-negative)
```

**Clean tier (nothing stuck — the success collapse; the widget shows every lane `— clear`):**
```
🧭 some-cli — a git repo on `main`, clean tree.           [identity: ◆ git]
**Nothing stuck — clean.** blocked: — clear · open-forks: — clear · loose-ends: — clear   ◆ git
**Silent gaps:** none surfaced (coarse — git + plan only).  ◐ honest negative
Trust: ◆ · [gate: ready]
```

**`--audit` tier (don't trust the orientation):**
```
🧭 some-repo — a git repo on `wip`.                       [identity: ◆ git]
## Audit — 1 claim unbacked · 1 gamed signal              ◆ git
| audit flag      | what                            | from         |
| claim vs evidence | "tests pass" — no test files   | ◌ no evidence |
| gamed signal    | 9 commits, 7 whitespace-only    | ◌ hollow ◌    |
**→ Next:** back the test claim or drop it.
Trust: ◌ · ⚠️ lean here: the "tests pass" claim has zero corroborating evidence.  [gate: degraded]
```

The ASCII stall board + the trust trailer with the `⚠️ lean your scrutiny here` line (naming the load-bearing guess) is **mandatory**; the silent-gaps honest-negative is never silently dropped.

## Boundaries

- **Not `/orient-status`** — that reports *position + remaining + ETA* (where you stand); orient-gaps reports *what's stuck and missing* (why you can't trust it / can't move).
- **Not `/orient-map`** — that reports *shape + delta* (how you got here); orient-gaps reports the *stall surface* (what's blocking). They share one sweep's evidence, and orient-gaps **consumes** orient-map's topology (`on_branch`/`fork`/open-fork detection) rather than recomputing it.
- **Not `/investigate`** — that gathers arbitrary deep facts read-only; orient-gaps computes a fixed *stall + silent-gap + audit* surface about ongoing work.
- **Not `/reflect`, not `insight-*`** — those THINK / DECIDE; orient-gaps only SEES and reports NOW. After it, reach for `/plan-create` to clear the blockers, or the family handoff-feeder (`/lyt-handoff`/`/lyt-decision`) for an unwritten decision **once installed**.
- **Read-only.** It never mutates state; the one sanctioned reference point (an intent line) is caller-supplied or harness-held, never written to disk by default.

## Rules

- MUST compute **two tiers from one sweep** — the stall surface (blockers / forks / loose ends) and the silent gaps; `--audit` raises the third (claim-vs-evidence + gamed-signal).
- MUST emit `silent_gaps` (the honest negative) explicitly — never silently omit it — and mark each `◐`/`◌`, never as a confirmed fact.
- MUST attribute `blocked_on_me` vs `blocked_on_other` **from evidence**, never assume; an empty stall surface collapses to a one-line success state, not a failure.
- MUST take `intent` as input and gate goal-relative gaps when it's absent — never fabricate a goal or invent gaps off it.
- MUST tag every field with a provenance tier and **fail closed** — `gate_status` = `degraded`/`indeterminate` with a sentinel — on zero evidence.
- `--audit` MUST tier-tag a gamed signal `◌` so a hollow metric reads as hollow (the anti-Goodhart disclosure).
- MUST, **when the consumer is an agent (`handler_type = agent`)**, emit a record conformant to `orient-spec/orient-record.yon` (reserved tags; list fields as sidecar `@MAP`; never `yon format` an instance). **A human consumer gets the plain-language read plus the visual instead — never the record, a raw record field, a node-id, or a gate enum.**
- MUST emit the ASCII stall board + the trust trailer with the `⚠️ lean here` load-bearing-guess line; the visual's ASCII twin is mandatory.
- MUST carry the **"you are here" breadcrumb** (`↳ in: {parent_subject}`) on the identity banner in both faces when `subject.parent_subject` is present — and **omit it entirely when absent** (never fabricate a parent); per `orient-contract.md` §1 and `family-behaviors.md` §8.
- MUST NOT print the YON record — or any raw record field, node-id, gate enum, `@CFG` line, or `@MAP` line — into a human-facing reply. The record is the **agent** face (`handler_type = agent`); the human face is the plain-language read plus the visual (widget when available, ASCII twin otherwise). Per `orient-spec/orient-contract.md` §1 (token discipline) and `family-behaviors.md` §6.
- MUST render the visual face per the render-face contract (Claude Code only, via `mcp__visualize__show_widget`): **agent → YON record only**; **human + Claude + tool + explicit invocation → stall-board widget + ASCII twin**; **other runtime / no tool / indeterminate `handler_type` → ASCII twin (fail-closed)**. The gaps widget is an **HTML stall board** — a 4-lane grid (blocked · open-forks · loose-ends · silent-gaps), each item a muted **effort `S`/`M`/`L`** tag, **empty lanes `— clear`** (honest-negative, never omitted), the breadcrumb on top.
- MUST keep the widget and ASCII twin projections of **one node-structure** (same lane items + `◆◐◌` tier glyphs as redundant **non-color** encoding), HTML-chrome-compliant (colors only via CSS vars — no hardcoded hex; no `position:fixed`; a visually-hidden `<h2 class="sr-only">` summary for a11y), legend `◆ attested · ◐ inferred · ◌ guessed · effort S·M·L · — honest-negative`, **verified by `tools/orient-roundtrip.mjs`**. The widget MUST be **sparse — no per-node prose**.
- MUST delegate gathering to a bounded, read-only, depth-1 subagent and return **only** the bundle (no raw search noise), with a re-runnable proof on every attested gap.
- The family footer MUST only suggest an **installed** skill.

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
