// headless-family:projection
import { readFileSync, realpathSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

export function checkFreshness(state, now = Date.now()) {
  const reasons = [];
  if (state?.schemaVersion !== 1 || !Number.isFinite(now) || !Number.isInteger(state?.policy?.reminderDays) || state.policy.reminderDays < 1 || !Array.isArray(state.sources) || !state.sources.length) throw Error('Invalid model evidence state');
  const ids = new Set();
  const date = value => { if (typeof value !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(value)) return NaN; const parsed = Date.parse(value); return Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0,10) === value.slice(0,10) ? parsed : NaN; };
  for (const source of state.sources) {
    if (typeof source.id !== 'string' || !source.id || ids.has(source.id)) throw Error('Invalid/duplicate source identity');
    ids.add(source.id);
    const verified = date(source.lastVerifiedAt), attempted = date(source.lastAttemptedAt);
    const published = source.sourcePublishedAt === null ? null : date(source.sourcePublishedAt);
    if (!Number.isFinite(verified) || !Number.isFinite(attempted) || verified > now || attempted > now || attempted < verified || (published !== null && (!Number.isFinite(published) || published > now))) reasons.push(`${source.id}: missing, invalid or future timestamps`);
    else if (now - verified >= state.policy.reminderDays * 86400000) reasons.push(`${source.id}: reminder interval reached`);
    if (source.lastAttemptOutcome !== 'success') reasons.push(`${source.id}: last attempt ${source.lastAttemptOutcome || 'unknown'}`);
    if (source.invalidated !== false) reasons.push(`${source.id}: invalidated or unknown invalidation state`);
  }
  return { due: reasons.length > 0, reminderDays: state.policy.reminderDays, checkedAt: new Date(now).toISOString(), reasons };
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(resolve(process.argv[1]))).href) {
  try {
    if (process.argv.length !== 3 || !isAbsolute(process.argv[2])) throw Error('Usage: node check-model-freshness.mjs <absolute-model-state.json>');
    const bytes = readFileSync(process.argv[2]);
    const result = checkFreshness(JSON.parse(bytes));
    console.log(JSON.stringify({ ...result, snapshot: createHash('sha256').update(bytes).digest('hex') }));
    process.exitCode = result.due ? 2 : 0;
  } catch (error) {
    console.log(JSON.stringify({ due: true, reasons: [error.message], invalid: true }));
    process.exitCode = 1;
  }
}
