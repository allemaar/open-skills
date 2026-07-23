# diff-recap render-face contract

This required companion is self-contained and travels with the skill. It defines only the render-face choice used by `diff-recap`; it does not import the `orient-*` footer, breadcrumb, staleness, or routing rules.

- An agent consumer receives the YON record only.
- A human using Claude Code receives a widget plus the complete ASCII twin only when the visualization tool is available and the skill was explicitly invoked.
- Every other runtime, missing-tool case, or indeterminate Handler type receives the complete ASCII twin.
- The ASCII twin remains information-complete whenever a human-facing result is emitted. A visual is never the sole carrier of file rows, counts, groups, or totals.
- If the runtime or Handler type cannot be established, choose the ASCII branch. Never guess the richer branch.
