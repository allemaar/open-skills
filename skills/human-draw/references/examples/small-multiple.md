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

