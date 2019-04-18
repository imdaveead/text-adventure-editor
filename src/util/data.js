import Emitter from 'eventemitter3';
import { useEffect, useState } from 'react';
import uuid from 'uuid4';

const events = new Emitter();

const defaultCss = `body {
  background: #000;
  color: #fff;
  font-family: sans-serif;
  font-size: 18px;
  margin: auto;
  max-width: 500px;
}

.container {
  margin-top: 20px;
}

a {
  color: #6495ed;
}

a:not(:hover) {
  text-decoration: none;
}

.option.disabled {
  color: #444;
}

.option-separator {
  height: 20px;
  list-style-type: none;
}

.option-broken-link {
  color: #A11;
}
`;

export function getProjectList() {
  return JSON.parse(localStorage.cta_list || '[]');
}
export function getProject(id) {
  return JSON.parse(localStorage[id] || null);
}

export function createProject(name) {
  const projects = getProjectList();
  const id = uuid();
  projects.push({
    id,
    name,
  });
  localStorage.cta_list = JSON.stringify(projects);
  localStorage[id] = JSON.stringify({
    name,
    css: defaultCss,
    scenes: [
      {
        name: 'start',
        prompt: 'Enter your prompt here.',
        options: [],
        action: [],
      }
    ],
    variables: [],
  });
  events.emit('project-list');
}
export function setProjectName(id, name) {
  const project = getProject(id);
  project.name = name;
  localStorage[id] = JSON.stringify(project);

  const projects = getProjectList();
  const i = projects.findIndex((proj) => proj.id === id);
  projects[i].name = name;
  localStorage.cta_list = JSON.stringify(projects);
  
  events.emit('project-list');
  events.emit(id);
}
export function setProjectCss(id, css) {
  const project = getProject(id);
  project.css = css;
  localStorage[id] = JSON.stringify(project);
  events.emit(id);
}
export function addScene(id) {
  const project = getProject(id);
  const sceneName = 'scene_' + project.scenes.length;
  
  project.scenes.push({
    name: sceneName,
    prompt: 'Enter your prompt here.',
    options: [],
    action: [],
  });

  localStorage[id] = JSON.stringify(project);
  events.emit(id);

  return sceneName;
}
export function sceneExists(id, name) {
  const project = getProject(id);
  const sceneInfo = project.scenes.find(x => x.name === name);
  return !!sceneInfo;
}
export function setScenePrompt(id, name, prompt) {
  const project = getProject(id);
  const sceneInfo = project.scenes.find(x => x.name === name);
  
  sceneInfo.prompt = prompt;

  // merge
  project.scenes = project.scenes.map(scene => {
    if(scene.name === name) return sceneInfo;
    return scene;
  });

  localStorage[id] = JSON.stringify(project);
  events.emit(id);
}
export function setSceneName(id, name, newName) {
  const project = getProject(id);
  const sceneInfo = project.scenes.find(x => x.name === name);
  
  sceneInfo.name = newName;

  // merge
  project.scenes = project.scenes.map(scene => {
    if(scene.name === name) return sceneInfo;
    return scene;
  });

  localStorage[id] = JSON.stringify(project);
  events.emit(id);
}
export function addSceneOption(id, name, option) {
  const project = getProject(id);
  const sceneInfo = project.scenes.find(x => x.name === name);
  
  sceneInfo.options.push({
    text: option,
    target: '^null',
  });

  // merge
  project.scenes = project.scenes.map(scene => {
    if(scene.name === name) return sceneInfo;
    return scene;
  });

  localStorage[id] = JSON.stringify(project);
  events.emit(id);
}
export function setSceneOptionText(id, name, i, text) {
  const project = getProject(id);
  const sceneInfo = project.scenes.find(x => x.name === name);
  
  sceneInfo.options[i] = {
    ...sceneInfo.options[i],
    text: text,
  };

  // merge
  project.scenes = project.scenes.map(scene => {
    if(scene.name === name) return sceneInfo;
    return scene;
  });

  localStorage[id] = JSON.stringify(project);
  events.emit(id);
}
export function setSceneOptionTarget(id, name, i, target) {
  const project = getProject(id);
  const sceneInfo = project.scenes.find(x => x.name === name);
  
  sceneInfo.options[i] = {
    ...sceneInfo.options[i],
    target: target,
  };

  // merge
  project.scenes = project.scenes.map(scene => {
    if(scene.name === name) return sceneInfo;
    return scene;
  });

  localStorage[id] = JSON.stringify(project);
  events.emit(id);
}
export function deleteProject(id) {
  localStorage.removeItem(id);
  const projects = getProjectList();
  localStorage.cta_list = JSON.stringify(projects.filter(x => x.id !== id));    
  events.emit('project-list')
}

export function useProjectList() {
  const [projects, setProjects] = useState(getProjectList());
  useEffect(() => {
    const cb = () => {
      setProjects(getProjectList());
    }
    events.on('project-list', cb);
    return () => events.off('project-list', cb);
  }, []);
  return projects;
}

export function useProject(id) {
  const [project, setProject] = useState(getProject(id));
  useEffect(() => {
    const cb = () => {
      setProject(getProject(id))
    }
    events.on(id, cb);
    return () => events.off(id, cb);
  }, []);
  return project;
}
