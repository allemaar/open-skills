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

