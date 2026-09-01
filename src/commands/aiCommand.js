export const aiDomains = {
  fundamentals: ['AI concepts','Machine learning concepts','Evaluation and reliability'],
  llm: ['LLM concepts','Prompting','Context and token economics','Embeddings','RAG','Tool calling','Agents'],
  engineering: ['Model/API integration','Structured outputs','Evaluation','Observability','Cost and latency'],
  safety: ['Prompt injection','Data leakage','Tool abuse','Excessive agency','RAG poisoning','Model supply chain','AI threat modeling'],
  openai: ['OpenAI platform concepts','API integration patterns','Agentic application patterns','Safety and evaluation']
};

export function createAIProfile() {
  return { domains: aiDomains, currentLevel: 0, targetLevel: 5, evidence: [], research: [], lastReviewed: null };
}

export function scoreAIReadiness(profile = {}) {
  const levels = Object.values(profile.skillLevels || {});
  if (!levels.length) return 0;
  return Math.round((levels.reduce((a, b) => a + Number(b || 0), 0) / levels.length) * 100 / 6);
}

export function createAIExperiment({ title, objective, risk = 'low', evaluationCriteria = [] }) {
  if (!title || !objective) throw new Error('AI experiment requires title and objective');
  return { id: `ai-${Date.now()}`, title, objective, risk, evaluationCriteria, status: 'planned', results: [], createdAt: new Date().toISOString() };
}

export function evaluateAIExperiment(experiment, result) {
  if (!experiment?.id || !result) throw new Error('Experiment and result are required');
  return { ...experiment, status: 'evaluated', results: [...experiment.results, { ...result, evaluatedAt: new Date().toISOString() }] };
}
