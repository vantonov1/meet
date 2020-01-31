import {createSlice} from "@reduxjs/toolkit";

const slice = createSlice({
    name: 'error',
    initialState: {show: false, reason:''},
    reducers: {
        showError: (state, { payload }) => {
            state.show = true;
            state.reason = payload
        },
        hideError: state => {
            state.show = false;
            state.reason = ''
        },
    }
});

export const { showError, hideError } = slice.actions;
export default slice.reducer
