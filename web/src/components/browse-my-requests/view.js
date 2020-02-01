import React, {useEffect, useLayoutEffect} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {List, ListItem, Toolbar} from "@material-ui/core";
import {loadRequests, selectRequest} from "./slice";
import {CONTACT_TYPES, EQUITY_TYPES} from "../common/constants";
import Typography from "@material-ui/core/Typography";
import {setAppTitle} from "../app-bar/slice";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        width: 400,
        height: "100%",
    },
    progress: {position: "absolute", width: '100%', textAlign: 'center', marginTop: theme.spacing(1)},
    noItems: {width: '100%', textAlign: 'center', marginTop: theme.spacing(1)},
}));

export default function BrowseMyRequests(props) {
    const {requests, selectedRequest, loading} = useSelector(state => state.browseRequests, shallowEqual);
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        dispatch(loadRequests())
    });

    useLayoutEffect(() => {
        dispatch(setAppTitle('Мои заявки'))
    });

    return <Box>
        <Toolbar/>
        {loading && <span className={classes.progress}><CircularProgress/></span>}
        {!loading && requests.length === 0 && <span className={classes.noItems}>Нет записей</span>}
        <List>
            {requests.map(r =>
                <Request selected={selectedRequest?.id === r.id} onClick={() => {dispatch(selectRequest(r))}} {...r}/>)
            }
        </List>
    </Box>
}

function Request(props) {
    let equity = props.about;
    let agent = props.assignedTo;
    return <ListItem divider secondary={equity && EQUITY_TYPES[equity.type]} selected={props.selected} onClick={props.onClick}>
        {equity && <Box width={1}><b>{equity.price}&#8381;</b>&nbsp;{equity.address.street}&nbsp;{equity.address.building}</Box>}
        {agent && <Typography>{agent.name}</Typography>}
        {agent && agent.contacts?.map(c => <Typography key={c.contactType + c.contact}>
            &nbsp;{CONTACT_TYPES[c.contactType].label}&nbsp;{c.contact}
        </Typography>)}
    </ListItem>
}