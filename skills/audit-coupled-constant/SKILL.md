---
name: audit-coupled-constant
description: Audit every site of a constant whose value is duplicated across multiple call sites (retry budgets, timeouts, page sizes, magic numbers, feature flags). The author-maintained `SEE ALSO` trail is documentation, not enforcement — one missed site means the trail lies. Trigger on /audit-coupled-constant, "audit budget consistency", "find all sites of this value", "check coupled invariant", "before raising this constant", or after any edit to a constant that has SEE ALSO cross-references in its comments. Pairs naturally before /cold-review on a "raise the budget" PR. Not for extract-constant refactors that consolidate scattered values into a single named import — use /improve-codebase-architecture. Not for constants enforced by the type system (TypeScript `as const` literal imported everywhere) where the compiler is the audit — skip.
runtime: [claude, codex, agents]
visibility: public
self-improvable: true
next-skills:
  - skill: cold-review
    phrase: "/cold-review"
    why: "After the audit finds (or confirms zero) missed sites, a fresh-context review is the strongest sanity check that the coupled change is consistent."
  - skill: insight-critique
    phrase: "/critique"
    why: "If the audit surfaces ambiguous sites (intentionally different vs. drift), a focused critique on the specific divergence resolves it before commit."
triggers:
  - "/audit-coupled-constant"
  - "audit budget consistency"
  - "find all sites of this value"
  - "check coupled invariant"
  - "before raising this constant"
---

# /audit-coupled-constant

Before declaring an edit to a coupled constant complete, grep the constant's value globally to verify every site moved together. The author-maintained `SEE ALSO` trail is a maintenance contract, not enforcement — when one site is missed, the trail silently lies in the other sites.

> **Origin.** This skill emerged from a cold-review finding. A 60s retry budget was raised to 180s across 3 of 4 call sites; the 4th (`packages/<pkg>/src/flows/rename.ts:297`) was missed because the SEE ALSO comments in the 3 known sites never mentioned it. Two independent cold reviewers caught it via global grep; the original diagnosis trusted the SEE ALSO trail. The lesson generalizes far beyond retry budgets.

## Boundary

Use `audit-coupled-constant` when you are about to declare done on an edit that touches a constant whose value is duplicated across multiple files, OR whose comments name other files via "SEE ALSO" / "keep in sync" / "matches" / "mirrors" cross-references. Common shapes:

- Retry / timeout budgets (`240 × 250ms`, `60_000`, `60s`)
- Pagination page sizes / query limits (`PAGE_SIZE = 25`)
- Feature-flag strings or keys
- Magic numbers reflecting external invariants (max upload size, max URL length, schema version)
- Shared regex patterns or validation thresholds

Do NOT use for constants that are truly local to one file, for purely-imported constants where only the import site moved (the named symbol is the single source), or for constants enforced by the type system (e.g., a TypeScript `as const` literal imported everywhere — the compiler is your audit).

## Step 1 — Identify the constant + its shapes

A coupled constant appears in code under multiple shapes. List every shape you might find before grepping:

- **Raw value** in code: `240`, `60_000`, `0.5`, `"warn"`
- **Named symbol** (if extracted): `RETRY_BUDGET_MS`, `MAX_PAGE_SIZE`
- **Value-as-comment** in documentation: `// 60s budget`, `/* 240 × 250ms */`
- **Unit suffix** in documentation: `60s`, `60000ms`, `1min`
- **Composite expressions** that reduce to the value: `60 * 1000`, `1000 * 60 * 60`
- **String tokens** the value participates in: log lines, error messages, JSON fixtures, test names

Write the list of shapes down before grepping. Missing a shape is the most common cause of a missed site.

## Step 2 — Grep each shape across the relevant scope

Run a separate grep for each shape. Use Grep / ripgrep, not find or recursive Read. Examples:

```
# raw value
Grep "\\b240\\b" --type ts        # word-boundary avoids 1240, 2401, etc.

# unit-suffixed comment
Grep "60s" --type ts -i

# composite expression
Grep "240 *\\* *250"

# named symbol (if extracted)
Grep "RETRY_BUDGET_MS"
```

Set the scope to the package or repo level — coupled constants often span src + tests + scripts. For monorepos, audit each affected package.

## Step 3 — Reconcile the hits

Group hits into three categories:

- **Moved together** — site already updated to the new value as part of your edit. ✓ No action.
- **Missed site** — site still holds the old value but should move. **Update + verify** the SEE ALSO chain mentions this site after the update.
- **Intentionally different** — site holds a different value by design (e.g., test budget intentionally wider than prod, or development tier intentionally lower). **Document the intent** at the site itself with a comment like `// Intentionally different from registry-reset.ts: tests need 3× the budget for singleFork load.` This prevents the next auditor from misclassifying it.

If you cannot tell which category a site belongs in, halt the edit and ask the author or git blame the comment that introduced the value.

## Step 4 — Repair the SEE ALSO trail

For any newly-found coupled site, add bidirectional SEE ALSO comments so the next auditor doesn't have to re-discover the relationship:

