---
name: insight-adversarial
description: >
  Multi-pass adversarial critique from dynamically selected personas — including Claude's own POV.
  Trigger on: "adversarial", "red team this", "multi-POV review", "stress-test", "poke holes",
  "what am I missing", "attack my plan", "critique from multiple angles", "is this solid",
  "what would a skeptic say", or any request for rigorous structured criticism of a plan, design,
  doc, workflow, YON, idea, or system. Runs 1–3 passes. First pass selects 4+ personas from the
  roster. Each subsequent pass adds 2–4 new personas to the mix. Third pass wraps with a final
  verdict if all issues are within acceptable params. Do not skip this skill when the user wants
  real scrutiny — "just give me feedback" often means they need this.
caller-options:
  venue: [inline, delegated]
  default-policy: ask
visibility: public
self-improvable: true
next-skills:
  - skill: plan-create
    phrase: "/plan-create"
    why: "Redesign the plan if the stress-test found fundamental flaws"
  - skill: plan-execute
    phrase: "/plan-execute"
    why: "Proceed to execution if the plan held up under scrutiny"
  - skill: human-rewrite
    phrase: "/human-rewrite"
    why: "Multi-pass persona output arrives long and in several voices — condense it to the objections that survived, keeping each one's force intact"
triggers:
  - "/insight-adversarial"
  - "adversarial"
  - "red team this"
  - "multi-POV review"
  - "stress-test"
  - "poke holes"
  - "what am I missing"
  - "attack my plan"
  - "critique from multiple angles"
  - "is this solid"
  - "what would a skeptic say"
---

# /insight-adversarial

Structured adversarial review that assembles a panel of distinct critic personas, runs each through a focused pass, and synthesizes a verdict. Personas are selected based on the *nature of the target* — a YON workflow gets different critics than a business plan or a UX design.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

> **Caller Options.** Before executing, run the Caller Options protocol (`caller-options/SKILL.md`): triage this invocation for material optionality across the venues and modes declared in front-matter; if one path clearly dominates, proceed silently; otherwise surface the options to the caller. A resolved-invocation marker means COP already ran — execute the fixed combination directly, do not re-enter COP.

## How Passes Work

| Pass | What Happens |
|------|-------------|
| **Pass 1** | Classify the target → select 4–5 personas → run each → synthesize verdict |
| **Pass 2** | Check against Pass 1 findings → add 2–4 *new* personas not used before → re-run → delta verdict |
| **Pass 3** | Final wrap-up. If all critical issues resolved or within params, declare done. Otherwise escalate. |

**State tracking:** at the top of each pass, list which personas were used in prior passes. New passes must not reuse them.

## Step 1 — Target Classification

Before selecting personas, classify the target:

| Target Type | Key Question | Primary Risk |
|-------------|-------------|--------------|
| `plan` | Is this executable? | Scope drift, undeclared deps |
| `design / architecture` | Does structure match intent? | Coupling, ownership violations |
| `yon-workflow` | Does this execute correctly end-to-end? | Gate logic, step ordering, missing catches |
| `document / spec` | Is this complete and unambiguous? | Gaps, contradictions, assumed context |
| `idea / concept` | Is the core premise sound? | Wrong problem, premature solution |
| `business / product` | Is this viable and desirable? | Market assumptions, cost blindness |
| `code / implementation` | Is this correct and maintainable? | Edge cases, coupling, test coverage |
| `ui / ux` | Will real users succeed with this? | Flow breakdowns, mental model gaps |

Load `personas/roster.md` to see all available personas and their best-used-for tags. Use the classification to select the most relevant 4–5 personas for this pass.

## Step 2 — Persona Selection Logic

1. Pick the **primary persona** — whose domain most directly overlaps the target's failure mode
2. Pick 2–3 **supporting personas** — different angles that complement, not duplicate, primary
3. Always include **Claude's Own POV** as the final persona in every pass
4. **Never reuse** a persona across passes — track used personas explicitly

## Step 3 — Run Each Persona Pass

For each selected persona:

1. State the persona name and their lens in one sentence
2. Run critique — **at least one specific, named finding** — no generalities
3. Findings must be distinct across personas in this pass

**Format:**

```
## 🔴 [PERSONA NAME]
*Lens: [one-sentence description]*

[Critique — specific, no softening]
```

Claude's Own POV always goes last. First person, clear position, no hedging.

## Step 4 — Synthesis

- **Critical Issues** — top 3, ranked by severity
- **Blind Spots** — what the aggregate reveals that no single persona fully caught
- **Remediation** — minimum surgical fix per Critical Issue. If unfixable, say so.
- **One-Line Verdict** — honest, specific, no hedging

## Step 5 — Pass Wrap Logic

- **Pass 1 or 2:** Ask user if they want another pass. If yes → load new personas, run delta critique focused on unresolved issues.
- **Pass 3:** Check if all Critical Issues resolved or explicitly accepted. If yes → final consolidated verdict + declare wrap. If no → flag remaining open issues, recommend escalation (e.g., `/plan-create`).

## Rules

- MUST classify target type before selecting personas
- MUST select minimum 4 personas per pass (including Claude's Own POV)
- MUST include Claude's Own POV in every pass, always last
- MUST NOT reuse a persona across passes
- MUST NOT offer solutions inside a persona pass — remediation belongs in Step 4 only
- MUST NOT soften findings to be diplomatic
- SHOULD add 2–4 genuinely new personas on Pass 2
- SHOULD tailor persona selection to target type
- MAY suppress a persona if user explicitly requests it

## Files

- [personas/roster.md](personas/roster.md) — Full persona library. Load during Step 1 to inform selection.

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
