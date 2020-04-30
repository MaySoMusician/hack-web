import React from 'react';
import {
  Fab,
  makeStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import flipFrontNormal from './flip-front-normal.png';
import flipBackNormal from './flip-back-normal.png';
import flipFrontHover from './flip-front-hover.png';
import flipBackHover from './flip-back-hover.png';
import flipFrontDimmed from './flip-front-dimmed.png';
import flipBackDimmed from './flip-back-dimmed.png';

const useStyles = makeStyles(({ transitions }) => ({
  fthButton: {
    // Note, the following sizes are intentionally hardcoded to fit
    // the assets.
    borderRadius: '0 60px 60px 0',
    width: '66px',
    height: '124px',
    boxShadow: 'none',
    transition: transitions.create(['background-image'], {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.short,
    }),
    backgroundPosition: 'right',
    backgroundImage: `url('${flipFrontNormal}')`,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundImage: `url('${flipFrontHover}')`,
      backgroundColor: 'transparent',
    },
    '&.Mui-disabled': {
      backgroundImage: `url('${flipFrontDimmed}')`,
    },
  },
  fthButtonFlipped: {
    backgroundImage: `url('${flipBackNormal}')`,
    '&:hover': {
      backgroundImage: `url('${flipBackHover}')`,
    },
    '&.Mui-disabled': {
      backgroundImage: `url('${flipBackDimmed}')`,
    },
  },
  glow: {
    // Note, the following sizes are intentionally hardcoded to fit
    // the assets.
    width: '0px',
    height: '0px',
    marginTop: 124 / 2,
    animation: '$glow 1s alternate infinite',
  },

  '@keyframes glow': {
    from: {
      boxShadow: '0 0 0 0px rgba(255, 255, 255, 0.4);',
    },
    to: {
      boxShadow: `
        0 0 60px 20px #fff,  /* inner white */
        0 0 100px 50px #f0f, /* middle magenta */
        0 0 140px 70px #0ff; /* outer cyan */
      `,
    },
  },
}));

const FTHButton = ({
  className,
  flipped,
  attracting,
  ...props
}) => {
  FTHButton.muiName = Fab.muiName;
  const classes = useStyles();

  return (
    <>
      { attracting && (
        <div className={clsx(className, classes.glow)} />
      )}
      <Fab
        color="secondary"
        aria-label="open toolbox"
        edge="end"
        size="medium"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        className={clsx(className, classes.fthButton, {
          [classes.fthButtonFlipped]: flipped,
        })}
      >
        {/* Fab requires one child */}
        <></>
      </Fab>
    </>
  );
};

FTHButton.propTypes = {
  className: PropTypes.string,
  flipped: PropTypes.bool,
  attracting: PropTypes.bool,
};

FTHButton.defaultProps = {
  className: '',
  flipped: false,
  attracting: false,
};

export default FTHButton;
