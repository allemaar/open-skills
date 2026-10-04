import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const VERSION_TIMEOUT_MS = 5_000;
const HELP_TIMEOUT_MS = 5_000;
const QUERY_TIMEOUT_MS = 30_000;
const CLEANUP_GRACE_MS = 3_000;
const MAX_OUTPUT_BYTES = 8 * 1024 * 1024;

function errorMessage(value) {
  return value instanceof Error ? value.message : String(value);
}

function activitySummary(value) {
  const summary = {};
  for (const key of ['lifetimeTokens', 'peakDailyTokens', 'longestRunningTurnSec', 'currentStreakDays', 'longestStreakDays']) {
    if (Number.isFinite(value?.summary?.[key])) summary[key] = value.summary[key];
  }
  return { summary };
}

function isoFromSeconds(value) {
  return Number.isFinite(value) ? new Date(value * 1000).toISOString() : null;
}

function remainingPercent(value) {
  return Number.isFinite(value) ? Math.max(0, Math.min(100, 100 - value)) : null;
}

function normalizeWindow(bucket, label, raw, nowMs) {
  if (!raw || typeof raw !== 'object') return null;
  const usedPercent = Number.isFinite(raw.usedPercent) ? raw.usedPercent : null;
  const resetsAtSeconds = Number.isFinite(raw.resetsAt) ? raw.resetsAt : null;
  const windowMins = Number.isFinite(raw.windowDurationMins) ? raw.windowDurationMins : null;
  if (usedPercent === null || resetsAtSeconds === null || windowMins === null || windowMins <= 0 || !Number.isFinite(new Date(resetsAtSeconds * 1000).getTime())) return null;
  return {
    bucket: label ? `${bucket}:${label}` : bucket,
    windowMins,
    usedPercent,
    remainingPercent: remainingPercent(usedPercent),
    resetsAt: isoFromSeconds(resetsAtSeconds),
    resetInSeconds: resetsAtSeconds === null ? null : Math.max(0, Math.ceil(resetsAtSeconds - nowMs / 1000)),
  };
}

export function normalizeCodexRateLimits(result, nowMs = Date.now()) {
  const byId = result?.rateLimitsByLimitId;
  const entries = byId && typeof byId === 'object'
    ? Object.entries(byId)
    : result?.rateLimits && typeof result.rateLimits === 'object'
      ? [[result.rateLimits.limitId || 'codex', result.rateLimits]]
      : [];
  return entries.flatMap(([fallbackBucket, limit]) => {
    const bucket = typeof limit?.limitId === 'string' ? limit.limitId : fallbackBucket;
    return [normalizeWindow(bucket, 'primary', limit?.primary, nowMs), normalizeWindow(bucket, 'secondary', limit?.secondary, nowMs)]
      .filter(Boolean);
  });
}

export function parseAgyUsage(stdout, nowMs = Date.now()) {
  const rows = stdout.trim().split(/\r?\n/).filter(Boolean);
  if (!rows.length) throw new Error('agy returned no usage rows');
  const windows = rows.map((row) => {
    const columns = row.split('\t');
    if (columns.length !== 4) throw new Error('agy usage schema must contain exactly four tab-separated columns');
    const [bucket, label, percentText, resetText] = columns;
    const match = /^(\d{1,3})%$/.exec(percentText);
    const usedPercent = match ? 100 - Number(match[1]) : NaN;
    const resetMs = Date.parse(resetText);
    const windowMins = label === 'Five Hour Limit Remaining' ? 300 : label === 'Weekly Limit Remaining' ? 10_080 : null;
    if (!bucket || windowMins === null || !Number.isFinite(usedPercent) || usedPercent < 0 || usedPercent > 100 || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(resetText) || !Number.isFinite(resetMs)) {
      throw new Error('agy usage schema contains an unknown bucket, window, percent, or reset timestamp');
    }
    return {
      bucket: `${bucket}: ${label}`,
      windowMins,
      usedPercent,
      remainingPercent: Number(match[1]),
      resetsAt: new Date(resetMs).toISOString(),
      resetInSeconds: Math.max(0, Math.ceil((resetMs - nowMs) / 1000)),
    };
  });
  return windows;
}

async function assertNoLinkPath(target, kind) {
  if (!path.isAbsolute(target)) throw new Error(`${kind} must be an absolute path`);
  const resolved = path.resolve(target);
  const real = await fs.realpath(resolved);
  if (path.normalize(real).toLowerCase() !== path.normalize(resolved).toLowerCase()) {
    throw new Error(`${kind} must not traverse a link or redirect`);
  }
  const stat = await fs.lstat(resolved);
  if (stat.isSymbolicLink()) throw new Error(`${kind} must not be a symbolic link`);
  return { resolved, stat };
}

