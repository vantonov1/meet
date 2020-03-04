import React, {useEffect, useState} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {acknowledgedByAttendee, loadMeetings, selectMeeting, updateMeetings} from "./slice";
import {MeetingListItem} from "../common/list-items";
import BrowseList from "../common/browse-list";
import {onMessageReceived} from "../../api/FirebaseAPI";
import Menu from "@material-ui/core/Menu";
import {MenuItem} from "@material-ui/core";


export default function BrowseMyMeetings() {
    const {records, selected} = useSelector(state => state.browseMeetings, shallowEqual);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        onMessageReceived(() => {
            dispatch(updateMeetings())
        })
    });

    return <>
        <BrowseList slice="browseMeetings" title='Мои запланированные встречи' loader={loadMeetings} topLevel={true}>
            {records.map(r => <MeetingListItem key={r.id} meeting={r} person={r.scheduledBy} selected={selected?.id === r.id} onClick={e => {
                setMenuAnchor(e.target);
                dispatch(selectMeeting(r));
            }}/>)}
        </BrowseList>
        {selected && <Menu open={menuAnchor != null} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)}>
            <MenuItem onClick={() => {
                dispatch(acknowledgedByAttendee(selected));
                setMenuAnchor(null)
            }}>Подтвердить встречу</MenuItem>
        </Menu>}
    </>
}