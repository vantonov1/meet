import {createSlice} from "@reduxjs/toolkit";

const slice = createSlice({
    name: 'error',
    initialState: {show: false, reason: '', needAuth: false},
    reducers: {
        showError: (state, {payload}) => {
            if ([401, 403].includes(payload)) {
                state.needAuth = true;
            } else {
                state.show = true;
                state.reason = payload
            }
        },
        hideError: state => {
            state.show = false;
            state.reason = ''
        },
    }
});

export const {showError, hideError} = slice.actions;
export default slice.reducer
