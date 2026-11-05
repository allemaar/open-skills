---
name: human-draw
description: >
  Renders information as a picture a person reads at a glance. Seven shapes — bar, spine, tree, lane, fork, matrix, small-multiple — drawn in printable ASCII on a monospace grid. Works on any subject: a budget, a harvest, a rota, a roof, a decision. Trigger phrases: "/human-draw", "draw this", "show me this visually", "make a diagram of this", "I can't hold all this in my head". Not /human-output (governs the prose around the figure, and runs alongside this skill rather than before it). Not /human-rewrite (repairs existing text, and hands material here when it turns out relational). This skill builds the text figure that survives copy-paste into any terminal.
visibility: public
self-improvable: true
companions:
  - path: references/human-contract.md
    optional: false
    why: "The required portable family doctrine and style floor; bundled inside this skill."
  - path: references/tools/human-output-check.mjs
    optional: false
    why: "The required mechanical figure-output checker; bundled inside this skill."
  - path: references/examples
    optional: false
    why: "Bundled shape and repair cards; read only the routes selected in The seven shapes."
  - path: ../human-output
    optional: true
    why: "Optional sibling with the full prose layer; the bundled style floor is the fallback."
triggers:
  - "/human-draw"
  - "draw this"
  - "draw it for me"
  - "show me this visually"
  - "make a diagram of this"
  - "picture this"
  - "I can't hold all this in my head"
  - "how do these relate"
next-skills:
  - skill: human-output
    phrase: "/human-output"
    why: "Owns the prose around the figure — the verdict, the caveats, the ask. A figure never ships bare."
  - skill: insight-assess
    phrase: "/insight-assess"
    why: "The figure made a decision visible; now it needs weighing rather than drawing."
---

# /human-draw

A figure is a **material**. It is characters on a monospace grid, read by a
person scanning rather than parsing. Everything here is about what that
material can actually hold.

Two facts set every rule below.

1. **The grid is about 80 columns wide and one character deep.** Cross it and
   the terminal wraps the line, shearing the figure into unreadable halves.
2. **The reader stops wherever they stop** — the family's stopping-point
   doctrine, `references/human-contract.md` §2. So a figure must be correct at
   a glance and still correct on a second look.

## Placement: the rule that matters most

Three parts, always in this order.

```
  verdict sentence  ->  figure  ->  caption stating the finding
```

**A reader who never looks at the picture must still be correct.** That is the
whole test, and it is the stopping-point doctrine applied to a figure. A figure
is evidence for a claim someone else already made in words; it is never the
claim itself.

The verdict above and the caption below are prose. Use `human-output` when it is
installed; otherwise use the portable style floor in
[`references/human-contract.md`](references/human-contract.md), including what
a caption must name (the finding, not the subject). This file owns only what is
inside the fence.

## The default is to draw

Draw when the reader must hold **two or more things in mind and relate them**.
One fact is a sentence. A causal argument is prose. Position, proportion,
sequence, containment, and adjacency are figures.

There are exactly two refusals, and both are refusals because the picture would
lie:

- **Dishonest encoding.** Any visual property asserting something you did not
  measure. Equal-width boxes claiming equal durations. Node size claiming an
  importance nobody ranked. A smooth curve through four points claiming
  continuity. Decimal precision on an estimate. Redesign until every visible
  property maps to a measured quantity, or state the numbers in text instead.
- **Crossing lines.** A crossing means the structure is not flat and the layout
  is lying about it. Re-order to remove it. If it will not go, hand back an
  adjacency table (from / to), which holds arbitrary tangle without deceiving
  anyone.

Everything else **downgrades to a simpler shape**. A refusal hands a
text-fatigued reader back the wall of text that caused the problem.

| What is wrong | Do this, do not refuse |
|---|---|
| More than 7 nodes | Aggregate first, then overview plus one detail frame |
| A table sits beside it saying the same thing | Delete the table, keep the picture |
| It needs a legend to be read at all | Label in place; a legend is a promise the reader will look away and come back, and they will not |
| Items share one attribute set | That material is a table — draw the part that is proportional, tabulate the rest |
| Values are missing | Draw the gap at low resolution and mark it; see below |
| The shape is a straight line of three steps | Say it in a sentence, keep the figure for the branching part |

## Show what is absent

A blank space reads as "nothing there", which is usually false. **Absent and
unreadable are different claims, and the reader must be able to tell them
apart.**

- `[?]` — territory that exists and has not been surveyed. Annotate why.
- `[~]` — territory deliberately not taken: parked, deferred, rejected. It
  stays visible because the reader may want to go back to it, and because a
  route drawn without its alternatives looks inevitable when it was chosen.

Never silently omit either. A leg you skipped drawing is a leg the reader will
never ask about. Never place a node or a bar to make a layout balance.

## Materials: printable ASCII only

