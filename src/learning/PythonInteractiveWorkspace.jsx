import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, ChevronRight, Play, RotateCcw, Save, Terminal, AlertTriangle } from 'lucide-react';
import { PYTHON_CURRICULUM } from './pythonCurriculum.js';

const LABS={
'py-intro':{starter:'# Write your first Python program\nprint("Hello, JARVIS")',tests:'assert "Hello, JARVIS" in output',hint:'Use print() to produce the requested text.'},
'py-syntax':{starter:'score = 75\n# Write an if block below\n',tests:'assert "Pass" in output',hint:'Indent the print statement inside the if block.'},
'py-variables':{starter:'offered = 1250\nhandled = 1190\naht_seconds = 1200\nprint(offered, handled, aht_seconds)',tests:'assert offered == 1250 and handled == 1190 and aht_seconds == 1200',hint:'Create three variables with the requested names and values.'},
'py-types':{starter:'queue = "MPC"\noffered = 1250\noccupancy = 80.5\nactive = True\nprint(type(queue).__name__, type(offered).__name__, type(occupancy).__name__, type(active).__name__)',tests:'assert queue == "MPC" and isinstance(offered,int) and isinstance(occupancy,float) and isinstance(active,bool)',hint:'Match each value to the appropriate Python type.'},
'py-operators':{starter:'offered = 1000\nabandoned = 25\n# Calculate abandon_rate\nabandon_rate = 0\nprint(abandon_rate)',tests:'assert abs(abandon_rate - 2.5) < 1e-9',hint:'abandoned / offered * 100. Also guard against offered == 0.'},
'py-conditionals':{starter:'sla = 82\n# Set risk to CRITICAL, WATCH or NORMAL\nrisk = ""\nprint(risk)',tests:'assert risk == "WATCH"',hint:'Use if / elif / else with thresholds 80 and 85.'},
'py-loops':{starter:'skills = ["MPC", "Premera", "SOMOS"]\n# Print every skill on its own line\n',tests:'assert output.strip().splitlines() == skills',hint:'Use for skill in skills: and print(skill).'},
'py-functions':{starter:'def service_level(answered, offered):\n    # return the percentage\n    pass\n\nprint(service_level(850, 1000))',tests:'assert abs(service_level(850,1000) - 85) < 1e-9',hint:'Return answered / offered * 100 and handle zero offered safely.'},
'py-strings':{starter:'field = "  CountyCare  "\nclean = field\nprint(clean)',tests:'assert clean == "countycare"',hint:'Chain strip() and lower().'},
'py-lists':{starter:'lobs = ["MPC", "Premera", "SOMOS"]\n# Add CountyCare and print all LOBs\n',tests:'assert lobs == ["MPC","Premera","SOMOS","CountyCare"]',hint:'Use append().'},
'py-dicts':{starter:'kpi = {}\n# Add sla=85, aht=1200, occupancy=80\nprint(kpi)',tests:'assert kpi == {"sla":85,"aht":1200,"occupancy":80}',hint:'Dictionary keys map to values.'},
'py-sets-tuples':{starter:'interval = ("10:00", "10:30")\nlobs = ["MPC", "MPC", "SOMOS"]\nunique_lobs = set(lobs)\nprint(interval, unique_lobs)',tests:'assert interval == ("10:00","10:30") and unique_lobs == {"MPC","SOMOS"}',hint:'Keep the interval as a tuple and remove duplicates with set().'},
'py-files':{starter:'from io import StringIO\nimport csv\ntext = "skill,offered\\nMPC,100\\nSOMOS,80\\n"\nreader = csv.DictReader(StringIO(text))\nrows = list(reader)\nprint(len(rows))',tests:'assert len(rows)==2 and rows[0]["skill"]=="MPC"',hint:'The lab uses an in-memory CSV so it works safely in a browser.'},
'py-exceptions':{starter:'text = "not-a-number"\ntry:\n    value = int(text)\nexcept ValueError:\n    value = 0\nprint(value)',tests:'assert value == 0',hint:'Catch ValueError specifically, not every Exception.'},
'py-modules':{starter:'from pathlib import Path\nreport = Path("data/report.csv")\nprint(report.name)',tests:'assert report.name == "report.csv"',hint:'Import Path from pathlib and inspect the filename.'},
'py-json':{starter:'import json\ntext = "{\\"sla\\": 85, \\"aht\\": 1200}"\nconfig = json.loads(text)\nprint(config["sla"])',tests:'assert config["sla"]==85 and config["aht"]==1200',hint:'JSON text becomes a Python dictionary with json.loads().'},
'py-apis':{starter:'# Browser-safe API simulation\nresponse = {"status": 200, "data": {"offered": 100}}\nif response["status"] == 200:\n    result = response["data"]\nelse:\n    result = None\nprint(result)',tests:'assert result == {"offered":100}',hint:'Always check status before consuming response data. Real network access is intentionally not required for this lab.'},
'py-testing':{starter:'def abandon_rate(abandoned, offered):\n    return abandoned / offered * 100\n\nassert abandon_rate(10,100) == 10\n# Add at least one edge-case test\nprint("tests passed")',tests:'assert "tests passed" in output',hint:'Test a normal case and an edge case such as zero demand.'},
'py-oop':{starter:'class Queue:\n    def __init__(self, name, sla):\n        self.name = name\n        self.sla = sla\n\nq = Queue("MPC", 85)\nprint(q.name, q.sla)',tests:'assert q.name=="MPC" and q.sla==85',hint:'Use __init__ to store name and SLA on self.'},
'py-pandas':{starter:'# Pandas is not loaded by default in the browser lab.\n# Solve the same grouping idea with standard Python first.\nrows = [{"skill":"MPC","offered":100},{"skill":"MPC","offered":50},{"skill":"SOMOS","offered":80}]\ntotals = {}\nfor row in rows:\n    totals[row["skill"]] = totals.get(row["skill"], 0) + row["offered"]\nprint(totals)',tests:'assert totals == {"MPC":150,"SOMOS":80}',hint:'Understand grouping logic first. Pandas comes after the concept.'},
'py-automation':{starter:'rows = [{"skill":"MPC","offered":100,"abandoned":5},{"skill":"SOMOS","offered":80,"abandoned":2}]\n# Build a processed list with abandon_rate_pct\nprocessed = []\nprint(processed)',tests:'assert processed[0]["abandon_rate_pct"]==5 and processed[1]["abandon_rate_pct"]==2.5',hint:'Validate input, calculate the rate, append a new record, then print.'},
'py-security':{starter:'events = [{"user":"a","failed_logins":2},{"user":"b","failed_logins":9}]\nthreshold = 5\nalerts = []\n# Add users whose failed_logins exceed threshold\nprint(alerts)',tests:'assert alerts == ["b"]',hint:'Filter events defensively and preserve the user as evidence.'},
'py-capstone':{starter:'# JARVIS Python Capstone\n# Build a small interval-risk pipeline.\nrows = [{"skill":"MPC","offered":1000,"abandoned":30,"sla":82}]\nresult = []\n# validate -> calculate -> risk -> output\nprint(result)',tests:'assert result and result[0]["abandon_rate_pct"]==3 and result[0]["risk"]=="WATCH"',hint:'Produce a structured result containing abandon_rate_pct and risk.'}
};

