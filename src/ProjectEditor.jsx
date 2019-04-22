import React, { useState } from 'react';
import { withStyles, createStyles, Button, List, ListItem, ListItemText } from '@material-ui/core';
import { useProject, deleteProject, addScene, setScenePrompt, addSceneOption, setSceneOptionText, setSceneOptionTarget, setSceneName, setProjectCss, setProjectName, sceneExists } from './util/data';

const styles = (theme) => createStyles({
  root: {
    paddingTop: theme.spacing.unit * 3,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
  },
});

function ProjectEditor({ classes: c, close, id, play, defaultState }) {
  if (!defaultState) defaultState = {};
  const project = useProject(id);
  const [createStartScene, setCreateStartScene] = useState(defaultState.createStartScene);
  const [scene, setScene] = useState(defaultState.scene || null);
  const [autofocus, setAutoFocus] = useState(false);
  const [editSceneName, setEditSceneName] = useState(false);
  const [editProjectName, setEditProjectName] = useState(false);
  const [cssEditor, setCssEditor] = useState(false);

  if (createStartScene) {
    console.log('createStartScene');

    setCreateStartScene(false);

    setTimeout(() => {
      if (!sceneExists(id, 'start')) {
        addScene(id, 'start');
      }
    }, 100);

    return null;
  }

  // do some sanity checks
  if (cssEditor && scene) {
    setCssEditor(false);
  }
  if((cssEditor || scene) && editProjectName) {
    setEditProjectName(false);
  }
  if((cssEditor || !scene) && editSceneName) {
    setEditSceneName(false);
  }

  const del = () => {
    // eslint-disable-next-line no-restricted-globals
    if(confirm('delete project "' + project.name + '"')) {
      deleteProject(id);
      close();
    }
  }
  const newScene = () => {
    setScene(addScene(id));
  }

  if (scene) {
    const sceneInfo = project.scenes.find(x => x.name === scene);
    
    if(!sceneInfo) {
      return <div className={c.root}>
        <Button onClick={() => setScene(null)}>exit</Button>     
        <h1>{scene}</h1>
        <p>
          this scene does not exist
          <button onClick={() => addScene(id, scene)}>create</button>
        </p>
      </div>
    }

    return <div className={c.root}>
      <Button onClick={() => setScene(null)}>exit</Button>
      <Button onClick={() => play(scene, null, {scene})}>test</Button>
      <h1>
        {
          editSceneName ? (
            <>
              <form onSubmit={(ev) => {
                ev.preventDefault();
                setSceneName(id, scene, editSceneName.name);
                setScene(editSceneName.name);
                setEditSceneName(false);
              }}>
                <input
                  type="text"
                  value={editSceneName.name}
                  autoFocus
                  onChange={(ev) => {
                    setEditSceneName({
                      name: ev.target.value
                    });
                  }}
                />
                <input type='submit' value='done'/>
              </form>
            </>
          ) : (
            <>
              {scene}
              {''}
              <button onClick={() => setEditSceneName({ name: scene })}>rename</button>
            </>
          )
        }
      </h1>
      <textarea
        cols="50"
        rows="7"
        placeholder='Enter your prompt here.'
        value={sceneInfo.prompt}
        onChange={(ev) => {
          setScenePrompt(id, scene, ev.target.value);
        }}
      />
      <br/>
      {
        sceneInfo.options.map((opt, i) => {
          return <div key={i}>
            <input
              type="text"
              value={opt.text}
              onChange={(ev) => {
                setSceneOptionText(id, scene, i, ev.target.value);
              }}
              autoFocus={autofocus && (i === sceneInfo.options.length - 1)}
            />
            <select
              value={opt.target}
              onChange={(ev) => {
                if(ev.target.value === '^new') {
                  setSceneOptionTarget(id, scene, i, addScene(id));
                } else {
                  setSceneOptionTarget(id, scene, i, ev.target.value);
                }
              }}>
              <option value='^null'>[nowhere]</option>
              <option value='^new'>[add new]</option>
              {
                project.scenes.map(scene => {
                  return <option value={scene.name} key={scene.name}>{scene.name}</option>;
                })
              }
            </select>
            {
              opt.target !== '^null' && (
                <button
                  disabled={opt.target === scene}
                  onClick={() => setScene(opt.target)}
                >goto</button>
              )
            }
          </div>
        })
      }
      <input
        style={{ display: 'block' }}
        type="text"
        value=''
        onChange={(ev) => {
          // add new
          addSceneOption(id, scene, ev.target.value);
          setAutoFocus(true);
          setTimeout(() => {
            setAutoFocus(false);
          }, 500);
        }}
        placeholder='[add new]'
      />
      <br/>
      <Button
        variant='outlined'
        onClick={() => {

        }}
      >
        delete scene
      </Button>
    </div>
  }

  if (cssEditor) {
    return <div className={c.root}>
      <Button onClick={() => setCssEditor(false)}>exit</Button>
      <h2>css editor</h2>
      <textarea
        rows='20'
        cols='50'
        value={project.css}
        onChange={(ev) => {
          setProjectCss(id, ev.target.value);
        }}
      />
    </div>
  }

  return <div className={c.root}>
    <Button onClick={close}>exit</Button>
    <Button onClick={() => play()}>play</Button>
    <h1>
      {
        editProjectName !== false ? (
          <>
            Project:
            {' '}
            <form onSubmit={(ev) => {
              setProjectName(id, editProjectName);
              setEditProjectName(false);
              ev.preventDefault();
            }} style={{ display: 'inline-block' }}>
              <input
                onChange={(ev) => {
                  setEditProjectName(ev.target.value);
                }}
                value={editProjectName}
                autoFocus
                type="text"
              />
              <input type='submit' value='save' />
            </form>
          </>
        ) : (
          <>
            Project: {project.name}
            {' '}
            <button onClick={() => setEditProjectName(project.name)}>rename</button>
          </>
        )
      }
    </h1>

    <h2>scenes</h2>
    <Button variant='outlined' onClick={newScene}>add</Button>
    <List component="nav">
      {
        project.scenes.map(scene => {
          return <ListItem button key={scene.name} onClick={() => setScene(scene.name)}>
            <ListItemText primary={scene.name} />
          </ListItem>;
        })
      }
    </List>

    <h2>advanced</h2>
    <Button
      variant='outlined'
      onClick={() => setCssEditor(true)}
    >
      Edit CSS
    </Button>

    <h2>danger</h2>
    <Button variant='outlined' onClick={del}>delete project</Button>
  </div>;
}

export default withStyles(styles)(ProjectEditor);
