import React from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {List} from "@material-ui/core";
import {loadMeetings, selectMeeting} from "./slice";
import {MeetingListItem} from "../common/list-items";
import Browse from "../common/abstract-browser";


export default function BrowseMyMeetings() {
    const {records, selected} = useSelector(state => state.browseMeetings, shallowEqual);
    const dispatch = useDispatch();

    return <Browse slice="browseMeetings" title='Мои запланированные встречи' loader={loadMeetings}>
        <List> {records.map(r =>
            <MeetingListItem key={r.id} equity={r.at} person={r.scheduledBy} selected={selected?.id === r.id}
                             schedule={r.schedule}
                             onClick={(e) => {
                                 dispatch(selectMeeting(r));
                             }}/>)}
        </List>
    </Browse>
}