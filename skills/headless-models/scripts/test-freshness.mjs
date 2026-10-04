import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {checkFreshness} from './check-model-freshness.mjs';
const state=JSON.parse(readFileSync(new URL('../references/model-state.json',import.meta.url)));
const anchor=Date.parse(state.sources[0].lastVerifiedAt);
// Align fixture source checks to isolate each invalidation from later real checks.
for (const source of state.sources) { source.lastVerifiedAt=new Date(anchor).toISOString(); source.lastAttemptedAt=source.lastVerifiedAt; }
assert.equal(checkFreshness(state,anchor+1000).due,false);
assert.equal(checkFreshness(state,anchor+(state.policy.reminderDays-1)*86400000).due,false);
assert.equal(checkFreshness(state,anchor+state.policy.reminderDays*86400000).due,true);
const failed=structuredClone(state);failed.sources[0].lastAttemptOutcome='failed';assert.equal(checkFreshness(failed,anchor+1000).due,true);assert.equal(failed.sources[0].lastVerifiedAt,state.sources[0].lastVerifiedAt);
const missing=structuredClone(state);delete missing.sources[0].lastVerifiedAt;assert.equal(checkFreshness(missing,anchor+1000).due,true);
const future=structuredClone(state);future.sources[0].lastAttemptedAt=new Date(anchor+5000).toISOString();assert.equal(checkFreshness(future,anchor+1000).due,true);
const changed=structuredClone(state);changed.sources[0].invalidated=true;assert.equal(checkFreshness(changed,anchor+1000).due,true);
console.log(`freshness: current, ${state.policy.reminderDays}-day boundary, failed refresh, missing/future dates, invalidation passed`);
