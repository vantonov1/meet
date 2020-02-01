import {createSlice} from "@reduxjs/toolkit";
import AgentAPI from "../../api/AgentAPI";
import {showError} from "../show-error/slice"
import {showSuccess} from "../show-success/slice";

const slice = createSlice({
    name: 'create-agent',
    initialState: {
        open: false,
        name: '',
        contacts: [],
        saveFinished: false
    },
    reducers: {
        showCreateAgent: (state, {payload}) => {
            state.open = payload
        },
        setName: (state, {payload}) => {
            state.name = payload
        },
        setContacts: (state, {payload}) => {
            state.contacts = payload
        },
    }
});

export default slice.reducer
export const {setName, setContacts, showCreateAgent} = slice.actions;

export const saveAgent = (name, contacts) => async (dispatch, getState) => {
    const {filter} = getState().browseEquities;
    try {
        let agentId = await AgentAPI.createAgent({name: name, contacts: contacts, city: filter.city});
        localStorage.setItem("agentId", agentId);
        dispatch(showCreateAgent(false));
        dispatch(showSuccess('Агент добавлен'))
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};

