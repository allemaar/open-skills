---
name: human-draw
description: >
  Renders information as a picture a person reads at a glance. Seven shapes — bar, spine, tree, lane, fork, matrix, small-multiple — drawn in printable ASCII on a monospace grid. Works on any subject: a budget, a harvest, a rota, a roof, a decision. Trigger phrases: "/human-draw", "draw this", "show me this visually", "make a diagram of this", "I can't hold all this in my head". Not /human-output (governs the prose around the figure). Not /dataviz (styles charts for rendered surfaces). This skill builds the text figure that survives copy-paste into any terminal.
visibility: public
self-improvable: true
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
2. **The reader stops wherever they stop.** There is no expand control, so a
   figure must be correct at a glance and still correct on a second look.

## Placement: the rule that matters most

Three parts, always in this order.

```
  verdict sentence  ->  figure  ->  caption stating the finding
```

- **Verdict above.** One sentence, including anything that would reverse it.
- **Figure in the middle.** Fenced, so the renderer cannot collapse the spaces.
- **Caption below, naming the finding, not the subject.** Not "Chapter
  network" but "Eight of twelve chapters route through Weald."

**A reader who never looks at the picture must still be correct.** That is the
whole test. A figure is evidence for a claim someone else already made in
words; it is never the claim itself.

The prose itself is governed by `human-output/SKILL.md`. Do not restate those
rules here.

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
governs its own figures; `orient-spec/orient-contract.md` is the example.
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

### bar — magnitude and share

**The shower is half the household's water; every fix below it is noise.**

```
  Household water use             142 L per person per day

  Shower         ########################   48 L   34%
  Toilet         #################          34 L   24%
  Laundry        #############              26 L   18%
  Kitchen tap    ##########                 20 L   14%
  Outdoor        #######                    14 L   10%
                 |         |         |
                 0         20        40 L

  [fig bar | 5 rows | 58 cols | ascii | parts sum 142 L | pct 100]
```

Caption: *A low-flow head saves more than every other change combined.*

Craft notes:

- Label field is 15 wide, so every bar starts on the same column. Bars that
  start on different columns read as noise.
- Track width 24 at 2 L per cell. 48 L is 24 cells, 34 L is 17, 26 L is 13,
  20 L is 10, 14 L is 7. Every ratio is exactly 0.5 cells per litre because the
  scale was chosen to divide the values cleanly.
- Ticks sit at track cells 0, 10 and 20, which is 0, 20 and 40 L. Tick labels
  are left-aligned on their tick so they stay inside the track's own span.
- Largest-remainder working: raw shares are 33.80, 23.94, 18.31, 14.08, 9.86.
  Floors are 33, 23, 18, 14, 9 and sum to 97. The three largest remainders are
  toilet, outdoor and shower, so each gains one point. The column sums to 100.
- Sort descending. An unsorted bar chart makes the reader do the sorting.

---

### spine — ordered sequence

**Two thirds of the season is waiting; all the labour is at the two ends.**

```
  Spring barley, one hectare     168 d sowing to store, 29 h work

  o-- Seedbed and sowing ........   4 d    9 h
  |
  o-- Emergence and tillering ...  49 d    3 h  *
  |
  o-- Stem extension ............  30 d    4 h
  |
  o-- Ear emergence .............  21 d    2 h
  |
  o-- Grain fill ................  52 d    0 h
  |
  X-- Harvest and dry ...........  12 d   11 h

  * a wet April moves tillering, and every stage below it, by 10 d

  [fig spine | 6 stages | 66 cols | ascii | parts sum 168 d and 29 h]
```

Caption: *Hire the combine against the harvest window, not the sowing date —
the one stage that moves is upstream of it.*

Craft notes:

- **Vertical, not horizontal.** Six stages laid left to right need roughly 90
  columns and wrap into rubble. Vertical spines grow in the direction that
  costs nothing.
- `o` for a waypoint, `X` for the terminal state. The reader sees where the
  sequence ends without reading a word.
- Two numeric columns, both right-aligned: elapsed time and attention cost.
  Right-alignment is what makes `4 d` and `49 d` comparable at a glance.
- The `*` marks the one stage carrying variance and its footnote sits **inside
  the figure**. A caveat that changes how the figure is read belongs in it.

