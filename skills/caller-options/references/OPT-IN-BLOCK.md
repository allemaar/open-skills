# COP Opt-In Block — the standard snippet for participating skills

A skill joins Caller Options by adding (1) the frontmatter contract, (2) a prose block in `SKILL.md`, and — for dual-doc skills — (3) a `@SEC`/`@STEP` in `protocol.yon`. All three must stay in sync; **per-skill frontmatter is canonical**.

## 1. Frontmatter contract

Add a `caller-options:` key to the skill's front-matter:

```yaml
caller-options:
  venue: [inline, delegated]      # venues this skill supports; inline is always included
  modes: [name1, name2]           # named existing paths; omit the key entirely if single-mode
  default-policy: ask             # ask | recommend | auto — surfacing policy for agent callers
```

This is **metadata** — the harness does not execute it. It is read by `skills-audit` and by humans. Behavior lives in the block below + `protocol.yon`.

## 2. SKILL.md prose block

Paste near the top of the body, after the one-paragraph overview:

> **Caller Options.** Before executing, run the Caller Options protocol (`caller-options/SKILL.md`): triage this invocation for material optionality across the venues and modes declared in front-matter; if one path clearly dominates, proceed silently; otherwise surface the options to the caller. A resolved-invocation marker means COP already ran — execute the fixed combination directly, do not re-enter COP.

## 3. protocol.yon @SEC (dual-doc skills only)

Insert as the first `@SEC` after governance, before the skill's own phases:

```
@SEC name="Caller Options"
@STEP rid=step:cop | n:int=0 | op=std:ai.prompt@v1 | args=[task="Run the Caller Options protocol (caller-options/protocol.yon): triage for material optionality across declared venues and modes; surface to the caller unless one path dominates; bind the chosen mode and venue. Skip if a resolved-invocation marker is present."] | out=[ref:cop-choice]
@CHECK rid=check:cop | assert="ref:cop-choice is resolved before the skill's own steps run" | fail=WARN | msg="Caller Options should resolve venue and mode before execution."
```

The skill's own first step keeps its number (`n:int=1`); the COP pre-step is `n:int=0`. Refresh the `@STAMP` date when adding it.

## The COP-RESOLVED marker block

When COP executes a `delegated` or `fan-out` venue, it prepends this literal block to the primed brief:

```
COP-RESOLVED
skill: <skill-name>
venue: <inline | delegated | fan-out>
mode: <chosen mode, or none>
depth: 1
```

A participating skill's `step:cop` checks its incoming brief for a `COP-RESOLVED` block. If present, it **skips COP** and runs the fixed `venue`/`mode` directly. `depth: 1` means: run any COP participant *you* trigger **inline** — this closes the depth-2 path.

## Graceful degradation

If `caller-options` is missing, unlinked, or unreadable, the opt-in block is a **no-op** — the participant skill proceeds `inline` with its default mode. COP never blocks a skill from executing; absence of COP just means no choice is surfaced.

## Excluded skills

A skill with **zero optionality** — a never-delegate skill with no modes, or a self-orchestrating skill with no modes — gets **no opt-in block**. Adding one would surface no choice and cost tokens for nothing. See [`CANDIDATES.md`](CANDIDATES.md) for the participant / excluded register.

**The self-orchestrator exclusion test.** Exclude a skill when surfacing its venue/mode would **duplicate built-in self-selection** — i.e. the skill already infers venue/mode from the call via its own (possibly confidence-gated) selector, *even if caller overrides exist*. Self-orchestrating skills that dispatch their own sub-agents and infer mode internally — e.g. `insight-angles`, `insight-cross-examine`, `improve-codebase-architecture`, `extract-signal` — are Excluded on this test: not because they lack a choice, but because COP would re-implement logic they already own. `CANDIDATES.md` and `docs/nsp-cop-audit.md` must agree per this test.
