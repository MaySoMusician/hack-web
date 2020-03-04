import { hot } from 'react-hot-loader';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import TestWrapper from './test-wrapper';
import QuestFTHView from '../quest-fth-view';

import Toolbox from './fizzics-toolbox';
import { actions } from '../../store';
import { proxyApp, updateApp } from '../toolbox/tools';

const useStyles = makeStyles({
  root: {
  },
  frame: {
    width: '100%',
    height: '100vh',
    border: 'none',
  },
});

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const update = (newParams) => {
    // update the iframe with newParams
    updateApp('globalParameters', newParams, (property, value) => {
      dispatch(actions.gameSetParam(property, value));
    });
  };

  useEffect(() => {
    const changeCallback = (params) => {
      dispatch(actions.gameSet(params));
    };

    // Creates a proxy to track iframe globalParameters
    proxyApp('globalParameters', changeCallback);
  });

  const toolbox = (
    <Toolbox updateApp={update} />
  );

  const canvas = (
    <iframe
      id="app"
      title="Fizzics App"
      className={classes.frame}
      src="/apps/com.hack_computer.Fizzics/index.html"
    />
  );

  const sidebar = (
    <List>
      <ListItem>
        <ListItemText
          primary="This is a line of dialogue."
          secondary="Ada"
          primaryTypographyProps={{
            variant: 'body2',
          }}
        />
      </ListItem>
    </List>
  );

  return (
    <TestWrapper>
      <QuestFTHView
        toolbox={toolbox}
        canvas={canvas}
        sidebar={sidebar}
      />
    </TestWrapper>
  );
};

export default hot(module)(App);
