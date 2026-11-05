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

  [fig fork | 7 nodes | 66 cols | ascii | expected costs computed below]
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

