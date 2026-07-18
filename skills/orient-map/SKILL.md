---
name: orient-map
description: >
  Answers "What changed since I last looked?" on any subject — the delta since your last look, plus done → here → next as a path on trunk or a TREE on a branch, computed fresh via a bounded read-only subagent. Trigger phrases: "/orient-map", "show me the map", "what changed since last look", "how deep down this branch am I". Not /orient-status (how far along am I and when will it be done), /orient-gaps (what is stuck or missing), /orient-roadmap (what comes next and what gates it), an IDE file-tree, or /plan-deep-dive — orient-map shows the SHAPE and the DELTA.
visibility: public
self-improvable: true
next-skills:
  - skill: orient-status
    phrase: "/orient-status"
    why: "Once the shape is clear, get the position + remaining + banded ETA on the node you're standing on"
triggers:
  - "/orient-map"
  - "show me the map"
  - "what changed since last look"
  - "how deep down this branch am I"
  - "what's the shape of this"
  - "map done to here to next"
---

# /orient-map

> **What changed since I last looked?**
> **Answers with —** the delta since your last-look anchor · done → here → next · a TREE when you are on a branch.
> **Does not answer —** how far along (`/orient-status`) · what is stuck (`/orient-gaps`) · what comes next (`/orient-roadmap`).
> **Owns for the family —** the topology fields: `on_branch`, `cursor_node`, `fork_node`, `ahead`, `behind`, `trunk_ref`.

Computes a fresh, honest read of **the shape of the work** — what changed since your last look, and the done → here → next trajectory rendered as a **path on the trunk** or a **TREE on a branch** — and returns it as one ephemeral bundle (a structured YON record + a human markdown read + a small visual). It is the `orient-` family's *topology* lens: it owns branch detection and the diff-of-trees so its siblings don't recompute them. Emits the `trajectory` + `delta` slices of the shared record at [`orient-spec/orient-record.yon`](../../orient-spec/orient-record.yon).

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical steps, rules, and gates; this file is the human-readable, self-sufficient explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## When to use

- "Show me the map / what's the shape / done-to-here-to-next" on a project, repo, plan, or task.
- "What changed since I last looked" — the **delta** is the headline; you want the diff-of-trees, not a fresh full read.
- "How deep down a branch / side-quest am I" — you need the branch stack and the fork point, not a flat file list.

## How it works (self-sufficient — works without `protocol.yon`)

