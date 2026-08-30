import { SKILLS } from '../data/careerGraph';
import { selectIntelligentMission } from './intelligenceEngine';

export const MISSION_STATUSES = ['proposed', 'accepted', 'active', 'submitted', 'verified', 'rejected'];

export function createMission(state) {
  const recommendation = selectIntelligentMission(state);
  return {
    id: `mission-${Date.now()}`,
    type: recommendation.type,
    skillId: recommendation.skillId || null,
    title: recommendation.title,
    reason: recommendation.reason,
    trace: recommendation.trace || [],
    status: 'proposed',
    createdAt: new Date().toISOString(),
    acceptedAt: null,
    completedAt: null,
    evidence: [],
    score: null,
    feedback: null,
  };
}

export function transitionMission(mission, status) {
  if (!MISSION_STATUSES.includes(status)) throw new Error(`Invalid mission status: ${status}`);
  const now = new Date().toISOString();
  return {
    ...mission,
    status,
    acceptedAt: status === 'accepted' && !mission.acceptedAt ? now : mission.acceptedAt,
    completedAt: ['verified', 'rejected'].includes(status) ? now : mission.completedAt,
  };
}

export function addMissionEvidence(mission, evidence) {
  const item = {
    id: `evidence-${Date.now()}`,
    kind: evidence.kind || 'note',
    title: evidence.title || 'Untitled evidence',
    detail: evidence.detail || '',
    artifact: evidence.artifact || null,
    score: Math.max(0, Math.min(100, Number(evidence.score) || 0)),
    createdAt: new Date().toISOString(),
  };
  return { ...mission, evidence: [...(mission.evidence || []), item], status: 'submitted' };
}

export function evaluateMission(mission) {
  const evidence = mission.evidence || [];
  if (!evidence.length) return { status: 'rejected', score: 0, feedback: 'No evidence submitted. Build or demonstrate the capability before claiming completion.' };
  const score = Math.round(evidence.reduce((sum, item) => sum + (Number(item.score) || 0), 0) / evidence.length);
  if (score >= 70) return { status: 'verified', score, feedback: 'Evidence is strong enough to count as demonstrated capability. Reassess later for retention.' };
  return { status: 'rejected', score, feedback: 'Evidence is not yet strong enough. Fix the gaps, produce stronger proof, and resubmit.' };
}

export function completeMission(state, mission) {
  const result = evaluateMission(mission);
  const nextMission = result.status === 'verified'
    ? selectIntelligentMission(state)
    : null;
  const history = [...(state.missions || []), { ...mission, ...result, completedAt: new Date().toISOString() }].slice(-50);
  return {
    ...state,
    missions: history,
    currentMission: nextMission?.title || mission.title,
    missionStatus: result.status,
  };
}

export function getMissionSkill(mission) {
  return mission?.skillId ? SKILLS.find((skill) => skill.id === mission.skillId) || null : null;
}
