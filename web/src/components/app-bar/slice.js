import {createSlice} from "@reduxjs/toolkit";
import AgentAPI from "../../api/AgentAPI";
import {showError} from "../show-error/slice";
import {getAgentId} from "../../api/FirebaseAPI";

const slice = createSlice({
    name: 'app-bar',
    initialState: {
        title: '',
        agent: null
    },
    reducers: {
        setAppTitle: (state, {payload}) => {
            state.title = payload
        },
        setAgent: (state, {payload}) => {
            state.agent = payload
        },
    }
});

export default slice.reducer
export const {setAppTitle} = slice.actions;

export const loadAgent = () => async dispatch => {
    const {setAgent} = slice.actions;
    try {
        dispatch(setAgent(await AgentAPI.loadAgent(getAgentId())));
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};

export const setActive = (active) => async dispatch => {
    const {setAgent} = slice.actions;
    try {
        await AgentAPI.setActive(getAgentId(), active);
        dispatch(setAgent({active: active}));
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};