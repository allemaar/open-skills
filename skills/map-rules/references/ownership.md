# Ownership

## Goal

Give each eligible organized file one owner and one reciprocal navigation entry without changing protected content.

## Eligibility and ownership

An eligible member is organized Markdown with authored frontmatter that is not frontmatter-exempt, excluded, or inside a managed artifact's owned surface.

- Every eligible non-root member declares exactly one `meta.map` owner.
- The unique root map omits `meta.map`.
- Non-Markdown and frontmatter-exempt members declare no owner. Their declared graph-entry policy supplies map-side coverage.
- Exact key `meta.parent` is a `legacy-owner-key` finding, never ownership. Replacing it with `meta.map` requires a selected proposal.

For an eligible member, ownership is one approved reciprocal pair: the member declares its owner and the owner's curated section links the member. Never intentionally create one half alone. Other members receive only their declared map-side coverage.

## Managed artifacts

A loader or tool may own a file's frontmatter, locator, or body region. Never alter an owned region. Unowned regions follow ordinary rules. The artifact still joins the graph by an exact vault-relative curated link or an established excluded-subtree declaration.

Tool nominations and missing-field counts are evidence only. They never classify and exempt a file automatically. Confirm ownership from location, writer contract, explicit marker, or Handler selection.

## Excluded subtrees

One declaration covers one exact subtree and records:

- path
- owning tool
- mutation prohibition
- graph-entry policy: individual entries or one entrypoint
- reason

The authoritative machine surface is `.myk/README.md` `m3`. Before a scope contract exists, an exclusion may be Handler-established for one bounded audit and recorded in its plan and report. It authorizes no automatic classification or broad mutation.

Migrating exclusions into `m3` is proposal-first. When establishing a scope, selected `m3` entries, the root map, and initial curated membership form one approval set.

Files under an established exclusion produce no organization findings and receive no `meta.map`. An undeclared machine-owned subtree produces one `declare-or-organize` finding.

## Shared `meta`

`meta` is shared by multiple writers. Read, merge individual keys, and write. Never replace the container or discard sibling keys. Preserve the map-side member link as the recovery copy for owner drift.

Good: every eligible member has one matching owner pair; protected regions remain byte-stable.

Bad: inferred exemptions, orphaned declarations, one-sided links, or replaced `meta` content.

[load.complete] map-rules.ownership