Every glyph inside a figure must be printable ASCII, `0x20` to `0x7E`.

The reason is specific, and it is not aesthetic conservatism. Box-drawing
characters, block elements, Unicode arrows and emoji are classified by Unicode
as **East Asian Ambiguous**. Under a Chinese, Japanese or Korean (CJK) locale,
and under many default terminal fonts, they render **double-width**. One such
glyph shifts every character after it on that line, and only that line, so
every column below it shears. It looks perfect in your terminal and arrives
broken in theirs.

| Job | Glyphs |
|---|---|
| Horizontal run, connector | `-` `=` `.` |
| Vertical run | `\|` |
| Corner, junction | `+` |
| Branch end, last child | `` ` `` |
| Arrowhead | `>` `<` `v` `^` |
| Node, waypoint | `o` |
| Terminal, end state | `X` |
| Fill, density | `#` `=` `.` |
| Emphasis, you-are-here | `*` `(*)` |
| Grouping, state | `[` `]` `(` `)` |

Write `-->` not a single-glyph arrow, `OK` / `no` not tick and cross, `deg` not
a degree sign, and a spelled currency code not a symbol. Spaces only, never
tabs — tab width varies by terminal.

**One exemption.** A skill that ships its own machine-checked glyph contract
governs its own figures; the orient family's bundled glyph contract is the example.
Absent such a contract, stay in ASCII.

## Materials: the grid

- **Hard limit 80 columns. Target 64.** The spare 16 absorb a quoted reply
  (`> ` prefixes), a narrow pane, or an indent.
- **Nothing load-bearing past column 72.** If the line wraps, columns 0 to 72
  are what survives intact.
- **Prefer vertical growth.** A tall figure scrolls; a wide figure wraps.
  Wrapping destroys, scrolling does not.
- **Whitespace is structure.** Fix a label width once — 15 is a good default —
  and pad every label to it. Alignment is what lets the eye scan a column
  without reading it.
- **Fence the figure, and leave one blank line above and below.** Outside a
  fence, markdown collapses runs of spaces and the alignment is gone before it
  reaches the eye.
- **Trim trailing spaces.** Invisible now, ugly on paste.

## Materials: line weight

The cheapest extra channel a text figure has. Declare the key inside the figure
whenever more than one weight appears.

| Weight | Means | Written |
|---|---|---|
| heavy | confirmed, actual, recommended path | `A ==> B` |
| medium | ordinary, expected | `A --> B` |
| light | inferred, proposed, uncertain | `A ..> B` |

Leader dots (`....`) connecting a label to its number are the same light
channel doing a second job; context separates them and readers do not confuse
the two.

## Materials: proportion arithmetic

Do not eyeball a bar. Compute it.

```
  cells = round( value / max_value * track_width )
```

- **Fix `track_width` once per figure.** Then pick a scale that divides
  cleanly. A round number of units per cell — 2 L, 20 mm, 5 days — keeps every
  bar exactly proportional. Ragged rounding at short bars is the commonest way
  a figure contradicts its own labels.
- **Print the number beside its bar, always.** The bar carries the shape, the
  number carries the fact. Never make the reader measure, and never make them
  look elsewhere.
- **Round percentages by largest remainder** so the column sums to 100. Take
  the floor of each share, then give the spare points to the largest remainders
  in order. A column summing to 101 costs the reader's trust in everything else
  in the figure.
- **A value under one cell prints as a single `.`,** never as nothing.

## The seven shapes

Compose from these. Do not invent an eighth unless none of them holds the
information.

| Shape | Holds | Reach for it when |
|---|---|---|
| **bar** | magnitude, proportion, share | "how much of each" |
| **spine** | ordered sequence, stages | "what happens in what order" |
| **tree** | containment, decomposition | "what is made of what" |
| **lane** | parallel tracks on one shared axis | "who or what, when" |
| **fork** | branching outcomes, contingency | "if this, then what" |
| **matrix** | two axes at once, positional | "where does each option sit" |
| **small-multiple** | one frame repeated across cases | "how does each one behave" |

---

Read only the cards selected by the material, before drawing. These bundled
cards retain each shape's craft rules and worked example; their example values
are illustrative, never evidence for the current subject.

| Selected material or operation | Required card |
|---|---|
| Bar | [bar](references/examples/bar.md) |
| Spine | [spine](references/examples/spine.md) |
| Tree | [tree](references/examples/tree.md) |
| Lane | [lane](references/examples/lane.md) |
| Fork | [fork](references/examples/fork.md) |
| Matrix | [matrix](references/examples/matrix.md) |
| Small-multiple | [small-multiple](references/examples/small-multiple.md) |
| Overview plus detail, including more than 7 nodes or more than 3 tree levels | Also read [overview and detail](references/examples/overview-detail.md) |
| Repairing dishonest encoding or false precision in an existing figure | Also read [bad figure and repair](references/examples/bad-figure.md) |

