# Handoff

Load through [recipe conventions](../recipes.md) only when work or context must transfer to another operator or session.

- **Setup and shape:** identify recipient/audience, objective, current state, evidence, unresolved decisions, blockers and next action. A short artifact may be enough; use a template only for repeated transfers.
- **Modus operandi:** distinguish completed, attempted and pending work. Give exact relevant locators and freshness limits; link large history instead of copying it. Carry constraints, permission boundaries and recovery state. A handoff conveys context, not new authority or proof that the recipient acted.
- **Maintenance/doctor:** if state changes before pickup, identify the stale portion and update it through its owner. Unknown or missing evidence stays explicit. Record acceptance only when observed.
- **Housekeeping:** declare when a handoff becomes superseded and retain any necessary recovery/provenance links. Do not delete the source record or send the artifact merely because it was drafted.

Add [record-keeping](record-keeper.md) only when the transfer needs durable history; otherwise avoid a parallel state store. Return the bounded handoff contract to the calling method. A missing recipient or delivery permission blocks sending, not drafting within an authorized scope.

[load.complete] skill-smith.recipe.handoff
