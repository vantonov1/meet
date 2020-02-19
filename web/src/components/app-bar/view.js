import {AppBar, Menu, MenuItem} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import CreateCustomerRequest from "../create-request/view";
import {createRequest} from "../create-request/slice";
import {Link as RouterLink} from 'react-router-dom';
import {getRoles} from "../../api/FirebaseAPI";

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
    const {title} = useSelector(state => state.appBar, shallowEqual);
    const {selectedEquity} = useSelector(state => state.browseEquities, shallowEqual);
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const classes = useStyles();
    const roles = getRoles();
    const isAdmin = roles?.includes("ROLE_ADMIN");
    const isAgent = roles?.includes("ROLE_AGENT");

    return <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit"
                        onClick={e => setAnchorEl(e.currentTarget)}>
                <MenuIcon/>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
                {title}
            </Typography>
            {/*!isAdmin && !isAgent &&*/ <Button color={"inherit"} onClick={() => dispatch(createRequest())}>
                Хочу сдать/продать
            </Button>}
        </Toolbar>
        {Boolean(anchorEl) && <Menu anchorEl={anchorEl} keepMounted open={true} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() =>{setAnchorEl(null)}} component={RouterLink} to='/equities'>Объекты на карте</MenuItem>
            {isAdmin && <MenuItem onClick={() =>{setAnchorEl(null)}} component={RouterLink} to='/admin'>Консоль администратора</MenuItem>}
            {isAgent && <MenuItem onClick={() =>{setAnchorEl(null)}} component={RouterLink} to='/assigned-requests'>Заявки в работе</MenuItem>}
            {isAgent && <MenuItem onClick={() =>{setAnchorEl(null)}} component={RouterLink} to='/assigned-meetings'>Запланированные встречи</MenuItem>}
            {!isAdmin && !isAgent && <MenuItem onClick={() =>{setAnchorEl(null)}} component={RouterLink} to='/my-requests'>Мои заявки</MenuItem>}
            {!isAdmin && !isAgent && <MenuItem onClick={() =>{setAnchorEl(null)}} component={RouterLink} to='/my-meetings'>Мои запланированные встречи</MenuItem>}
        </Menu>}
        <CreateCustomerRequest/>
    </AppBar>
}