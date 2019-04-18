import { createProject } from "./data";

export function uiNewProject() {
  const name = prompt('Project Name');
  if(!name) return;
  
  createProject(name);
}
