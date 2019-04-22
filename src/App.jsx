import React, { useState } from 'react';
import { withStyles, createStyles, Typography, AppBar, Toolbar } from '@material-ui/core';
import MainMenu from './MainMenu'
import ProjectEditor from './ProjectEditor';
import Game from './Game';

const styles = (theme) => createStyles({
  root: {

  },
});

function App({ classes: c }) {
  const [playingMeta, setPlayingMeta] = useState(null);
  const [openProject, setOpenProject] = useState(null);
  const [reopenMeta, setReopenMeta] = useState(null);

  if(playingMeta) {
    return <Game
      id={openProject}
      scene={playingMeta.scene}
      vars={playingMeta.vars}
      debug={true}
      exit={(reopenOverride) => {
        setPlayingMeta(null);
        setReopenMeta(Object.assign({}, reopenMeta, reopenOverride))
      }}
    />
  }

  return <div className={c.root}>
    <AppBar position="static" color="default">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          {
            openProject ? 'TAC ' : 'Text Adventure Creator '
          }
          (0.1.2 beta)
        </Typography>
      </Toolbar>
    </AppBar>
    {
      openProject ? (
        <ProjectEditor
          id={openProject}
          close={() => setOpenProject(null)}
          defaultState={reopenMeta}
          play={(scene, vars, state) => {
            setPlayingMeta({
              scene: scene || 'start',
              vars: vars || {},
            });
            setReopenMeta(state);
          }}
        />
      ) : (
        <MainMenu openProject={setOpenProject} />
      )
    }
  </div>;
}

export default withStyles(styles)(App);
