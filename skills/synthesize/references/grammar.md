# Synthesize grammar

This file renders a shape already chosen by the core and a need file. It does
not choose the verdict, settle fidelity, define procedure, or add stop rules.

Words carry all meaning. Symbols may accompany words; removing them must not
remove facts, status, or action. Contrast is limited to one heading level, one
emphasis device, one symbol family, and plain text between them.

## Register and status

Choose the register from the direct reader and stakes. When unclear, use plain
words.

| Role | Impersonal | Personal |
|---|---|---|
| clear | Pass | Good |
| attention | Warn | Watch |
| serious; action required | Fail | Problem |
| halted | Blocked | Stuck / Waiting on X |
| active | Current | Now |
| not started | Pending | Not yet |
| finished | Done | Done |
| reader decides | Stop | Your call / Needs you |

Status grades the fact's effect in the reader's world, not its usefulness to
the argument. Put the supporting fact on the same row or indent. A `Watch` row
renders its supplied condition as `if X -> then Y`.

Formal, medical, legal, crisis, and emotionally heavy output uses sensitive
rendering: omit decorative symbols; keep labels, bullets, spacing, exact
values, and structure.

## Claim and evidence labels

The three public claim labels are spelled exactly `[confirmed]`,
`[judgement]`, and `[estimate]`. `[confirmed]` means verified by the current
writer. A gap renders as `Gap: <what is unknown or unchecked>`, not as another
claim label.

Other evidence qualifiers are limited to `[one case]`, `[deal-breaker]`,
`[optional]`, `[minor]`, and `[question]`. Exact load-bearing values use
backticks. Numbers keep their units and judging reference. Probabilities may
use `n/m`; rates of change remain percentages. Never invent a percentage.

## Cues

On cue-capable surfaces, pair every symbol with a word: `✅ Good`, `⚠️ Watch`,
`⛔ Problem`; progress may use `✓ Done`, `▶ Now`, `○ Not yet`, and
`■ Needs you`. `▶` marks current position only. Action may use `👉 Next step`;
a named gap may use `❓ Gap`; reader decision may use `👤❓ Your call`. Plain
surfaces retain the words.

Use at most one agent stance pair: `🤖👍` recommends, `🤖👎` advises against,
and `🤖👀` is still investigating. Use it only on the labeled stance supplied
by the selected need. Never invent subject-themed symbols.

## Plain forms

- comparison: a plain table; narrow fallback is repeated `label: value` rows
- event order: a plain vertical timeline with dates or sequence anchors
- hierarchy: bullets when indentation alone carries the relation
- progress: rows with a real `n/m` count
- several areas: modules separated by `· · ·`
- no structural relationship: short prose or labeled rows

These forms stay local to synthesize. A table, list, or timeline does not
require a figure. When position, proportion, or connection carries meaning,
load `human-draw`; it owns the complete text figure inside its fence. Keep the
surrounding prose and the need-file shape outside that fence. Never improvise a
figure from this grammar.

## Rows, modules, and air

One row has one job. Open with the known anchor, then the new value. Group
three or more consecutive identical statuses under one cue and label. Items
needing individual audit, consent, safety, or handover lines remain separate
beneath that shared label. Do not stamp the cue on every line.

Use tight rows inside a group, one blank line between groups, `· · ·` between
modules, and at most one `---` fold before raw depth or history. Use at most two
visible hierarchy levels. Short output stays compact. Number four or more
options when the reader may reply by number.

Render so word-only prose, a vertical narrow layout, linear read-aloud order,
monochrome, and translated labels retain the supplied meaning.

[load.complete] synthesize.grammar