For a composite, read each selected shape's card, not every card. Return here
after the selected reads and run **Before you emit**. The cards supplement,
never replace, the shared rules and checks. Resolve their paths relative to
this installed skill directory. If a required card is missing or unreadable,
report the incomplete bundle and return the supplied facts in text or a table;
do not guess the missing craft rules or fabricate a figure.

## Degradation: design for the reader's terminal, not yours

| Failure | What the reader sees | Prevent by |
|---|---|---|
| Line exceeds width | Figure shears in half mid-row | Target 64 columns |
| Emoji in a label | One row shifts, columns bend below it | Printable ASCII only |
| Box-drawing under a CJK locale | Frame doubles in width and skews | Printable ASCII only |
| Proportional font | All alignment gone | Always fence the block |
| Quoted reply (`> `) | Every line gains 2 columns | The 16-column margin |
| Trailing spaces | Invisible now, ugly on paste | Trim every line end |
| Tab characters | Width varies by terminal | Spaces only |

**Graceful degradation rule:** put the label and the number on the *left* and
the decoration on the *right*. If the right edge is lost to a wrap or a narrow
pane, the reader keeps the facts and loses only the picture. Build every row so
its leftmost 40 columns are independently informative.

## Other surfaces

- **Mermaid does not render in a terminal.** It arrives as raw source, which is
  worse than no figure at all. It is entirely appropriate in a file bound for a
  repository or a documentation site, where something renders it.
- **An inline widget, where one is available, adds interaction — never facts.**
  Anything only the widget shows is a fact you failed to deliver. The text
  figure always stands alone and carries the full finding.

## Before you emit

Run all six, then emit the receipt. A check that leaves no trace does not get
run.

1. **Width.** Count the longest line. Under 80, ideally under 64.
2. **Glyphs.** Nothing outside `0x20` to `0x7E`. No tabs, no trailing spaces.
3. **Alignment.** Every repeated field starts on the same column. Every lane
   track has an identical character count.
4. **Arithmetic.** Parts sum to the stated total. Percentages sum to 100. Every
   bar's cells-per-unit ratio matches every other bar's in the same figure.
5. **Ceiling.** Seven nodes or fewer, zero crossings.
6. **Honesty.** No visual property asserts anything unmeasured.

The receipt is one line, the last line inside the fence:

```
  [fig bar | 5 rows | 58 cols | ascii | parts sum 142 L | pct 100]
```

It reports what was carried, not merely that formatting passed. If a check
fails, fix the figure — do not ship it with an apology attached.

Resolve this installed skill's directory and run `node <skill-dir>/references/tools/human-output-check.mjs <draft-path>` on any file containing a figure; the bundled checker grades
the mechanical half only, and alignment, ceilings and honesty stay judgement.
Full checker contract: `references/human-contract.md` §3.

## Boundary

This skill is one member of the `human-` family. The routing table — which
member handles which material — is `references/human-contract.md` §1.

- Not `/human-output` — that owns the words: the verdict sentence, the register,
  caveat placement, and the machine block. This skill owns what is inside the
  fence. Both run together; neither replaces the other.
- Not `/human-rewrite` — that repairs text that already exists without changing
  what it claims. It hands material here at its restack step when the material
  turns out to be relational, positional, or proportional; this skill draws that
  material and never rewrites the surrounding text.
- Not `/human-merge` — several separate reports into one. A figure drawn across
  several *unmerged* reports would encode a combination nobody made: merge
  first, then draw. That skill hands material here when the source structure or
  the joint figure turns out relational or proportional. See
  `references/human-contract.md` §1.
- **Not a rendered chart.** Charting for surfaces where colour, typography and
  a layout engine exist is a different craft with different rules. This skill
  targets a monospace transcript, where position and length are the only
  accurate channels available.
- Not `/orient-map`, `/orient-status` or `/orient-roadmap` — those compute a
  subject's state from artifacts and own their own machine-checked glyph
  contracts. This skill renders a position it is given.
- Not `/insight-assess` — drawing the options is not weighing them.
- **A table is not a figure.** Items sharing one attribute set are a table and
  always were. Use this skill when position, proportion, or connection carries
  the meaning.

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Next skills.** On completion, run the Next Skills protocol
> (`next-skills/SKILL.md`): surface the `next-skills` recommendations from
> front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** Run the Self-Improvement Protocol only when its installed owner is available. Preserve its qualification, vetting and approval rules. If absent, skip that optional hook without claiming it ran, surfacing an unvetted fix or auto-editing; substantive work may complete.
> (`self-improve/SKILL.md`): apply its signal taxonomy and threshold to this
> run; surface any surviving proposal for handler approval. Conservative —
> silent otherwise. Never auto-apply.
