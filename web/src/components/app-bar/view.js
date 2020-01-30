import {AppBar} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {shallowEqual, useSelector} from "react-redux";
import {TYPES} from "../common/equity-types";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
}));

export default function MainAppBar(props) {
    const {filter} = useSelector(state => state.browseEquities, shallowEqual);
    const classes = useStyles();
    return <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense">
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon/>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
                {TYPES[filter.type]}
            </Typography>
            <Button color={"inherit"}>
                Хочу сдать/продать
            </Button>
        </Toolbar>
    </AppBar>

}