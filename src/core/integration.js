import {mergeSettings} from '../settings/jarvisSettings.js';
import {careerIntelligence} from '../career/careerIntelligence.js';
import {buildRevisionQueue} from '../learning/revisionEngine.js';
export function buildJarvisState(input={}){const settings=mergeSettings(input.settings||{},{});const skills=input.skills||{};const state={...input,settings,skills};return {...state,intelligence:careerIntelligence(state,input.roles||[]),revisionQueue:buildRevisionQueue(skills)};}
export function nextAction(state={}){const queue=state.revisionQueue||[];const mission=state.nextMission;return mission||queue[0]||{type:'baseline',title:'Complete your baseline assessment',priority:100};}
export function commandResult(command,state={}){const normalized=String(command||'').trim().toLowerCase();if(normalized.includes('next'))return nextAction(state);if(normalized.includes('audit'))return state.intelligence?.audit||null;if(normalized.includes('revision'))return state.revisionQueue||[];return {type:'help',message:'Commands: next mission, audit career, revision queue'};}
