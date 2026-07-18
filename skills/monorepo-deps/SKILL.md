---
name: monorepo-deps
description: >
  End-to-end syncpack + manypkg flow for an npm monorepo: check, fix, update, and maintain `.syncpackrc.json`. Trigger on /monorepo-deps, "update deps", "sync deps", "check deps", "fix syncpackrc", "create syncpackrc", or "my lock file is out of sync". Use syncpack-usage / syncpack-cli / syncpack-config for syncpack API and config details, manypkg-usage for manypkg specifics — this skill orchestrates them.
disable-model-invocation: true
visibility: public
self-improvable: true
next-skills:
  - skill: verify
    phrase: "/verify"
    why: "Run the app to confirm the dep bump didn't break anything user-visible"
  - skill: github-sync
    phrase: "/github-sync"
    why: "Commit the lock + package.json changes and push"
triggers:
  - "/monorepo-deps"
  - "update deps"
  - "sync deps"
  - "check deps"
  - "fix syncpackrc"
  - "create syncpackrc"
  - "my lock file is out of sync"
---

# /monorepo-deps

Run the full syncpack + manypkg flow on an npm monorepo: check version mismatches, fix what's auto-fixable, bump deps via `npm update` with handler-set major caps in root `overrides`, verify, and maintain the `.syncpackrc.json` that governs all of this. One skill covers the whole loop. Use the underlying single-purpose skills (`syncpack-usage`, `syncpack-cli`, `syncpack-config`, `manypkg-usage`) when you need API or config detail beyond what this orchestrator carries inline.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## Boundary

Use `/monorepo-deps` for the **end-to-end** loop on an npm workspaces monorepo: check + fix + update + lock-resync + config maintenance. Use the per-tool reference skills directly when you need a specific command surface:

- `syncpack-usage` — overview, decision gate, version-group behaviors
- `syncpack-cli` — every CLI flag, glob syntax, --dependency-types values
- `syncpack-config` — `.syncpackrc.json` schema reference (versionGroups, semverGroups, customTypes)
- `manypkg-usage` — manypkg CLI + rule names (EXTERNAL_MISMATCH, INTERNAL_MISMATCH, …)

This skill assumes **npm** (not pnpm or yarn). For pnpm/yarn monorepos the syncpack story is the same but the lock-file commands differ — adapt as needed.

## Phase 1 — Detect prerequisites

Before doing anything, check whether `syncpack` and `@manypkg/cli` are installed in the target repo. The skill's behavior splits on this:

| State | Action |
| --- | --- |
| Both installed | Proceed silently to Phase 2 — no asking, no install |
| One or both missing | Stop. Explain to the user what each tool does + why useful (see prose below), then ASK with a single decision: install + continue, or abort. On reject → stop. On accept → install as root devDeps, then continue. |

