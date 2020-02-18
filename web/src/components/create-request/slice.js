import {createSlice} from "@reduxjs/toolkit";
import {showError} from "../show-error/slice"
import {updateRequests} from "../browse-my-requests/slice";
import RequestPublicAPI from "../../api/RequestPublicAPI";

const slice = createSlice({
    name: 'create-request',
    initialState: {
        open: false,
        name: '',
        contacts: [],
        about: null,
        agent: null,
        customerId: null
    },
    reducers: {
        showCreateRequest: (state, {payload}) => {
            state.open = payload;
            state.customerId = localStorage.getItem("customerId")
        },
        setAbout: (state, {payload}) => {
            state.about = payload
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
export const {showCreateRequest, setAbout, setName, setContacts, showAgent} = slice.actions;

export const saveRequest = (name, contacts) => async (dispatch, getState) => {
    const {showAgent} = slice.actions;
    const {filter} = getState().browseEquities;
    const {about} = getState().createRequest;
    try {
        const customer = {name: name, contacts: contacts, city: filter.city};
        const request = {type: about ? 'BUY' : 'SELL', issuedBy: customer, about: about};
        let saved = await RequestPublicAPI.createRequest(request);
        localStorage.setItem("customerId", saved.issuedBy?.id);
        dispatch(showAgent(saved.assignedTo));
        dispatch(updateRequests())
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};


export const saveRequestFromKnownCustomer = (customerId) => async (dispatch, getState) => {
    const {showAgent} = slice.actions;
    const {about} = getState().createRequest;
    try {
        const request = {type: about ? 'BUY' : 'SELL', about: about};
        let saved = await RequestPublicAPI.saveRequestFromKnownCustomer(request, customerId);
        dispatch(showAgent(saved.assignedTo));
        dispatch(updateRequests())
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};

