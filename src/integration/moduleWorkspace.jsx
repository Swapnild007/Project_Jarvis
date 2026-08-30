import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Database,
  FlaskConical,
  Play,
  Search,
  Shield,
  Target,
  TrendingUp,
  Upload,
  Settings,
  Brain,
  Activity,
  GitBranch,
} from 'lucide-react';

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
  '24': ['Create backup', 'Validate recovery', 'Export Career State'],
  '25': ['Open system settings', 'Review locked modules', 'Inspect system policy'],
};

const ICONS = {
  '01': Brain,
  '02': Target,
  '03': Target,
  '04': Database,
  '05': BookOpen,
  '06': GitBranch,
  '07': CheckCircle2,
  '08': Activity,
  '09': FlaskConical,
  '10': GitBranch,
  '11': GitBranch,
  '12': Shield,
  '13': Brain,
  '14': GitBranch,
  '15': Shield,
  '16': Search,
  '17': TrendingUp,
  '18': Shield,
  '19': Target,
  '20': BookOpen,
  '21': BookOpen,
  '22': BookOpen,
  '23': Activity,
  '24': Upload,
  '25': Settings,
};

export function ModuleWorkspace({ module, state, setState, setMission }) {
  const [id, name] = module || [];
  const Icon = ICONS[id] || Brain;
  const actions = ACTIONS[id] || [];
  const [active, setActive] = useState(0);
  const evidence = state.evidence || {};

  const run = () => {
    const label = actions[active] || 'Review module';
    setMission(`${name}: ${label}`);
    setState((current) => ({
      ...current,
      evidence: {
        ...current.evidence,
        [id]: { action: label, at: new Date().toISOString() },
      },
      activity: [
        {
          text: `${name}: ${label}`,
          time: new Date().toLocaleTimeString(),
          type: 'module',
        },
        ...current.activity,
      ].slice(0, 20),
    }));
  };

  const readiness = useMemo(() => Object.keys(evidence).length, [evidence]);

  return (
    <section className="module-page">
      <div className="module-icon">
        <Icon size={28} />
      </div>
      <p className="eyebrow">MODULE {id} · FUNCTIONAL WORKSPACE</p>
      <h1>{name}</h1>
      <p className="module-copy">
        This workspace operates on the shared Career State. Actions create
        traceable activity and evidence rather than pretending that opening a
        page equals mastery.
      </p>
      <div className="module-grid">
        <div className="card">
          <div className="card-head">
            <span>MISSION WORKSPACE</span>
            <Target size={16} />
          </div>
          <h2>{actions[active]}</h2>
          <p>
            Choose an operation, execute it, then record what you actually
            learned, built, tested or proved.
          </p>
          <div className="action-list">
            {actions.map((action, index) => (
              <button
                key={action}
                className={active === index ? 'selected' : ''}
                onClick={() => setActive(index)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                {action}
                <ChevronRight size={15} />
              </button>
            ))}
          </div>
          <button onClick={run}>
            <Play size={15} /> Execute action
          </button>
        </div>
        <div className="card">
          <div className="card-head">
            <span>CAREER STATE</span>
            <Database size={16} />
          </div>
          <div className="state-row">
            <span>Phase</span>
            <b>{state.phase}</b>
          </div>
          <div className="state-row">
            <span>Current mission</span>
            <b>{state.currentMission}</b>
          </div>
          <div className="state-row">
            <span>Module evidence</span>
            <b>{evidence[id] ? 'RECORDED' : 'NONE'}</b>
          </div>
          <div className="state-row">
            <span>Evidence modules</span>
            <b>{readiness}</b>
          </div>
          <p className="muted">
            Evidence is durable only when tied to an action, result, artifact
            or assessment.
          </p>
        </div>
      </div>
    </section>
  );
}
