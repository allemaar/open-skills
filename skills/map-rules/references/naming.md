# Naming and addresses

## Goal

Keep machine locators stable and links unambiguous while titles remain human-facing.

## Address rules

- Structural links target the exact filename stem or an unambiguous vault-relative path, never a display title.
- Prefer unpiped links when Front Matter Title supplies a useful display title. A missing title plus forced pipe is one coupled finding; the pipe alone is not non-compliant.
- Relative Markdown links are valid observed addresses. Normalizing them to wikilinks is a proposal, never an automatic rewrite.
- Ordinary map membership and `meta.map` use the unpiped exact address. Use `[[filename|local label]]` only when prose needs a contextual label.
- Duplicate basenames require an unambiguous vault-relative path. Never use `..` traversal.
- Any member linking a `README.md` root uses an unambiguous path: vault-relative in registered vaults, scope-root-relative elsewhere. Never use bare `[[README]]`.

## Titles and filenames

The filename is the machine locator. Frontmatter `title` is the display label. A title change does not imply rename; a rename requires independent justification.

Classify locators independently of titles:

1. `YYYY-MM-DD-slug.md` when time is part of identity: meeting, event, observation, daily log, point-in-time result, or dated snapshot.
2. `slug.md` for durable concepts, guides, policies, living documents, canonical decisions, and references.
3. `family-subject[-detail].md` when an established family prefix materially improves grouping.
4. `<scope>-map.md` for maps. Never use bare `map.md`. At a vault root, if the default is generic or collides, propose `<mesh>-<vault>-map.md` or a Handler-selected slug; if still unclear, ask. `<Scope> Map` is the default title, but an informative title is preferred.
5. A protocol-owned filename grammar takes precedence. Never rename or reclassify such files; map and describe them. They normally belong under an established exclusion.

Do not add a date merely because the note mentions one. A compact filename may remain stable while its title evolves.

## Sibling case-fold collisions

Within one directory, every file and folder leaf must remain unique after Unicode-preserving case fold. A pair such as `Notes/` and `notes/`, including a file-versus-folder pair, is a collision even when the current filesystem hides it.

Before any selected rename or move, enumerate the destination directory's siblings and compare the proposed leaf case-insensitively. A collision, unreadable sibling set, or uncertain destination blocks the entire related rename or move change set. Do not apply other halves and do not repair the collision by guessing; return it for Handler resolution.

For a selected rename or move, its Impact enumerates every affected declaration and link in the same change set. Prefer an alias when stable-locator cost exceeds the benefit.

Good: exact resolvable addresses, stable locators, independent useful titles.

Bad: title-targeted links, bare README links, ambiguous basenames, or ceremony-driven renames.

[load.complete] map-rules.naming
