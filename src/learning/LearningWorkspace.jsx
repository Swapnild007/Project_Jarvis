import React, { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, ChevronRight, Brain, Play, RotateCcw, Save, Target, Terminal } from 'lucide-react';
import { PYTHON_CURRICULUM } from './pythonCurriculum.js';

function scoreAnswer(text, lesson){
  const normalized=text.toLowerCase();
  const hits=lesson.answerKeywords.filter(k=>normalized.includes(k));
  const coverage=Math.min(70,hits.length*12);
  const depth=text.trim().length>240?30:text.trim().length>140?22:text.trim().length>70?14:0;
  return Math.min(100,coverage+depth);
}

export function LearningWorkspace({state,setState,setMission}){
  const saved=state.learning||{};
  const [lessonIndex,setLessonIndex]=useState(Math.min(saved.lessonIndex||0,PYTHON_CURRICULUM.length-1));
  const [mode,setMode]=useState(saved.mode||'learn');
  const [answer,setAnswer]=useState(saved.draftAnswer||'');
  const [score,setScore]=useState(saved.lastScore??null);
  const [completed,setCompleted]=useState(saved.completed||[]);
  const lesson=PYTHON_CURRICULUM[lessonIndex];
  const progress=Math.round((completed.length/PYTHON_CURRICULUM.length)*100);
  const isDone=completed.includes(lesson.id);
  const skill=useMemo(()=>lesson.skill,[lesson]);
  const persist=(patch)=>setState(current=>({...current,learning:{...(current.learning||{}),...patch}}));

  const startLesson=()=>{
    setMode('learn');
    setMission(`Python: ${lesson.title}`);
    persist({lessonIndex,mode:'learn',startedAt:new Date().toISOString(),track:'Python'});
    setState(current=>({...current,activity:[{text:`Python lesson started: ${lesson.title}`,time:new Date().toLocaleTimeString(),type:'learning'},...(current.activity||[])].slice(0,30)}));
  };
  const checkAnswer=()=>{
    const result=scoreAnswer(answer,lesson);
    setScore(result); setMode('review');
    persist({draftAnswer:answer,lastScore:result,lastAssessedAt:new Date().toISOString(),mode:'review',track:'Python'});
  };
  const completeLesson=()=>{
    if(score===null || score<60)return;
    const nextCompleted=completed.includes(lesson.id)?completed:[...completed,lesson.id];
    const now=new Date().toISOString();
    setCompleted(nextCompleted); setMode('complete');
    const oldLevel=state.skills?.[skill]?.level||0;
    const earned=score>=85?1:score>=70?0.5:0;
    const newLevel=Math.min(5,Math.max(oldLevel,Math.ceil(oldLevel+earned)));
    setState(current=>({...current,
      learning:{...(current.learning||{}),lessonIndex,mode:'complete',completed:nextCompleted,lastScore:score,lastCompletedAt:now,draftAnswer:'',track:'Python'},
      skills:{...(current.skills||{}),[skill]:{...(current.skills?.[skill]||{}),level:newLevel,confidence:score,evidence:[...(current.skills?.[skill]?.evidence||[]),`Python lesson ${lesson.title} assessed at ${score}/100`]}},
      evidence:{...(current.evidence||{}),['05']:{action:'Complete Python lesson',at:now,score,title:lesson.title}},
      activity:[{text:`Python lesson completed: ${lesson.title} (${score}/100)`,time:new Date().toLocaleTimeString(),type:'learning'},...(current.activity||[])].slice(0,30),
    }));
    setMission(`Python completed: ${lesson.title}`);
  };
  const nextLesson=()=>{
    const next=Math.min(PYTHON_CURRICULUM.length-1,lessonIndex+1);
    setLessonIndex(next);setAnswer('');setScore(null);setMode('learn');
    persist({lessonIndex:next,mode:'learn',draftAnswer:'',lastScore:null,track:'Python'});
    setMission(`Next Python lesson: ${PYTHON_CURRICULUM[next].title}`);
  };

  return <section className="module-page">
    <div className="module-icon"><Terminal size={28}/></div>
    <p className="eyebrow">MODULE 05 · CAREER CENTRE · PYTHON</p>
    <h1>Python Academy: Learn → Practice → Prove</h1>
    <p className="module-copy">A W3Schools-style guided curriculum inside JARVIS. Every lesson teaches one concept, shows an example, asks you to explain or design something, evaluates your response, records evidence and advances only when the work is demonstrated.</p>

    <div className="module-grid">
      <div className="card">
        <div className="card-head"><span>PYTHON TRACK</span><Target size={16}/></div>
        <div className="state-row"><span>Lesson</span><b>{lessonIndex+1} / {PYTHON_CURRICULUM.length}</b></div>
        <div className="state-row"><span>Level</span><b>{lesson.level}</b></div>
        <div className="state-row"><span>Estimated time</span><b>{lesson.minutes} min</b></div>
        <div className="bar"><i style={{width:`${progress}%`}}/></div>
        <p>{completed.length} of {PYTHON_CURRICULUM.length} lessons completed · {progress}% track progress.</p>
        <button onClick={startLesson}><Play size={15}/> Start lesson <ChevronRight size={15}/></button>
      </div>
      <div className="card">
        <div className="card-head"><span>LEARNING STATE</span><Brain size={16}/></div>
        <div className="state-row"><span>Mode</span><b>{mode.toUpperCase()}</b></div>
        <div className="state-row"><span>Last score</span><b>{score===null?'NOT ASSESSED':`${score}/100`}</b></div>
        <div className="state-row"><span>Status</span><b>{isDone?'COMPLETE':'IN PROGRESS'}</b></div>
        <p className="muted">Career State is updated only after evidence is recorded.</p>
      </div>
    </div>

    <div className="card operation-console">
      <div className="card-head"><span>{mode==='learn'?'CONCEPT BRIEF':mode==='practice'?'PRACTICE & RECALL':mode==='review'?'JARVIS EVALUATION':'EVIDENCE RECORDED'}</span><BookOpen size={16}/></div>
      <p className="eyebrow">PYTHON · {lesson.level.toUpperCase()}</p>
      <h2>{lesson.title}</h2>
      {mode==='learn' && <>
        <p>{lesson.concept}</p>
        <div className="state-row"><span>Example</span><b><code>{lesson.example}</code></b></div>
        <button onClick={()=>setMode('practice')}><Target size={15}/> Try the exercise</button>
      </>}
      {mode==='practice' && <>
        <p><b>Your task:</b> {lesson.task}</p>
        <textarea value={answer} onChange={e=>{setAnswer(e.target.value);persist({draftAnswer:e.target.value});}} rows="9" placeholder="Write the answer in your own words. For coding tasks, include the code and explain your reasoning."/>
        <button onClick={checkAnswer} disabled={answer.trim().length<20}><CheckCircle2 size={15}/> Submit to JARVIS</button>
      </>}
      {mode==='review' && <>
        <div className="state-row"><span>Evidence score</span><b>{score}/100</b></div>
        <div className="bar"><i style={{width:`${score}%`}}/></div>
        <p>{score>=85?'Strong demonstration. This concept is ready to become evidence.':score>=60?'Usable foundation. Review the weak points, then record the evidence.':'Not ready yet. Re-read the concept, improve the explanation and try again.'}</p>
        <div className="state-row"><span>Completion gate</span><b>60/100 minimum</b></div>
        <button onClick={()=>setMode('practice')}><RotateCcw size={15}/> Improve answer</button>
        {score>=60 && <button onClick={completeLesson}><Save size={15}/> Record evidence & complete</button>}
      </>}
      {mode==='complete' && <>
        <div className="state-row"><span>Result</span><b>RECORDED · {score}/100</b></div>
        <p>This lesson is now part of your Career State and Python capability evidence.</p>
        {lessonIndex<PYTHON_CURRICULUM.length-1 ? <button onClick={nextLesson}><ChevronRight size={15}/> Continue to next lesson</button> : <p><b>Python curriculum complete.</b> Build the capstone to prove the skill in a real project.</p>}
      </>}
    </div>

    <div className="card">
      <div className="card-head"><span>PYTHON CAREER PATH</span><CheckCircle2 size={16}/></div>
      <div className="state-row"><span>Foundation</span><b>Syntax → Data → Control Flow → Functions</b></div>
      <div className="state-row"><span>Applied</span><b>Files → JSON → APIs → Testing</b></div>
      <div className="state-row"><span>Intermediate</span><b>OOP → Pandas → Automation</b></div>
      <div className="state-row"><span>Security</span><b>Logs → Defensive Automation → Evidence</b></div>
      <div className="state-row"><span>Prove</span><b>RTA/WFM or Security Automation Capstone</b></div>
      <p className="muted">The Python track is intentionally tied to your career target: automation first, then systems, cybersecurity and security engineering.</p>
    </div>
  </section>;
}
