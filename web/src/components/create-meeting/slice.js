import {createSlice} from "@reduxjs/toolkit";
import {showError} from "../show-error/slice"
import MeetingAPI from "../../api/MeetingAPI";
import {showSuccess} from "../show-success/slice";
import TimeslotAPI from "../../api/TimeslotAPI";

const slice = createSlice({
    name: 'create-meeting',
    initialState: {
        open: false,
        date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        comment: '',
        timeTable: []
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
        setTimeTable: (state, {payload}) => {
            state.timeTable = payload
        },
    }
});

export default slice.reducer
export const {showCreateMeeting, setDate, setComment} = slice.actions;

export const collectTimeTable = (request) => async dispatch => {
    const {setTimeTable} = slice.actions;
    try {
        dispatch(setTimeTable(await TimeslotAPI.collectTimeTable(request.assignedTo.id, request.buyer.id, request.seller.id)));
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};

export const saveMeeting = (request, date, comment) => async dispatch => {
    try {
        const meeting = {
            fromRequest: request.buyId,
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

