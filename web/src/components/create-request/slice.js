import {createSlice} from "@reduxjs/toolkit";
import RequestAPI from "../../api/RequestAPI";
import {showError} from "../show-error/slice"
import {updateRequests} from "../browse-my-requests/slice";

const slice = createSlice({
    name: 'create-request',
    initialState: {
        open: false,
        name: '',
        contacts: [],
        agent: null
    },
    reducers: {
        showCreateRequest: (state, {payload}) => {
            state.open = payload
        },
        setName: (state, {payload}) => {
            state.name = payload
        },
        setContacts: (state, {payload}) => {
            state.contacts = payload
        },
        showAgent: (state, {payload}) => {
            state.agent = payload
        },
    }
});

export default slice.reducer
export const {showCreateRequest, setName, setContacts, showAgent} = slice.actions;

export const saveRequest = (name, contacts) => async (dispatch, getState) => {
    const {showAgent} = slice.actions;
    const {filter} = getState().browseEquities;
    try {
        const customer = {name: name, contacts: contacts, city: filter.city};
        const request = {type: 'SELL', issuedBy: customer};
        let saved = await RequestAPI.createRequest(request);
        localStorage.setItem("customerId", saved.issuedBy?.id);
        dispatch(showAgent(saved.assignedTo));
        dispatch(updateRequests())
        // dispatch(setCustomerId(saved.issuedBy?.id));
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};

