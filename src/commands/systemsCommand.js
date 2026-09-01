export const systemsDomains = {
  computing: ['Operating systems','Processes','Memory','Filesystems','Permissions'],
  linux: ['Shell','Users and groups','Services','Networking','Logs','Package management'],
  networking: ['TCP/IP','DNS','HTTP/HTTPS','TLS','Routing','Firewalls','VPN','Packet analysis'],
  engineering: ['Git','Testing','Debugging','APIs','Databases','Containers','CI/CD','Observability'],
  architecture: ['System design','Reliability','Security boundaries','Threat modeling','Failure analysis']
};

export function createSystemsProfile() {
  return { domains: systemsDomains, currentLevel: 0, targetLevel: 5, evidence: [], lastReviewed: null };
}

export function calculateSystemsReadiness(profile = {}) {
  const levels = Object.values(profile.skillLevels || {});
  if (!levels.length) return 0;
  return Math.round((levels.reduce((a, b) => a + Number(b || 0), 0) / levels.length) * 100 / 6);
}

export function createEngineeringTask({ title, objective, acceptanceCriteria = [], prerequisites = [] }) {
  if (!title || !objective) throw new Error('Engineering task requires title and objective');
  return { id: `eng-${Date.now()}`, title, objective, acceptanceCriteria, prerequisites, status: 'queued', evidence: [], createdAt: new Date().toISOString() };
}

export function completeEngineeringTask(task, evidence) {
  if (!task?.id || !evidence) throw new Error('Task and evidence are required');
  return { ...task, status: 'completed', evidence: [...task.evidence, { ...evidence, addedAt: new Date().toISOString() }] };
}