let pyodidePromise;
function loadPython(){
  if(!pyodidePromise){pyodidePromise=import('https://cdn.jsdelivr.net/pyodide/v0.28.2/full/pyodide.mjs').then(m=>m.loadPyodide());}
  return pyodidePromise;
}

export function PythonInteractiveWorkspace({state,setState,setMission}){
 const saved=state.learning||{};
 const [index,setIndex]=useState(Math.min(saved.lessonIndex||0,PYTHON_CURRICULUM.length-1));
 const [code,setCode]=useState(saved.code||LABS[PYTHON_CURRICULUM[Math.min(saved.lessonIndex||0,PYTHON_CURRICULUM.length-1)].id]?.starter||'');
 const [output,setOutput]=useState(''); const [status,setStatus]=useState(saved.labStatus||'READY'); const [busy,setBusy]=useState(false);
 const [completed,setCompleted]=useState(saved.completed||[]); const [error,setError]=useState('');
 const lesson=PYTHON_CURRICULUM[index]; const lab=LABS[lesson.id]||LABS['py-intro'];
 const progress=Math.round(completed.length/PYTHON_CURRICULUM.length*100);
 const persist=patch=>setState(cur=>({...cur,learning:{...(cur.learning||{}),...patch,track:'Python'}}));
 useEffect(()=>{const savedCode=saved.codeByLesson?.[lesson.id];setCode(savedCode??lab.starter);setOutput('');setError('');setStatus('READY');},[lesson.id]);
 const saveCode=()=>persist({code,codeByLesson:{...(saved.codeByLesson||{}),[lesson.id]:code}});
 const run=async()=>{
   setBusy(true);setStatus('RUNNING');setError('');setOutput('');saveCode();
   try{
     const py=await loadPython();
     py.setStdout({batched:s=>setOutput(s)});
     py.setStderr({batched:s=>setOutput(o=>(o||'')+s)});
     await py.runPythonAsync(code+'\n');
     setStatus('PASSED');
     const now=new Date().toISOString();
     const next=completed.includes(lesson.id)?completed:[...completed,lesson.id];
     setCompleted(next);persist({codeByLesson:{...(saved.codeByLesson||{}),[lesson.id]:code},completed:next,lessonIndex:index,labStatus:'PASSED',lastRunAt:now});
     setState(cur=>({...cur,evidence:{...(cur.evidence||{}),['05']:{action:'Python code lab run',at:now,score:100,title:lesson.title}},activity:[{text:`Python lab passed: ${lesson.title}`,time:new Date().toLocaleTimeString(),type:'lab'},...(cur.activity||[])].slice(0,30)}));
     setMission(`Python lab passed: ${lesson.title}`);
   }catch(e){setStatus('FAILED');setError(String(e?.message||e));}
   finally{setBusy(false);}
 };
 const test=async()=>{
   setBusy(true);setStatus('TESTING');setError('');
   try{
     const py=await loadPython();let out='';py.setStdout({batched:s=>{out+=s;setOutput(v=>(v||'')+s)}});py.setStderr({batched:s=>{out+=s;setOutput(v=>(v||'')+s)}});
     await py.runPythonAsync(code+'\n'+lab.tests);setStatus('ALL TESTS PASSED');
     const now=new Date().toISOString();const next=completed.includes(lesson.id)?completed:[...completed,lesson.id];setCompleted(next);
     persist({codeByLesson:{...(saved.codeByLesson||{}),[lesson.id]:code},completed:next,lessonIndex:index,labStatus:'ALL TESTS PASSED',lastTestAt:now});
     setState(cur=>({...cur,evidence:{...(cur.evidence||{}),['05']:{action:'Python automated tests',at:now,score:100,title:lesson.title}},activity:[{text:`Python tests passed: ${lesson.title}`,time:new Date().toLocaleTimeString(),type:'lab'},...(cur.activity||[])].slice(0,30)}));
     setMission(`Python tests passed: ${lesson.title}`);
   }catch(e){setStatus('TESTS FAILED');setError(String(e?.message||e));}
   finally{setBusy(false);}
 };
 const reset=()=>{setCode(lab.starter);setOutput('');setError('');setStatus('READY');persist({code:lab.starter,labStatus:'READY'});};
 const next=()=>{if(index>=PYTHON_CURRICULUM.length-1)return;const n=index+1;setIndex(n);persist({lessonIndex:n,mode:'lab',code:LABS[PYTHON_CURRICULUM[n].id]?.starter||''});setMission(`Next Python lab: ${PYTHON_CURRICULUM[n].title}`);};
 return <section className="module-page">
   <div className="module-icon"><Terminal size={28}/></div><p className="eyebrow">MODULE 05 · PYTHON CAREER CENTRE · INTERACTIVE LAB</p>
   <h1>Python Academy: Learn → Code → Run → Prove</h1><p className="module-copy">A browser-native Python lab powered by Pyodide. Your code executes locally in the browser, so no Codespace is required.</p>
   <div className="module-grid"><div className="card"><div className="card-head"><span>PYTHON TRACK</span><BookOpen size={16}/></div><div className="state-row"><span>Lesson</span><b>{index+1} / {PYTHON_CURRICULUM.length}</b></div><div className="state-row"><span>Level</span><b>{lesson.level}</b></div><div className="bar"><i style={{width:`${progress}%`}}/></div><p>{completed.length}/{PYTHON_CURRICULUM.length} labs passed · {progress}%</p></div><div className="card"><div className="card-head"><span>LAB STATUS</span>{status.includes('PASS')?<CheckCircle2 size={16}/>:<Terminal size={16}/>}</div><div className="state-row"><span>Status</span><b>{status}</b></div><div className="state-row"><span>Runtime</span><b>Python / Pyodide</b></div><p className="muted">First run downloads the Python runtime. Later runs reuse it in this session.</p></div></div>
   <div className="card operation-console"><div className="card-head"><span>LESSON {index+1} · {lesson.title.toUpperCase()}</span><Terminal size={16}/></div><p>{lesson.concept}</p><div className="state-row"><span>Challenge</span><b>{lesson.task}</b></div><div className="state-row"><span>Hint</span><b>{lab.hint}</b></div>
     <textarea aria-label="Python code editor" value={code} onChange={e=>{setCode(e.target.value);persist({code:e.target.value,codeByLesson:{...(saved.codeByLesson||{}),[lesson.id]:e.target.value}})}} rows="15" spellCheck="false" style={{fontFamily:'monospace',fontSize:14,lineHeight:1.5,width:'100%',boxSizing:'border-box',background:'#080b12',color:'#e8edf5',border:'1px solid rgba(255,255,255,.12)',borderRadius:10,padding:14,resize:'vertical'}}/>
     <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:12}}><button onClick={run} disabled={busy}><Play size={15}/> {busy?'Running…':'Run Python'}</button><button onClick={test} disabled={busy}><CheckCircle2 size={15}/> Run tests</button><button onClick={saveCode} disabled={busy}><Save size={15}/> Save</button><button onClick={reset} disabled={busy}><RotateCcw size={15}/> Reset</button></div>
   </div>
   <div className="module-grid"><div className="card"><div className="card-head"><span>OUTPUT</span><Terminal size={16}/></div><pre style={{whiteSpace:'pre-wrap',minHeight:90,margin:0,fontFamily:'monospace'}}>{output||'Run your Python code to see output here.'}</pre></div><div className="card"><div className="card-head"><span>TEST RESULT</span>{status.includes('PASS')?<CheckCircle2 size={16}/>:<AlertTriangle size={16}/>}</div><b>{status}</b>{error&&<pre style={{whiteSpace:'pre-wrap',color:'#ffb4b4',fontFamily:'monospace',fontSize:12}}>{error}</pre>}<p className="muted">Tests verify the required variables, values and behavior for this lesson.</p></div></div>
   <div className="card"><div className="card-head"><span>PROGRESS GATE</span><CheckCircle2 size={16}/></div><p>Passing the automated tests records practical evidence in Career State. A lesson is considered demonstrated when its lab tests pass.</p>{index<PYTHON_CURRICULUM.length-1?<button onClick={next} disabled={!completed.includes(lesson.id)}><ChevronRight size={15}/> Continue to next lab</button>:<p><b>🏆 Python interactive track complete.</b> Your next target is the capstone project.</p>}</div>
 </section>;
}
