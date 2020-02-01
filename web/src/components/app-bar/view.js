import {AppBar, Menu, MenuItem} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {EQUITY_TYPES} from "../common/constants";
import CreateCustomerRequest from "../create-request/view";
import CreateAgent from "../create-agent/view";
import {showCreateAgent} from "../create-agent/slice";
import {showCreateRequest} from "../create-request/slice";

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

export default function MainAppBar() {
    const {filter} = useSelector(state => state.browseEquities, shallowEqual);
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const classes = useStyles();

    return <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense">
            <IconButton edge="start" className={classes.menuButton} color="inherit"
                        onClick={e => setAnchorEl(e.currentTarget)}>
                <MenuIcon/>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
                {EQUITY_TYPES[filter.type]}
            </Typography>
            <Button color={"inherit"} onClick={() => dispatch(showCreateRequest(true))}>
                Хочу сдать/продать
            </Button>
        </Toolbar>
        {Boolean(anchorEl) && <Menu anchorEl={anchorEl} keepMounted open={true} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() =>{dispatch(showCreateAgent(true)); setAnchorEl(null)}}>Добавить контрагента</MenuItem>
        </Menu>}
        <CreateCustomerRequest/>
        <CreateAgent/>
    </AppBar>
}