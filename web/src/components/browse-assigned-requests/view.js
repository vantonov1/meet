import React, {useEffect, useLayoutEffect, useState} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import Box from "@material-ui/core/Box";
import {List, MenuItem, Toolbar} from "@material-ui/core";
import {loadRequests, selectRequest} from "./slice";
import {setAppTitle} from "../app-bar/slice";
import LoadRecordsProgress from "../common/load-records-progress";
import {RequestListItem} from "../common/request-list-item";
import Menu from "@material-ui/core/Menu";
import ConfirmAction from "../common/confirm-action";
import {deleteRequest} from "../browse-my-requests/slice";
import AddEquity from "../add-equity/view";
import {showAddEquity} from "../add-equity/slice";

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
        <List> {requests.map(r =>
            <RequestListItem key={r.id} equity={r.about} person={r.issuedBy} selected={selectedRequest?.id === r.id}
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
        </Menu>}
        <ConfirmAction open={confirmDelete} text="Удалить заявку?" onCancel={() => setConfirmDelete(false)}
                       onOK={() => {
                           setConfirmDelete(false);
                           dispatch(deleteRequest(selectedRequest))
                       }}/>
        <AddEquity type={filter.type} city={filter.city} fromRequest={selectedRequest}/>
    </Box>
}