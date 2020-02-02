import {createSlice} from "@reduxjs/toolkit";
import {showError} from "../show-error/slice"
import MeetingAPI from "../../api/MeetingAPI";
import {showSuccess} from "../show-success/slice";

const slice = createSlice({
    name: 'create-meeting',
    initialState: {
        open: false,
        date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        comment: ''
    },
    reducers: {
        showCreateMeeting: (state, {payload}) => {
            state.open = payload
        },
        setDate: (state, {payload}) => {
            state.date = payload
        },
        setComment: (state, {payload}) => {
            state.comment = payload
        },
    }
});

export default slice.reducer
export const {showCreateMeeting, setDate, setComment} = slice.actions;

export const saveMeeting = (request, date, comment) => async dispatch => {
    try {
        const meeting = {
            at: request.about,
            scheduledBy: request.assignedTo,
            attends: request.buyer,
            schedule: date,
            comment: comment
        };
        await MeetingAPI.createMeeting(meeting);
        dispatch(showCreateMeeting(false));
        dispatch(showSuccess('Встреча запланирована'))
        // dispatch(updateMeetings())
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};

