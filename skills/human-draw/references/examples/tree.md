### tree — containment and decomposition

**Schools take 38% of the budget, and about 71% of that is staff costs.**

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

Caption: *Sites and transport account for EUR 5.3M, about 11% of the total budget.*

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