---

### tree — containment and decomposition

**Schools take 38 pence of every euro, and four fifths of that is salary.**

```
  Riverton town budget 2026    EUR 48.2 M
  |
  +-- Schools .................... 18.4 M   38%
  |   +-- Staff .................. 13.1 M
  |   `-- Sites and transport ....  5.3 M
  +-- Roads and water ............ 11.9 M   25%
  +-- Health and social care .....  9.6 M   20%
  +-- Administration .............  5.1 M   10%
  `-- Reserve ....................  3.2 M    7%

  [fig tree | 7 nodes | 47 cols | ascii | parts sum 48.2 M | pct 100]
```

Caption: *No non-staff cut inside schools can reach one percent of the budget.*

Craft notes:

- `+--` for every child, `` `-- `` for the last child at a level. The backtick
  corner is what stops the eye; without it the reader cannot see where a
  subtree ends.
- The `|` continuation column under Schools is mandatory while a sibling
  follows. Drop it and the sub-items appear to belong to the root.
- Children sum to their parent (13.1 + 5.3 = 18.4) and the top level sums to
  the header (48.2). **State the total in the header.** A decomposition whose
  parts do not visibly sum is one the reader has to audit.
- Two levels is comfortable, three is the maximum before the indent eats the
  label field. At four, split into overview plus detail.

---

### lane — parallel tracks on one axis

**The grill is at capacity for ninety minutes while the kitchen prep station
is idle.**

```
  Saturday dinner service        three stations, 18:00-22:00

  Kitchen prep  |####====................|
  Grill         |..==########====###=....|
  Front of house|....========#######==...|
                 |     |     |     |     |
               18:00 19:00 20:00 21:00 22:00

  . quiet        = steady        # at capacity

  [fig lane | 3 tracks | 60 cols | ascii | 24 cells each, 10 min per cell]
```

Caption: *Move one prep hand to the grill at 19:30 and the capacity band
disappears.*

Craft notes:

- This is the shape most likely to break, because **three lines have to agree
  on the same columns**: the track, the tick row, and the label row. Build it
  from fixed numbers, never by nudging spaces.
  - Label field is columns 2 to 15, opening `|` at 16, track at 17 to 40,
    closing `|` at 41.
  - A tick at column *c* marks the left edge of column *c*. Ticks fall every 6
    columns — 17, 23, 29, 35, 41 — so each marks one hour. The last sits on the
    closing pipe because a tick marks a boundary, not a cell.
  - Each time label is 5 characters, started 2 columns left of its tick to
    centre it. The single spaces between labels then fall out on their own.
- Every track must be **exactly** the same character count. Count them. One
  short track silently tells the reader that station finished early.
- Three density levels is the limit. Nobody can rank five shades of `#`.
- Lanes stay narrow by choosing a coarse time resolution, never by shrinking
  the label field.

---

### fork — branching outcomes

**Replace the roof: repairing costs more over ten years and carries the
uncertainty as well.**

```
  Slate roof, 38 years old              recommendation: replace

                +--> repair ........ EUR 4 k now
                |      |
                |      +--> holds 6 yr ...... 50% .. then EUR 22 k
                |      `--> fails in 2 yr ... 50% .. then EUR 24 k
  38-year-old --+
  slate roof    |
                `==> replace ....... EUR 19 k now
                       |
                       +--> holds 40 yr ..... 95% .. EUR 0 further
                       `--> flashing rework .  5% .. EUR 2 k

  10-year expected cost:  repair EUR 27 k   replace EUR 19.1 k

  [fig fork | 6 nodes | 66 cols | ascii | expected costs computed below]
