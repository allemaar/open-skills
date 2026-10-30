// Product regression fixtures only. Retain all trees and diagnostic evidence.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { initialize, publishSkill as publishReviewed, importSkill, compareUpstream, compareVersions, contentDigest, metadata, reconcile, inventory, adoptFinish, upgrade, configure } from './library.mjs';
import { hash, tree, leaf, linkTarget, inside, createLink, removeLink } from './safety.mjs';

const root = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'skill-library-portability-'));
console.log(`Retained fixture: ${root}`);
const parent = path.join(root, 'source'); fs.mkdirSync(parent);
initialize({ folder: parent, family: 'demo', apply: true });
const library = path.join(parent, 'skills'), state = path.join(root, 'private');
const opts = { library, state }, manager = path.join(library, 'demo-skills-manager');
const configPath = path.join(library, 'library.json');
const config = JSON.parse(fs.readFileSync(configPath));
const privateRoot = path.join(state, config.id);
const encode = value => `${JSON.stringify(value, null, 2)}\n`;
const draft = path.join(root, 'draft'); fs.mkdirSync(draft);
const mdPath = path.join(draft, 'SKILL.md');
const base = '---\nname: demo-note\ndescription: Return supplied facts.\nfamily: demo\nskill-version: 1.0.0-rc.1\nupdated: 2026-10-17\n---\nUse supplied facts.\n';
for (const broken of [base.replace('name: demo-note', 'name: demo-note\nname: other'), base.replace('description: Return supplied facts.', 'description:'), base.replace('2026-10-17', '2026-02-30'), base.replace('1.0.0-rc.1', '01.0.0')]) {
  fs.writeFileSync(mdPath, broken);
  assert.throws(() => publishSkill({ ...opts, from: draft, name: 'demo-note' }), /Duplicate|description|version|date/);
}
assert.equal(metadata(base.replace('description: Return supplied facts.', 'description:')).description, '');
for (const description of ['null', '~', '# unfinished']) assert.equal(metadata(base.replace('Return supplied facts.', description)).description, '');
assert.throws(() => metadata(base.replace('description: Return supplied facts.', 'description: Valid\n"description": null')), /Duplicate/);
assert.throws(() => metadata(base.replace('description: Return supplied facts.', '"description" : Valid')), /Normalize/);
assert.throws(() => metadata(base.replace('description: Return supplied facts.', 'description: !!null null')), /unsupported/);
assert.equal(metadata(base.replace('Return supplied facts.', '"null"')).description, 'null');
for (const [a, b, expected] of [['1.0.0-rc.1', '1.0.0', -1], ['1.0.0-beta.11', '1.0.0-beta.2', 1], ['1.0.0-1', '1.0.0-a', -1], ['1.0.0-a', '1.0.0-a.1', -1], ['1.0.0+one', '1.0.0+two', 0], ['999999999999999999.0.0', '999999999999999998.0.0', 1]]) assert.equal(compareVersions(a, b), expected);
assert.throws(() => compareVersions('1.0.0-01', '1.0.0'), /Invalid/);

const opted = base.replace('updated: 2026-10-17', 'updated: 2026-10-17\nself-improvable: true');
fs.writeFileSync(mdPath, opted + '\nAfter its own task, use references/self-improvement.md for approved lesson proposals.\n');
assert.throws(() => publishSkill({ ...opts, from: draft, name: 'demo-note', 'content-reviewed': true, apply: true }), /opt-in/);
fs.mkdirSync(path.join(draft, 'references'));
fs.copyFileSync(path.join(manager, 'references/self-improvement.md'), path.join(draft, 'references/self-improvement.md'));
fs.writeFileSync(mdPath, opted + '\nAfter this skill performs its own task, load its references directory self-improvement.md only for a concrete lesson; never auto-apply.\n');
publishSkill({ ...opts, from: draft, name: 'demo-note', 'content-reviewed': true, apply: true });
const declined = path.join(root, 'declined'); fs.mkdirSync(declined);
fs.writeFileSync(path.join(declined, 'SKILL.md'), base.replace('demo-note', 'demo-declined'));
const declinedPublication = publishSkill({ ...opts, from: declined, name: 'demo-declined', 'content-reviewed': true, apply: true });
assert.equal(declinedPublication.selfImprovement.declared, false);
assert.equal(leaf(path.join(library, 'demo-declined/references/self-improvement.md')), null);
const unconfigured = reconcile(opts);
assert.equal(unconfigured.summary.state, 'unconfigured');
const currentDigest = unconfigured.sources.find(row => row.name === 'demo-note').digest;
assert.equal(currentDigest.length, 64);
assert.equal(inventory(opts).skills.find(row => row.name === 'demo-note').selfImprovement, 'declared-opt-in');
fs.writeFileSync(mdPath, fs.readFileSync(mdPath, 'utf8').replace('1.0.0-rc.1', '1.0.0'));
publishSkill({ ...opts, from: draft, name: 'demo-note', expected: currentDigest, 'content-reviewed': true, apply: true });
console.log('PASS malformed metadata refusal, semantic versions, opt-in wiring and unconfigured source update');

