### bar — magnitude and share

**The shower uses 34% of the household's water, the largest single category.**

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

Caption: *The shower accounts for 48 of 142 litres; the chart does not measure savings from a fixture change.*

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

