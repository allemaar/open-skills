# Lyt environments

## Goal

Use Lyt-owned operations in registered vaults without crossing organization, trust, or synchronization boundaries.

## Detect the environment

A scope is a registered Lyt vault when `lyt vault info --by-path <path>` resolves it or `.lyt/vault.yon` exists at the vault root. Lyt operations are available only when the `lyt` CLI answers on the machine.

## Registered vault, Lyt available

- Create durable notes through the Lyt-owned capture operation, then perform the selected bounded map join.
- After an approved existing-file edit, request indexing with `lyt capture --index-only <vault-relative-path> --vault <qualified-vault>`. If it fails or defers, report indexing deferred.
- Any bulk frontmatter fill, including `lyt vault backfill`, is Handler-gated in an organized scope. Inspect a dry run and exact manifest first. Exclude managed artifacts. `map-*` does not control Lyt backfill; it withholds endorsement until the exclusion is correct.
- Never edit `.lyt/`, registry data, mesh declarations, indexes, or sync state directly. Never use raw Git for vault synchronization.

## Registered vault, Lyt unavailable

Return a proposal only. Do not mutate. Name the missing capability.

## Non-Lyt Markdown

Follow the scope's local write and frontmatter policy. The eight-field Lyt contract applies only when the Handler selected Lyt-compatible notes. `meta.map` still applies to every eligible organized non-root file. Maintain `modified` on approved material edits only when no owning workflow does so.

## Lyt-specific navigation

Lyt does not index README bodies. In a registered vault, prefer an indexed `<scope>-map.md` root and link it from the README. If a README is nevertheless the declared root, all members use its unambiguous vault-relative path.

## Cross-vault references

Raw cross-vault wikilinks are prohibited. Lyt origin coordinates identify vaults, not figments. Until an origin-plus-figment locator is specified and resolvable, cite another vault in prose using its qualified name or origin coordinate plus the figment's vault-relative path.

Good: Lyt performs capture, indexing, and sync; MYK performs only selected organization.

Bad: direct `.lyt` edits, raw sync Git, mutation without the CLI, or invented cross-vault links.

[load.complete] map-rules.lyt
