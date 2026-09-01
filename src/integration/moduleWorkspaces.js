export const WORKSPACES={
'01':{mode:'architect',title:'Career Architect',actions:['Review North Star','Review career dependency graph','Lock approved direction']},
'02':{mode:'mission',title:'Mission Control',actions:['View active mission','Review mission evidence','Mark mission ready for assessment']},
'03':{mode:'decision',title:'Next Mission Engine',actions:['Recalculate next mission','Inspect dependencies','Inspect decision factors']},
'04':{mode:'state',title:'Career State & Memory',actions:['Inspect current state','Record checkpoint','Review state history']},
'05':{mode:'learn',title:'Learning OS',actions:['Start lesson','Practice','Deep Dive','Request resources']},
'06':{mode:'skills',title:'Skill Matrix',actions:['Filter domain','Inspect prerequisites','Review evidence']},
'07':{mode:'assessment',title:'Assessment Engine',actions:['Run assessment','Review score','Create evidence']},
'08':{mode:'revision',title:'Revision & Retention',actions:['Open revision queue','Review weak skills','Schedule review']},
'09':{mode:'lab',title:'Lab Operations',actions:['Select lab','Check prerequisites','Run lab','Submit evidence']},
'10':{mode:'portfolio',title:'Projects & Portfolio',actions:['Select project','Track milestone','Attach proof','Review portfolio readiness']},
'11':{mode:'code',title:'Code Review & Engineering Mentor',actions:['Review code','Check security','Explain failure','Improve implementation']},
'12':{mode:'security',title:'Cybersecurity Command',actions:['Security fundamentals','Threat model','Detection practice','Incident simulation']},
'13':{mode:'ai',title:'AI / OpenAI Command',actions:['AI fundamentals','LLM engineering','Agents & tools','AI security']},
'14':{mode:'systems',title:'Systems & Engineering Command',actions:['Linux','Networking','APIs','Architecture','Troubleshooting']},
'15':{mode:'cloud',title:'Cloud & DevSecOps Command',actions:['Cloud fundamentals','IAM','Containers','CI/CD','Cloud security']},
'16':{mode:'research',title:'Research & Resource Intelligence',actions:['Find authoritative resource','Verify freshness','Build research brief','Save resource']},
'17':{mode:'market',title:'Career Market Intelligence',actions:['Inspect target roles','Compare skill requirements','Identify market gaps']},
'18':{mode:'audit',title:'Reality Check & Audit',actions:['Run capability audit','Check evidence','Check timeline','Review warnings']},
'19':{mode:'transition',title:'Career Strategy & Job Transition',actions:['Select target role','Build transition plan','Track applications','Prepare evidence']},
'20':{mode:'interview',title:'Interview Preparation',actions:['Technical practice','Scenario practice','Project defense','Behavioral practice']},
'21':{mode:'certification',title:'Certification Strategy',actions:['Compare certifications','Check readiness','Evaluate ROI','Choose or defer']},
'22':{mode:'journal',title:'Learning Journal',actions:['Record learning','Record failure','Record breakthrough','Search history']},
'23':{mode:'analytics',title:'Progress Analytics',actions:['Career progress','Skill growth','Evidence growth','Timeline health']},
'24':{mode:'recovery',title:'Backup / Recovery / Export',actions:['Create snapshot','Export state','Validate backup','Restore checkpoint']},
'25':{mode:'settings',title:'JARVIS System Settings',actions:['Career settings','Learning depth','Security controls','Data controls']}
};
export const WORKSPACE_RULES={sharedState:true,evidenceRequired:true,noFakeProgress:true,lockedModulesProtected:true,externalResourcesAllowed:true,deepDiveAvailable:true};
export function getWorkspace(id){return WORKSPACES[id]||null;}
