import {createSlice} from "@reduxjs/toolkit";
import {showError} from "../show-error/slice"
import RequestAPI from "../../api/RequestAPI";

const slice = createSlice({
    name: 'browse-assigned-equities',
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
        selectRequest: (state, {payload}) => {
            state.selectedRequest = payload
        },
        unselectRequest: (state) => {
            state.selectedRequest = null
        },
    }
});

export default slice.reducer
export const {selectRequest, unselectRequest} = slice.actions;

export const loadRequests = () => async (dispatch, getState) => {
    const {setRequests, startLoading, finishLoading} = slice.actions;
    const {loading, loadFinished} = getState().browseAssignedRequests;
    const agentId = localStorage.getItem("agentId");
    if (!loading && !loadFinished && agentId) {
        dispatch(startLoading());
        try {
            dispatch(setRequests(await RequestAPI.findRequests(null, agentId)));
        } catch (reason) {
            dispatch(showError(reason.message))
        } finally {
            dispatch(finishLoading())
        }
    }
};