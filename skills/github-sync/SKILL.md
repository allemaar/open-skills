---
name: github-sync
description: Review the session's git changes, summarize them for approval, then commit and push to GitHub. Trigger when the user runs /github-sync or says "sync to github", "commit and push", "push this session", "wrap up and push", "save this session to git". For commit-only (no push) or partial staging, do not use this skill.
disable-model-invocation: true
visibility: public
self-improvable: true
triggers:
  - "/github-sync"
  - "sync to github"
  - "commit and push"
  - "push this session"
  - "wrap up and push"
  - "save this session to git"
next-skills:
  - skill: insight-retro
    phrase: "/retro"
    why: "After the push lands, run a retrospective on what shipped this session"
  - skill: handoff
    phrase: "/handoff"
    why: "Hand the remaining work off to a fresh session now that committed state is the baseline"
---

# /github-sync — Cluster, Commit, and Push

Review the session's git changes, cluster them into an ordered commit plan, get explicit approval over the exact full commit messages, then commit and push — staging only approved paths, with message-exactness and attribution-trailer checks before every push.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## Step 1 — Gather changes

Run in parallel: `git diff --stat HEAD`, `git diff HEAD`, `git status`, `git log --oneline -5` (for commit-style reference).

## Step 2 — Build the change assessment

From the diff and conversation history, identify what changed and which changes are intended for sync. Cluster by intent, operation, app/package, and blast radius. Default to split commits when changes are meaningfully independent; use one commit only when changes are tightly coupled, and state why.

Always route unrelated or unsafe-to-stage work into `Excluded Changes`: worktree/submodule dirty markers (`.claude/worktrees/*`), generated artifacts not requested for commit, unrelated local edits, ambiguous files, `.env` files, binaries, credentials, debug artifacts.

## Step 3 — Propose an ordered commit plan

Present a complete ordered commit plan before asking for approval:

```
## Commit Plan

Commit N: <message>
Why this group:
Files to stage:
Verification:
Full commit message:
```text
<exact subject>

<exact body, if any>
```

Excluded Changes:
- <path> — <reason>
```

Commit messages match recent repo style; subject lines concise (≤72 chars when practical); no attribution trailer. The `Full commit message` block is the exact message to be committed: if the commit will have a body, include the full body; if it will be subject-only, show only the subject line. Before asking for approval, scan every proposed full message block and STOP if it contains `Co-Authored-By`, `Signed-off-by`, `Generated-by`, `Assisted-by`, "generated with AI", assistant/tool attribution text, or any similar attribution or ownership trailer. The `Verification` line states what was run, what should run before/after, or that this sync is message-only. Then ask:

> Ready to commit and push this plan? Reply **yes** to proceed, or tell me what to change.

## Step 4 — Wait for approval

Do NOT proceed until the user explicitly says yes. Approval applies only to the exact plan shown, including the exact full commit message blocks. Stop and ask for a revised plan if any drift appears before push: branch changes, changed files differ from the plan, new dirty files, commit order changes, any commit subject/body/trailer line changes, staged files mismatch, attribution text appears, or push fails.

## Step 5 — Commit and push

Once approved:

1. For each commit in approved order, stage only the listed file paths — no blind `git add .`.
   - When deriving staging paths from Git output, use unquoted or NUL-safe path output such as `git -c core.quotePath=false ls-files ...`; default quoted paths can break Unicode or space-containing paths when passed back to `git add`.
2. Run `git diff --cached --name-status`. Confirm the cached list exactly matches that commit's `Files to stage`.
3. If it does not match, STOP. Unstage or revise only with explicit user approval.
4. Commit with only the exact approved `Full commit message` block. Do not invent, shorten, expand, template, or append any subject, body, or trailer line that was not visible in the approved plan.
5. Run the exact-message check: `git log -1 --format=%B`. Verify the message exactly matches the approved `Full commit message` block.
6. Run the attribution-trailer check against the same output. Verify the message contains no co-author, signed-off-by, generated-by, assisted-by, assistant/tool/AI attribution, or similar attribution or ownership trailer.
7. If the message differs or any attribution text is present, STOP. Do not push. Remove it with `git commit --amend` using only the clean approved message, then rerun both checks. Repeat until exact and clean.
8. Run `git status --short --branch`. Confirm the remaining dirty state matches `Excluded Changes` plus expected post-commit state.
9. After all approved commits are clean, `git push`.

If push fails, report the error and stop — do not retry automatically.

## Step 6 — Confirm

```
Committed:
- <short hash> — <subject>
Pushed to: <branch> → <remote>
Remaining unstaged changes: <none or list>
Verification: <tests/builds run, or intentionally skipped>
Done.
```

## Rules

- NEVER commit without explicit user approval.
- NEVER assume all dirty changes belong in one commit; NEVER use vague groups (`misc`, `updates`, `session changes`).
- NEVER stage files not listed in the approved plan, or `.env` files, binaries, or debug artifacts.
- NEVER commit a subject, body, or trailer line that was not shown in the approved `Full commit message` block.
- NEVER force-push.
- NEVER add `Co-Authored-By`, `Signed-off-by`, `Generated-by`, `Assisted-by`, assistant/tool/AI attribution, or similar attribution or ownership trailers. If one appears in the proposed message, generated command, commit template, editor buffer, or final message: STOP and remove it. If a commit was already created with one, amend it away before any push.
- NEVER push a commit until the exact-message check confirms the committed message is byte-for-byte the approved full message and the attribution-trailer check confirms the message is clean.
- Message-only verification is the default unless the user requested tests/builds or they were already part of the session.
- If new dirty files appear, branch state changes, staged files mismatch, or the approved plan no longer matches reality: STOP and ask for a revised plan.
- If nothing to commit, say so and stop.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
