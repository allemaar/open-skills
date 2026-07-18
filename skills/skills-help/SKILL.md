---
name: skills-help
description: The skills library menu — every skill grouped by family, each with a one-line description and a dual-doc/single-doc marker; pass a family name to drill into one family in full detail. Trigger with /skills-help, "list my skills", "which skill for X", "skills menu", "what skills do I have". Not /new-skill-creator (which scaffolds a new skill).
visibility: public
triggers:
  - "/skills-help"
  - "/skills-help {family}"
  - "list my skills"
  - "which skill for X"
  - "skills menu"
  - "what skills do I have"
next-skills:
  - skill: new-skill-creator
    phrase: "/new-skill-creator"
    why: "When the library menu shows no skill covers the need, create the missing one."
  - skill: insight-skill-gap
    phrase: "/skill-gap"
    why: "After browsing the roster and finding a hole, run the gap analysis to decide what to add or update."
---

# /skills-help

The menu for the **skills library** — every skill grouped by family, each with a one-line description and a marker showing whether it is dual-doc (`SKILL.md` + `protocol.yon`) or single-doc. A reference card; it changes nothing.

## How to use

- **`/skills-help`** (no argument) — print the full categorized menu below.
- **`/skills-help {family}`** — drill into one family: print only that family, each skill with full detail (full description, trigger phrases, format, runtime). Family keys are listed under *Family drill-down* below.

Before printing, refresh the menu against the live library:

1. Enumerate the sibling skill directories — the folders alongside this skill's own folder in the active skills root (`~/.claude/skills/`, `~/.codex/skills/`, or `~/.agents/skills/`, whichever loaded this skill). The repo source of truth is your skills repo clone (`<skills-repo>/skills/`).
2. For each skill, set its marker from the filesystem: `protocol.yon` present → ◆ dual-doc; absent → ◇ single-doc.
3. If a skill directory exists that is not in the menu below, render it under its best-fit family and append: *"⚠ {name} is not yet in the skills-help taxonomy — update this skill."* If a menu entry no longer has a directory, mark it *"(missing)"*.

The menu below is the editorial taxonomy plus a marker snapshot as of 2026-07-19, covering the skills this public pack ships. The live scan above is what keeps the markers and the roster honest — trust it over the snapshot when they disagree. A CI guard (`tools/consistency-guard.mjs`) fails the build if the snapshot ever names a skill the pack does not ship.

## Marker legend

- **◆** dual-doc — `SKILL.md` (self-sufficient) + `protocol.yon` (machine-executable spec)
- **◇** single-doc — `SKILL.md` only (routers, mode-setters, reference cards, short utilities)

## The menu

### Planning & execution
- ◆ `plan-create` — propose a phased, gated plan before any work begins
- ◆ `plan-deep-dive` — phase-by-phase deep inspection of an existing plan
- ◆ `plan-execute` — apply the last approved plan exactly
- ◆ `plan-phases` — restructure a flat plan into phases with verify gates
- ◆ `plan-cleanup` — remove planning artifacts after a plan runs
- ◇ `plan-evolve` — evolve any shipped target to its next version
- ◇ `verify` — formal phase gate over intent, plan, and execution
- ◇ `reflect` — lightweight cognitive pause, no gate

### Insight & decision
- ◆ `insight-explore` — brainstorm 3+ options before committing
- ◆ `insight-angles` — lens-based angle & connection discovery (classify → pick lenses → layered passes, novelty × relevance)
- ◆ `insight-assess` — structured pros/cons + impact evaluation
- ◆ `insight-critique` — advisory review of a plan, code, or output
- ◆ `insight-adversarial` — multi-pass, multi-POV persona stress-test
- ◆ `insight-cross-examine` — context-routed deliberation over a subject or set (angle discovery → critique → assess → explore + typed hybrids)
- ◆ `insight-retro` — post-implementation retrospective
- ◆ `insight-skill-gap` — surface new or updated skills after work
- ◆ `investigate` — read-only fact-gathering before deciding
- ◇ `double-check` — targeted re-verification of one claim or output
- ◆ `cold-review` — outside-agent review of work artifacts with fresh context

