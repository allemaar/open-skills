# `@SOURCES` block — canonical schema

The `@SOURCES` YON block declares the source manifest for a handoff brief. It is the contract `/handoff-execute` enforces in gated mode and falls back to scanning for in advisory mode.

This file is the single source of truth for the block's shape; `handoff/profiles/*.md` and `handoff-execute/SKILL.md` both reference it.

## Shape

```
@SOURCES
  required=[
    /c/Projects/x/y.ts                      # absolute repo path
    [[Skills/frontmatter-schema]]           # vault wikilink
    https://example.com/spec.html           # URL
  ]
  optional=[
    /c/Projects/x/z.ts                      # surfaced, read on-demand
    [[Architecture/overview]]               # background reading
  ]
```

## Two tiers

| Tier | Action by `/handoff-execute` | Gate |
|---|---|---|
| `required` | Read fully before any plan text is emitted. | ABORT-on-fail in gated mode; WARN in advisory mode |
| `optional` | Surfaced in the Phase 2 checklist; read on-demand mid-execution if a plan step touches the entry. | No gate |

Three-tier earlier drafts (required / referenced / context) collapsed to two after `/insight-critique` surfaced that "referenced" and "context" are behaviorally identical — the cold agent reads what it needs from either, so the tier judgment cost did not buy any behavior change.

## Reference resolution

- **Absolute paths** (POSIX or Windows-style) — read as-is.
- **Wikilinks `[[note-name]]`** — resolve relative to the vault root (`$VAULT/`, your Obsidian vault) using Obsidian's resolution rules: exact match first, then case-insensitive, then alias lookup. Resolved path is shown in the Phase 2 checklist for transparency.
- **URLs** — fetched via the runtime's web tool. For article-style URLs, prefer `/defuddle` over a raw fetch to strip nav/ads.
- **`file:line` references** in a plan step — when reading on-demand, load a window around the cited line (typically ±25 lines) rather than the whole file.

## Author guidance

What belongs in `required`:

- Files whose content the cold agent must understand to plan correctly — domain types, schema definitions, configuration that changes the meaning of the work, the function being modified.
- Vault notes whose conventions or decisions are load-bearing for the task.
- The current state of the file that will be edited (so the agent doesn't blindly overwrite).

What belongs in `optional`:

- Related code the agent might want to reference but isn't load-bearing.
- Background notes that frame the project but aren't decision-critical for this task.
- Adjacent docs that would help if a question comes up during execution.

What does NOT belong in either:

- Files the agent will need to discover by grep — those are emergent during Phase 4 and don't need pre-declaration.
- The brief itself — that's already loaded.

## Legacy fallback

If a brief lacks `@SOURCES` entirely:

- **Legacy `agent` / `orchestrator` profile briefs** that have `@SCOPE.must_read=[...]` — the receiving skill treats `must_read` as `@SOURCES.required` and gates accordingly.
- **Legacy `new-session` profile briefs** (which never had `@SCOPE`) — fall through to advisory mode: scan the brief body for explicit references (wikilinks, absolute paths, lines under `## Read these first`), read best-effort, emit the advisory-mode warning.

Going forward, `/handoff` prompts at brief-write time for `@SOURCES.required` and writes the block into every new brief. Advisory mode persists as a backward-compatibility path, not a target state.

## Anti-patterns

- **Empty `required` because "the brief is small"** — if the work is worth a handoff, it has critical context. Make the gate work for you.
- **Over-listing `required`** — forces the cold agent to read 50 files before planning. Move ambient context to `optional`.
- **Listing the brief in `@SOURCES`** — the brief is always loaded in Phase 1; listing it is redundant.
- **Using `@SOURCES` to enumerate test files the work will produce** — `@SOURCES` is *input*, not *output*.
