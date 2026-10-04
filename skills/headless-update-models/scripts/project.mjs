import {createHash} from 'node:crypto';
import {existsSync,lstatSync,mkdirSync,readFileSync,renameSync,writeFileSync} from 'node:fs';
import {dirname,isAbsolute,resolve} from 'node:path';
const CONSUMERS=['headless-codex','headless-claude','headless-gemini','headless-grok','headless-update-models'];
const FILES=[['references/selection.md','references/model-selection.md'],['references/model-state.json','references/model-state.json'],['references/freshness.md','references/freshness.md'],['references/run-contract.md','references/run-contract.md'],['scripts/check-model-freshness.mjs','scripts/check-model-freshness.mjs']];
// Access is shared with usage too; quota reads never inherit model-map freshness.
const ACCESS_FILES=['references/access.md','scripts/check-access.mjs'];
const ACCESS_CONSUMERS=[...CONSUMERS,'headless-usage'];
const PROCESS_FILES=['scripts/run-process.mjs','references/process-supervision.md','scripts/dispatch-fixed.mjs','references/fixed-dispatch.md'];
const PROCESS_CONSUMERS=['headless-codex','headless-claude','headless-gemini','headless-grok'];
const hash=b=>createHash('sha256').update(b).digest('hex');
function noLinks(path,missing=false){let p=resolve(path),first=true;for(;;){try{if(lstatSync(p).isSymbolicLink())throw Error(`Redirect: ${p}`);}catch(e){if(!(first&&missing&&e.code==='ENOENT'))throw e;}first=false;const d=dirname(p);if(d===p)return;p=d;}}
function file(path){noLinks(path);if(!lstatSync(path).isFile())throw Error(`Not a file: ${path}`);return readFileSync(path);}
function state(path){noLinks(path,true);if(!existsSync(path))return {exists:false,sha256:null,bytes:null};const bytes=file(path);if(!/headless-family:projection|headless-models:projection|model-map:projection/.test(bytes.toString()))throw Error(`Unowned projection: ${path}`);return {exists:true,sha256:hash(bytes),bytes};}
const args=process.argv.slice(2);
if(!isAbsolute(args[0]||'')||!((args.length===2&&args[1]==='--check')||(args.length===3&&args[1]==='--apply'&&isAbsolute(args[2]))))throw Error('Usage: node project.mjs <absolute-repository> --check | --apply <absolute-new-private-backup-dir>');
const root=resolve(args[0]);
const sources=FILES.map(([from])=>{const path=resolve(root,'skills/headless-models',from),bytes=file(path);return {path,bytes,sha256:hash(bytes)};});
const targets=CONSUMERS.flatMap(name=>FILES.map(([,to],index)=>({path:resolve(root,'skills',name,to),source:sources[index]})));
for(const relative of ACCESS_FILES){
 const path=resolve(root,'skills/headless-models',relative),bytes=file(path),source={path,bytes,sha256:hash(bytes)};
 sources.push(source);
 for(const name of ACCESS_CONSUMERS)targets.push({path:resolve(root,'skills',name,relative),source});
}
for(const relative of PROCESS_FILES){
 const path=resolve(root,'skills/headless-models',relative),bytes=file(path),source={path,bytes,sha256:hash(bytes)};
 sources.push(source);
 for(const name of PROCESS_CONSUMERS)targets.push({path:resolve(root,'skills',name,relative),source});
}
const before=targets.map(t=>state(t.path));
const drift=targets.filter((t,i)=>before[i].sha256!==t.source.sha256).map(t=>t.path);
if(args[1]==='--check'){console.log(JSON.stringify({mode:'check',targets:targets.length,drift}));process.exitCode=drift.length?1:0;}
else{
 const backup=resolve(args[2]),changed=[];let backupCreated=false;
 try{
  noLinks(backup,true);if(existsSync(backup)||!lstatSync(dirname(backup)).isDirectory())throw Error('Backup must be new with existing parent');
  const temps=targets.map((t,i)=>resolve(dirname(t.path),`.headless-${process.pid}-${i}.tmp`));
  for(const tmp of temps){noLinks(tmp,true);if(existsSync(tmp))throw Error(`Temp exists: ${tmp}`);}
  mkdirSync(backup);backupCreated=true;
  const snapshots=before.map((s,i)=>({target:targets[i].path,existed:s.exists,sha256:s.sha256,backupFile:s.exists?`${i}.previous`:null}));
  before.forEach((s,i)=>{if(s.exists)writeFileSync(resolve(backup,`${i}.previous`),s.bytes,{flag:'wx'});});
  writeFileSync(resolve(backup,'manifest.json'),JSON.stringify({sources:sources.map(({path,sha256})=>({path,sha256})),snapshots},null,2)+'\n',{flag:'wx'});
  for(let i=0;i<targets.length;i++){
   const t=targets[i],current=state(t.path);if(current.exists!==before[i].exists||current.sha256!==before[i].sha256)throw Error(`Preimage changed: ${t.path}`);
   if(hash(file(t.source.path))!==t.source.sha256)throw Error(`Source changed: ${t.source.path}`);
   if(current.sha256===t.source.sha256)continue;
   noLinks(temps[i],true);writeFileSync(temps[i],t.source.bytes,{flag:'wx'});renameSync(temps[i],t.path);changed.push(t.path);
  }
  console.log(JSON.stringify({mode:'apply',changed,backup}));
 }catch(e){console.log(JSON.stringify({mode:'apply',outcome:'partial-or-failed',changed,backup,backupCreated,error:e.message}));process.exitCode=1;}
}
