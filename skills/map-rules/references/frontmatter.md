# Frontmatter

## Goal

Apply the scope's selected metadata contract without fabricating authored meaning.

## Contract selection

New organized notes in a registered Lyt vault use the fields below in this order, plus `meta` when needed. Non-Lyt scopes use their host contract unless the Handler selected Lyt-compatible notes. Every eligible organized non-root Markdown file still declares `meta.map`.

| Field | Rule |
|---|---|
| `title` | Explicit human display title or an inferred 5-8-word noun phrase for a newly authorized file. It may differ from the filename. |
| `created` | ISO-8601 timestamp; equals `modified` at creation. |
| `modified` | Maintained by the owning workflow on material edits. Do not invent another timestamp policy. |
| `tags` | Inline YAML array; `[]` when empty. Reuse established vocabulary. |
| `purpose` | Author-supplied reason the note is worth keeping. Never fabricate it. |
| `topic` | Author-supplied semantic category. Never fabricate it. |
| `mesh-visibility` | `local`, `parent`, or `public`; default `local`. Never broaden automatically. |
| `weight` | Integer 1-5; default `3`. |
| `meta` | Optional shared container; `{}` when unused. Non-root eligible notes use `map`; lifecycle fields follow `lifecycle.md`. |

Load `ownership.md` before editing `meta`; it owns container preservation.

Examples:

```yaml
meta: {map: "[[project-neptune-map]]"}
```

```yaml
meta: {map: "[[project-neptune-map]]", archived: "YYYY-MM-DD"}
```

The root map uses `meta: {}` unless another non-map extension exists.

## Additional constraints

- The first paragraph after H1 is the current human description. Do not duplicate it into `meta.summary`.
- Native top-level `aliases` may contain genuine alternate or previous names compatible with the live vault. They do not synchronize title and filename.
- Do not author `links-out-of-vault`.
- Generated backlinks, graph dumps, and health findings do not belong in frontmatter.
- Duplicate keys and multiple `meta.map` values fail closed.

Good: the selected contract is complete, ordered, merged, and honest.

Bad: fabricated purpose/topic, broadened visibility, duplicate keys, or lost sibling metadata.

[load.complete] map-rules.frontmatter
