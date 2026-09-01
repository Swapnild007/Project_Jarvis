import {prioritizeRoles} from './marketIntelligence.js';
import {auditCareer} from './realityAudit.js';
export function careerIntelligence(state={},roles=[]){return {audit:auditCareer(state),roleMatches:prioritizeRoles(roles,state)};}
