import {createSlice} from "@reduxjs/toolkit";
import RequestAPI from "../../api/RequestAPI";
import {showError} from "../show-error/slice"

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
        dispatch(showAgent(saved.assignedTo));
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};

