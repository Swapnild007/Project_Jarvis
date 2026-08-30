import React, { useMemo, useState } from 'react';
import {
  BookOpen, CheckCircle2, ChevronRight, Database, FlaskConical, Play,
  Search, Shield, Target, TrendingUp, Upload, Settings, Brain, Activity,
  GitBranch, Download, RotateCcw, Lock, SlidersHorizontal, Award,
} from 'lucide-react';
import { downloadBackup, restoreBackup, clearCareerState, STATE_SCHEMA_VERSION } from './stateStore';
import { createMission, transitionMission, addMissionEvidence, completeMission } from '../engine/missionEngine';

const ACTIONS = {
  '01': ['Assess career position', 'Define capability architecture', 'Review North Star'],
  '02': ['View active mission', 'Start mission', 'Mark evidence'],
  '03': ['Recalculate next mission', 'Inspect decision factors', 'Accept mission'],
  '04': ['View Career State', 'Record checkpoint', 'Review memory'],
  '05': ['Start lesson', 'Request deep dive', 'Open resources'],
  '06': ['Inspect skill graph', 'Filter by domain', 'Review gaps'],
  '07': ['Start assessment', 'Review results', 'Retest weak areas'],
  '08': ['Open revision queue', 'Practice recall', 'Schedule review'],
  '09': ['Open lab', 'Run experiment', 'Record lab evidence'],
  '10': ['Open project', 'Create checkpoint', 'Publish evidence'],
  '11': ['Review code', 'Run quality checklist', 'Record feedback'],
  '12': ['Open security track', 'Analyze scenario', 'Run incident lab'],
  '13': ['Study AI/LLM security', 'Research OpenAI systems', 'Threat-model agent'],
  '14': ['Study systems', 'Practice Linux/networking', 'Design architecture'],
  '15': ['Study cloud security', 'Run DevSecOps lab', 'Review deployment controls'],
  '16': ['Research topic', 'Compare sources', 'Save resource'],
  '17': ['Analyze target roles', 'Inspect skill demand', 'Compare opportunities'],
  '18': ['Run reality audit', 'Inspect risks', 'Create corrective action'],
  '19': ['Build transition plan', 'Review target roles', 'Track applications'],
  '20': ['Start interview drill', 'Practice scenario', 'Score answer'],
  '21': ['Compare certifications', 'Check readiness', 'Build certification plan'],
  '22': ['Write journal entry', 'Review learning history', 'Search knowledge'],
  '23': ['Open progress analytics', 'Inspect trends', 'Review evidence growth'],
  '24': ['Create backup', 'Restore backup', 'Validate recovery'],
  '25': ['Review system settings', 'Inspect persistence', 'Review system policy'],
};

const ICONS = {
  '01': Brain, '02': Target, '03': Target, '04': Database, '05': BookOpen,
  '06': GitBranch, '07': CheckCircle2, '08': Activity, '09': FlaskConical,
  '10': GitBranch, '11': GitBranch, '12': Shield, '13': Brain, '14': GitBranch,
  '15': Shield, '16': Search, '17': TrendingUp, '18': Shield, '19': Target,
  '20': BookOpen, '21': BookOpen, '22': BookOpen, '23': Activity,
  '24': Upload, '25': Settings,
};

function recordAction(name, id, label, setState, setMission) {
  setMission(`${name}: ${label}`);
  setState((current) => ({
    ...current,
    evidence: { ...(current.evidence || {}), [id]: { action: label, at: new Date().toISOString() } },
    activity: [
      { text: `${name}: ${label}`, time: new Date().toLocaleTimeString(), type: 'module' },
      ...(current.activity || []),
    ].slice(0, 20),
  }));
}

function ensureActiveMission(state) {
  if (state.activeMission) return state.activeMission;
  return createMission(state);
}