for (const operation of ['publish', 'import', 'metadata']) {
  const source = path.join(root, `changing-${operation}`); fs.mkdirSync(source);
  const md = path.join(source, 'SKILL.md'), auxiliary = path.join(source, 'aux.txt');
  const correct = base.replace('demo-note', `demo-race-${operation}`);
  const originalText = operation === 'metadata' ? correct.replace(`demo-race-${operation}`, 'wrong-name') : correct;
  fs.writeFileSync(md, originalText); fs.writeFileSync(auxiliary, 'reviewed A');
  const reviewedDraft = operation === 'import' || operation === 'metadata' ? null : publishReviewed({ ...opts, from: source, name: `demo-race-${operation === 'metadata' ? 'metadata' : operation}` });
  const read = fs.readFileSync; let mdReads = 0, candidateReads = 0;
  fs.readFileSync = function (p, ...args) {
    if (p === md && ++mdReads === 2 && operation === 'metadata') {
      fs.writeFileSync(md, correct); const bytes = read.call(this, p, ...args); fs.writeFileSync(md, originalText); return bytes;
    }
    const bytes = read.call(this, p, ...args);
    if (p === md && mdReads === 2 && operation !== 'metadata') fs.writeFileSync(auxiliary, 'unreviewed B');
    const normalized = typeof p === 'string' ? p.replaceAll('\\', '/') : '';
    if (normalized.endsWith('/aux.txt') && normalized.includes(operation === 'import' ? '/.library/candidates/' : '/.library/publication-candidates/') && ++candidateReads === 2) fs.writeFileSync(auxiliary, 'reviewed A');
    return bytes;
  };
  try {
    const selected = { ...opts, from: source, name: `demo-race-${operation}`, apply: true, ...(reviewedDraft ? { 'draft-expected': reviewedDraft.draftDigest } : {}) };
    assert.throws(() => operation === 'import' ? importSkill({ ...selected, mode: 'variant', origin: 'fixture', revision: 'A' }) : publishSkill({ ...selected, 'content-reviewed': true }), /reviewed snapshot|captured snapshot|draft bytes changed/);
  } finally { fs.readFileSync = read; }
}
console.log('PASS publication/import copy binding and metadata snapshot binding under A-B-A changes');

