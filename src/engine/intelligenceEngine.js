import { SKILLS } from '../data/careerGraph';

const NORTH_STAR_WEIGHTS = {
  'AI Security': 1.35,
  'Security Engineering': 1.3,
  'Cybersecurity': 1.25,
  'Application Security': 1.2,
  'Cloud / DevSecOps': 1.15,
  'Security Operations': 1.1,
  Networking: 1.05,
  Systems: 1.0,
  Engineering: 0.95,
  'AI Engineering': 1.05,
  Foundations: 0.8,
  Projects: 1.2,
  Career: 1.25,
};

function ageDays(value) {
  if (!value) return Infinity;
  return Math.max(0, (Date.now() - new Date(value).getTime()) / 86400000);
}

function evidenceScore(record) {
  if (!record) return 0;
  const evidence = Array.isArray(record.evidence) ? record.evidence.length : 0;
  const level = Number(record.level) || 0;
  const confidence = Number(record.confidence) || 0;
  return Math.min(1, evidence * 0.18 + level * 0.08 + confidence * 0.04);
}

export function getDependents(skillId) {
  return SKILLS.filter((skill) => skill.prerequisites.includes(skillId));
}

export function getUnlockValue(skill, state) {
  const dependents = getDependents(skill.id);
  return dependents.reduce((sum, dependent) => {
    const current = state.skills[dependent.id]?.level || 0;
    const gap = Math.max(0, dependent.target - current);
    return sum + (gap > 0 ? 1 : 0);
  }, 0);
}

export function getSkillIntelligence(skill, state) {
  const record = state.skills[skill.id] || {};
  const current = Number(record.level) || 0;
  const gap = Math.max(0, skill.target - current);
  const stale = ageDays(record.lastAssessed);
  const staleness = Number.isFinite(stale) ? Math.min(1, stale / 180) : 0.35;
  const evidence = evidenceScore(record);
  const unlockValue = getUnlockValue(skill, state);
  const northStar = NORTH_STAR_WEIGHTS[skill.domain] || 1;
  const prerequisiteRisk = skill.prerequisites.reduce((sum, id) => {
    const prereq = state.skills[id]?.level || 0;
    return sum + (prereq < 2 ? 1 : 0);
  }, 0);

  const priority =
    gap * 2.2 * northStar +
    unlockValue * 0.9 +
    staleness * 0.5 +
    (1 - evidence) * 0.7 -
    prerequisiteRisk * 3;

  return {
    current,
    gap,
    evidence,
    staleDays: Number.isFinite(stale) ? Math.round(stale) : null,
    unlockValue,
    northStarWeight: northStar,
    prerequisiteRisk,
    priority: Math.round(priority * 100) / 100,
  };
}

export function explainMission(skill, state) {
  const intelligence = getSkillIntelligence(skill, state);
  const blockers = skill.prerequisites
    .map((id) => SKILLS.find((item) => item.id === id))
    .filter((item) => item && (state.skills[item.id]?.level || 0) < 2)
    .map((item) => item.name);

  return {
    ...intelligence,
    blockers,
    trace: [
      `North Star alignment: ${skill.domain}`,
      `Capability gap: ${intelligence.gap}/${Math.max(1, skill.target)}`,
      `Dependency unlock value: ${intelligence.unlockValue}`,
      blockers.length ? `Blocked by: ${blockers.join(', ')}` : 'Prerequisites satisfied',
      intelligence.evidence > 0 ? 'Evidence exists' : 'Evidence required',
    ],
  };
}

export function selectIntelligentMission(state) {
  if (!state.baseline) {
    return {
      type: 'baseline',
      title: 'Complete Career Baseline Assessment',
      reason: 'JARVIS needs evidence of your actual starting capability before selecting a technical path.',
      trace: ['No baseline', 'Assessment is the highest-value next action'],
    };
  }

  const candidates = SKILLS
    .filter((skill) => (state.skills[skill.id]?.level || 0) < skill.target)
    .map((skill) => ({ skill, intelligence: getSkillIntelligence(skill, state) }))
    .filter(({ intelligence }) => intelligence.prerequisiteRisk === 0)
    .sort((a, b) => b.intelligence.priority - a.intelligence.priority);

  const first = candidates[0];
  if (!first) {
    return {
      type: 'audit',
      title: 'Run Career State Audit',
      reason: 'No unlocked capability gap is currently actionable. JARVIS should reassess evidence, dependencies and targets before advancing.',
      trace: ['No actionable unlocked gap', 'Audit required'],
    };
  }

  const explanation = explainMission(first.skill, state);
  return {
    type: 'skill',
    skillId: first.skill.id,
    title: `Build ${first.skill.name}`,
    reason: `Selected because it has a ${explanation.gap}-level gap, ${explanation.unlockValue} downstream unlock opportunity, and strong alignment with the 2028 North Star.`,
    intelligence: explanation,
    trace: explanation.trace,
  };
}

export function calculateReadiness(state) {
  const values = SKILLS.map((skill) => {
    const record = state.skills[skill.id] || {};
    const level = Number(record.level) || 0;
    const target = Number(skill.target) || 1;
    return Math.min(1, level / target);
  });
  return Math.round((values.reduce((a, b) => a + b, 0) / Math.max(1, values.length)) * 100);
}
