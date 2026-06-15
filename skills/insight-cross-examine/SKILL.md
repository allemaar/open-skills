---
name: insight-cross-examine
description: >
  Context-routed deliberation engine. Takes a subject OR a set, routes by Form × Corpus to a graduated depth, discovers unseen angles & connections (via insight-angles), then runs critique → assess (+ explore, + typed hybrids for sets) and presents a decision surface — as an ask-gate or inline. Trigger on /insight-cross-examine, "cross-examine this", "weigh these options", "pick between these and recommend", "evaluate these candidates". Not insight-critique (single-output review) or insight-assess (single-decision eval) — cross-examine orchestrates both across one-or-many with hybrids and contextual routing. Not insight-explore (pure divergence), insight-angles (the angle/connection engine it orchestrates), ask-gate (governs the question, not the subject), or plan-deep-dive (phase-by-phase plan inspection).
visibility: public
self-improvable: true
next-skills:
  - skill: plan-create
    phrase: "/plan-create"
    why: "Turn the recommended option or hybrid into a phased plan (if the verdict is PROCEED)"
  - skill: insight-angles
    phrase: "/insight-angles"
    why: "Dig for more unseen angles and connections on the subject"
  - skill: insight-explore
    phrase: "/insight-explore"
    why: "Generate more candidates if the set is too thin or none fit"
  - skill: insight-adversarial
    phrase: "/insight-adversarial"
    why: "Stress-test the leading option from multiple adversarial POVs before committing"
triggers:
  - "/insight-cross-examine"
  - "cross-examine this"
  - "weigh these options"
  - "pick between these and recommend"
  - "evaluate these candidates"
---

# /insight-cross-examine

Given a **subject** or a **set of subjects**, cross-examine routes by context to the right depth, **discovers the angles and connections not yet visible**, runs the insight battery (`/insight-critique` → `/insight-assess`, plus `/insight-explore`, plus hybrid synthesis), and hands back a **decision surface** — a recommendation over the items and viable hybrids, *plus the insight trail that produced it*. Its thesis: **route → discover angles → expose connections → assess → recommend.** It surfaces the decision either as an **ask-gate** (fired standalone) or **inline** (fired as a sub-step), and never auto-dives into expensive analysis without the handler's consent.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## Gate 0 — Stop-first (before any heavy processing)

A cheap pre-flight that runs **before** the router and before any sub-skill fires, so a 500-item set or a mis-aimed invocation never triggers the battery. It is an **escalation warning, not a hard stop** — warn the handler, then proceed if they override.

Warn + escalate to the handler when:

- **Over-large corpus** — a set beyond ~8–10 items, or a subject whose source-gathering would blow a normal read budget. Name the size; offer sampling / fan-out.
- **Ill-fit** — the subject isn't a decision/evaluation target. Redirect instead of grinding: factual lookup → `/investigate`; question-quality → `/ask-gate`; pure divergence with no evaluation → `/insight-explore`; "just surface angles/connections, no decision" → `/insight-angles`.
- **Unframeable** — no coherent subject to route.

State the reason and the suggested alternative, then let the handler decide. **If pressed ("do it anyway"), proceed best-effort** (with sampling/fan-out for the over-large case). The number is guidance for the warning, not a wall.

## Phase 0 — Contextual router (Form × Corpus → depth)

Classify two axes, then read the depth level off the matrix. The output is a level on a graduated **depth dial** — so a rich single subject gets a light touch and an open question gets discovery-first. **Every phase below, including Angle Discovery, scales to this level.**

- **Form** — `single` · `comparison (A vs B)` · `list (small ≤~5)` · `set (large >~5)` · `open-question (no candidates yet)`
- **Corpus** — `over-large` · `thin` · `adequate` · `rich`

**Depth dial:**

- **L0** — refuse/escalate (Gate 0; overridable)
- **L1** — light: one quick assess; Angle Discovery skipped or one line; no explore/hybrids
- **L2** — standard: brief Angle Discovery → critique → assess
- **L3** — expanded: full Angle Discovery → critique → assess → explore → re-assess
- **L4** — comparative: full Angle Discovery → per-item critique+assess + typed hybrids
- **L5** — deep: re-assess loops, adversarial, fan-out — **never auto; HIL-gated**

| Form ↓ \ Corpus → | **over-large** | **thin** | **adequate** | **rich** |
|---|---|---|---|---|
| **single** | L0 → HIL | L3 | L2 | L1 (offer L2) |
| **comparison** | L0 → HIL | L3 (explore "is there a C?") | L4 (hybrids A+B) | L2 |
| **list (small)** | L0/partial → HIL | L4 + explore | L4 | L4 (offer fan-out) |
| **set (large)** | L0 → HIL (offer sampling) | L3 sample + explore | L4 fan-out *(HIL consent)* | L4 fan-out *(HIL consent)* |
| **open-question** | L0 → HIL | L3 discovery-first | L3 | L3 (constrained discovery) |

## Phase 1 — Angle Discovery (depth-scaled, depth-guarded)

Before assessment hardens around the known options, surface what isn't yet visible. **Orchestrate `/insight-angles` inline under the depth-1 `CX-RESOLVED` marker** — do *not* reimplement a parallel angle engine. Scale it to the depth level: **L1 skips it (or one line "any unseen frame? — no"); L2 brief; L3+ full.**