```typescript
// SEE ALSO: <other-file-1>.ts <function> — keep budgets in sync (180s).
// SEE ALSO: <other-file-2>.ts <function> — keep budgets in sync (180s).
```

Critically: also UPDATE the SEE ALSO comments in the EXISTING sites to mention the newly-found site. The trail must be bidirectional, or the next person to touch any one site won't know to look at the new one.

## Step 5 — Emit the audit report

Brief, structured. One section per scope swept:

```
audit-coupled-constant report
  constant: <name or value>
  shapes searched: 240, 60_000, 60s, RETRY_BUDGET_MS
  scope: packages/<pkg>
  sites found: 4
    src/flows/registry-reset.ts:90    moved together ✓
    src/scaffold/delete.ts:42          moved together ✓
    tests/_helpers/fs-retry.ts:47      moved together ✓
    src/flows/rename.ts:297            MISSED — update + add SEE ALSO trail
  intentionally-different sites: 0
  SEE ALSO trail updated: yes (added rename.ts to the 3 existing sites)
```

## Rules

- MUST list every shape the constant can appear in (raw value, named symbol, unit-suffixed comment, composite expression, embedded in strings) before grepping.
- MUST run a separate grep for each shape — one grep per shape, not a single broad grep.
- MUST classify each hit into moved-together / missed / intentionally-different. Halt the edit if you can't classify confidently.
- MUST update SEE ALSO comments in the existing sites when you find a new site — the trail must be bidirectional.
- MUST NOT trust SEE ALSO comments as enforcement. They are documentation that decays.
- MUST NOT declare an edit done before the audit report shows all sites moved (or are intentionally-different with explicit documentation).
- SHOULD pair with `/cold-review` for high-stakes coupled-constant edits (retry budgets that ship to users, schema versions, feature flags wired into rollouts).

## Anti-patterns

- **"I updated the SEE ALSO sites — done."** The SEE ALSO trail's set of named sites may be a subset of all coupled sites. Grep first; trust the trail second.
- **Trusting word-boundary grep for short numbers.** `240` matches `1240`, `2403`, etc. without `\\b`. Always use word-boundary for digit-only constants under 1000.
- **Skipping the unit-suffixed comment shape.** Many sites carry the value as a comment (`// 60s budget`) even when the code uses a named symbol. Comments don't move with code refactors and are the silent-drift source.
- **Treating intentionally-different as "moved together — skip."** If the site is intentionally different, the comment at the site must say so. Otherwise the next auditor will flag it as drift and the cycle repeats.
- **Auditing only your own edit's scope.** The constant may appear in a test fixture, a doc snippet, a script, or a docstring inside a sibling package. Audit the whole repo unless you can prove a tighter scope.
- **Adding SEE ALSO to the new site without updating the old sites.** Trail must be bidirectional. One-way SEE ALSO is worse than none — it gives false confidence.

## Edge cases

- **The constant is a TypeScript `as const` exported from one file.** If all consumers import the symbol (not the value), the compiler enforces the invariant — no audit needed. But if any consumer copy-pasted the value as a literal (often in test fixtures or JSON), grep the raw value to catch those.
- **The constant changed unit (60s → 3min instead of 60s → 180s).** Add the new unit-suffixed shape to the grep list. Old comments with the old unit are now drift; update them.
- **The repo has migrated from raw values to named symbols mid-history.** Grep both shapes; older sites may still carry the raw value.
- **The constant is platform-conditional** (`isWindows ? 240 : 1`). Audit each branch separately. The Windows branch and the POSIX branch are two coupled invariants, not one.

## Outputs

- Audit report (above shape) emitted to chat or written to the active retro / handoff result artifact.
- Updated SEE ALSO comments in all coupled sites (bidirectional trail).
- File path + line number for each MISSED site (so the caller knows where to patch).
- Documented `// Intentionally different from <other-site>: <reason>` comment at any divergent site.

## Pairings

- **Before `/cold-review`:** the audit closes the most common Critical finding category ("missed coupled site"). Run audit first; cold-review confirms the audit was thorough.
- **After a budget raise, page-size change, or magic-number tweak:** standard hygiene. Treat this skill the same way you treat the typecheck — automatic.
- **Inside `/handoff-execute` Phase 4 (Execute):** when the brief involves a budget / timeout / threshold raise, invoke this audit as part of the execute phase, not as an afterthought.

## Out of scope

- This skill does NOT find new constants that should be coupled but aren't yet (e.g., two unrelated files independently hardcoding the same retry value). That's an `improve-codebase-architecture` job (extract-constant refactor).
- This skill does NOT enforce future drift. The SEE ALSO trail it repairs will decay again over time. Periodic re-audit is the price of human-maintained cross-references.
- This skill does NOT replace a typecheck-enforced `as const` extraction when it's feasible. Prefer language-level enforcement when the constant is purely internal; this skill handles the cases where extraction isn't practical (external interfaces, cross-package fixtures, comment-embedded values).

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