async function assertInputs(executable, outputDirectory) {
  const executableInfo = await assertNoLinkPath(executable, 'executable');
  if (!executableInfo.stat.isFile()) throw new Error('executable must be a regular file');
  const outputInfo = await assertNoLinkPath(outputDirectory, 'outputDirectory');
  if (!outputInfo.stat.isDirectory()) throw new Error('outputDirectory must be an existing directory');
  return { executable: executableInfo.resolved, outputDirectory: outputInfo.resolved };
}

async function writeRaw(outputDirectory, name, stdout, stderr) {
  await Promise.all([
    fs.writeFile(path.join(outputDirectory, `${name}.stdout`), stdout, { encoding: 'utf8', flag: 'wx' }),
    fs.writeFile(path.join(outputDirectory, `${name}.stderr`), stderr, { encoding: 'utf8', flag: 'wx' }),
  ]);
}

function stopProcess(child) {
  if (!child.pid || child.exitCode !== null || child.signalCode !== null) return 'already-exited';
  try {
    if (process.platform === 'win32') {
      const taskkill = spawn(process.env.SystemRoot ? path.join(process.env.SystemRoot, 'System32', 'taskkill.exe') : 'taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
      taskkill.once('error', () => {});
      const helperTimer = setTimeout(() => {
        try { taskkill.kill(); } catch { /* helper already stopped */ }
      }, CLEANUP_GRACE_MS);
      helperTimer.unref();
      taskkill.once('close', () => clearTimeout(helperTimer));
      taskkill.unref();
      return 'taskkill-tree-requested';
    }
    process.kill(-child.pid, 'SIGTERM');
    return 'process-group-sigterm-requested';
  } catch {
    return 'cleanup-unverified';
  }
}

async function runProcess(executable, args, timeoutMs, outputDirectory, name, onStart) {
  const startedAt = new Date().toISOString();
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let outputLimited = false;
    let timedOut = false;
    let cleanup = 'close-observed';
    let settled = false;
    let timer;
    let grace;
    const child = spawn(executable, args, {
      detached: process.platform !== 'win32',
      shell: false,
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const processInfo = { pid: child.pid ?? null, startedAt, exitCode: null, cleanup };
    onStart?.(child);
    const append = (current, data) => {
      const text = data.toString();
      const remaining = MAX_OUTPUT_BYTES - Buffer.byteLength(current);
      if (remaining <= 0) {
        outputLimited = true;
        return current;
      }
      if (Buffer.byteLength(text) > remaining) {
        outputLimited = true;
        return current + Buffer.from(text).subarray(0, remaining).toString();
      }
      return current + text;
    };
    child.stdout.on('data', (data) => { stdout = append(stdout, data); });
    child.stderr.on('data', (data) => { stderr = append(stderr, data); });
    child.stdin.on('error', (error) => { stderr += `\nstdin: ${errorMessage(error)}`; });
    const finish = async (exitCode, forced = false) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearTimeout(grace);
      processInfo.exitCode = Number.isInteger(exitCode) ? exitCode : null;
      if (forced && cleanup === 'close-observed') cleanup = 'cleanup-unverified';
      processInfo.cleanup = cleanup;
      try { child.stdin.destroy(); } catch { /* nothing left to close */ }
      if (forced) {
        try { child.stdout.destroy(); child.stderr.destroy(); child.unref(); } catch { /* cleanup state remains explicit */ }
      }
      try {
        await writeRaw(outputDirectory, name, stdout, stderr);
        resolve({ stdout, stderr, timedOut, outputLimited, process: processInfo, writeError: null });
      } catch (error) {
        resolve({ stdout, stderr, timedOut, outputLimited, process: processInfo, writeError: errorMessage(error) });
      }
    };
    child.once('error', (error) => {
      stderr += `\nspawn: ${errorMessage(error)}`;
      finish(null);
    });
    child.once('close', (code) => finish(code));
    timer = setTimeout(() => {
      timedOut = true;
      cleanup = stopProcess(child);
      grace = setTimeout(() => finish(null, true), CLEANUP_GRACE_MS);
    }, timeoutMs);
  });
}

async function verifyExecutable(executable, outputDirectory, processes) {
  const version = await runProcess(executable, ['--version'], VERSION_TIMEOUT_MS, outputDirectory, 'verify-version');
  processes.push(version.process);
  const help = await runProcess(executable, ['--help'], HELP_TIMEOUT_MS, outputDirectory, 'verify-help');
  processes.push(help.process);
  if (version.timedOut || help.timedOut || version.outputLimited || help.outputLimited || version.writeError || help.writeError || version.process.exitCode !== 0 || help.process.exitCode !== 0 || version.process.cleanup !== 'close-observed' || help.process.cleanup !== 'close-observed') {
    throw new Error('executable verification failed');
  }
  return version.stdout.trim().split(/\r?\n/)[0] || null;
}

