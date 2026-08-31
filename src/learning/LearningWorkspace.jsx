import React, { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, ChevronRight, Brain, Play, RotateCcw, Save, Target } from 'lucide-react';

const LESSONS = [
  {id:'linux-shell',title:'Linux Shell & Navigation',skill:'linux',minutes:20,concept:'The shell is an interface for controlling the operating system with commands. Your first security skill is being able to move around, inspect files, and understand what a command is doing before you run it.',example:'pwd shows your current directory. ls lists entries. cd changes your working directory. man or --help explains a command.',task:'In your own words, explain the difference between pwd, ls, and cd. Then give one example of when you would use each.',answerKeywords:['pwd','ls','cd']},
  {id:'linux-files',title:'Linux Files & Permissions',skill:'linux',minutes:25,concept:'Linux permissions control who can read, write, or execute a file. The three common classes are owner, group, and others, and each can have read, write, and execute permissions.',example:'ls -l exposes permission bits. chmod changes permissions. A security engineer cares because excessive permissions can create attack paths.',task:'Explain what the permission string -rwxr-x--- means. Identify the owner, group, and others permissions.',answerKeywords:['owner','group','read','write','execute']},
  {id:'linux-processes',title:'Processes & Services',skill:'linux',minutes:25,concept:'A process is a running program. Services are long-running processes that provide system functions. Security work often starts by asking what is running, who started it, what it can access, and whether it should be running.',example:'ps shows processes. top gives a live view. systemctl can inspect services on systems that use systemd.',task:'Why would a security engineer inspect running processes after a suspicious login? Name two things they would look for.',answerKeywords:['process','suspicious','command','user','service']},
  {id:'linux-network',title:'Linux Networking Basics',skill:'networking',minutes:30,concept:'A host communicates through network interfaces, IP addresses, routes, ports, and protocols. Security analysis depends on understanding which connections are expected and which are unusual.',example:'ip addr shows interfaces and addresses. ip route shows routes. ss can show listening sockets and active connections.',task:'Explain the difference between an IP address and a port, and why a defender would care about listening ports.',answerKeywords:['ip','address','port','connection','listening']},
  {id:'linux-logs',title:'Logs as Security Evidence',skill:'logs',minutes:30,concept:'Logs are records of system activity. Good analysis connects timestamps, users, processes, source addresses, and outcomes rather than treating a single log line as proof.',example:'A useful investigation asks: what happened, when, to what system, under which identity, from where, and what happened next?',task:'Describe a simple investigation workflow for a failed-login spike. Include at least three pieces of evidence you would correlate.',answerKeywords:['timestamp','user','ip','log','event','correlate']},
];

function scoreAnswer(text, lesson){
  const normalized=text.toLowerCase();
  const hits=lesson.answerKeywords.filter(k=>normalized.includes(k));
  const base=Math.min(70,hits.length*15);
  const depth=text.trim().length>180?20:text.trim().length>90?12:text.trim().length>30?7:0;
  return Math.min(100,base+depth);
}