Detection: read the root `package.json` and check `devDependencies` for `syncpack` and `@manypkg/cli`. (Don't shell out for this — the file is cheap to read.)

**If asking the user to install, use this language:**

> Your repo doesn't have syncpack/manypkg installed yet. They're a near-canonical pair for npm-workspace monorepos:
>
> - **syncpack** — finds and fixes dependency version mismatches across all your workspaces, enforces consistent semver ranges (e.g. `^` for dev/prod, exact for overrides), and lets you ban or pin deps via a single `.syncpackrc.json`. Without it, drift between consumer package.json files goes unnoticed until a build breaks.
> - **manypkg** — validates that workspace package.jsons are internally consistent (versions of `@my/pkg` agree across consumers) and the most-common-range rule catches deps where one app diverged from the rest. Smaller surface than syncpack but catches a different class of bug.
>
> Together they're the standard belt-and-suspenders for keeping a workspace healthy. Install both as root devDeps and continue?

Single decision: yes (install + continue) / no (stop).

## Phase 2 — Pick the operation

If the user invoked with a subcommand (`/monorepo-deps update`, `/monorepo-deps check`, `/monorepo-deps fix`, `/monorepo-deps init-config`, `/monorepo-deps maintain-config`), route directly. Otherwise ask which:

| Op | What it does |
| --- | --- |
| `check` | `syncpack lint` + `manypkg check` + `npm outdated --workspaces` summary. Read-only. |
| `fix` | `syncpack fix` + `manypkg fix`, then `npm install` to resync lock. No `npm update`. |
| `update` | The full sweep: `fix` first, then `npm update --workspaces --include-workspace-root`, handle EOVERRIDE/peer conflicts, re-verify. |
| `init-config` | Create a starter `.syncpackrc.json` from a template (see Phase 5). For repos that don't have one. |
| `maintain-config` | Add/edit groups in an existing `.syncpackrc.json` — pin a new shared dep, add a semver exception, add a banned dep, etc. |

## Phase 3 — Execute

### `check`

```bash
npx syncpack lint
npx manypkg check
npm outdated --workspaces --include-workspace-root --json > /tmp/outdated.json
```

Summarize `/tmp/outdated.json`: group by major / minor / patch / missing, show consumer count per dep. Don't change anything. Report findings.

### `fix`

```bash
npx syncpack fix
npx manypkg fix
npm install
```

`syncpack fix` rewrites consumer package.json ranges to conform to the version groups + semver groups in `.syncpackrc.json`. `manypkg fix` handles the rules it knows about (typically a no-op once syncpack has run). `npm install` resyncs the lock to the rewritten package.jsons. Re-run `syncpack lint && manypkg check` at the end to confirm clean.

### `update`

The full sweep. Run in this order:

1. **`fix` first** (above) so we're updating from a known-clean baseline.
2. **`npm outdated --workspaces`** to see what would bump. Group by major / minor / patch.
3. **Decide which majors to allow.** For each major: is it a deliberate breaking-change opt-in (e.g., the consumer package.json already says `^NewMajor`) or would `npm update` silently cross because the override is `*`? The first kind is fine to let flow; the second kind needs a cap in root `overrides`.
4. **Cap unwanted majors in root `overrides`.** Pattern: `"typescript": "^5"`, `"eslint": "^9"`, `"lucide-react": "^0"`. Cap at the current major. See "EOVERRIDE conflicts" below if npm rejects the override.
5. **`npm update --workspaces --include-workspace-root`** — bumps everything to latest within ranges. The override caps block unwanted majors; consumer `^NewMajor` ranges flow through.
6. **Handle conflicts** if they fire (see two subsections below).
7. **Re-verify:** `npx syncpack lint && npx manypkg check && npm ci --dry-run --workspaces --include-workspace-root`. All three must pass before stopping.

#### EOVERRIDE conflicts

`npm error code EOVERRIDE: Override for <pkg>@<range> conflicts with direct dependency` fires when the dep is both a **direct dep at the root** AND has an override that doesn't match. Resolution options:

- **Match the ranges.** Set root devDep range equal to the override range (e.g. both `^5`). Often the cleanest fix — but watch manypkg in the next subsection.
- **Remove the root direct dep.** If nothing at the root actually needs the dep directly (it's only used transitively or by workspaces), drop it from root `devDependencies`. The override still applies via dedupe. This was the right call for `typescript` in the YounndAI repo — root scripts use `turbo run check-types` which resolves typescript via workspaces, not the root.
- **Scope the override to transitive only:** `"typescript": { ".": "^5" }` syntax means "only apply to transitive uses, leave direct deps alone." Useful when you can't drop the root dep but don't want it capped.

#### Peer-dep conflicts

`npm error code ERESOLVE: Could not resolve dependency: peer X@<exact> from Y` fires when a transitive peer wants an exact version that doesn't match what's installed. Fix:

- **Pin the dep at the exact version the peer wants** — both at the point of declaration (a root devDep with no `^`) AND, if syncpack would otherwise force a `^` range, add a semver group exception:
  ```json
  {
    "label": "X requires exact match for Y peer dep",
    "packages": ["**"],
    "dependencies": ["X"],
    "dependencyTypes": ["prod", "dev"],
    "range": ""
  }
  ```
  Add this to `.syncpackrc.json` `semverGroups` **before** the generic `"range": "^"` group (semver groups are first-match-wins).

#### manypkg EXTERNAL_MISMATCH after capping a major

If you cap a dep in overrides AND pin it as a root devDep at the matching range, manypkg complains that the root range differs from the most-common range across workspaces (`*`). Resolutions:

- **Drop the root devDep entirely** (preferred when possible) — see EOVERRIDE section above.
- **Globally ignore EXTERNAL_MISMATCH** via `manypkg` config in root package.json: `"manypkg": { "ignoredRules": ["EXTERNAL_MISMATCH"] }`. Reasonable when syncpack is already enforcing dep consistency more flexibly — but loses manypkg's most-common-range guard for the whole repo, not just that one dep.

### `init-config`

Create `.syncpackrc.json` at repo root with the override-driven monorepo template. The template encodes a battle-tested pattern: workspace deps are `*` (no version pinning), shared deps are `*` driven by root `overrides`, dev/prod deps use `^`, overrides use exact. Adjust the dependency lists for the target repo.

```json
{
  "versionGroups": [
    {
      "label": "Local workspaces use *",
      "packages": ["**"],
      "dependencies": ["$LOCAL"],
      "dependencyTypes": ["prod", "dev", "peer"],
      "pinVersion": "*"
    },
    {
      "label": "Override-managed deps — versions controlled by root overrides, use * everywhere",
      "dependencies": [
        "typescript", "zod", "react", "react-dom",
        "@types/node", "@types/react", "@types/react-dom",
        "tailwindcss", "eslint",
        "next", "@next/**"
      ],
      "isIgnored": true
    },
    {
      "label": "Ignore resolutions and local version field",
      "dependencyTypes": ["local", "resolutions", "pnpmOverrides"],
      "isIgnored": true
    }
  ],
  "semverGroups": [
    {
      "label": "Use ^ for deps",
      "packages": ["**"],
      "dependencyTypes": ["prod", "dev"],
      "range": "^"
    },
    {
      "label": "Use exact for overrides",
      "packages": ["**"],
      "dependencyTypes": ["overrides"],
      "range": ""
    }
  ]
}
```

After creating, also update root `package.json` `overrides` block to declare which versions actually apply (start with `*` for everything you listed, pin majors as needed).

### `maintain-config`

Common edits:

- **Pin a new shared dep** — add it to the "Override-managed deps" `dependencies` array, then add an entry in root `overrides`. Existing consumer ranges should already be `*` (or change them with `syncpack fix`).
- **Add a peer-pin exception** — append a new semver group with `"range": ""` before the generic `"^"` group (first-match-wins).
- **Ban a dep** — add a version group: `{ "dependencies": ["pkg-name"], "isBanned": true, "label": "Use Y instead" }`.
- **Cap a major in overrides** — change override value from `*` to `^N` where N is the current major.
- **Allow patch+minor on an exact-pinned override** — change `X.Y.Z` to `^X.Y.Z`.

Always re-run `npx syncpack lint && npx manypkg check` after editing.

## Phase 4 — Verify

Before declaring done:

```bash
npx syncpack lint              # → "No issues found"
npx manypkg check              # → "workspaces valid!"
npm ci --dry-run --workspaces --include-workspace-root   # → no "Missing X from lock file" errors
```

If any of these fail, surface the error to the user — don't silently re-loop.

## Phase 5 — Maintain (ongoing)

Once a repo has syncpack + manypkg + a `.syncpackrc.json`, the maintenance cadence is:

- **On every PR that touches deps** — CI should run `npx syncpack lint && npx manypkg check` as a required gate. Without this, drift creeps back in.
- **Whenever a shared dep needs a new version** — bump the entry in root `overrides` (not in 50 consumer package.jsons).
- **Whenever a new shared dep appears across multiple consumers** — add it to the "Override-managed deps" group in `.syncpackrc.json`, then root `overrides`.
- **Whenever a peer dep needs an exact version** — add a semver group exception in `.syncpackrc.json` `semverGroups` before the generic `^` group.
- **Quarterly or before a release** — `/monorepo-deps update` to sweep patches + minors, decide majors deliberately.

## Rules

- MUST detect both `syncpack` and `@manypkg/cli` before any operation; if missing, ASK the user once with the explanation paragraph above and abort on reject.
- MUST run `syncpack lint && manypkg check` as a final verification step before declaring done — both must pass.
- MUST resync the lock with `npm install` (or `npm update` for the `update` op) after any `syncpack fix` that rewrites ranges.
- MUST cap unwanted majors in root `overrides` BEFORE running `npm update`, not after.
- MUST handle EOVERRIDE conflicts by adjusting ranges or dropping the root direct dep — never use `--force` or `--legacy-peer-deps` to mask them.
- MUST handle peer-dep conflicts by adding a semver group exception in `.syncpackrc.json`, not by globally weakening the semver rule.
- MUST NOT auto-fire — only run when the user invokes `/monorepo-deps` or asks for one of the trigger phrases.
- MUST NOT add NPM scripts or git hooks unless the user explicitly asks (this skill does the work; CI integration is a separate decision).
- MUST NOT touch `pnpm-lock.yaml` or `yarn.lock` files — this skill is npm-only.
- MUST NOT commit or push — that's `/github-sync`'s job. End with a status summary and let the user decide.

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
