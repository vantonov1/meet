import React from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {List} from "@material-ui/core";
import {loadMeetings, selectMeeting} from "./slice";
import {MeetingListItem} from "../common/list-items";
import Browse from "../common/abstract-browser";


export default function BrowseAssignedMeetings() {
    const {records, selected} = useSelector(state => state.browseAssignedMeetings, shallowEqual);
    const dispatch = useDispatch();

    return <Browse slice="browseAssignedMeetings" title='Запланированные встречи' loader={loadMeetings}>
        <List> {records.map(r =>
            <MeetingListItem key={r.id} equity={r.at} person={r.attends} selected={selected?.id === r.id}
                             schedule={r.schedule}
                             onClick={(e) => {
                                 dispatch(selectMeeting(r));
                             }}/>)}
        </List>
    </Browse>
}