const external = path.join(root, 'external'); fs.mkdirSync(external);
const incoming = path.join(external, 'incoming'); fs.mkdirSync(incoming);
fs.writeFileSync(path.join(incoming, 'SKILL.md'), '---\nname: external\ndescription: Return facts.\n---\nUse facts.\n');
fs.writeFileSync(path.join(incoming, 'asset.txt'), 'preserve bytes');
const imported = importSkill({ ...opts, from: incoming, name: 'demo-external', mode: 'variant', origin: 'fixture', revision: 'v1', apply: true });
publishSkill({ ...opts, from: imported.candidate, name: 'demo-external', 'content-reviewed': true, apply: true });
const provPath = path.join(library, 'demo-external/provenance.json');
const provBytes = fs.readFileSync(provPath), provenance = JSON.parse(provBytes);
assert.equal(provenance.originalContentDigest, contentDigest(provenance.originalFiles));
const legacy = { ...provenance, originalFiles: provenance.originalFiles.map(row => ({ ...row, mode: process.platform === 'win32' ? row.type === 'directory' ? 0o755 : 0o644 : 0o666 })) };
legacy.originalDigest = hash(encode(legacy.originalFiles));
delete legacy.originalContentDigest; delete legacy.originalPlatform; delete legacy.digestBasis;
fs.writeFileSync(provPath, encode(legacy));
const compared = compareUpstream({ ...opts, name: 'demo-external', from: incoming });
assert.equal(compared.ancestry.provenanceBasis, 'derived-from-verified-legacy-snapshot');
assert.ok(compared.ancestry.permissionChanges.length);
assert.equal(compared.files.find(row => row.path === 'asset.txt').state, 'unchanged');
assert.equal(compared.counts.conflict || 0, 0);
assert.deepEqual(fs.readFileSync(provPath), Buffer.from(encode(legacy)), 'comparison does not silently migrate provenance');
fs.writeFileSync(provPath, provBytes);
const asset = path.join(library, provenance.baseline, 'asset.txt');
fs.writeFileSync(asset, 'changed bytes');
assert.throws(() => compareUpstream({ ...opts, name: 'demo-external', from: incoming }), /baseline differs/);
fs.writeFileSync(asset, 'preserve bytes');
console.log('PASS simulated cross-platform mode normalization, legacy ancestry and damaged-content refusal');

const configBytes = fs.readFileSync(configPath);
const managedRel = 'templates/reference.md', managedPath = path.join(manager, managedRel);
const retained = path.join(root, 'retained-template.md');
fs.renameSync(managedPath, retained);
assert.equal(upgrade(opts).plan.find(row => row.path === managedRel).state, 'missing-managed-conflict');
assert.throws(() => upgrade({ ...opts, apply: true }), /reviewed merge/);
fs.renameSync(retained, managedPath);
fs.writeFileSync(configPath, encode({ ...config, generator: { ...config.generator, version: '9.0.0' } }));
assert.throws(() => upgrade(opts), /downgrade/);
fs.writeFileSync(configPath, configBytes);
const oldBytes = fs.readFileSync(managedPath);
fs.writeFileSync(path.join(library, '.library/generator-base', managedRel), 'older template');
const changed = JSON.parse(configBytes); changed.managed[managedRel] = hash('older template');
fs.writeFileSync(managedPath, 'older template'); fs.writeFileSync(configPath, encode(changed));
const preview = upgrade(opts);
assert.equal(preview.plan.find(row => row.path === managedRel).state, 'update');
assert.throws(() => upgrade({ ...opts, apply: true, expected: '0'.repeat(64) }), /PLAN_DIGEST/);
upgrade({ ...opts, apply: true, expected: preview.planDigest });
assert.deepEqual(fs.readFileSync(managedPath), oldBytes);
console.log('PASS missing managed file, downgrade and stale-plan refusal; reviewed file upgrade');

if (process.platform === 'win32' && leaf('D:/agent-spaces') && fs.lstatSync(root).dev !== fs.lstatSync('D:/agent-spaces').dev) {
  const recovery = path.join('D:/agent-spaces', `uncreated-adoption-${path.basename(root)}`, 'recovery');
  const adoption = { ...opts, name: 'demo-external', from: incoming, recovery };
  assert.equal(adoptFinish(adoption).sameDevice, false);
  assert.throws(() => adoptFinish({ ...adoption, apply: true, confirm: incoming, 'callers-reviewed': true }), /same-volume/);
  assert.equal(leaf(path.dirname(recovery)), null);
  assert.equal(leaf(path.join(library, '.library/adoptions/demo-external')), null);
  assert.equal(leaf(path.join(library, '.library/mutation.lock')), null);
  assert.ok(fs.statSync(incoming).isDirectory());
  console.log('PASS actual distinct-device adoption preflight refuses before shared bookkeeping');
}
const pendingDir = path.join(library, '.library/adoptions/demo-external'); fs.mkdirSync(pendingDir, { recursive: true });
const dependency = path.join(pendingDir, `${'a'.repeat(24)}.json`);
fs.writeFileSync(dependency, encode({ schema: 1, id: 'a'.repeat(24), name: 'demo-external', state: 'pending' }));
assert.throws(() => adoptFinish({ ...opts, name: 'demo-external', from: incoming }), /Pending shared adoption/);
// Relocate the isolated synthetic marker, retaining it; this is not a live recovery procedure.
fs.renameSync(dependency, path.join(root, 'retained-synthetic-dependency.json'));
adoptFinish({ ...opts, name: 'demo-external', from: incoming, apply: true, confirm: incoming, 'callers-reviewed': true });
assert.equal(linkTarget(incoming), path.join(library, 'demo-external'));
assert.throws(() => adoptFinish({ ...opts, name: 'demo-external', from: incoming }), /Recorded adoption/);
console.log('PASS pending/repeated adoption refusal and actual same-volume adoption');

