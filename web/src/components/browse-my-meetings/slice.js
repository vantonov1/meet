import {createSlice} from "@reduxjs/toolkit";
import {showError} from "../show-error/slice"
import MeetingAPI from "../../api/MeetingAPI";
import formatISO from 'date-fns/formatISO'
import addDays from 'date-fns/addDays'
import {showSuccess} from "../show-success/slice";

const slice = createSlice({
    name: 'browse-my-meetings',
    initialState: {
        records: [],
        loading: false,
        loadFinished: false,
        selected: null
    },
    reducers: {
        setMeetings: (state, {payload}) => {
            state.records = payload
        },
        startLoading: state => {
            state.loading = true;
            state.selected = null
        },
        finishLoading: state => {
            state.loading = false;
            state.loadFinished = true;
        },
        updateMeetings: state => {
            state.loadFinished = false;
        },
        selectMeeting: (state, {payload}) => {
            state.selected = payload
        },
        unselectMeeting: (state) => {
            state.selected = null
        },
    }
});

export default slice.reducer
export const {selectMeeting, unselectMeeting, updateMeetings} = slice.actions;

export const acknowledgedByAttendee = (meeting) => async dispatch => {
    try {
        const customerId = localStorage.getItem("customerId");
        await MeetingAPI.acknowledgedByAttendee(meeting.id, customerId);
        dispatch(updateMeetings());
        dispatch(showSuccess("Встреча подтверждена"))
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};

export const loadMeetings = () => async dispatch => {
    const {setMeetings, startLoading, finishLoading} = slice.actions;
    const customerId = localStorage.getItem("customerId");
    if (customerId) {
        dispatch(startLoading());
        try {
            let today = Date.now();
            let week = addDays(today, 7);
            dispatch(setMeetings(await MeetingAPI.findMeetings(customerId, null, formatISO(today), formatISO(week))));
        } catch (reason) {
            dispatch(showError(reason.message))
        } finally {
            dispatch(finishLoading())
        }
    }
};