import React, {useEffect, useLayoutEffect, useState} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import Box from "@material-ui/core/Box";
import {List, MenuItem, Toolbar} from "@material-ui/core";
import {loadRequests, selectRequest} from "./slice";
import {setAppTitle} from "../app-bar/slice";
import LoadRecordsProgress from "../common/load-records-progress";
import {MergedRequestListItem} from "../common/request-list-item";
import Menu from "@material-ui/core/Menu";
import ConfirmAction from "../common/confirm-action";
import {deleteRequest} from "../browse-my-requests/slice";
import AddEquity from "../add-equity/view";
import {showAddEquity} from "../add-equity/slice";
import {showCreateMeeting} from "../create-meeting/slice";
import CreateMeeting from "../create-meeting/view";

export default function BrowseAssignedRequests() {
    const {requests, selectedRequest, loading} = useSelector(state => state.browseAssignedRequests, shallowEqual);
    const {filter} = useSelector(state => state.browseEquities, shallowEqual);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
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
        <List> {mergeRequests(requests).map(r =>
            <MergedRequestListItem key={r.id} equity={r.about} buyer={r.buyer} seller={r.seller}
                                   selected={selectedRequest?.id === r.id}
                                   onClick={(e) => {
                                       setMenuAnchor(e.target);
                                       dispatch(selectRequest(r))
                                   }}/>)}
        </List>
        {<Menu open={menuAnchor != null} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)}>
            <MenuItem disabled={selectedRequest?.type !== 'SELL' || selectedRequest?.about !== null} onClick={() => {
                dispatch(showAddEquity(true));
                setMenuAnchor(null)
            }}>Создать объект по заявке</MenuItem>
            {selectedRequest && <MenuItem onClick={() => {
                setConfirmDelete(true);
                setMenuAnchor(null)
            }}>Удалить заявку</MenuItem>}
            <MenuItem disabled={selectedRequest?.about === null} onClick={() => {
                dispatch(showCreateMeeting(true));
                setMenuAnchor(null)
            }}>Назначить встречу</MenuItem>
        </Menu>}
        <ConfirmAction open={confirmDelete} text="Удалить заявку?" onCancel={() => setConfirmDelete(false)}
                       onOK={() => {
                           setConfirmDelete(false);
                           dispatch(deleteRequest(selectedRequest))
                       }}/>
        <AddEquity type={filter.type} city={filter.city} fromRequest={selectedRequest}/>
        <CreateMeeting fromRequest={selectedRequest}/>
    </Box>
}

function mergeRequests(requests) {
    const counterReq = requests.filter(r => r.type === 'BUY');
    return requests.filter(r => r.type === 'SELL').map((r) => {
        const buy = counterReq.find(c => c.about?.id === r.about?.id);
        return {id: r.id, about: r.about, assignedTo: r.assignedTo, seller: r.issuedBy, buyer: buy?.issuedBy}
    })
}