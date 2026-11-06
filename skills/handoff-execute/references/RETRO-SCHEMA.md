# Retro schema

Derived from the Retro schema section in skills/handoff/SKILL.md. Edit that owner; the repository spine maintains this local resource.


The cold agent writes its retro file with this frontmatter:

```yaml
---
title: "Retro: {short-task-summary}"
type: retro
handoff: "[[YYYY-MM-DD-slug]]"
profile: agent | orchestrator | new-session
project: "{repo_name}"
verdict: success | partial | fail | blocked
confidence: low | medium | high
completed: YYYY-MM-DDTHH:MM:SS
trust: 0.9                    # optional
primary-domain: ""            # optional
lifecycle: active
related: []
tags:
  - type/retro
  - verdict/{verdict}
  - profile/{profile}
  - project/{project}
---
```

The retro body MUST include YON blocks for: `@OUTCOME_DELIVERED`, `@GROUND_TRUTH` (with `artifacts_modified` paths+hashes and `git_diff_summary`), `@GATE_STATUS` (per-clause `verified|unverified|failed` + gate-suite outcome), `@DELTA_FROM_BRIEF`, `@RECOMMENDATIONS`, `@VERDICT`. **Narrative-only retros are rejected.** For real task changes, paths, hashes and diff evidence remain required. If zero task changes are evidenced, use `artifacts_modified="none"` with the supporting observation; the retro file itself is not a task change. `git_diff_summary` records the actual scoped comparison or why it was unavailable, distinguishing pre-existing changes. Unknown mutation state must be reported as unknown with a blocked task outcome, never converted to "none"; a failed retro write still requires the existing partial final verdict. This branch preserves every mandatory block and any source/premise failures and resume hint.

The brief sign-off section instructs the cold agent on this, and points back to the originating session for `/insight-critique` (or any LLM-agnostic equivalent).
