import React, { useLayoutEffect, useState } from 'react';
import { useProject } from './util/data';
import { Typography, Toolbar, AppBar, Button } from '@material-ui/core';

function Game({ id, scene: defaultScene, defaultVars = {}, exit, debug }) {
  const project = useProject(id);
  const [sceneId, setScene] = useState(defaultScene || 'start');
  // const [vars, setVar] = useState(defaultVars);

  const scene = project.scenes.find(scene => scene.name === sceneId);

  useLayoutEffect(() => {
    document.body.classList.add('cta');
    return () => {
      document.body.classList.remove('cta');
    }
  })

  return <div className='root'>
    <style>{project.css}</style>
    {
      debug && <>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="h6" color="inherit">
                CTA Editor (0.1.0 beta) - Playing "{project.name}"
              </Typography>
              <Button variant='outlined' onClick={() => exit()}>
                Exit
              </Button>
              <Button variant='outlined' onClick={() => exit({ scene: sceneId })}>
                Edit this scene
              </Button>
            </Toolbar>
          </AppBar>
        </div>
        <AppBar aria-hidden position="static" style={{ boxShadow: 'none', pointerEvents: 'none' }}>
          <Toolbar />
        </AppBar>
      </>
    }
    <div className='container'>
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
    </div>
  </div>;
}

export default Game;
