import React, { useMemo, useState } from 'react';
import { Brain, CheckCircle2, RotateCcw, Target, Save, BookOpen } from 'lucide-react';

const QUESTIONS = [
 {id:'q1',skill:'linux',question:'Which command shows your current working directory?',options:['ls','pwd','cd','ps'],answer:1,explain:'pwd prints the current working directory.'},
 {id:'q2',skill:'linux',question:'In -rwxr-x---, who has write permission?',options:['Owner only','Group only','Others','Nobody'],answer:0,explain:'The owner has rwx, including write.'},
 {id:'q3',skill:'networking',question:'What identifies a service endpoint on a host?',options:['Port','MAC vendor','Username','Filesystem'],answer:0,explain:'A port identifies a network service endpoint on a host.'},
 {id:'q4',skill:'cyber-fundamentals',question:'Which is strongest evidence during an incident investigation?',options:['A guess','One isolated alert','Correlated logs and timestamps','A course completion badge'],answer:2,explain:'Correlation across reliable evidence is stronger than an isolated signal.'},
 {id:'q5',skill:'logs',question:'Which set is most useful when investigating failed logins?',options:['Timestamp, user, source IP','Wallpaper, hostname color, CPU brand','Browser theme, RAM brand, monitor size','Only the username'],answer:0,explain:'Timestamp, identity and source address allow useful correlation.'}
];

function nextReview(score){ if(score<60)return 'Today'; if(score<75)return 'Tomorrow'; if(score<90)return 'In 3 days'; return 'In 7 days'; }

export function AssessmentRevisionWorkspace({state,setState,setMission,mode='assessment'}){
 const saved=state.assessment||{};
 const [index,setIndex]=useState(saved.index||0);
 const [answers,setAnswers]=useState(saved.answers||{});
 const [result,setResult]=useState(saved.lastResult||null);
 const [review,setReview]=useState(mode==='revision');
 const question=QUESTIONS[index];
 const weak=useMemo(()=>QUESTIONS.filter(q=>saved.history?.some(h=>h.questionId===q.id&&h.correct===false)),[saved.history]);
 const persist=(patch)=>setState(current=>({...current,assessment:{...(current.assessment||{}),...patch}}));
 const choose=(value)=>{const next={...answers,[question.id]:value};setAnswers(next);persist({answers:next,index});};
 const finish=()=>{
   const correct=QUESTIONS.filter(q=>answers[q.id]===q.answer).length;
   const score=Math.round(correct/QUESTIONS.length*100);
   const history=[...(saved.history||[]),...QUESTIONS.map(q=>({questionId:q.id,skill:q.skill,correct:answers[q.id]===q.answer,at:new Date().toISOString()}))];
   const weakSkills=[...new Set(QUESTIONS.filter(q=>answers[q.id]!==q.answer).map(q=>q.skill))];
   const now=new Date().toISOString();
   setResult({score,correct,total:QUESTIONS.length,weakSkills,nextReview:nextReview(score)});
   persist({answers,index,history,lastResult:{score,correct,total:QUESTIONS.length,weakSkills,nextReview:nextReview(score)},lastAssessedAt:now});
   setState(current=>({...current,evidence:{...(current.evidence||{}),['07']:{action:'Assessment',at:now,score,title:`Assessment ${score}/100`}},activity:[{text:`Assessment completed: ${score}/100`,time:new Date().toLocaleTimeString(),type:'assessment'},...(current.activity||[])].slice(0,30)}));
   setMission(`Assessment completed: ${score}/100`);
 };
 const recordRevision=()=>{const now=new Date().toISOString();setState(current=>({...current,revision:{...(current.revision||{}),lastSessionAt:now,reviewed:weak.map(q=>q.id)},activity:[{text:`Revision session completed: ${weak.length} weak item(s)`,time:new Date().toLocaleTimeString(),type:'revision'},...(current.activity||[])].slice(0,30)}));setMission('Revision session completed');};
 return <section className="module-page">
  <div className="module-icon"><Brain size={28}/></div>
  <p className="eyebrow">MODULE {mode==='revision'?'08 · REVISION & RETENTION':'07 · ASSESSMENT ENGINE'}</p>
  <h1>{mode==='revision'?'Recall → Repair → Retain':'Assess → Diagnose → Recalculate'}</h1>
  <p className="module-copy">JARVIS measures demonstrated capability, identifies weak areas and schedules the next review. A certificate or page visit does not count as mastery.</p>
  <div className="module-grid">
   <div className="card"><div className="card-head"><span>{mode==='revision'?'REVISION QUEUE':'ASSESSMENT'}</span><Target size={16}/></div>
    <div className="state-row"><span>Item</span><b>{index+1} / {QUESTIONS.length}</b></div>
    <div className="state-row"><span>Weak concepts</span><b>{weak.length}</b></div>
    {review ? <><p>Prioritize concepts that were previously missed. Explain the answer before checking the reasoning.</p><div className="state-row"><span>Next review</span><b>{saved.lastResult?.nextReview||'After assessment'}</b></div><button onClick={recordRevision}><Save size={15}/> Record revision session</button></> : <button onClick={()=>setMission('Assessment started')}>Start assessment</button>}
   </div>
   <div className="card"><div className="card-head"><span>CAREER STATE</span><CheckCircle2 size={16}/></div><div className="state-row"><span>Last score</span><b>{saved.lastResult?`${saved.lastResult.score}/100`:'NOT ASSESSED'}</b></div><div className="state-row"><span>Weak skills</span><b>{saved.lastResult?.weakSkills?.join(', ')||'None recorded'}</b></div><p className="muted">Assessment results become evidence and inform revision.</p></div>
  </div>
  {!review && !result && <div className="card operation-console"><div className="card-head"><span>QUESTION</span><BookOpen size={16}/></div><h2>{question.question}</h2><div className="action-list">{question.options.map((option,i)=><button key={option} className={answers[question.id]===i?'selected':''} onClick={()=>choose(i)}>{String.fromCharCode(65+i)}. {option}</button>)}</div><div><button onClick={()=>index<QUESTIONS.length-1?setIndex(index+1):finish()} disabled={answers[question.id]===undefined}>{index<QUESTIONS.length-1?'Next question':'Submit assessment'}</button></div></div>}
  {!review && result && <div className="card operation-console"><div className="card-head"><span>ASSESSMENT RESULT</span><CheckCircle2 size={16}/></div><h2>{result.score}/100</h2><p>{result.correct} of {result.total} correct.</p><div className="state-row"><span>Weak skills</span><b>{result.weakSkills.join(', ')||'None'}</b></div><div className="state-row"><span>Next review</span><b>{result.nextReview}</b></div><p>{result.score>=85?'Strong result. Move to practical evidence.':result.score>=60?'Foundation is usable, but revise the weak areas.':'Do not advance yet. Repair the weak concepts and reassess.'}</p><button onClick={()=>{setResult(null);setAnswers({});setIndex(0);persist({answers:{},index:0});}}><RotateCcw size={15}/> Retest</button></div>}
  {review && <div className="card operation-console"><div className="card-head"><span>REVISION QUEUE</span><RotateCcw size={16}/></div>{weak.length===0?<p>No missed items are recorded yet. Complete an assessment first.</p>:weak.map(q=><div className="state-row" key={q.id}><span>{q.skill}</span><b>{q.question}</b></div>)}<button onClick={()=>setMission('Revision practice started')}><Target size={15}/> Practice weak areas</button></div>}
 </section>;
}
