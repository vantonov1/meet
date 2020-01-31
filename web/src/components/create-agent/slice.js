import {createSlice} from "@reduxjs/toolkit";
import {show} from "../show-error/slice"
import AgentAPI from "../../api/AgentAPI";

const slice = createSlice({
    name: 'create-agent',
    initialState: {
        name: '',
        contacts: [],
        saveFinished: false
    },
    reducers: {
        setName: (state, {payload}) => {
            state.name = payload
        },
        setContacts: (state, {payload}) => {
            state.contacts = payload
        },
       setSaveFinished: (state, {payload}) => {
            state.saveFinished = payload
        },
    }
});

export default slice.reducer
export const {setName, setContacts, setSaveFinished} = slice.actions;

export const saveAgent = (name, contacts) => async (dispatch, getState) => {
    const {filter} = getState().browseEquities;
    try {
        const agent = {name: name, contacts: contacts, city: filter.city};
        let saved = await AgentAPI.createAgent(agent);
        dispatch(setSaveFinished(true))
    } catch (reason) {
        dispatch(show(reason.message))
    }
};

