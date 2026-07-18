---
name: double-check
description: Targeted re-verification of a specific claim, output, or decision. Re-read sources, challenge, cross-reference, and deliver a verdict. Trigger when the user runs /double-check or asks to "verify this", "re-check this", "are you sure about this", "go over this again", or "make sure this is right". Not /verify (formal phase gate needing intent+plan+execution artifacts) or /insight-critique (advisory review of an output) — double-check is a quick targeted re-read of one claim.
caller-options:
  venue: [inline, delegated]
  default-policy: ask
visibility: public
self-improvable: true
triggers:
  - "/double-check"
  - "verify this"
  - "re-check this"
  - "are you sure about this"
  - "go over this again"
  - "make sure this is right"
next-skills:
  - skill: verify
    phrase: "/verify"
    why: "Escalate from a single-claim re-check to the formal intent/plan/execution gate before proceeding"
  - skill: github-sync
    phrase: "/github-sync"
    why: "If the claim held up, commit and push the verified work"
  - skill: insight-adversarial
    phrase: "/insight-adversarial"
    why: "If the re-check raised doubt, stress-test the output from multiple adversarial POVs"
---

# /double-check

Multi-pass re-verification of a plan, output, decision, or document — re-read from scratch, challenge assumptions, propose improvements, and iterate until solid.

> **Re-Read & Improve Protocol — not a single-pass gate.** The agent re-reads the target fresh, challenges each part, proposes improvements, and iterates. Each pass tightens the result.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). It carries the five phases, the scope/verdict gates, and the rules as validatable records; this file is the explanation. Keep the two in sync — edit one, update the other and refresh the `@STAMP` date.

> **Caller Options.** Before executing, run the Caller Options protocol (`caller-options/SKILL.md`): triage this invocation for material optionality across the venues and modes declared in front-matter; if one path clearly dominates, proceed silently; otherwise surface the options to the caller. A resolved-invocation marker means COP already ran — execute the fixed combination directly, do not re-enter COP.

---

## Phase 1: Scope

Identify what is being double-checked — a plan, an output, a decision, a document. Load it fresh. Do not rely on prior context or cached understanding.

**Gate:** Cannot double-check without a clear target. If the target is ambiguous, ask before proceeding.

---

## Phase 2: Fresh Re-Read

Re-read the target from scratch as if seeing it for the first time. Go back to the **actual sources** — files, code, docs. Do not verify from memory or prior analysis alone.

Summarize:
- What it says
- What it assumes (implicit and explicit)
- What it depends on

List every assumption, stated or unstated.

---

## Phase 3: Challenge

Challenge each part of the target. Be **adversarial** — actively try to find problems.

For **plans:** Are any steps wrong, missing, out of order, or unnecessary?
For **outputs:** Are any claims unsupported?
For **decisions:** Were alternatives considered?

Look for:
- Gaps and omissions
- Wrong or unstated assumptions
- Over-engineering or under-engineering
- Scope issues
- Ordering issues
- Missing dependencies

---

## Phase 4: Improve

Propose concrete improvements based on the challenge findings.

For each issue found:
1. State the problem
2. Propose the fix
3. Explain why it's better

If the target is already solid, say so with evidence — but don't stop looking just because it seems fine.

---

## Phase 5: Verdict

Deliver one of three verdicts:

- **SOLID** — target holds up under scrutiny; cite evidence
- **IMPROVED** — issues found and fixes proposed; list them; offer to apply and run another pass
- **RETHINK** — fundamental problems; explain what needs to change

**Gate:** Double-check is incomplete without a verdict delivered to the user.

---

## Rules

- MUST go back to actual sources when re-reading — never verify from memory or prior analysis alone
- MUST be adversarial when challenging — actively look for problems, don't just confirm
- MUST cite evidence for every conclusion in the verdict
- MUST NOT rubber-stamp without substantive analysis
- SHOULD offer to apply fixes and run another pass when verdict is IMPROVED

---

## Next Steps

- `/execute` — if verdict is SOLID
- `/plan-create` — if verdict is RETHINK (redesign needed)

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
