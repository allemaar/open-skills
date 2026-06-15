# COP Candidate Register

The Caller Options participation register. **Per-skill `protocol.yon` / front-matter is canonical** for each skill's dimensions; this file is a derived index — `skills-audit` cross-checks the two.

> **Register agreement (2026-06-14).** This file (the front-matter-derived *participant index*) and `docs/nsp-cop-audit.md` (the per-skill *triage record*) MUST agree on every skill's COP verdict. On disagreement, apply the **self-orchestrator exclusion test** (`OPT-IN-BLOCK.md` § Excluded skills): a skill that infers venue/mode internally is Excluded even if caller overrides exist. Enforcing this agreement via lint is logged in `MAYBE.md`.

## Participants

Skills carrying the COP opt-in block. *Provisional — the venue set and the borderline `double-check` entry are confirmed by the Phase 1 venue dry-run sign-off.*

| Skill | Dimension | Notes |
|---|---|---|
| `insight-critique` | Venue | Venue-only — its Phase 1 "Classify" is subject-typing, not a skill path. |
| `investigate` | Venue | Textbook delegate candidate — heavy throwaway reads, bounded fact report. |
| `insight-adversarial` | Venue | Venue-only — pass-count optionality is already caller-surfaced by its own Step 5. |
| `double-check` | Venue | **Single-doc** — COP opt-in is the SKILL.md prose block only (no `protocol.yon` `@SEC`). Confirmed Participant: its protocol mandates re-reading from sources, the textbook delegate profile. |
| `cold-review` | Mode | Mode = the Step 3 reviewer-count tiers (1/2/3); venue forced `inline` (self-orchestrating). |
| `skills-audit` | Venue | Whole-library audit is a textbook delegate (heavy throwaway reads → bounded report); `inline` for small libraries. Front-matter `venue:[inline,delegated]`. *Reclassified from Excluded 2026-06-14: the caller can delegate the entire audit, so a real venue choice exists.* |
| `plan-deep-dive` | Venue | Front-matter `venue:[inline,delegated]`. *Reclassified from Never-delegate 2026-06-14 per front-matter-canonical + `docs/nsp-cop-audit.md` (Phase 3b, deliberate).* `inline` keeps the per-phase interactive forced-stop gates; `delegated` walks a long plan in a sub-agent and returns the consolidated verdict log. |
| `prime-sweep` | Mode | Mode = wave scope (single-source / multi-source / discovery / mixed); venue forced `inline` (it is itself the delegator). |
| `prime-fetch` | Venue | Declares **delegation intent** for the `/prime-*` family — `venue:[inline]` today (the prime skill runs inline as the delegator). Deliberate per `docs/nsp-cop-audit.md` (COP: yes, line 53), not vestigial. |
| `prime-expand` | Venue | Same delegation-intent declaration as `prime-fetch` (`docs/nsp-cop-audit.md`, COP: yes, line 52). |

## Deferred — COP-pending

COP is folded into this skill's separate dual-doc migration (locked by `/insight-assess`).

| Skill | Dimension | Status |
|---|---|---|
| `handoff` | Mode | COP-pending — 3 genuine profiles (agent / orchestrator / new-session). |

**Migration-brief clause** — paste into `handoff`'s dual-doc migration brief as an acceptance criterion:

> Add the COP opt-in block per `caller-options/references/OPT-IN-BLOCK.md`: the `caller-options:` front-matter contract (`modes: [agent, orchestrator, new-session]`, `venue: [inline]`, `default-policy: ask`), the SKILL.md prose block, and a `step:cop` `@SEC` in the new `protocol.yon`. `handoff`'s Mode is its 3 profiles, currently selected by interactive Q&A — COP surfaces that selection. Venue is `inline` only — `handoff` is interactive (field-collection Q&A), not a delegatable read.

## Excluded — non-participants

Zero COP optionality; no opt-in block by design.

| Skill | Reason |
|---|---|
| `improve-codebase-architecture` | Self-orchestrating (parallel design sub-agents), no hidden modes; its optionality is already caller-surfaced (Steps 3 / 6 / 7). |
| `orchestrate-mode` | Session-mode-setter — delegating it would set the mode in the sub-agent's session (void); no internal modes → zero COP optionality. (Phase 1 dry-run finding.) |
| `multi-agent-mode` | Session-mode-setter — same as `orchestrate-mode`: no venue optionality, no modes. (Phase 1 dry-run finding.) |
| `insight-cross-examine` | Self-orchestrating (sub-analyses + HIL-gated fan-out); depth auto-routed (Form × Corpus) and present-mode by fire-context — decides internally, hides no caller choice. Venue forced `inline`. |
| `insight-angles` | Self-orchestrating (cold lens fan-out); has modes (quick/standard/deep) + venue (cold/inline) but selects them internally via a context-adaptive confidence-gated selector with caller overrides ("use agents"/"inline") — COP surfacing would duplicate built-in logic. Venue forced `inline`. |
| `extract-signal` | Self-orchestrating — infers venue/form/stakes from the call (agentic by default, runs under `/multi-agent-mode`) and surfaces only on ambiguity; surfacing duplicates built-in selection. Same rationale as `insight-angles` / `insight-cross-examine`. *Reclassified from half-wired participant 2026-06-14: COP prose block + `protocol.yon` `step:cop` removed (it never had the front-matter contract).* |

## Never-delegate

Inline-only by rule — they need live conversation context, or are conversational/interactive. No COP block unless one later gains a genuine Mode.

`reflect`, `verify`, `insight-retro`, `plan-create`, `plan-phases`, `plan-execute`, `plan-cleanup`, `plan-evolve`, `yon-writer`, `obsidian-markdown`