async function readCodex(executable, outputDirectory, options, result) {
  const messages = new Map();
  let buffer = '';
  let protocolBytes = 0;
  let protocolLimited = false;
  let child;
  const run = await runProcess(executable, ['app-server', '--stdio'], options.timeoutMs, outputDirectory, 'codex-query', (started) => {
    child = started;
    const send = (message) => child.stdin.write(`${JSON.stringify(message)}\n`);
    child.stdout.on('data', (data) => {
      protocolBytes += data.length;
      if (protocolBytes > MAX_OUTPUT_BYTES) {
        protocolLimited = true;
        buffer = '';
        child.stdin.end();
        return;
      }
      buffer += data;
      for (;;) {
        const newline = buffer.indexOf('\n');
        if (newline < 0) break;
        const line = buffer.slice(0, newline);
        buffer = buffer.slice(newline + 1);
        try {
          const message = JSON.parse(line);
          if ([1, 2, 3].includes(message.id)) messages.set(message.id, message);
          if (message.id === 1) {
            if (message.error) child.stdin.end();
            else {
              send({ method: 'initialized', params: {} });
              send({ method: 'account/rateLimits/read', id: 2 });
            }
          } else if (message.id === 2) {
            if (options.history) send({ method: 'account/usage/read', id: 3 });
            else child.stdin.end();
          } else if (message.id === 3) {
            child.stdin.end();
          }
        } catch { /* raw protocol diagnostics remain in the output file */ }
      }
    });
    send({ method: 'initialize', id: 1, params: { clientInfo: { name: 'headless-usage', title: 'Headless Usage', version: '1.0.0' } } });
  });
  result.processes.push(run.process);
  const quota = messages.get(2);
  if (run.timedOut || run.outputLimited || protocolLimited || run.writeError) throw new Error(`codex quota query failed: ${run.writeError || (run.outputLimited || protocolLimited ? 'output limit exceeded' : 'timed out')}`);
  if (run.process.exitCode !== 0 || run.process.cleanup !== 'close-observed') throw new Error('codex quota query did not exit cleanly');
  if (!quota?.result || quota.error) throw new Error('codex quota query failed; see private protocol diagnostics');
  result.windows = normalizeCodexRateLimits(quota.result);
  const count = quota.result.rateLimitResetCredits?.availableCount;
  result.credits = Number.isFinite(count) ? { availableCount: count } : null;
  if (options.history) {
    const usage = messages.get(3);
    if (usage?.result) result.activity = activitySummary(usage.result);
    else result.errors.push('codex activity query did not return a result');
  }
}

async function readAgy(executable, outputDirectory, options, result) {
  const run = await runProcess(executable, ['-p', '/usage', '--print-timeout', '15s'], options.timeoutMs, outputDirectory, 'agy-query');
  result.processes.push(run.process);
  if (run.timedOut || run.outputLimited || run.writeError) throw new Error(`agy usage query failed: ${run.writeError || (run.outputLimited ? 'output limit exceeded' : 'timed out')}`);
  if (run.process.exitCode !== 0 || run.process.cleanup !== 'close-observed') throw new Error(`agy usage query did not exit cleanly (${run.process.exitCode})`);
  result.windows = parseAgyUsage(run.stdout);
}

export async function readDirect(provider, executable, outputDirectory, { timeoutMs = QUERY_TIMEOUT_MS, history = false } = {}) {
  const result = {
    provider,
    transport: 'cli',
    source: 'direct',
    status: 'unavailable',
    runtimeVersion: null,
    observedAt: null,
    windows: [],
    credits: null,
    activity: null,
    errors: [],
    processes: [],
  };
  if (!['codex', 'agy'].includes(provider)) {
    result.errors.push(`unsupported provider: ${provider}`);
    return result;
  }
  if (process.platform !== 'win32') {
    result.errors.push('direct usage reader is unavailable on this platform because Windows process-tree cancellation is required');
    return result;
  }
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > QUERY_TIMEOUT_MS) {
    result.errors.push('timeoutMs must be an integer between 1 and 30000');
    return result;
  }
  try {
    const inputs = await assertInputs(executable, outputDirectory);
    result.runtimeVersion = await verifyExecutable(inputs.executable, inputs.outputDirectory, result.processes);
    if (provider === 'codex') await readCodex(inputs.executable, inputs.outputDirectory, { timeoutMs, history }, result);
    else await readAgy(inputs.executable, inputs.outputDirectory, { timeoutMs }, result);
    result.observedAt = new Date().toISOString();
    result.status = result.windows.length && result.processes.every((entry) => entry.cleanup === 'close-observed') ? 'live' : 'unavailable';
    if (!result.windows.length) result.errors.push('provider returned no recognized quota windows');
  } catch (error) {
    result.status = 'error';
    result.errors.push(errorMessage(error));
  }
  return result;
}
