// Windows native lifecycle fixtures; no model, account or network calls. Evidence retained.
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,existsSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
if(process.platform!=='win32')throw Error('Windows-only test');
const root=mkdtempSync(join(tmpdir(),'headless-supervision-'));
const exe=join(root,'fixture.exe'),source=join(root,'fixture.cs');
const compiler=join(process.env.SystemRoot||'C:/Windows','Microsoft.NET/Framework64/v4.0.30319/csc.exe');
if(!existsSync(compiler))throw Error('Fixture needs installed .NET Framework C# compiler');
function bounded(executable,args,timeoutMs){return new Promise((resolve,reject)=>{const p=spawn(executable,args,{shell:false,windowsHide:true,stdio:['ignore','pipe','pipe']});let output='';p.stdout.on('data',b=>output+=b);p.stderr.on('data',b=>output+=b);const timer=setTimeout(()=>{p.kill();p.stdout.destroy();p.stderr.destroy();p.unref();reject(Error('Fixture process exceeded outer deadline'));},timeoutMs);p.on('error',e=>{clearTimeout(timer);reject(e)});p.on('close',code=>{clearTimeout(timer);resolve({code,output});});});}
writeFileSync(source,`using System; using System.Diagnostics; using System.Threading;
class Fixture { static void Main(string[] args) {
 if(args.Length>0 && args[0]=="hold"){Thread.Sleep(4500);return;}
 string cwd=Environment.CurrentDirectory.Replace("\\\\","\\\\\\\\");
 Console.WriteLine("{\\"event\\":\\"init\\",\\"init\\":{\\"cwd\\":\\""+cwd+"\\",\\"model\\":\\"gemini-3.8-flash-low\\",\\"permission_mode\\":\\"request-review\\"}}");
 Console.WriteLine("{\\"event\\":\\"result\\",\\"result\\":{\\"status\\":\\"SUCCESS\\",\\"response\\":\\"FIXTURE_OK\\"}}"); Console.Out.Flush();
 if(cwd.Contains("root-exit")){var p=new ProcessStartInfo(Process.GetCurrentProcess().MainModule.FileName,"hold");p.UseShellExecute=false;p.CreateNoWindow=true;Process.Start(p);return;}
 Thread.Sleep(4500);
}}
`);
const build=await bounded(compiler,['/nologo','/target:exe','/out:'+exe,source],15000);if(build.code!==0)throw Error(build.output);
writeFileSync(join(root,'prompt.txt'),'fixture');
for(const name of ['deadline','root-exit']){
 const cwd=join(root,name);mkdirSync(cwd);const out=join(root,name+'-output');const spec={executable:exe,cwd,promptFile:join(root,'prompt.txt'),outputDirectory:out,model:'gemini-3.8-flash-low',timeoutMs:1500,printTimeoutSeconds:1,shutdownGraceMs:300,acknowledgeUnisolatedTools:true,allowedFileCalls:[]};const specPath=join(root,name+'.json');writeFileSync(specPath,JSON.stringify(spec));
 const start=Date.now();const run=await bounded(process.execPath,[resolve(import.meta.dirname,'run-windows.mjs'),specPath],8000);const status=JSON.parse(readFileSync(join(out,'status.json')));
 if(name==='deadline'&&(run.code===0||!status.failures.includes('external deadline')))throw Error('Deadline failure not detected');
 if(Date.now()-start>3500)throw Error('Supervisor exceeded expected lifecycle bound');
 console.log(JSON.stringify({test:name,exit:run.code,elapsedMs:Date.now()-start,cleanup:status.cleanup,failures:status.failures,evidence:out}));
}
// Native fixture descendants self-expire after 4.5 seconds. No recursive cleanup.
console.log(JSON.stringify({retained:root}));
