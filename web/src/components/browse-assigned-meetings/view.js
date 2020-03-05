import React, {useEffect, useState} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {MenuItem} from "@material-ui/core";
import {deleteMeeting, loadMeetings, selectMeeting, updateMeetings} from "./slice";
import {MeetingListItem} from "../common/list-items";
import Menu from "@material-ui/core/Menu";
import {showRescheduleMeeting} from "../reschedule-meeting/slice";
import RescheduleMeeting from "../reschedule-meeting/view";
import ConfirmAction from "../common/confirm-action";
import BrowseList from "../common/browse-list";
import {onMessageReceived} from "../../api/FirebaseAPI";


export default function BrowseAssignedMeetings() {
    const {records, selected} = useSelector(state => state.browseAssignedMeetings, shallowEqual);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {document.title = 'Митилка - запланированные встречи'});

    useEffect(() => {
        onMessageReceived(m => {
            dispatch(updateMeetings())
        })
    });

    return <>
        <BrowseList slice="browseAssignedMeetings" title='Запланированные встречи' loader={loadMeetings}
                    topLevel={true}>
            {records.map(r =>
                <MeetingListItem key={r.id} meeting={r} person={r.attends} selected={selected?.id === r.id} onClick={e => {
                    setMenuAnchor(e.target);
                    dispatch(selectMeeting(r));
                }}/>)}
        </BrowseList>
        {<Menu open={menuAnchor != null} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)}>
            <MenuItem onClick={() => {
                dispatch(showRescheduleMeeting(selected));
                setMenuAnchor(null)
            }}>Перенести встречу</MenuItem>
            {selected && <MenuItem onClick={() => {
                setConfirmDelete(true);
                setMenuAnchor(null)
            }}>Отменить встречу</MenuItem>}
        </Menu>}
        {selected && <RescheduleMeeting meeting={selected}/>}
        <ConfirmAction open={confirmDelete} text="Удалить встречу?"
                       onCancel={() => setConfirmDelete(false)}
                       onOK={() => {
                           setConfirmDelete(false);
                           dispatch(deleteMeeting(selected))
                       }}/>
    </>
}