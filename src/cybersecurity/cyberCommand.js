export const cyberDomains={
FOUNDATIONS:['Security principles','CIA triad','Risk management','Authentication and authorization','Cryptography'],
NETWORK_SECURITY:['TCP/IP security','DNS security','HTTP/TLS','Firewalls','VPN','Network monitoring','Packet analysis'],
SECURITY_OPERATIONS:['SOC workflow','Log analysis','SIEM','Detection engineering','EDR/XDR','Incident response','Threat intelligence','Threat hunting','MITRE ATT&CK'],
APPLICATION_SECURITY:['Secure SDLC','OWASP','Web security','API security','Secrets management','Threat modeling','Vulnerability management'],
CLOUD_SECURITY:['Cloud IAM','Network controls','Containers','Kubernetes security','CI/CD security','Infrastructure as code','Cloud detection'],
AI_SECURITY:['Prompt injection','Indirect injection','Data leakage','RAG poisoning','Excessive agency','Tool abuse','Model supply chain','AI threat modeling']
};

export function cyberReadiness(skills={}){
 const names=Object.values(cyberDomains).flat();
 const rows=names.map(name=>skills[name]||{name,level:0});
 const assessed=rows.filter(s=>Number(s.level)>0).length;
 const proven=rows.filter(s=>Number(s.level)>=4).length;
 return {total:rows.length,assessed,proven,coveragePct:Math.round(assessed/rows.length*100),professionalPct:Math.round(proven/rows.length*100),domains:cyberDomains};
}

export function threatModel(target){return {target,assets:[],trustBoundaries:[],threats:[],controls:[],residualRisk:'UNASSESSED',status:'DRAFT'};}
