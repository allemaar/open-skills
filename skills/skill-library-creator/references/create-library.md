# Guided creation

Start with the short explanation in the entrypoint. Gather only missing settings:

| Setting | Meaning |
|---|---|
| Parent folder | An existing locally accessible physical folder. Create its `skills` child; never replace an existing one. Storage may be local, network, cloud, a checkout or a Lyt vault folder; do not operate its transport. |
| Family prefix | Lowercase kebab-case. Reserve room within the 64-character skill name for `-skills-manager` and capability names. |
| Family purpose | Reuse the supplied scope as a short description; do not invent business context. `--purpose` sets it explicitly. |
| Installation scope | Global for this user, or local to an explicitly chosen project. Every teammate chooses independently. |
| Targets | Actual harness skill directories. Offer conventional candidates and explicit custom targets; distinguish existing roots from missing ones. Candidates are not detected installations. The user selects the roots to use. |

Node 22 or later runs the bundled helper, with no npm install. Windows additionally uses native fsutil for no-follow reparse inspection and Windows PowerShell for drive type and metadata fallback. Missing capabilities block dependent automation; labeled manual read-only help remains available. Do not install prerequisites or change execution policy implicitly.

Use the physical `scripts/library.mjs` and pass arguments as an array through the host's process API, not interpolated shell text. All mutations preview without `--apply`.

1. Run `init --folder PARENT --family PREFIX --purpose PURPOSE`. Review its exact file preview, including the manager, generator baselines, README and library.json; resolve collisions. Add `--apply` for authorized creation.
2. Use the generated manager's physical helper to preview `configure --library SKILLS --scope global`, or `--scope project --project PROJECT`. Global defaults are the user's `.claude/skills`, `.agents/skills`, and `CODEX_HOME/skills` (otherwise `.codex/skills`); project defaults are `.claude/skills` and `.agents/skills`. Explicit `--targets` accepts a JSON array of absolute skill directories for other confirmed harness locations. Review scope, then add `--apply`.
3. Run `reconcile --library SKILLS`; explain missing links and collisions. `--targets JSON_ARRAY` restricts reconcile/status to a selected registered subset. Add `--apply` within the selected installation scope, then run read-only `status` and `list`. Existing physical directories are collisions, not replacements.
4. Tour the result: shared README, manager, authoring templates, references, scripts, and `library.json`. Explain that private installation receipts live outside shared sources and links must be made on each machine. Report blockers and possible session reloads.

Read the [installation reference](../templates/manager/references/installation.md) for mounted volumes, cloud placeholders, network sources and link capabilities. A nearby .git marker is only a repository hint, not ownership or sync evidence. Never create a replacement library for an unavailable source.

The creator does not run Git or synchronization. It adapts local filesystem handling, not remote transport. Source-folder permissions are external; if denied, preserve a proposal in a permitted private location.

Suggested completion: “Created PREFIX-skills-manager at PATH. Linked to TARGETS; BLOCKERS remain. Say ‘help with PREFIX skills’, ‘list PREFIX skills’, or ‘create a PREFIX skill’.” Use actual results, not this wording as a fixed script.
