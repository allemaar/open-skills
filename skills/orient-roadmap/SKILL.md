---
name: orient-roadmap
description: >
  Multi-horizon "show me the roadmap" read on any subject — the increment arc (built → current → next), what shipped now, the gates, the next increment's clusters (paramount starred), and the runway of stage boxes (now → gated-next → future) plus the deferred lanes, computed fresh via a bounded read-only subagent. Not /orient-status (position + ETA on ONE node) or /orient-map (topology + delta since last look) — orient-roadmap shows the FORWARD HORIZONS and the runway.
visibility: public
self-improvable: true
next-skills:
  - skill: orient-status
    phrase: "/orient-status"
    why: "Once the horizons are clear, get position + remaining + banded ETA on the current increment"
triggers:
  - "/orient-roadmap"
  - "show me the roadmap"
  - "show me the runway"
  - "what's next"
  - "the increments and lanes"
  - "the plan"
---

# /orient-roadmap

Computes a fresh, honest read of **where the work is going** — the increment arc (**built → current → next**), what is shipping **now**, the **gates**, the next increment's **clusters** (the paramount one starred), and the **runway** of stage boxes (**now → gated-next → future**) plus the **deferred lanes** — and returns it as one ephemeral bundle (a structured YON record + a human markdown read + a small visual). It is the `orient-` family's *forward-horizon* lens: where `/orient-map` looks back (delta + topology) and `/orient-status` reports the node you stand on, `orient-roadmap` looks **ahead** across multiple horizons. Emits the `roadmap` slice of the shared record at [`orient-spec/orient-record.yon`](../../orient-spec/orient-record.yon).

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical steps, rules, and gates; this file is the human-readable, self-sufficient explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## When to use

- "Show me the roadmap / the runway / what's next" on a project, repo, plan, or task — you want the **forward horizons**, not the node you're on.
- "What are the increments and the lanes" — you want the built → current → next arc, the next increment's clusters, and the runway of gated stages laid out as one board.
- "What's the plan from here" — the prospective board (increments not yet reached, the runway of gated stages, the deferred lanes), not the retrospective delta.

## How it works (self-sufficient — works without `protocol.yon`)

