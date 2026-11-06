# insight-assess

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You have two storage approaches and need a reasoned choice, not more brainstorming. The assessment frames the decision and constraints, compares the options on the same relevant dimensions and traces decision-changing claims back to evidence.

Trace decision-changing claims to their observations, preserving conflicts and dependent sources. The verdict names its rationale and conditions or alternatives; if missing evidence prevents a defensible choice, RECONSIDER identifies what would resolve it.

## Where it fits

Use insight-assess to evaluate known options. Insight-explore generates alternatives, and insight-critique reviews a specific output.

**Family:** Insight & decision. **Subagents:** No subagent step prescribed.

## When to use it

- You already have an option or decision to evaluate.
- You need a comparison, impact analysis, or supported recommendation.

## When not to use it

- You need to generate alternatives first; use insight-explore.
- You want focused review of one output; use insight-critique.

## How to use it

Start with a concrete request. For example:

```text
/insight-assess Compare the supplied object-storage and database-storage proposals against migration effort, reliability, operating cost and our existing constraints.
```

## Flow

1. Frame the decision, objectives, constraints, and evidence.
2. Compare options across consistent relevant dimensions.
3. Use optional methods only when requested or useful.
4. Check alignment and identify assumptions or gaps.
5. Give a supported verdict, rationale, and conditions or alternatives.

## Common questions

**Should every assessment use a decision tree, SWOT and impact-effort matrix?**

No. Select an optional method only when requested or warranted, and read its reference for that route.

**Does a high benefit score override a mandatory constraint?**

No. Evaluate feasible options under the stated obligations, keeping expected benefit separate from disruption and exposure.

## It is working when

- The options are compared on consistent criteria with evidence, material uncertainty and contradictions visible.
- The assessment returns a supported verdict and rationale with any conditions or alternatives.

## Subagents

Defines an evidence-based assessment flow and no subagent step.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A verdict, rationale, conditions or alternatives, and material evidence and uncertainty.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-assess/SKILL.md](../../skills/insight-assess/SKILL.md)
- [skills/insight-assess/protocol.yon](../../skills/insight-assess/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
