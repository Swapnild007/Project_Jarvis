import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, Brain, BookOpen, Briefcase, ChevronRight, Command, Database,
  FlaskConical, GitBranch, GraduationCap, LayoutDashboard, Lock, Network,
  RefreshCw, Search, Shield, Target, Terminal, TrendingUp, Upload, Settings,
  CheckCircle2, AlertTriangle, Play, RotateCcw,
} from 'lucide-react';
import './styles.css';
import './phase23.css';
import { SKILLS, DOMAINS } from './data/careerGraph';
import { BASELINE_QUESTIONS } from './data/baselineQuestions';
import { createInitialSkills, LEVELS, selectNextMission, applyAssessment } from './engine/careerEngine';
import { calculateReadiness } from './engine/intelligenceEngine';
import { ModuleWorkspace } from './integration/moduleWorkspace.jsx';

const modules = [
  ['01', 'Core / Career Architect', Brain], ['02', 'Mission Control', Target],
  ['03', 'Next Mission Engine', Command], ['04', 'Career State & Memory', Database],
  ['05', 'Learning / Teaching OS', GraduationCap], ['06', 'Skill Matrix', Network],
  ['07', 'Assessment Engine', CheckCircle2], ['08', 'Revision / Retention', RefreshCw],
  ['09', 'Lab Operations', FlaskConical], ['10', 'Projects / Portfolio', Briefcase],
  ['11', 'Code Review', GitBranch], ['12', 'Cybersecurity Command', Shield],
  ['13', 'AI / OpenAI Command', Brain], ['14', 'Systems / Engineering', Terminal],
  ['15', 'Cloud / DevSecOps', Network], ['16', 'Research Intelligence', Search],
  ['17', 'Career Market Intelligence', TrendingUp], ['18', 'Reality Check / Audit', AlertTriangle],
  ['19', 'Career Strategy / Job Transition', Target], ['20', 'Interview Preparation', GraduationCap],
  ['21', 'Certification Strategy', BookOpen], ['22', 'Learning Journal', BookOpen],
  ['23', 'Progress Analytics', Activity], ['24', 'Backup / Recovery / Export', Upload],
  ['25', 'System Settings', Settings],
];

const initial = {
  goal: 'Cybersecurity → Security Engineering → AI/LLM/Agent Security',
  target: '29 November 2028', phase: 'INITIALIZE', baseline: false,
  currentMission: 'Complete Career Baseline Assessment', skills: createInitialSkills(),
  activity: [], baselineAnswers: {}, evidence: {}, version: 2,
};

function loadState() {
  try { return JSON.parse(localStorage.getItem('jarvis-state')) || initial; }
  catch { return initial; }
}

function App() {
  const [state, setState] = useState(loadState);
  const [active, setActive] = useState('00');
  const [query, setQuery] = useState('');
  useEffect(() => { localStorage.setItem('jarvis-state', JSON.stringify(state)); }, [state]);
  const days = Math.max(0, Math.ceil((new Date('2028-11-29') - new Date()) / 86400000));
  const filtered = useMemo(() => modules.filter((module) => module[1].toLowerCase().includes(query.toLowerCase())), [query]);
  const setMission = (mission) => setState((current) => ({
    ...current, currentMission: mission,
    activity: [{ text: mission, time: new Date().toLocaleTimeString(), type: 'mission' }, ...current.activity].slice(0, 20),
  }));

  return <div className="os">
    <header>
      <div className="brand"><div className="orb"><Brain size={22} /></div><div><b>JARVIS</b><span>CAREER OS</span></div></div>
      <div className="top-status"><span className="dot" />SYSTEM ONLINE <i /> NORTH STAR: 29 NOV 2028</div>
      <div className="top-actions"><button onClick={() => setActive('03')}><Command size={18} /></button><button onClick={() => setActive('25')}><Settings size={18} /></button></div>
    </header>
    <aside>
      <button className={active === '00' ? 'nav active' : 'nav'} onClick={() => setActive('00')}><LayoutDashboard size={17} />Command Center</button>
      <div className="nav-label">MODULES</div>
      {filtered.map(([id, name, Icon]) => <button key={id} className={active === id ? 'nav active' : 'nav'} onClick={() => setActive(id)}><span className="num">{id}</span><Icon size={16} /><span>{name}</span></button>)}
      <div className="side-foot"><Lock size={14} />Locked modules protected</div>
    </aside>
    <main>
      <div className="crumb">JARVIS / {active === '00' ? 'COMMAND CENTER' : modules.find((module) => module[0] === active)?.[1].toUpperCase()}</div>
      {active === '00' ? <Dashboard state={state} days={days} query={query} setQuery={setQuery} setMission={setMission} setActive={setActive} />
        : active === '07' ? <Baseline state={state} setState={setState} setMission={setMission} />
        : active === '06' ? <SkillMatrix state={state} />
        : active === '03' ? <NextMission state={state} setMission={setMission} />
        : <ModuleWorkspace module={modules.find((module) => module[0] === active)} state={state} setState={setState} setMission={setMission} />}
    </main>
  </div>;
}

