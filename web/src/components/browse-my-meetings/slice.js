import {createSlice} from "@reduxjs/toolkit";
import {showError} from "../show-error/slice"
import MeetingAPI from "../../api/MeetingAPI";
import formatISO from 'date-fns/formatISO'
import addDays from 'date-fns/addDays'

const slice = createSlice({
    name: 'browse-my-meetings',
    initialState: {
        meetings: [],
        loading: false,
        loadFinished: false,
        selectedMeeting: null
    },
    reducers: {
        setMeetings: (state, {payload}) => {
            state.meetings = payload
        },
        startLoading: state => {
            state.loading = true;
            state.selectedMeetings = null
        },
        finishLoading: state => {
            state.loading = false;
            state.loadFinished = true;
        },
        updateRequests: state => {
            state.loadFinished = false;
        },
        selectMeeting: (state, {payload}) => {
            state.selectedMeetings = payload
        },
        unselectMeeting: (state) => {
            state.selectedMeetings = null
        },
    }
});

export default slice.reducer
export const {selectMeeting, unselectMeeting, updateMeetings} = slice.actions;

export const deleteMeeting = (request) => async dispatch => {
    try {
        await MeetingAPI.deleteMeeting(request.id);
        dispatch(unselectMeeting());
        dispatch(updateMeetings())
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