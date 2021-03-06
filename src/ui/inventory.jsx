/* Copyright © 2020 Endless OS LLC
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import {
  Box,
  IconButton,
  Drawer,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  useMediaQuery,
  SvgIcon,
} from '@material-ui/core';

import {
  Close,
  Delete,
} from '@material-ui/icons';

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { actions } from '../store';
import SecondaryIconButton from './secondary-icon-button';

import MainIconButton from './main-icon-button';
import ThumbsUpIcon from './icons/hack-thumbsup-symbolic.svg';
import ThumbsDownIcon from './icons/hack-thumbsdown-symbolic.svg';

const defaultBadge = '/assets/badges/default.svg';

const useStyles = makeStyles(({
  spacing,
  breakpoints,
  custom,
  palette,
}) => ({
  bottomButtons: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    [breakpoints.down('md')]: {
      width: custom.drawerWidths.downMd,
    },
    [breakpoints.only('lg')]: {
      width: custom.drawerWidths.onlyLg,
    },
    [breakpoints.only('xl')]: {
      width: custom.drawerWidths.onlyXl,
    },
    backgroundColor: palette.background.paper,
  },
  drawerPaper: {
    [breakpoints.down('md')]: {
      width: custom.drawerWidths.downMd,
    },
    [breakpoints.only('lg')]: {
      width: custom.drawerWidths.onlyLg,
    },
    [breakpoints.only('xl')]: {
      width: custom.drawerWidths.onlyXl,
    },
  },
  badgeDisabled: {
    filter: 'grayscale(1) opacity(0.5)',
  },
  badge: {
    backgroundImage: ({ achievement }) => `url('/assets/badges/${achievement}.svg'), url('${defaultBadge}')`,
    backgroundSize: 'auto 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '100%',
    paddingTop: '100%',
  },
  resetButton: {
    width: '100%',
    paddingTop: '100%',
    marginTop: spacing(2),
    textAlign: 'center',
    position: 'relative',

    '& button': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translateY(-50%) translateX(-50%)',
    },
  },
}));

const HackBadge = ({ achievement, disabled }) => {
  const classes = useStyles({ achievement });

  return (
    <Box mt={2} className={clsx(classes.badge, { [classes.badgeDisabled]: disabled })} />
  );
};

HackBadge.propTypes = {
  achievement: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

HackBadge.defaultProps = {
  disabled: false,
};

const dialogStyles = makeStyles(({ palette, spacing }) => ({
  button: {
    color: 'white',
    margin: spacing(1),
  },
  grey: {
    backgroundColor: palette.grey[500],
  },
}));

const ResetGameStateDialog = ({ open, setOpen }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = dialogStyles();

  const reset = () => {
    dispatch(actions.gameStateReset());
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{t('Are you sure you want to reset your progress?')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('This will reset your progress in all quests, and erase all your achievements!')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <MainIconButton size="medium" onClick={reset} className={clsx(classes.button, classes.grey)}>
          <SvgIcon component={ThumbsUpIcon} viewBox="0 0 16 16" />
        </MainIconButton>
        <MainIconButton size="medium" onClick={handleClose} className={classes.button}>
          <SvgIcon component={ThumbsDownIcon} viewBox="0 0 16 16" />
        </MainIconButton>
      </DialogActions>
    </Dialog>
  );
};

ResetGameStateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

const ResetButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const gameState = useSelector((state) => state.gameState);
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <>
      <ResetGameStateDialog open={dialogOpen} setOpen={setDialogOpen} />
      <Box className={classes.resetButton}>
        <Tooltip title={t('Delete inventory')}>
          <SecondaryIconButton
            aria-label="reset"
            edge="end"
            disabled={Object.keys(gameState).length === 0}
            onClick={() => setDialogOpen(true)}
          >
            <Delete />
          </SecondaryIconButton>
        </Tooltip>
      </Box>
    </>
  );
};

const InventoryContent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const gameState = useSelector((state) => state.gameState);
  const achievementsData = useSelector((state) => state.achievementsData);

  const questAchievements = gameState['quests.achievements'] || {};
  const achievements = Object.keys(questAchievements);
  const allAchievements = Object.keys(achievementsData).map((a) => ({
    achievement: a,
    disabled: !achievements.includes(a),
  }));

  return (
    <Box px={4} py={2} pb={8}>
      <Grid container>
        <Grid item xs={8}>
          <Typography variant="h4">
            {t('Inventory')}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography align="right">
            <IconButton aria-label="close" edge="end" onClick={() => dispatch(actions.inventoryToggle())}>
              <Close />
            </IconButton>
          </Typography>
        </Grid>
        { allAchievements.map(({ achievement, disabled }) => (
          <Grid key={achievement} item xs={6}>
            <HackBadge achievement={achievement} disabled={disabled} />
          </Grid>
        ))}
        <Grid item xs={6}>
          <ResetButton />
        </Grid>
      </Grid>
    </Box>
  );
};

const Inventory = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const open = useSelector((state) => state.ui.inventory);

  return (
    <Drawer
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
      onClose={() => dispatch(actions.inventoryToggle())}
    >
      <InventoryContent />
    </Drawer>
  );
};

export default Inventory;
