import { SKILLS } from '../data/careerGraph';

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
  if (!state.baseline) return { type:'baseline', title:'Complete Career Baseline Assessment', reason:'JARVIS needs evidence of your actual starting capability before selecting a technical path.' };
  const candidates = getUnlockedSkills(state)
    .map(skill => ({skill, gap:getSkillGap(skill,state)}))
    .sort((a,b) => b.gap-a.gap);
  const first = candidates[0];
  if (!first) return { type:'review', title:'Review career state', reason:'No currently unlocked skill gap is available. Reassess completed capabilities and unlock the next dependency.' };
  return {
    type:'skill', skillId:first.skill.id, title:`Build ${first.skill.name}`,
    reason:`This skill is currently unlocked and has a ${first.gap}-level gap to its target. Its prerequisites are satisfied.`
  };
}

export function applyAssessment(state, answers) {
  const skills = {...state.skills};
  Object.entries(answers).forEach(([id, result]) => {
    skills[id] = { level:result.level, confidence:result.confidence, evidence:result.evidence || [], lastAssessed:new Date().toISOString() };
  });
  return {...state, skills, baseline:true, phase:'FOUNDATIONS', currentMission:selectNextMission({...state,skills,baseline:true}).title};
}