### Priming
- ◆ `prime-expand` — expand a vague gap into a concrete priming target via a delegated sub-agent; caller sees only the proposed pair for confirm/edit/refuse. Auto-fires on handoff receipt only; not ambient "I need to know X" (use /investigate for that)
- ◆ `prime-fetch` — proxy a noisy data-fetching tool call (Grep, Glob, WebFetch, MCP) through a sub-agent so the raw dump stays out of context; only the verified digest returns
- ◆ `prime-sweep` — parallel sub-agent investigation of large source surfaces, with waves, sufficiency gate, and proof-of-work on every finding
- ◆ `extract-signal` — elastic signal extraction with proportional gather, vet, and provenance

### Skill library (meta)
- ◇ `new-skill-creator` — scaffold a new skill into a repo you maintain, tri-runtime link, commit, push
- ◇ `skills-help` — this menu
- ◇ `next-skills` — recommend successor skills after one finishes (NSP)
- ◆ `self-improve` — propose concrete per-skill improvements after a run exposes a real signal

### Orchestration & dispatch
- ◇ `orchestrate-mode` — lead dispatches isolated workers, never executes directly
- ◇ `multi-agent-mode` — lead works directly but delegates helper slices
- ◇ `handoff` — generate a cold-agent handoff brief for a fresh session
- ◆ `handoff-execute` — execute a handoff brief with source gates, verification, and retro
- ◆ `caller-options` — route one skill invocation's venue and mode (COP)
- ◆ `ask-gate` — triage and quality-gate handler-facing questions
- ◆ `budget-check` — pre-wave usage gate: go / no-go / unknown before an expensive fan-out

### Orientation
- ◆ `orient-status` — quick "where are we" read: position, what's left, banded ETA
- ◆ `orient-map` — delta-first "show me the shape" read: what changed since your last look
- ◆ `orient-gaps` — surface what's stuck (blockers) and what's missing
- ◆ `orient-roadmap` — multi-horizon read: the increment arc, gates, and the runway ahead

### Human output
- ◇ `human-output` — the contract for writing anything a person will read and decide from
- ◇ `human-rewrite` — the repair pass on text that already exists, at guaranteed fidelity
- ◇ `human-draw` — decide whether the material wants a picture, then build it

### Code & architecture
- ◆ `improve-codebase-architecture` — find refactors that deepen shallow modules
- ◇ `design-an-interface` — generate and compare radically different interface designs
- ◇ `audit-coupled-constant` — audit duplicated constants and SEE ALSO trails
- ◆ `monorepo-deps` — syncpack, manypkg, and npm-update flow for npm workspaces

### Obsidian & vault
- ◇ `obsidian-cli` — drive a running Obsidian instance via the `obsidian` CLI
- ◇ `obsidian-markdown` — write valid Obsidian-flavored markdown
- ◇ `obsidian-bases` — create and edit Obsidian Bases (`.base` YAML files)
- ◇ `json-canvas` — create and edit JSON Canvas (`.canvas`) files

### YON
- ◇ `yon-read` — read, interpret, or explain existing YON content
- ◇ `yon-write` — write or compile content into YON

### Web
- ◇ `defuddle` — extract clean markdown from web pages

### Git & sync
- ◆ `github-sync` — review session changes, then commit and push to GitHub
- ◆ `diff-recap` — turn a git diff into a PR-pasteable recap, one row per changed file

## Family drill-down

`/skills-help {family}` prints one family in full detail. Accepted keys (and aliases):

| Key | Aliases | Family |
|---|---|---|
| `planning` | plan, plans, execution | Planning & execution |
| `insight` | insights, review, decision | Insight & decision |
| `priming` | prime, primer, context-load | Priming |
| `meta` | skills, library, hygiene | Skill library (meta) |
| `orchestration` | orchestrate, dispatch | Orchestration & dispatch |
| `orientation` | orient, status, roadmap | Orientation |
| `code` | architecture, arch | Code & architecture |
| `obsidian` | vault | Obsidian & vault |
| `yon` | — | YON |
| `web` | — | Web |
| `git` | sync | Git & sync |

In drill-down mode, for each skill in the family read its `SKILL.md` front-matter and present: name, full description, format (dual-doc/single-doc, from the live `protocol.yon` check), and `runtime:` (default `[claude, codex, agents]` when the field is absent). If the argument matches no key or alias, print the key table above and stop.

## Boundary

This is a reference card — it lists and explains skills, it changes nothing. For a health audit of the library (description quality, cross-references, runtime parity), the pack's guards run in CI (`tools/lint.mjs`, `tools/consistency-guard.mjs`). To scaffold a new skill use `/new-skill-creator`.
