# Manager

Load through [recipe conventions](../recipes.md) when one owner must maintain an inventory and route operations.

- **Setup and shape:** identify the managed scope, authoritative inventory, operation owners and allowed effects. A compact entrypoint with an inventory/help view and conditional operation references is sufficient. Reuse the [operations template](../../templates/operations.md) if those details need a durable home.
- **Modus operandi:** select the requested operation and exact targets from current inventory; load only that procedure. Distinguish help/status from mutation. Resolve ambiguous ownership before acting. Report results, missing coverage and partial failures.
- **Maintenance/doctor:** check the inventory against its declared scope when requested or when evidence shows drift. Look for an existing domain primer before creating another. Coordinate its declared maintenance owner and freshness record; do not duplicate either or silently add sources.
- **Housekeeping:** reconcile retired entries, references and retained recovery material through the selected ownership procedure. Inventory absence is not deletion evidence. A status refresh never authorizes installation, migration or cleanup.

Library setup, installation, publication and generated-manager upgrades remain with the existing library owner. This recipe describes managerial responsibilities; it is not a replacement implementation of those operations.

Return the scoped inventory and routing contract to the calling method. Missing required ownership or operation guidance stops that dependent operation.

[load.complete] skill-smith.recipe.manager
