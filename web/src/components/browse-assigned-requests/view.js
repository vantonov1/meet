import React, {useState} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {List, MenuItem} from "@material-ui/core";
import {deleteRequest, loadRequests, selectRequest} from "./slice";
import {MergedRequestListItem} from "../common/list-items";
import Menu from "@material-ui/core/Menu";
import ConfirmAction from "../common/confirm-action";
import AddEquity from "../add-equity/view";
import {showAddEquity} from "../add-equity/slice";
import {showCreateMeeting} from "../create-meeting/slice";
import CreateMeeting from "../create-meeting/view";
import {isBefore} from "date-fns";
import parse from 'date-fns/parseISO'
import Browse from "../common/abstract-browser";

const compareDates = (a, b) => a.meeting ? b.meeting ? isBefore(parse(a.meeting), parse(b.meeting)) ? -1 : 1 : -1 : 1;

export default function BrowseAssignedRequests() {
    const {records, selectedRequest} = useSelector(state => state.browseAssignedRequests, shallowEqual);
    const {filter} = useSelector(state => state.browseEquities, shallowEqual);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const dispatch = useDispatch();

    return <Browse slice="browseAssignedRequests" title='Заявки в работе' loader={loadRequests}>
        <List> {mergeRequests(records).sort(compareDates).map(r =>
            <MergedRequestListItem key={r.id} equity={r.about} buyer={r.buyer} seller={r.seller} meeting={r.meeting}
                                   selected={selectedRequest?.id === r.id}
                                   onClick={(e) => {
                                       setMenuAnchor(e.target);
                                       dispatch(selectRequest(r))
                                   }}/>)}
        </List>
        {<Menu open={menuAnchor != null} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)}>
            <MenuItem disabled={selectedRequest?.about !== null} onClick={() => {
                dispatch(showAddEquity(true));
                setMenuAnchor(null)
            }}>Создать объект по заявке</MenuItem>
            {selectedRequest && <MenuItem onClick={() => {
                setConfirmDelete(true);
                setMenuAnchor(null)
            }}>Удалить заявку</MenuItem>}
            <MenuItem disabled={selectedRequest?.about === null || selectedRequest?.buyer == null} onClick={() => {
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
    </Browse>
}

function mergeRequests(requests) {
    const counterReq = requests.filter(r => r.type === 'BUY');
    return requests.filter(r => r.type === 'SELL').map((r) => {
        const buy = counterReq.find(c => c.about?.id === r.about?.id);
        return {
            id: r.id,
            buyId: buy?.id,
            about: r.about,
            assignedTo: r.assignedTo,
            seller: r.issuedBy,
            buyer: buy?.issuedBy,
            meeting: buy?.meetingScheduled
        }
    })
}