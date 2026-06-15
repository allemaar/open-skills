---
name: insight-angles
description: >
  Angle & connection discovery engine. Classifies a subject (domain, type, current trends), picks lenses from a 15-family roster AND derives dynamic subject-specific ones, then runs layered passes via a context-adaptive venue (cold fan-out for independence — the cold-review effect — or inline) to surface frames, typed connections, hidden assumptions, candidate-expansions, and second-order effects, scored by novelty × relevance. Trigger on /insight-angles, "find unseen angles", "what connections am I missing", "what are we not seeing", "surface hidden assumptions", "reframe this". Not insight-explore (generates solution options — angles surfaces frames & connections) or insight-adversarial (attacks for flaws via personas — angles widens via lenses). Not insight-critique (reviews an output) or insight-cross-examine (the deliberation engine that orchestrates this one).
visibility: public
self-improvable: true
next-skills:
  - skill: insight-cross-examine
    phrase: "/insight-cross-examine"
    why: "Deliberate to a decision over the angles and candidate-expansions you surfaced"
  - skill: insight-assess
    phrase: "/insight-assess"
    why: "Evaluate a candidate-expansion you want to take forward"
  - skill: insight-explore
    phrase: "/insight-explore"
    why: "Turn a promising frame into concrete implementation options"
triggers:
  - "/insight-angles"
  - "find unseen angles"
  - "what connections am I missing"
  - "what are we not seeing"
  - "surface hidden assumptions"
  - "reframe this"
---

# /insight-angles

A lens-based, multi-pass discovery engine. Where `/insight-explore` asks "what are the ways to build this?" and `/insight-adversarial` attacks for flaws via personas, **insight-angles asks "what frames, connections, assumptions, and second-order effects are not yet visible?"** — and finds them by pointing the right *lenses* at the subject. It can run each lens as a **cold sub-agent** (fresh context, no anchoring) — independence is what makes discovery work, the same reason `/cold-review` outperforms inline `/verify` at *finding* things — and **picks cold vs inline per subject**, asking only when it isn't sure. Read-only and advisory — it surfaces, never decides or changes anything.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## The lens roster (seed, not ceiling)

16 families, grouped by what they perturb. **Core** = candidate for most subjects; **Specialist** = domain-triggered. **Always also derive dynamic, subject-specific lenses** (see below) — the roster is a seed.

| Family | Tier | Operators | Best for |
|---|---|---|---|
| **Reframe** | Core | inversion · via-negativa ("what guarantees failure?") · pre/pro-mortem · meta-frame ("right question?") · first-principles · counterfactual | stuck / ambiguous / strategic |
| **Analogy** | Core | cross-domain · structural isomorphism · biological/evolutionary · historical parallel | novel problems, naming, design |
| **Temporal** | Core | precedent · path-dependency · future-back · cyclicality · "why now?" · lifecycle stage | timing, strategy, forecasts |
| **Perspective** | Core | absent stakeholder · adversary/competitor · payer vs beneficiary · future maintainer/user · novice vs expert | product, org, strategy |
| **Systems** | Core | feedback loops · incentives · externalities · 2nd/3rd-order · stocks/flows · bottlenecks | policy, platform, ecosystem |
| **Constraint** | Core | relax · tighten 10× · swap · the binding constraint · fixed vs *assumed*-fixed | design, optimization, planning |
| **Epistemic** | Core | load-bearing assumption · weakest evidence · what-would-change-our-mind · unknown-unknowns · information asymmetry · observability | research, forecasts, high-stakes |
| **Zoom** | Specialist | in · out · across · boundary/interface | architecture, scope, scale |
| **Formal/Structural** | Specialist | invariants · symmetries · limits & edge cases · conservation · the formal model | technical, math |
| **Power & Politics** | Specialist | who holds/gains/loses power · gatekeepers · coalitions · feasible vs optimal | org, strategy, governance |
| **Human/Behavioral** | Specialist | cognitive biases · status/identity/fear/desire · friction & defaults · rewarded behavior | product, UX, change mgmt |
| **Economic/Value** | Specialist | cost structure · value capture · opportunity cost · marginal vs fixed · who pays | product, business |
| **Aesthetic/Elegance** | Core | simplicity · conceptual integrity · symmetry · the elegant version · what to remove | design, UX, DX, ergonomics, writing, code |
| **Values/Ethical** | Specialist | harm-bearer · value tradeoffs · whose values are encoded · rights vs utility · intergenerational | values-laden / policy decisions |
| **Narrative** | Specialist | story told · hero/villain · the spin · meta-narrative · positioning | comms, positioning, naming |
| **Activation/Engagement** | Specialist | first-win · time-to-first-value (TTFV) · the hook / aha-moment · activation arc · drop-off & friction-to-activation · juice (satisfying feedback) | onboarding, first-run, tutorials, adoption funnels, growth/UX |

