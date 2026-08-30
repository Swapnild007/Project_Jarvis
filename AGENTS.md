# JARVIS Career OS — Codex Engineering Contract

## Mission
Build a real, maintainable personal Career Operating System for the North Star: become job-ready in Cybersecurity, progress toward Security Engineering, specialize in AI/LLM/Agent Security, and prepare for frontier-AI opportunities by 29 November 2028.

## Non-negotiables
- Treat the repository as the single source of truth.
- Build a real application, not static mockups.
- Preserve shared Career State across every module.
- Never make Python the center of the roadmap.
- Never recommend advanced work before prerequisites are evidenced.
- Never mark mastery from course completion alone.
- Every meaningful capability needs evidence through assessment, lab, project, or demonstrated work.
- Keep the user at beginner level initially, while teaching toward professional depth.
- Adapt to breaks, limited time, failure, and changing career requirements.
- Do not expose secrets or hardcode credentials.
- Do not modify locked/finalized product areas without explicit authorization.

## Build lifecycle
1. Inspect repository and current state.
2. Plan the smallest coherent change.
3. Implement with tests.
4. Run validation and fix failures.
5. Review architecture and regressions.
6. Document the change.
7. Commit only verified work.

## Architecture direction
Use clear separation between UI, application services, domain logic, persistence, integrations, and tests. The core domain must include Career State, Skill Graph, Mission Engine, Learning, Assessment, Evidence, Projects, Research, and Career Strategy. All modules must consume shared domain state rather than duplicating it.

## Career dependency domains
Foundations → Systems → Networking → Engineering → Cybersecurity → Security Operations → Security Engineering → Application/Cloud/DevSecOps → AI Engineering → AI/LLM/Agent Security → Portfolio → Career Transition.

This is a dependency graph, not a rigid linear course.

## Mission lifecycle
Assess → Plan → Learn → Practice → Lab → Build → Break → Fix → Assess → Document → Prove → Recalculate → Advance.

## First-run rule
Until a real baseline assessment is completed, the only primary mission may be completion of the Career Baseline Assessment. Never hardcode an advanced technical mission for an unassessed user.

## User command
When the user says "Jarvis, let's do next in our pivot", recover persisted Career State, evaluate dependencies, evidence, retention, goals, market relevance, and available time, then select one highest-value next mission and explain why.

## Quality bar
No fake progress, fake mastery, decorative-only graphs, dead buttons, disconnected modules, or placeholder functionality presented as complete. Prefer small verified increments over giant rewrites.