export function LearningWorkspace({state,setState,setMission}){
  const saved=state.learning||{};
  const [lessonIndex,setLessonIndex]=useState(saved.lessonIndex||0);
  const [mode,setMode]=useState(saved.mode||'learn');
  const [answer,setAnswer]=useState(saved.draftAnswer||'');
  const [score,setScore]=useState(saved.lastScore||null);
  const [completed,setCompleted]=useState(saved.completed||[]);
  const lesson=LESSONS[lessonIndex];
  const progress=Math.round((completed.length/LESSONS.length)*100);
  const isDone=completed.includes(lesson.id);
  const skill=useMemo(()=>lesson.skill,[lesson]);

  const persist=(patch)=>setState(current=>({...current,learning:{...(current.learning||{}),...patch}}));

  const startLesson=()=>{
    setMode('learn');
    setMission(`Learning OS: ${lesson.title}`);
    persist({lessonIndex,mode:'learn',startedAt:new Date().toISOString()});
    setState(current=>({...current,activity:[{text:`Learning started: ${lesson.title}`,time:new Date().toLocaleTimeString(),type:'learning'},...(current.activity||[])].slice(0,30)}));
  };

  const checkAnswer=()=>{
    const result=scoreAnswer(answer,lesson);
    setScore(result);
    setMode('review');
    persist({draftAnswer:answer,lastScore:result,lastAssessedAt:new Date().toISOString()});
  };

  const completeLesson=()=>{
    if(score===null || score<60)return;
    const nextCompleted=completed.includes(lesson.id)?completed:[...completed,lesson.id];
    const now=new Date().toISOString();
    setCompleted(nextCompleted);
    const oldLevel=state.skills?.[skill]?.level||0;
    const earned=score>=85?1:score>=70?0.5:0;
    const newLevel=Math.min(5,Math.max(oldLevel,Math.ceil(oldLevel+earned)));
    setState(current=>({...current,
      learning:{...(current.learning||{}),lessonIndex,mode:'complete',completed:nextCompleted,lastScore:score,lastCompletedAt:now,draftAnswer:''},
      skills:{...(current.skills||{}),[skill]:{...(current.skills?.[skill]||{}),level:newLevel,confidence:score,evidence:[...(current.skills?.[skill]?.evidence||[]),`Learning OS lesson ${lesson.title} assessed at ${score}/100`]}},
      evidence:{...(current.evidence||{}),['05']:{action:'Complete lesson',at:now,score,title:lesson.title}},
      activity:[{text:`Lesson completed: ${lesson.title} (${score}/100)`,time:new Date().toLocaleTimeString(),type:'learning'},...(current.activity||[])].slice(0,30),
    }));
    setMission(`Learning completed: ${lesson.title}`);
  };

  const nextLesson=()=>{
    const next=Math.min(LESSONS.length-1,lessonIndex+1);
    setLessonIndex(next);setAnswer('');setScore(null);setMode('learn');
    persist({lessonIndex:next,mode:'learn',draftAnswer:'',lastScore:null});
    setMission(`Next lesson: ${LESSONS[next].title}`);
  };

  return <section className="module-page">
    <div className="module-icon"><BookOpen size={28}/></div>
    <p className="eyebrow">MODULE 05 · LEARNING OS V1</p>
    <h1>Learn → Practice → Prove</h1>
    <p className="module-copy">This is your first real learning loop. JARVIS teaches one focused concept, gives you a practical recall task, evaluates the response, records the result, and then selects the next lesson.</p>

    <div className="module-grid">
      <div className="card">
        <div className="card-head"><span>TODAY'S LESSON</span><Target size={16}/></div>
        <div className="state-row"><span>Lesson</span><b>{lessonIndex+1} / {LESSONS.length}</b></div>
        <div className="state-row"><span>Capability</span><b>{skill}</b></div>
        <div className="state-row"><span>Estimated time</span><b>{lesson.minutes} min</b></div>
        <div className="bar"><i style={{width:`${progress}%`}}/></div>
        <p>{completed.length} lesson{completed.length===1?'':'s'} completed.</p>
        <button onClick={startLesson}><Play size={15}/> Start this lesson <ChevronRight size={15}/></button>
      </div>
      <div className="card">
        <div className="card-head"><span>LEARNING STATE</span><Brain size={16}/></div>
        <div className="state-row"><span>Mode</span><b>{mode.toUpperCase()}</b></div>
        <div className="state-row"><span>Last score</span><b>{score===null?'NOT ASSESSED':`${score}/100`}</b></div>
        <div className="state-row"><span>Lesson status</span><b>{isDone?'COMPLETE':'IN PROGRESS'}</b></div>
        <p className="muted">Completion is based on demonstrated work, not time spent on the page.</p>
      </div>
    </div>

    <div className="card operation-console">
      <div className="card-head"><span>{mode==='learn'?'CONCEPT BRIEF':mode==='practice'?'PRACTICE':'ASSESSMENT RESULT'}</span><BookOpen size={16}/></div>
      <h2>{lesson.title}</h2>
      {mode==='learn' && <>
        <p>{lesson.concept}</p>
        <div className="state-row"><span>Example</span><b>{lesson.example}</b></div>
        <button onClick={()=>setMode('practice')}><Target size={15}/> Start practice</button>
      </>}
      {mode==='practice' && <>
        <p><b>Your task:</b> {lesson.task}</p>
        <textarea value={answer} onChange={e=>{setAnswer(e.target.value);persist({draftAnswer:e.target.value});}} rows="8" placeholder="Explain it in your own words. JARVIS will assess the response."/>
        <button onClick={checkAnswer} disabled={answer.trim().length<20}><CheckCircle2 size={15}/> Check my answer</button>
      </>}
      {mode==='review' && <>
        <div className="state-row"><span>Evidence score</span><b>{score}/100</b></div>
        <div className="bar"><i style={{width:`${score}%`}}/></div>
        <p>{score>=85?'Strong demonstration. Add a practical lab next.':score>=70?'Good foundation. Review the weak points once, then continue.':'Not ready to lock this lesson. Re-read the concept and try the task again.'}</p>
        <div className="state-row"><span>Assessment rule</span><b>60/100 minimum to complete</b></div>
        <button onClick={()=>setMode('practice')}><RotateCcw size={15}/> Try again</button>
        {score>=60 && <button onClick={completeLesson}><Save size={15}/> Record lesson evidence</button>}
      </>}
      {mode==='complete' && <>
        <div className="state-row"><span>Result</span><b>RECORDED</b></div>
        <p>Your lesson result is now part of the Career State and skill evidence.</p>
        {lessonIndex<LESSONS.length-1 && <button onClick={nextLesson}><ChevronRight size={15}/> Start next lesson</button>}
      </>}
    </div>

    <div className="card">
      <div className="card-head"><span>LEARNING CONTRACT</span><CheckCircle2 size={16}/></div>
      <p>One concept → explain it → practice it → get evaluated → record evidence → revisit weak areas → advance.</p>
      <div className="state-row"><span>Next recommended</span><b>{lessonIndex<LESSONS.length-1?LESSONS[lessonIndex+1].title:'Linux foundation complete'}</b></div>
      <p className="muted">You can use this loop for Linux first, then networking, cybersecurity, Python, cloud, DevSecOps and AI security.</p>
    </div>
  </section>;
}