export function ModuleWorkspace({ module, state, setState, setMission }) {
  const [id, name] = module || [];
  if (id === '24') return <BackupWorkspace state={state} setState={setState} setMission={setMission} />;
  if (id === '25') return <SettingsWorkspace state={state} setState={setState} setMission={setMission} />;

  const Icon = ICONS[id] || Brain;
  const actions = ACTIONS[id] || [];
  const [active, setActive] = useState(0);
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceDetail, setEvidenceDetail] = useState('');
  const [evidenceScore, setEvidenceScore] = useState(70);
  const evidence = state.evidence || {};
  const mission = state.activeMission;
  const readiness = useMemo(() => Object.keys(evidence).length, [evidence]);

  const run = () => {
    const currentMission = ensureActiveMission(state);
    const started = transitionMission(currentMission, 'active');
    setState((current) => ({ ...current, activeMission: started }));
    recordAction(name, id, actions[active] || 'Review module', setState, setMission);
  };

  const submitEvidence = () => {
    const currentMission = ensureActiveMission(state);
    const started = currentMission.status === 'proposed' ? transitionMission(currentMission, 'active') : currentMission;
    const submitted = addMissionEvidence(started, {
      kind: id === '09' ? 'lab' : id === '10' ? 'project' : 'demonstration',
      title: evidenceTitle || `${name} evidence`,
      detail: evidenceDetail || 'Demonstrated the selected mission action.',
      score: evidenceScore,
    });
    setState((current) => ({
      ...current,
      activeMission: submitted,
      evidence: { ...(current.evidence || {}), [id]: { action: actions[active], at: new Date().toISOString(), score: evidenceScore, title: evidenceTitle } },
      activity: [{ text: `${name}: evidence submitted (${evidenceScore}/100)`, time: new Date().toLocaleTimeString(), type: 'evidence' }, ...(current.activity || [])].slice(0, 20),
    }));
    setMission(`${name}: Evidence submitted`);
    setEvidenceTitle('');
    setEvidenceDetail('');
  };

  const evaluate = () => {
    if (!mission?.evidence?.length) return;
    const result = completeMission(state, mission);
    setState(result);
    setMission(result.currentMission);
  };

  return (
    <section className="module-page">
      <div className="module-icon"><Icon size={28} /></div>
      <p className="eyebrow">MODULE {id} · FUNCTIONAL WORKSPACE</p>
      <h1>{name}</h1>
      <p className="module-copy">This workspace operates on the shared Career State. Actions create traceable activity, while mission evidence must be submitted and evaluated before capability is considered demonstrated.</p>
      <div className="module-grid">
        <div className="card">
          <div className="card-head"><span>MISSION WORKSPACE</span><Target size={16} /></div>
          <h2>{actions[active]}</h2>
          <p>Choose an operation, execute it, then record what you actually learned, built, tested or proved.</p>
          <div className="action-list">
            {actions.map((action, index) => <button key={action} className={active === index ? 'selected' : ''} onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, '0')}</span>{action}<ChevronRight size={15} /></button>)}
          </div>
          <button onClick={run}><Play size={15} /> Execute action</button>
        </div>
        <div className="card">
          <div className="card-head"><span>CAREER STATE</span><Database size={16} /></div>
          <div className="state-row"><span>Phase</span><b>{state.phase}</b></div>
          <div className="state-row"><span>Current mission</span><b>{state.currentMission}</b></div>
          <div className="state-row"><span>Mission status</span><b>{mission?.status?.toUpperCase() || 'PROPOSED'}</b></div>
          <div className="state-row"><span>Module evidence</span><b>{evidence[id] ? 'RECORDED' : 'NONE'}</b></div>
          <div className="state-row"><span>Evidence modules</span><b>{readiness}</b></div>
          <p className="muted">Evidence is durable only when tied to an action, result, artifact or assessment.</p>
        </div>
      </div>
      <div className="card evidence-card">
        <div className="card-head"><span>PROOF OF CAPABILITY</span><Award size={16} /></div>
        <p>Do not claim mastery from page visits. Submit concrete proof, score it honestly, then let JARVIS evaluate the mission.</p>
        <input value={evidenceTitle} onChange={(e) => setEvidenceTitle(e.target.value)} placeholder="Evidence title" />
        <textarea value={evidenceDetail} onChange={(e) => setEvidenceDetail(e.target.value)} placeholder="What did you build, test, solve or demonstrate?" rows="3" />
        <label className="setting-row"><span>Evidence score: {evidenceScore}/100</span><input type="range" min="0" max="100" value={evidenceScore} onChange={(e) => setEvidenceScore(Number(e.target.value))} /></label>
        <div className="evidence-actions"><button onClick={submitEvidence}><CheckCircle2 size={15} /> Submit evidence</button><button onClick={evaluate} disabled={!mission?.evidence?.length}><Award size={15} /> Evaluate mission</button></div>
        {mission?.feedback && <p className="status-note">{mission.feedback}</p>}
      </div>
    </section>
  );
}

