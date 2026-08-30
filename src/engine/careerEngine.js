import { SKILLS } from '../data/careerGraph';
import { selectIntelligentMission } from './intelligenceEngine';

export const LEVELS = ['Unassessed','Awareness','Beginner','Developing','Competent','Professional','Advanced'];

export function createInitialSkills() {
  return Object.fromEntries(SKILLS.map(s => [s.id, { level:0, confidence:0, evidence:[], lastAssessed:null }]));
}

export function prerequisiteReady(skill, state) {
  return skill.prerequisites.every(id => (state.skills[id]?.level || 0) >= 2);
}

export function getUnlockedSkills(state) {
  return SKILLS.filter(s => (state.skills[s.id]?.level || 0) < s.target && prerequisiteReady(s, state));
}

export function getSkillGap(skill, state) {
  const current = state.skills[skill.id]?.level || 0;
  return Math.max(0, skill.target - current);
}

export function selectNextMission(state) {
  return selectIntelligentMission(state);
}

export function applyAssessment(state, answers) {
  const skills = {...state.skills};
  Object.entries(answers).forEach(([id, result]) => {
    skills[id] = { level:result.level, confidence:result.confidence, evidence:result.evidence || [], lastAssessed:new Date().toISOString() };
  });
  const nextState = {...state, skills, baseline:true, phase:'FOUNDATIONS'};
  const mission = selectIntelligentMission(nextState);
  return {...nextState, currentMission:mission.title};
}