`orient-map` **delegates the gathering to a bounded, read-only subagent** so the calling session (a human's, or an agent orienting itself) never sees the search/inference noise — only the result bundle comes back. Nothing is stored; every call recomputes from current reality. It is **delta-first**: the change since your last look leads, and the raw file-tree is demoted (the IDE already owns that).

1. **Take the last-look anchor and intent as inputs, never prompt for them.** The **anchor** (the reference endpoint the delta is measured from — a git ref, a timestamp, a HEAD@time) is caller-supplied or git-inferred, **never written to disk**. **Intent** (the goal / what "done" means) gates the trajectory: if intent can't be grounded, render the path but **cap every intent-dependent node to `guessed`** and **never emit a confident tree from the void**. Never fabricate a goal or an anchor.

2. **Spawn one bounded subagent** (read-only, depth-1, single wave; budget ≤ ~8–12 tool calls, hard timeout ~60–90s, stop at the first evidence tier that gives a confident answer). It runs the cheap-first evidence ladder and **returns this signal** (not raw logs):
   - **git tier** → `branch`, `merge-base` (the fork point), `ahead`/`behind` vs the trunk, the commit subjects on this branch (the branch-lane nodes), and the diff/`name-status` **since the anchor** (the delta).
   - **plan/doc tier** → from a `PLAN.md`/checklist: the phase nodes (done → frontier → next) and any active sub-phase below the trunk phase (a plan-level branch).
   - **conversation/folder tier** → a side-quest that never became a git branch; file mtimes for the live frontier; the folder name.
   Every attested node/edge/change comes back with a re-runnable `source:line`/git-ref **proof**.

3. **Detect topology — this skill is the authority** (every other slice reads these, none recompute them): set `on_branch` when EITHER (a) git — current branch ≠ base **and** `ahead > 0`, with `fork_node = merge-base`; OR (b) plan-level — an active sub-phase below the trunk phase; OR (c) a side-quest that never became a git branch. **When no base exists, `on_branch = unknown`** — honest, never assumed-trunk. Fill `cursor_node` (`here`), `fork_node`, `ahead`, `behind`, `trunk_ref`.

4. **Compute the delta off the ATTESTED substrate only** (git/mtime), never off prose — a stochastic read must not invent **phantom deltas**. Emit `changes`, the mandatory honest-negative `no_change_zones` (the parts that did *not* move — silently omitting it implies false completeness), and — **when on a branch** — `missed_while_away` (what landed on the **trunk** while you were off on the branch; for a delta-first branch read this is the second-most-valuable datum after the change set). Tier-tag a whitespace-only or trivial change `◌` and a real diff `◆`.

5. **Tag every field with a provenance tier** — `◆ git-attested` · `◐ inferred` · `◌ guessed` — and **fail closed**: set **`gate_status`** (enum: `ready | blocked | stalled | degraded | indeterminate`) to `degraded` or `indeterminate` with a **sentinel** value — *never* a plausible verdict and never a bare `0`/`false` — on barren evidence. A no-substrate subject draws a **`NO SUBSTRATE`** card, not a structural tree.

6. **Emit the bundle to the consumer that asked — one record, three faces, never all three at one reader.** The **YON record is the AGENT face and goes to an agent consumer only**; a **human gets the plain-language read plus the visual (widget when available, ASCII twin otherwise) and never sees the record, a raw record field, a node-id, or a gate enum**. See *Record emission* below for the YON face (agent-only); the markdown read follows the worked examples; the **visual face is rendered per the [render-face contract](../../orient-spec/family-behaviors.md) (Claude Code only)**: for a human on Claude Code with the visualize tool present on an explicit invocation, build the widget from the kit — call `mcp__visualize__read_me` once, then emit via `mcp__visualize__show_widget` a hand-SVG **spine on the trunk / tier-encoded tree on a branch**, the cursor the dominant node, `◆◐◌` tier glyphs as redundant (non-color) encoding; an **agent** consumer gets the YON record only; any **other runtime / no tool / indeterminate `handler_type`** gets the ASCII twin (fail-closed). The **information-complete ASCII trajectory twin is always emitted** — it is the only render in a no-SVG channel and carries every node, change, and zone the widget does (worked trio at [`orient-spec/examples/orient-map.{ascii.txt,widget.svg}`](../../orient-spec/examples/)). On a branch, **ETA refuses to forecast the trunk** (`trunk eta: n/a — not on this path`). The footer is one evidence-derived line — and **only ever suggests a skill that is actually installed** (fall back to a plain prose hint or `/orient-status`/`/plan-create` otherwise). The footer's four faces, the **staleness short-circuit** (anchor unchanged → "no change" without a full sweep), the neutral re-look signal, and handoff-feeder routing follow the shared [`orient-spec/family-behaviors.md`](../../orient-spec/family-behaviors.md).

## Record emission (the YON face — AGENT consumers only; never printed to a human)

The structured face is the `trajectory` + `delta` slices of [`orient-spec/orient-record.yon`](../../orient-spec/orient-record.yon) (`schema_version = orient-record/1`). **Reserved tags only** — custom tags like `@SNAPSHOT`/`@TREE` are parser-rejected. **Tree nodes are `@CFG id=node.<x>`; list fields (`nodes`, `edges`, `changes`, `no_change_zones`) go in a sidecar `@MAP`, never an in-set bracket-list** (an in-set bracket-list corrupts the record *silently and still validates*). **Never run `yon format` on an emitted instance** — `CANON` mode is destructive on set-internal lists and the corruption still validates clean. Validate with `--profile exec`. Minimal skeleton (tree on a branch):

```
@CFG id=orient | set=[schema_version=orient-record/1,computed_at:ts=…,ephemeral:bool=true,tool=orient-map,tier=orient,scope=…,evidence_mode=git-only,gate_status=ready,gate_confidence_floor=git-attested,family_used=orient-map,family_suggested_next=orient-status,family_reason_code=lost_thread,overall_trust=med,degraded:bool=false]
@CFG id=subject | set=[name=…,kind=monorepo,purpose=…,purpose_source=readme,intent_status=stated,parent_subject=…]
@CFG id=trajectory | set=[layout=tree,on_branch:bool=true,trunk_ref=main,cursor_node=n3,fork_node=n2,ahead:int=2,behind:int=0]
@CFG id=node.n1 | set=[kind=done,label=…,lane=trunk]
@CFG id=node.n2 | set=[kind=fork,label=…,lane=trunk]
@CFG id=node.n3 | set=[kind=here,label=…,lane=branch]
@MAP name=edges | pairs=["n1"->"n2","n2"->"n3"]
@CFG id=delta | set=[anchor_kind=git,anchor_ref=HEAD@2h,anchor_confidence=approx,window=2h]
@MAP name=changes | pairs=["c1"->"…","c2"->"…"]
@MAP name=no_change_zones | pairs=["z1"->"…"]
@MAP name=missed_while_away | pairs=["m1"->"…"]   # on a branch: trunk commits since the fork — omit on trunk
@MAP name=provenance | pairs=["trajectory.on_branch"->"git-attested:high:git-rev-parse"]
```

On **barren** evidence the envelope degrades honestly and carries the *reason*: `gate_status=indeterminate, degraded:bool=true, degrade_reason="no git, no plan"` — and the visual is the `NO SUBSTRATE` card, never a structural tree. A full worked instance ships at [`orient-spec/examples/orient-record.example.yon`](../../orient-spec/examples/orient-record.example.yon).

## Output — worked examples (markdown face)

**On a branch (the tree — the case orient-map exists for):**
```
🧭 open-skills — public skills repo.   ↳ within: main      [identity: ◆ git]
## Δ since HEAD@2h — 2 commits, 3 files                    ◆ git `diff --name-status`
  ~ orient-record.yon, family-manifest.yon  (real diff)    ◆
  · README, subagent-protocol             (no change)      ◌ unchanged
  ↟ main: 1 commit landed while you were away (missed)     ◆ trunk diff since fork

main ──●────●·······································          ◆ trunk faint
            └─▶ feat/orient ●━━━●━━━📍 fix-pass            ◆ ahead 2, behind 0
                P0-contract  cold-vet  (here)
            ╌╌▶ rejoins main                                ◐ not yet merged
trunk eta: n/a — not on this path.
**→ Next:** finish the fix pass, then re-validate.
Trust: ◆◆◌ · ⚠️ lean here: the rejoin point (inferred — branch not yet merged) · next → /orient-status
```

**On the trunk (the spine — no branch):**
```
🧭 some-cli — a git repo on `main`.                        [identity: ◆ git]
## Δ since HEAD@1d — 1 commit, 1 file                       ◆ git `diff`
done ──●────●────📍 here ────○ next                         ◆ git log
       v0.1   v0.2   release-prep   docs
**→ Next:** the release-prep node is the frontier.
Trust: ◆◆◐ · ⚠️ lean here: the "next" node (inferred from an open TODO, not a commit).
```

**Barren / no-substrate (honest degradation is the success case):**
```
🧭 ToDo — a folder (no git, no plan).                      [identity: ◌ guessed]
┌───────────────────────────────┐
│  NO SUBSTRATE                  │   no commits, no plan — nothing to map.
│  can't draw a trajectory.      │
└───────────────────────────────┘
**→ Next:** init git or name the goal, and the shape becomes visible.
Trust: ◌◌◌ · ⚠️ lean here: every line — no durable topology exists.  [gate: indeterminate · degrade_reason: no git, no plan]
```

The ASCII trajectory + the trust trailer with the `⚠️ lean your scrutiny here` line (naming the single load-bearing guess) is **mandatory** on every output; the `no_change_zones` honest-negative is never silently dropped.

## Boundaries

- **Not `/orient-status`** — that reports *position + remaining + a banded ETA* (where you stand); orient-map reports the *shape + the delta* (how you got here and what moved). They share one sweep's topology; orient-map is the authority on `on_branch`/`fork`/`cursor`. For the single *next move* after a gap (resume-pointer + one action + counter-case), that's `/orient-status --resume` — orient-map gives the change-shape, not the one-move terminator.
- **Not an IDE file-tree** — the editor already renders the raw directory tree live; orient-map renders the **diff-of-trees** (what changed) and the **branch stack** (where you forked), not the file listing.
- **Not `/plan-deep-dive`** — that walks an existing plan phase-by-phase for quality; orient-map reads the *current trajectory* against whatever evidence exists (often no plan) and shows the delta.
- **Not `/reflect`, not `insight-*`** — those THINK / DECIDE; orient-map only SEES and reports NOW. After it, reach for `/orient-status` for the ETA on the node you're on, or `/plan-create` to act on the next node.
- **Read-only.** It never mutates state; the last-look anchor is caller-supplied or git-inferred, never written to disk by default.

## Rules

- MUST be **delta-first** — lead with the change since the last-look anchor; demote the raw file-tree (the IDE owns it).
- MUST render a **path on the trunk and a TREE on a branch**, with the branch-stack depth; `on_branch = unknown` when no base exists — never assumed-trunk.
- MUST own and emit the topology fields (`on_branch`, `cursor_node`, `fork_node`, `ahead`, `behind`, `trunk_ref`) so sibling slices don't recompute them; on a branch ETA refuses to forecast the trunk.
- MUST compute the delta off the **attested** (git/mtime) substrate only — never off prose — so an agent never gets a phantom delta; MUST emit `no_change_zones` (the honest negative) explicitly, and on a branch MUST emit `missed_while_away` (the trunk commits since the fork).
- MUST take `intent` as input and gate intent-dependent nodes when it's absent — never fabricate a goal; below a grounding threshold draw a `NO SUBSTRATE` card, not a structural tree.
- MUST tag every field with a provenance tier and **fail closed** — `gate_status` = `degraded`/`indeterminate` with a sentinel, never a plausible verdict — on zero evidence.
- MUST, **when the consumer is an agent (`handler_type = agent`)**, emit a record conformant to `orient-spec/orient-record.yon` (reserved tags; tree nodes as `@CFG id=node.<x>`; list fields as sidecar `@MAP`; never `yon format` an instance). **A human consumer gets the plain-language read plus the visual instead — never the record, a raw record field, a node-id, or a gate enum.**
- MUST emit the ASCII trajectory + the trust trailer with the `⚠️ lean here` load-bearing-guess line; the visual's ASCII twin is mandatory.
- MUST NOT print the YON record — or any raw record field, node-id, gate enum, `@CFG` line, or `@MAP` line — into a human-facing reply. The record is the **agent** face (`handler_type = agent`); the human face is the plain-language read plus the visual (widget when available, ASCII twin otherwise). Per `orient-spec/orient-contract.md` §1 (token discipline) and `family-behaviors.md` §6.
- MUST render the visual face per the render-face contract (Claude Code only, via `mcp__visualize__show_widget`): agent → YON record only; human + Claude + tool + explicit invocation → widget + ASCII twin; other runtime / no tool / indeterminate `handler_type` → ASCII twin (fail-closed). The widget and ASCII twin are projections of **one node-structure** (same nodes + `◆◐◌` tier glyphs, non-color), chrome-compliant, verified by `tools/orient-roundtrip.mjs`.
- MUST delegate gathering to a bounded, read-only, depth-1 subagent and return **only** the bundle (no raw search noise), with a re-runnable proof on every attested field.
- The family footer MUST only suggest an **installed** skill.

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
