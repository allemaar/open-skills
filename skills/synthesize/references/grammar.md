# The synthesize grammar — words, symbols, spacing, and where each survives

The render layer of /synthesize. One rule outranks everything here: **words own meaning in every mode** — delete every symbol and no fact may be lost. The operating mode on cue-capable surfaces is **paired-cue**: a status carries its symbol AND its word together by default (✅ **Good**, ⚠️ **Watch**). A status repeated in the same output may drop the word after its first appearance — but only when the surface is known cue-capable and never in formal or sensitive mode. On surfaces or subjects where cues are wrong (formal, sensitive, speech, plain terminals), the words stand alone and nothing is lost. The second rule: **contrast is a budget** — one heading level, one emphasis device, one symbol channel, plain text between them; every channel dies of variety.

Three terms of art used below: a **clump** is a tight group of rows with no blank lines inside; a **rail** is a one-to-two-line blockquote carrying the bottom line or the "Yes, but"; a **pill** is a backtick-marked exact value like `€65`.

## Status words — the meaning layer

Two registers, same meanings, chosen by the direct reader and the stakes:

| Role | Impersonal checks | Personal stakes |
|---|---|---|
| all clear | Pass | **Good** / Fine |
| needs attention, states its flip condition | Warn | **Watch** |
| serious, needs action | Fail | **Problem** |
| halted by something | Blocked | **Stuck** / Waiting on X |
| happening now | Current | **Now** |
| not started | Pending | **Not yet** |
| finished | Done | Done |
| reader must decide | Stop | **Your call** / Needs you |

Bold mixed-case in running text — never ALL-CAPS columns (caps read measurably slower). PASS/FAIL caps are permitted only as fixed tokens inside fenced status blocks. A sibling skill's own DECLARED fixed report envelope — its named caps tokens inside its own fenced outputs, such as a review skill's VERDICT/severity labels — carries the same license: local envelope precedence, scoped to that skill's outputs. Register is chosen by the output's function, the direct reader, and the stakes; when signals conflict, the direct reader and the stakes win; when still unclear, plain words only. Formal or sensitive output (legal, medical bad news, official records) uses SENSITIVE MODE: symbols drop (severity glyphs, accents, pairs) — STRUCTURE STAYS. Bold labels, bullets and row clumps, air, `pills`, inline →, and `n/m` counts all remain: sensitive mode removes glyphs, never bullets or clumps — structure is comprehension, not decoration. A bold opening header may serve as the bottom line in Status-class outputs.

**The valence guard:** a status word grades the fact's effect in the READER'S world, never its convenience for the argument. An alarming expert opinion that happens to support your recommendation is a Watch, not a Good. Expert disagreement takes Watch or a neutral label — never Good/Problem by side.

**The evidence guard:** every status must be derivable from a stated fact on the same row or its indent. A feeling is not a status. Every Watch states its flip condition: "if X → then Y".

## Symbols — the companion layer

