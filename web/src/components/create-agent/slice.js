import {createSlice} from "@reduxjs/toolkit";
import AgentAPI from "../../api/AgentAPI";
import {showError} from "../show-error/slice"
import AdminAPI from "../../api/AdminAPI";

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

export const registerAgent = (name, contacts) => async (dispatch, getState) => {
    try {
        let invitation = window.location.search.replace("\?invitation=", "");
        await AdminAPI.register(invitation);
        let agentId = await AgentAPI.register(invitation,{name: name, contacts: contacts, city: 2});
        localStorage.setItem("agentId", agentId);
        window.location.href = window.location.origin + '/assigned-requests'
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};

