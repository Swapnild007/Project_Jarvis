export const DOMAINS = [
  'Foundations','Systems','Networking','Engineering','Cybersecurity','Security Operations',
  'Security Engineering','Application Security','Cloud / DevSecOps','AI Engineering','AI Security','Projects','Career'
];

export const SKILLS = [
  {id:'computer-fundamentals',name:'Computer Fundamentals',domain:'Foundations',target:4,prerequisites:[]},
  {id:'data-literacy',name:'Excel & Data Literacy',domain:'Foundations',target:3,prerequisites:['computer-fundamentals']},
  {id:'programming-fundamentals',name:'Programming Fundamentals',domain:'Engineering',target:4,prerequisites:['computer-fundamentals']},
  {id:'python',name:'Python',domain:'Engineering',target:4,prerequisites:['programming-fundamentals']},
  {id:'sql',name:'SQL',domain:'Engineering',target:3,prerequisites:['data-literacy']},
  {id:'git',name:'Git & Version Control',domain:'Engineering',target:3,prerequisites:['computer-fundamentals']},
  {id:'linux',name:'Linux Fundamentals',domain:'Systems',target:4,prerequisites:['computer-fundamentals']},
  {id:'windows',name:'Windows Administration',domain:'Systems',target:3,prerequisites:['computer-fundamentals']},
  {id:'networking',name:'Networking Fundamentals',domain:'Networking',target:4,prerequisites:['computer-fundamentals']},
  {id:'web-protocols',name:'HTTP, DNS & TLS',domain:'Networking',target:4,prerequisites:['networking']},
  {id:'cyber-fundamentals',name:'Cybersecurity Fundamentals',domain:'Cybersecurity',target:4,prerequisites:['networking','linux']},
  {id:'iam',name:'Identity & Access Management',domain:'Cybersecurity',target:4,prerequisites:['cyber-fundamentals']},
  {id:'cryptography',name:'Cryptography Fundamentals',domain:'Cybersecurity',target:3,prerequisites:['cyber-fundamentals']},
  {id:'logs',name:'Security Logs & Analysis',domain:'Security Operations',target:4,prerequisites:['cyber-fundamentals','linux']},
  {id:'siem',name:'SIEM Fundamentals',domain:'Security Operations',target:4,prerequisites:['logs']},
  {id:'incident-response',name:'Incident Response',domain:'Security Operations',target:4,prerequisites:['siem']},
  {id:'threat-intel',name:'Threat Intelligence',domain:'Security Operations',target:3,prerequisites:['cyber-fundamentals']},
  {id:'secure-coding',name:'Secure Coding',domain:'Security Engineering',target:4,prerequisites:['programming-fundamentals','cyber-fundamentals']},
  {id:'security-architecture',name:'Security Architecture',domain:'Security Engineering',target:5,prerequisites:['cyber-fundamentals','networking','iam']},
  {id:'appsec',name:'Application Security',domain:'Application Security',target:4,prerequisites:['web-protocols','secure-coding']},
  {id:'cloud',name:'Cloud Fundamentals',domain:'Cloud / DevSecOps',target:3,prerequisites:['linux','networking']},
  {id:'devsecops',name:'DevSecOps',domain:'Cloud / DevSecOps',target:4,prerequisites:['cloud','git','secure-coding']},
  {id:'ai-fundamentals',name:'AI Fundamentals',domain:'AI Engineering',target:3,prerequisites:['programming-fundamentals']},
  {id:'llm',name:'LLM Fundamentals',domain:'AI Engineering',target:4,prerequisites:['ai-fundamentals']},
  {id:'rag-agents',name:'RAG & Agents',domain:'AI Engineering',target:4,prerequisites:['llm','python']},
  {id:'ai-threat-modeling',name:'AI Threat Modeling',domain:'AI Security',target:5,prerequisites:['llm','cyber-fundamentals']},
  {id:'ai-security',name:'LLM / Agent Security',domain:'AI Security',target:5,prerequisites:['rag-agents','ai-threat-modeling']},
  {id:'portfolio',name:'Security Portfolio Evidence',domain:'Projects',target:4,prerequisites:['incident-response','secure-coding']},
  {id:'career-readiness',name:'Career Readiness',domain:'Career',target:4,prerequisites:['portfolio']}
];
