import React, {useEffect} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {loadMeetings, selectMeeting, updateMeetings} from "./slice";
import {MeetingListItem} from "../common/list-items";
import BrowseList from "../common/browse-list";
import {onMessageReceived} from "../../api/FirebaseAPI";


export default function BrowseMyMeetings() {
    const {records, selected} = useSelector(state => state.browseMeetings, shallowEqual);
    const dispatch = useDispatch();

    useEffect(() => {
        onMessageReceived(m => {
            dispatch(updateMeetings())
        })
    });

    return <BrowseList slice="browseMeetings" title='Мои запланированные встречи' loader={loadMeetings} topLevel={true}>
        {records.map(r => <MeetingListItem key={r.id} equity={r.at} person={r.scheduledBy}
                                           selected={selected?.id === r.id}
                                           schedule={r.schedule}
                                           onClick={(e) => {
                                               dispatch(selectMeeting(r));
                                           }}/>)}
    </BrowseList>
}