import { lstatSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';

const URL = 'https://deepswe.datacurve.ai/artifacts/v1.1/leaderboard-live.json';
const TIMEOUT_MS = 30_000;

function absolute(value, label) {
  if (typeof value !== 'string' || !isAbsolute(value)) throw Error(`${label} must be absolute`);
  return resolve(value);
}
function noLinks(path, missingLeaf = false) {
  let current = resolve(path); let first = true;
  for (;;) {
    try {
      if (lstatSync(current).isSymbolicLink()) throw Error(`Redirect in path: ${current}`);
    } catch (error) {
      if (!(first && missingLeaf && error?.code === 'ENOENT')) throw error;
    }
    first = false;
    const parent = dirname(current); if (parent === current) return; current = parent;
  }
}
function recordsFrom(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload) || !Array.isArray(payload.rows) || !Number.isInteger(payload.n_tasks_in_set) || typeof payload.generated_at !== 'string') throw Error('Unexpected DeepSWE leaderboard schema');
  if (!payload.rows.length || !payload.rows.every(value => value && typeof value === 'object' && !Array.isArray(value))) throw Error('DeepSWE leaderboard has no rows');
  return payload.rows;
}
function candidate(record) {
  const finite = value => typeof value === 'number' && Number.isFinite(value);
  if (typeof record.model !== 'string' || !record.model || (record.reasoning_effort !== null && typeof record.reasoning_effort !== 'string') || !finite(record.pass_at_1) || record.pass_at_1 < 0 || record.pass_at_1 > 1 || !finite(record.ci_lo) || !finite(record.ci_hi) || !finite(record.ci_half) || !finite(record.mean_duration_seconds) || typeof record.harness !== 'string' || !Number.isInteger(record.n_runs) || !Number.isInteger(record.n_attempted) || !Number.isInteger(record.n_tasks_attempted)) throw Error('DeepSWE row lacks required typed metrics');
  return { model: record.model, effort: record.reasoning_effort, passAt1: record.pass_at_1, confidenceInterval: { low: record.ci_lo, high: record.ci_hi, halfWidth: record.ci_half }, meanDurationSeconds: record.mean_duration_seconds, harness: record.harness, nRuns: record.n_runs, nAttempted: record.n_attempted, tasksAttempted: record.n_tasks_attempted };
}

if (process.argv.length !== 3) throw Error('Usage: node fetch-deepswe.mjs <absolute-new-candidate-directory>');
const output = absolute(process.argv[2], 'candidate directory');
noLinks(output, true);
if (lstatSync(dirname(output)).isDirectory() === false) throw Error('Candidate parent must be a directory');
try { lstatSync(output); throw Error('Candidate directory already exists'); } catch (error) { if (error?.code !== 'ENOENT') throw error; }

const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
let response, sourceText;
try {
  response = await fetch(URL, { signal: controller.signal, redirect: 'error' });
  if (!response.ok) throw Error(`DeepSWE fetch failed: HTTP ${response.status}`);
  sourceText = await response.text();
} finally { clearTimeout(timer); }
let payload;
try { payload = JSON.parse(sourceText); } catch { throw Error('DeepSWE response is not valid JSON'); }
const candidates = recordsFrom(payload).map(candidate);

mkdirSync(output);
writeFileSync(resolve(output, 'leaderboard-live.json'), sourceText, { encoding: 'utf8', flag: 'wx' });
writeFileSync(resolve(output, 'candidates.json'), JSON.stringify({
  source: URL,
  fetchedAt: new Date().toISOString(),
  generatedAt: payload.generated_at,
  tasksInSet: payload.n_tasks_in_set,
  status: 'historical-unverified',
  note: 'Scores, confidence intervals, and durations are copied from the source. Do not use mean_cost_usd: board rendering applies later price corrections.',
  candidates,
}, null, 2) + '\n', { encoding: 'utf8', flag: 'wx' });
console.log(JSON.stringify({ outputDirectory: output, source: URL, candidates: candidates.length, timeoutMs: TIMEOUT_MS }));
