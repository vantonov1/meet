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
import CreateAgent from "../create-agent/view";
import {showCreateAgent} from "../create-agent/slice";
import {setAbout, showCreateRequest} from "../create-request/slice";
import {Link as RouterLink} from 'react-router-dom';
import {isRent, isSale} from "../common/constants";

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

    return <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense">
            <IconButton edge="start" className={classes.menuButton} color="inherit"
                        onClick={e => setAnchorEl(e.currentTarget)}>
                <MenuIcon/>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
                {title}
            </Typography>
            {selectedEquity && <Button color={"inherit"} onClick={() => {
                dispatch(setAbout(selectedEquity));
                dispatch(showCreateRequest(true))
            }}>
                {isSale(selectedEquity) && "Хочу купить"}
                {isRent(selectedEquity) && "Хочу снять"}
            </Button>}
           <Button color={"inherit"} onClick={() => dispatch(showCreateRequest(true))}>
                Хочу сдать/продать
            </Button>
        </Toolbar>
        {Boolean(anchorEl) && <Menu anchorEl={anchorEl} keepMounted open={true} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() =>{dispatch(showCreateAgent(true)); setAnchorEl(null)}}>Добавить контрагента</MenuItem>
            <MenuItem onClick={() =>{setAnchorEl(null)}} component={RouterLink} to='/equities'>Объекты на карте</MenuItem>
            <MenuItem onClick={() =>{setAnchorEl(null)}} component={RouterLink} to='/my-requests'>Мои заявки</MenuItem>
            <MenuItem onClick={() =>{setAnchorEl(null)}} component={RouterLink} to='/assigned-requests'>Заявки в работе</MenuItem>
        </Menu>}
        <CreateCustomerRequest/>
        <CreateAgent/>
    </AppBar>
}