8 core (Aesthetic/Elegance included — it's good practice across UX, DX, design, ergonomics) + 8 specialist. A run still fires only 4–6 — the roster's job is to make the *picking* rich.

## Dynamic-lens derivation (the roster is a seed)

For every run, also derive subject-specific lenses from three named sources, then validate:

1. **Domain-native** — what would an expert *in the subject's home discipline* always ask here?
2. **Foreign-transplant** — what does a deliberately *distant* discipline ask that nobody here is?
3. **Live-trend** — from Classify's current-trends read, what recent shift / live debate reframes the space?
4. **Validate** — keep a candidate only if it generates a question the 15 families don't. Otherwise drop it as redundant.

## Typed connections

Each carries *type · the link · why it matters · what it enables*: **analogical** · **causal** · **structural** · **tension** (productive paradox) · **emergent** (A+B→C) · **dependency** · **resource** · **temporal**.

## Scoring — novelty × relevance

Every angle/connection is tagged: **novelty** (obvious / fresh / surprising, *relative to current trends*) · **relevance** (decision-relevant & actionable?) · **so-what** (what changes if true). Rank by novelty × relevance; the **strongest unseen angle** is the highest combined; flag high-novelty / low-relevance as "interesting but not actionable" rather than dropping it.

## Steps

1. **Frame** — state the subject and the dominant framing to escape. Light context only.
2. **Classify** — domain · subject-type · maturity · **current trends** (calibrates novelty, drives selection).
3. **Pick lenses** — select roster families for the subject-type, **plus derive dynamic lenses** (above). Log picked + skipped (+ why).
4. **Layered passes** — run the picked lenses (see venue below):
   - **Layer 1** — each lens → angles + typed connections, each scored.
   - **Layer 2+** — add 2–4 lenses, **informed by the prior layer** (re-read prior angles through new lenses; link findings; revise scores). Deeper than default depth is **HIL-gated**.
5. **Connect** — consolidate typed connections across layers, especially cross-layer links.
6. **Score & Synthesize** — finalize scoring; emit the angle map + synthesis (strongest angle · key connection · most-fragile assumption). If nothing non-obvious surfaced, **say so** — never manufacture insight.

## Venue & depth — context-adaptive

Cold fan-out is the discovery powerhouse (independence = the cold-review effect), but not every subject needs it. **Select the venue case-by-case from context / corpus / task; proceed when certainty is near-max, ask the handler only when it isn't.** Explicit overrides: "use agents" / "cold" forces fan-out; "inline" / "quick" forces inline.

- **Cold (fan-out)** when: high ambiguity, high stakes, novel subject, many lenses (anchoring risk), or independence clearly matters.
- **Inline** when: well-bounded, low stakes, few lenses, cost-constrained — or forced under a `*-RESOLVED` marker.

The three modes (selected adaptively, not by a fixed default):

- **standard** — cold fan-out: one fresh leaf sub-agent per picked lens. No shared context = no anchoring (the cold-review effect). Orchestrator collects + synthesizes. State the fan-out size up front; HIL-gate if it exceeds ~6 agents.
- **quick** — inline single pass (cheap). **Forced when orchestrated under a `*-RESOLVED` marker** (a lens-agent is a *leaf* — runs one lens, returns findings, spawns nothing — which keeps the depth guard intact).
- **deep** — cold fan-out across 2–3 layers; the orchestrator threads each completed layer's findings into the next layer's briefs (compounding at the orchestrator, independence in the agents). **HIL-gated** (cost).

Cold lens-agents are **leaf workers**: each gets a primed brief (subject + its one lens [+ prior-layer findings in deep mode]), runs cold, returns its angles/connections, and orchestrates nothing further.

**Runtime:** cold fan-out needs a sub-agent-capable runtime (Claude's `Agent` / isolation). On runtimes without isolated workers (Codex, generic `.agents/`), all modes fall back to inline — the adaptive selector degrades gracefully since inline is always available.

## The angle map (output)

Selected lenses (+ dynamic ones + skipped & why) → angles grouped by lens, each scored → typed connections (each with why-it-matters) → hidden assumptions (most-fragile flagged) → candidate-expansions → second-order effects → **synthesis** → layer trail.

## Rules

- MUST surface ≥1 genuine connection or unseen angle, or explicitly state none found — never an empty map, never manufactured insight.
- MUST derive dynamic subject-specific lenses (3 sources + validate), not only pick from the roster.
- MUST keep each layer informed by the prior layer's findings (layers compound; not independent re-runs).
- MUST select venue (cold vs inline) per subject from context/corpus/task; proceed when certainty is near-max, ask the handler only when it isn't; honor explicit overrides ("use agents" → cold, "inline" → inline).
- Cold lens-agents MUST be leaves — run one lens, return findings, spawn nothing.
- MUST stay in perspective/connection space: a **frame is not a flaw** (`/insight-adversarial`) and **not an option** (`/insight-explore`).
- MUST make each connection assessable (type + why), and judge novelty relative to current trends.
- MUST log lens selection (picked + skipped + why).
- MUST NOT exceed default depth (extra layers, or fan-out > ~6 agents) without explicit handler consent — state the cost and offer.
- MUST NOT make changes, write code, or execute — ideation only.
- Under a `*-RESOLVED` marker: run **quick (inline)** — never spawn further sub-skills.
- SHOULD prefer the non-obvious; flag high-novelty / low-relevance rather than dropping it.

## Self-improvement → roster discovery

This skill's SIP is specialized: **usage grows the roster.** When a *dynamic* lens this run produced a high novelty × relevance angle the roster lacked, SIP proposes a diff adding it to the lens roster + selection map (gated via `/ask-gate`, never auto-applied). When a roster lens consistently yields nothing for a subject-type, SIP proposes pruning/remapping it. The 15 families are the seed; real subjects reveal the rest.

## Boundary

- `/insight-explore` — generates **solution options**. insight-angles surfaces **frames & connections**; its candidate-expansions are seeds, not finished options.
- `/insight-adversarial` — **attacks** from personas for flaws. insight-angles **widens** via lenses (same multi-pass shape; personas attack, lenses reveal).
- `/insight-critique` — reviews a concrete **output**. insight-angles explores a **subject's representation**.
- `/insight-cross-examine` — the deliberation engine that **orchestrates** insight-angles (in quick mode), then assesses and recommends. Use cross-examine for a decision; insight-angles to just see more.
- `/cold-review` — outside review of *work artifacts* against objectives. insight-angles borrows its cold-agent *independence*, but for *angle discovery on a subject*, not artifact review.

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill — *including a dynamic lens worth promoting into the roster* — propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
