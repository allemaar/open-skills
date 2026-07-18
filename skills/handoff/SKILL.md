---
name: handoff
description: Generate a structured cold-agent handoff brief (YAML frontmatter + Obsidian markdown + YON blocks) that any fresh LLM session can pick up and execute. Trigger when the user runs /handoff or says "create a handoff", "dispatch to a fresh agent", "hand this to a cold session", "switch to a new session", "I have N tasks for cold agents", "package this for another agent". Use /orchestrate-mode instead when you want to keep the *current* session as coordinator (no artifact produced).
disable-model-invocation: true
visibility: public
self-improvable: true
triggers:
  - "/handoff"
  - "create a handoff"
  - "dispatch to a fresh agent"
  - "hand this to a cold session"
  - "switch to a new session"
  - "I have N tasks for cold agents"
  - "package this for another agent"
next-skills:
  - skill: handoff-execute
    phrase: "/handoff-execute"
    why: "The receiving session executes the brief with enforced source-read discipline"
  - skill: github-sync
    phrase: "/github-sync"
    why: "Commit and push the handoff brief artifact so the cold session can fetch it"
  - skill: orchestrate-mode
    phrase: "/orchestrate-mode"
    why: "Dispatch the packaged tasks to isolated worker agents from the current session"
---

# /handoff

Generates a structured handoff brief: YAML frontmatter (Obsidian-readable, vault-schema-compliant) + Obsidian-flavored markdown body containing YON-tagged structured blocks. The brief is the **work item** a fresh agent in a new session can pick up and execute autonomously.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). It carries the workflow steps, the verify and sources gates, and the rules as validatable records; this file is the explanation. Keep the two in sync — edit one, update the other and refresh the `@STAMP` date.

## When to use

- **UC1** — Dispatch a self-contained task to a fresh agent (`agent` profile)
- **UC4** — Dispatch a multi-step task that needs to be split into parallel sub-tasks (`orchestrator` profile)
- **UC3** — Switch the current session to a fresh one carrying in-flight state (`new-session` profile)

For UC2 (turn the *current* session into pure orchestrator mode), use [`/orchestrate-mode`](../orchestrate-mode/SKILL.md) instead — that's a behavior switch, not a handoff artifact.

## Output

Each handoff produces:
- **A vault file** (canonical) at `$VAULT/Handoffs/{project}/{YYYY-MM-DD}-{slug}.md` (set `$VAULT` to your Obsidian vault root)
- **A chat surface** (paste-convenience): full block if file < 500 lines; otherwise summary (first 30 lines) + `📄 Full brief: <path>`

For multi-handoff (`count=N`): N files + a numbered index in chat (no per-brief content in chat).

The cold agent writes its retro to `Handoffs/{project}/retros/{YYYY-MM-DD}-{slug}-retro.md` (canonical file) AND emits it as a chat block (paste-back surface). Bidirectional brief↔retro linking is automatic via Obsidian's wikilink graph.

## Workflow

### 1. Determine invocation path

| Path | Trigger | Behavior |
|------|---------|----------|
| 1. One-shot complete | `/handoff agent task="..." where="..." evidence="..." acceptance="..." verify="..."` | Parse, validate required fields present, write file, emit chat surface. |
| 2. One-shot partial | `/handoff agent task="..."` (missing required) | Parse, identify gaps, ask ONLY for missing required, then write. |
| 3. Interactive | `/handoff` (no args) | Full Q&A from "What kind?" through all required. |
| 4. Multi one-shot | `/handoff count=3` | Each of N briefs runs independent profile-selection + Q&A. Emits N files + numbered index in chat. |
| 5. Multi interactive | `/handoff` then "I have 3 tasks" | Detect intent, ask "How many?", then run Path 3 N times independently. |
| 6. Orchestrator subtasks | `orchestrator` profile selected | If `subtasks` field unspecified → LLM auto-decomposes, surfaces for review. If specified → LLM validates 5 checks; pass = proceed; fail = findings + auto-`/insight-assess`. |

### 2. Profile selection (interactive)

Ask the user: **"What kind of handoff?"**
- "Dispatch a task to a fresh agent" → `agent` profile (UC1) — load [`profiles/agent.md`](profiles/agent.md)
- "Dispatch a task that needs to be split into sub-tasks" → `orchestrator` profile (UC4) — load [`profiles/orchestrator.md`](profiles/orchestrator.md)
- "Continue this session in a new session" → `new-session` profile (UC3) — load [`profiles/new-session.md`](profiles/new-session.md)

Auto-suggest `orchestrator` if user describes a multi-step / parallelizable task, but default to `agent` (smaller blast radius).

### 3. Field collection

