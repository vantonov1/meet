import React, {useEffect, useLayoutEffect} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import Box from "@material-ui/core/Box";
import {List, Toolbar} from "@material-ui/core";
import {loadRequests, selectRequest} from "./slice";
import {setAppTitle} from "../app-bar/slice";
import LoadRecordsProgress from "../common/load-records-progress";
import {RequestListItem} from "../common/request-list-item";

export default function BrowseMyRequests() {
    const {requests, selectedRequest, loading, loadFinished} = useSelector(state => state.browseRequests, shallowEqual);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!loading && !loadFinished )
            dispatch(loadRequests())
    },[loading, loadFinished]);

    useLayoutEffect(() => {
        dispatch(setAppTitle('Мои заявки'))
    });

    return <Box>
        <Toolbar/>
        <LoadRecordsProgress loading={loading} empty={requests.length === 0}/>
        <List> {requests.map(r =>
                <RequestListItem key={r.id} equity={r.about} person={r.assignedTo} selected={selectedRequest?.id === r.id} onClick={() => {
                    dispatch(selectRequest(r))}}/>)}
        </List>
    </Box>
}