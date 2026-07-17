# disable-model-invocation Criterion

Set `disable-model-invocation: true` if and only if **at least one** of:
- The skill mutates external state (files, network, repos) that requires explicit user authorization before each run. Examples: `allemaar-deploy`, `github-sync`, `new-content-topic`, `new-skill-creator`.
- The skill is a workflow shell that should only run when the user explicitly asks (not auto-triggered by keywords). Examples: `handoff`, `hfl`, `orchestrate-mode`.
- The skill is deprecated and should not be invoked.

Otherwise omit the field (or set `false`). Read-only analysis, brainstorming, evaluation, and drafting skills are safe to auto-invoke when their description matches user intent. Examples: `defuddle`, `insight-critique`, `investigate`, `plan-deep-dive`, `yon-read`.

**Decided borderline cases** — these were considered and intentionally left auto-invocable; future maintainers should not re-litigate without new evidence:

| Skill | Decision | Rationale |
|---|---|---|
| `insight-retro` | omit (auto-invocable) | Produces a markdown report only; doesn't write KIs/skills automatically. If observed firing unwanted, flip then. |
| `obsidian-cli` | omit (auto-invocable) | Vault mutations only fire on imperative user phrasing ("search my vault", "open this note") which constitutes implicit authorization; the trigger phrases ARE the authorization. |
| `plan-create` | omit (auto-invocable) | PLAN.md is a design-phase draft for user review, not a state-change requiring gating; trigger phrases like "make a plan" already signal intent. |
| `plan-evolve` | omit (auto-invocable) | Drafts the next plan version for user review — same category as `plan-create`; not a state-change. |
| `caller-options` | omit (auto-invocable) | A routing-evaluation protocol; consumed via the opt-in block, not by auto-trigger. The flag only blocked ad-hoc agent invocation for no safety gain. |
| `cold-review` | omit (auto-invocable) | Spawns reviewer sub-agents but mutates nothing. Triggers are anchored to "cold"/"outside"/"fresh", so it will not auto-fire on generic "review this" (that is `insight-critique`). An orchestrator must be able to dispatch it — agent-invocability is the point. |
| `verify`, `investigate` | omit (auto-invocable) | Read-only analysis / gate skills — the rule already classes these as auto-invocable. Do not re-flag. |

Updates: edit this file directly, no need to churn SKILL.md.
