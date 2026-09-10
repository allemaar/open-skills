# Routing and metadata

Use for discovery, invocation, frontmatter, and sibling boundaries.

## Check

- Folder and declared skill names agree.
- Description states the capability and concrete trigger conditions without becoming an inventory.
- Triggers match actual behavior and do not claim adjacent tasks.
- Plausible sibling collisions have a concise boundary naming the correct owner.
- Explicit-only or mutation-capable skills use the repository's supported invocation-control field when one exists.
- Runtime declarations match mechanisms used in the body.
- Optional metadata has a consumer. Remove inert fields or document the owning consumer.
- When the repository defines self-improvement metadata or a protocol, judge whether opt-in or exemption fits the skill and whether metadata, instructions, and consumer agree. Do not impose it on repositories without that contract.
- Mode names change behavior and have unambiguous entry conditions.
- A mutating mode cannot be entered through vague intent.

Check the repository's canonical conventions before treating any field as required. A convention from another library is evidence, not authority.

Do not make descriptions absorb procedural detail. Discovery metadata selects the skill; the body governs execution.

[load.complete] skills-audit.routing-metadata
