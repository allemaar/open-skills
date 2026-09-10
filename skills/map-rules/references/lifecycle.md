# Lifecycle, rollups, and archives

## Goal

Distinguish current, parked, superseded, archived, and summarized material without inventing state.

## Currentness and archive evidence

Before treating a retrieved note as current, inspect:

- `meta.archived`
- a visible archive callout
- archive-map placement

Any signal means archived unless signals disagree; disagreement requires Handler review. An `archive/` folder is evidence of a likely unsignalled archive, not authority. Report `unsignalled archive`; do not classify it current or archived silently. Label archived sources when using them.

Successor-side `meta.supersedes` and `meta.merges` create a `target appears superseded` finding only. They do not settle currentness or authorize archive, move, or rewrite.

Handler-declared snapshot or rollback pairs under different basenames are intentional. Never auto-rename, merge, delete, or repair them as duplicates. No snapshot identity schema exists in this version.

## Optional lifecycle layer

A scope whose root map declares lifecycle tracking may use `meta.lifecycle: current | parked | superseded`. Missing lifecycle is `UNSPECIFIED`, never current. Every explicit state also requires a visible callout near the note's top. Frontmatter is machine-readable; the callout is retrieval-visible. Maps expose the same states through curated sections. Tags never carry lifecycle.

Scopes without this declaration carry no lifecycle overhead. `meta.archived: YYYY-MM-DD` is the archive-date signal, not a complete lifecycle model.

## Rollups

A rollup is earned when several authoritative children repeatedly need the same current summary. Use a clearly fenced map section or `<scope>-rollup.md`. Record:

- `as of`
- linked inputs
- inclusion rule
- unresolved inputs
- authored or agent-generated origin

Create or refresh it only through a proposal. A rollup is never authoritative or atomically current.

## Archives

An archive is earned when non-current material crowds navigation. Use an `Archive` section or `<scope>-archive-map.md`.

One selected semantic set adds `meta.archived`, a current-map finding aid, visible callout, map relocation, and any physical move:

```markdown
> [!archive] Archived YYYY-MM-DD
> Reason: ...
> Successor: [[successor-filename]]
```

If no successor document exists, use:

```text
Successor: none - superseded by <decision|policy|measurement> <date>
```

The field remains mandatory. Never fabricate a successor. Archived files remain reachable and searchable.

Lyt search may expose an archived snippet before the note is opened. Behavioral signal checking mitigates this; it is not pre-context filtering.

Good: lifecycle claims are declared, visible, selected, and mutually consistent.

Bad: folder-based assumptions, successor-edge auto-archives, fabricated currentness, or unreachable archives.

[load.complete] map-rules.lifecycle
