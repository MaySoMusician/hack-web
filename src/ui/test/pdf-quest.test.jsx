import { hot } from 'react-hot-loader';
import { useSelector } from 'react-redux';
import React, {
  useLayoutEffect, useRef, useState,
} from 'react';
import {
  Box,
  CircularProgress,
  Divider,
  makeStyles,
  useTheme,
} from '@material-ui/core';

import {
  Fullscreen,
  ZoomIn,
  ZoomOut,
} from '@material-ui/icons';

import { Document, Page } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';

import TestWrapper from './test-wrapper';
import Dialogue, { useQuest } from '../dialogue';
import { useCard } from '../hack-card';
import QuestFTHView from '../quest-fth-view';
import { SecondaryIconButton } from '../main-button';
import questContent from './pdf-quest.ink';

const questName = 'maker-make-change';

const useStyles = makeStyles(({ custom, palette, shadows }) => ({
  documentContainer: {
    height: `calc(100vh - ${custom.appBarHeight}px)`,
    overflowY: 'scroll',
    backgroundColor: palette.grey[500],
    '& .react-pdf__Page canvas': {
      margin: '0 auto',
      boxShadow: shadows[12],
    },
  },
  spinnerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
}));

const PdfQuest = () => {
  const classes = useStyles();
  const card = useCard();

  const {
    quest, dialogue, choices, setCurrentChoice, hasEnded, restartQuest,
  } = useQuest(questContent);

  const open = useSelector((state) => state.ui.sidePanelOpen);

  const [state, setState] = useState({
    scale: null,
    width: null,
    height: null,
    numPages: null,
    fullscreen: true,
    originalWidth: 0,
    originalHeight: 0,
  });

  const ref = useRef(null);

  const fitWidthToCanvas = ({ availableWidth }) => ({
    width: availableWidth, height: null, scale: 1,
  });

  const getRefDimentions = () => ({
    availableWidth: ref.current.clientWidth,
    availableHeight: ref.current.clientHeight,
  });

  const { transitions } = useTheme();

  useLayoutEffect(() => {
    if (!state.fullscreen) {
      return;
    }
    setTimeout(() => {
      const dimentions = getRefDimentions();
      const scaleInfo = fitWidthToCanvas(dimentions);
      setState((oldState) => ({ ...oldState, ...scaleInfo }));
    }, transitions.duration.enteringScreen);
  }, [open, state.fullscreen, transitions.duration.enteringScreen]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    quest.updateStoryVariable('loaded', true);
    setCurrentChoice(undefined);
    setState((oldState) => ({ ...oldState, numPages }));
  };

  const onPageLoadSuccess = ({ pageIndex, originalWidth, originalHeight }) => {
    if (pageIndex !== 0) return;
    setState((oldState) => ({ ...oldState, originalWidth, originalHeight }));
  };

  const onZoomIn = () => {
    setState((oldState) => ({ ...oldState, fullscreen: false, scale: oldState.scale * 1.1 }));
  };

  const onZoomOut = () => {
    setState((oldState) => ({ ...oldState, fullscreen: false, scale: oldState.scale * 0.9 }));
  };

  const onSwitchFullscreen = () => {
    const dimentions = getRefDimentions();
    const scaleInfo = fitWidthToCanvas(dimentions);
    setState((oldState) => ({ ...oldState, fullscreen: true, ...scaleInfo }));
  };

  const onRestartSelected = () => {
    restartQuest();
    quest.updateStoryVariable('loaded', true);
    setCurrentChoice(undefined);
    // scroll to the top
    ref.current.scrollTop = 0;
    onSwitchFullscreen();
  };

  const sidebar = (
    <Dialogue
      dialogue={dialogue}
      choices={choices}
      onChoiceSelected={setCurrentChoice}
      onRestartSelected={onRestartSelected}
      hasEnded={hasEnded}
      card={card}
    />
  );

  const spinner = (
    <Box className={classes.spinnerContainer}>
      <CircularProgress />
    </Box>
  );

  const canvas = (
    <Box ref={ref} className={classes.documentContainer}>
      <Document
        loading={spinner}
        file={`/assets/articles/${questName}.pdf`}
        onLoadSuccess={onDocumentLoadSuccess}
        externalLinkTarget="_blank"
      >
        {Array.from(
          new Array(state.numPages),
          (el, index) => (
            <Page
              key={`page_${index + 1}`}
              scale={state.scale}
              width={state.width}
              height={state.height}
              onLoadSuccess={onPageLoadSuccess}
              pageNumber={index + 1}
            />
          ),
        )}
      </Document>
    </Box>
  );

  const controls = (
    <>
      <Box m={1}>
        <SecondaryIconButton
          color="secondary"
          aria-label="switch fullscreen"
          size="medium"
          onClick={onSwitchFullscreen}
          disabled={state.fullscreen}
        >
          <Fullscreen />
        </SecondaryIconButton>
      </Box>
      <Divider />
      <Box m={1}>
        <SecondaryIconButton
          color="secondary"
          aria-label="zoom out"
          size="medium"
          onClick={onZoomOut}
        >
          <ZoomOut />
        </SecondaryIconButton>
      </Box>
      <Box m={1}>
        <SecondaryIconButton
          color="secondary"
          aria-label="zoom in"
          size="medium"
          onClick={onZoomIn}
        >
          <ZoomIn />
        </SecondaryIconButton>
      </Box>
    </>
  );

  return (
    <QuestFTHView
      canvas={canvas}
      sidebar={sidebar}
      controls={controls}
      title={card.name}
      subtitle={card.subtitle}
    />
  );
};

const WrappedQuest = () => (
  <TestWrapper>
    <PdfQuest />
  </TestWrapper>
);

const App = hot(module)(WrappedQuest);

export { App as default, PdfQuest };
