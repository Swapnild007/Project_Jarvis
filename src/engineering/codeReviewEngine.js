export const reviewDimensions=['correctness','readability','maintainability','testing','security','performance','errorHandling','documentation'];

export function reviewCode({code='',language='unknown',context=''}){
  const findings=[];
  if(!code.trim()) findings.push({severity:'BLOCKER',dimension:'correctness',message:'No code supplied for review.'});
  if(code.includes('TODO')||code.includes('FIXME')) findings.push({severity:'INFO',dimension:'maintainability',message:'Unresolved implementation marker found.'});
  if(/password\s*=|api[_-]?key\s*=|secret\s*=/i.test(code)) findings.push({severity:'CRITICAL',dimension:'security',message:'Possible hardcoded secret detected. Remove it and use secure secret management.'});
  if(/eval\s*\(|exec\s*\(/.test(code)) findings.push({severity:'HIGH',dimension:'security',message:'Dynamic code execution detected. Validate whether it is necessary and safely constrained.'});
  if(!/test|assert|expect/i.test(code)) findings.push({severity:'MEDIUM',dimension:'testing',message:'No obvious test/assertion evidence found. Add tests for meaningful behavior.'});
  return {language,context,findings,reviewedAt:new Date().toISOString(),status:findings.some(f=>f.severity==='CRITICAL'||f.severity==='BLOCKER')?'NEEDS_REVISION':'REVIEWED'};
}

export function engineeringGate(review){return review?.findings?.every(f=>!['CRITICAL','BLOCKER','HIGH'].includes(f.severity))===true;}