```

Caption: *Repair is dearer in expectation and it is the branch that can still
surprise you.*

Craft notes:

- The recommended branch is `==>` and the alternatives are `-->`. The reader
  sees the recommendation before reading a word of it. This is where weight as
  an encoding earns its keep hardest.
- **Both branches are drawn to the same depth.** An undrawn branch reads as the
  wrong one, which silently makes the decision for the reader.
- Probability and consequence sit on the same line as their outcome. Never a
  legend of probabilities underneath.
- **The bottom line is a sentence, not a shape.** Repair is
  4 + 0.5(22) + 0.5(24) = EUR 27 k. Replace is 19 + 0.05(2) = EUR 19.1 k. A
  fork makes branches comparable; the comparison itself is one line of
  arithmetic. Do not try to draw the expected-value calculation.

---

### matrix — two axes at once

**Only the terrace is both cheap and reversible; everything else buys capacity
by locking the business in.**

```
  Cafe capacity, four options       cost against reversibility

                              high cost
                                  |
   Build an extension             |   Buy the unit next door
   EUR 140 k, 18 months           |   EUR 210 k, lease to 2041
                                  |
  hard to reverse ----------------+---------------- easy to reverse
                                  |
   Longer opening hours           |   Outdoor terrace licence
   EUR 9 k a year, staff churn    |   EUR 3 k, renew each year
                                  |
                              low cost

  [fig matrix | 4 options | 67 cols | ascii | both axes carry measured cost]
