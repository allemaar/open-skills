### lane — parallel tracks on one axis

**The grill is at capacity for 110 minutes, including 70 minutes when the
kitchen prep station is quiet.**

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

Caption: *Check staffing during the overlapping quiet and capacity periods;
the chart does not show the effect of reassigning a worker.*

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

