import React, { useLayoutEffect, useState } from 'react';
import { useProject } from '../util/data';
import { Typography, Toolbar, AppBar, Button } from '@material-ui/core';

function SceneRenderer({ setScene, scene, sceneId, prevScene, exit, debug }) {
  if(!scene) {
    return <>
      <h1>CTA Game Engine Error</h1>
      {
        sceneId === 'start' ? (
          <>
            <p>
              Could not find a Starting Scene. Make sure you have a scene named "start"
              </p>
            {
              debug && (
                <>
                  <br /><br />
                  <button onClick={() => exit({ createStartScene: true, scene: 'start' })}>Create Start Scene</button>
                </>
              )
            }
          </>
        ) : (
            <p>
              Cannot find scene "{sceneId}"{prevScene && `, from scene "${prevScene}"`}
            </p>
          )
      }
    </>;
  }

  return <>
  <div className='prompt'>
    <p>
      {scene.prompt}
    </p>
  </div>
    <div className='option-container'>
      <ul className='option-list'>
        {
          scene.options.map((opt, i) => {
            return <li className='option' key={i}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" onClick={(ev) => {
                ev.preventDefault();
                setScene(opt.target);
              }}>
                {opt.text}
              </a>
            </li>
          })
        }
      </ul>
    </div>
        </>;
}

function Game({ id, scene: defaultScene, defaultVars = {}, exit, debug: defaultDebug }) {
  const project = useProject(id);
  const [prevScene, setPrevScene] = useState(null);
  const [debug, setDebug] = useState(defaultDebug);
  const [sceneId, setSceneId] = useState(defaultScene || 'start');
  // const [vars, setVar] = useState(defaultVars);

  function setScene(newScene) {
    setPrevScene(sceneId);
    setSceneId(newScene);
  }

  const scene = project.scenes.find(scene => scene.name === sceneId);

  useLayoutEffect(() => {
    document.body.classList.add('cta');
    return () => {
      document.body.classList.remove('cta');
    }
  });

  const DebugBar = debug && <>
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            TAC (0.1.2 beta) - Playing "{project.name}"
          </Typography>
          <Button variant='outlined' onClick={() => exit()}>
            Exit
          </Button>
          <Button variant='outlined' onClick={() => exit({ scene: sceneId })}>
            Edit this scene
          </Button>
          <Button variant='outlined' onClick={() => setDebug()}>
            Hide Debug
          </Button>
        </Toolbar>
      </AppBar>
    </div>
    <AppBar aria-hidden position="static" style={{ boxShadow: 'none', pointerEvents: 'none' }}>
      <Toolbar />
    </AppBar>
  </>;

  return <div className='root'>
    <style>{project.css}</style>
    {
      DebugBar
    }
    <div className='container'>
      <SceneRenderer {...{ setScene, scene, sceneId, prevScene, exit, debug }} />
    </div>
  </div>;
}

export default Game;
