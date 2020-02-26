import {createSlice} from "@reduxjs/toolkit";
import {showError} from "../show-error/slice";
import TimeSlotAPI from "../../api/TimeslotAPI";
import {showSuccess} from "../show-success/slice";


const slice = createSlice({
    name: 'edit-timeslots',
    initialState: {
        open: false,
        records: [],
        timeSlot: {dayOfWeek: 'пн', minTime: '09:00', maxTime: '18:00'},
    },
    reducers: {
        showEditTimeSlots: (state, {payload}) => {
            state.open = payload
        },
        setTimeSlots: (state, {payload}) => {
            state.records = payload
        },
        setTimeSlot: (state, {payload}) => {
            state.timeSlot = payload
        },
        addTimeSlot: (state, {payload}) => {
            state.records.push(payload)
        },
    }
});

export default slice.reducer
export const {showEditTimeSlots, setTimeSlot, addTimeSlot} = slice.actions;

export const loadTimeSlots = request => async dispatch => {
    const {setTimeSlots} = slice.actions;
    try {
        dispatch(setTimeSlots(await TimeSlotAPI.loadTimeSlots(request.id)));
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};

export const saveTimeSlots = (records, request) => async dispatch => {
    try {
        await TimeSlotAPI.createTimeSlots(records, request.id);
        dispatch(showEditTimeSlots(false));
        dispatch(showSuccess("Расписание сохранено"))
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};