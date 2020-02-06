import React, {useState} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {MenuItem} from "@material-ui/core";
import {deleteRequest, loadRequests, selectRequest} from "./slice";
import {RequestListItem} from "../common/list-items";
import ConfirmAction from "../common/confirm-action";
import Menu from "@material-ui/core/Menu";
import BrowseList from "../common/browse-list";


export default function BrowseMyRequests() {
    const {records, selectedRequest} = useSelector(state => state.browseRequests, shallowEqual);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const dispatch = useDispatch();

    return <>
        <BrowseList slice="browseRequests" title='Мои заявки' loader={loadRequests} topLevel={true}>
            {records.map(r =>
                <RequestListItem key={r.id} equity={r.about} person={r.assignedTo} selected={selectedRequest?.id === r.id}
                                 onClick={(e) => {
                                     dispatch(selectRequest(r));
                                     setMenuAnchor(e.target)
                                 }}/>)}

        </BrowseList>
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
    </>
}