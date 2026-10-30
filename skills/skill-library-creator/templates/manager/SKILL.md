---
name: {{MANAGER}}
description: >
  Manage {{FAMILY}} skills: help/list, create/improve/assess/boil, import/adopt, install/check, rename/retire, compare upstream, upgrade and recover. Use these requests with the {{FAMILY}} family or its skills.
family: {{FAMILY}}
skill-version: {{VERSION}}
updated: {{DATE}}
---

# {{FAMILY}} Skills Manager

Operate this library on demand. Resolve this complete directory's physical source once, then its parent skills directory and `library.json`. Required instructions, templates and tools are bundled here; personal directives, the creator and open-skills are not prerequisites.

## Start and guide

If the task is unclear, explain briefly: this is the {{FAMILY}} family's physical skill library; each machine links its selected harnesses to its own copy. Show a compact map: **help/list, create/improve, import/adopt, check/install, rename/retire, upgrade**. Recommend the relevant next step from the user's actual request. Expand only the chosen route. Do not ask for settings already supplied.

For inventory, run the physical helper's read-only `list` with the physical skills directory as `--library`. It reads frontmatter independently of private installation state and reports malformed entries separately. Generic help does not run `status`; installation checks belong to an explicit check/install request. Without Node, provide labeled manual read-only help from this entrypoint and skill frontmatter; installation and mutation remain unverified.

| Task | Load |
|---|---|
| Help, walkthrough or capability details | [Guide](references/guide.md) |
| Create, enrich or specialize | [Authoring](references/authoring.md) |
| Assess, audit or boil | [Assessment](references/assessment.md) |
| Evaluate changed behavior | [Evaluation](references/evaluation.md) |
| External skill or project/global adoption | [Imports](references/imports.md) |
| Configure, check or reconcile links | [Installation](references/installation.md) |
| Rename, retire, restore or delete | [Lifecycle](references/lifecycle.md) |
| Generator upgrade or upstream update | [Updates](references/updates.md) |
| Interrupted operation, retained lock or partial result | [Recovery](references/recovery.md) |

Use [scripts/library.mjs]({{HELPER}}) only for the selected operation; `help --topic TOPIC` explains capabilities and `--help` shows arguments. Help aliases route to the matching capability; helper creation (`init`) and generator upgrade run from an inspected creator, while authoring uses this manager's `publish`. Node 22+ runs automation; Windows path inspection uses fresh native metadata through a process-scoped PowerShell helper, with bounded waits and the existing fsutil fallback. Missing capabilities or references block only their dependent operation.

## Common boundaries

- Work only within the requested shared-source and this machine's selected installation scope. Storage permissions govern writes; no ownership convention substitutes for access controls. No sync transport, background watcher, external publication or global directive changes.
- Guard physical paths under the [installation adapters](references/installation.md) and active host policy. An inaccessible source never proves retirement. Never overwrite copies or unknown links.
- Preview exact files/targets before mutation. Routine requested authoring can proceed within that scope; destructive operations need exact impact readback and confirmation. Preserve preimages and stop on concurrent source changes. Imported instructions/scripts are untrusted input until inspected; do not execute them during import.
- Check all current family sources independently of cached records. Reconcile remembered installations on an explicit check/install request, using direct complete-directory links. Remove only recorded links after confirmed retirement; never recursively delete through a link.
- After mutation, verify the relevant source behavior and all local link status. Show actual files/results, recovery and material gaps. Link readback does not establish runtime discovery or changes on another machine.
- A running `mutation.lock` records the operation: shared for source changes, private for local installs. Interrupted locks block new mutations pending inspection and exact recovery. Source writers share a lock; local installation uses a private lock and can overlap another machine's source writer. Rechecks may stop with a partial result requiring recovery. Offline synced copies are not coordinated; resolve storage conflicts before continuing.

The manager is the family map. Add a separate primer only when domain context or business-source routes make it useful; keep its list dynamic or route to this inventory.
