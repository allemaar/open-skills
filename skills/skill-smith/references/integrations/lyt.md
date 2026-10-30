# Optional Lyt integration

Load only for an explicitly requested Lyt integration or a registered Lyt note scope. This augments [metadata](../patterns/metadata.md); it is not required for ordinary skill creation.

1. Read current installed agent guidance and the relevant supported skill/help before operating. Resolve the exact registered target through its owner; do not guess a vault from a local path or enumerate registered content through the filesystem.
2. Inspect the target version's contract and selected operation effects. Preserve loader-owned skill headers and author-supplied semantics. Missing purpose/topic is a question or explicit gap, not a fabricated value. Preserve scanner-owned fields without populating them yourself.
3. Use the supported, authorized note-writing/indexing route. Indexing, source normalization, backfill, adoption and synchronization are different effects. A preview or read grant is not apply authority. Do not normalize skill definitions into notes or backfill live sources as a side effect.
4. Report text indexing, metadata interpretation, validator profile and runtime behavior separately. An indexed body does not establish native support for every frontmatter field. Record a deferred index or incompatible required profile instead of silently rewriting source.

Reference observation: CLI 0.21.2, contract v1, checked 2026-10-29 using installed help and `lyt contract --json`. That note-capture contract names title, created, modified, tags, purpose, topic, mesh-visibility and weight, with optional meta. Purpose/topic are author-owned; supported defaults and scanner-managed data remain with their owners. This is dated evidence, not a substitute for the current target contract or a schema for every recipe.

If the required capability or guidance is unavailable, stop the dependent integration operation. Continue independent generic authoring with compatibility marked unchecked. Return the selected consumer contract and effects to the calling metadata branch.

[load.complete] skill-smith.integration.lyt
