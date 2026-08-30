export const labStates=['PLANNED','READY','RUNNING','BLOCKED','FAILED','PASSED','DOCUMENTED'];
export function createLab({id,title,skillIds=[],objectives=[],prerequisites=[]}){return {id,title,skillIds,objectives,prerequisites,state:'PLANNED',steps:[],evidence:[],findings:[],createdAt:new Date().toISOString()};}
export function canStartLab(lab,skills={}){return (lab.prerequisites||[]).every(id=>Number(skills[id]?.level||0)>=Number(skills[id]?.requiredLevel||1));}
export function setLabState(lab,state){if(!labStates.includes(state))throw new Error('Invalid lab state');return {...lab,state};}
export function recordLabStep(lab,step){if(!step?.title)throw new Error('Lab step requires a title');return {...lab,steps:[...lab.steps,{...step,completedAt:step.completedAt||new Date().toISOString()}]};}
export function recordFinding(lab,finding){if(!finding?.description)throw new Error('Finding requires a description');return {...lab,findings:[...lab.findings,{...finding,createdAt:new Date().toISOString()}]};}
export function addLabEvidence(lab,evidence){if(!evidence?.type||!evidence?.uri)throw new Error('Lab evidence requires type and URI/reference');return {...lab,evidence:[...lab.evidence,{...evidence,createdAt:new Date().toISOString()}]};}
export function labIsProven(lab){return lab.state==='DOCUMENTED'&&lab.evidence.length>0;}
