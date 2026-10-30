# {{FAMILY}} skill library

Purpose: {{PURPOSE}}

This folder is the physical home of the {{FAMILY}} family. Its manager is [{{MANAGER}}]({{MANAGER}}/SKILL.md). Skills use the `{{FAMILY}}-` prefix; scripts, references and templates travel with each complete skill directory. The manager lists live skills and their purposes without loading every skill body.

## First installation on each machine

Give your agent this README or the manager's SKILL.md and say: “Help me install this skill library.” The agent should explain the setup, confirm this machine's physical source, ask global or project-local scope and preview exact harness locations. Do not reuse another person's home path.

Global candidates are your `.claude/skills`, `.agents/skills` and Codex's configured skills directory. These are conventions, not detected installations; choose the roots you actually use after the agent reports existing and missing ones. Project defaults are `.claude/skills` and `.agents/skills` inside your chosen project. Other harnesses can use explicit confirmed target directories. Every link points directly to the physical source using the permitted native adapter. A link in one harness never points through another harness.

The bundled Node helper previews operations by default. Your agent runs `configure` with this physical skills directory and the selected scope, then applies `reconcile` within that scope. No knowledge of commands is required from you. Machine-specific installation receipts, recovery receipts and caller paths stay in private application data; do not commit or share them. Source recovery and the running source-mutation lock can live under `.library`. A runtime may need a reload or fresh session.

The source may be a locally accessible network, cloud, repository, ordinary or Lyt vault folder. Its actual filesystem capabilities and host policy determine supported operations; the manager's [installation reference]({{MANAGER}}/references/installation.md) explains adapters and refusals. If the source is unavailable, restore access first; do not create an empty replacement. Your sync client or repository workflow transports content; the skill does not operate it. Read/write access is controlled by storage permissions.

## Start small

- “Help with {{FAMILY}} skills” shows a short capability map. Ask about one capability for its guide.
- “List {{FAMILY}} skills” shows each skill's name, purpose and version.
- “Create a {{FAMILY}} skill for TASK” uses guided authoring and the bundled quality contract.
- “Assess/boil this {{FAMILY}} skill” checks useful detail, clarity and lazy loading before proposing edits. New skills offer an optional improvement loop that asks before applying lessons.
- “Import this skill into {{FAMILY}}” stages an upstream copy or maintained variant, preserves provenance, and activates it only after review.
- “Adopt my existing skill into {{FAMILY}}” stages and reviews the pool copy before moving the original to recovery and linking it back.
- “Check my {{FAMILY}} skills” checks sources and local links on demand. Only recorded links to explicitly retired skills may be removed.

The manager is the default family map. A separate domain primer is optional when shared context or source routing warrants it. All required manager instructions and tools are bundled here; optional external reviews do not block ordinary use. Library and skill versions are recorded in their own metadata.

Without Node, the agent can still provide labeled manual read-only help from the manager and skill frontmatter. Automation remains unavailable. This README is unmanaged after creation; review it separately when upgrading setup guidance.
