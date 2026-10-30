// headless-family:projection
import { spawn } from 'node:child_process';
import { lstat, mkdir, open, readFile, realpath, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, parse, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const ALLOWED_KEYS = new Set([
  'executable', 'args', 'cwd', 'outputDirectory', 'timeoutMs', 'shutdownGraceMs', 'stdinFile',
]);
const HEARTBEAT_MS = 30_000;
const STREAM_POLL_MS = 100;
const MAX_GRACE_MS = 30_000;
const MAX_TIMEOUT_MS = 0x7fffffff;
const TASKKILL = process.env.SystemRoot ? resolve(process.env.SystemRoot, 'System32', 'taskkill.exe') : null;

function fail(message) {
  throw new TypeError(`run-process: ${message}`);
}

function normalized(value) {
  return value.replaceAll('/', '\\').replace(/^\\\\\?\\/, '').toLowerCase();
}

async function assertNoRedirectChain(path, { allowMissingLeaf = false } = {}) {
  const absolute = resolve(path);
  const root = parse(absolute).root;
  const parts = absolute.slice(root.length).split(/[\\/]+/).filter(Boolean);
  let cursor = root;
  for (let index = 0; index < parts.length; index += 1) {
    cursor = `${cursor}${cursor.endsWith(sep) ? '' : sep}${parts[index]}`;
    try {
      const stat = await lstat(cursor);
      if (stat.isSymbolicLink()) fail(`redirected path: ${cursor}`);
      const resolved = await realpath(cursor);
      if (normalized(resolved) !== normalized(cursor)) fail(`redirected path: ${cursor}`);
    } catch (error) {
      if (error?.code === 'ENOENT' && allowMissingLeaf && index === parts.length - 1) return;
      throw error;
    }
  }
}

async function assertNativeExecutable(executable) {
  if (typeof executable !== 'string' || !isAbsolute(executable)) fail('executable must be an absolute path');
  if (!executable.toLowerCase().endsWith('.exe')) fail('executable must be a native .exe path');
  try {
    await assertNoRedirectChain(executable);
    const stat = await lstat(executable);
    if (!stat.isFile() || stat.isSymbolicLink()) fail('executable must be a regular non-link file');
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
  return true;
}

function validateSpec(spec) {
  if (process.platform !== 'win32') return { unavailable: 'windows-only' };
  if (!spec || typeof spec !== 'object' || Array.isArray(spec)) fail('spec must be an object');
  for (const key of Object.keys(spec)) if (!ALLOWED_KEYS.has(key)) fail(`unknown key: ${key}`);
  const { executable, args, cwd, outputDirectory, timeoutMs, shutdownGraceMs, stdinFile } = spec;
  if (!Array.isArray(args) || !args.every(value => typeof value === 'string')) fail('args must be an array of strings');
  for (const [name, value] of Object.entries({ cwd, outputDirectory })) {
    if (typeof value !== 'string' || !isAbsolute(value)) fail(`${name} must be an absolute path`);
  }
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0 || timeoutMs > MAX_TIMEOUT_MS) fail(`timeoutMs must be an integer from 1 through ${MAX_TIMEOUT_MS}`);
  if (!Number.isInteger(shutdownGraceMs) || shutdownGraceMs < 100 || shutdownGraceMs > MAX_GRACE_MS) fail(`shutdownGraceMs must be an integer from 100 through ${MAX_GRACE_MS}`);
  if (stdinFile !== undefined && (typeof stdinFile !== 'string' || !isAbsolute(stdinFile))) fail('stdinFile must be an absolute path when supplied');
  return { executable, args: Object.freeze([...args]), cwd, outputDirectory, timeoutMs, shutdownGraceMs, stdinFile };
}

function validateHooks(hooks) {
  if (!hooks || typeof hooks !== 'object' || Array.isArray(hooks)) fail('hooks must be an object');
  for (const key of Object.keys(hooks)) if (!['onStart', 'onStdoutChunk', 'onStderrChunk'].includes(key)) fail(`unknown hook: ${key}`);
  for (const [name, callback] of Object.entries(hooks)) if (callback !== undefined && typeof callback !== 'function') fail(`${name} must be a function`);
  return hooks;
}

async function writeStatus(path, value) {
  await assertNoRedirectChain(path, { allowMissingLeaf: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

function taskkill(pid) {
  return new Promise(resolve => {
    if (!TASKKILL) { resolve({ attempted: false, error: 'SystemRoot is unavailable; outer host must cancel the process tree' }); return; }
    let settled = false;
    const finish = value => { if (!settled) { settled = true; clearTimeout(timer); resolve(value); } };
    let child;
    const timer = setTimeout(() => {
      try { child?.kill(); } catch {}
      finish({ attempted: true, timedOut: true, error: 'taskkill helper timed out' });
    }, 3_000);
    timer.unref();
    try {
      child = spawn(TASKKILL, ['/PID', String(pid), '/T', '/F'], { shell: false, windowsHide: true, stdio: 'ignore' });
    } catch (error) {
      finish({ attempted: true, error: error.message });
      return;
    }
    child.unref();
    child.once('error', error => finish({ attempted: true, error: error.message }));
    child.once('close', (exitCode, signal) => finish({ attempted: true, exitCode, signal }));
  });
}

/**
 * Launch one Windows native executable with file-backed stdio only.
 * A returned process status describes supervision, never task acceptance.
 */
export async function runProcess(spec, hooks = {}) {
  const checked = validateSpec(spec);
  const callbacks = validateHooks(hooks);
  if (checked.unavailable) return { status: 'unavailable', reason: checked.unavailable, processes: [] };
  const executableExists = await assertNativeExecutable(checked.executable);
  if (!executableExists) {
    return { status: 'missing-cli', executable: checked.executable, processes: [], errors: ['native executable not found'] };
  }
  await assertNoRedirectChain(checked.cwd);
  await assertNoRedirectChain(dirname(checked.outputDirectory));
  try {
    await lstat(checked.outputDirectory);
    fail('outputDirectory must be new');
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
  if (checked.stdinFile) await assertNoRedirectChain(checked.stdinFile);

  await mkdir(checked.outputDirectory);
  const stdoutPath = resolve(checked.outputDirectory, 'stdout.log');
  const stderrPath = resolve(checked.outputDirectory, 'stderr.log');
  const statusPath = resolve(checked.outputDirectory, 'status.json');
  const stdout = await open(stdoutPath, 'wx');
  const stderr = await open(stderrPath, 'wx');
  const stdoutReader = await open(stdoutPath, 'r');
  const stderrReader = await open(stderrPath, 'r');
  const stdin = checked.stdinFile ? await open(checked.stdinFile, 'r') : null;
  const startedAt = new Date().toISOString();
  const finalDeadline = performance.now() + checked.timeoutMs + checked.shutdownGraceMs;
  let child;
  let timedOut = false;
  let settled = false;
  let finishing = false;
  let heartbeat;
  let streamPoll;
  let timeout;
  let grace;
  let finalTimer;
  let stopping = false;
  let captureError = null;
  let requestStop = null;
  let stdoutOffset = 0;
  let stderrOffset = 0;
  let drainPromise = null;
  let closePromise = null;
  let filesClosed = false;
  let terminalOutcome = null;
  let rootClose = null;
  let statusQueue = Promise.resolve();
  let latest = { status: 'starting', pid: null, startedAt, timedOut: false, cleanup: 'pending' };
  const persist = () => {
    const snapshot = { ...latest };
    const attempt = statusQueue.then(() => writeStatus(statusPath, snapshot));
    // Serialize snapshots so earlier writes cannot overtake terminal reporting.
    statusQueue = attempt.catch(error => {
      if (settled) return;
      captureError ??= `status persistence failed: ${error.message}`;
      if (!finishing) void requestStop?.('capture-error');
    });
    return attempt;
  };
  const record = () => { if (!finishing && !settled) void persist().catch(() => {}); };
  const closeFiles = () => closePromise ??= Promise.allSettled([stdout.close(), stderr.close(), stdoutReader.close(), stderrReader.close(), stdin?.close()]).then(results => {
    filesClosed = results.every(result => result.status === 'fulfilled');
    return results.filter(result => result.status === 'rejected').map(result => `file closure failed: ${result.reason?.message ?? result.reason}`);
  });
  const clearRunTimers = () => {
    clearInterval(heartbeat);
    clearInterval(streamPoll);
    clearTimeout(timeout);
    clearTimeout(grace);
  };
  const terminalStatus = (outcome, errors) => {
    latest = { ...latest, status: errors.length ? 'error' : 'exited', endedAt: new Date().toISOString(), exitCode: outcome.exitCode ?? null, signal: outcome.signal ?? null, timedOut, cleanup: outcome.cleanup, errors: [...errors] };
  };

  const completed = new Promise(resolveResult => {
    const settle = (outcome, errors, statusPersisted) => {
      if (settled) return;
      settled = true;
      clearRunTimers();
      clearTimeout(finalTimer);
      resolveResult({ status: errors.length ? 'error' : 'exited', executable: checked.executable, cwd: checked.cwd, outputDirectory: checked.outputDirectory, stdoutPath, stderrPath, statusPath, timedOut, cleanupCheckRequired: true, statusPersistence: statusPersisted ? 'confirmed' : 'unverified', fileClosure: filesClosed ? 'confirmed' : 'unverified', errors: [...errors], processes: [{ pid: child?.pid ?? null, startedAt, exitCode: outcome.exitCode ?? null, signal: outcome.signal ?? null, cleanup: outcome.cleanup }] });
    };
    const finish = async ({ exitCode = null, signal = null, cleanup, error } = {}) => {
      if (finishing || settled) return;
      finishing = true;
      clearRunTimers();
      terminalOutcome = { exitCode, signal, cleanup };
      const errors = [error, captureError].filter(Boolean);
      errors.push(...await closeFiles());
      // Observe preceding status failures before constructing the terminal snapshot.
      await statusQueue;
      if (settled) return;
      if (captureError && !errors.includes(captureError)) errors.push(captureError);
      terminalStatus(terminalOutcome, errors);
      let statusPersisted = false;
      try { await persist(); statusPersisted = true; }
      catch (failure) {
        const message = captureError ?? `status persistence failed: ${failure.message}`;
        if (!errors.includes(message)) errors.push(message);
      }
      if (settled) return;
      settle(terminalOutcome, errors, statusPersisted);
    };
    const watchFinalDeadline = () => {
      if (settled) return;
      const remaining = finalDeadline - performance.now();
      if (remaining > 0) {
        // Avoid Node's timer overflow at the already-supported maximum timeout.
        finalTimer = setTimeout(watchFinalDeadline, Math.min(remaining, MAX_TIMEOUT_MS));
        return;
      }
      timedOut = true;
      finishing = true;
      clearRunTimers();
      const outcome = terminalOutcome ?? rootClose ?? { cleanup: 'unverified' };
      const errors = [captureError, 'finalization deadline expired; capture, status persistence or file closure is incomplete'].filter(Boolean);
      terminalStatus(outcome, errors);
      // Best effort only: neither a pending write nor a close can delay return.
      // This terminal error is queued after every earlier snapshot, including a
      // possibly pending terminal write. Persistence remains unverified on return.
      void persist().catch(() => {});
      void closeFiles();
      settle(outcome, errors, false);
    };
    watchFinalDeadline();

    try {
      child = spawn(checked.executable, checked.args, { cwd: checked.cwd, shell: false, windowsHide: true, stdio: [stdin ? stdin.fd : 'ignore', stdout.fd, stderr.fd] });
    } catch (error) {
      void finish({ cleanup: 'spawn-failed', error: error.message });
      return;
    }
    latest = { ...latest, status: 'running', pid: child.pid };
    record();
    const drain = () => {
      if (drainPromise) return drainPromise;
      if (finishing || settled) return Promise.resolve();
      drainPromise = (async () => { try {
        for (const stream of [{ handle: stdoutReader, callback: callbacks.onStdoutChunk, offset: () => stdoutOffset, set: value => { stdoutOffset = value; } }, { handle: stderrReader, callback: callbacks.onStderrChunk, offset: () => stderrOffset, set: value => { stderrOffset = value; } }]) {
          if (!stream.callback) continue;
          const buffer = Buffer.allocUnsafe(64 * 1024);
          while (!finishing && !settled) {
            const { bytesRead } = await stream.handle.read(buffer, 0, buffer.length, stream.offset());
            if (!bytesRead || finishing || settled) break;
            stream.set(stream.offset() + bytesRead);
            await stream.callback(Buffer.from(buffer.subarray(0, bytesRead)));
          }
        }
      } catch (error) {
        if (!finishing && !settled) {
          captureError ??= `stream callback failed: ${error.message}`;
          void requestStop?.('callback-failed');
        }
      } })().finally(() => { drainPromise = null; });
      return drainPromise;
    };
    streamPoll = setInterval(() => { void drain(); }, STREAM_POLL_MS);
    requestStop = async reason => {
      if (finishing || settled || stopping || !child?.pid || child.exitCode !== null || child.signalCode !== null) return { attempted: false, reason: 'already-stopping-or-exited' };
      stopping = true;
      latest = { ...latest, status: 'cancelling', cancellationRequestedAt: new Date().toISOString(), cancellationReason: reason };
      record();
      grace = setTimeout(() => { child.unref(); void finish({ cleanup: 'unverified', error: captureError ?? `cancellation grace expired after ${reason}` }); }, Math.max(0, Math.min(checked.shutdownGraceMs, finalDeadline - performance.now())));
      grace.unref();
      const result = await taskkill(child.pid);
      if (!finishing && !settled) {
        latest = { ...latest, taskkill: result };
        record();
      }
      return result;
    };
    Promise.resolve().then(() => callbacks.onStart?.({ pid: child.pid, stop: () => requestStop('caller-request'), statusPath, stdoutPath, stderrPath })).catch(error => {
      if (!finishing && !settled) {
        captureError ??= `onStart failed: ${error.message}`;
        void requestStop('callback-failed');
      }
    });
    heartbeat = setInterval(() => {
      if (!finishing && !settled) {
        latest = { ...latest, heartbeatAt: new Date().toISOString() };
        record();
      }
    }, HEARTBEAT_MS);
    child.once('error', error => { void requestStop?.('spawn-error'); void finish({ cleanup: 'spawn-failed', error: error.message }); });
    child.once('close', (exitCode, signal) => {
      rootClose = { exitCode, signal, cleanup: timedOut || stopping ? 'closed-after-cancellation' : 'close-observed' };
      void drain().then(() => drain()).finally(() => finish(rootClose));
    });
    timeout = setTimeout(() => {
      if (finishing || settled) return;
      timedOut = true;
      latest = { ...latest, status: 'cancelling', timedOut: true };
      record();
      void requestStop('timeout');
    }, checked.timeoutMs);
  });
  return completed;
}

async function cli() {
  if (process.argv.length !== 3) fail('usage: node run-process.mjs <absolute-spec.json>');
  const specPath = process.argv[2];
  if (!isAbsolute(specPath)) fail('spec path must be absolute');
  await assertNoRedirectChain(specPath);
  let stop, cancelled = false;
  const cancel = () => { cancelled = true; void stop?.(); };
  process.on('SIGINT', cancel); process.on('SIGTERM', cancel);
  let result;
  try {
    result = await runProcess(JSON.parse(await readFile(specPath, 'utf8')), { onStart: handle => { stop = handle.stop; if (cancelled) void stop(); } });
  } finally { process.removeListener('SIGINT', cancel); process.removeListener('SIGTERM', cancel); }
  process.stdout.write(`${JSON.stringify(result)}\n`);
  const root = result.processes?.[0];
  process.exitCode = !cancelled && result.status === 'exited' && root?.exitCode === 0 && result.errors?.length === 0 && !result.timedOut && root.cleanup === 'close-observed' ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  cli().catch(error => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}
