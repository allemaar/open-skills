# Navigation

## Goal

Maintain authored, curated routes through a scope.

## Root map

The declared root map is the scope's navigation entrypoint. It contains purpose prose and curated membership. Add other roles only when applicable: `Up` for non-root maps, earned sub-maps, justified shortcuts, and declared lifecycle or archive views. These are roles, not required headings. Validators must not require labels.

A repository README may remain the human gateway while another file is the declared root. Link it as an ordinary member. Non-Markdown members carry no `meta.map`; the map covers them according to the declared graph-entry policy.

## Curation

- Preserve authored sections and order. Never replace a meaningful map with an alphabetical dump or generated query.
- Tags support retrieval. They never assert ownership, permission, currentness, or archive state. Reuse established vocabulary. Tag merges and removals are semantic proposals.
- A scope earns a map through meaningful internal structure, distinct lifecycle, repeated navigation, substantial context, or important cross-links. File count alone does not justify one. Small folders remain on their parent map.

Typical roles, omitted when empty:

- `Up`: exact-address link to the parent; absent on the root.
- `Contents` or existing `Current`: curated direct members grouped by meaning.
- `Sub-maps`: earned child maps.
- `Shortcuts`: justified cross-branch routes.
- `Arcs`: ordered or purpose-bound documentary routes, never coordination or work state.
- `Archive`: archived members or an earned archive map.

Add a shortcut only when a recurring route otherwise costs roughly more than three hops or important relevance is non-obvious. Give it a one-line reason. Never chain shortcuts. Adding, changing, or removing one requires a proposal.

Good: a reader can enter at the root and follow curated, reciprocal routes without losing the house's organization.

Bad: generated dumps, empty ceremonial sections, threshold-created maps, or tags used as structure.

[load.complete] map-rules.navigation
