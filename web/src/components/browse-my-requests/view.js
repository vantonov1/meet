import React, {useEffect, useLayoutEffect, useState} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import Box from "@material-ui/core/Box";
import {List, MenuItem, Toolbar} from "@material-ui/core";
import {deleteRequest, loadRequests, selectRequest} from "./slice";
import {setAppTitle} from "../app-bar/slice";
import LoadRecordsProgress from "../common/load-records-progress";
import {RequestListItem} from "../common/request-list-item";
import ConfirmAction from "../common/confirm-action";
import Menu from "@material-ui/core/Menu";


export default function BrowseMyRequests() {
    const {requests, selectedRequest, loading, loadFinished} = useSelector(state => state.browseRequests, shallowEqual);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!loading && !loadFinished)
            dispatch(loadRequests())
    }, [loading, loadFinished]);

    useLayoutEffect(() => {
        dispatch(setAppTitle('Мои заявки'))
    });

    return <Box>
        <Toolbar/>
        <LoadRecordsProgress loading={loading} empty={requests.length === 0}/>
        <List> {requests.map(r =>
            <RequestListItem key={r.id} equity={r.about} person={r.assignedTo} selected={selectedRequest?.id === r.id}
                             onClick={(e) => {
                                 dispatch(selectRequest(r));
                                 setMenuAnchor(e.target)
                             }}/>)}

        </List>
        {<Menu open={menuAnchor != null} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)}>
            <MenuItem onClick={() => {
                setConfirmDelete(true);
                setMenuAnchor(null)
            }}>Удалить заявку</MenuItem>
        </Menu>}
        <ConfirmAction open={confirmDelete} text="Удалить заявку?" onCancel={() => setConfirmDelete(false)}
                       onOK={() => {
                           setConfirmDelete(false);
                           dispatch(deleteRequest(selectedRequest))
                       }}/>
    </Box>
}