import {createSlice} from "@reduxjs/toolkit";
import {showError} from "../show-error/slice"
import AdminAPI from "../../api/AdminAPI";

const slice = createSlice({
    name: 'browse-admin',
    initialState: {
        records: [],
        loading: false,
        loadFinished: false,
        selected: null,
        invitation: null
    },
    reducers: {
        setAdmins: (state, {payload}) => {
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
        updateAdmins: state => {
            state.loadFinished = false;
        },
        selectAdmin: (state, {payload}) => {
            state.selected = payload
        },
        unselectAdmin: (state) => {
            state.selected = null
        },
    }
});

export default slice.reducer
export const {selectAdmin, unselectAdmin, updateAdmins, setInvitation} = slice.actions;

export const inviteAdmin = (email) => async dispatch => {
    try {
        let invited = await AdminAPI.invite(email);
        dispatch(setInvitation(invited.invitation));
        // dispatch(showSuccess('Приглашение отправлено'))
    } catch (reason) {
        dispatch(showError(reason.message));
    } finally {
    }
};

export const loadAdmins = () => async dispatch => {
    const {setAdmins, startLoading, finishLoading} = slice.actions;
        dispatch(startLoading());
        try {
            dispatch(setAdmins(await AdminAPI.loadAdmin()));
        } catch (reason) {
            dispatch(showError(reason.message))
        } finally {
            dispatch(finishLoading())
        }
};