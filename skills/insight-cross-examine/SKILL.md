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
  - skill: human-draw
    phrase: "/human-draw"
    why: "A set weighed against shared criteria is a matrix — draw the decision surface so the trade-offs are visible in one pass"
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
- **Corpus** — `over-large` · `thin` · `adequate` · `rich`. Judge relevance, reliability and decision coverage, not document volume. Missing evidence is different from missing options.

**Depth dial:**

- **L0** — refuse/escalate (Gate 0; overridable)
- **L1** — light: one quick assess; Angle Discovery skipped or one line; no explore/hybrids
- **L2** — standard: brief Angle Discovery → critique → assess
- **L3** — expanded: full Angle Discovery → critique → assess → explore if options are missing → assess additions
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

Run selected sub-skills **inline under depth-1 `CX-RESOLVED`**. As caller, suppress their NSP/SIP/gate surfacing and nested delegation; collect findings for one final presentation. Load only selected skills. If one is unavailable, name the coverage gap and continue the ordinary assessment without claiming that method ran.

- **L1** — one quick `/insight-assess`.
- **L2** — `/insight-critique` then `/insight-assess`.
- **L3** — L2, then `/insight-explore` when options need expansion; assess additions and update only conclusions affected by new evidence or options.

Check each selected helper’s declared subject contract first. Keep software-specific critique/exploration for matching subjects; for other domains use an explicit domain-appropriate assessment or expansion within the selected depth and report the skipped software method. Do not force a general decision into code/repository criteria or imply that an unavailable method ran.

**Reuse before rerunning.** Carry forward assessments whose evidence and criteria still apply, including per-item findings. Reassess only new options or affected conclusions; keep extra loops subject to the existing escalation gate.

**Choose a method only for a decision-changing uncertainty.** Within the selected depth, use at most one relevant specialist: `/insight-premortem` for future failure paths; `/insight-root-cause` for observed failures; `/insight-value-of-information` for whether more evidence is worth obtaining; `/insight-test-assumption` for a discriminating test design; `/insight-reference-class` for an outside-view estimate. Feed findings into assess. Do not run a checklist or chain their handoffs; ordinary cases need none.

**Avoid premature closure.** Keep a light explore/angle pass when the handler requests exploration, framing is ambiguous, or all options score in one band with no High/Medium critique risks and no prior explore pass. If candidates are already adequate and the gap is evidence, name the missing evidence instead of generating more options. A recommendation to defer or obtain specific evidence is valid; do not invent a winner.

## Phase 3 — Sets & typed hybrids

At L2 or above, for `comparison` / `list` / `set` forms (or any post-discovery space with **≥2 combinable elements**):

1. **Per-item** — reuse completed critique+assess findings and fill only gaps, with the **same dimensions** across items. For a large set, *offer* fan-out — never auto-spawn (token burn → HIL consent).
2. **Typed hybrid synthesis** — find *coherent* combinations and **classify why each exists**:
   - **complementary** — A covers B's weakness
   - **sequential** — A unlocks B later
   - **layered** — A handles strategy, B handles implementation
   - **reframed** — A and B imply a better C
   - **constraint-splitting** — use A under one condition, B under another

   Hybrids are **first-class options** alongside the individuals. Surface **at most 3**; log-and-truncate the rest. Don't manufacture hybrids just to fill type categories. Before recommending a hybrid, critique and assess its combined feasibility, dependencies and costs against the same criteria; reuse constituent findings rather than assuming their benefits simply add. If evidence is insufficient, label it provisional.

## Phase 4 — Coverage check (adaptive critic)

Before the recommendation, run a brief completeness pass: from the relevant angle menu — practical · strategic · adversarial · human · systems/second-order · opportunity · failure-mode — **select the angles that fit this subject** and state which were **covered** and which were **intentionally skipped, with the reason**. This is an *adaptive critic*, not a fixed all-green checklist — the honest "we did not look at X because Y" is the deliverable. It helps detect incompleteness when you can't yet name what feels missing.

Before dispatch, bind the worker and total invocation to finite deadlines and resource limits, with a named monitoring owner, observable progress, a cancellation handle and terminal success/failure/timeout outcomes. Use native controls; include read-only scope and no-child instructions in research briefs. On failure or timeout, cancel owned work and report retained partial results and unchecked coverage. If these controls are unavailable, do not dispatch. Use the existing bounded inline fallback when permitted, labeling it non-independent; empty or failed returns never count as completed coverage.

## Depth escalation — HIL-gated, never auto

Going beyond the cap (>3 hybrids), L4→L5, fan-out on a large set, or extra re-assess loops are **explicit offers**, never auto-executed: *"Want me to go deeper / examine more hybrids / fan out across the set?"* — state the rough token cost and wait.

## Phase 5 — Present (gate or inline, orthogonal to depth)

Mode is decided by **fire-context**, independent of the depth level:

- **Standalone user call** → **gate**: form the decision question and hand it to `/ask-gate` (AGP). Keep the gate question **lean** — options + recommendation only; the insight trail goes in the surrounding prose, not stuffed into the `AskUserQuestion` fields.
- **Sub-step / agent caller / a `*-RESOLVED` marker present** → **inline**: return the full decision surface as a structured block.
- **Override** — `--gate` / `--inline` forces a mode.

**Decision surface** carries: the **committed recommendation** (including deferral or specific evidence gathering when no choice is defensible); the **top 2–3 alternatives**; and — always — the **assumption most likely to be wrong** and **what would change the recommendation**. At L3+ it also carries the **strongest unseen angle discovered** and the **most important connection found**, plus an optional *"go deeper?"* offer when (and only when) it would add value. Lighter passes (L1/L2) keep the trail short.

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

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): apply its signal taxonomy and threshold to this run; surface any surviving proposal for handler approval. Conservative — silent otherwise. Never auto-apply.
