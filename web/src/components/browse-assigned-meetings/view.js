import React, {useState} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {List, MenuItem} from "@material-ui/core";
import {loadMeetings, selectMeeting} from "./slice";
import {MeetingListItem} from "../common/list-items";
import Browse from "../common/abstract-browser";
import Menu from "@material-ui/core/Menu";
import {showRescheduleMeeting} from "../reschedule-meeting/slice";
import RescheduleMeeting from "../reschedule-meeting/view";


export default function BrowseAssignedMeetings() {
    const {records, selected} = useSelector(state => state.browseAssignedMeetings, shallowEqual);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const dispatch = useDispatch();

    return <Browse slice="browseAssignedMeetings" title='Запланированные встречи' loader={loadMeetings}>
        <List> {records.map(r =>
            <MeetingListItem key={r.id} equity={r.at} person={r.attends} selected={selected?.id === r.id}
                             schedule={r.schedule}
                             onClick={(e) => {
                                 setMenuAnchor(e.target);
                                 dispatch(selectMeeting(r));
                             }}/>)}
        </List>
        {<Menu open={menuAnchor != null} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)}>
            <MenuItem onClick={() => {
                dispatch(showRescheduleMeeting(selected));
                setMenuAnchor(null)
            }}>Перенести встречу</MenuItem>
        </Menu>}
        {selected && <RescheduleMeeting meeting={selected}/>}
    </Browse>
}