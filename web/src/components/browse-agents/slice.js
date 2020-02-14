import {createSlice} from "@reduxjs/toolkit";
import {showError} from "../show-error/slice"
import AgentAPI from "../../api/AgentAPI";

const slice = createSlice({
    name: 'browse-agents',
    initialState: {
        records: [],
        loading: false,
        loadFinished: false,
        selected: null,
        invitation: null
    },
    reducers: {
        setAgents: (state, {payload}) => {
            state.records = payload
        },
        setInvitation: (state, {payload}) => {
            state.invitation = payload
        },
        startLoading: state => {
            state.loading = true;
            state.selected = null
        },
        finishLoading: state => {
            state.loading = false;
            state.loadFinished = true;
        },
        updateAgents: state => {
            state.loadFinished = false;
        },
        selectAgent: (state, {payload}) => {
            state.selected = payload
        },
        unselectAgent: (state) => {
            state.selected = null
        },
    }
});

export default slice.reducer
export const {selectAgent, unselectAgent, updateAgents, setInvitation} = slice.actions;

export const inviteAdmin = (email) => async dispatch => {
    try {
        let invited = await AgentAPI.invite(email);
        dispatch(setInvitation(invited.invitation));
        // dispatch(showSuccess('Приглашение отправлено'))
    } catch (reason) {
        dispatch(showError(reason.message));
    } finally {
    }
};

export const loadAgents = () => async dispatch => {
    const {setAgents, startLoading, finishLoading} = slice.actions;
    dispatch(startLoading());
    try {
        dispatch(setAgents(await AgentAPI.loadAgents()));
    } catch (reason) {
        dispatch(showError(reason.message))
    } finally {
        dispatch(finishLoading())
    }
};