`/insight-angles` returns: **frames** (other ways to read the subject) · **latent-connections** (surprising links between items/concepts/constraints/goals) · **missing-angles** (perspectives not represented) · **hidden-assumptions** (claims the current framing rests on) · **candidate-expansions** (new options/hybrids worth assessing) · **second-order effects**.

**Feed `candidate-expansions` into the option set** so critique/assess evaluate them too. For an **open-question** form, Angle Discovery's candidate-expansions *are* the initial candidates — don't double-run a separate explore.

## Phase 2 — Run the battery (depth-driven, depth-guarded)

Run the sub-skills the level calls for, all **inline under `CX-RESOLVED`** so they skip their own NSP/SIP/gate surfacing and return raw findings — you own the single final presentation.

- **L1** — one quick `/insight-assess`.
- **L2** — `/insight-critique` then `/insight-assess`.
- **L3** — L2, then `/insight-explore` to expand, then **re-assess the expanded set**.

**Avoid premature closure.** Run a light explore/angle pass before hardening the recommendation when *any* of: the handler says they're exploring angles; the subject is high-ambiguity; or the first critique/assess **converges suspiciously fast** — concretely, all options score in one band *and* critique surfaced zero High/Medium risks *and* explore hasn't run yet. Exploration is not only a thin-input fallback; it's the guard against closing too early.

## Phase 3 — Sets & typed hybrids

For `comparison` / `list` / `set` forms (or any post-discovery space with **≥2 combinable elements**):

1. **Per-item** — critique+assess each item with the **same dimensions**. For a large set, *offer* fan-out — never auto-spawn (token burn → HIL consent).
2. **Typed hybrid synthesis** — find *coherent* combinations and **classify why each exists**:
   - **complementary** — A covers B's weakness
   - **sequential** — A unlocks B later
   - **layered** — A handles strategy, B handles implementation
   - **reframed** — A and B imply a better C
   - **constraint-splitting** — use A under one condition, B under another

   Hybrids are **first-class options** alongside the individuals. Surface **at most 3**; log-and-truncate the rest. Don't manufacture hybrids just to fill type categories.

## Phase 4 — Coverage check (adaptive critic)

Before the recommendation, run a brief completeness pass: from the relevant angle menu — practical · strategic · adversarial · human · systems/second-order · opportunity · failure-mode — **select the angles that fit this subject** and state which were **covered** and which were **intentionally skipped, with the reason**. This is an *adaptive critic*, not a fixed all-green checklist — the honest "we did not look at X because Y" is the deliverable. It helps detect incompleteness when you can't yet name what feels missing.

## Depth escalation — HIL-gated, never auto

Going beyond the cap (>3 hybrids), L4→L5, fan-out on a large set, or extra re-assess loops are **explicit offers**, never auto-executed: *"Want me to go deeper / examine more hybrids / fan out across the set?"* — state the rough token cost and wait.

## Phase 5 — Present (gate or inline, orthogonal to depth)

Mode is decided by **fire-context**, independent of the depth level:

- **Standalone user call** → **gate**: form the decision question and hand it to `/ask-gate` (AGP). Keep the gate question **lean** — options + recommendation only; the insight trail goes in the surrounding prose, not stuffed into the `AskUserQuestion` fields.
- **Sub-step / agent caller / a `*-RESOLVED` marker present** → **inline**: return the full decision surface as a structured block.
- **Override** — `--gate` / `--inline` forces a mode.

**Decision surface** carries: the **committed recommendation**; the **top 2–3 alternatives**; and — always — the **assumption most likely to be wrong** and **what would change the recommendation**. At L3+ it also carries the **strongest unseen angle discovered** and the **most important connection found**, plus an optional *"go deeper?"* offer when (and only when) it would add value. Lighter passes (L1/L2) keep the trail short.

## Constraints

- Advisory / read-only — never make changes, write code, or execute. Offer `/plan-create` as the successor that does.
- Angle Discovery **orchestrates `/insight-angles`** — never reimplement a parallel angle engine inside this skill.
- **Depth-scale every phase**, Angle Discovery included — never run heavy discovery/coverage on an L1 case.
- Never auto-dive past the cap or into L5 / fan-out without explicit handler consent.
- Final output must **surface at least one connection or unseen angle, or explicitly state none was found** — never silently omit.
- Always deliver a committed recommendation; cap hybrids at 3 and log truncation.
- **Ground the whole artifact, not the named slice.** When the subject is a decision about a multi-file artifact — a dual-doc skill (front-matter + `SKILL.md` + `protocol.yon`), or any file with siblings — enumerate and read **all** its constituent files before concluding. The prompt often names only a subset, and a partial read can flip the verdict; treat "which files compose this subject, and have I read them all?" as a hidden-assumption check in Phase 1.

## Boundary

- `/insight-angles` — the angle/connection/assumption engine cross-examine *orchestrates* in Phase 1. Reach for it directly to surface angles & connections without making a decision.
- `/insight-critique`, `/insight-assess`, `/insight-explore` — the single-purpose tools cross-examine orchestrates. Use one directly for exactly that one pass on one subject.
- `/ask-gate` — governs *the question* asked of the handler; cross-examine governs *the subject*, then hands its formed question to ask-gate for the gate path.
- `/plan-deep-dive` — phase-by-phase inspection of an existing plan; cross-examine routes-and-evaluates an arbitrary subject or set.

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
