# State and logic

Load for uncertainty about rules, state or transitions. Name state, events and controls in domain language. Model only what the decision needs; expose enough state to observe the behavior. Prefer a self-contained local form when suitable.

Write scenarios with starting state, action and expected result derived from stated rules. Include a meaningful legal transition, an invalid transition and reset/replay when applicable. Make simulation assumptions explicit. Separate logic from presentation when that enables independent checking.

Exercise scenarios, compare results with the independent expectations and retain contradictions. Displaying the artifact's own expected answer is not an independent check. Return evidence and limits to common verification and reporting.
