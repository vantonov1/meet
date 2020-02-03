import React, {useEffect, useLayoutEffect} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import Box from "@material-ui/core/Box";
import {List, Toolbar} from "@material-ui/core";
import {loadMeetings, selectMeeting} from "./slice";
import {setAppTitle} from "../app-bar/slice";
import LoadRecordsProgress from "../common/load-records-progress";
import {MeetingListItem} from "../common/list-items";


export default function BrowseMyMeetings() {
    const {meetings, selectedMeeting, loading, loadFinished} = useSelector(state => state.browseMeetings, shallowEqual);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!loading && !loadFinished)
            dispatch(loadMeetings())
    }, [loading, loadFinished]);

    useLayoutEffect(() => {
        dispatch(setAppTitle('Мои запланированные встречи'))
    });

    return <Box>
        <Toolbar/>
        <LoadRecordsProgress loading={loading} empty={meetings.length === 0}/>
        <List> {meetings.map(r =>
            <MeetingListItem key={r.id} equity={r.at} person={r.scheduledBy} selected={selectedMeeting?.id === r.id} schedule={r.schedule}
                             onClick={(e) => {
                                 dispatch(selectMeeting(r));
                             }}/>)}
        </List>
    </Box>
}