```

Caption: *Try the terrace for one season; it is the only option that does not
foreclose the others.*

Craft notes:

- Position on two axes is the most accurate channel a text figure has, and it
  is the only shape here that uses both dimensions for data.
- **Each axis must be measured or the figure fails the honesty test.** Cost is
  printed in each quadrant. Reversibility is ordinal and stated as a lease or a
  renewal term, not asserted by placement alone.
- Nothing else is encoded, so nothing else can mislead. No box sizes, no
  distances from the origin, no shading.
- An empty quadrant is a finding. Read this one and the top-right — fast and
  reversible — is empty of anything cheap.

---

### small-multiple — one frame repeated

**Coast and Highland get identical six-month rainfall in opposite halves of the
year; a combined total hides the entire point.**

```
  Rainfall, mm per month, one # = 20 mm, same scale for all three

       Coast           Valley          Highland
  Jan  ########        ####            ##
  Feb  #######         ###             ##
  Mar  ######          ###             ###
  Apr  ####            ##              #####
  May  ##              #               #######
  Jun  #               .               #########

  sum  560 mm          265 mm          560 mm

  [fig small-multiple | 3 frames | 65 cols | ascii | one # = 20 mm]
```

Caption: *Site the reservoir for Highland's June peak, not for an annual mean
that no station actually experiences.*

Craft notes:

- Same axis, same scale, stacked so the eye compares **shapes** by scanning
  down a column. The reader learns the frame once and reuses it.
- **Prefer small multiples whenever you would otherwise need a legend.** One
  overlaid chart with three series would need colour to separate them, and
  colour is unavailable in a terminal and inaccurate everywhere else.
- Valley's June is 5 mm — a quarter of a cell — so it prints as `.` rather than
  as nothing. Absent and too-small are different claims.
- The totals row is what makes the finding falsifiable: two stations sum
  identically and behave nothing alike.
- Rule of thumb: if the question is "how do A and B compare at the same
  moment", combine into one frame. If it is "how does each behave over its own
  range", multiply the frames.

---

## Overview and detail: at most two frames

The only multi-view technique that survives a transcript. A reader cannot pan,
pinch, or hover, so every zoom level must be authored as a complete, standalone
frame.

1. Draw the overview. Aggregate finished work into single nodes.
2. Pick **one node by name**.
3. Draw the detail frame with that exact label in its header, byte for byte.

`Kitchen fit-out` in the overview must be `Kitchen fit-out` in the detail, not
`Fit-out phase`. A renamed node is a new place to the reader, and re-deriving
the link is the entire cost the second frame was meant to save.

**If a third frame feels necessary, the subject is two subjects.** Draw two
figures, or hand back a decomposition. Do not stack zoom levels.

Frame 1 — the whole job:

```
  Bakery opening -- whole job

  [x] Lease signed
   |
  [x] Licence granted
   |
  (*) Kitchen fit-out        week 2 of an estimated 4
   |
  [ ] Staff hired
   |
  [?] Health inspection      cannot be booked until fit-out
   |                         sign-off; date unknown
  [ ] Soft opening

  [~] Second site            parked until this one trades 3 months

  [fig spine | 7 nodes | 66 cols | ascii | 1 marker, 1 unsurveyed, 1 parked]
```

Frame 2 — one named node, its own marker:

```
  Kitchen fit-out -- inside the current stage

  [x] Extraction installed
  [x] Flooring laid
  (*) Gas line certification    blocked: engineer booked Thursday
  [ ] Cold storage delivered
  [?] Counter tops              supplier has not quoted

  [fig spine | 5 nodes | 65 cols | ascii | 1 marker, 1 unsurveyed]
```

Caption: *The only thing that can move the opening date is a gas certificate
booked for Thursday.*

Notes on this pair:

- **Exactly one `(*)` marker per frame.** Two markers mean you have not decided
  what "here" is, and the reader inherits the confusion.
- Three steps of lease work are aggregated into one node. Working memory holds
  about four novel items; every node spent on finished work is a node the
  reader cannot spend on the decision.
- The unsurveyed inspection is drawn with its reason attached, and the parked
  second site stays visible so it is not quietly lost.
- If the marker cannot be placed honestly, write `(*) position unconfirmed` in
  the figure and draw it anyway. A confidently misplaced marker is the worst
  possible output — it sends the reader down the wrong road with certainty.

## A bad figure, and why

A vineyard's season, drawn as an equal-box timeline:

```
  +---------+---------+---------+---------+
  | Prune   | Bud     | Veraison| Harvest |
  | Feb 3   | Apr 11  | Jul 29  | Sep 14  |
  +---------+---------+---------+---------+
```

**Diagnosis: two failures, both fatal.**

*Dishonest encoding.* The four boxes are the same width, which asserts four
equal intervals. The real gaps are 67, 109 and 47 days. The picture contradicts
the data printed inside it, and horizontal distance is the one property a
reader will trust without checking.

*False precision.* `Jul 29` for veraison is a ten-year mean with a spread of
about three weeks. Printing a single day claims a certainty nobody has, and
somebody will book pickers against it.

The fix is to separate the two things the box fused — the ordering and the
magnitude — and let each be honest. The spread belongs in a table, where a
range can be stated without pretending to be a pixel:

| Stage | Typical onset | Spread | Days since previous |
|---|---|---|---|
| Prune | early Feb | 10 d either way | — |
| Bud break | mid Apr | 12 d either way | 67 |
| Veraison | late Jul | 21 d either way | 109 |
| Harvest | mid Sep | 14 d either way | 47 |

If proportion is genuinely the point, draw it with the axis doing real work at
5 days per cell:

```
  Feb 3         Apr 11                 Jul 29    Sep 14
  |-------------|----------------------|---------|
       67 d              109 d            47 d

  [fig spine | 4 marks | 55 cols | ascii | 13+22+9 cells at 5 d per cell]
```

Caption: *The long wait is between bud break and veraison; nothing needs a
decision until July.*

That version passes: four nodes, no crossings, no legend, and every visible
property — horizontal distance — now maps to a measured quantity. Note that
this is the downgrade case working as intended. The equal-box figure was not
refused into silence; it was replaced by a table plus an honest figure.

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

`tools/human-output-check.mjs` grades the mechanical half: printable ASCII
inside fences, fence width, bar proportionality, and percentage sums. Run it on
any file containing a figure. Alignment, ceilings and honesty stay judgement,
and this file does not pretend otherwise.

## Boundary

- Not `/human-output` — that owns the words: the verdict sentence, the register,
  caveat placement, and the machine block. This skill owns what is inside the
  fence. Both run together; neither replaces the other.
- Not `/dataviz` — that styles charts for rendered surfaces where colour and
  typography exist. This skill targets a monospace transcript, where position
  and length are the only accurate channels available.
- Not `/orient-map`, `/orient-status` or `/orient-roadmap` — those compute a
  subject's state from artifacts and own their own machine-checked glyph
  contracts. This skill renders a position it is given.
- Not `/insight-assess` — drawing the options is not weighing them.
- **A table is not a figure.** Items sharing one attribute set are a table and
  always were. Use this skill when position, proportion, or connection carries
  the meaning.

> **Next skills.** On completion, run the Next Skills protocol
> (`next-skills/SKILL.md`): surface the `next-skills` recommendations from
> front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol
> (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-
> recurring weakness in this skill, propose a specific fix for the handler to
> approve. Conservative — silent otherwise. Never auto-apply.
