// Windows-only supervisor. Observes tool calls after dispatch; not a sandbox.
import { runProcess } from './run-process.mjs';
import { createHash } from 'node:crypto';
import { lstatSync, realpathSync, readFileSync, mkdirSync, openSync, writeSync, closeSync, writeFileSync } from 'node:fs';
import { resolve, dirname, isAbsolute, extname } from 'node:path';
import { StringDecoder } from 'node:string_decoder';

function noLinks(file, missingLeaf = false) {
  let p = resolve(file), first = true;
  for (;;) {
    try {
      if (lstatSync(p).isSymbolicLink() || resolve(realpathSync(p)).toLowerCase() !== p.toLowerCase()) throw Error(`Redirect in path: ${p}`);
    }
    catch (e) { if (!(first && missingLeaf && e.code === 'ENOENT')) throw e; }
    first = false;
    const parent = dirname(p); if (parent === p) break; p = parent;
  }
}
function absolute(value, label) {
  if (typeof value !== 'string' || !isAbsolute(value)) throw Error(`${label} must be absolute`);
  return resolve(value);
}
const norm = p => resolve(p).toLowerCase();
const slashPath = p => p.replaceAll('\\', '/');
function exactLauncherCommand(executable, launcherPath) {
  const nativeExecutable = slashPath(executable), launcher = slashPath(launcherPath);
  if (/["$`\r\n\0]/.test(nativeExecutable) || /["$`\r\n\0]/.test(launcher)) throw Error('Launcher paths contain unsupported PowerShell interpolation or control characters');
  return `& "${nativeExecutable}" "${launcher}"`;
}
function launcherSha256(launcherPath) {
  noLinks(launcherPath);
  if (!lstatSync(launcherPath).isFile()) throw Error('launcherPath must be a regular file');
  return createHash('sha256').update(readFileSync(launcherPath)).digest('hex');
}
function prepareAllowedCommand(value, cwd) {
  if (value === undefined) return null;
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error('allowedCommandCall must be an object');
  const fields = new Set(['commandLine', 'expectedCwd', 'launcherPath', 'launcherExecutable', 'expectedLauncherSha256', 'maxLaunches']);
  if (Object.keys(value).some(key => !fields.has(key))) throw Error('allowedCommandCall has an unsupported field');
  if (value.maxLaunches !== 1) throw Error('allowedCommandCall.maxLaunches must be exactly 1');
  const expectedCwd = absolute(value.expectedCwd, 'allowedCommandCall.expectedCwd');
  if (norm(expectedCwd) !== norm(cwd)) throw Error('allowedCommandCall.expectedCwd must equal cwd');
  const launcherPath = absolute(value.launcherPath, 'allowedCommandCall.launcherPath');
  const launcherExecutable = absolute(value.launcherExecutable, 'allowedCommandCall.launcherExecutable');
  noLinks(launcherPath); noLinks(launcherExecutable);
  if (extname(launcherPath).toLowerCase() !== '.mjs' || !lstatSync(launcherPath).isFile()) throw Error('allowedCommandCall.launcherPath must be a regular .mjs file');
  if (extname(launcherExecutable).toLowerCase() !== '.exe' || !lstatSync(launcherExecutable).isFile()) throw Error('allowedCommandCall.launcherExecutable must be a native .exe file');
  if (typeof value.expectedLauncherSha256 !== 'string' || !/^[a-fA-F0-9]{64}$/.test(value.expectedLauncherSha256)) throw Error('allowedCommandCall.expectedLauncherSha256 must be a SHA-256 hex digest');
  const expectedLauncherSha256 = value.expectedLauncherSha256.toLowerCase();
  if (launcherSha256(launcherPath) !== expectedLauncherSha256) throw Error('allowedCommandCall launcher hash mismatch');
  const commandLine = exactLauncherCommand(launcherExecutable, launcherPath);
  if (value.commandLine !== commandLine) throw Error('allowedCommandCall.commandLine must exactly equal the deterministic launcher command');
  return { commandLine, expectedCwd, launcherPath, launcherExecutable, expectedLauncherSha256, maxLaunches: 1 };
}
function preflight() {
if (process.platform !== 'win32') throw Error('Use a verified native supervisor on this OS.');
if (process.argv.length !== 3) throw Error('Usage: node run-windows.mjs <absolute-spec.json>');
const specPath = absolute(process.argv[2], 'spec'); noLinks(specPath);
const s = JSON.parse(readFileSync(specPath, 'utf8'));
if (!s || typeof s !== 'object' || Array.isArray(s)) throw Error('Spec must be an object');
const specFields = new Set(['executable', 'cwd', 'outputDirectory', 'promptFile', 'model', 'timeoutMs', 'printTimeoutSeconds', 'shutdownGraceMs', 'acknowledgeUnisolatedTools', 'addWorkspace', 'allowedFileCalls', 'allowedCommandCall', 'transport']);
if (Object.keys(s).some(key => !specFields.has(key))) throw Error('Unsupported spec field; do not silently remove requested capabilities');
if (s.transport !== undefined && s.transport !== 'cli') throw Error('unsupported-transport: this adapter requires Antigravity CLI; direct API access is not implemented');
if (s.addWorkspace !== undefined && typeof s.addWorkspace !== 'boolean') throw Error('addWorkspace must be boolean');
const exe = absolute(s.executable, 'executable'), cwd = absolute(s.cwd, 'cwd');
const out = absolute(s.outputDirectory, 'outputDirectory');
const promptFile = absolute(s.promptFile, 'promptFile');
try { noLinks(exe); } catch (error) { throw Error(`missing-or-invalid-cli: ${error.message}`); }
for (const p of [cwd, promptFile]) noLinks(p);
noLinks(out, true);
if (!lstatSync(exe).isFile() || !lstatSync(cwd).isDirectory()) throw Error('Invalid executable or cwd');
if (extname(exe).toLowerCase() !== '.exe') throw Error('launcher-required: resolve the native agy.exe before using this supervisor');
if (!/^gemini-[a-zA-Z0-9._-]+$/.test(s.model || '')) throw Error('Explicit Gemini model slug required');
if (!Number.isInteger(s.timeoutMs) || s.timeoutMs < 100 || s.timeoutMs > 600000) throw Error('timeoutMs must be 100..600000');
if (!Number.isInteger(s.printTimeoutSeconds) || s.printTimeoutSeconds < 1 || s.printTimeoutSeconds * 1000 >= s.timeoutMs) throw Error('Native timeout must be positive and below external timeout');
const shutdownGraceMs = s.shutdownGraceMs ?? 5000;
if (!Number.isInteger(shutdownGraceMs) || shutdownGraceMs < 100 || shutdownGraceMs > 30000) throw Error('shutdownGraceMs must be 100..30000');
if (s.acknowledgeUnisolatedTools !== true) throw Error('Preflight must acknowledge that this adapter does not isolate tools');
const allowed = s.allowedFileCalls || [];
if (!Array.isArray(allowed)) throw Error('allowedFileCalls must be an array');
for (const item of allowed) {
  if (!['view_file', 'write_to_file'].includes(item.tool)) throw Error('Adapter supports only exact file reads/writes');
  item.path = absolute(item.path, 'allowed file'); noLinks(item.path, item.tool === 'write_to_file');
}
const prompt = readFileSync(promptFile, 'utf8');
if (!prompt.trim()) throw Error('Empty prompt');
const allowedCommand=prepareAllowedCommand(s.allowedCommandCall,cwd);
return { s, exe, cwd, out, prompt, shutdownGraceMs, allowed, allowedCommand };
}
let prepared;
try {
  prepared = preflight();
  mkdirSync(prepared.out); // Fresh run directory; never overwrite earlier evidence.
  noLinks(prepared.out);
} catch (error) {
  console.log(JSON.stringify({ event: 'preflight_failed', status: 'blocked', transport: 'cli', authentication: 'unknown', processStarted: false, error: error.message }));
  process.exit(1);
}
const { s, exe, cwd, out, prompt, shutdownGraceMs, allowed, allowedCommand } = prepared;
const stdoutFd = openSync(resolve(out, 'stdout.ndjson'), 'wx');
const stderrFd = openSync(resolve(out, 'stderr.txt'), 'wx');
const args = ['--model', s.model, '--input-format', 'stream-json', '--output-format', 'stream-json', '--disable-slash-commands', '--print-timeout', `${s.printTimeoutSeconds}s`];
if (s.addWorkspace === true) args.push('--add-dir', cwd);
const started=Date.now();
const state={pid:null,model:s.model,cwd,args,started:new Date(started).toISOString(),deadline:new Date(started+s.timeoutMs).toISOString(),shutdownGraceMs,failures:[],init:null,result:null,terminalEvents:0,cleanupCheckRequired:true,cleanup:'pending'};
let control,pending='',errorTail='',saving=false;const decoder=new StringDecoder('utf8');
const fail=reason=>{if(!state.failures.includes(reason))state.failures.push(reason)};
function save(){if(saving)return;saving=true;try{noLinks(resolve(out,'status.json'),true);writeFileSync(resolve(out,'status.json'),JSON.stringify(state,null,2));}catch(e){fail('status capture failed: '+e.message);void control?.stop();}finally{saving=false;}}
function stop(reason){fail(reason);void control?.stop();save();}
state.command=allowedCommand?{launches:0,stepIndex:null,active:false,done:false,observed:[]}:null;
function validateCommandStep(step) {
  if (!allowedCommand) { stop('unexpected command tool'); return; }
  const tool = step.tool_info;
  const parameters = tool?.parameters;
  if (!parameters || typeof parameters !== 'object' || Array.isArray(parameters)) { stop('invalid command parameters'); return; }
  const parameterFields = new Set(['CommandLine', 'Cwd', 'WaitMsBeforeAsync']);
  if (Object.keys(parameters).some(key => !parameterFields.has(key))) { stop('unknown command parameter'); return; }
  if (parameters.CommandLine !== allowedCommand.commandLine) { stop('unexpected command line'); return; }
  if (parameters.Cwd !== undefined && (typeof parameters.Cwd !== 'string' || !isAbsolute(parameters.Cwd) || norm(parameters.Cwd) !== norm(allowedCommand.expectedCwd))) { stop('unexpected command cwd'); return; }
  if (launcherSha256(allowedCommand.launcherPath) !== allowedCommand.expectedLauncherSha256) { stop('launcher hash changed'); return; }
  if (parameters.WaitMsBeforeAsync !== undefined && parameters.WaitMsBeforeAsync !== 5000) { stop('unexpected command wait'); return; }
  const record = { stepIndex: step.step_index, state: step.state, commandLine: parameters.CommandLine, cwd: parameters.Cwd ?? null };
  if (state.command.stepIndex === null) {
    if (step.state !== 'ACTIVE') { stop('command step must begin ACTIVE'); return; }
    state.command.stepIndex = step.step_index;
    state.command.launches = 1;
    state.command.active = true;
  } else if (state.command.stepIndex !== step.step_index) {
    stop('multiple command launches'); return;
  } else if (step.state === 'ACTIVE') {
    state.command.active = true;
  } else if (step.state === 'DONE') {
    if (!state.command.active) { stop('command DONE without ACTIVE'); return; }
    state.command.done = true;
  } else {
    stop('command step error'); return;
  }
  state.command.observed.push(record);
}
function consume(line) {
  if (!line.trim()) return;
  let e; try { e = JSON.parse(line); } catch { stop('malformed stdout event'); return; }
  if (!e || typeof e !== 'object' || typeof e.event !== 'string') { stop('invalid event shape'); return; }
  if (state.terminalEvents) { stop('event after terminal result'); return; }
  if (e.event === 'init') {
    if (state.init) stop('duplicate init');
    state.init = e.init;
    if (typeof e.init?.cwd !== 'string' || norm(e.init.cwd) !== norm(cwd) || e.init?.model !== s.model || e.init?.permission_mode !== 'request-review') stop('unexpected init configuration');
  } else if (e.event === 'result') {
    state.terminalEvents++; state.result = e.result;
    if (!state.init || e.result?.status !== 'SUCCESS' || e.result?.error || (e.result?.denied_actions !== undefined && (!Array.isArray(e.result.denied_actions) || e.result.denied_actions.length))) stop('terminal error or denied action');
  } else if (e.event === 'step_update') {
    const step = e.step_update;
    if (!state.init || !step || !Number.isInteger(step.step_index) || !['ACTIVE', 'DONE', 'ERROR'].includes(step.state) || !['user_input', 'agent_response', 'tool', 'checkpoint', 'system_message'].includes(step.step_type)) { stop('unrecognized step shape'); return; }
    if (step.step_type !== 'tool' && (step.tool_info || step.tool_name)) { stop('tool fields in non-tool step'); return; }
    if (step?.state === 'ERROR' || step?.tool_info?.error) stop('tool or step error');
    if (step?.step_type === 'tool') {
      if(step.tool_name==='run_command')validateCommandStep(step);
      else {
      const p = step.tool_info?.parameters || {};
      const target = p.AbsolutePath || p.TargetFile;
      if (typeof target !== 'string' || !isAbsolute(target) || !allowed.some(a => a.tool === step.tool_name && norm(a.path) === norm(target))) stop('unexpected tool or file target');
      }
    }
    if (step?.subagent_info) stop('unexpected subagent');
  } else stop('unknown stdout event');
  save();
}

const input=resolve(out,'input.ndjson');writeFileSync(input,JSON.stringify({event:'user',message:{content:prompt}})+'\n',{flag:'wx'});
const heartbeat=setInterval(()=>{save();console.log(JSON.stringify({event:'supervisor_progress',pid:state.pid,elapsedSeconds:Math.floor((Date.now()-started)/1000),failures:state.failures}));},30000);
const interrupt=()=>stop('supervisor interrupted');process.on('SIGINT',interrupt);process.on('SIGTERM',interrupt);
let result;
try{result=await runProcess({executable:exe,args,cwd,outputDirectory:resolve(out,'process'),stdinFile:input,timeoutMs:s.timeoutMs,shutdownGraceMs},{
onStart:handle=>{control=handle;state.pid=handle.pid;save();console.log(JSON.stringify({event:'supervisor_start',pid:handle.pid,outputDirectory:out,deadline:state.deadline}));},
onStdoutChunk:b=>{writeSync(stdoutFd,b);pending+=decoder.write(b);let i;while((i=pending.indexOf('\n'))>=0){consume(pending.slice(0,i));pending=pending.slice(i+1);}if(pending.length>1024*1024){stop('oversized event');pending='';}},
onStderrChunk:b=>{writeSync(stderrFd,b);errorTail=(errorTail+b.toString('utf8')).slice(-8192);if(/print timeout|auto-denied|permission check failed|authentication required|billing|quota exceeded/i.test(errorTail))stop('blocking stderr diagnostic');}
});}catch(e){fail('supervisor failure: '+e.message);await control?.stop();}
clearInterval(heartbeat);process.removeListener('SIGINT',interrupt);process.removeListener('SIGTERM',interrupt);
pending+=decoder.end();if(pending.trim())consume(pending);
state.exitCode=result?.processes?.[0]?.exitCode??null;state.cleanup=result?.processes?.[0]?.cleanup??'unverified';state.elapsedMs=Date.now()-started;
if(state.exitCode!==0)fail('nonzero process exit');if(result?.timedOut)fail('external deadline');for(const e of result?.errors??[])fail(e);if(state.cleanup!=='close-observed')fail('cleanup incomplete');
if(!state.init||state.terminalEvents!==1||typeof state.result?.response!=='string'||!state.result.response.trim())fail('missing init or complete nonempty result');
if(allowedCommand&&(state.command.launches!==1||!state.command.active||!state.command.done))fail('approved command did not complete exactly once');
state.outcome=state.failures.length?'incomplete':'result-ready-for-independent-verification';save();closeSync(stdoutFd);closeSync(stderrFd);
console.log(JSON.stringify({event:'supervisor_close',outcome:state.outcome,exitCode:state.exitCode,failures:state.failures,cleanupCheckRequired:true,cleanup:state.cleanup}));process.exitCode=state.failures.length?1:0;
