import {createSlice} from "@reduxjs/toolkit";
import AgentAPI from "../../api/AgentAPI";
import {showError} from "../show-error/slice"
import {getInvitation} from "../register-admin/view";
import {loadAgent} from "../app-bar/slice";

const slice = createSlice({
    name: 'create-agent',
    initialState: {
        name: '',
        contacts: [],
    },
    reducers: {
        setName: (state, {payload}) => {
            state.name = payload
        },
        setContacts: (state, {payload}) => {
            state.contacts = payload
        },
    }
});

export default slice.reducer
export const {setName, setContacts} = slice.actions;

export const registerAgent = (name, contacts) => async dispatch => {
    try {
        let invitation = getInvitation();
        let agentId = await AgentAPI.register(invitation,{name: name, contacts: contacts, city: 2});
        dispatch(loadAgent());
        window.location.href = window.location.origin + '/#/assigned-requests'
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};

