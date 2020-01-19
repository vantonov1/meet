import {createSlice} from "@reduxjs/toolkit";

const slice = createSlice({
    name: 'error',
    initialState: {show: false, reason:''},
    reducers: {
        show: (state, { payload }) => {
            state.show = true;
            state.reason = payload
        },
        hide: state => {
            state.show = false;
            state.reason = ''
        },
    }
});

export const { show, hide } = slice.actions;
export default slice.reducer
