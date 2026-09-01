import {readFile} from 'node:fs/promises';
const required=['src/integration/moduleRegistry.js','src/integration/moduleWorkspace.js','src/qa/integrationAudit.js','src/qa/securityPolicy.js','docs/FINAL_RELEASE_GATE.md'];
for(const file of required)await readFile(file,'utf8');
const registry=await readFile('src/integration/moduleRegistry.js','utf8');
if(!registry.includes("['25','System Settings'"))throw new Error('Module registry incomplete');
const main=await readFile('src/main.jsx','utf8');
if(!main.includes("<ModuleWorkspace"))throw new Error('Workspace not wired into main UI');
console.log('JARVIS integration smoke check: PASS');
