# Workflow

Load through [recipe conventions](../recipes.md) for an ordered process with branches or resumable steps.

- **Setup and shape:** name the trigger, required inputs, final artifact, side effects and observable completion. Use inline steps; extract long conditional branches. Use the [operations template](../../templates/operations.md) only when a separate operating record is useful.
- **Modus operandi:** order prerequisites before effects. For each material branch, state its condition, inputs, owner, result and return point. Separate completed, failed and unstarted work. Resume from observed state, not a claimed success or blind replay of a side effect.
- **Maintenance/doctor:** replay the failing request against the relevant contract and current dependencies. Changes to a step require affected success/failure checks, not an automatic full process run. A diagnosis remains read-only.
- **Housekeeping:** declare temporary outputs and their disposition. Keep recovery evidence until resolution; remove only owned, selected artifacts under applicable cleanup authority.

Add [record-keeping](record-keeper.md) only when state must survive sessions or needs an audit trail; add [handoff](handoff.md) only for a real transfer. Neither is a compulsory phase. A failed prerequisite blocks its dependent step while safe independent work can continue.

Return the smallest complete workflow and recovery boundaries to the calling method.

[load.complete] skill-smith.recipe.workflow
