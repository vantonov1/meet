import {createSlice} from "@reduxjs/toolkit";
import {showError} from "../show-error/slice"
import MeetingAPI from "../../api/MeetingAPI";
import {showSuccess} from "../show-success/slice";
import {updateMeetings} from "../browse-assigned-meetings/slice";

const slice = createSlice({
    name: 'reschedule-meeting',
    initialState: {
        open: false,
        date: null,
    },
    reducers: {
        showRescheduleMeeting: (state, {payload}) => {
            state.open = payload
        },
        setDate: (state, {payload}) => {
            state.date = payload
        },
    }
});

export default slice.reducer
export const {showRescheduleMeeting, setDate} = slice.actions;

export const saveMeeting = (meeting, date) => async dispatch => {
    try {
        await MeetingAPI.rescheduleMeeting(meeting.id, date);
        dispatch(showRescheduleMeeting(false));
        dispatch(showSuccess('Встреча перенесена'));
        dispatch(updateMeetings())
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};

