# Metadata by role and consumer

Load when producing structured knowledge artifacts, changing metadata or resolving conflicting consumers. Return the selected contract and unverified compatibility to the calling recipe or method.

- **Skill entrypoint:** preserve the repository/host's required fields, discovery and invocation controls. Do not apply a note-capture schema to every skill definition.
- **Knowledge record:** select fields from the subject's actual storage, retrieval and editing needs. Preserve authored semantics, provenance and fields managed by another tool. Add a field only with a named use; avoid a universal schema.
- **Reusable template:** distinguish authoring instructions from runtime fields. Build the subject-specific template now; populate event/state values only when creating that output. A placeholder in a final record is missing data, not permission to invent it.
- **Integration:** if multiple consumers require incompatible contracts, stop the dependent normalization and preserve source. An adapter/projection needs a demonstrated need and explicit design; keep one canonical source.

For ordinary Obsidian notes, use valid YAML with unique keys and suitable text, list, number, boolean or date values. It does not require the same fields on every note. Nested YAML may be retained, but its Properties editor does not support nested properties; use Source mode for them. See the [Properties contract](https://help.obsidian.md/properties), checked 2026-10-29. Avoid flattening existing structures just to satisfy a different editor or validator.

For an explicit Lyt integration or registered note scope, read [the conditional integration](../integrations/lyt.md). Otherwise do not load it, probe vaults or add its fields. Treat text searchability, native metadata support, validator acceptance and observed runtime behavior as separate claims; state which was actually checked.

[load.complete] skill-smith.pattern.metadata
