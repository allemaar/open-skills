---
name: investigate
description: Gather facts (files, deps, patterns) without making changes. Trigger when the user runs /investigate or asks to "look into this", "explore the codebase", "understand how this works", "what files are involved", "map the dependencies", or wants read-only fact-gathering before deciding what to do.
caller-options:
  venue: [inline, delegated]
  default-policy: ask
visibility: public
self-improvable: true
next-skills:
  - skill: insight-assess
    phrase: "/insight-assess"
    why: "Evaluate options now that the facts are gathered"
  - skill: plan-create
    phrase: "/plan-create"
    why: "Turn the findings into a phased plan"
  - skill: prime-sweep
    phrase: "/prime-sweep"
    why: "When the gathering should be delegated to keep the caller's context clean (≥3 distinct sources OR ≥~10k tokens)"
  - skill: human-draw
    phrase: "/human-draw"
    why: "Files, dependencies and call paths are relational — a tree or lane figure lands faster than a bulleted inventory of paths"
triggers:
  - "/investigate"
  - "look into this"
  - "explore the codebase"
  - "understand how this works"
  - "what files are involved"
  - "map the dependencies"
---

# /investigate

Read-only fact-gathering — understand the codebase before acting.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

> **Caller Options.** Before executing, run the Caller Options protocol (`caller-options/SKILL.md`): triage this invocation for material optionality across the venues and modes declared in front-matter; if one path clearly dominates, proceed silently; otherwise surface the options to the caller. A resolved-invocation marker means COP already ran — execute the fixed combination directly, do not re-enter COP.

> **Fact-Gathering Protocol. READ ONLY.** No plans, no code, no refactors. Just facts.

## Phase 1 — Context Loading

1. **Parse the query** — identify target files, directories, or concepts from the user's request.
2. **List files** — read the target directory structure.
3. **Read entrypoints** — load `package.json`, `README.md`, index files, or whatever serves as the front door to the target area.

## Phase 2 — Pattern Discovery

1. **Search for usages** — grep for functions, components, or patterns relevant to the query. Follow call sites and import chains.
2. **Load relevant skills** — check if a domain skill applies:
   - If your repository maintains its own standards skills (UI conventions, coding standards), load the matching one — this pack does not ship them.
   - Otherwise → any matching installed skill for additional context

## Phase 3 — Reporting

Output a structured fact report:

- **Files Found** — paths to all relevant files, not just descriptions
- **Patterns Used** — architectural or implementation patterns in play
- **Dependencies** — what this area depends on; what depends on it
- **Constraints Discovered** — existing conventions, locked APIs, shared types — anything that would constrain a future implementation

## Rules

- MUST NOT create plans or write code — read only
- MUST include file paths in the report, not just descriptions

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
