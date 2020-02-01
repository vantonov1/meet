import React, {useEffect, useLayoutEffect} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import Box from "@material-ui/core/Box";
import {List, ListItem, Toolbar} from "@material-ui/core";
import {loadRequests, selectRequest} from "./slice";
import {CONTACT_TYPES, EQUITY_TYPES} from "../common/constants";
import Typography from "@material-ui/core/Typography";
import {setAppTitle} from "../app-bar/slice";
import LoadRecordsProgress from "../common/load-records-progress";

export default function BrowseAssignedRequests(props) {
    const {requests, selectedRequest, loading} = useSelector(state => state.browseAssignedRequests, shallowEqual);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadRequests())
    });

    useLayoutEffect(() => {
        dispatch(setAppTitle('Заявки в работе'))
    });

    return <Box>
        <Toolbar/>
        <LoadRecordsProgress loading={loading} empty={requests.length === 0}/>
        <List>
            {requests.map(r =>
                <Request key={r.id} selected={selectedRequest?.id === r.id} onClick={() => {dispatch(selectRequest(r))}} {...r}/>)
            }
        </List>
    </Box>
}

function Request(props) {
    let equity = props.about;
    let customer = props.issuedBy;
    return <ListItem divider secondary={equity && EQUITY_TYPES[equity.type]} selected={props.selected} onClick={props.onClick}>
        {equity && <Box width={1}><b>{equity.price}&#8381;</b>&nbsp;{equity.address.street}&nbsp;{equity.address.building}</Box>}
        {customer && <Typography>{customer.name}</Typography>}
        {customer && customer.contacts?.map(c => <Typography key={c.contactType + c.contact}>
            &nbsp;{CONTACT_TYPES[c.contactType].label}&nbsp;{c.contact}
        </Typography>)}
    </ListItem>
}