Required for all profiles:
- `task` — one-paragraph description (max 1000 chars)
- `where` — absolute paths in scope
- `evidence` — pointer to error/commit/file/line that prompted this
- `acceptance` — acceptance sentence
- `verify` — list of verifiable shell commands (REQUIRED — if user can't name one, push back: "this task isn't measurable enough for a handoff; reconsider scope")
- `sources_required` — file paths or wikilinks the cold agent MUST read before planning. Asked interactively as: **"Which sources MUST the cold agent read before planning? (file paths or wikilinks, comma-separated.)"** If the user supplies a non-empty list → write to `@SOURCES.required`, brief executes in gated mode. If the user supplies an empty list → **push back** with: *"You haven't named any required sources. Either name what the cold agent must read before planning, OR explicitly confirm 'no sources required' — the brief will run in advisory mode with a prominent warning, and the cold agent will not gate on source ingestion. Confirm 'no sources required' to proceed."* Default is to re-prompt for sources. Only after explicit confirmation does the brief write with empty `@SOURCES.required` and an advisory-mode marker. Writes to the brief's `@SOURCES.required` block (see [`handoff-execute/references/SOURCES-BLOCK.md`](../handoff-execute/references/SOURCES-BLOCK.md)).

Optional with defaults:
- `sources_optional` — additional sources surfaced for on-demand reading mid-execution. Asked as: **"Any additional sources to surface as optional reading? (Empty = none.)"** Writes to `@SOURCES.optional`.
- `forbidden_actions` — preservation guards
- `time-budget-min` — wall-clock cap (default: 60)
- `output_location` — vault path override

For `new-session` profile, auto-collect from current session state instead of asking — see [`profiles/new-session.md`](profiles/new-session.md).

### 4. Project detection

```bash
project=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unsorted")
```
Local folder name. Works on detached repos. Falls back to `unsorted` if not in a git repo.

### 5. Slug generation

```bash
slug=$(echo "$task" | head -c 200 | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-\+/-/g' | sed 's/^-\|-$//g' | head -c 40)
```
Lowercase-kebab from task description, max 40 chars.

### 6. Write file

```bash
vault_path="${VAULT:?set VAULT to your vault root}/Handoffs/$project/$(date +%Y-%m-%d)-${slug}.md"
mkdir -p "$(dirname "$vault_path")"
# write the brief content (see profiles/{profile}.md for shape)
```

### 7. Render chat surface

```bash
lines=$(wc -l < "$vault_path")
if [ "$lines" -lt 500 ]; then
  cat "$vault_path"
  echo "📄 Saved to: $vault_path"
else
  head -30 "$vault_path"
  echo "..."
  echo "📄 Full brief: $vault_path"
fi
```

For multi-handoff (count > 1): render only the numbered index in chat:
```
3 handoffs created:
  1. <task1 summary> → <path1>
  2. <task2 summary> → <path2>
  3. <task3 summary> → <path3>
```

### 8. Emit activation phrase

After the chat surface, ALWAYS emit a copyable activation phrase in a fenced code block. This is the single line the user pastes into a fresh agent session to invoke the brief.

**Format (single-handoff):**
````
## Activation phrase (copy-paste into the fresh session)

```
/handoff-execute "<absolute-vault-path>"
```

(If your runtime lacks /handoff-execute (degraded — no gate enforcement): read the brief, then read every source listed under @SOURCES.required before planning; cite sources per plan step; after execution, run the shell commands listed in the brief's @OUTCOME.verify block (this is a data field in the brief, not the /verify skill); emit the retro per @GROUND_TRUTH_REQUIRED.)
````

**Format (multi-handoff):** one fenced block per brief, in the same numbered order as the index. Emit the prose fallback once at the bottom of the multi-block, not per brief:
````
## Activation phrases

Brief 1:
```
/handoff-execute "<path-1>"
```

Brief 2:
```
/handoff-execute "<path-2>"
```

(...)

(If your runtime lacks /handoff-execute (degraded — no gate enforcement): read each brief, then read every source listed under @SOURCES.required before planning; cite sources per plan step; after execution, run the shell commands listed in each brief's @OUTCOME.verify block (this is a data field in the brief, not the /verify skill); emit the retro per @GROUND_TRUTH_REQUIRED.)
````

**Why:** the chat surface (Step 7) is for the *originating* session to verify the brief; the activation phrase is for the *receiving* session to bootstrap from. Pasting 100+ lines of YAML+markdown into a fresh session is heavier than a one-line pointer that the receiving agent will Read-tool open and follow.

**Discipline:** the activation phrase MUST use the exact absolute path of the written brief. Wikilinks `[[…]]` in the activation phrase do not resolve outside Obsidian. Use forward slashes for cross-platform compatibility. Always quote the path — Windows vault paths may contain spaces.

## Brief schema (universal)

Every brief has YAML frontmatter conforming to vault schema:

```yaml
---
title: "Handoff: {short-task-summary}"
type: handoff
profile: agent | orchestrator | new-session
project: "{repo_name}"
status: dispatched
created: YYYY-MM-DD
acceptance: "{one sentence}"
verify:
  - "{shell command 1}"
  - "{shell command 2}"
time-budget-min: 60
trust: 0.8                    # optional
primary-domain: ""            # optional
lifecycle: active
related: []
tags:
  - type/handoff
  - profile/{profile}
  - status/dispatched
  - project/{project}
---
```

The body is profile-specific — see [`profiles/agent.md`](profiles/agent.md), [`profiles/orchestrator.md`](profiles/orchestrator.md), [`profiles/new-session.md`](profiles/new-session.md). All three profiles include a `## Sources` section with an `@SOURCES` YON block; see [`handoff-execute/references/SOURCES-BLOCK.md`](../handoff-execute/references/SOURCES-BLOCK.md) for the canonical block schema and tier semantics.

## Retro schema (what the cold agent emits)

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

The retro body MUST include YON blocks for: `@OUTCOME_DELIVERED`, `@GROUND_TRUTH` (with `artifacts_modified` paths+hashes and `git_diff_summary`), `@GATE_STATUS` (per-clause `verified|unverified|failed` + gate-suite outcome), `@DELTA_FROM_BRIEF`, `@RECOMMENDATIONS`, `@VERDICT`. **Narrative-only retros are rejected** — ground truth (file paths, hashes, git diff) is non-negotiable.

The brief sign-off section instructs the cold agent on this, and points back to the originating session for `/insight-critique` (or any LLM-agnostic equivalent).

## Rules

- ALWAYS use absolute paths in target file references.
- ALWAYS check whether the task has a verifiable acceptance command. If not, push back — handoffs without measurable acceptance are unmeasurable.
- ALWAYS `mkdir -p` before writing the brief file.
- ALWAYS use wikilinks `[[file]]` for in-vault references; absolute paths for code-repo references.
- NEVER prescribe runtime-specific skill or tool names in the brief body (the cold agent may be Claude Code, Codex, or another LLM). Describe outcomes, not procedures. Where a step is genuinely runtime-specific, tag it explicitly (e.g. '(Claude Code only)').
- NEVER write a brief that's smaller than the field schema requires — push back on under-specified tasks instead.
- NEVER assume the user wants chat-only output — file is canonical.

## Anti-patterns

- "I'll figure out the right place" — name the file path explicitly
- "Make sure not to break anything" — replace with `forbidden_actions` list
- "Run /verify after" — `/verify` is a Claude Code skill marked `disable-model-invocation`, so even on Claude Code the cold agent can't invoke it; on other runtimes (Codex, etc.) it doesn't exist at all. Use outcome-based briefs (verifiable shell commands in `verify:`) instead of prescribing skill invocations.
- "Use the Agent tool with isolation: worktree" — that's a Claude-Code-specific spawning mechanism; Codex and other runtimes have different (or no) equivalents. Describe the *behavior* you want ('spawn a fresh isolated agent session', 'run in a clean worktree') in runtime-agnostic prose, and let the cold agent's runtime supply the mechanism. If a step truly only works on one runtime, tag it (e.g. '(Claude Code only)').
- Skipping `@SOURCES.required` because "the brief is small" — if it's worth a handoff, it has critical context. Declare what the cold agent must read; let the gate work for you. Empty `sources_required` drops `/handoff-execute` into advisory mode (no gate, only a warning).

## Companion skills

- [`/handoff-execute`](../handoff-execute/SKILL.md) — the receiving-side executor. Consumes the brief this skill produces, gates on `@SOURCES.required`, runs verify commands, writes the retro to the canonical vault path.

Briefs that declare `@SOURCES` are executed in **gated mode** by `/handoff-execute` (source ingestion is a hard gate before planning). Briefs without `@SOURCES` execute in **advisory mode** (best-effort source scan, no gate, prominent warning emitted). Legacy briefs without `@SOURCES` continue to work; add `@SOURCES` to upgrade.

## Inspirations

- `/plan-create` — phased structure
- `/plan-phases` — `/verify`-style checkpoint pattern
- `/insight-critique` — second-assessment workflow (or any LLM equivalent reading frontmatter + body)
- `/insight-retro` — informed the retro shape; handoff retro is **stricter** (mandatory ground-truth fields)
- The host vault's note frontmatter schema (where present) — the brief frontmatter conforms to it

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
