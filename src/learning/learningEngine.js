export const learningStages=['ASSESS','EXPLAIN','PRACTICE','LAB','BUILD','BREAK','FIX','PROVE','DOCUMENT','RECALCULATE'];
export const masteryLevels={0:'Unassessed',1:'Aware',2:'Beginner',3:'Developing',4:'Competent',5:'Advanced',6:'Professional'};
export function createLearningSession(skill){return {id:`learn-${skill.id}`,skillId:skill.id,stage:'ASSESS',startedAt:new Date().toISOString(),completedStages:[],evidence:[],notes:''};}
export function advanceSession(session,stage){if(!learningStages.includes(stage))throw new Error('Invalid learning stage');return {...session,stage,completedStages:[...new Set([...session.completedStages,stage])]};}
export function nextLearningStage(session){const i=learningStages.indexOf(session.stage);return i<learningStages.length-1?learningStages[i+1]:null;}
export function addEvidence(session,evidence){if(!evidence?.type||!evidence?.description)throw new Error('Evidence requires type and description');return {...session,evidence:[...session.evidence,{...evidence,createdAt:new Date().toISOString()}]};}
export function sessionIsProven(session){return session.completedStages.includes('PROVE')&&session.evidence.length>0;}
