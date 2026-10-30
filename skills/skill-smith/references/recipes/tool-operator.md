# Tool operator

Load through [recipe conventions](../recipes.md) when the skill controls a named tool or service.

- **Setup and shape:** declare supported tasks, required capabilities, inputs, outputs, effects and account/target selection. Discover current supported help rather than assuming a machine path or version. Use the [operations template](../../templates/operations.md) for recurring operating details.
- **Modus operandi:** verify target, capability and authorization before an effect. Prefer a meaningful preview when available; do not describe a mutating command as read-only. Bound long work with observable progress, a deadline, cancellation and a retry policy. Keep credentials outside prompts and logs. A missing permission, model, account or paid capability is a blocker, not permission to switch.
- **Maintenance/doctor:** investigate against the actual tool version and failing request. Recheck changed operations and observed outputs; process exit alone does not establish task success. Report unsupported or unavailable behavior explicitly.
- **Housekeeping:** inventory owned jobs, temporary outputs and recovery state. Verify cancellation/termination when used; preserve partial output for diagnosis. Cleanup or configuration changes require their own authority.

Keep scripts conditional: deterministic repeated mechanics may justify one, but inspect its effects and exercise an isolated case before use. Do not auto-install dependencies or repair global settings.

Return the supported operating contract and verification evidence to the calling method. Missing required capability stops dependent actions.

[load.complete] skill-smith.recipe.tool-operator
