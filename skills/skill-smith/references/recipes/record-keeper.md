# Record-keeper

Load through [recipe conventions](../recipes.md) when a subject needs current state and traceable history across sessions.

## Setup and output

Resolve the subject, authorized writer, state authority, update order, time zone, duplicate identity and recovery rule. A subject can be a project, process or conversation. Do not assume a journal is its source of truth: declare whether current state is derived from entries or has another owner.

Adapt [current state](../../templates/current-state.md), [journal entry](../../templates/journal-entry.md) and [operations](../../templates/operations.md). Select history or journal as the directory name; entries use `yyyy-mm-dd--NN--{slug}` plus the file extension. NN is a collision-safe sequence, not an overwritable slot or a two-digit capacity limit.

Keep the modus operandi and housekeeping inline when short. Split them into operations documents when they need independent loading. Read [metadata](../patterns/metadata.md) for structured frontmatter and [data lifecycle](../patterns/data-lifecycle.md) for rollups, archives and temperature.

## Modus operandi

Read only the current state and evidence needed for this update. Distinguish a duplicate from a correction; corrections identify the earlier event and preserve its evidence. Do not erase prior entries to present an unbroken history.

Define the durable write boundaries and how shared current state is protected. Use [deterministic helper patterns](../patterns/deterministic-helpers.md) when designing append, collision or reconciliation mechanics. An exclusive entry filename alone does not protect concurrent state updates. Unsupported concurrency requires an enforceable single-writer arrangement or a blocked update.

## Doctor and housekeeping

On an interrupted or inconsistent update, compare retained committed evidence with the declared state authority and coverage. Report complete, partial and unknown work; reconcile through an authorized recovery procedure. Never fabricate completion or blindly replay an external action.

Rollups expose coverage, sources, as-of state and unresolved material. Archives stay discoverable and retrievable. Neither age, temperature nor a successful rollup authorizes deletion. Keep failed-update evidence until its disposition is resolved.

Return the chosen authority, update/recovery contract and applicable artifacts to the calling method. Ambiguous ownership or an unsafe writer arrangement blocks mutation.

[load.complete] skill-smith.recipe.record-keeper
