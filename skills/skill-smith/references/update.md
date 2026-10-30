# Update

Load for an existing skill revision or selected upstream update. Read [authoring](authoring.md).

1. Resolve canonical source, requested change and current customizations. Read affected constituents and callers; preserve invocation policy, permission gates, optional loops, dependencies and provenance. A request to improve does not authorize a larger workflow.
2. For upstream changes, compare verified original baseline, current local version and selected incoming revision. Acquire without executing. Missing ancestry is unknown, not permission to overwrite. Review independent edits together for semantic conflicts; retain required notices and distinguish upstream identity from local versioning. Use the library manager's comparison/publishing mechanism when available.

**Rename.** When renaming a skill, establish the old and new canonical paths, collision and recovery plan. Inventory identity-bearing frontmatter, headings, protocol identifiers if present, sibling boundaries, next-skills, links, indexes, catalogs and known callers. Update affected owned surfaces through [write](write.md); inventory installed links and copies as separate consumed surfaces. Do not rebuild links or install as a side effect. Check names and references, and verify any separately authorized consumed surface independently. Stop on collision, unresolved ownership or unsafe recovery.

**Representation migration.** When changing single- or dual-document representation, establish the target repository's actual contract and preserve content, invocation policy and opted-in loops. Add a companion only when that contract requires it or a demonstrated need justifies it. For YON, use [yon-write](../../yon-write/SKILL.md) for authoring and [yon-read](../../yon-read/SKILL.md) for interpretation; if a required resource is unavailable, report the gap and stop dependent work. Keep SKILL.md execution-sufficient when the host may not load its companion. Check semantic parity and required validation without assuming a host reads YON. Verify relevant runtime routes where available and report untested hosts. These branches augment this update procedure; complete its [write](write.md) and [evaluate](evaluate.md) work before returning.

3. Prepare the smallest complete revision through [write](write.md). Apply local metadata/version conventions, close affected references and use [evaluate](evaluate.md). Review removed resources and known callers as well as additions.
4. Report what changed, what stayed compatible and what remains unchecked. Manager generator upgrades, installation and sync remain with their owners; do not regenerate a family manager or push upstream as a side effect.

[load.complete] skill-smith.update
