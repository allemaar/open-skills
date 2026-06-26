#!/usr/bin/env node
// budget-check.mjs — a go / no-go usage gate to run BEFORE an expensive multi-agent wave.
//
// Wraps `ccusage blocks --json` (the public usage reader for Claude Code's local logs) and answers
// one question: is the active 5-hour usage block at or past a threshold (default 95%) of its ceiling?
// It NEVER fabricates a verdict — with no usage data, no active block, or no ceiling it returns
// `unknown` (exit 2), not a convenient "go". The ceiling is `--token-limit <N>` if given, else the
// largest historical (non-active) block's total tokens — ccusage's own `max` notion.
//
// This is a runtime tool (it reads YOUR local usage); it is NOT a CI guard — a CI runner has no usage
// data, so the value here is at an agent's/handler's pre-wave decision point, never in the pipeline.
//
// Usage:
//   node tools/budget-check.mjs                       # go/no-go vs 95% of your historical-peak block
//   node tools/budget-check.mjs --threshold 90        # custom threshold (percent)
//   node tools/budget-check.mjs --token-limit 200000000   # explicit ceiling instead of the auto peak
//   node tools/budget-check.mjs --json                # machine-readable verdict
// Exit: 0 = go, 1 = no-go, 2 = unknown (could not determine — fail-closed, never a false go).
//
// Zero-dependency (uses npx ccusage on demand). Apache-2.0. "YON" and "YounndAI" are trademarks of MARLINK TRADING SRL.

import { execSync } from 'node:child_process';

const argv = process.argv.slice(2);
const flag = (name, def) => {
  const i = argv.indexOf(name);
  const v = i >= 0 ? argv[i + 1] : undefined;
  // a "value" that is actually the next flag (or absent) means no value was given → use the default
  return v !== undefined && !v.startsWith('--') ? v : def;
};
const THRESHOLD = Number(flag('--threshold', '95'));
const TOKEN_LIMIT = flag('--token-limit', null);
const JSON_OUT = argv.includes('--json');

function loadBlocks() {
  try {
    // Pinned to a known-good major for output-shape stability; a future breaking shape fails closed below.
    const out = execSync('npx -y ccusage@20 blocks --json', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 120000 });
    const parsed = JSON.parse(out);
    return Array.isArray(parsed.blocks) ? parsed.blocks : null;
  } catch {
    return null;  // ccusage unavailable, offline, or no logs — fail closed to unknown below
  }
}

function compute(blocks) {
  // A bad threshold must fail CLOSED — never silently become NaN and pass every comparison (false go).
  if (!Number.isFinite(THRESHOLD) || THRESHOLD < 0)
    return { verdict: 'unknown', reason: `invalid --threshold "${flag('--threshold', '95')}" — must be a number >= 0` };
  if (!blocks) return { verdict: 'unknown', reason: 'ccusage unavailable or returned no data (not a Claude Code env, offline, or no usage logs)' };
  const active = blocks.find((b) => b.isActive && !b.isGap);
  if (!active) return { verdict: 'unknown', reason: 'no active usage block — nothing in flight to gate against' };

  // A missing/garbage totalTokens (e.g. an upstream ccusage shape change) must fail closed, not read as 0/NaN → go.
  const used = active.totalTokens;
  if (!Number.isFinite(used) || used < 0)
    return { verdict: 'unknown', reason: 'active usage block has no usable totalTokens (ccusage output shape may have changed)' };

  let ceiling = TOKEN_LIMIT !== null ? Number(TOKEN_LIMIT) : null;
  let ceilingSource = TOKEN_LIMIT !== null ? 'explicit --token-limit' : null;
  if (ceiling === null) {
    const peaks = blocks.filter((b) => !b.isActive && !b.isGap).map((b) => b.totalTokens).filter(Number.isFinite);
    if (peaks.length) { ceiling = Math.max(...peaks); ceilingSource = 'historical peak block (ccusage max)'; }
  }
  if (!Number.isFinite(ceiling) || ceiling <= 0)
    return { verdict: 'unknown', reason: 'no ceiling — pass --token-limit <N> (no historical block to infer a peak from)', used };

  // Compare on the RAW ratio; round only for display so a boundary value can't be rounded across the gate.
  const rawPct = (used / ceiling) * 100;
  const pct = Math.round(rawPct * 10) / 10;
  const inferredCeiling = ceilingSource !== 'explicit --token-limit';
  const endMs = Date.parse(active.endTime);
  const secondsUntilWindowClears = Number.isFinite(endMs) ? Math.max(0, Math.round((endMs - Date.now()) / 1000)) : null;
  const suggestedWaitSeconds = secondsUntilWindowClears === null ? null : Math.min(3600, secondsUntilWindowClears);
  const verdict = rawPct >= THRESHOLD ? 'no-go' : 'go';
  return { verdict, pct, threshold: THRESHOLD, used, ceiling, ceilingSource, inferredCeiling, costUSD: active.costUSD,
    windowEnd: active.endTime, secondsUntilWindowClears, suggestedWaitSeconds,
    projectedTokens: active.projection?.totalTokens ?? null };
}

const r = compute(loadBlocks());

if (JSON_OUT) {
  console.log(JSON.stringify(r, null, 2));
} else if (r.verdict === 'unknown') {
  console.error(`budget-check: UNKNOWN — ${r.reason}. Proceed at your discretion; this gate cannot vouch either way.`);
} else {
  // The ceiling is only a real cap when explicit; an inferred peak is a self-referential guess — say so.
  const ceilNote = r.inferredCeiling ? ' — ceiling inferred from your historical peak, not a real plan limit' : '';
  if (r.verdict === 'no-go') {
    const wait = r.suggestedWaitSeconds != null ? ` Window clears in ~${Math.round(r.secondsUntilWindowClears / 60)}m; poll in ${r.suggestedWaitSeconds}s.` : '';
    console.error(`budget-check: NO-GO — ${r.pct}% of ceiling (${r.used.toLocaleString()} / ${r.ceiling.toLocaleString()} tokens, ${r.ceilingSource}${ceilNote}), at/over the ${r.threshold}% threshold. Trim the wave or wait.${wait}`);
  } else {
    console.log(`budget-check: GO — ${r.pct}% of ceiling (${r.used.toLocaleString()} / ${r.ceiling.toLocaleString()} tokens, ${r.ceilingSource}${ceilNote}), under the ${r.threshold}% threshold.`);
  }
}

process.exit(r.verdict === 'go' ? 0 : r.verdict === 'no-go' ? 1 : 2);
