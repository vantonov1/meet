import {createSlice} from "@reduxjs/toolkit";
import {show} from "../show-error/slice"
import DirectoryAPI from "../../api/DirectoryAPI";

const slice = createSlice({
    name: 'select-subways',
    initialState: {
        subways: [],
    },
    reducers: {
        showSubwaysSelector: state => {
            state.selectSubways = true
        },
    }
});

export default slice.reducer

export const loadSubways = (city) => async dispatch => {
    const {setSubways} = slice.actions;
    try {
        dispatch(setSubways(await DirectoryAPI.fetchSubways(city)))
    } catch (reason) {
        dispatch(show(reason.message))
    }
};