const helper = path.join(manager, 'scripts/library.mjs');
const standalone = JSON.parse(execFileSync(process.execPath, [helper, 'status', '--library', library, '--state', path.join(root, 'fresh-private')], { encoding: 'utf8', windowsHide: true, timeout: 60_000 }));
assert.equal(standalone.summary.state, 'unconfigured');
assert.ok(standalone.sources.some(row => row.name === 'demo-note' && row.digest));

const staleDraft = path.join(root, 'stale-reviewed-draft'); fs.mkdirSync(staleDraft);
fs.writeFileSync(path.join(staleDraft, 'SKILL.md'), base.replace('demo-note', 'demo-stale').replace('1.0.0-rc.1', '1.0.0'));
const staleOptions = { ...opts, from: staleDraft, name: 'demo-stale', 'content-reviewed': true };
const reviewed = publishReviewed(staleOptions);
assert.throws(() => publishReviewed({ ...staleOptions, apply: true }), /draft-expected/);
fs.writeFileSync(path.join(staleDraft, 'added-after-review.txt'), 'unreviewed');
assert.throws(() => publishReviewed({ ...staleOptions, 'draft-expected': reviewed.draftDigest, apply: true }), /draft bytes changed/);
assert.equal(leaf(path.join(library, 'demo-stale')), null);
console.log('PASS reviewed draft digest is required and post-preview additions never activate');

const repairDraft = path.join(root, 'metadata-repair-draft'); fs.cpSync(path.join(library, 'demo-note'), repairDraft, { recursive: true });
fs.writeFileSync(path.join(repairDraft, 'SKILL.md'), fs.readFileSync(path.join(repairDraft, 'SKILL.md'), 'utf8').replace('skill-version: 1.0.0', 'skill-version: 1.0.1'));
const damaged = path.join(library, 'demo-damaged'); fs.mkdirSync(damaged); fs.writeFileSync(path.join(damaged, 'SKILL.md'), 'invalid sibling');
const activeMd = path.join(library, 'demo-note/SKILL.md');
fs.writeFileSync(activeMd, fs.readFileSync(activeMd, 'utf8').replace('skill-version: 1.0.0', 'skill-version: oops'));
assert.throws(() => reconcile(opts), /version|metadata|frontmatter/i);
const repairOptions = { ...opts, from: repairDraft, name: 'demo-note', 'content-reviewed': true };
const repairPreview = publishReviewed(repairOptions);
assert.ok(repairPreview.currentMetadataError);
const repairApply = { ...repairOptions, expected: repairPreview.currentDigest, 'draft-expected': repairPreview.draftDigest, apply: true };
assert.throws(() => publishReviewed(repairApply), /repair-metadata/);
const repaired = publishReviewed({ ...repairApply, 'repair-metadata': true });
assert.match(fs.readFileSync(path.join(repaired.recovery, 'SKILL.md'), 'utf8'), /skill-version: oops/);
assert.match(fs.readFileSync(activeMd, 'utf8'), /skill-version: 1.0.1/);
fs.renameSync(damaged, path.join(root, 'retained-damaged-sibling'));
console.log('PASS selected-skill repair preview bypasses malformed siblings; explicit repair preserves old complete tree');

