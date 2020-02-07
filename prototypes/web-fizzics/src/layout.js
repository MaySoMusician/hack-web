import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import ChatBubbleIcon from '@material-ui/icons/ChatBubble';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

// import * as dat from 'dat.gui';

import useScript from './hooks/useScript';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        height: '100%',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    },
    title: {
        flexGrow: 1,
    },
    dialogueToggleButton: {
        zIndex: 10,
        position: 'absolute',
        background: theme.palette.common.hackGreen,
        borderRadius: '50% 0 0 50%',
        top: `calc(50% - ${theme.spacing(3)}px)`,
        right: 0,
        '&:hover': {
            background: theme.palette.common.hackGreen,
        },
    },
    toolboxToggleButton: {
        zIndex: 10,
        position: 'absolute',
        background: theme.palette.common.hackGreen,
        borderRadius: '0 50% 50% 0',
        top: `calc(50% - ${theme.spacing(3)}px)`,
        left: '0',
        '&:hover': {
            background: theme.palette.common.hackGreen,
        },
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
    content: {
        overflow: 'hidden',
        position: 'relative',
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: `calc(100% - ${drawerWidth}px)`,
        height: '100%',
        marginRight: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    },
    toyApp: {
        zIndex: 0,
    },
    toyAppWhenFlipped: {
        // opacity: '60%',
    },
    toolbox: {
        position: 'absolute',
        top: 0,
        left: `${theme.spacing(7)}px`,
        display: 'none',
    },
    toolboxWhenFlipped: {
        display: 'block',
    }
}));

const FizzicControls = function () {
    
}

export default function Layout() {
    useScript('main.js');
    useScript('app.js');

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const [flipped, setFlipped] = React.useState(false);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleFlipToggle = () => {
        setFlipped(!flipped);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (<div className={classes.root}>
            <main
            className={clsx(classes.content, {
                [classes.contentShift]: open,
            })}
            >

            <IconButton
            variant="contained"
            color="primary"
            aria-label="open dialogue"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.dialogueToggleButton}
            >
            {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>

            <IconButton
            color="primary"
            aria-label="open toolbox"
            edge="end"
            onClick={handleFlipToggle}
            className={classes.toolboxToggleButton}
            >
            {flipped ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>

            <div id="toy-app-container" className={clsx(classes.toyApp, flipped && classes.toyAppWhenFlipped)}></div>
            <div id="toolbox-container" className={clsx(classes.toolbox, flipped && classes.toolboxWhenFlipped)}></div>

            </main>
            <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
            >
            <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem button key={text}>
                    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                    <ListItemText primary={text} />
                    </ListItem>
            ))}
            </List>
            <Divider />
            <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                    <ListItemText primary={text} />
                    </ListItem>
            ))}
            </List>
            </Drawer>
            </div>
           );
}