# Optional decision tree

Use when choices happen in sequence and uncertain outcomes can change later actions. For a simple comparison, keep the ordinary assessment table.

- Name options, feasible status quo, horizon and constraints. Distinguish decision nodes (choices), chance nodes (uncertainty) and terminal outcomes. Benefits and risks that can coexist are not exclusive branches.
- At each chance node, outcomes must be mutually exclusive and exhaustive; justified probabilities sum to one. Cite their basis and keep unknowns unknown. Model dependent events conditionally, not as independent by default.
- Use comparable payoffs or explicit multiple criteria, with costs counted once at the branch that incurs them. When inputs support arithmetic, work backward: probability-weight outcomes at chance nodes, select feasible alternatives at decision nodes. Preserve downside and risk limits; highest monetary average is not automatically acceptable.
- With insufficient probabilities, show scenarios and switching conditions without fabricated expected values. Vary uncertain inputs over plausible ranges and show which could reverse the choice. Offer insight-value-of-information if buying information could change it; do not invoke automatically.

Return the tree or compact branch table, recommended conditional policy, evidence and sensitive assumptions. Feed it into the existing assessment verdict.

[Method reference](https://www.nasa.gov/reference/6-8-decision-analysis/). [Community implementation inspected](https://github.com/radarist/structured-analytic-skills/tree/d503ff5b164a6bed567a9c48214fd0517cad64dd/skills/expected-value-decision-tree).
