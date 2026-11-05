# Profile: `new-session` (UC3 — session continuation)

The current session is too long, off-topic, or about to hit context limits. Capture in-flight state into a brief that a fresh session can pick up and continue from.

## When to use

- Active session has accumulated context bloat (long history, off-topic exchanges)
- Active session is approaching context window saturation
- User wants to switch laptops / agents / time slots without losing thread

NOT for delegating new work (that's `agent` or `orchestrator`). This profile is **state transfer**, not task dispatch.

## Auto-collected fields

Unlike `agent` and `orchestrator`, this profile does NOT ask Q&A for most fields — it auto-collects from the current session:

| Field | Source |
|-------|--------|
| `branch` | `git rev-parse --abbrev-ref HEAD` |
| `last_commit` | `git log -1 --format="%H %s"` |
| `modified_files` | `git status --short` |
| `open_decisions` | Extract from current chat: things discussed but not yet resolved (LLM scans transcript) |
| `in_flight_artifacts` | Find recently-edited PLAN.md, TODO.md, scratch files in working dir |
| `done` | LLM extracts "what we accomplished this session" — bulleted with file pointers |
| `left` | LLM extracts "what's still pending" — bulleted in dependency order |
| `conventions_specific_to_thread` | ASK USER: "anything we agreed on in chat that won't be in any file?" |
| `resume_command` | Default: read PLAN.md if exists, else `/plan-create` |

User confirms `conventions_specific_to_thread` only — everything else is auto-collected then surfaced for review.

## Compact continuation

Use this profile for lightweight continuation too; do not create another profile. Retain frontmatter, Sources and sign-off obligations. Consolidate narrative to objective, current state/evidence pointers, relevant decisions and thread conventions, next action, and blockers/risks. Omit empty narrative sections; expand only to prevent consequential misunderstanding.

Reuse known chat-only conventions and surface them for correction; ask the existing conventions question only for missing material information. Separate settled decisions, proposals and open choices. Collect Git fields and commands only where applicable tools/evidence exist; otherwise name unknown state. Never invent access or call an unobserved tree clean.

Use references resolvable in the receiving environment, with missing access stated. Preserve configured canonical destinations and vault governance. Without a configured destination, resolve the authorized destination before saving; text-only output is proposed content, not a canonical write or completed handoff. Do not invent an activation path. Ground the resume command in the actual next action and available receiving tools. Compactness waives neither source ingestion, redaction nor retro requirements.

## Body template

After the universal frontmatter (with `profile: new-session`), the body looks like:

````markdown
# Handoff: Continue session — {short-topic}

> [!info]
> Profile: **new-session** · Project: **{project}** · Created: **{date}**
> In the receiving session, explicitly invoke `/handoff-execute "<actual-saved-brief-absolute-path>"` using the saved brief’s real path. Background-document presence or pasted context alone does not select execution. If that skill is unavailable, use the producer’s explicit fallback activation and preserve its source-ingestion, premise and retro discipline; never invent a saved path.
> This is a continuation of work already in progress — read carefully before acting.

## What we were doing

{one-paragraph summary of session goal}

## State snapshot

@CONTINUATION
  branch="{branch}"
  last_commit="{hash} {subject}"
  modified_files=[{paths}]
  in_flight=[{artifact paths}]

## What's done

- {bullet with file pointer}
- {bullet with file pointer}

## What's left

- {bullet — ordered by dependency}
- {bullet}
- {bullet}

## Open decisions (not yet resolved)

- {decision A — options considered, no choice made yet}
- {decision B — blocked on {what}}

## Sources

For an explicitly confirmed no-required-sources brief only, replace the required
list with `required=[]` and add `confirmed_empty:bool=true` to `@SOURCES`.
Never infer confirmation from an empty list; nonempty required sources stay gated.

@SOURCES
  required=[
    [[some-vault-file]]                       # session-context note — gated
    /c/Projects/younndai/apps/x/y.ts          # in-flight code — gated
    {in-flight artifacts: PLAN.md, TODO.md}   # must-read carryover state
  ]
  optional=[
    [[some-other-file]]                       # related context, read if needed
  ]

(Canonical schema and tier semantics: [`handoff-execute/references/SOURCES-BLOCK.md`](../../handoff-execute/references/SOURCES-BLOCK.md). For new-session profile, `@SOURCES.required` typically includes the in-flight artifacts named in `@CONTINUATION.in_flight` so the continuing session loads them before resuming work.)

## Conventions specific to this thread

(decisions made in chat that aren't recorded in any file)

- {convention 1}
- {convention 2}

## Resume command

{first action to take, e.g. "Read PLAN.md, then /plan-execute"}

## Sign-off

> [!warning]
> **Retro file is canonical.** When you've made progress (or hit a stopping point), write your retro to:
> `$VAULT/Handoffs/{project}/retros/{date}-{slug}-retro.md`
>
> ALSO emit it as a chat block.
>
> Your retro MUST include `@GROUND_TRUTH` (paths + hashes + git_diff_summary) and `@DELTA_FROM_BRIEF` (what was in `What's left` that you completed; what new items emerged). For evidenced zero task changes, use the canonical Retro schema's "none" branch; unknown is not none.
>
> If you're handing off again to ANOTHER fresh session (long-running work spanning multiple session-switches), use the same `/handoff` skill with profile=new-session. Each handoff is its own file.
````

## Field defaults specific to this profile

- Remove secrets, credentials and unnecessary personal data from brief text and excerpts; point to an authorized source instead.
- The empty-verification exception does not extend to dispatched agent or orchestrator tasks. State transfer preserves existing authority without approving new work.

- `verify` field in frontmatter may be empty if continuation work has no single-shot acceptance — that's allowed for this profile only.
- `time-budget-min` defaults higher (e.g., 180) since continuations are often longer-running.
- The brief is more narrative than `agent`/`orchestrator` profiles — focus on transferring *understanding*, not just specifying a task.

## Anti-patterns

- Trying to use `new-session` profile for new work — use `agent` or `orchestrator` instead.
- Skipping `conventions_specific_to_thread` — chat-only decisions are exactly what gets lost in session-switches; this is the field that justifies the profile's existence.
- Filing as `agent` profile and just saying "continue what we were doing" — doesn't capture state, will leave the cold agent guessing.
