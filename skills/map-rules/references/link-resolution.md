# Link resolution

## Scope-contract grammar

Machine declarations live only in `.myk/README.md` frontmatter at `myk.m1.link-dialects` and `myk.m1.accepted-links`. Use spaces, the exact indentation below, keys in the shown order, and double-quoted JSON strings. Unknown or duplicate keys, duplicate ids, duplicate `(source,target)` acceptance rows, tabs, invalid UTF-8, a BOM, or malformed frontmatter invalidate the whole declaration set.

```yaml
myk:
  m1:
    link-dialects:
      - id: "corpus"
        subtree: "notes/corpus"
        kind: "corpus-root-relative"
        base: "notes"
    accepted-links:
      - target: "https://example.invalid/reference"
        source: "notes/example.md"
        class: "accepted-external"
        reason: "The target is an external reference and is not expected inside this scope."
```

`id` matches `[a-z][a-z0-9-]{0,63}`. `subtree`, `base`, and optional `source` are contained slash-separated locators: no empty, `.` or `..` segment; absolute path; drive prefix; scheme; backslash; or NUL. Dialect `kind` is exactly `corpus-root-relative`. Dialect ids and case-folded subtrees are unique. Declared subtree and base paths must exist, be readable, and have no redirect in their leaf or resolved chain.

An acceptance row requires `target`, `class`, and a self-contained `reason`; `source` is optional and narrows the row to one exact source. `class` is `accepted-external` or `accepted-unresolved`. The reason states the decisive fact that makes the raw target acceptable; it never inherits meaning from another row or session context.

## Resolution inventory and fingerprints

Resolve body wikilinks and relative Markdown links over the canonical walked inventory. YAML-frontmatter links are outside this contract. Exclude `m3` subtrees from assessment. A managed artifact whose body or whole file is owned remains a target but contributes no outbound occurrences. A declared `single-entrypoint` exclusion keeps its exact entrypoint as a governed boundary target without assessing the excluded subtree.

Bind a run to three SHA-256 fingerprints:

- `resolution_inventory_fingerprint`: ordinal scope-relative path, NUL, byte size, NUL, rounded modification time, newline, for every assessed inventory file.
- `contract_fingerprint`: exact `.myk/README.md` bytes.
- `governed_boundary_target_fingerprint`: the same ordered path/size/time encoding for governed boundary targets.

Membership fingerprints are useful scan provenance but do not replace these three comparison keys or apply-time preimage hashes.

## Occurrence resolution

Check an exact `(source, raw target)` acceptance row first, then an all-sources row. Otherwise resolve a plain interpretation and, when the source lies in a declared dialect subtree, one longest-matching dialect interpretation formed as `base/raw-target`. Exact contained paths win; unique path-suffix and unique basename/stem resolution may follow. Any ambiguous interpretation, or interpretations that resolve to different canonical targets, is `ambiguous`. A scheme-bearing wikilink is missing unless explicitly accepted. Relative links that escape the scope are missing.

Fragments use exact heading text or exact `^block-id`. Unicode or Obsidian slug normalization and embed-specific semantics are not supplied by this version. Non-Markdown targets resolve only when the raw target carries an extension. Derive graph edges only after occurrence classification; a missing fragment still identifies its existing file target.

## Terminal classes and closure

Every observed occurrence lands in exactly one class:

| Class | Terminal condition |
|---|---|
| `resolved-file` | one Markdown file, no fragment |
| `resolved-heading` | one Markdown file and exact heading |
| `resolved-block` | one Markdown file and exact block id |
| `resolved-nonmarkdown` | one existing non-Markdown file |
| `missing-file` | no contained file target, an escaping relative link, or an unaccepted scheme target |
| `missing-heading` | file exists; exact heading does not |
| `missing-block` | file exists; exact block id does not |
| `ambiguous` | an interpretation is ambiguous or interpretations diverge |
| `accepted-external` | a matching acceptance row declares an external target |
| `accepted-unresolved` | a matching acceptance row deliberately retains an unresolved target |
| `residual-at-cap` | the occurrence was observed but not resolved before the declared cap |

The class sum equals the observed occurrence count. `creation_queue` and `inventory_boundaries` are separate ledgers, never terminal classes. Missing names enter the creation queue ranked by inbound occurrence count; ranking nominates review and authorizes nothing.

## Normalized records and convergence

Emit one normalized record per occurrence with `source`, `raw_target`, `fragment`, `form`, `class`, `canonical_target`, `rule_id`, and `interpretations`. Preserve `null` explicitly where no value exists. Non-resolved occurrences also receive an uncapped case record.

Two independent tools converge only when all three fingerprints match and their complete normalized record multisets match. Equal exit codes, occurrence counts, class tallies, or record counts are insufficient. Disagreement is evidence to report, never suppress.

## Failure behavior

Any declaration error voids all dialect and acceptance rows and prevents a complete verdict. A cap before canonical inventory closure, an unreadable path, an unsafe redirect, or an unproved governed target is an operationally incomplete result, never clean. A cap reached only after occurrences are inventoried uses `residual-at-cap`. Missing required runtime or companion files means no deterministic resolution verdict; label any separate human review as manual and incomplete.

[load.complete] map-rules.link-resolution
