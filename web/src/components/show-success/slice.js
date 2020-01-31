import {createSlice} from "@reduxjs/toolkit";

const slice = createSlice({
    name: 'success',
    initialState: {show: false, text:''},
    reducers: {
        showSuccess: (state, { payload }) => {
            state.show = true;
            state.text = payload
        },
        hideSuccess: state => {
            state.show = false;
            state.text = ''
        },
    }
});

export const { showSuccess, hideSuccess } = slice.actions;
export default slice.reducer
