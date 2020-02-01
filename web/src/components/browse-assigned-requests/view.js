import React, {useEffect, useLayoutEffect} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import Box from "@material-ui/core/Box";
import {List, Toolbar} from "@material-ui/core";
import {loadRequests, selectRequest} from "./slice";
import {setAppTitle} from "../app-bar/slice";
import LoadRecordsProgress from "../common/load-records-progress";
import {RequestListItem} from "../common/request-list-item";

export default function BrowseAssignedRequests() {
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
        <List> {requests.map(r =>
                <RequestListItem key={r.id} equity={r.about} person={r.issuedBy} selected={selectedRequest?.id === r.id} onClick={() => {
                                     dispatch(selectRequest(r))
                                 }}/>)}
        </List>
    </Box>
}