`orient-roadmap` **delegates the gathering to a bounded, read-only subagent** so the calling session (a human's, or an agent orienting itself) never sees the search/inference noise — only the result bundle comes back. Nothing is stored; every call recomputes from current reality. It is **horizon-first**: the forward increments and the runway lead; the retrospective delta is `/orient-map`'s job, not this one's.

1. **Take the north-star / intent and the last-look anchor as inputs, never prompt for them.** **Intent** (the goal / what the arc is aiming at) gates the whole board: if intent can't be grounded, render what exists but **cap every intent-dependent horizon to `guessed`** and **never emit a confident runway from the void**. The **anchor** (a git ref, a `PLAN.md`, a HEAD@time) is caller-supplied or git-inferred, **never written to disk**. Never fabricate a north-star or an anchor.

2. **Spawn one bounded subagent** (read-only, depth-1, single wave; budget ≤ ~8–12 tool calls, hard timeout ~60–90s, stop at the first evidence tier that gives a confident answer). It runs the cheap-first evidence ladder and **returns this signal** (not raw logs):
   - **git tier** → the commit subjects / merged work = the **built** items (`✅` now-shipping chips), the current branch/frontier = the **current** increment.
   - **plan/doc tier** → from a `PLAN.md`/roadmap/checklist: the increment arc (built → current → next), the **gates**, the **next increment's clusters** (which is the paramount one), the **runway stages** (now → gated-next → future), and the **deferred** lanes.
   - **conversation/folder tier** → an un-plan'd next step; file mtimes for the live frontier; the folder name.
   Every attested item/increment comes back with a re-runnable `source:line`/git-ref **proof**.

3. **Build the roadmap slice — this skill is the forward-horizon authority** (siblings read `arc_current` / `paramount_ref`, none recompute the horizons). The **increment arc is a 3-node spine** (`@CFG id=node.<x>`, `kind=increment`, one `istatus=current` — the hero). Hold it to **≤ 3 arc nodes and ≤ 3 runway stages** (the ≤5-node budget *per sub-graph*, [`orient-contract.md`](../../orient-spec/orient-contract.md) §3.2): if a live emission exceeds that, **decompose** into an overview arc + a drill-down runway rather than cramming. Set `arc_current`, `arc_idx`/`arc_count`, `now_count`, `next_count`, `runway_span`, `paramount_ref`, `cleanup_now_count`, `deferred_count`.

4. **Encode the two orthogonal axes without conflating them.** The **tier axis** (provenance confidence) is `◆ attested · ◐ inferred · ◌ guessed` — the a11y non-color glyphs on every field. The **state/role axis** (roadmap semantics) is the handler emoji in the markdown/ASCII face — `✅ built · ◉ current · 🔄 running · ★ paramount · ▢ next-gated · ◌ deferred · ⚠ promoted-cleanup`. **`★` is a paramount *role* marker on a next-item chip, never a tier glyph** (the YAS `★ ratified` tier lives only in the trust trailer, a different render zone). The SVG widget face translates the emoji column to shape-glyphs + shape encoding (filled/hollow/dashed) — no emoji in the widget.

5. **Tag every field with a provenance tier** — `◆ git-attested` · `◐ inferred` · `◌ guessed` — and **fail closed**: set **`gate_status`** (enum: `ready | blocked | stalled | degraded | indeterminate`) to `degraded` or `indeterminate` with a **sentinel** value — *never* a plausible verdict and never a bare `0`/`false` — on barren evidence. A no-substrate subject draws a **`NO SUBSTRATE`** card, not a structural roadmap.

6. **Emit the triple bundle + the family footer.** See *Record emission* below for the YON face; the markdown read follows the worked example; the **visual face is rendered per the [render-face contract](../../orient-spec/family-behaviors.md) (Claude Code only)**: for a human on Claude Code with the visualize tool present on an explicit invocation, build the **roadmap widget** from the kit — call `mcp__visualize__read_me` once, then emit via `mcp__visualize__show_widget` a hand-SVG **8-band board** (`viewBox="0 0 780 …"`, each band an independent `<g transform>` so coordinate math stays local), the current increment the dominant node, `◆◐◌` tier glyphs as redundant (non-color) encoding, deferred chips dashed + faded, **no emoji in the widget face**; an **agent** consumer gets the YON record only; any **other runtime / no tool / indeterminate `handler_type`** gets the ASCII twin (fail-closed). The **information-complete ASCII roadmap twin is always emitted** — it is the only render in a no-SVG channel and carries every increment, item, gate, stage, and lane the widget does (worked trio at [`orient-spec/examples/orient-roadmap.{ascii.txt,widget.svg}`](../../orient-spec/examples/)). The footer is one evidence-derived line — and **only ever suggests a skill that is actually installed** (fall back to a plain prose hint or `/orient-status`/`/plan-create` otherwise). The footer's four faces, the **staleness short-circuit** (anchor unchanged → "no change" without a full sweep), the neutral re-look signal, and handoff-feeder routing follow the shared [`orient-spec/family-behaviors.md`](../../orient-spec/family-behaviors.md).

## Record emission (the YON face — reserved tags only)

The structured face is the `roadmap` slice of [`orient-spec/orient-record.yon`](../../orient-spec/orient-record.yon) (`schema_version = orient-record/1`). **Reserved tags only** — custom tags like `@ROADMAP`/`@RUNWAY` are parser-rejected. **Increment nodes are `@CFG id=node.<x>` (`kind=increment`); every list field (`built_items`, `gates`, `next_items`, `runway_stages`, `cleanup_now`, `deferred`, `edges`) goes in a sidecar `@MAP`, never an in-set bracket-list** (an in-set bracket-list corrupts the record *silently and still validates*). `★` (paramount) and `◌` (deferred) ride **inside the item label** as render hints, never as new tier glyphs. **Never run `yon format` on an emitted instance** — `CANON` mode is destructive on set-internal lists. Validate with `--profile exec` then the value gate `tools/orient-validate.mjs`. Minimal skeleton:

```
@CFG id=orient | set=[schema_version=orient-record/1,computed_at:ts=…,ephemeral:bool=true,tool=orient-roadmap,tier=orient,scope=…,evidence_mode=git-only,gate_status=ready,gate_confidence_floor=inferred,family_used=orient-roadmap,family_suggested_next=orient-status,family_reason_code=lost_thread,overall_trust=med,degraded:bool=false]
@CFG id=subject | set=[name=…,kind=monorepo,purpose=…,purpose_source=readme,intent_status=stated,parent_subject=…]
@CFG id=roadmap | set=[north_star=…,arc_current=…,arc_idx:int=2,arc_count:int=3,now_count:int=4,next_count:int=3,runway_span=…,paramount_ref=…,cleanup_now_count:int=1,deferred_count:int=2]
@CFG id=node.a1 | set=[kind=increment,label=…,istatus=built,lane=arc]
@CFG id=node.a2 | set=[kind=increment,label=…,istatus=current,lane=arc]
@CFG id=node.a3 | set=[kind=increment,label=…,istatus=next,lane=arc]
@MAP name=edges | pairs=["a1"->"a2","a2"->"a3"]
@MAP name=built_items | pairs=["b1"->"…","b2"->"…"]
@MAP name=gates | pairs=["g1"->"…","g2"->"…"]
@MAP name=next_items | pairs=["x1"->"★ …","x2"->"…"]
@MAP name=runway_stages | pairs=["r1"->"now: …","r2"->"gated-next: …","r3"->"future: …"]
@MAP name=cleanup_now | pairs=["u1"->"⚠ …"]
@MAP name=deferred | pairs=["d1"->"◌ …(deferred)"]
@MAP name=provenance | pairs=["roadmap.arc_current"->"artifact-stated:med:plan-md","roadmap.built_items"->"git-attested:high:git-log"]
```

On **barren** evidence the envelope degrades honestly and carries the *reason*: `gate_status=indeterminate, degraded:bool=true, degrade_reason="no git, no plan"` — and the visual is the `NO SUBSTRATE` card, never a structural roadmap. A full worked instance ships at [`orient-spec/examples/orient-roadmap.example.yon`](../../orient-spec/examples/orient-roadmap.example.yon).

## Output — worked examples (markdown face)

**The horizon board (the case orient-roadmap exists for):**
```
🧭 open-skills — public skills pack, the roadmap.   ↳ in: open-source push   [identity: ◆ git]
North star: one orient- family, three faces, machine-checked.

THE ARC:   ✅ status ──▶ ◉ map+gaps (current) ──▶ ▢ roadmap (next)     ◆ plan spine
NOW SHIPPING:
  ✅ orient-status   ✅ orient-map   ✅ orient-gaps   ✅ value-gate     ◆ git log
GATES:   [ full validate green ]   [ cold-review pass ]               ◆ CI
NEXT INCREMENT:
  ★ roadmap slice   widget parity   ascii floor                       ◐ plan
THE RUNWAY:   now:author ──▶ gated-next:cold-review ──▶ future:publish ◐ plan
CLEANUP-NOW:   ⚠ stale STAMP dates
DEFERRED:      ◌ deterministic renderer(deferred)   ◌ ci wiring(deferred)   ◌ unchanged
**→ Next:** map+gaps is the current increment; the roadmap slice is paramount.
Trust: ◆◐◌ · ⚠️ lean here: the runway "future: publish" stage (inferred from the plan, not a gate) · next → /orient-status
legend: ◆ attested · ◐ inferred · ◌ guessed · ✅ built · ◉ current · 🔄 running · ★ paramount · ▢ next/gated · ◌ deferred · ⚠ promoted-cleanup
```

**Barren / no-substrate (honest degradation is the success case):**
```
🧭 ToDo — a folder (no git, no plan).                      [identity: ◌ guessed]
┌───────────────────────────────┐
│  NO SUBSTRATE                  │   no commits, no plan — no horizons to draw.
│  can't draw a roadmap.         │
└───────────────────────────────┘
**→ Next:** init git or name the north-star, and the horizons become visible.
Trust: ◌◌◌ · ⚠️ lean here: every line — no durable roadmap exists.  [gate: indeterminate · degrade_reason: no git, no plan]
```

The ASCII roadmap + the trust trailer with the `⚠️ lean your scrutiny here` line (naming the single load-bearing guess) and the one-line legend is **mandatory** on every output; deferred items keep the `(deferred)` word so the widget's dashed chips have a text twin.

## Boundaries

- **Not `/orient-status`** — that reports *position + remaining + a banded ETA* on the ONE node you stand on; orient-roadmap reports the **forward horizons and the runway** (the increment arc, the next clusters, the stage lanes). They share one sweep; orient-roadmap owns the horizon board, orient-status owns position + ETA on the current increment.
- **Not `/orient-map`** — that reports **topology + the delta since your last look** (done → here → next, a tree on a branch, capped at ≤5 nodes); orient-roadmap reports **where the work is GOING** (increments not yet reached, the runway of gated stages, the deferred lanes). orient-map is retrospective/delta; orient-roadmap is prospective/multi-horizon.
- **Not `/plan-create` or `/plan-deep-dive`** — those DESIGN or WALK a plan; orient-roadmap only SEES and reports the current roadmap NOW against whatever evidence exists (often no formal plan).
- **Not `/reflect`, not `insight-*`** — those THINK / DECIDE; orient-roadmap only SEES and reports the horizons NOW. After it, reach for `/orient-status` for the ETA on the current increment, or `/plan-create` to act on the next horizon.
- **Read-only.** It never mutates state; the north-star/intent and the anchor are caller-supplied or inferred, never written to disk by default.

## Rules

- MUST be **horizon-first** — lead with the forward increments and the runway; the retrospective delta belongs to `/orient-map`, not here.
- MUST render the **increment arc as a ≤3-node spine** (one `current`, the hero) and the **runway as ≤3 stage boxes** (now → gated-next → future); if a live emission exceeds that, **decompose** into an overview arc + a drill-down runway rather than cram (the ≤5-node-per-sub-graph budget).
- MUST own and emit the horizon fields (`arc_current`, `arc_idx`/`arc_count`, `paramount_ref`, `now_count`, `next_count`, `runway_span`, `cleanup_now_count`, `deferred_count`) so sibling slices don't recompute the horizons.
- MUST keep the **tier axis** (`◆◐◌`, provenance) and the **state/role axis** (the handler emoji `✅◉🔄★▢◌⚠`) separate — `★` is a *paramount role* marker on a next-item chip, NEVER a tier glyph; the YAS `★ ratified` tier rides only the trust trailer.
- MUST take `intent` / the north-star as input and gate intent-dependent horizons when it's absent — never fabricate a north-star; below a grounding threshold draw a `NO SUBSTRATE` card, not a structural roadmap.
- MUST tag every field with a provenance tier and **fail closed** — `gate_status` = `degraded`/`indeterminate` with a sentinel, never a plausible verdict — on zero evidence.
- MUST emit a record conformant to `orient-spec/orient-record.yon` (reserved tags; increment nodes as `@CFG id=node.<x>` `kind=increment`; list fields as sidecar `@MAP`; `★`/`◌` as in-label render hints only; never `yon format` an instance).
- MUST emit the ASCII roadmap + the trust trailer with the `⚠️ lean here` load-bearing-guess line + the one-line legend; deferred items keep the `(deferred)` word so the widget's dashed chips have a text twin; the visual's ASCII twin is mandatory.
- MUST render the visual face per the render-face contract (Claude Code only, via `mcp__visualize__show_widget`): agent → YON record only; human + Claude + tool + explicit invocation → widget + ASCII twin; other runtime / no tool / indeterminate `handler_type` → ASCII twin (fail-closed). The widget is the **8-band roadmap board** (`viewBox="0 0 780 …"`, per-band `<g transform>` groups), the current increment the dominant node, carrying the `◆◐◌` tier glyphs (non-color) and **no emoji in the widget face**, chrome-compliant, verified by `tools/orient-roundtrip.mjs`.
- MUST delegate gathering to a bounded, read-only, depth-1 subagent and return **only** the bundle (no raw search noise), with a re-runnable proof on every attested field.
- The family footer MUST only suggest an **installed** skill.

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
