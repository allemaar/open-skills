---
name: map-init
description: Onboard Map Your Knowledge into a user's agent directives — check whether it is already installed, or offer to add the routing rules globally or per-project, for EVERY agent platform on the machine, with explicit consent and a per-platform manual fallback. Trigger when the user says "install map your knowledge", "set up myk", "make this my agents' default", or "/map-init". Idempotent and consent-first; per-file atomic and mixed-state honest.
visibility: public
self-improvable: true
triggers:
  - "/map-init"
  - "install map your knowledge"
  - "set up myk"
  - "make mapping my agents' default"
next-skills:
  - skill: map-this
    phrase: "/map-this"
    why: "With the directives installed, map the first project to see the system work."
  - skill: map-rules
    phrase: "/map-rules"
    why: "Read the shared protocol rules the directives now route every agent into."
---

# /map-init

The onboarding door for **Map Your Knowledge (MYK)**. It does exactly one job: make MYK the default way of working for the user's agents — with their explicit consent, on every agent platform they use, with every outcome reported exactly.

> kernel-version: MYK v2.3 `f2f96f2de49b4863bca55ee8f6004d24e00574a7db5e7e5ef0e3cb28c42510cf`

## Why every platform matters (say this to the user)

A knowledge graph is maintained by every agent that touches the vault. If one agent carries the rules and another does not, the uninformed one can undo in a session what the others maintain carefully. MYK works as a modus operandi only when EVERY resident agent loads it — that is why this skill offers the installation for all detected platforms, not just the one running it.

## Steps

1. **Detect platforms.** Identify every agent platform configured on this machine by its directive surface — e.g. Claude (`~/.claude/CLAUDE.md`, project `CLAUDE.md`/`.claude/`), Codex (`~/.codex/AGENTS.md`, project `AGENTS.md`), and any other agent instruction file the user names. Read-only detection; never guess at unfamiliar formats — ask.
2. **Check idempotently.** For each platform, check whether the FULL payload is already present — all three elements: the load-the-rules routing clause, the orient-from-the-root-map clause, AND the born-mapped clause (a mere `map-rules` name reference is NOT installed; partial presence = offer to complete the missing clauses, shown as a diff). If the full payload is present everywhere: report **"Nothing to do — you already have Map Your Knowledge installed"** per platform, and stop.
3. **Offer, with the choice and the benefits.** For each platform missing the rules, present: (a) the choice — **global** (all projects) or **project-local** (this project's directive file only); (b) the exact text to be added (small, shown in full — see the payload below); (c) the benefits in plain words: agents orient from the scope's map before acting, new data is born mapped, existing structures are respected via the elastic verdicts, and every agent behaves consistently. **This is optional and the user decides — per platform.**
4. **Apply exactly what was consented.** Insert the payload into the consented file(s) only. Show the diff before writing. Pre-check every consented target is writable BEFORE the first write; each file write is atomic; if a later platform's write still fails, report precisely which platforms succeeded and which did not, and offer the paste-fallback for the failed ones — the user is never left uninformed about a mixed state.
5. **Fallback: instruct, never force.** Where automation cannot edit a platform's directives (unknown format, no file access, a hosted agent like a web UI), print the exact snippet plus per-platform instructions: where the file lives, where to paste, and how to verify (ask the agent "what do you do before organizing vault markdown?" — the answer should name the map rules).

## The payload (what actually gets injected)

Two sentences, adapted to the platform's convention:

```text
- [myk.routing] Before creating, editing, moving, renaming, classifying, mapping,
  rolling up, archiving, or evaluating the organization of vault or project
  Markdown, load the map-rules skill and obey it; use map-this for bounded
  organize/housekeep work. When entering an organized scope, orient from its
  declared root map before acting; new files inside an organized scope are
  born mapped (creation and mapping are one approved set).
```

Plus, where the platform supports skills, a pointer to install the `map-*` family if absent.

## Safety invariants

- Idempotent: running twice changes nothing the second time.
- Consent-first, per platform, with the exact diff shown; global-vs-project is the user's call.
- Per-file atomic and mixed-state honest: every write is atomic per file, and the user always receives exact per-platform outcomes — never an unreported mixed state.
- Never touches vault content, other directives, or any file beyond the consented directive files.
- The user's existing directives are house style: if their file has its own structure/conventions, the insertion adapts to it (placement, list style) — the elasticity rules apply to THIS file too.

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