function Dashboard({ state, days, query, setQuery, setMission, setActive }) {
  const mission = selectNextMission(state);
  const tracked = Object.values(state.skills).filter((skill) => skill.level > 0).length;
  const readiness = calculateReadiness(state);
  return <>
    <section className="hero"><div><p className="eyebrow">NORTH STAR</p><h1>Career transformation<br /><em>before 29 Nov 2028.</em></h1><p className="muted">A persistent operating system for moving from WFM/RTA into Cybersecurity, Security Engineering and AI/LLM/Agent Security.</p></div><div className="count"><strong>{days}</strong><span>DAYS REMAINING</span></div></section>
    <section className="grid">
      <article className="card mission"><div className="card-head"><span>CURRENT MISSION</span><Command size={17} /></div><h2>{mission.title}</h2><p>{mission.reason}</p><button onClick={() => setActive(state.baseline ? '03' : '07')}><Play size={15} />{state.baseline ? 'Open mission' : 'Start baseline'}<ChevronRight size={16} /></button></article>
      <article className="card readiness"><div className="card-head"><span>READINESS</span><Activity size={17} /></div><div className="readiness-value">{state.baseline ? `${readiness}%` : 'INITIALIZE'}</div><div className="bar"><i style={{ width: state.baseline ? `${readiness}%` : '2%' }} /></div><p>{state.baseline ? `${tracked} capabilities assessed. Readiness is evidence-weighted.` : 'Baseline assessment required before progression.'}</p></article>
      <article className="card"><div className="card-head"><span>CAREER STATE</span><Database size={17} /></div><div className="state-row"><span>Phase</span><b>{state.phase}</b></div><div className="state-row"><span>Baseline</span><b>{state.baseline ? 'COMPLETE' : 'PENDING'}</b></div><div className="state-row"><span>Skills tracked</span><b>{tracked}/{SKILLS.length}</b></div></article>
      <article className="card"><div className="card-head"><span>SYSTEM FLOW</span><GitBranch size={17} /></div><div className="flow">ASSESS <ChevronRight /> LEARN <ChevronRight /> PRACTICE <ChevronRight /> LAB <ChevronRight /> PROVE</div><p>Progress requires evidence. Certificates alone never create mastery.</p></article>
    </section>
    <section className="lower">
      <div className="panel"><div className="panel-title">ASK JARVIS</div><div className="command"><Command size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Jarvis, let's do next in our pivot." /><button onClick={() => setMission(query || mission.title)}>RUN</button></div><div className="suggestions"><button onClick={() => setActive(state.baseline ? '03' : '07')}>{state.baseline ? 'Open next mission' : 'Start baseline'}</button><button onClick={() => setActive('06')}>View skill graph</button><button onClick={() => setMission(mission.title)}>Recalculate</button></div></div>
      <div className="panel"><div className="panel-title">RECENT ACTIVITY</div>{state.activity.length ? <div className="activity">{state.activity.map((activity, index) => <div key={index}><span className="dot" /><span>{activity.text}</span><small>{activity.time}</small></div>)}</div> : <div className="empty">No activity yet. Your career state starts here.</div>}</div>
    </section>
  </>;
}

