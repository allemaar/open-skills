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

