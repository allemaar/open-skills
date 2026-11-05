# Create a portable skill library

Use this when related skills need a manager, source folder and deliberate installation scope. Use Skill Smith directly for one standalone skill. This creator does not configure sharing, Git, cloud sync or another machine.

## Prepare

You need the full skill-library-creator folder, including protocol, references, templates and scripts; Node 22+ for its helper; an existing physical parent; and actual harness targets. No local npm install is required. On Windows, native fsutil and Windows PowerShell provide metadata and drive inspection. Do not elevate or change execution policy implicitly.

Install from a complete open-skills checkout/export. Choose exactly one command for the standard directory the runtime actually reads:

| Confirmed discovery directory | Command |
|---|---|
| ~/.claude/skills | `node install.mjs --runtime claude --no-stamp skill-library-creator` |
| ~/.codex/skills | `node install.mjs --runtime codex --no-stamp skill-library-creator` |
| ~/.agents/skills | `node install.mjs --runtime agents --no-stamp skill-library-creator` |

This skill has a root protocol. Default installation invokes npx validation, which may download and execute @younndai/yon-parser@2. Satisfy that execution boundary before running it; the [installation guide](../../README.md#install) explains manual copying and no-validation with their limits. Custom runtime roots need the manual route. Inspect existing installations, preserve customizations and retain release identity when using --no-stamp.

Use the runtime's skill picker/catalog where available, then explicitly invoke the skill and require it to resolve and read the installed entrypoint. An unresolved name is a failed load, even if files were copied. Report explicit loading separately from automatic discovery.

## Preview first

Substitute real authorized paths:

> /skill-library-creator Preview an atlas family under <existing physical parent> for <existing project>. It will help maintain concise design and decision records. Use project scope. Inspect harness target candidates and ask only about unresolved targets and useful domain choices. Show the proposed source, manager, settings and installation scope. Preview only: do not create files or links.

Expected first result: a concrete setup preview or a precise unresolved prerequisite. It should reuse supplied facts and skip questions for a complete brief. Ask only material choices; a deeper interview is optional when requested or accepted. Silence leaves optional features off, and a preference is not permission for a separate action. A primer is optional and earns its place only when domain context or source routing adds value beyond the manager's inventory.

When the preview is settled, explicitly authorize its exact setup to continue. The creator's current procedure owns this transition and any required readback; a preview request alone does not approve it.

## Creation flow and result

Preflight -> missing settings -> exact preview -> authorized creation -> selected installation reconciliation -> status/list and target verification -> tour.

The result includes atlas-skills-manager, bundled authoring resources, README and library.json under the new skills child. Machine-specific settings stay outside shared sources. Source bytes, link type/target and runtime pickup are separate observations. A verified link does not prove runtime loading.

The manager owns later family help, inventory and authoring. New manager authoring asks once about optional improvement proposals; decline or silence leaves that loop off. Skill Smith is not a runtime prerequisite. Subagents are not required here.

## Recovery and updates

Existing physical directories are collisions, not replacement permission. Unsupported redirects, missing capabilities, unavailable sources or interruption stop the dependent action. Preserve receipts, locks and recovery evidence; unavailable shared sources are not retirement evidence.

Each teammate selects and installs locally. Updating the creator does not upgrade an existing manager; use its reviewed manager-upgrade route for that separate operation.

See the [Skill Library Creator guide](../skills/skill-library-creator.md) and [source](../../skills/skill-library-creator/SKILL.md) for the complete procedure and safeguards.

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