function Baseline({ state, setState, setMission }) {
  const [answers, setAnswers] = useState(state.baselineAnswers || {});
  const [index, setIndex] = useState(0);
  const q = BASELINE_QUESTIONS[index];
  const done = Object.keys(answers).length;
  const choose = (level) => {
    const next = { ...answers, [q.id]: { skill: q.skill, level, confidence: level, evidence: [level >= 3 ? 'Self-reported working capability' : 'Self-reported foundational capability'] } };
    setAnswers(next);
    if (index < BASELINE_QUESTIONS.length - 1) { setIndex(index + 1); return; }
    const mapped = {};
    Object.values(next).forEach((answer) => { mapped[answer.skill] = answer; });
    const newState = applyAssessment(state, mapped);
    setState({ ...newState, baselineAnswers: next, activity: [{ text: 'Career Baseline completed', time: new Date().toLocaleTimeString(), type: 'assessment' }, ...state.activity].slice(0, 20) });
    setMission(selectNextMission({ ...newState, baseline: true }).title);
  };
  return <section className="module-page"><div className="module-icon"><CheckCircle2 size={28} /></div><p className="eyebrow">MODULE 07 · FIRST-RUN GATE</p><h1>Career Baseline Assessment</h1><p className="module-copy">JARVIS will not guess your skill level. Answer honestly. This is a starting model, not a permanent label. Practical evidence can later raise or lower any capability.</p>
    {state.baseline ? <div className="card"><div className="card-head"><span>BASELINE COMPLETE</span><CheckCircle2 size={16} /></div><h2>Your capability model is active.</h2><p>The Next Mission Engine can now use prerequisites, gaps and evidence.</p><button onClick={() => setState({ ...state, baseline: false, currentMission: 'Complete Career Baseline Assessment' })}><RotateCcw size={15} /> Reassess baseline</button></div>
      : <div className="assessment card"><div className="assessment-top"><span>QUESTION {done + 1} / {BASELINE_QUESTIONS.length}</span><b>{Math.round((done / BASELINE_QUESTIONS.length) * 100)}%</b></div><div className="bar"><i style={{ width: `${(done / BASELINE_QUESTIONS.length) * 100}%` }} /></div><p className="eyebrow">{q.skill.replaceAll('-', ' ').toUpperCase()}</p><h2>{q.text}</h2><p>Choose the highest level you can demonstrate today.</p><div className="level-grid">{[0, 1, 2, 3, 4, 5].map((level) => <button key={level} onClick={() => choose(level)}><strong>{level}</strong><span>{LEVELS[level]}</span></button>)}</div><small>0 = no exposure · 5 = advanced working capability</small></div>}
  </section>;
}

function SkillMatrix({ state }) {
  const [domain, setDomain] = useState('All');
  const list = SKILLS.filter((skill) => domain === 'All' || skill.domain === domain);
  return <section className="module-page"><div className="module-icon"><Network size={28} /></div><p className="eyebrow">MODULE 06 · CAPABILITY GRAPH</p><h1>Skill Matrix</h1><p className="module-copy">A dependency-aware view of the capability system. Levels come from assessment/evidence, never from page visits.</p><div className="domain-tabs"><button onClick={() => setDomain('All')} className={domain === 'All' ? 'selected' : ''}>All</button>{DOMAINS.map((item) => <button key={item} onClick={() => setDomain(item)} className={domain === item ? 'selected' : ''}>{item}</button>)}</div><div className="skill-list">{list.map((skill) => { const current = state.skills[skill.id] || { level: 0 }; const status = current.level === 0 ? 'UNASSESSED' : current.level >= skill.target ? 'PROVEN' : current.level >= 2 ? 'DEVELOPING' : 'FOUNDATION'; return <div className="skill-row" key={skill.id}><div><b>{skill.name}</b><small>{skill.domain} · target {skill.target}/5</small></div><div className="skill-status"><span>{status}</span><strong>{current.level}/5</strong></div><div className="mini-bar"><i style={{ width: `${(current.level / 5) * 100}%` }} /></div></div>; })}</div></section>;
}

function NextMission({ state, setMission }) {
  const mission = selectNextMission(state);
  const skill = mission.skillId && SKILLS.find((item) => item.id === mission.skillId);
  return <section className="module-page"><div className="module-icon"><Command size={28} /></div><p className="eyebrow">MODULE 03 · DECISION ENGINE</p><h1>Next Mission Engine</h1><p className="module-copy">JARVIS selects the highest-value action from the current state and prerequisite graph. It does not follow a hardcoded course sequence.</p><div className="mission-focus card"><div className="card-head"><span>RECOMMENDED NEXT</span><Target size={17} /></div><h2>{mission.title}</h2><p>{mission.reason}</p>{mission.trace && <div className="trace"><p className="eyebrow">DECISION TRACE</p>{mission.trace.map((item, index) => <div key={index}><span>{index + 1}</span>{item}</div>)}</div>}{skill && <><div className="state-row"><span>Domain</span><b>{skill.domain}</b></div><div className="state-row"><span>Prerequisites</span><b>{skill.prerequisites.length ? skill.prerequisites.map((id) => SKILLS.find((item) => item.id === id)?.name).join(', ') : 'None'}</b></div>{mission.intelligence && <div className="state-row"><span>Priority score</span><b>{mission.intelligence.priority}</b></div>}</>}<button onClick={() => setMission(mission.title)}><Play size={15} /> Accept mission</button></div></section>;
}

createRoot(document.getElementById('root')).render(<App />);