Severity: ✅ ⚠️ ⛔ accompany Pass/Watch/Problem-class words. Terminal fallback: ✓ ! ✗ (words stay).
(A four-step health gradient 🔴🟠🟡🟢 is deliberately absent: severity's three steps cover the demonstrated cases; a gradient returns only with a real exemplar that three steps cannot serve.)
Progress: the bar is ▰▰▰▱▱ (filled vs empty), ALWAYS with a real `n/m` count — never an invented percentage. Ladder glyphs NEVER ride alone — each row carries its status word per paired-cue: ✓ **Done** · ▶ **You are here** (or **Now**) · ○ **Not yet** · ■ **Needs you** / **Review point** / **Stuck on X**. ●○ never serve as a bar.
Structure: ▶ marks ONLY the current position; the action row is 👉 **Next step** (the pointing hand is its standard cue on cue-capable surfaces); ❓ marks an **Unknown** row (a gap in the picture — the word stays beside it); the reader's decision row is 👤❓ **Your call**; breadcrumb `Area › topic` orients at top. Approximation rides inline as ~ before a number (`~€250`) with [estimated] where the basis matters.
Accents, sparingly (~3 per output as a scan target), only where their plain meaning fits: 🎉 genuine good news · ✨ new · 🚧 in progress/still open · 👀 looking into it · 👍 👎 endorse/against · 🔒 confidential/security · 👉 act here · 1️⃣ 2️⃣ 3️⃣ pickable options ONLY, when the reader will answer with a number; never as status or rank. (Evicted with cause, never re-admit silently: 🏆 — victory valence on unproven inferences misleads scanners; ⭐ — reads as rating; ⚡ — no cross-domain carry.)
Coherence rule: one glyph family per row set — a list mixes neither mono ladder marks (✓ ○ ▶ ■) with emoji rows, nor severity with accents on the same slot. The ladder set is for progress ladders; emoji status rows use ✅ ⚠️ ⛔ and accents.
🤖 pairs (three), at most one per output, on the bottom line (in an Advice output the "My take" line IS the bottom line): 🤖👍 the agent recommends · 🤖👎 advises against · 🤖👀 still investigating. **👤❓ is the reader-decision row** — it sits wherever the decision sits, marked with its words (**Your call** / **Needs you**). 🤖 and 👤 never appear outside these uses. The symbols on this page — severity, progress, structure, accents, pairs, and the category-cue slot below — are the ENTIRE symbol language. Do not add one because it fits the content: a report about insects still uses no 🐛. If a surface offers no symbols at all (plain ASCII), the words alone are the complete output — nothing else changes.

Exact values ride in `backtick marks`: `€18,400` · `clause 8.2` · `212/214` · `60s`. Budget: 1-3 per clump; pills for load-bearing values only.

Evidence tags in plain brackets: [confirmed] [inferred] [estimated] [one case] [deal-breaker] [optional] [minor] [question]. Closed list. **[confirmed] means verified by the writer of THIS output** — never merely asserted by the source being restructured.

**Number guard:** "N out of 100" is for probabilities and proportions of cases only ("4 out of 100 patients"). A rate of change stays a percentage ("prices rose 18%"). Keep one denominator throughout an output. Pair any raw number with its reference when the reader can't judge size alone ("`€480`, under the `€520` cap").

## Spacing — the air system

Three gaps, smallest to largest: **tight** (rows of one clump, no blank lines) → **breath** (one blank line between clumps) → **`· · ·`** (between modules) → **`---`** (exactly one: the fold; everything above is the report, everything below is depth). The renderer collapses multiple blank lines, so air comes from short paragraphs and these separators, not from extra newlines.

## Modules and the category-cue slot

Bold area label, breath line, aim for ~4 visible rows, `· · ·` after. Modules never nest. ONE bottom line above all modules — never one per module. Heading chrome (###) only when a reply has three or more modules.

**The category-cue slot** exists in two positions: before a module's bold area label, and at the head of a recurring report (the stable landmark opener, e.g. `Analytics weekly · #7 · 14:30`). The slot is core; what fills it comes from the Visual Cue Library — a registry of entity icons (settings, calendar, billing…) that ships separately once its entries carry owned, tested when-to-use guidance. Until then, and whenever no library entry exists: the slot renders as the WORD alone, which is always complete. Never repurpose a glyph as a generic report marker (a gear means settings, not "operations report"); the header cue must be the area's own noun. [The slot placement law — cues in these two positions only, never inline, never row-leading — is a TEST-FIRST hypothesis under the live field test.]

Every number in this file is a SCAN TARGET, not a cap: rail ~30 words with its ≤8-word bold lead, accents ~3, pills 1-3, module rows ~4. Targets keep output lean; they never license dropping meaning. When a target and fidelity conflict, fidelity wins — a protected unit is never demoted to meet a number. **Three numbers stay HARD CAPS, not targets: two visible hierarchy levels, one fold, one 🤖 pair.** And one floor: below ~6 rows of content, tight beats aired — ceremony spacing on a short answer is inflation, not clarity.

## Row writing and authoring checks (apply while composing)

- **One job per row, briefly:** each row carries one decision job; aim for ~15 words after the bold label — elaboration moves to the indent or dies. Same-status minor items SHARE one row ("Done — demolition, plumbing, electrics"): fragmenting them into three rows costs more scanning than it buys. Verbosity is the reader's #1 recorded complaint; over-fragmentation is the runner-up.
- **Same-status runs GROUP — this is mandatory, not stylistic:** three or more consecutive rows carrying the identical status collapse under ONE cue + word — either one row with the items joined ("✅ **Good** — both logout doors, the partial upsert, money guards, copy keys"), or, when items need their own lines, one cue'd group label with plain indented lines beneath it. A column of repeated identical cues is visual noise, not signal [reader-reported]. The audit exception survives inside the group: items with individual audit, consent, safety, or handover value keep their own lines UNDER the single label — the cue still never repeats per row.
- **The relationship picks the form, actually:** comparisons become TABLES, event-order becomes a TIMELINE, several areas become MODULES. Rows are the default, not the destiny — flattening a comparison into rows is a routing failure.
- **Given before new:** open each row with the known anchor, end with the new value — "Auth tests: `3` failing", never "3 failures were found in the auth tests".
- **Number for reply-anchoring:** any 4+ item set the reader may answer selectively gets numbers, so "point 3" works across turns.
- **No seductive details:** interesting-but-irrelevant asides measurably LOWER comprehension in decision-bearing output; delete them, or quarantine after the close.
- **Pre-training line:** define the 2-3 load-bearing terms in one line BEFORE the explanation that uses them.
- **Worked example first:** for procedures and teaching, one fully worked instance before (or instead of) abstract steps.
- **Expectation header:** procedures open with "N steps, ~T minutes, you need X".
- **Killer item + list contract:** mark the one step that is unskippable or irreversible; say whether a list is do-as-you-read or confirm-after-finishing.
- **Recurring reports: full state + inline delta** — restate the whole dashboard, annotate changes ("was ⚠️, now ✅"); never delta-only.
- **Lead sentence:** every section's first line is that section's own conclusion.
- **Mini-TOC** at 3+ sections: one line, "Below: A · B · C".
- **Each progress message stands alone; the final message is atomic and self-contained** — a reader who sees only it misses nothing decision-bearing.
- **Teach-back** (one closing self-check question) only where misunderstanding changes safety or success, never on task answers.

## Tables, fences, and hierarchy — three standing rules

Interpretation comes BEFORE the artifact: one plain-text sentence saying what the table or fenced block means precedes it, always — a reader who skips the artifact still gets the meaning. Verdicts and current state live in ordinary text, never only inside a fence. Visible hierarchy caps at two levels everywhere (headings included): deeper structure flattens or moves below the fold.

## The fold and the layers

Layer 0: the bottom line (and the "Yes, but" when one truly exists — bold lead ≤ 8 words, whole rail ≤ ~30; the rail is one causal sentence, condition → changed consequence, never a bare fact — and a risk-lowering claim rides it with its evidence tag). Layer 1: the rows. Layer 2: short indented explainers only under rows that need them (greens never do). Layer 3: below the fold — refs, raw detail, history. The test at every layer: a reader who stops here is not wrong, only less detailed.

## Where things degrade (design for the worst surface)

Render safely everywhere (meaning still rides the words — some plain glyphs shift meaning across cultures): bold mixed-case run-ins, bullets, one-level indents, short blockquotes, `pills`, plain-bracket tags, line-start ✓ ✗ ○. Inline → means "if this, then that" or "became" inside a row; it is the only registered arrow.
Degrade — provide the fallback: tables → repeated records (label: value lines) on narrow screens; trees → bullets; bars → the `n/m` count alone; color emoji → the words (already mandatory); Mermaid/HTML → don't use them here. Two registered devices with fallbacks: ~~struck values~~ for superseded numbers in What-changed outputs only (plain fallback: "(was €200)"); *italic asides* as the channel for skippable commentary and scope notes — exempt from the bold budget, never load-bearing.
Every output must remain correct as word-only prose, in vertical narrow layout, read aloud linearly, in monochrome, and with its labels translated. If any meaning would vanish under those five conditions, it is riding on decoration — move it into words.
