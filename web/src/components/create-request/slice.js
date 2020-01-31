import {createSlice} from "@reduxjs/toolkit";
import {show} from "../show-error/slice"
import RequestAPI from "../../api/RequestAPI";

const slice = createSlice({
    name: 'create-request',
    initialState: {
        name: '',
        contacts: [],
        contactType: 'PHONE',
        contact: '',
        agent: null
    },
    reducers: {
        setName: (state, {payload}) => {
            state.name = payload
        },
        setContacts: (state, {payload}) => {
            state.contacts = payload
        },
        setContactType: (state, {payload}) => {
            state.contactType = payload
        },
        setContact: (state, {payload}) => {
            state.contact = payload
        },
        showAgent: (state, {payload}) => {
            state.agent = payload
        },
    }
});

export default slice.reducer
export const {setName, setContacts, setContactType, setContact, showAgent} = slice.actions;

export const saveRequest = (name, contacts) => async (dispatch, getState) => {
    const {showAgent} = slice.actions;
    const {filter} = getState().browseEquities;
    try {
        const customer = {name: name, contacts: contacts, city: filter.city};
        const request = {type: 'SELL', issuedBy: customer};
        let saved = await RequestAPI.createRequest(request);
        dispatch(showAgent(saved.assignedTo))
    } catch (reason) {
        dispatch(show(reason.message))
    }
};

