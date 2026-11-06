# Installation and updates

Choose one installation method per runtime. Installing the same skill as a plugin and a copy can create duplicate active instructions. Use the guide to select skills and required companions before installation; this page owns the shared installation explanation.

| Method | What you get | How updates happen | Good fit |
|---|---|---|---|
| Selected skill copies | Editable files in your chosen skills directory | Compare the selected release, preserve your edits, then replace only accepted changes | Starting small or customizing a skill |
| Bundled Node installer | Copies with optional unsigned source stamps and protocol validation | A reviewed re-copy; it does not merge customizations | An explicit runtime and selected skill set |
| Existing managed plugin | Files owned by the runtime's plugin manager | Through that manager and its actual update settings | Users who prefer manager-owned content |
| Direct links to a checkout | The checkout's files are the installed files | Changing that shared checkout changes linked consumers | Authoring or a deliberately managed source checkout |
| Optional skills CLI | Project or global installation through its own owner and metadata | Its documented scoped update operation; new upstream skills need separate selection | Supported external runtimes |

## Prerequisites and scope

The skills are readable instructions, not a runtime. A selected workflow may need Git, a browser, a provider CLI or subagent support; those requirements belong to that skill. A protocol's validity does not guarantee agent behavior.

Manual copying needs no package manager. The bundled install.mjs uses Node built-ins; Node 20 is its CI baseline. Default protocol validation may fetch and execute the public @younndai/yon-parser@2 through npm/npx. Read the installer before running it.

The optional skills CLI is a separate tool. As checked on 2026-11-05, package 1.7.6 requires Node >=22.20.0. This is not a new Node requirement for the skill collection or bundled installer. Exact paths and reload behavior belong to your runtime. Claude Code commonly uses ~/.claude/skills; current Codex can use ~/.agents/skills. Establish the actual selected project/global destination and existing installation before writing.

## Selected copies and the bundled installer

Start from a published release at the [release page](https://github.com/allemaar/open-skills/releases) when you want frozen instructions. Read its migration notes and complete selected folders, including required companions. The README's copy example and install.mjs are source you can inspect.

From the selected checkout:

```text
node install.mjs --list
node install.mjs --runtime claude cold-review
```

The runtime option narrows the destination. Without it the installer considers every known skills directory that already exists. --all selects the whole catalog; it is not the first-use default. Before new or replacement copies, the installer checks declared sibling dependencies in each selected runtime. Missing siblings stop the operation before copying; it lists them without installing them automatically. Select those dependencies explicitly.

Existing entries are skipped unless --force is selected. A forced replacement stages and validates first, compares current destination identity and content before moving it, and checks the displaced tree before activation. It retains the previous copy in an exclusive `open-skills-backups/<run>/previous` directory beside the runtime skills directory, outside discovery, and prints the exact path. A detected intervening edit stops replacement. Failed activation retains the candidate and prior copy for inspected recovery; it does not blindly restore over another writer or automatically delete recovery material. These checks do not lock other editors or promise portable atomic exclusion. It does not merge your edits. Preserve an independent backup and compare before selecting replacement. The installer refuses to overwrite junctions or symlinks. --no-stamp preserves byte identity; otherwise unsigned provenance metadata changes SKILL.md. --no-validate skips the optional parser check, not your responsibility to inspect the files.

## Managed plugin

Claude Code's existing marketplace route is:

```text
/plugin marketplace add allemaar/open-skills
/plugin install open-skills@open-skills
```

Use its own manager to inspect and update that installation. Confirm local overrides and actual update settings before relying on automatic updates. Other runtimes may support marketplace formats, but availability and automatic pickup must be verified on those hosts before being advertised as tested. Do not manually rewrite a plugin cache or create a second installation to work around an unknown manager.

## Optional skills CLI

The documented source command is:

```text
npx skills add allemaar/open-skills --list
```

--list discovers skills without installing them. For an actual install, select skill names, runtime and project/global scope deliberately; the CLI defaults to project scope, and -g selects global scope. It can accept a published tag, such as allemaar/open-skills@v3.0.1, when you want that frozen release rather than the default branch. Match the tag to the capabilities you need.

This command may acquire and execute the CLI. It is not a prerequisite for other routes. Installation metadata, update policy and telemetry belong to that tool. Its documented update command can target named installed skills, but do not run a broad update that includes unrelated packages. Preserve local changes before any manager replacement, and separately select newly added upstream skills.

[Current CLI reference](https://github.com/vercel-labs/skills/blob/main/docs/commands.md) and [prerequisites](https://github.com/vercel-labs/skills#install-a-skill) remain external authorities. Current external CLI execution was not verified for this release. The bundled installer's evidence is a separate claim.

## Update an existing installation

If your installation predates 3.1.0, separately select installation of the complete update-open-skills folder, including references/methods.md, before invoking it; alternatively use the manual update route. Newly added upstream skills such as implement-task also need separate selection. A selective-copy update does not install missing skills. Whole-package managers or shared checkouts can expose added or retired skills; name those effects and explicitly select them with their applicable installation, deletion and shared-source gates before applying the update.

[update-open-skills](skills/update-open-skills.md) first checks the installation and may correctly return already current. Use it for a selected update that preserves local edits and backups:

```text
/update-open-skills Check my existing installation without changing it.
/update-open-skills Update my selected installation to the latest stable release. Keep local edits and backups.
```

A direct checkout link can expose a new release without a reinstall. A copied skill can lag despite its source label. A manager can report success while runtime pickup remains unobserved. Verify the installed inventory and companions, then use a fresh session or the runtime's documented reload when needed. Shared-source updates affect linked consumers, so disclose the inspected boundary and shared effects before changing a checkout. Unknown baselines and unresolved edit conflicts stop the affected update.

## Directory visibility and telemetry

The skills themselves have no telemetry. Git hosts, package managers, runtimes and external CLIs may have their own. The skills CLI documents DISABLE_TELEMETRY=1 and DO_NOT_TRACK=1 as opt-outs; preserve a user's existing choice.

skills.sh says its listings come from observed installation telemetry. A repository page can differ from the current source inventory and may retain retired names. Root skills.sh.json groups names already known to that directory; it does not register every current skill or change installation behavior. Do not manufacture installs to alter rankings. Use the repository's [catalog](../SKILLS.md) and [guides](README.md) for the source inventory.

[Directory listing FAQ](https://www.skills.sh/docs/faq) · [Grouping behavior](https://www.skills.sh/docs/customize) · [Changelog](../CHANGELOG.md)

[License](../LICENSE) · [Trademark policy](../TRADEMARK.md)
