import {AppBar} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {shallowEqual, useSelector} from "react-redux";
import {EQUITY_TYPES} from "../common/constants";
import CreateCustomer from "../create-request/view";

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
    const [showCreateRequest, setShowCreateRequest] = useState(false);
    const classes = useStyles();

    return <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense">
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon/>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
                {EQUITY_TYPES[filter.type]}
            </Typography>
            <Button color={"inherit"} onClick={() => setShowCreateRequest(true)}>
                Хочу сдать/продать
            </Button>
        </Toolbar>
        <CreateCustomer open={showCreateRequest} onClose={() => setShowCreateRequest(false)}/>
    </AppBar>

}