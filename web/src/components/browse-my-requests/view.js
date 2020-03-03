import React, {useEffect, useState} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {MenuItem} from "@material-ui/core";
import {deleteRequest, loadRequests, selectRequest, updateRequests} from "./slice";
import {RequestListItem} from "../common/list-items";
import ConfirmAction from "../common/confirm-action";
import Menu from "@material-ui/core/Menu";
import BrowseList from "../common/browse-list";
import {showEditTimeSlots} from "../edit-timeslots/slice";
import EditTimeSlots from "../edit-timeslots/view";
import CreateComment from "../create-comment/view";
import {showCreateComment} from "../create-comment/slice";
import {onMessageReceived} from "../../api/FirebaseAPI";


export default function BrowseMyRequests() {
    const {records, selectedRequest} = useSelector(state => state.browseRequests, shallowEqual);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        onMessageReceived(m => {
            dispatch(updateRequests())
        })
    });

    return <>
        <BrowseList slice="browseRequests" title='Мои заявки' loader={loadRequests} topLevel={true}>
            {records.map(r =>
                <RequestListItem key={r.id} equity={r.about} person={r.assignedTo} comments={r.comments}
                                 selected={selectedRequest?.id === r.id}
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
            <MenuItem onClick={() => {
                dispatch(showEditTimeSlots(true));
                setMenuAnchor(null)
            }}>Указать время просмотров</MenuItem>
            {selectedRequest?.about && <MenuItem onClick={() => {
                dispatch(showCreateComment(true));
                setMenuAnchor(null)
            }}>Комментарий</MenuItem>}
        </Menu>}
        {selectedRequest &&
        <ConfirmAction open={confirmDelete} text="Удалить заявку?" onCancel={() => setConfirmDelete(false)}
                       onOK={() => {
                           setConfirmDelete(false);
                           dispatch(deleteRequest(selectedRequest))
                       }}/>}
        {selectedRequest && <EditTimeSlots request={selectedRequest}/>}
        {selectedRequest && selectedRequest.about && <CreateComment request={selectedRequest}/>}

    </>
}