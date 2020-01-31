import {createSlice} from "@reduxjs/toolkit";
import {showError} from "../show-error/slice"
import DirectoryAPI from "../../api/DirectoryAPI";

const slice = createSlice({
    name: 'select-subways',
    initialState: {
        subways: [],
    },
    reducers: {
        setSubways: (state, {payload}) => {
            state.subways = payload
        },
    }
});

export default slice.reducer

export const loadSubways = (city) => async dispatch => {
    const {setSubways} = slice.actions;
    try {
        dispatch(setSubways(await DirectoryAPI.fetchSubways(city)))
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};