const ancestor = path.join(library, '.library/generator-base/templates/reference.md');
const ancestorBytes = fs.readFileSync(ancestor), managerBytes = fs.readFileSync(path.join(manager, 'templates/reference.md'));
fs.writeFileSync(ancestor, 'damaged baseline');
assert.equal(upgrade(opts).plan.find(row => row.path === 'templates/reference.md').state, 'baseline-drift-conflict');
assert.throws(() => upgrade({ ...opts, apply: true }), /reviewed merge/);
assert.deepEqual(fs.readFileSync(path.join(manager, 'templates/reference.md')), managerBytes);
fs.writeFileSync(ancestor, 'retained older ancestor');
const olderConfig = JSON.parse(fs.readFileSync(configPath)); olderConfig.managed['templates/reference.md'] = hash('retained older ancestor');
fs.writeFileSync(configPath, encode(olderConfig));
const ancestorPreview = upgrade(opts);
assert.equal(ancestorPreview.plan.find(row => row.path === 'templates/reference.md').state, 'unchanged');
const ancestorUpgrade = upgrade({ ...opts, expected: ancestorPreview.planDigest, apply: true });
assert.equal(fs.readFileSync(path.join(ancestorUpgrade.recovery, 'baselines/templates/reference.md'), 'utf8'), 'retained older ancestor');
assert.deepEqual(JSON.parse(fs.readFileSync(path.join(ancestorUpgrade.recovery, 'library.json'))), olderConfig);
assert.deepEqual(fs.readFileSync(ancestor), ancestorBytes);
console.log('PASS baseline drift refuses upgrade and unchanged-manager rows retain their old ancestor/config');

const aliasRoot = path.join(root, 'alias-harness/skills'); fs.mkdirSync(aliasRoot, { recursive: true });
configure({ ...opts, targets: JSON.stringify([aliasRoot]), apply: true });
reconcile({ ...opts, apply: true });
const caller = path.join(aliasRoot, 'external'); fs.cpSync(path.join(library, provenance.baseline), caller, { recursive: true });
const aliasOptions = { ...opts, from: caller, name: 'demo-external', recovery: path.join(root, 'alias-original-recovery') };
assert.equal(adoptFinish(aliasOptions).naming.mismatch, true);
assert.equal(adoptFinish(aliasOptions).duplicateCanonical, path.join(aliasRoot, 'demo-external'));
assert.throws(() => adoptFinish({ ...aliasOptions, apply: true, confirm: caller, 'callers-reviewed': true }), /duplicate/);
removeLink(path.join(aliasRoot, 'demo-external'), path.join(library, 'demo-external'));
adoptFinish({ ...aliasOptions, apply: true, confirm: caller, 'callers-reviewed': true });
createLink(path.join(library, 'demo-external'), path.join(aliasRoot, 'demo-external'));
assert.equal(reconcile(opts).summary.state, 'attention-required');
assert.ok(reconcile(opts).plan.some(row => row.state === 'adopted-alias-collision'));
console.log('PASS adoption warns before duplicate activation; existing alias/canonical duplicates are blockers');

const caseAlias = library.replace(/source/, 'SOURCE');
if (fs.existsSync(caseAlias)) {
  assert.ok(inside(library, path.join(caseAlias, 'uncreated-private')));
  assert.throws(() => configure({ ...opts, state: path.join(caseAlias, 'private'), targets: JSON.stringify([aliasRoot]), apply: true }), /outside library/);
  console.log('PASS actual case-alias shared/private separation on this filesystem');
} else console.log('NOT OBSERVED case-insensitive-volume behavior on this filesystem');
const sharedLock = path.join(library, '.library/mutation.lock');
fs.writeFileSync(sharedLock, encode({ schema: 1, id: 'b'.repeat(24), operation: 'publish', state: 'running', created: new Date().toISOString() }));
assert.equal(reconcile(opts).summary.state, 'mutation-pending');
assert.equal(inventory(opts).pendingMutations.length, 1);
assert.equal(leaf(path.join(privateRoot, 'mutation.lock')), null);
console.log('PASS standalone source status and retained-lock visibility; conversational execution remains unobserved');

// Fixture setup follows the public preview/apply contract. Deliberate stale-draft cases call publishReviewed directly.
function publishSkill(options) {
  if (!options.apply || options['draft-expected']) return publishReviewed(options);
  const preview = publishReviewed({ ...options, apply: false });
  return publishReviewed({ ...options, 'draft-expected': preview.draftDigest });
}
