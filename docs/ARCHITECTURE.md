# JARVIS Career OS Architecture

## North Star
**29 November 2028**

Cybersecurity → Security Engineering → AI/LLM/Agent Security, with capability development for future opportunities involving ChatGPT/OpenAI or equivalent frontier-AI organizations.

## Shared state
All modules consume and update one Career State:

- North Star and target roles
- Current phase and milestone
- Skill levels and dependencies
- Assessments and evidence
- Missions and checkpoints
- Labs and projects
- Revision/retention
- Research and career intelligence
- Journal and progress

## Core services

1. Career State service
2. Skill Graph service
3. Mission Engine
4. Learning Engine
5. Assessment Engine
6. Evidence/Lab service
7. Project service
8. Career Intelligence service
9. Research service
10. Analytics service

## Decision model
The Next Mission Engine evaluates prerequisites, dependency unlocks, career relevance, capability gaps, evidence value, retention, project requirements, market relevance, previous failures and feasibility.

It returns one primary next mission.

## Module map
01 Core / Career Architect
02 Mission Control
03 Next Mission Engine
04 Career State & Memory
05 Learning / Teaching OS
06 Skill Matrix
07 Assessment
08 Revision / Retention
09 Labs
10 Projects / Portfolio
11 Code Review
12 Cybersecurity Command
13 AI / OpenAI Command
14 Systems / Engineering
15 Cloud / DevSecOps
16 Research Intelligence
17 Career Market Intelligence
18 Reality Check / Audit
19 Career Strategy / Job Transition
20 Interview Preparation
21 Certification Strategy
22 Learning Journal
23 Progress Analytics
24 Backup / Recovery / Export
25 System Settings

## Engineering rules
- No static-only modules.
- No fake progress or mastery.
- No hardcoded next technology.
- No secrets in source control.
- Keep UI, domain logic and persistence separate.
- Test every major domain service.
- Frozen modules are changed only by explicit authorization.
