import {createSlice} from "@reduxjs/toolkit";
import {showError} from "../show-error/slice"
import RequestAPI from "../../api/RequestAPI";

const slice = createSlice({
    name: 'browse-equities',
    initialState: {
        requests: [],
        loading: false,
        loadFinished: false,
        selectedRequest: null
    },
    reducers: {
        setRequests: (state, {payload}) => {
            state.requests = payload
        },
        startLoading: state => {
            state.loading = true;
            state.selectedRequest = null
        },
        finishLoading: state => {
            state.loading = false;
            state.loadFinished = true;
        },
        updateRequests: state => {
            state.loadFinished = false;
        },
        selectRequest: (state, {payload}) => {
            state.selectedRequest = payload
        },
        unselectRequest: (state) => {
            state.selectedRequest = null
        },
    }
});

export default slice.reducer
export const {selectRequest, unselectRequest, updateRequests} = slice.actions;

export const deleteRequest = (request) => async dispatch => {
    try {
        await RequestAPI.deleteRequest(request.id);
        dispatch(unselectRequest());
        dispatch(updateRequests())
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};

export const loadRequests = () => async dispatch => {
    const {setRequests, startLoading, finishLoading} = slice.actions;
    const customerId = localStorage.getItem("customerId");
    if (customerId) {
        dispatch(startLoading());
        try {
            dispatch(setRequests(await RequestAPI.findRequests(customerId)));
        } catch (reason) {
            dispatch(showError(reason.message))
        } finally {
            dispatch(finishLoading())
        }
    }
};