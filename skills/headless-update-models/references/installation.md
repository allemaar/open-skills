# Verify existing runtime installations

Discover real installation locations and targets. Do not assume the shared .agents directory is read by every harness. Codex, Claude Code and Antigravity have separate discovery rules. Newly added skills may require a new session.

For maintained source junctions, verify each target resolves directly to the canonical skill directory and compare all source files. Never write through a junction. For copied installations, an explicit family update includes refreshing the already-established copies after target identity and preimages are checked. New installations remain a separate request.

For Antigravity CLI, inspect local `agy plugin help`, `agy plugin list` and validate the established package. The tested 1.2.2 installer accepted a local directory containing `plugin.json` plus complete skill directories under `skills/`. The manifest had a name and description only; no hooks, MCP servers, agents or permission settings were added. Local installation storage differed from the documentation, so discover the actual result instead of hardcoding either location.

To refresh that existing package: stage a new private directory containing the six maintained headless skills (codex, claude, gemini, models, update-models, usage), preserving complete relative trees and rejecting links in source/staging paths. Inspect the manifest and all staged bytes, run `agy plugin validate <stage>`, then `agy plugin install <stage>` with a finite external deadline. Preserve the previous package before replacement. Check `agy plugin list`, validate the actual installed directory and compare every file plus inventory to staged/source bytes. Report any extra or stale files. A successful install message is not proof that each slash command was consumed by a live model.

Use the package's actual registered namespace when invoking a plugin skill; do not assume an unnamespaced command resolves to it. If installation behavior or discovery shape changes, stop and inspect local help and official docs. Never weaken permission policy or activate billing to make a discovery test pass.
