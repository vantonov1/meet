import {createSlice} from "@reduxjs/toolkit";

const slice = createSlice({
    name: 'app-bar',
    initialState: {
        title: ''
    },
    reducers: {
        setAppTitle: (state, {payload}) => {
            state.title = payload
        },
    }
});

export default slice.reducer
export const {setAppTitle} = slice.actions;
