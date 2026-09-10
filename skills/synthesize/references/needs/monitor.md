# Monitor [need:monitor]

Spine: current assessment; unmeasured or unknown state; watch triggers with
then-do actions; act-now triggers; supplied calibration only. No orphaned
signal list. Render a threshold only when the source, plan, or alert rule
supplies it; otherwise name the calibration gap.

Example:

**The queue is within the operating plan; no action is required now.**

- **Known:** queue depth is `180`, below the plan's `300` watch threshold.
- **Gap:** the west-region worker has not reported for `6 min`.
- **Watch:** the alert rule says `300` or more jobs for `10 min` means add one
  worker and notify operations.
- **Act now:** the same rule says `500` or more jobs means pause new imports.

[load.complete] synthesize.need.monitor
