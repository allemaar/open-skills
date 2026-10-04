// headless-family:projection
import { lstat, open, readFile, realpath, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, parse, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { runProcess } from './run-process.mjs';

const POLL_MS = 100;
const HEARTBEAT_MS = 30_000;
const MAX_REQUEST_BYTES = 1024;
const MAX_TIMEOUT_MS = 0x7fffffff;
const SPEC_KEYS = new Set(['requestFile', 'requestId', 'resultFile', 'task', 'timeoutMs']);

function fail(message) { throw new TypeError(`fixed-dispatch: ${message}`); }
function normalized(path) { return path.replaceAll('/', '\\').replace(/^\\\\\?\\/, '').toLowerCase(); }
async function noRedirect(path, missingLeaf = false) {
  const absolute = resolve(path), root = parse(absolute).root, parts = absolute.slice(root.length).split(/[\\/]+/).filter(Boolean);
  let cursor = root;
  for (let i = 0; i < parts.length; i += 1) {
    cursor = `${cursor}${cursor.endsWith(sep) ? '' : sep}${parts[i]}`;
    try { const stat = await lstat(cursor); if (stat.isSymbolicLink() || normalized(await realpath(cursor)) !== normalized(cursor)) fail(`redirected path: ${cursor}`); }
    catch (error) { if (error?.code === 'ENOENT' && missingLeaf && i === parts.length - 1) return; throw error; }
  }
}
async function mustBeMissing(path, label) { await noRedirect(path, true); try { await lstat(path); fail(`${label} must initially be missing`); } catch (error) { if (error?.code !== 'ENOENT') throw error; } }
function validate(spec) {
  if (!spec || typeof spec !== 'object' || Array.isArray(spec)) fail('spec must be an object');
  for (const key of Object.keys(spec)) if (!SPEC_KEYS.has(key)) fail(`unknown key: ${key}`);
  for (const key of ['requestFile', 'requestId', 'resultFile']) if (typeof spec[key] !== 'string' || !spec[key]) fail(`${key} must be a nonempty string`);
  if (!isAbsolute(spec.requestFile) || !isAbsolute(spec.resultFile)) fail('requestFile and resultFile must be absolute');
  if (normalized(resolve(spec.requestFile)) === normalized(resolve(spec.resultFile))) fail('request and result must differ');
  if (!Number.isInteger(spec.timeoutMs) || spec.timeoutMs <= 0 || spec.timeoutMs > MAX_TIMEOUT_MS) fail('timeoutMs must be a bounded integer');
  if (!spec.task || typeof spec.task !== 'object' || Array.isArray(spec.task)) fail('task must be a fixed run-process spec');
  const task = structuredClone(spec.task);
  if (!Number.isInteger(task.timeoutMs) || !Number.isInteger(task.shutdownGraceMs) || task.timeoutMs + task.shutdownGraceMs > spec.timeoutMs) fail('task timeout plus grace exceeds dispatcher budget');
  return { ...spec, task };
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function dispatchFixed(spec) {
  const fixed = validate(spec);
  await noRedirect(dirname(fixed.requestFile)); await noRedirect(dirname(fixed.resultFile));
  await mustBeMissing(fixed.requestFile, 'requestFile'); await mustBeMissing(fixed.resultFile, 'resultFile');
  if (!isAbsolute(fixed.task.outputDirectory)) fail('task outputDirectory must be absolute');
  await noRedirect(dirname(fixed.task.outputDirectory));
  await mustBeMissing(fixed.task.outputDirectory, 'task outputDirectory');
  const statusFile = `${fixed.resultFile}.status.json`;
  await mustBeMissing(statusFile, 'status file');
  const startedAt = new Date().toISOString(), deadline = Date.now() + fixed.timeoutMs;
  let taskStop = null, cancelled = false, completed = false;
  let status = { requestId: fixed.requestId, startedAt, status: 'waiting', cleanupCheckRequired: true };
  const persist = async () => { await noRedirect(statusFile, true); await writeFile(statusFile, `${JSON.stringify(status, null, 2)}\n`, { flag: 'w' }); };
  await persist();
  const heartbeat = setInterval(() => { status = { ...status, heartbeatAt: new Date().toISOString() }; void persist().catch(() => { cancelled = true; void taskStop?.(); }); }, HEARTBEAT_MS);
  const cancel = signal => { cancelled = true; status = { ...status, status: 'cancelling', signal }; void persist().catch(() => {}); void taskStop?.(); };
  const sigint = () => cancel('SIGINT'), sigterm = () => cancel('SIGTERM');
  process.once('SIGINT', sigint); process.once('SIGTERM', sigterm);
  try {
    while (!cancelled && Date.now() < deadline) {
      try {
        const requestStat = await lstat(fixed.requestFile);
        if (!requestStat.isFile() || requestStat.size > MAX_REQUEST_BYTES) fail('request must be a regular JSON file at most 1KB');
        await noRedirect(fixed.requestFile);
        const request = JSON.parse(await readFile(fixed.requestFile, 'utf8'));
        if (!request || typeof request !== 'object' || Array.isArray(request) || Object.keys(request).length !== 1 || request.requestId !== fixed.requestId) fail('request must contain only the fixed requestId');
        break;
      } catch (error) {
        if (error?.code !== 'ENOENT') throw error;
      }
      await sleep(POLL_MS);
    }
    if (cancelled) throw new Error('cancelled before task start');
    if (Date.now() >= deadline) throw new Error('request deadline elapsed');
    const remaining = deadline - Date.now();
    if (fixed.task.timeoutMs + fixed.task.shutdownGraceMs > remaining) throw new Error('insufficient remaining dispatcher budget for task');
    status = { ...status, status: 'running', taskStartedAt: new Date().toISOString() }; await persist();
    const result = await runProcess(fixed.task, { onStart: ({ stop }) => { taskStop = stop; if (cancelled) void stop(); } });
    if (cancelled) throw new Error('dispatcher cancelled');
    completed = true;
    status = { ...status, status: 'finished', taskResult: result, endedAt: new Date().toISOString() }; await persist();
    const response = { requestId: fixed.requestId, status: result.status, taskResult: result, cleanupCheckRequired: true };
    await noRedirect(fixed.resultFile, true);
    await writeFile(fixed.resultFile, `${JSON.stringify(response, null, 2)}\n`, { flag: 'wx' });
    return response;
  } catch (error) {
    status = { ...status, status: 'error', endedAt: new Date().toISOString(), error: error.message, cancelled, completed }; await persist().catch(() => {});
    const response = { requestId: fixed.requestId, status: 'error', error: error.message, cleanupCheckRequired: true };
    try { await noRedirect(fixed.resultFile, true); await writeFile(fixed.resultFile, `${JSON.stringify(response, null, 2)}\n`, { flag: 'wx' }); } catch {}
    return response;
  } finally { clearInterval(heartbeat); process.removeListener('SIGINT', sigint); process.removeListener('SIGTERM', sigterm); }
}

async function cli() {
  if (process.argv.length !== 3 || !isAbsolute(process.argv[2])) fail('usage: node dispatch-fixed.mjs <absolute-fixed-spec.json>');
  await noRedirect(process.argv[2]);
  const response = await dispatchFixed(JSON.parse(await readFile(process.argv[2], 'utf8')));
  process.stdout.write(`${JSON.stringify(response)}\n`);
  process.exitCode = response.status === 'exited' && response.taskResult?.processes?.[0]?.exitCode === 0 && !response.taskResult?.timedOut && !response.taskResult?.errors?.length && response.taskResult?.processes?.[0]?.cleanup === 'close-observed' ? 0 : 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) cli().catch(error => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
