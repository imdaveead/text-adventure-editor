import React from 'react';
import { withStyles, createStyles, Button, List, ListItem, ListItemText } from '@material-ui/core';
import { useProjectList } from '../util/data';
import { uiNewProject } from '../util/menu';
import Changelog from './Changelog';

const styles = (theme) => createStyles({
  root: {
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
  },
});

function MainMenu({ classes: c, openProject }) {
  const projects = useProjectList();

  return <div className={c.root}>
    <h2>projects</h2>
    <Button onClick={uiNewProject}>new project</Button>
    <br />
    <List component="nav">
      {
        projects.map(meta => {
          return <ListItem button key={meta.id} onClick={() => openProject(meta.id)}>
            <ListItemText primary={meta.name} />
          </ListItem>;
        })
      }
    </List>
    <Changelog />
  </div>;
}

export default withStyles(styles)(MainMenu);