function BackupWorkspace({ state, setState, setMission }) {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const exportState = () => { downloadBackup(state); setMessage('Backup exported successfully.'); setMission('Backup / Recovery: Export Career State'); };
  const importState = (event) => {
    const file = event.target.files?.[0]; if (!file) return; setBusy(true);
    restoreBackup(file, (restored) => { setState(restored); setMessage('Backup restored. Career State reloaded.'); setBusy(false); setMission('Backup / Recovery: Restore Career State'); }, (error) => { setMessage(error.message); setBusy(false); });
    event.target.value = '';
  };
  return (
    <section className="module-page">
      <div className="module-icon"><Upload size={28} /></div><p className="eyebrow">MODULE 24 · RECOVERY CONTROL</p><h1>Backup / Recovery / Export</h1>
      <p className="module-copy">Your Career State stays in the browser, but it should never be trapped there. Export a versioned JSON backup and restore it on a new browser or device.</p>
      <div className="module-grid"><div className="card"><div className="card-head"><span>BACKUP</span><Download size={16} /></div><h2>Export complete Career State</h2><p>Includes skills, assessments, evidence, missions and activity.</p><button onClick={exportState}><Download size={15} /> Export JSON backup</button></div><div className="card"><div className="card-head"><span>RECOVERY</span><RotateCcw size={16} /></div><h2>Restore a JARVIS backup</h2><p>Only files created by JARVIS Career OS are accepted.</p><label className="file-button"><Upload size={15} /> {busy ? 'Reading backup…' : 'Choose backup file'}<input type="file" accept="application/json,.json" onChange={importState} /></label></div></div>
      <div className="card status-card"><div className="state-row"><span>Schema</span><b>v{STATE_SCHEMA_VERSION}</b></div><div className="state-row"><span>Current state</span><b>{state.baseline ? 'ACTIVE' : 'INITIALIZE'}</b></div>{message && <p>{message}</p>}</div>
    </section>
  );
}

function SettingsWorkspace({ state, setState, setMission }) {
  const [confirm, setConfirm] = useState(false);
  const settings = state.settings || { reducedMotion: false, compactMode: false };
  const update = (key, value) => setState((current) => ({ ...current, settings: { ...(current.settings || {}), [key]: value } }));
  const reset = () => { if (!confirm) { setConfirm(true); return; } clearCareerState(); window.location.reload(); };
  return (
    <section className="module-page">
      <div className="module-icon"><Settings size={28} /></div><p className="eyebrow">MODULE 25 · SYSTEM CONTROL</p><h1>JARVIS System Settings</h1>
      <p className="module-copy">System-level controls are intentionally conservative. Settings affect presentation and recovery behavior, never the locked career architecture.</p>
      <div className="module-grid"><div className="card"><div className="card-head"><span>INTERFACE</span><SlidersHorizontal size={16} /></div><label className="setting-row"><span>Reduced motion</span><input type="checkbox" checked={!!settings.reducedMotion} onChange={(e) => update('reducedMotion', e.target.checked)} /></label><label className="setting-row"><span>Compact mode</span><input type="checkbox" checked={!!settings.compactMode} onChange={(e) => update('compactMode', e.target.checked)} /></label><div className="state-row"><span>Persistence</span><b>LOCAL STATE ACTIVE</b></div></div><div className="card"><div className="card-head"><span>SAFETY</span><Lock size={16} /></div><p>Locked career modules cannot be rewritten by normal module actions.</p><div className="state-row"><span>Career architecture</span><b>PROTECTED</b></div><div className="state-row"><span>State schema</span><b>v{STATE_SCHEMA_VERSION}</b></div><button className="danger" onClick={reset}><RotateCcw size={15} /> {confirm ? 'Confirm full reset' : 'Reset local Career State'}</button>{confirm && <button onClick={() => setConfirm(false)}>Cancel</button>}</div></div>
      <div className="card status-card"><CheckCircle2 size={16} /> Settings are stored inside the shared Career State.</div>
    </section>
  );
}
